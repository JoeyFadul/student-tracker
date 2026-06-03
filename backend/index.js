// Lambda handler for the student tracker API
//
// Routes:
//   GET    /students                      -> list students (current year by default; ?year=X for archive)
//   POST   /students                      -> create a student
//   GET    /students/{id}                 -> get one student with history (?year=X for archive)
//   PATCH  /students/{id}                 -> update name, grade, photo, notes
//   DELETE /students/{id}                 -> delete a student
//   POST   /students/{id}/points          -> grant/revoke points { delta, reason } (active year required)
//   GET    /students/{id}/photo-upload    -> presigned S3 URL for photo upload
//   DELETE /students/{id}/events/{ts}     -> remove event, reverse its delta
//   POST   /students/bulk-points          -> grant points to many students at once
//   GET    /analytics/top-reasons         -> aggregate top reasons (?year=X to scope)
//   GET    /school-years                  -> list all years + active pointer
//   POST   /school-years/start            -> { label } end current, reset points, create+activate new
//   POST   /school-years/end              -> end the active year (no new tracking until start)

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand,
  DeleteCommand, QueryCommand, ScanCommand
} = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { randomUUID } = require('crypto');

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const TABLE = process.env.TABLE_NAME;
const PHOTO_BUCKET = process.env.PHOTO_BUCKET;

const respond = (status, body) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  },
  body: JSON.stringify(body),
});

// Data model in DynamoDB (single-table):
//   pk = META,         sk = ACTIVE_YEAR     -> { yearId, label }  (absent when no active year)
//   pk = YEAR#<id>,    sk = META            -> { yearId, label, startedAt, endedAt | null }
//   pk = STUDENT#<id>, sk = PROFILE         -> { id, name, grade, points, photo, notes, createdAt }
//                                              points is *current year* only; resets to 0 when a new year starts
//   pk = STUDENT#<id>, sk = EVENT#<ts>      -> { delta, reason, timestamp, yearId }

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

async function getActiveYear() {
  const result = await ddb.send(new GetCommand({
    TableName: TABLE, Key: { pk: 'META', sk: 'ACTIVE_YEAR' },
  }));
  return result.Item || null;
}

async function listAllYears() {
  const result = await ddb.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: 'sk = :sk AND begins_with(pk, :prefix)',
    ExpressionAttributeValues: { ':sk': 'META', ':prefix': 'YEAR#' },
  }));
  return (result.Items || []).sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
}

