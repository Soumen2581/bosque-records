import raw from '@/data/catalog.json'

export interface Track {
  id: string
  title: string
  duration: number
  position: number
}

export interface Release {
  id: string
  title: string
  slug: string
  releaseDate: string
  releaseType: string
  featured: boolean
  artist: { id: string; name: string }
  bandcampUrl: string
  embedUrl: string
  coverImage: string
  tracks: Track[]
  tags: string[]
}

export const releases: Release[] = [...(raw as Release[])].sort(
  (a, b) => b.releaseDate.localeCompare(a.releaseDate)
)

export function releaseBySlug(slug: string) {
  return releases.find((release) => release.slug === slug)
}

export interface ArtistSummary {
  id: string
  name: string
  releases: Release[]
}

export const artists: ArtistSummary[] = Object.values(
  releases.reduce<Record<string, ArtistSummary>>((groups, release) => {
    const key = release.artist.id
    const group = groups[key] ?? { id: key, name: release.artist.name, releases: [] }
    group.releases.push(release)
    groups[key] = group
    return groups
  }, {})
).sort((a, b) => a.name.localeCompare(b.name))

export function artistById(id: string) {
  return artists.find((artist) => artist.id === id)
}

export function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatDuration(seconds: number) {
  if (!seconds) return ''
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export const years = [...new Set(releases.map((release) => release.releaseDate.slice(0, 4)))]
export const releaseTypes = [...new Set(releases.map((release) => release.releaseType))]
