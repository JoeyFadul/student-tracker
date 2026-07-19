import { describe, it, expect } from 'vitest'
import { suggestYearLabel, deriveYearOptions } from './useSchoolYear'

describe('suggestYearLabel', () => {
  it('suggests the year starting this fall from July onward', () => {
    expect(suggestYearLabel(new Date('2026-07-15T12:00:00'))).toBe('2026–2027')
    expect(suggestYearLabel(new Date('2026-12-01T12:00:00'))).toBe('2026–2027')
  })

  it('suggests the in-progress year before July', () => {
    expect(suggestYearLabel(new Date('2026-03-01T12:00:00'))).toBe('2025–2026')
    expect(suggestYearLabel(new Date('2026-06-30T12:00:00'))).toBe('2025–2026')
  })
})

describe('deriveYearOptions', () => {
  it('offers surrounding academic years and inserts summer after the year ending now', () => {
    const options = deriveYearOptions(new Date('2026-07-15T12:00:00'))
    expect(options).toEqual([
      '2025–2026', 'Summer 2026', '2026–2027', '2027–2028', '2028–2029',
    ])
  })

  it('includes the suggested label', () => {
    const now = new Date('2026-02-10T12:00:00')
    expect(deriveYearOptions(now)).toContain(suggestYearLabel(now))
  })
})
