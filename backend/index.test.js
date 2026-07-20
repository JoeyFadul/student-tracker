import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

process.env.TABLE_NAME = 'test-table'
process.env.PHOTO_BUCKET = 'test-bucket'

const ddbMock = mockClient(DynamoDBDocumentClient)
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
