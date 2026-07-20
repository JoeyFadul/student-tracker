import { describe, it, expect } from 'vitest'
import { allVisibleSelected, toggleSelectAll } from './selection'

describe('dashboard selection helpers', () => {
  const ids = ['a', 'b', 'c']

  it('allVisibleSelected: false when none/some selected, true when all', () => {
    expect(allVisibleSelected(ids, new Set())).toBe(false)
    expect(allVisibleSelected(ids, new Set(['a']))).toBe(false)
    expect(allVisibleSelected(ids, new Set(ids))).toBe(true)
  })

  it('allVisibleSelected is false for an empty visible list', () => {
    expect(allVisibleSelected([], new Set())).toBe(false)
    expect(allVisibleSelected([], new Set(['x']))).toBe(false)
  })

  it('toggleSelectAll selects every visible id when not all are selected', () => {
    expect([...toggleSelectAll(ids, new Set(['a']))].sort()).toEqual(['a', 'b', 'c'])
  })

  it('toggleSelectAll clears the visible ids when all are already selected', () => {
    expect([...toggleSelectAll(ids, new Set(ids))]).toEqual([])
  })

  it('preserves selections outside the visible set in both directions', () => {
    // 'z' is selected but filtered out of view — select-all must keep it
    const selected = toggleSelectAll(ids, new Set(['z']))
    expect(selected.has('z')).toBe(true)
    expect([...selected].sort()).toEqual(['a', 'b', 'c', 'z'])
    // deselect-all only removes the visible ids, 'z' survives
    const cleared = toggleSelectAll(ids, new Set([...ids, 'z']))
    expect([...cleared]).toEqual(['z'])
  })
})
