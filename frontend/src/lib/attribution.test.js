import { describe, it, expect } from 'vitest'
import { attributionLabel } from './attribution'

describe('attributionLabel', () => {
  it('returns null for legacy events with no grantedBy', () => {
    expect(attributionLabel(undefined, 'me@x.com')).toBe(null)
    expect(attributionLabel('', 'me@x.com')).toBe(null)
  })

  it("hides attribution for the viewer's own grants (case-insensitive)", () => {
    expect(attributionLabel('me@x.com', 'me@x.com')).toBe(null)
    expect(attributionLabel('Me@X.com', 'me@x.com')).toBe(null)
  })

  it('shows the local-part for a co-teacher grant', () => {
    expect(attributionLabel('jlee@school.edu', 'me@x.com')).toBe('jlee')
  })

  it('falls back to the whole value when there is no @', () => {
    expect(attributionLabel('coteacher', 'me@x.com')).toBe('coteacher')
  })

  it('shows attribution when the viewer email is unknown', () => {
    expect(attributionLabel('jlee@school.edu', null)).toBe('jlee')
  })
})
