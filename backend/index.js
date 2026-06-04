// Lambda handler for the student tracker API
//
// Every request is authenticated by Cognito at API Gateway. The Lambda extracts
// the caller's email from the JWT claims and enforces that they belong to the
// classroom they're trying to act on.
//
// Top-level routes:
//   GET    /classrooms                                 -> list classrooms I'm a member of
//   POST   /classrooms                                 -> create a classroom (I become owner)
//
// Roles: 'owner' and 'member'. The user who creates a classroom is its owner.
// Owner-only:    rename/delete classroom, invite/remove members, delete school year.
// Member+owner:  manage students, grant/revoke points (single + bulk), start/end
//                school year, view archives, upload photos.
//
// Per-classroom routes (caller must be a member):
//   GET    /classrooms/{cid}                           -> details + my role
//   PATCH  /classrooms/{cid}                           -> rename (owner only)
//   DELETE /classrooms/{cid}                           -> delete (owner only)
//
//   GET    /classrooms/{cid}/members                   -> list members
//   POST   /classrooms/{cid}/members                   -> invite by email (owner only)
//   DELETE /classrooms/{cid}/members/{email}           -> remove (owner only)
//
//   GET    /classrooms/{cid}/students                  -> list students (?year= for archive)
//   POST   /classrooms/{cid}/students                  -> create student
//   GET    /classrooms/{cid}/students/{sid}            -> student with history (?year=)
//   PATCH  /classrooms/{cid}/students/{sid}            -> update
//   DELETE /classrooms/{cid}/students/{sid}            -> delete
//   POST   /classrooms/{cid}/students/{sid}/points     -> grant points (active year required)
//   GET    /classrooms/{cid}/students/{sid}/photo-upload -> presigned URL
//   DELETE /classrooms/{cid}/students/{sid}/events/{ts}  -> undo event
//   POST   /classrooms/{cid}/students/bulk-points      -> bulk grant
//
//   GET    /classrooms/{cid}/school-years              -> list years + active
//   POST   /classrooms/{cid}/school-years/start        -> { label }
//   POST   /classrooms/{cid}/school-years/end          -> archive current
//
//   GET    /classrooms/{cid}/analytics/top-reasons     -> top reasons (?days=N&year=X)
//
// Data model (single-table):
//   pk = USER#<email>,      sk = MEMBERSHIP#<cid>           -> { classroomId, classroomName, role, joinedAt }
//   pk = CLASSROOM#<cid>,   sk = META                       -> { id, name, ownerEmail, createdAt }
//   pk = CLASSROOM#<cid>,   sk = MEMBER#<email>             -> { email, role, joinedAt }
//   pk = CLASSROOM#<cid>,   sk = ACTIVE_YEAR                -> { yearId, label }
//   pk = CLASSROOM#<cid>,   sk = YEAR#<yearId>              -> { yearId, label, startedAt, endedAt }
//   pk = CLASSROOM#<cid>,   sk = STUDENT_PROFILE#<sid>      -> { id, name, grade, points, photo, notes, createdAt }
//   pk = CLASSROOM#<cid>,   sk = STUDENT_EVENT#<sid>#<ts>   -> { studentId, delta, reason, timestamp, yearId }

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand,
  DeleteCommand, QueryCommand, TransactWriteCommand
} = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { randomUUID } = require('crypto');

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const TABLE = process.env.TABLE_NAME;
const PHOTO_BUCKET = process.env.PHOTO_BUCKET;

// CORS is handled by API Gateway HTTP API's CorsConfiguration; the Lambda
// shouldn't echo Access-Control-* headers itself (they'd shadow the gateway's).
const respond = (status, body) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// ===== Helpers =====

const norm = (email) => (email || '').trim().toLowerCase();

function getCallerEmail(event) {
  const claims = event.requestContext?.authorizer?.jwt?.claims || {};
  return norm(claims.email || claims['cognito:username']);
}

async function getMembership(email, classroomId) {
  const r = await ddb.send(new GetCommand({
    TableName: TABLE, Key: { pk: `USER#${email}`, sk: `MEMBERSHIP#${classroomId}` },
  }));
  return r.Item || null;
}

