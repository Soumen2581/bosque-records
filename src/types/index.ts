// Base interfaces
export interface Track {
  id: string
  title: string
  duration: number
  preview?: string
  position?: number
}

export interface Artist {
  id: string
  name: string
  slug: string
  featured: boolean
  avatar: string
  logo?: string
  bio: string
  genre: string
  socialLinks: {
    soundcloud?: string
    facebook?: string
    instagram?: string
    bandcamp?: string
  }
  releases: Release[]
}

export interface Release {
  id: string
  title: string
  slug: string
  description?: string
  releaseDate: string
  coverImage: string
  featured: boolean
  price?: number
  releaseType?: string
  bandcampUrl?: string
  embedUrl?: string
  artist: Pick<Artist, 'id' | 'name'>
  tracks: Track[]
  tags: string[]
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  date: string
  venue: string
  location: string
  artists: Pick<Artist, 'id' | 'name'>[]
  ticketUrl?: string
  price?: number
  featured: boolean
}

// API response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  status: number
}

// Store state types
export interface ReleasesStoreState {
  releases: Release[]
  currentRelease: Release | null
  loading: boolean
  error: string | null
}

export interface ArtistsStoreState {
  artists: Artist[]
  currentArtist: Artist | null
  loading: boolean
  error: string | null
}

export interface EventsStoreState {
  events: Event[]
  currentEvent: Event | null
  loading: boolean
  error: string | null
}

// API composable types
export interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string
}

export interface UseApiReturn {
  loading: Ref<boolean>
  error: Ref<string | null>
  apiCall: (endpoint: string, options?: ApiCallOptions) => Promise<any>
  get: (endpoint: string) => Promise<any>
  post: (endpoint: string, data: any) => Promise<any>
  put: (endpoint: string, data: any) => Promise<any>
  del: (endpoint: string) => Promise<any>
}

// Import ref type from Vue
import type { Ref } from 'vue' 