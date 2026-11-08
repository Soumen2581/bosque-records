import raw from '@/data/catalog.json'
import { portraits } from '@/data/portraits'

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

export interface Credit {
  release: Release
  detail: string
}

export interface ArtistSummary {
  id: string
  name: string
  releases: Release[]
  credits: Credit[]
  role: 'label' | 'release' | 'compilation' | 'guest'
  image?: string
  instagram?: string
  personId?: string
}

const samePerson = 'Brainwavez and IxMuk are two projects by the same person.'

function nameKey(name: string) {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function splitBilledArtists(head: string) {
  return head.split(/\s+vs\s+/i).map((name) => name.trim()).filter(Boolean)
}

const byId = new Map<string, ArtistSummary>()

function ensure(id: string, name: string, role: ArtistSummary['role']) {
  const current = byId.get(id)
  if (current) {
    if (current.role === 'guest' || (current.role === 'compilation' && role === 'release')) current.role = role
    return current
  }
  const created: ArtistSummary = { id, name, releases: [], credits: [], role }
  byId.set(id, created)
  return created
}

for (const release of releases) {
  const artist = ensure(release.artist.id, release.artist.name, 'release')
  artist.releases.push(release)
}

const profiles: Record<string, Partial<ArtistSummary>> = {
  'foe-xan': {
    role: 'label',
    image: portraits['foe-xan'],
    instagram: 'https://www.instagram.com/fo3xan.bosque/'
  },
  'cosmik-frequency': {
    role: 'label',
    image: portraits['cosmik-frequency'],
    instagram: 'https://www.instagram.com/cosmik_frequency/'
  },
  'ghost-noize': {
    name: 'Ghost Noize',
    role: 'label',
    image: portraits['ghost-noize'],
    instagram: 'https://www.instagram.com/ghost_noize/'
  },
  brainwavez: {
    name: 'Brainwavez',
    role: 'label',
    image: portraits.brainwavez,
    personId: 'brainwavez-ixmuk'
  },
  ixmuk: {
    name: 'IxMuk',
    role: 'label',
    image: portraits.ixmuk,
    personId: 'brainwavez-ixmuk'
  },
  n3xu5: {
    name: 'N3xu5',
    role: 'label',
    image: portraits.n3xu5,
    instagram: 'https://www.instagram.com/n3xu5_psy/'
  },
  cariy: {
    name: 'Ācariyã',
    image: portraits.acariya,
    instagram: 'https://www.instagram.com/acariyapsy/'
  },
  'dinosaur-spaceship': {
    name: 'Dinosaur Spaceship',
    role: 'guest',
    image: portraits['dinosaur-spaceship'],
    instagram: 'https://www.instagram.com/dinosaur_spaceship/'
  },
  inpsydnoize: {
    name: 'Inpsydnoize',
    role: 'guest',
    image: portraits.inpsydnoize,
    instagram: 'https://www.instagram.com/inpsydnoize/'
  },
  'psychic-reptiles': {
    name: 'Psychic Reptiles',
    role: 'guest',
    image: portraits['psychic-reptiles'],
    instagram: 'https://www.instagram.com/psychicreptiles/'
  },
  svaaha: {
    name: 'Svaaha',
    role: 'guest',
    image: portraits.svaaha,
    instagram: 'https://www.instagram.com/_svaaha_/'
  },
  tetzo: {
    name: 'Tetzo',
    role: 'guest',
    image: portraits.tetzo,
    instagram: 'https://www.instagram.com/tetzo_burninginocean/'
  },
  xhanok: {
    name: 'Xhanok',
    role: 'guest',
    image: portraits.xhanok,
    instagram: 'https://www.instagram.com/xhanok_music/'
  },
  zyamaliman: {
    name: 'Zyamaliman',
    role: 'guest',
    image: portraits.zyamaliman,
    instagram: 'https://www.instagram.com/zyamaliman.live/'
  }
}

for (const [id, profile] of Object.entries(profiles)) {
  const artist = ensure(id, profile.name ?? id, profile.role ?? 'guest')
  const { role, ...rest } = profile
  Object.assign(artist, rest)
  if (role && (artist.role === 'guest' || role === 'label' || role === 'release')) {
    if (!(artist.role === 'label' && role === 'guest') && !(artist.role === 'release' && role === 'guest')) {
      artist.role = role
    }
  }
}

const idByName = new Map<string, string>()
for (const artist of byId.values()) idByName.set(nameKey(artist.name), artist.id)

function addCredit(name: string, release: Release, detail: string) {
  const artist = byId.get(idByName.get(nameKey(name)) ?? '')
  if (!artist) return
  if (artist.releases.some((item) => item.id === release.id)) return
  if (artist.credits.some((credit) => credit.release.id === release.id && credit.detail === detail)) return
  artist.credits.push({ release, detail })
}

for (const release of releases) {
  const compilation = release.releaseType === 'Compilation'
  for (const track of release.tracks) {
    const featured = track.title.match(/\(Feat\.?\s+([^)]+)\)/i)
    if (featured) addCredit(featured[1], release, track.title)
    if (!compilation) continue
    const separator = track.title.match(/\s-\s?/)
    const head = separator?.index ? track.title.slice(0, separator.index).trim() : ''
    if (!head) continue
    for (const name of splitBilledArtists(head)) addCredit(name, release, track.title)
  }
}

export const artists: ArtistSummary[] = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))

export const rosterArtists = artists.filter((artist) => artist.role === 'label' || artist.role === 'release')

export const samePersonNote = samePerson

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
