import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReasonsScreen } from './ReasonsScreen'

describe('ReasonsScreen', () => {
  it('disables Save until something changes', () => {
    render(<ReasonsScreen reasons={['Kindness']} onSave={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Save reasons' })).toBeDisabled()
  })

  it('adds a reason and saves the cleaned list, then goes back', async () => {
    const onSave = vi.fn().mockResolvedValue()
    const onBack = vi.fn()
    render(<ReasonsScreen reasons={['Kindness']} onSave={onSave} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add reason' }))
    const inputs = screen.getAllByPlaceholderText('Reason')
    await userEvent.type(inputs[inputs.length - 1], '  Teamwork  ')
    await userEvent.click(screen.getByRole('button', { name: 'Save reasons' }))
    expect(onSave).toHaveBeenCalledExactlyOnceWith(['Kindness', 'Teamwork'])
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('removes a reason', async () => {
    const onSave = vi.fn().mockResolvedValue()
    render(<ReasonsScreen reasons={['Kindness', 'Effort']} onSave={onSave} onBack={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove Effort' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save reasons' }))
    expect(onSave).toHaveBeenCalledExactlyOnceWith(['Kindness'])
  })

  it('shows the error and stays open when the save fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('API 500: nope'))
    const onBack = vi.fn()
    render(<ReasonsScreen reasons={['Kindness']} onSave={onSave} onBack={onBack} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add reason' }))
    const inputs = screen.getAllByPlaceholderText('Reason')
    await userEvent.type(inputs[inputs.length - 1], 'Teamwork')
    await userEvent.click(screen.getByRole('button', { name: 'Save reasons' }))
    expect(await screen.findByText('API 500: nope')).toBeInTheDocument()
    expect(onBack).not.toHaveBeenCalled()
  })
})
