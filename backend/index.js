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

exports.handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path || event.rawPath || '';

  if (method === 'OPTIONS') return respond(200, {});

  try {
    // GET /students
    if (method === 'GET' && path === '/students') {
      const result = await ddb.send(new ScanCommand({
        TableName: TABLE,
        FilterExpression: 'sk = :sk',
        ExpressionAttributeValues: { ':sk': 'PROFILE' },
      }));
      return respond(200, { students: result.Items || [] });
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
        return respond(200, updated.Attributes);
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
