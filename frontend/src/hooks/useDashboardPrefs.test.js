import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDashboardPrefs, DEFAULT_SORT } from './useDashboardPrefs'

describe('useDashboardPrefs', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear() })

  it('defaults to A–Z sort and empty search when nothing is stored', () => {
    const { result } = renderHook(() => useDashboardPrefs('c1'))
    expect(DEFAULT_SORT).toBe('name')
    expect(result.current.sortKey).toBe('name')
    expect(result.current.search).toBe('')
  })

  it('loads a previously stored sort (localStorage) and session search', () => {
    localStorage.setItem('wd:sort:c1', 'pointsDesc')
    sessionStorage.setItem('wd:search:c1', 'mia')
    const { result } = renderHook(() => useDashboardPrefs('c1'))
    expect(result.current.sortKey).toBe('pointsDesc')
    expect(result.current.search).toBe('mia')
  })

  it('persists sort changes to the classroom-scoped key', () => {
    const { result } = renderHook(() => useDashboardPrefs('c1'))
    act(() => result.current.setSortKey('pointsAsc'))
    expect(result.current.sortKey).toBe('pointsAsc')
    expect(localStorage.getItem('wd:sort:c1')).toBe('pointsAsc')
  })

  it('persists search to sessionStorage and removes the key when cleared', () => {
    const { result } = renderHook(() => useDashboardPrefs('c1'))
    act(() => result.current.setSearch('jordan'))
    expect(sessionStorage.getItem('wd:search:c1')).toBe('jordan')
    expect(localStorage.getItem('wd:search:c1')).toBe(null) // not sticky across launches
    act(() => result.current.setSearch(''))
    expect(sessionStorage.getItem('wd:search:c1')).toBe(null)
  })

  it('keeps preferences independent per classroom', () => {
    localStorage.setItem('wd:sort:c1', 'pointsDesc')
    localStorage.setItem('wd:sort:c2', 'pointsAsc')
    const { result: r1 } = renderHook(() => useDashboardPrefs('c1'))
    const { result: r2 } = renderHook(() => useDashboardPrefs('c2'))
    expect(r1.current.sortKey).toBe('pointsDesc')
    expect(r2.current.sortKey).toBe('pointsAsc')
  })

  it('falls back to defaults and does not throw without a classroom id', () => {
    const { result } = renderHook(() => useDashboardPrefs(null))
    expect(result.current.sortKey).toBe('name')
    act(() => result.current.setSortKey('pointsDesc')) // no classroom → no persistence, must not throw
    expect(result.current.sortKey).toBe('pointsDesc')
    expect(localStorage.length).toBe(0)
  })
})