exports.handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path || event.rawPath || '';
  const query = event.queryStringParameters || {};

  if (method === 'OPTIONS') return respond(200, {});

  try {
    // ===== School year management =====

    // GET /school-years
    if (method === 'GET' && path === '/school-years') {
      const [active, years] = await Promise.all([getActiveYear(), listAllYears()]);
      return respond(200, { active, years });
    }

    // POST /school-years/start  -> { label }
    if (method === 'POST' && path === '/school-years/start') {
      const body = JSON.parse(event.body || '{}');
      const label = (body.label || '').trim();
      if (!label) return respond(400, { error: 'label required' });

      const yearId = randomUUID();
      const now = new Date().toISOString();
      const prev = await getActiveYear();

      // End the previous active year, if any
      if (prev?.yearId) {
        await ddb.send(new UpdateCommand({
          TableName: TABLE, Key: { pk: `YEAR#${prev.yearId}`, sk: 'META' },
          UpdateExpression: 'SET endedAt = :now',
          ExpressionAttributeValues: { ':now': now },
        }));
      }

      // Reset every student's current-year points to 0
      const studentsScan = await ddb.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: 'sk = :sk',
        ExpressionAttributeValues: { ':sk': 'PROFILE' },
      }));
      await Promise.all((studentsScan.Items || []).map(s =>
        ddb.send(new UpdateCommand({
          TableName: TABLE, Key: { pk: s.pk, sk: 'PROFILE' },
          UpdateExpression: 'SET points = :z',
          ExpressionAttributeValues: { ':z': 0 },
        }))
      ));

      // Create the new year and point ACTIVE_YEAR at it
      await Promise.all([
        ddb.send(new PutCommand({
          TableName: TABLE,
          Item: { pk: `YEAR#${yearId}`, sk: 'META', yearId, label, startedAt: now, endedAt: null },
        })),
        ddb.send(new PutCommand({
          TableName: TABLE,
          Item: { pk: 'META', sk: 'ACTIVE_YEAR', yearId, label },
        })),
      ]);

      return respond(201, { yearId, label, startedAt: now });
    }

    // POST /school-years/end
    if (method === 'POST' && path === '/school-years/end') {
      const active = await getActiveYear();
      if (!active) return respond(400, { error: 'No active year' });
      const now = new Date().toISOString();
      await Promise.all([
        ddb.send(new UpdateCommand({
          TableName: TABLE, Key: { pk: `YEAR#${active.yearId}`, sk: 'META' },
          UpdateExpression: 'SET endedAt = :now',
          ExpressionAttributeValues: { ':now': now },
        })),
        ddb.send(new DeleteCommand({
          TableName: TABLE, Key: { pk: 'META', sk: 'ACTIVE_YEAR' },
        })),
      ]);
      return respond(200, { endedAt: now });
    }

    // ===== Students =====

    // GET /students  - returns profiles with computed streak; ?year=X for archive
    if (method === 'GET' && path === '/students') {
      const archiveYear = query.year;
      const result = await ddb.send(new ScanCommand({ TableName: TABLE }));
      const profiles = [];
      const allEventsByStudent = {};
      const archiveEventsByStudent = {};
      for (const item of result.Items || []) {
        if (item.sk === 'PROFILE') profiles.push(item);
        else if (item.sk?.startsWith('EVENT#')) {
          (allEventsByStudent[item.pk] ||= []).push(item);
          if (archiveYear && item.yearId === archiveYear) {
            (archiveEventsByStudent[item.pk] ||= []).push(item);
          }
        }
      }
      const students = profiles.map(p => {
        const positiveTs = (allEventsByStudent[p.pk] || [])
          .filter(e => e.delta > 0)
          .map(e => e.timestamp);
        const streak = computeStreak(positiveTs);
        if (archiveYear) {
          const yearEvents = archiveEventsByStudent[p.pk] || [];
          const points = yearEvents.reduce((sum, e) => sum + (e.delta || 0), 0);
          return { ...p, points, streak: 0, archiveYear };
        }
        return { ...p, streak };
      });
      return respond(200, { students, archiveYear: archiveYear || null });
    }

    // POST /students
    if (method === 'POST' && path === '/students') {
      const body = JSON.parse(event.body || '{}');
      const id = randomUUID();
      const student = {
        pk: `STUDENT#${id}`, sk: 'PROFILE',
        id, name: body.name || 'New student', grade: body.grade || '',
        points: 0, photo: body.photo || '', notes: body.notes || '',
        createdAt: new Date().toISOString(),
      };
      await ddb.send(new PutCommand({ TableName: TABLE, Item: student }));
      return respond(201, student);
    }

    // POST /students/bulk-points
    if (method === 'POST' && path === '/students/bulk-points') {
      const active = await getActiveYear();
      if (!active) return respond(400, { error: 'No active school year' });
      const body = JSON.parse(event.body || '{}');
      const delta = parseInt(body.delta, 10);
      const ids = Array.isArray(body.ids) ? body.ids : [];
      if (isNaN(delta) || ids.length === 0) {
        return respond(400, { error: 'delta and ids[] required' });
      }
      const reason = body.reason || (delta > 0 ? 'Points awarded' : 'Points removed');
      const timestamp = new Date().toISOString();
      await Promise.all(ids.flatMap(sid => {
        const spk = `STUDENT#${sid}`;
        return [
          ddb.send(new UpdateCommand({
            TableName: TABLE, Key: { pk: spk, sk: 'PROFILE' },
            UpdateExpression: 'ADD points :d',
            ConditionExpression: 'attribute_exists(pk)',
            ExpressionAttributeValues: { ':d': delta },
          })),
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk: spk, sk: `EVENT#${timestamp}`, delta, reason, timestamp, yearId: active.yearId },
          })),
        ];
      }));
      return respond(200, { count: ids.length, delta, reason, timestamp });
    }

    // GET /analytics/top-reasons?days=30&year=X
    if (method === 'GET' && path === '/analytics/top-reasons') {
      const days = parseInt(query.days || '30', 10);
      const yearId = query.year;
      const cutoff = new Date(Date.now() - days * 86400000).toISOString();
      const filters = ['begins_with(sk, :prefix)', '#ts >= :cutoff', 'delta > :zero'];
      const values = { ':prefix': 'EVENT#', ':cutoff': cutoff, ':zero': 0 };
      const names = { '#ts': 'timestamp' };
      if (yearId) {
        filters.push('yearId = :yearId');
        values[':yearId'] = yearId;
      }
      const result = await ddb.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: filters.join(' AND '),
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      }));
      const counts = {};
      for (const item of result.Items || []) {
        const reason = item.reason || 'No reason';
        counts[reason] = (counts[reason] || 0) + 1;
      }
      const reasons = Object.entries(counts)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      return respond(200, { reasons, days, yearId: yearId || null });
    }

    // Routes with {id}
    const idMatch = path.match(/^\/students\/([^/]+)(\/.*)?$/);
    if (idMatch) {
      const id = idMatch[1];
      const sub = idMatch[2] || '';
      const pk = `STUDENT#${id}`;

      // GET /students/{id}  ?year=X for archive
      if (method === 'GET' && !sub) {
        const archiveYear = query.year;
        const profile = await ddb.send(new GetCommand({
          TableName: TABLE, Key: { pk, sk: 'PROFILE' },
        }));
        if (!profile.Item) return respond(404, { error: 'Not found' });
        const events = await ddb.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: { ':pk': pk, ':prefix': 'EVENT#' },
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

      // PATCH /students/{id}
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
          TableName: TABLE, Key: { pk, sk: 'PROFILE' },
          UpdateExpression: `SET ${sets.join(', ')}`,
          ExpressionAttributeNames: names, ExpressionAttributeValues: values,
          ReturnValues: 'ALL_NEW',
        }));
        return respond(200, result.Attributes);
      }

      // DELETE /students/{id}
      if (method === 'DELETE' && !sub) {
        await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk, sk: 'PROFILE' } }));
        return respond(204, {});
      }

      // POST /students/{id}/points
      if (method === 'POST' && sub === '/points') {
        const active = await getActiveYear();
        if (!active) return respond(400, { error: 'No active school year' });
        const body = JSON.parse(event.body || '{}');
        const delta = parseInt(body.delta, 10);
        if (isNaN(delta)) return respond(400, { error: 'delta required' });
        const reason = body.reason || (delta > 0 ? 'Points awarded' : 'Points removed');
        const timestamp = new Date().toISOString();

        const [updated] = await Promise.all([
          ddb.send(new UpdateCommand({
            TableName: TABLE, Key: { pk, sk: 'PROFILE' },
            UpdateExpression: 'ADD points :d',
            ConditionExpression: 'attribute_exists(pk)',
            ExpressionAttributeValues: { ':d': delta },
            ReturnValues: 'ALL_NEW',
          })),
          ddb.send(new PutCommand({
            TableName: TABLE,
            Item: { pk, sk: `EVENT#${timestamp}`, delta, reason, timestamp, yearId: active.yearId },
          })),
        ]);
        return respond(200, { ...updated.Attributes, eventTimestamp: timestamp });
      }

      // DELETE /students/{id}/events/{timestamp}
      if (method === 'DELETE' && sub.startsWith('/events/')) {
        const timestamp = decodeURIComponent(sub.slice('/events/'.length));
        const sk = `EVENT#${timestamp}`;
        const existing = await ddb.send(new GetCommand({
          TableName: TABLE, Key: { pk, sk },
        }));
        if (!existing.Item) return respond(404, { error: 'Event not found' });
        const active = await getActiveYear();
        // Reverse points only on the profile (current year). If the event is from a
        // past year, profile.points isn't affected by it anymore, but we still remove the event.
        const ops = [ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk, sk } }))];
        if (existing.Item.yearId === active?.yearId) {
          ops.push(ddb.send(new UpdateCommand({
            TableName: TABLE, Key: { pk, sk: 'PROFILE' },
            UpdateExpression: 'ADD points :d',
            ExpressionAttributeValues: { ':d': -existing.Item.delta },
          })));
        }
        await Promise.all(ops);
        return respond(204, {});
      }

      // GET /students/{id}/photo-upload
      if (method === 'GET' && sub === '/photo-upload') {
        const key = `students/${id}/${Date.now()}.jpg`;
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
