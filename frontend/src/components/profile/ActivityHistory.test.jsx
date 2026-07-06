import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
