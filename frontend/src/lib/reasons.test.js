import { describe, it, expect } from 'vitest'
import { cleanReasons } from './reasons'

describe('cleanReasons', () => {
  it('trims, drops blanks, and preserves order', () => {
    expect(cleanReasons(['  Kindness  ', '', '   ', 'Teamwork'])).toEqual(['Kindness', 'Teamwork'])
  })

  it('de-dupes case-insensitively, keeping the first occurrence', () => {
    expect(cleanReasons(['Kindness', 'kindness', 'KINDNESS', 'Effort'])).toEqual(['Kindness', 'Effort'])
  })

  it('caps each reason at 50 characters', () => {
    expect(cleanReasons(['x'.repeat(60)])[0]).toHaveLength(50)
  })

  it('handles empty and nullish input', () => {
    expect(cleanReasons([])).toEqual([])
    expect(cleanReasons(null)).toEqual([])
    expect(cleanReasons([null, undefined, ''])).toEqual([])
  })
})