async function getClassroomMeta(classroomId) {
  const r = await ddb.send(new GetCommand({
    TableName: TABLE, Key: { pk: `CLASSROOM#${classroomId}`, sk: 'META' },
  }));
  return r.Item || null;
}

async function getActiveYear(classroomId) {
  const r = await ddb.send(new GetCommand({
    TableName: TABLE, Key: { pk: `CLASSROOM#${classroomId}`, sk: 'ACTIVE_YEAR' },
  }));
  return r.Item || null;
}

async function listClassroomItems(classroomId, skPrefix) {
  const r = await ddb.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: { ':pk': `CLASSROOM#${classroomId}`, ':prefix': skPrefix },
  }));
  return r.Items || [];
}

function computeStreak(positiveTimestamps) {
  if (positiveTimestamps.length === 0) return 0;
  const days = [...new Set(positiveTimestamps.map(t => t.slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let cursor;
  if (days[0] === today) cursor = today;
  else if (days[0] === yesterday) cursor = yesterday;
  else return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(new Date(cursor + 'T00:00:00Z').getTime() - 86400000).toISOString().slice(0, 10);
    if (days[i] !== prev) break;
    streak++; cursor = days[i];
  }
  return streak;
}

// ===== Handler =====

exports.handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path || event.rawPath || '';
  const query = event.queryStringParameters || {};

  if (method === 'OPTIONS') return respond(200, {});

  const callerEmail = getCallerEmail(event);
  if (!callerEmail) return respond(401, { error: 'Unauthenticated' });

  try {
    // ===== /classrooms (list + create) =====
    if (path === '/classrooms') {
      if (method === 'GET') {
        const r = await ddb.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: { ':pk': `USER#${callerEmail}`, ':prefix': 'MEMBERSHIP#' },
        }));
        return respond(200, { classrooms: r.Items || [] });
      }

      if (method === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const name = (body.name || '').trim();
        if (!name) return respond(400, { error: 'name required' });
        const id = randomUUID();
        const now = new Date().toISOString();
        await Promise.all([
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk: `CLASSROOM#${id}`, sk: 'META', id, name, ownerEmail: callerEmail, createdAt: now },
          })),
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk: `CLASSROOM#${id}`, sk: `MEMBER#${callerEmail}`, email: callerEmail, role: 'owner', joinedAt: now },
          })),
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk: `USER#${callerEmail}`, sk: `MEMBERSHIP#${id}`, classroomId: id, classroomName: name, role: 'owner', joinedAt: now },
          })),
        ]);
        return respond(201, { classroomId: id, name, role: 'owner' });
      }
    }

    // All routes below require a classroom and membership
    const cidMatch = path.match(/^\/classrooms\/([^/]+)(\/.*)?$/);
    if (!cidMatch) return respond(404, { error: 'Route not found' });

    const cid = cidMatch[1];
    const rest = cidMatch[2] || '';
    const membership = await getMembership(callerEmail, cid);
    if (!membership) return respond(403, { error: 'Not a member of this classroom' });
    const isOwner = membership.role === 'owner';

    // ===== Classroom details / rename / delete =====
    if (rest === '') {
      if (method === 'GET') {
        const meta = await getClassroomMeta(cid);
        if (!meta) return respond(404, { error: 'Classroom not found' });
        return respond(200, { ...meta, role: membership.role });
      }
      if (method === 'PATCH') {
        if (!isOwner) return respond(403, { error: 'Only the owner can rename' });
        const body = JSON.parse(event.body || '{}');
        const name = (body.name || '').trim();
        if (!name) return respond(400, { error: 'name required' });

        // Update META and every membership's classroomName cache
        const members = await listClassroomItems(cid, 'MEMBER#');
        await Promise.all([
          ddb.send(new UpdateCommand({
            TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: 'META' },
            UpdateExpression: 'SET #n = :n',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: { ':n': name },
          })),
          ...members.map(m => ddb.send(new UpdateCommand({
            TableName: TABLE, Key: { pk: `USER#${m.email}`, sk: `MEMBERSHIP#${cid}` },
            UpdateExpression: 'SET classroomName = :n',
            ExpressionAttributeValues: { ':n': name },
          }))),
        ]);
        return respond(200, { id: cid, name });
      }
      if (method === 'DELETE') {
        if (!isOwner) return respond(403, { error: 'Only the owner can delete' });
        // Wipe everything in this classroom's partition + each member's MEMBERSHIP record
        const items = await ddb.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk',
          ExpressionAttributeValues: { ':pk': `CLASSROOM#${cid}` },
        }));
        const members = (items.Items || []).filter(i => i.sk?.startsWith('MEMBER#'));
        await Promise.all([
          ...(items.Items || []).map(i => ddb.send(new DeleteCommand({
            TableName: TABLE, Key: { pk: i.pk, sk: i.sk },
          }))),
          ...members.map(m => ddb.send(new DeleteCommand({
            TableName: TABLE, Key: { pk: `USER#${m.email}`, sk: `MEMBERSHIP#${cid}` },
          }))),
        ]);
        return respond(204, {});
      }
    }

    // ===== Members =====
    if (rest === '/members') {
      if (method === 'GET') {
        const members = await listClassroomItems(cid, 'MEMBER#');
        return respond(200, { members });
      }
      if (method === 'POST') {
        if (!isOwner) return respond(403, { error: 'Only the owner can invite' });
        const body = JSON.parse(event.body || '{}');
        const email = norm(body.email);
        if (!email) return respond(400, { error: 'email required' });
        const meta = await getClassroomMeta(cid);
        const now = new Date().toISOString();
        await Promise.all([
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk: `CLASSROOM#${cid}`, sk: `MEMBER#${email}`, email, role: 'member', joinedAt: now },
          })),
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk: `USER#${email}`, sk: `MEMBERSHIP#${cid}`, classroomId: cid, classroomName: meta?.name || '', role: 'member', joinedAt: now },
          })),
        ]);
        return respond(201, { email, role: 'member', joinedAt: now });
      }
    }

    const memberMatch = rest.match(/^\/members\/(.+)$/);
    if (memberMatch && method === 'DELETE') {
      if (!isOwner) return respond(403, { error: 'Only the owner can remove members' });
      const email = norm(decodeURIComponent(memberMatch[1]));
      const meta = await getClassroomMeta(cid);
      if (email === meta?.ownerEmail) return respond(400, { error: 'Cannot remove the owner' });
      await Promise.all([
        ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `MEMBER#${email}` } })),
        ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk: `USER#${email}`, sk: `MEMBERSHIP#${cid}` } })),
      ]);
      return respond(204, {});
    }

    // ===== School years =====
    if (rest === '/school-years') {
      if (method === 'GET') {
        const [active, years] = await Promise.all([
          getActiveYear(cid),
          listClassroomItems(cid, 'YEAR#'),
        ]);
        years.sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
        return respond(200, { active, years });
      }
    }
    if (rest === '/school-years/start' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const label = (body.label || '').trim();
      if (!label) return respond(400, { error: 'label required' });

      const yearId = randomUUID();
      const now = new Date().toISOString();
      const prev = await getActiveYear(cid);

      if (prev?.yearId) {
        await ddb.send(new UpdateCommand({
          TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `YEAR#${prev.yearId}` },
          UpdateExpression: 'SET endedAt = :now',
          ExpressionAttributeValues: { ':now': now },
        }));
      }

      const profiles = await listClassroomItems(cid, 'STUDENT_PROFILE#');
      await Promise.all(profiles.map(p =>
        ddb.send(new UpdateCommand({
          TableName: TABLE, Key: { pk: p.pk, sk: p.sk },
          UpdateExpression: 'SET points = :z',
          ExpressionAttributeValues: { ':z': 0 },
        }))
      ));

      await Promise.all([
        ddb.send(new PutCommand({
          TableName: TABLE,
          Item: { pk: `CLASSROOM#${cid}`, sk: `YEAR#${yearId}`, yearId, label, startedAt: now, endedAt: null },
        })),
        ddb.send(new PutCommand({
          TableName: TABLE,
          Item: { pk: `CLASSROOM#${cid}`, sk: 'ACTIVE_YEAR', yearId, label },
        })),
      ]);

      return respond(201, { yearId, label, startedAt: now });
    }
    if (rest === '/school-years/end' && method === 'POST') {
      const active = await getActiveYear(cid);
      if (!active) return respond(400, { error: 'No active year' });
      const now = new Date().toISOString();
      await Promise.all([
        ddb.send(new UpdateCommand({
          TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `YEAR#${active.yearId}` },
          UpdateExpression: 'SET endedAt = :now',
          ExpressionAttributeValues: { ':now': now },
        })),
        ddb.send(new DeleteCommand({
          TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: 'ACTIVE_YEAR' },
        })),
      ]);
      return respond(200, { endedAt: now });
    }

    // DELETE /school-years/{yearId} - permanently delete a year and all its events
    const yearDeleteMatch = rest.match(/^\/school-years\/([^/]+)$/);
    if (yearDeleteMatch && method === 'DELETE') {
      if (!isOwner) return respond(403, { error: 'Only the owner can delete a school year' });
      const yearId = yearDeleteMatch[1];
      const yearMeta = await ddb.send(new GetCommand({
        TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `YEAR#${yearId}` },
      }));
      if (!yearMeta.Item) return respond(404, { error: 'Year not found' });

      const active = await getActiveYear(cid);
      const isActiveYear = active?.yearId === yearId;
      const allEvents = await listClassroomItems(cid, 'STUDENT_EVENT#');
      const yearEvents = allEvents.filter(e => e.yearId === yearId);

      // Build the full list of transactional writes:
      // - one Delete per event in the year
      // - if active: one Update per student reversing their delta sum, plus delete ACTIVE_YEAR
      // - one Delete for the YEAR meta itself
      const writes = [];
      if (isActiveYear) {
        const sumsByStudent = {};
        for (const e of yearEvents) {
          sumsByStudent[e.studentId] = (sumsByStudent[e.studentId] || 0) + (e.delta || 0);
        }
        for (const [sid, sum] of Object.entries(sumsByStudent)) {
          if (sum === 0) continue;
          writes.push({
            Update: {
              TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `STUDENT_PROFILE#${sid}` },
              UpdateExpression: 'ADD points :d',
              ConditionExpression: 'attribute_exists(pk)',
              ExpressionAttributeValues: { ':d': -sum },
            },
          });
        }
        writes.push({
          Delete: { TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: 'ACTIVE_YEAR' } },
        });
      }
      for (const e of yearEvents) {
        writes.push({
          Delete: { TableName: TABLE, Key: { pk: e.pk, sk: e.sk } },
        });
      }
      writes.push({
        Delete: { TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `YEAR#${yearId}` } },
      });

      // DynamoDB TransactWriteItems caps at 100 ops per transaction. Chunk while
      // keeping the YEAR meta delete in the LAST chunk so it commits last — if a
      // mid-batch fails, the year still has its meta and the operation can be
      // safely retried.
      const CHUNK = 100;
      for (let i = 0; i < writes.length; i += CHUNK) {
        const slice = writes.slice(i, i + CHUNK);
        await ddb.send(new TransactWriteCommand({ TransactItems: slice }));
      }
      return respond(204, {});
    }

    // ===== Students (collection) =====
    if (rest === '/students') {
      if (method === 'GET') {
        const archiveYear = query.year;
        const profiles = await listClassroomItems(cid, 'STUDENT_PROFILE#');
        const events = await listClassroomItems(cid, 'STUDENT_EVENT#');
        const positiveByStudent = {};
        const archiveByStudent = {};
        for (const e of events) {
          if (e.delta > 0) (positiveByStudent[e.studentId] ||= []).push(e.timestamp);
          if (archiveYear && e.yearId === archiveYear) {
            (archiveByStudent[e.studentId] ||= []).push(e);
          }
        }
        const students = profiles.map(p => {
          const streak = computeStreak(positiveByStudent[p.id] || []);
          if (archiveYear) {
            const yearEvents = archiveByStudent[p.id] || [];
            const points = yearEvents.reduce((sum, e) => sum + (e.delta || 0), 0);
            return { ...p, points, streak: 0, archiveYear };
          }
          return { ...p, streak };
        });
        return respond(200, { students, archiveYear: archiveYear || null });
      }
      if (method === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const id = randomUUID();
        const student = {
          pk: `CLASSROOM#${cid}`, sk: `STUDENT_PROFILE#${id}`,
          id, name: body.name || 'New student', grade: body.grade || '',
          points: 0, photo: body.photo || '', notes: body.notes || '',
          createdAt: new Date().toISOString(),
        };
        await ddb.send(new PutCommand({ TableName: TABLE, Item: student }));
        return respond(201, student);
      }
    }

    // POST /students/bulk-points - atomic per chunk of <=50 students (100 ops)
    if (rest === '/students/bulk-points' && method === 'POST') {
      const active = await getActiveYear(cid);
      if (!active) return respond(400, { error: 'No active school year' });
      const body = JSON.parse(event.body || '{}');
      const delta = parseInt(body.delta, 10);
      const ids = Array.isArray(body.ids) ? body.ids : [];
      if (isNaN(delta) || ids.length === 0) return respond(400, { error: 'delta and ids[] required' });
      const reason = body.reason || (delta > 0 ? 'Points awarded' : 'Points removed');
      const timestamp = new Date().toISOString();
      const CHUNK = 50;
      for (let i = 0; i < ids.length; i += CHUNK) {
        const chunk = ids.slice(i, i + CHUNK);
        await ddb.send(new TransactWriteCommand({
          TransactItems: chunk.flatMap(sid => ([
            {
              Update: {
                TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `STUDENT_PROFILE#${sid}` },
                UpdateExpression: 'ADD points :d',
                ConditionExpression: 'attribute_exists(pk)',
                ExpressionAttributeValues: { ':d': delta },
              },
            },
            {
              Put: {
                TableName: TABLE,
                Item: { pk: `CLASSROOM#${cid}`, sk: `STUDENT_EVENT#${sid}#${timestamp}`, studentId: sid, delta, reason, timestamp, yearId: active.yearId },
                ConditionExpression: 'attribute_not_exists(sk)',
              },
            },
          ])),
        }));
      }
      return respond(200, { count: ids.length, delta, reason, timestamp });
    }

    // Top reasons
    if (rest === '/analytics/top-reasons' && method === 'GET') {
      const days = parseInt(query.days || '30', 10);
      const yearId = query.year;
      const cutoff = new Date(Date.now() - days * 86400000).toISOString();
      const events = await listClassroomItems(cid, 'STUDENT_EVENT#');
      const counts = {};
      for (const e of events) {
        if ((e.delta || 0) <= 0) continue;
        if (e.timestamp < cutoff) continue;
        if (yearId && e.yearId !== yearId) continue;
        const r = e.reason || 'No reason';
        counts[r] = (counts[r] || 0) + 1;
      }
      const reasons = Object.entries(counts)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      return respond(200, { reasons, days, yearId: yearId || null });
    }

    // Per-student routes
    const studentMatch = rest.match(/^\/students\/([^/]+)(\/.*)?$/);
    if (studentMatch) {
      const sid = studentMatch[1];
      const sub = studentMatch[2] || '';
      const profileKey = { pk: `CLASSROOM#${cid}`, sk: `STUDENT_PROFILE#${sid}` };

      if (method === 'GET' && !sub) {
        const archiveYear = query.year;
        const profile = await ddb.send(new GetCommand({ TableName: TABLE, Key: profileKey }));
        if (!profile.Item) return respond(404, { error: 'Not found' });
        const events = await ddb.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: { ':pk': `CLASSROOM#${cid}`, ':prefix': `STUDENT_EVENT#${sid}#` },
          ScanIndexForward: false, Limit: 200,
        }));
        let history = events.Items || [];
        let payload = profile.Item;
        if (archiveYear) {
          history = history.filter(e => e.yearId === archiveYear);
          const points = history.reduce((sum, e) => sum + (e.delta || 0), 0);
          payload = { ...payload, points, archiveYear };
        }
        return respond(200, { ...payload, history });
      }

      if (method === 'PATCH' && !sub) {
        const body = JSON.parse(event.body || '{}');
        const allowed = ['name', 'grade', 'photo', 'notes'];
        const sets = [], names = {}, values = {};
        for (const k of allowed) {
          if (body[k] !== undefined) {
            sets.push(`#${k} = :${k}`); names[`#${k}`] = k; values[`:${k}`] = body[k];
          }
        }
        if (!sets.length) return respond(400, { error: 'No valid fields' });
        const result = await ddb.send(new UpdateCommand({
          TableName: TABLE, Key: profileKey,
          UpdateExpression: `SET ${sets.join(', ')}`,
          ExpressionAttributeNames: names, ExpressionAttributeValues: values,
          ReturnValues: 'ALL_NEW',
        }));
        return respond(200, result.Attributes);
      }

      if (method === 'DELETE' && !sub) {
        await ddb.send(new DeleteCommand({ TableName: TABLE, Key: profileKey }));
        return respond(204, {});
      }

      if (method === 'POST' && sub === '/points') {
        const active = await getActiveYear(cid);
        if (!active) return respond(400, { error: 'No active school year' });
        const body = JSON.parse(event.body || '{}');
        const delta = parseInt(body.delta, 10);
        if (isNaN(delta)) return respond(400, { error: 'delta required' });
        const reason = body.reason || (delta > 0 ? 'Points awarded' : 'Points removed');
        const timestamp = new Date().toISOString();
        // Atomic: profile.points increment + event record together.
        await ddb.send(new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: TABLE, Key: profileKey,
                UpdateExpression: 'ADD points :d',
                ConditionExpression: 'attribute_exists(pk)',
                ExpressionAttributeValues: { ':d': delta },
              },
            },
            {
              Put: {
                TableName: TABLE,
                Item: { pk: `CLASSROOM#${cid}`, sk: `STUDENT_EVENT#${sid}#${timestamp}`, studentId: sid, delta, reason, timestamp, yearId: active.yearId },
                ConditionExpression: 'attribute_not_exists(sk)',
              },
            },
          ],
        }));
        return respond(200, { eventTimestamp: timestamp });
      }

      if (method === 'DELETE' && sub.startsWith('/events/')) {
        const timestamp = decodeURIComponent(sub.slice('/events/'.length));
        const eventKey = { pk: `CLASSROOM#${cid}`, sk: `STUDENT_EVENT#${sid}#${timestamp}` };
        const existing = await ddb.send(new GetCommand({ TableName: TABLE, Key: eventKey }));
        if (!existing.Item) return respond(404, { error: 'Event not found' });
        const active = await getActiveYear(cid);
        const yearMatchesActive = existing.Item.yearId === active?.yearId;
        const transactItems = [
          {
            Delete: {
              TableName: TABLE, Key: eventKey,
              ConditionExpression: 'attribute_exists(sk) AND #d = :d',
              ExpressionAttributeNames: { '#d': 'delta' },
              ExpressionAttributeValues: { ':d': existing.Item.delta },
            },
          },
        ];
        if (yearMatchesActive) {
          transactItems.push({
            Update: {
              TableName: TABLE, Key: profileKey,
              UpdateExpression: 'ADD points :d',
              ConditionExpression: 'attribute_exists(pk)',
              ExpressionAttributeValues: { ':d': -existing.Item.delta },
            },
          });
        }
        await ddb.send(new TransactWriteCommand({ TransactItems: transactItems }));
        return respond(204, {});
      }

      if (method === 'GET' && sub === '/photo-upload') {
        const key = `classrooms/${cid}/students/${sid}/${Date.now()}.jpg`;
        const url = await getSignedUrl(s3, new PutObjectCommand({
          Bucket: PHOTO_BUCKET, Key: key, ContentType: 'image/jpeg',
        }), { expiresIn: 300 });
        return respond(200, { url, key, publicUrl: `https://${PHOTO_BUCKET}.s3.amazonaws.com/${key}` });
      }
    }

    return respond(404, { error: 'Route not found' });
  } catch (err) {
    console.error('Handler error:', err);
    return respond(500, { error: 'Server error', message: err.message });
  }
};
