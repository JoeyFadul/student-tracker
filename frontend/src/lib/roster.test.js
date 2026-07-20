import { describe, it, expect } from 'vitest'
import { parseRoster } from './roster'

describe('parseRoster', () => {
  it('splits lines, trims, and drops blanks', () => {
    expect(parseRoster('  Maya Rodriguez \n\nJordan Lee\n   \nSam Okafor  '))
      .toEqual(['Maya Rodriguez', 'Jordan Lee', 'Sam Okafor'])
  })

  it('keeps legitimate duplicates', () => {
    expect(parseRoster('John\nJohn')).toEqual(['John', 'John'])
  })

  it('does not split on commas (a "Last, First" line stays one name)', () => {
    expect(parseRoster('Rodriguez, Maya')).toEqual(['Rodriguez, Maya'])
  })

  it('handles empty and nullish input', () => {
    expect(parseRoster('')).toEqual([])
    expect(parseRoster(null)).toEqual([])
    expect(parseRoster('   \n  ')).toEqual([])
  })
})
