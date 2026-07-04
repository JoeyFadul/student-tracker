import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders an img when the student has a photo URL', () => {
    render(<Avatar student={{ name: 'Maya', photo: 'https://example.com/p.jpg' }} />)
    expect(screen.getByRole('img', { name: 'Maya' })).toHaveAttribute('src', 'https://example.com/p.jpg')
  })

  it('renders the emoji when photo is not a URL', () => {
    render(<Avatar student={{ name: 'Sam', photo: '🐢' }} />)
    expect(screen.getByText('🐢')).toBeInTheDocument()
  })

  it('falls back to the default seedling', () => {
    render(<Avatar student={{ name: 'New kid', photo: '' }} />)
    expect(screen.getByText('🌱')).toBeInTheDocument()
  })
})
