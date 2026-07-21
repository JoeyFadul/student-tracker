import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { scrollFocusedIntoView, installFocusScroll } from './keyboardScroll'

// jsdom doesn't implement scrollIntoView; stub it on the prototype so we can
// assert whether the focused field would be lifted above the keyboard.
beforeEach(() => {
  document.documentElement.style.removeProperty('--kb-height')
  document.body.innerHTML = ''
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => { vi.restoreAllMocks() })

const addInput = () => {
  const el = document.createElement('input')
  document.body.appendChild(el)
  return el
}

describe('scrollFocusedIntoView', () => {
  it('lifts the focused text field into view', () => {
    const el = addInput()
    el.focus()
    scrollFocusedIntoView()
    expect(el.scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' })
  })

  it('does nothing when the focused element is not an input', () => {
    const div = document.createElement('div')
    div.tabIndex = 0
    document.body.appendChild(div)
    div.focus()
    scrollFocusedIntoView()
    expect(div.scrollIntoView).not.toHaveBeenCalled()
  })
})

describe('installFocusScroll', () => {
  it('lifts a field focused while the keyboard is open', () => {
    document.documentElement.style.setProperty('--kb-height', '320px')
    const uninstall = installFocusScroll()
    const el = addInput()
    el.focus() // fires focusin
    expect(el.scrollIntoView).toHaveBeenCalledOnce()
    uninstall()
  })

  it('is inert when the keyboard is closed (--kb-height 0)', () => {
    document.documentElement.style.setProperty('--kb-height', '0px')
    const uninstall = installFocusScroll()
    const el = addInput()
    el.focus()
    expect(el.scrollIntoView).not.toHaveBeenCalled()
    uninstall()
  })

  it('stops listening after uninstall', () => {
    document.documentElement.style.setProperty('--kb-height', '320px')
    const uninstall = installFocusScroll()
    uninstall()
    const el = addInput()
    el.focus()
    expect(el.scrollIntoView).not.toHaveBeenCalled()
  })
})
