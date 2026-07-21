import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'

process.env.TABLE_NAME = 'test-table'
process.env.PHOTO_BUCKET = 'test-bucket'

const ddbMock = mockClient(DynamoDBDocumentClient)
const s3Mock = mockClient(S3Client)
const { handler, computeStreak } = await import('./index.js')

const event = (method, path, { email = 'teacher@test.com', body } = {}) => ({
  requestContext: {
    http: { method, path },
    authorizer: email ? { jwt: { claims: { email } } } : undefined,
  },
  body: body ? JSON.stringify(body) : undefined,
})

beforeEach(() => ddbMock.reset())

describe('computeStreak', () => {
  beforeAll(() => vi.setSystemTime(new Date('2026-07-04T15:00:00Z')))
  afterAll(() => vi.useRealTimers())

  const ts = (day) => `${day}T10:00:00.000Z`

  it('is 0 with no positive events', () => {
    expect(computeStreak([])).toBe(0)
  })

  it('counts consecutive days ending today', () => {
    expect(computeStreak([ts('2026-07-04')])).toBe(1)
    expect(computeStreak([ts('2026-07-04'), ts('2026-07-03'), ts('2026-07-02')])).toBe(3)
  })

  it('still counts a streak anchored on yesterday', () => {
    expect(computeStreak([ts('2026-07-03'), ts('2026-07-02')])).toBe(2)
  })

  it('breaks on a gap and dies after two idle days', () => {
    expect(computeStreak([ts('2026-07-04'), ts('2026-07-01')])).toBe(1)
    expect(computeStreak([ts('2026-07-01')])).toBe(0)
  })

  it('counts multiple events on one day once', () => {
    expect(computeStreak([ts('2026-07-04'), '2026-07-04T18:00:00.000Z'])).toBe(1)
  })
})

describe('handler authorization', () => {
  it('rejects requests without an email claim', async () => {
    const res = await handler(event('GET', '/classrooms', { email: null }))
    expect(res.statusCode).toBe(401)
  })

  it('returns 403 for classroom routes when the caller is not a member', async () => {
    ddbMock.on(GetCommand).resolves({}) // no membership row
    const res = await handler(event('GET', '/classrooms/c-123/students'))
    expect(res.statusCode).toBe(403)
    expect(JSON.parse(res.body).error).toMatch(/not a member/i)
  })

  it('blocks owner-only actions for plain members', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: { classroomId: 'c-123', role: 'member' },
    })
    const res = await handler(event('DELETE', '/classrooms/c-123'))
    expect(res.statusCode).toBe(403)
  })

  it('lists memberships for the caller', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [{ classroomId: 'c-123', classroomName: 'Room 12', role: 'owner' }],
    })
    const res = await handler(event('GET', '/classrooms'))
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).classrooms).toHaveLength(1)
  })
})

describe('student update validation', () => {
  const patchStudent = (body) =>
    handler(event('PATCH', '/classrooms/c-123/students/s-1', { body }))

  beforeEach(() => {
    ddbMock.on(GetCommand).resolves({ Item: { classroomId: 'c-123', role: 'owner' } })
  })

  it('rejects a blank or non-string name', async () => {
    expect((await patchStudent({ name: '   ' })).statusCode).toBe(400)
    expect((await patchStudent({ name: 42 })).statusCode).toBe(400)
  })

  it('rejects a non-string grade', async () => {
    const res = await patchStudent({ grade: 3 })
    expect(res.statusCode).toBe(400)
  })

  it('trims the name before persisting', async () => {
    ddbMock.on(UpdateCommand).resolves({
      Attributes: { id: 's-1', name: 'Maya Rodriguez', grade: '4th' },
    })
    const res = await patchStudent({ name: '  Maya Rodriguez  ', grade: '4th' })
    expect(res.statusCode).toBe(200)
    const update = ddbMock.commandCalls(UpdateCommand)[0].args[0].input
    expect(update.ExpressionAttributeValues[':name']).toBe('Maya Rodriguez')
    expect(update.ExpressionAttributeValues[':grade']).toBe('4th')
  })
})

describe('event attribution (grantedBy)', () => {
  const eventPuts = () =>
    ddbMock.commandCalls(TransactWriteCommand)
      .flatMap(c => c.args[0].input.TransactItems)
      .filter(t => t.Put)
      .map(t => t.Put.Item)

  beforeEach(() => {
    // Membership + active year lookups both go through GetCommand; branch on
    // the sort key so one mock serves both.
    ddbMock.on(GetCommand).callsFake((input) => {
      const sk = input.Key?.sk || ''
      if (sk.startsWith('MEMBERSHIP#') || sk.startsWith('MEMBER#')) return { Item: { classroomId: 'c-123', role: 'owner' } }
      if (sk === 'ACTIVE_YEAR') return { Item: { yearId: 'y1' } }
      return {}
    })
    ddbMock.on(TransactWriteCommand).resolves({})
  })

  it('stamps grantedBy with the caller email on a single grant', async () => {
    const res = await handler(event('POST', '/classrooms/c-123/students/s-1/points', { body: { delta: 2, reason: 'Kindness' } }))
    expect(res.statusCode).toBe(200)
    const puts = eventPuts()
    expect(puts).toHaveLength(1)
    expect(puts[0].grantedBy).toBe('teacher@test.com')
  })

  it('stamps grantedBy on every event in a bulk grant', async () => {
    const res = await handler(event('POST', '/classrooms/c-123/students/bulk-points', { body: { ids: ['s-1', 's-2'], delta: 1, reason: 'Class point' } }))
    expect(res.statusCode).toBe(200)
    const puts = eventPuts()
    expect(puts).toHaveLength(2)
    expect(puts.every(it => it.grantedBy === 'teacher@test.com')).toBe(true)
  })
})

