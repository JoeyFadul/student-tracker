// Lambda handler for the student tracker API
// Single function routes all requests using API Gateway HTTP API event format
//
// Routes:
//   GET    /students                      -> list all students
//   POST   /students                      -> create a student
//   GET    /students/{id}                 -> get one student with history
//   PATCH  /students/{id}                 -> update name, notes, photo
//   DELETE /students/{id}                 -> delete a student
//   POST   /students/{id}/points          -> grant/revoke points { delta, reason }
//   GET    /students/{id}/photo-upload    -> presigned S3 URL for photo upload
//   DELETE /students/{id}/events/{ts}     -> remove event, reverse its delta
//   POST   /students/bulk-points          -> grant points to many students at once
//   GET    /analytics/top-reasons         -> aggregate top reasons (?days=N to limit)

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
//   pk = STUDENT#<id>, sk = PROFILE     -> { id, name, grade, points, photo, notes }
//   pk = STUDENT#<id>, sk = EVENT#<ts>  -> { delta, reason, timestamp }

// Computes the current streak: number of consecutive days ending today or yesterday
// where the student earned at least one positive grant. UTC days.
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

exports.handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path || event.rawPath || '';

  if (method === 'OPTIONS') return respond(200, {});

  try {
    // GET /students  - returns profiles with computed streak
    if (method === 'GET' && path === '/students') {
      const result = await ddb.send(new ScanCommand({ TableName: TABLE }));
      const profiles = [];
      const eventTimestampsByStudent = {};
      for (const item of result.Items || []) {
        if (item.sk === 'PROFILE') profiles.push(item);
        else if (item.sk?.startsWith('EVENT#') && item.delta > 0) {
          (eventTimestampsByStudent[item.pk] ||= []).push(item.timestamp);
        }
      }
      const students = profiles.map(p => ({
        ...p,
        streak: computeStreak(eventTimestampsByStudent[p.pk] || []),
      }));
      return respond(200, { students });
    }

    // POST /students/bulk-points - grant the same delta+reason to many students
    if (method === 'POST' && path === '/students/bulk-points') {
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
            Item: { pk: spk, sk: `EVENT#${timestamp}`, delta, reason, timestamp },
          })),
        ];
      }));
      return respond(200, { count: ids.length, delta, reason, timestamp });
    }

    // GET /analytics/top-reasons?days=30
    if (method === 'GET' && path === '/analytics/top-reasons') {
      const days = parseInt(event.queryStringParameters?.days || '30', 10);
      const cutoff = new Date(Date.now() - days * 86400000).toISOString();
      const result = await ddb.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: 'begins_with(sk, :prefix) AND #ts >= :cutoff AND delta > :zero',
        ExpressionAttributeNames: { '#ts': 'timestamp' },
        ExpressionAttributeValues: { ':prefix': 'EVENT#', ':cutoff': cutoff, ':zero': 0 },
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
      return respond(200, { reasons, days });
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

    // Routes with {id}
    const idMatch = path.match(/^\/students\/([^/]+)(\/.*)?$/);
    if (idMatch) {
      const id = idMatch[1];
      const sub = idMatch[2] || '';
      const pk = `STUDENT#${id}`;

      // GET /students/{id}
      if (method === 'GET' && !sub) {
        const profile = await ddb.send(new GetCommand({
          TableName: TABLE, Key: { pk, sk: 'PROFILE' },
        }));
        if (!profile.Item) return respond(404, { error: 'Not found' });
        const events = await ddb.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
          ExpressionAttributeValues: { ':pk': pk, ':prefix': 'EVENT#' },
          ScanIndexForward: false, Limit: 50,
        }));
        return respond(200, { ...profile.Item, history: events.Items || [] });
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
        const body = JSON.parse(event.body || '{}');
        const delta = parseInt(body.delta, 10);
        if (isNaN(delta)) return respond(400, { error: 'delta required' });
        const reason = body.reason || (delta > 0 ? 'Points awarded' : 'Points removed');
        const timestamp = new Date().toISOString();

        // Atomically update points and record event
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
            Item: { pk, sk: `EVENT#${timestamp}`, delta, reason, timestamp },
          })),
        ]);
        return respond(200, { ...updated.Attributes, eventTimestamp: timestamp });
      }

      // DELETE /students/{id}/events/{timestamp} - undo a grant
      if (method === 'DELETE' && sub.startsWith('/events/')) {
        const timestamp = decodeURIComponent(sub.slice('/events/'.length));
        const sk = `EVENT#${timestamp}`;
        const existing = await ddb.send(new GetCommand({
          TableName: TABLE, Key: { pk, sk },
        }));
        if (!existing.Item) return respond(404, { error: 'Event not found' });
        await Promise.all([
          ddb.send(new DeleteCommand({ TableName: TABLE, Key: { pk, sk } })),
          ddb.send(new UpdateCommand({
            TableName: TABLE, Key: { pk, sk: 'PROFILE' },
            UpdateExpression: 'ADD points :d',
            ExpressionAttributeValues: { ':d': -existing.Item.delta },
          })),
        ]);
        return respond(204, {});
      }

      // GET /students/{id}/photo-upload -> presigned URL
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
