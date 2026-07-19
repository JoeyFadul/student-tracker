import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('confirms and closes on success', async () => {
    const onConfirm = vi.fn().mockResolvedValue()
    const onClose = vi.fn()
    render(
      <ConfirmDialog title="End year?" confirmLabel="End year" onConfirm={onConfirm} onClose={onClose}>
        Body text
      </ConfirmDialog>
    )
    await userEvent.click(screen.getByRole('button', { name: 'End year' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('keeps the confirm button disabled until the typed word matches', async () => {
    const onConfirm = vi.fn().mockResolvedValue()
    render(
      <ConfirmDialog
        title="Delete?"
        destructive
        requireTypedText="delete"
        confirmLabel="Delete"
        onConfirm={onConfirm}
        onClose={() => {}}
      >
        Gone forever
      </ConfirmDialog>
    )
    const confirmBtn = screen.getByRole('button', { name: 'Delete' })
    expect(confirmBtn).toBeDisabled()
    await userEvent.click(confirmBtn)
    expect(onConfirm).not.toHaveBeenCalled()

    await userEvent.type(screen.getByPlaceholderText('delete'), 'DELETE ')
    expect(confirmBtn).toBeEnabled()
    await userEvent.click(confirmBtn)
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('shows the error and stays open when onConfirm rejects', async () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn().mockRejectedValue(new Error('API 500: nope'))
    render(
      <ConfirmDialog title="Remove?" confirmLabel="Remove" onConfirm={onConfirm} onClose={onClose}>
        Body
      </ConfirmDialog>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(await screen.findByText('API 500: nope')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })
})
