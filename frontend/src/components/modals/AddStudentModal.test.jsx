import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddStudentModal } from './AddStudentModal'

describe('AddStudentModal — paste list', () => {
  it('creates one student per pasted line with the shared grade', async () => {
    const onCreateMany = vi.fn().mockResolvedValue()
    const onClose = vi.fn()
    render(<AddStudentModal onClose={onClose} onCreate={vi.fn()} onCreateMany={onCreateMany} />)

    await userEvent.click(screen.getByRole('button', { name: 'Many' }))
    const textarea = screen.getByRole('textbox')
    await userEvent.click(textarea)
    await userEvent.paste('Maya Rodriguez\n\nJordan Lee\n  Sam Okafor  ')
    await userEvent.selectOptions(screen.getByRole('combobox'), '4th')

    await userEvent.click(screen.getByRole('button', { name: 'Add 3 students' }))

    expect(onCreateMany).toHaveBeenCalledExactlyOnceWith([
      { name: 'Maya Rodriguez', grade: '4th', photo: expect.any(String) },
      { name: 'Jordan Lee', grade: '4th', photo: expect.any(String) },
      { name: 'Sam Okafor', grade: '4th', photo: expect.any(String) },
    ])
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('drops already-created names on a partial failure so a retry has no duplicates', async () => {
    const onCreateMany = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error('network blip'), { createdCount: 1 }))
      .mockResolvedValueOnce()
    const onClose = vi.fn()
    render(<AddStudentModal onClose={onClose} onCreate={vi.fn()} onCreateMany={onCreateMany} />)

    await userEvent.click(screen.getByRole('button', { name: 'Many' }))
    const textarea = screen.getByRole('textbox')
    await userEvent.click(textarea)
    await userEvent.paste('Maya Rodriguez\nJordan Lee\nSam Okafor')

    await userEvent.click(screen.getByRole('button', { name: 'Add 3 students' }))

    // Maya landed before the failure, so she's dropped from the box; only the
    // two that never got created remain.
    expect(await screen.findByText(/network blip/)).toBeInTheDocument()
    expect(textarea).toHaveValue('Jordan Lee\nSam Okafor')
    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Add 2 students' }))
    expect(onCreateMany).toHaveBeenLastCalledWith([
      { name: 'Jordan Lee', grade: '3rd', photo: expect.any(String) },
      { name: 'Sam Okafor', grade: '3rd', photo: expect.any(String) },
    ])
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('keeps the add button disabled until there is at least one name', async () => {
    render(<AddStudentModal onClose={vi.fn()} onCreate={vi.fn()} onCreateMany={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Many' }))
    expect(screen.getByRole('button', { name: 'Add students' })).toBeDisabled()
  })

  it('defaults to the single-student form', () => {
    render(<AddStudentModal onClose={vi.fn()} onCreate={vi.fn()} onCreateMany={vi.fn()} />)
    expect(screen.getByPlaceholderText('First and last name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add student' })).toBeInTheDocument()
  })
})
