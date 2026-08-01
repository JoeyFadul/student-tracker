import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddStudentModal } from './AddStudentModal'

// jsdom lacks object URLs; the preview only needs a stable string.
beforeEach(() => {
  URL.createObjectURL = vi.fn(() => 'blob:preview')
  URL.revokeObjectURL = vi.fn()
})

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

describe('AddStudentModal — single form photo row', () => {
  const pickFile = async () => {
    const file = new File(['x'], 'kid.png', { type: 'image/png' })
    await userEvent.upload(document.querySelector('input[type="file"]'), file)
    return file
  }

  it('picking a photo flips the row to change/remove, and remove reverts it', async () => {
    render(<AddStudentModal onClose={vi.fn()} onCreate={vi.fn()} onCreateMany={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Add photo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove photo' })).toBeNull()

    await pickFile()
    expect(screen.getByRole('button', { name: 'Change photo' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remove photo' }))
    expect(screen.getByRole('button', { name: 'Add photo' })).toBeInTheDocument()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })

  it('passes the picked file through to onCreate alongside the default avatar seed', async () => {
    const onCreate = vi.fn().mockResolvedValue()
    render(<AddStudentModal onClose={vi.fn()} onCreate={onCreate} onCreateMany={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('First and last name'), 'Maya Rodriguez')
    const file = await pickFile()
    await userEvent.click(screen.getByRole('button', { name: 'Add student' }))
    expect(onCreate).toHaveBeenCalledExactlyOnceWith(
      { name: 'Maya Rodriguez', grade: '3rd', photo: expect.any(String) },
      file,
    )
  })
})
