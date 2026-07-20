import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActivityHistory } from './ActivityHistory'

describe('ActivityHistory', () => {
  it('shows placeholder lines instead of the empty state while history is loading', () => {
    render(<ActivityHistory initialItems={[]} initialCursor={null} loading />)
    expect(screen.queryByText('No activity yet')).not.toBeInTheDocument()
  })

  it('shows the empty state once loading finishes with no events', () => {
    render(<ActivityHistory initialItems={[]} initialCursor={null} loading={false} />)
    expect(screen.getByText('No activity yet')).toBeInTheDocument()
  })

  it('renders events when they exist', () => {
    const items = [{ delta: 2, reason: 'Kindness', timestamp: '2026-07-05T10:00:00.000Z' }]
    render(<ActivityHistory initialItems={items} initialCursor={null} loading={false} />)
    expect(screen.getByText('Kindness')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('has no delete affordance without onDeleteEvent (read-only archives)', () => {
    const items = [{ delta: 2, reason: 'Kindness', timestamp: '2026-07-05T10:00:00.000Z' }]
    render(<ActivityHistory initialItems={items} initialCursor={null} loading={false} />)
    expect(screen.queryByRole('button', { name: /Delete event/ })).not.toBeInTheDocument()
  })

  it('confirms, calls onDeleteEvent, and removes the row on delete', async () => {
    const onDeleteEvent = vi.fn().mockResolvedValue()
    const items = [{ delta: 2, reason: 'Kindness', timestamp: '2026-07-05T10:00:00.000Z' }]
    render(
      <ActivityHistory
        initialItems={items}
        initialCursor={null}
        loading={false}
        onDeleteEvent={onDeleteEvent}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Delete event: Kindness' }))
    await userEvent.click(screen.getByRole('button', { name: /^Delete$/ }))
    expect(onDeleteEvent).toHaveBeenCalledExactlyOnceWith('2026-07-05T10:00:00.000Z', 2)
    await waitFor(() => expect(screen.queryByText('Kindness')).not.toBeInTheDocument())
  })

  it('keeps the row when the delete fails', async () => {
    const onDeleteEvent = vi.fn().mockRejectedValue(new Error('API 500: nope'))
    const items = [{ delta: 2, reason: 'Kindness', timestamp: '2026-07-05T10:00:00.000Z' }]
    render(
      <ActivityHistory
        initialItems={items}
        initialCursor={null}
        loading={false}
        onDeleteEvent={onDeleteEvent}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: 'Delete event: Kindness' }))
    await userEvent.click(screen.getByRole('button', { name: /^Delete$/ }))
    expect(await screen.findByText('API 500: nope')).toBeInTheDocument()
    expect(screen.getByText('Kindness')).toBeInTheDocument()
  })
})
