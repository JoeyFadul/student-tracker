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
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
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

// Drain a Query across pages. DynamoDB returns up to 1MB per page; classrooms
// with thousands of events will exceed that and silently truncate without this.
async function queryAllPages(params) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const r = await ddb.send(new QueryCommand({ ...params, ExclusiveStartKey }));
    if (r.Items) items.push(...r.Items);
    ExclusiveStartKey = r.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

async function listClassroomItems(classroomId, skPrefix) {
  return queryAllPages({
    TableName: TABLE,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: { ':pk': `CLASSROOM#${classroomId}`, ':prefix': skPrefix },
  });
}

// Cross-tenant guard. A stored profile.photo is either an emoji/short string
// (no S3 key — passes through) or an S3 key. If it's an S3 key, it must live
// under this specific classroom + student namespace. Without this check, an
// authenticated user could PATCH their own student with someone else's S3
// key and the next read would presign a URL to that other tenant's photo.
function isPhotoOwnedBy(photo, cid, sid) {
  if (!photo || typeof photo !== 'string') return true;
  if (!photo.startsWith('classrooms/')) return true;
  return photo.startsWith(`classrooms/${cid}/students/${sid}/`);
}

// Convert a stored profile.photo value into something the frontend can render.
// Modern data stores just the S3 key. Legacy data may still have a full s3://
// or https:// URL — normalize to a key and presign for read. Returns the
// original value unchanged if it isn't a bucket key (e.g., for emoji avatars
// stored as a single character).
function photoKeyFromStored(value) {
  if (!value || typeof value !== 'string') return null;
  if (value.startsWith('classrooms/')) return value;
  if (value.startsWith('http')) {
    // legacy: https://<bucket>.s3.amazonaws.com/classrooms/... or .s3.us-east-1...
    const i = value.indexOf('/classrooms/');
    if (i >= 0) return value.slice(i + 1);
  }
  return null;
}

const PHOTO_PRESIGN_TTL = 60 * 60 * 8; // 8 hours covers a teaching day.

async function presignPhotoGet(key) {
  return getSignedUrl(s3, new GetObjectCommand({
    Bucket: PHOTO_BUCKET, Key: key,
    // S3 echoes this back as the Cache-Control response header. Without it,
    // S3 returns no caching hints and WKWebView/Safari fall back to weak
    // heuristic caching — coupled with the per-call signature changes, the
    // browser re-downloads every photo on every navigation. private +
    // max-age=86400 lets the browser cache for a day; immutable signals
    // that the underlying bytes never change for a given S3 key (we use a
    // random suffix per upload, so old URLs point to old bytes forever).
    ResponseCacheControl: 'private, max-age=86400, immutable',
  }), { expiresIn: PHOTO_PRESIGN_TTL });
}

// Resolve a profile's `photo` field to whatever the client should render.
// Emojis pass through. Keys/legacy URLs become short-lived presigned URLs.
async function resolvePhoto(value) {
  const key = photoKeyFromStored(value);
  if (!key) return value || '';
  return presignPhotoGet(key);
}

