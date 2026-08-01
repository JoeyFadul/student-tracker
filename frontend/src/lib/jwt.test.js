import { describe, it, expect } from 'vitest'
import { decodeJwtPayload } from './jwt'

const enc = (o) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const jwt = (claims) => `${enc({ alg: 'none' })}.${enc(claims)}.sig`

describe('decodeJwtPayload', () => {
  it('decodes the payload claims', () => {
    expect(decodeJwtPayload(jwt({ email: 'me@x.com', exp: 123 })))
      .toEqual({ email: 'me@x.com', exp: 123 })
  })

  it('handles the base64url alphabet and missing padding', () => {
    // '>' runs encode into '+' territory in plain base64; base64url swaps
    // to '-'/'_' and drops padding — atob chokes on both without repair.
    const claims = { email: 'weird?~@x.com', name: '???>>>' }
    expect(decodeJwtPayload(jwt(claims))).toEqual(claims)
  })

  it('returns null for garbage, empty, or missing tokens', () => {
    expect(decodeJwtPayload(null)).toBe(null)
    expect(decodeJwtPayload('')).toBe(null)
    expect(decodeJwtPayload('not-a-jwt')).toBe(null)
    expect(decodeJwtPayload('a.!!!.c')).toBe(null)
  })
})
