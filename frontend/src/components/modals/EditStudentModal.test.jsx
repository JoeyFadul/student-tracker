import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditStudentModal } from './EditStudentModal'

const student = { id: 's1', name: 'Maya Rodriguez', grade: '3rd' }

const setup = (overrides = {}) => {
  const onSave = vi.fn().mockResolvedValue()
  const onClose = vi.fn()
  render(
    <EditStudentModal
      student={{ ...student, ...overrides }}
      onClose={onClose}
      onSave={onSave}
    />
  )
  return {
    onSave,
    onClose,
    nameInput: screen.getByPlaceholderText('First and last name'),
    gradeSelect: screen.getByRole('combobox'),
    saveButton: screen.getByRole('button', { name: 'Save changes' }),
  }
}

describe('EditStudentModal', () => {
  it('prefills the current values and disables save until something changes', () => {
    const { nameInput, gradeSelect, saveButton } = setup()
    expect(nameInput).toHaveValue('Maya Rodriguez')
    expect(gradeSelect).toHaveValue('3rd')
    expect(saveButton).toBeDisabled()
  })

  it('saves the trimmed name and new grade, then closes', async () => {
    const { onSave, onClose, nameInput, gradeSelect, saveButton } = setup()
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, '  Maya R.  ')
    await userEvent.selectOptions(gradeSelect, '4th')
    await userEvent.click(saveButton)
    expect(onSave).toHaveBeenCalledExactlyOnceWith({ name: 'Maya R.', grade: '4th' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('disables save while the name is blank', async () => {
    const { onSave, nameInput, saveButton } = setup()
    await userEvent.clear(nameInput)
    expect(saveButton).toBeDisabled()
    await userEvent.click(saveButton)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('shows the error and stays open when the save fails', async () => {
    const { onSave, onClose, nameInput, saveButton } = setup()
    onSave.mockRejectedValue(new Error('API 500: nope'))
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Maya R.')
    await userEvent.click(saveButton)
    expect(await screen.findByText('API 500: nope')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  })

  it('surfaces a legacy empty grade as its own option instead of rewriting it', () => {
    const { gradeSelect } = setup({ grade: '' })
    expect(gradeSelect).toHaveValue('')
    expect(screen.getByRole('option', { name: 'No grade' })).toBeInTheDocument()
  })
})
