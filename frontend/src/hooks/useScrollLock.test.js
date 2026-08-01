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

  // iOS WKWebView keeps native touch-pan paths a pinned body can't stop (the
  // keyboard content inset makes the whole layer draggable), so while locked
  // every touchmove outside a real scroller must be cancelled.
  describe('touch interception while locked', () => {
    const touchMoveOn = (el) => {
      const e = new Event('touchmove', { bubbles: true, cancelable: true })
      el.dispatchEvent(e)
      return e
    }

    it('cancels touch panning outside any scroller', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const { unmount } = renderHook(() => useScrollLock(true))
      expect(touchMoveOn(el).defaultPrevented).toBe(true)
      unmount()
      el.remove()
    })

    it('leaves gestures inside an overflowing scroller alone (sheet panel)', () => {
      const panel = document.createElement('div')
      panel.style.overflowY = 'auto'
      Object.defineProperty(panel, 'scrollHeight', { value: 500, configurable: true })
      Object.defineProperty(panel, 'clientHeight', { value: 100, configurable: true })
      const content = document.createElement('p')
      panel.appendChild(content)
      document.body.appendChild(panel)
      const { unmount } = renderHook(() => useScrollLock(true))
      expect(touchMoveOn(content).defaultPrevented).toBe(false)
      unmount()
      panel.remove()
    })

    it('stops intercepting once the lock is released', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const { unmount } = renderHook(() => useScrollLock(true))
      unmount()
      expect(touchMoveOn(el).defaultPrevented).toBe(false)
      el.remove()
    })
  })
})
