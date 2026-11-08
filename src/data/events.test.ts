import { describe, expect, it } from 'vitest'
import { formatEventDate, labelEvents } from './events'
import { portraits } from './portraits'

describe('label events', () => {
  it('keeps events newest-first by start date', () => {
    expect(labelEvents.length).toBeGreaterThan(0)
    for (let index = 1; index < labelEvents.length; index += 1) {
      expect(labelEvents[index - 1]!.start >= labelEvents[index]!.start).toBe(true)
    }
  })

  it('includes Concilium and Gates posters with distinct artist faces', () => {
    const concilium = labelEvents.find((event) => event.id === 'bosque-concilium')
    const gates = labelEvents.find((event) => event.id === 'gates-to-xibalba')
    expect(concilium?.images.length).toBeGreaterThan(0)
    expect(gates?.images.length).toBeGreaterThan(0)
    const ixmuk = concilium?.artists.find((artist) => artist.id === 'ixmuk')
    const brainwavez = gates?.artists.find((artist) => artist.id === 'brainwavez')
    expect(ixmuk?.image).toBe(portraits.ixmuk)
    expect(brainwavez?.image).toBe(portraits.brainwavez)
    expect(portraits.ixmuk).not.toBe(portraits.brainwavez)
  })

  it('formats single-day and multi-day ranges', () => {
    const single = labelEvents.find((event) => !event.end || event.end === event.start)
    const multi = labelEvents.find((event) => event.end && event.end !== event.start)
    expect(single && formatEventDate(single)).toMatch(/\d{4}/)
    expect(multi && formatEventDate(multi)).toMatch(/–|–|-/)
  })
})
