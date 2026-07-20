import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionChip } from './ActionChip'

describe('ActionChip', () => {
  it('renders its label and fires onClick', async () => {
    const onClick = vi.fn()
    render(<ActionChip onClick={onClick} ariaLabel="Class point">Class point</ActionChip>)
    await userEvent.click(screen.getByRole('button', { name: 'Class point' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn()
    render(<ActionChip onClick={onClick} disabled ariaLabel="Class point">Class point</ActionChip>)
    await userEvent.click(screen.getByRole('button', { name: 'Class point' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('uses the aria-label for an accessible name distinct from the visible text', () => {
    render(<ActionChip onClick={() => {}} ariaLabel="Deselect all students">Deselect all</ActionChip>)
    expect(screen.getByRole('button', { name: 'Deselect all students' })).toBeInTheDocument()
  })
})
