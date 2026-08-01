import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollLock } from './useScrollLock'

beforeEach(() => {
  document.body.removeAttribute('style')
  window.scrollTo = vi.fn()
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
})

describe('useScrollLock', () => {
  it('pins the body while active and restores on release', () => {
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.position).toBe('')
    expect(document.body.style.overflow).toBe('')
  })

  it('does nothing when inactive', () => {
    renderHook(() => useScrollLock(false))
    expect(document.body.style.position).toBe('')
  })

  it('stashes and restores the scroll offset', () => {
    window.scrollY = 240
    const { unmount } = renderHook(() => useScrollLock(true))
    expect(document.body.style.top).toBe('-240px')
    unmount()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 240)
  })

  it('stays locked until the last nested sheet releases (ref-counted)', () => {
    const outer = renderHook(() => useScrollLock(true))
    const inner = renderHook(() => useScrollLock(true))
    inner.unmount() // inner sheet closes
    expect(document.body.style.position).toBe('fixed') // still locked
    outer.unmount() // outer closes
    expect(document.body.style.position).toBe('')
  })
})
