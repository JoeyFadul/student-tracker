import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useReasons } from './useReasons'
import { PRESET_REASONS } from '../lib/reasons'

describe('useReasons', () => {
  it('loads the classroom reasons', async () => {
    const api = { getClassroom: vi.fn().mockResolvedValue({ reasons: ['A', 'B'] }), updateReasons: vi.fn() }
    const { result } = renderHook(() => useReasons(api, 'c1'))
    await waitFor(() => expect(result.current.reasons).toEqual(['A', 'B']))
    expect(api.getClassroom).toHaveBeenCalledWith('c1')
  })

  it('falls back to presets when the load fails', async () => {
    const api = { getClassroom: vi.fn().mockRejectedValue(new Error('nope')), updateReasons: vi.fn() }
    const { result } = renderHook(() => useReasons(api, 'c1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.reasons).toEqual(PRESET_REASONS)
  })

  it('save() PUTs the list and updates local state', async () => {
    const api = {
      getClassroom: vi.fn().mockResolvedValue({ reasons: ['A'] }),
      updateReasons: vi.fn().mockResolvedValue({ reasons: ['A', 'B'] }),
    }
    const { result } = renderHook(() => useReasons(api, 'c1'))
    await waitFor(() => expect(result.current.reasons).toEqual(['A']))
    await act(async () => { await result.current.save(['A', 'B']) })
    expect(api.updateReasons).toHaveBeenCalledWith('c1', ['A', 'B'])
    expect(result.current.reasons).toEqual(['A', 'B'])
  })

  it('uses presets and does not fetch without a classroom id', () => {
    const api = { getClassroom: vi.fn(), updateReasons: vi.fn() }
    const { result } = renderHook(() => useReasons(api, null))
    expect(result.current.reasons).toEqual(PRESET_REASONS)
    expect(api.getClassroom).not.toHaveBeenCalled()
  })
})