describe('custom reasons', () => {
  const putReasons = (body) => handler(event('PATCH', '/classrooms/c-123/reasons', { body }))

  it('replaces the list for the owner — trimmed, de-duped, blanks dropped, order kept', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { classroomId: 'c-123', role: 'owner' } })
    ddbMock.on(UpdateCommand).resolves({})
    const res = await putReasons({ reasons: ['  Kindness  ', 'kindness', '', 'Teamwork'] })
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).reasons).toEqual(['Kindness', 'Teamwork'])
    const upd = ddbMock.commandCalls(UpdateCommand)[0].args[0].input
    expect(upd.ExpressionAttributeValues[':r']).toEqual(['Kindness', 'Teamwork'])
  })

  it('rejects a non-owner (members can use reasons but not edit them)', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { classroomId: 'c-123', role: 'member' } })
    expect((await putReasons({ reasons: ['Kindness'] })).statusCode).toBe(403)
  })

  it('rejects a non-array or non-string entries', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { classroomId: 'c-123', role: 'owner' } })
    expect((await putReasons({ reasons: 'nope' })).statusCode).toBe(400)
    expect((await putReasons({ reasons: ['ok', 42] })).statusCode).toBe(400)
  })

  it('caps each reason at 25 characters', async () => {
    ddbMock.on(GetCommand).resolves({ Item: { classroomId: 'c-123', role: 'owner' } })
    ddbMock.on(UpdateCommand).resolves({})
    const res = await putReasons({ reasons: ['x'.repeat(60)] })
    expect(JSON.parse(res.body).reasons[0]).toHaveLength(25)
  })

  it('GET classroom returns the default reasons when none are stored', async () => {
    ddbMock.on(GetCommand).callsFake((input) => {
      const sk = input.Key?.sk || ''
      if (sk.startsWith('MEMBERSHIP#') || sk.startsWith('MEMBER#')) return { Item: { classroomId: 'c-123', role: 'owner' } }
      if (sk === 'META') return { Item: { id: 'c-123', name: 'Room 12' } }
      return {}
    })
    const res = await handler(event('GET', '/classrooms/c-123'))
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.reasons).toHaveLength(8)
    expect(body.reasons).toContain('Kindness')
  })
})

describe('classroom deletion teardown', () => {
  beforeEach(() => {
    s3Mock.reset()
    ddbMock.on(GetCommand).resolves({ Item: { classroomId: 'c-123', role: 'owner' } })
    ddbMock.on(QueryCommand).resolves({
      Items: [
        { pk: 'CLASSROOM#c-123', sk: 'META' },
        { pk: 'CLASSROOM#c-123', sk: 'MEMBER#owner@test.com', email: 'owner@test.com' },
        { pk: 'CLASSROOM#c-123', sk: 'MEMBER#coteacher@test.com', email: 'coteacher@test.com' },
        { pk: 'CLASSROOM#c-123', sk: 'STUDENT_PROFILE#s1' },
      ],
    })
    ddbMock.on(TransactWriteCommand).resolves({})
    s3Mock.on(ListObjectsV2Command).resolves({ Contents: [{ Key: 'classrooms/c-123/students/s1/a.jpg' }], IsTruncated: false })
    s3Mock.on(DeleteObjectsCommand).resolves({})
  })

  const teardownKeys = () =>
    ddbMock.commandCalls(TransactWriteCommand)
      .flatMap(c => c.args[0].input.TransactItems)
      .map(w => `${w.Delete.Key.pk}|${w.Delete.Key.sk}`)

  it('deletes the classroom photos from S3 under the classroom prefix', async () => {
    const res = await handler(event('DELETE', '/classrooms/c-123'))
    expect(res.statusCode).toBe(204)
    expect(s3Mock.commandCalls(ListObjectsV2Command)[0].args[0].input.Prefix).toBe('classrooms/c-123/students/')
    expect(s3Mock.commandCalls(DeleteObjectsCommand)).toHaveLength(1)
  })

  it('deletes each MEMBERSHIP pointer, its MEMBER# row only after it, and META last (retry-safe)', async () => {
    await handler(event('DELETE', '/classrooms/c-123'))
    const keys = teardownKeys()
    expect(keys).toContain('USER#owner@test.com|MEMBERSHIP#c-123')
    expect(keys).toContain('USER#coteacher@test.com|MEMBERSHIP#c-123')
    // the MEMBER# row is deleted after the pointer derived from it
    expect(keys.indexOf('CLASSROOM#c-123|MEMBER#coteacher@test.com'))
      .toBeGreaterThan(keys.indexOf('USER#coteacher@test.com|MEMBERSHIP#c-123'))
    // META last so the classroom stays identifiable through a retry
    expect(keys[keys.length - 1]).toBe('CLASSROOM#c-123|META')
  })
})
