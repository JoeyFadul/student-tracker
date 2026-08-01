import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { usePullToRefresh } from './usePullToRefresh'

// The hook reads only touches[0].clientY off the event, so a plain Event with
// a touches array glued on stands in for jsdom's missing TouchEvent.
const touch = (type, clientY) => {
  const e = new Event(type, { bubbles: true, cancelable: true })
  e.touches = [{ clientY }]
  return e
}

function Harness({ onRefresh }) {
  const { contentRef, spinnerRef } = usePullToRefresh(onRefresh)
  return (
    <div ref={contentRef} data-testid="content">
      <div ref={spinnerRef} />
      <p data-testid="inner">roster</p>
    </div>
  )
}

beforeEach(() => {
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
})
afterEach(cleanup)

describe('usePullToRefresh', () => {
  it('translates the content while pulling down from inside it', () => {
    render(<Harness onRefresh={vi.fn()} />)
    const inner = screen.getByTestId('inner')
    inner.dispatchEvent(touch('touchstart', 100))
    inner.dispatchEvent(touch('touchmove', 200)) // dy 100 → pull 50 (DRAG_RATIO)
    expect(screen.getByTestId('content').style.transform).toBe('translate3d(0, 50px, 0)')
  })

  it('ignores touches that start outside the content (portaled sheets)', () => {
    render(<Harness onRefresh={vi.fn()} />)
    // A Sheet portals into document.body — its touches bubble to the hook's
    // window listeners but must not arm the pull and drag the dashboard
    // around behind the open modal.
    const overlay = document.createElement('div')
    document.body.appendChild(overlay)
    overlay.dispatchEvent(touch('touchstart', 100))
    overlay.dispatchEvent(touch('touchmove', 200))
    expect(screen.getByTestId('content').style.transform).toBe('')
    overlay.remove()
  })

  it('does not arm when the page is scrolled away from the top', () => {
    window.scrollY = 120
    render(<Harness onRefresh={vi.fn()} />)
    const inner = screen.getByTestId('inner')
    inner.dispatchEvent(touch('touchstart', 100))
    inner.dispatchEvent(touch('touchmove', 200))
    expect(screen.getByTestId('content').style.transform).toBe('')
  })
})
