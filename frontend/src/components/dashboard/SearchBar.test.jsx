import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('reports typed text and clears via the clear button', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="mia" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Search students…'), 'x')
    expect(onChange).toHaveBeenCalledWith('miax')
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('return key drops focus (search is live; no accessory bar to dismiss with)', async () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    const input = screen.getByPlaceholderText('Search students…')
    expect(input).toHaveAttribute('enterkeyhint', 'search')
    input.focus()
    await userEvent.keyboard('{Enter}')
    expect(document.activeElement).not.toBe(input)
  })
})