async function resolveProfilesPhotos(profiles) {
  return Promise.all(profiles.map(async p => ({
    ...p,
    photo: await resolvePhoto(p.photo),
  })));
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

// Exported for unit tests only — not part of the Lambda contract.
exports.computeStreak = computeStreak;

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
        const classrooms = await queryAllPages({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: { ':pk': `USER#${callerEmail}`, ':prefix': 'MEMBERSHIP#' },
        });
        return respond(200, { classrooms });
      }

      if (method === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const name = (body.name || '').trim();
        if (!name) return respond(400, { error: 'name required' });
        const id = randomUUID();
        const now = new Date().toISOString();
        // META + classroom-side owner row + user-side membership pointer, atomic
        // so a partial failure can't leave a classroom with no owner pointer.
        await ddb.send(new TransactWriteCommand({
          TransactItems: [
            { Put: {
              TableName: TABLE,
              Item: { pk: `CLASSROOM#${id}`, sk: 'META', id, name, ownerEmail: callerEmail, createdAt: now },
            } },
            { Put: {
              TableName: TABLE,
              Item: { pk: `CLASSROOM#${id}`, sk: `MEMBER#${callerEmail}`, email: callerEmail, role: 'owner', joinedAt: now },
            } },
            { Put: {
              TableName: TABLE,
              Item: { pk: `USER#${callerEmail}`, sk: `MEMBERSHIP#${id}`, classroomId: id, classroomName: name, role: 'owner', joinedAt: now },
            } },
          ],
        }));
        return respond(201, { classroomId: id, name, role: 'owner' });
      }
    }

    // DELETE /account — required for App Store submission (iOS 14.5+).
    // Wipes every classroom this user owns, removes their membership from
    // every classroom they joined as a member but don't own, then returns
    // 204. The frontend follows up with cognitoUser.deleteUser() to remove
    // the Cognito identity itself.
    if (path === '/account' && method === 'DELETE') {
      const memberships = await queryAllPages({
        TableName: TABLE,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
        ExpressionAttributeValues: { ':pk': `USER#${callerEmail}`, ':prefix': 'MEMBERSHIP#' },
      });
      const CHUNK = 100;
      for (const m of memberships) {
        const cid = m.classroomId;
        if (m.role === 'owner') {
          // Same teardown pattern the classroom DELETE handler uses.
          const items = await queryAllPages({
            TableName: TABLE,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: { ':pk': `CLASSROOM#${cid}` },
          });
          const members = items.filter(i => i.sk?.startsWith('MEMBER#'));
          const writes = [
            ...items.map(i => ({ Delete: { TableName: TABLE, Key: { pk: i.pk, sk: i.sk } } })),
            ...members.map(mem => ({ Delete: { TableName: TABLE, Key: { pk: `USER#${mem.email}`, sk: `MEMBERSHIP#${cid}` } } })),
          ];
          for (let i = 0; i < writes.length; i += CHUNK) {
            await ddb.send(new TransactWriteCommand({ TransactItems: writes.slice(i, i + CHUNK) }));
          }
        } else {
          // Member only — just detach from this classroom.
          await ddb.send(new TransactWriteCommand({
            TransactItems: [
              { Delete: { TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `MEMBER#${callerEmail}` } } },
              { Delete: { TableName: TABLE, Key: { pk: `USER#${callerEmail}`, sk: `MEMBERSHIP#${cid}` } } },
            ],
          }));
        }
      }
      return respond(204, {});
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
        // Wipe everything in this classroom's partition + each member's MEMBERSHIP
        // pointer. Chunked TransactWrites give atomicity within each batch (max
        // 100 ops). If a mid-batch fails, retrying is safe — Delete on a missing
        // key is a no-op so prior chunks won't re-fail.
        const items = await queryAllPages({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk',
          ExpressionAttributeValues: { ':pk': `CLASSROOM#${cid}` },
        });
        const members = items.filter(i => i.sk?.startsWith('MEMBER#'));
        const writes = [
          ...items.map(i => ({ Delete: { TableName: TABLE, Key: { pk: i.pk, sk: i.sk } } })),
          ...members.map(m => ({ Delete: { TableName: TABLE, Key: { pk: `USER#${m.email}`, sk: `MEMBERSHIP#${cid}` } } })),
        ];
        const CHUNK = 100;
        for (let i = 0; i < writes.length; i += CHUNK) {
          await ddb.send(new TransactWriteCommand({ TransactItems: writes.slice(i, i + CHUNK) }));
        }
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
        // Classroom-side MEMBER row + user-side MEMBERSHIP pointer, atomic.
        await ddb.send(new TransactWriteCommand({
          TransactItems: [
            { Put: {
              TableName: TABLE,
              Item: { pk: `CLASSROOM#${cid}`, sk: `MEMBER#${email}`, email, role: 'member', joinedAt: now },
            } },
            { Put: {
              TableName: TABLE,
              Item: { pk: `USER#${email}`, sk: `MEMBERSHIP#${cid}`, classroomId: cid, classroomName: meta?.name || '', role: 'member', joinedAt: now },
            } },
          ],
        }));
        return respond(201, { email, role: 'member', joinedAt: now });
      }
    }

    const memberMatch = rest.match(/^\/members\/(.+)$/);
    if (memberMatch && method === 'DELETE') {
      if (!isOwner) return respond(403, { error: 'Only the owner can remove members' });
      const email = norm(decodeURIComponent(memberMatch[1]));
      const meta = await getClassroomMeta(cid);
      if (email === meta?.ownerEmail) return respond(400, { error: 'Cannot remove the owner' });
      // Classroom-side MEMBER row + user-side MEMBERSHIP pointer removed atomically.
      await ddb.send(new TransactWriteCommand({
        TransactItems: [
          { Delete: { TableName: TABLE, Key: { pk: `CLASSROOM#${cid}`, sk: `MEMBER#${email}` } } },
          { Delete: { TableName: TABLE, Key: { pk: `USER#${email}`, sk: `MEMBERSHIP#${cid}` } } },
        ],
      }));
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
        // The three reads are independent — fan them out instead of awaiting
        // sequentially. Saves ~2 round-trips per request.
        const [profiles, events, activeYear] = await Promise.all([
          listClassroomItems(cid, 'STUDENT_PROFILE#'),
          listClassroomItems(cid, 'STUDENT_EVENT#'),
          getActiveYear(cid),
        ]);
        // Streak is a *current-year* signal — only positive events from the
        // active year count. With no active year (between end-year and
        // start-year), streak collapses to 0 for everyone.
        const activeYearId = activeYear?.yearId;
        const positiveByStudent = {};
        const archiveByStudent = {};
        for (const e of events) {
          if (e.delta > 0 && activeYearId && e.yearId === activeYearId) {
            (positiveByStudent[e.studentId] ||= []).push(e.timestamp);
          }
          if (archiveYear && e.yearId === archiveYear) {
            (archiveByStudent[e.studentId] ||= []).push(e);
          }
        }
        // Current view: hide soft-deleted students. Archive view: include
        // students who had any events in that year regardless of whether
        // they were later deleted — soft-delete preserves the profile row
        // so they remain identifiable in archives. Without the per-year
        // event gate, students added in a later year would also bleed
        // through.
        const visibleProfiles = archiveYear
          ? profiles.filter(p => (archiveByStudent[p.id] || []).length > 0)
          : profiles.filter(p => !p.deletedAt);
        const enriched = visibleProfiles.map(p => {
          const streak = computeStreak(positiveByStudent[p.id] || []);
          if (archiveYear) {
            const yearEvents = archiveByStudent[p.id] || [];
            const points = yearEvents.reduce((sum, e) => sum + (e.delta || 0), 0);
            return { ...p, points, streak: 0, archiveYear };
          }
          return { ...p, streak };
        });
        const students = await resolveProfilesPhotos(enriched);
        return respond(200, { students, archiveYear: archiveYear || null });
      }
      if (method === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const id = randomUUID();
        // A photo S3 key can't legitimately be passed at creation time —
        // the student doesn't exist yet, so any classrooms/... key would
        // necessarily belong to a different student. Emoji/default values
        // are fine.
        const rawPhoto = typeof body.photo === 'string' ? body.photo : '';
        if (rawPhoto.startsWith('classrooms/')) {
          return respond(400, { error: 'photo cannot be set during creation' });
        }
        const student = {
          pk: `CLASSROOM#${cid}`, sk: `STUDENT_PROFILE#${id}`,
          id, name: body.name || 'New student', grade: body.grade || '',
          points: 0, photo: rawPhoto, notes: body.notes || '',
          createdAt: new Date().toISOString(),
        };
        await ddb.send(new PutCommand({ TableName: TABLE, Item: student }));
        return respond(201, { ...student, photo: await resolvePhoto(student.photo) });
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
      const reason = (body.reason || (delta > 0 ? 'Points awarded' : 'Points removed')).slice(0, 50);
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
      return respond(200, { count: ids.length, delta, reason, timestamp, yearId: active.yearId });
    }

    // POST /students/bulk-revert - exact inverse of /bulk-points. Deletes the
    // STUDENT_EVENT rows we just wrote (keyed by the same timestamp) and adds
    // -delta back to each student's points, all atomic per chunk. Only reverses
    // points when the supplied yearId still matches the active year — if a
    // year flip happened between the grant and the undo, the events get
    // removed but points stay at whatever end-year reset them to.
    if (rest === '/students/bulk-revert' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const ids = Array.isArray(body.ids) ? body.ids : [];
      const delta = parseInt(body.delta, 10);
      const timestamp = body.timestamp;
      const yearId = body.yearId;
      if (!timestamp || !yearId || isNaN(delta) || ids.length === 0) {
        return respond(400, { error: 'timestamp, yearId, delta, and ids[] required' });
      }
      const active = await getActiveYear(cid);
      const reversePoints = active?.yearId === yearId;
      const CHUNK = 50;
      for (let i = 0; i < ids.length; i += CHUNK) {
        const chunk = ids.slice(i, i + CHUNK);
        await ddb.send(new TransactWriteCommand({
          TransactItems: chunk.flatMap(sid => {
            const items = [
              { Delete: {
                  TableName: TABLE,
                  Key: { pk: `CLASSROOM#${cid}`, sk: `STUDENT_EVENT#${sid}#${timestamp}` },
                  ConditionExpression: 'attribute_exists(sk) AND #d = :d',
                  ExpressionAttributeNames: { '#d': 'delta' },
                  ExpressionAttributeValues: { ':d': delta },
              } },
            ];
            if (reversePoints) {
              items.push({ Update: {
                  TableName: TABLE,
                  Key: { pk: `CLASSROOM#${cid}`, sk: `STUDENT_PROFILE#${sid}` },
                  UpdateExpression: 'ADD points :d',
                  ConditionExpression: 'attribute_exists(pk)',
                  ExpressionAttributeValues: { ':d': -delta },
              } });
            }
            return items;
          }),
        }));
      }
      return respond(204, {});
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
        // Parallel: profile + (activeYear if needed). Events get a separate
        // query below because it needs the yearId to apply a FilterExpression
        // — the 200-item full-history fetch was the bulk of payload size
        // before; 30 is plenty for the first-page render and the new
        // /activity endpoint walks the rest.
        const [profile, activeYear] = await Promise.all([
          ddb.send(new GetCommand({ TableName: TABLE, Key: profileKey })),
          archiveYear ? Promise.resolve(null) : getActiveYear(cid),
        ]);
        if (!profile.Item) return respond(404, { error: 'Not found' });

        const yearId = archiveYear || activeYear?.yearId;
        let history = [];
        let nextCursor = null;
        if (yearId) {
          const events = await ddb.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
            FilterExpression: 'yearId = :y',
            ExpressionAttributeValues: {
              ':pk': `CLASSROOM#${cid}`,
              ':prefix': `STUDENT_EVENT#${sid}#`,
              ':y': yearId,
            },
            ScanIndexForward: false,
            Limit: 30,
          }));
          history = events.Items || [];
          if (events.LastEvaluatedKey) {
            nextCursor = Buffer.from(JSON.stringify(events.LastEvaluatedKey)).toString('base64');
          }
        }

        let payload = profile.Item;
        let streak = 0;
        if (archiveYear) {
          const points = history.reduce((sum, e) => sum + (e.delta || 0), 0);
          payload = { ...payload, points, archiveYear };
        } else if (activeYear?.yearId) {
          const positives = history.filter(e => e.delta > 0).map(e => e.timestamp);
          streak = computeStreak(positives);
        }
        return respond(200, {
          ...payload,
          photo: await resolvePhoto(payload.photo),
          history,
          historyCursor: nextCursor,
          streak,
        });
      }

      // GET /students/{sid}/activity?cursor=X[&year=Y]
      // Paginated activity-only endpoint. Walks the same student STUDENT_EVENT
      // query forward via the LastEvaluatedKey returned in historyCursor.
      // FilterExpression is server-side so a chunk can come back with fewer
      // than the Limit if some scanned items don't match the year — the
      // client just requests the next page.
      if (sub === '/activity' && method === 'GET') {
        const archiveYear = query.year;
        const cursorParam = query.cursor;
        const activeYear = archiveYear ? null : await getActiveYear(cid);
        const yearId = archiveYear || activeYear?.yearId;
        if (!yearId) return respond(200, { items: [], nextCursor: null });

        const params = {
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          FilterExpression: 'yearId = :y',
          ExpressionAttributeValues: {
            ':pk': `CLASSROOM#${cid}`,
            ':prefix': `STUDENT_EVENT#${sid}#`,
            ':y': yearId,
          },
          ScanIndexForward: false,
          Limit: 30,
        };
        if (cursorParam) {
          try {
            params.ExclusiveStartKey = JSON.parse(Buffer.from(cursorParam, 'base64').toString());
          } catch {
            // Bad cursor — silently treat as first page rather than 400ing
            // the user who pulled a stale link.
          }
        }
        const r = await ddb.send(new QueryCommand(params));
        const nextCursor = r.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(r.LastEvaluatedKey)).toString('base64')
          : null;
        return respond(200, { items: r.Items || [], nextCursor });
      }

      if (method === 'PATCH' && !sub) {
        const body = JSON.parse(event.body || '{}');
        // Normalize a presigned URL or legacy public URL down to its bucket key
        // before persisting so we never store a stale/expired URL.
        if (typeof body.photo === 'string' && body.photo.startsWith('http')) {
          const key = photoKeyFromStored(body.photo);
          body.photo = key || '';
        }
        // Cross-tenant guard: reject any photo S3 key that doesn't live in
        // this specific student's namespace. Emoji values and empty strings
        // pass through. See isPhotoOwnedBy for the threat model.
        if (body.photo !== undefined && !isPhotoOwnedBy(body.photo, cid, sid)) {
          return respond(403, { error: 'photo key does not belong to this student' });
        }
        // The edit form trims client-side; enforce it here too so a raw API
        // call can't blank a student's name (client/server limits in sync).
        if (body.name !== undefined) {
          if (typeof body.name !== 'string' || !body.name.trim()) {
            return respond(400, { error: 'name must be a non-empty string' });
          }
          body.name = body.name.trim();
        }
        if (body.grade !== undefined && typeof body.grade !== 'string') {
          return respond(400, { error: 'grade must be a string' });
        }
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
        const attrs = result.Attributes || {};
        return respond(200, { ...attrs, photo: await resolvePhoto(attrs.photo) });
      }

      if (method === 'DELETE' && !sub) {
        // Soft-delete: stamp deletedAt and keep the profile row so the
        // student still surfaces in archives of years they had events in.
        // Hard-deleting the profile would orphan those events from any
        // displayable identity.
        await ddb.send(new UpdateCommand({
          TableName: TABLE, Key: profileKey,
          UpdateExpression: 'SET deletedAt = :now',
          ConditionExpression: 'attribute_exists(pk)',
          ExpressionAttributeValues: { ':now': new Date().toISOString() },
        }));
        return respond(204, {});
      }

      if (method === 'POST' && sub === '/points') {
        const active = await getActiveYear(cid);
        if (!active) return respond(400, { error: 'No active school year' });
        const body = JSON.parse(event.body || '{}');
        const delta = parseInt(body.delta, 10);
        if (isNaN(delta)) return respond(400, { error: 'delta required' });
        // 50-char cap so the activity row stays one line. Mirror this on the
        // bulk endpoint below.
        const reason = (body.reason || (delta > 0 ? 'Points awarded' : 'Points removed')).slice(0, 50);
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
        // yearId travels back so the client can append the new event to its
        // local history without a follow-up GET /students/{id}.
        return respond(200, { eventTimestamp: timestamp, reason, yearId: active.yearId });
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
        // Verify the student exists in this classroom before signing — without
        // this, an authenticated user could land presigned upload URLs at any
        // S3 key they could guess in this classroom's namespace.
        const profile = await ddb.send(new GetCommand({ TableName: TABLE, Key: profileKey }));
        if (!profile.Item) return respond(404, { error: 'Student not found' });
        // Random suffix instead of Date.now() so the key isn't predictable.
        const key = `classrooms/${cid}/students/${sid}/${randomUUID()}.jpg`;
        const url = await getSignedUrl(s3, new PutObjectCommand({
          Bucket: PHOTO_BUCKET, Key: key, ContentType: 'image/jpeg',
        }), { expiresIn: 300 });
        return respond(200, { url, key });
      }
    }

    return respond(404, { error: 'Route not found' });
  } catch (err) {
    // Log full error server-side; never echo err.message to the client —
    // DynamoDB/SDK exceptions can leak table names, item keys, and other
    // implementation details. requestId is enough for support to find this
    // log entry in CloudWatch.
    const requestId = event.requestContext?.requestId;
    console.error('Handler error:', { requestId, err });
    return respond(500, { error: 'Server error', requestId });
  }
};
