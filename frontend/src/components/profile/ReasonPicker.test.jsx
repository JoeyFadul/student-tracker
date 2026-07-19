import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReasonPicker } from './ReasonPicker'

describe('ReasonPicker', () => {
  it('commits immediately when a preset reason is tapped', async () => {
    const onSubmit = vi.fn()
    render(<ReasonPicker amount={2} onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Kindness' }))
    expect(onSubmit).toHaveBeenCalledWith(2, 'Kindness')
  })

  it('submits a negative delta when revoke mode is active', async () => {
    const onSubmit = vi.fn()
    render(<ReasonPicker amount={5} allowRevoke onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: /Revoke 5/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Effort' }))
    expect(onSubmit).toHaveBeenCalledWith(-5, 'Effort')
  })

  it('caps custom reasons at 50 characters and submits trimmed text', async () => {
    const onSubmit = vi.fn()
    render(<ReasonPicker amount={1} onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: /Other reason/ }))

    const textarea = screen.getByPlaceholderText('Type a reason…')
    expect(textarea).toHaveAttribute('maxLength', '50')

    await userEvent.type(textarea, '  Helped a classmate  ')
    await userEvent.click(screen.getByRole('button', { name: /Award 1/ }))
    expect(onSubmit).toHaveBeenCalledWith(1, 'Helped a classmate')
  })
})
