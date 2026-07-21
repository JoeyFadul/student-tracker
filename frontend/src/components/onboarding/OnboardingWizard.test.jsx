import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OnboardingWizard } from './OnboardingWizard'

const makeApi = () => ({
  createClassroom: vi.fn().mockResolvedValue({ classroomId: 'c-new' }),
  startSchoolYear: vi.fn().mockResolvedValue({}),
  createStudent: vi.fn().mockResolvedValue({ id: 's' }),
})
const makeClassrooms = () => ({ setActiveId: vi.fn(), refresh: vi.fn().mockResolvedValue() })

describe('OnboardingWizard', () => {
  it('requires a classroom name before continuing', () => {
    render(<OnboardingWizard api={makeApi()} classrooms={makeClassrooms()} onSignOut={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Continue/ })).toBeDisabled()
  })

  it('walks classroom → year → roster and provisions everything on finish', async () => {
    const api = makeApi()
    const classrooms = makeClassrooms()
    render(<OnboardingWizard api={api} classrooms={classrooms} onSignOut={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText(/Mrs. Smith/), 'Room 12')
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))

    expect(screen.getByText('Start the school year')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))

    expect(screen.getByText('Add your students')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.paste('Alex Kim\nPriya Patel')
    await userEvent.click(screen.getByRole('button', { name: 'Add 2 & finish' }))

    await waitFor(() => expect(classrooms.refresh).toHaveBeenCalled())
    expect(api.createClassroom).toHaveBeenCalledWith('Room 12')
    expect(api.startSchoolYear).toHaveBeenCalledWith('c-new', expect.any(String))
    expect(api.createStudent).toHaveBeenCalledTimes(2)
    expect(api.createStudent).toHaveBeenCalledWith('c-new', expect.objectContaining({ name: 'Alex Kim', grade: '3rd' }))
    expect(classrooms.setActiveId).toHaveBeenCalledWith('c-new')
  })

  it('lets you finish without a roster (add students later)', async () => {
    const api = makeApi()
    const classrooms = makeClassrooms()
    render(<OnboardingWizard api={api} classrooms={classrooms} onSignOut={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText(/Mrs. Smith/), 'Room 12')
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Finish' }))

    await waitFor(() => expect(classrooms.refresh).toHaveBeenCalled())
    expect(api.createClassroom).toHaveBeenCalledOnce()
    expect(api.startSchoolYear).toHaveBeenCalledOnce()
    expect(api.createStudent).not.toHaveBeenCalled()
  })

  it('resumes without re-creating anything when a mid-roster write fails', async () => {
    const api = makeApi()
    const classrooms = makeClassrooms()
    api.createStudent
      .mockResolvedValueOnce({ id: 's1' })         // Alex lands
      .mockRejectedValueOnce(new Error('network')) // Priya fails
      .mockResolvedValue({ id: 's2' })             // retry: Priya lands
    render(<OnboardingWizard api={api} classrooms={classrooms} onSignOut={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText(/Mrs. Smith/), 'Room 12')
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.paste('Alex Kim\nPriya Patel')

    await userEvent.click(screen.getByRole('button', { name: 'Add 2 & finish' }))
    await waitFor(() => expect(screen.getByText(/network/)).toBeInTheDocument())
    expect(classrooms.refresh).not.toHaveBeenCalled()

    // Tapping finish again must not orphan a second classroom or duplicate Alex.
    await userEvent.click(screen.getByRole('button', { name: 'Add 2 & finish' }))
    await waitFor(() => expect(classrooms.refresh).toHaveBeenCalled())

    expect(api.createClassroom).toHaveBeenCalledOnce()
    expect(api.startSchoolYear).toHaveBeenCalledOnce()
    const alexCalls = api.createStudent.mock.calls.filter(c => c[1].name === 'Alex Kim')
    expect(alexCalls).toHaveLength(1)
    expect(classrooms.setActiveId).toHaveBeenCalledWith('c-new')
  })

  it('goes back a step without losing the name', async () => {
    render(<OnboardingWizard api={makeApi()} classrooms={makeClassrooms()} onSignOut={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/Mrs. Smith/), 'Room 12')
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByPlaceholderText(/Mrs. Smith/)).toHaveValue('Room 12')
  })
})
