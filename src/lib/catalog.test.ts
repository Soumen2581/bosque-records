import { describe, expect, it } from 'vitest'
import {
  artistById,
  formatDate,
  formatDuration,
  releaseBySlug,
  releases,
  rosterArtists,
  samePersonNote
} from './catalog'

describe('catalog', () => {
  it('loads published releases newest first', () => {
    expect(releases.length).toBeGreaterThan(0)
    for (let index = 1; index < releases.length; index += 1) {
      expect(releases[index - 1]!.releaseDate >= releases[index]!.releaseDate).toBe(true)
    }
  })

  it('resolves featured Future Is Now release by slug', () => {
    const release = releaseBySlug('the-future-is-now')
    expect(release).toBeTruthy()
    expect(release!.featured).toBe(true)
    expect(release!.bandcampUrl).toMatch(/bandcamp\.com/)
    expect(release!.tracks.length).toBeGreaterThan(0)
  })

  it('keeps Brainwavez and IxMuk as one person with two projects', () => {
    const brainwavez = artistById('brainwavez')
    const ixmuk = artistById('ixmuk')
    expect(brainwavez?.personId).toBe('brainwavez-ixmuk')
    expect(ixmuk?.personId).toBe('brainwavez-ixmuk')
    expect(samePersonNote).toMatch(/Brainwavez and IxMuk/)
  })

  it('exposes roster artists from verified label roles', () => {
    expect(rosterArtists.length).toBeGreaterThan(0)
    expect(rosterArtists.every((artist) => artist.role === 'label' || artist.role === 'release')).toBe(true)
  })

  it('formats dates and durations for the UI', () => {
    expect(formatDate('2026-07-21')).toBe('July 21, 2026')
    expect(formatDuration(125)).toBe('2:05')
    expect(formatDuration(0)).toBe('')
  })
})
