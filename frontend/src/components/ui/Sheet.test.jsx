import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Sheet } from './Sheet'

// Sheet locks body scroll while open; releasing it calls window.scrollTo,
// which jsdom doesn't implement. Stub it so unmount stays quiet.
beforeEach(() => { window.scrollTo = vi.fn() })
afterEach(cleanup)

// The keyboard-clipping fix lives entirely in the panel's height cap and the
// backdrop padding. jsdom can't compute dvh/env()/flex layout, so the inline
// style string is the only observable contract — we assert the cap subtracts
// the keyboard height and both safe-area insets, which is exactly what the old
// `85dvh` cap failed to do (letting a keyboard-up panel spill behind the
// status bar).
describe('Sheet', () => {
  const openSheet = () =>
    render(<Sheet open title="Keyboard test"><p>Body</p></Sheet>)

  it('renders its title and children when open', () => {
    openSheet()
    expect(screen.getByText('Keyboard test')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('caps the panel against the keyboard and safe-area insets', () => {
    openSheet()
    const panel = screen.getByText('Keyboard test').parentElement
    expect(panel.style.maxHeight).toContain('var(--kb-height')
    expect(panel.style.maxHeight).toContain('safe-area-inset-top')
    expect(panel.style.maxHeight).toContain('safe-area-inset-bottom')
  })

  it('pads the backdrop by the top safe-area inset so it clears the status bar', () => {
    openSheet()
    const backdrop = screen.getByText('Keyboard test').parentElement.parentElement
    expect(backdrop.style.padding).toContain('safe-area-inset-top')
  })
})
