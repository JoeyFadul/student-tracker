import { describe, it, expect } from 'vitest'
import { sortStudents } from './SortControl'

const students = [
  { id: 'a', name: 'Zoe', points: 10, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'b', name: 'Ana', points: 30, createdAt: '2026-03-01T00:00:00Z' },
  { id: 'c', name: 'Mia', points: 20, createdAt: '2026-02-01T00:00:00Z' },
]

describe('sortStudents', () => {
  it('sorts by name A–Z', () => {
    expect(sortStudents(students, 'name').map(s => s.name)).toEqual(['Ana', 'Mia', 'Zoe'])
  })

  it('sorts by points descending and ascending', () => {
    expect(sortStudents(students, 'pointsDesc').map(s => s.points)).toEqual([30, 20, 10])
    expect(sortStudents(students, 'pointsAsc').map(s => s.points)).toEqual([10, 20, 30])
  })

  it('defaults to most recently created first', () => {
    expect(sortStudents(students, 'recent').map(s => s.id)).toEqual(['b', 'c', 'a'])
    expect(sortStudents(students, 'bogus-key').map(s => s.id)).toEqual(['b', 'c', 'a'])
  })

  it('does not mutate the input array', () => {
    const copy = [...students]
    sortStudents(students, 'name')
    expect(students).toEqual(copy)
  })
})
