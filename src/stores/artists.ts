import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Artist } from '@/types'

// Import images
import ghostNoizeAvatar from '@/assets/styles/image/roaster/GHOST_NOIZE_Bosque_Records/Photos/IMG_4026.PNG'
import foeXanAvatar from '@/assets/styles/image/roaster/FOE_XAN_Bosque_Records/Photos/DSC03019-Enhanced-NR.jpg'
import foeXanLogo from '@/assets/styles/image/roaster/FOE_XAN_Bosque_Records/Logos/Foe_Xan Logo Skull.png'
import cosmikFrequencyAvatar from '@/assets/styles/image/roaster/COSMIK_FREQUENCY_Bosque_Records/Photos/IMG_1197.jpeg'
import brainwavezAvatar from '@/assets/styles/image/roaster/BRAINWAVEZ_Bosque_Records/Photos/e03f7430-633b-44c1-b2e7-3cc2400ef789.jpg'
import brainwavezLogo from '@/assets/styles/image/roaster/BRAINWAVEZ_Bosque_Records/Logos/IMG_4011.PNG'

// Mock artist data with real roster images
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Ghost Noize',
    slug: 'ghost-noize',
    featured: true,
    avatar: ghostNoizeAvatar,
    bio: 'Emerging from the shadows of the digital realm, Ghost Noize crafts haunting soundscapes that bridge the gap between the ethereal and the earthly.',
    genre: 'Dark Psytrance',
    socialLinks: {
      soundcloud: '#',
      facebook: '#',
      instagram: '#'
    },
    releases: []
  },
  {
    id: '2', 
    name: 'Foe Xan',
    slug: 'foe-xan',
    featured: true,
    avatar: foeXanAvatar,
    logo: foeXanLogo,
    bio: 'Foe Xan weaves dark tales through pulsating rhythms, drawing inspiration from ancient forests and mystical encounters.',
    genre: 'Forest Psytrance',
    socialLinks: {
      soundcloud: '#',
      bandcamp: '#',
      instagram: '#'
    },
    releases: []
  },
  {
    id: '3',
    name: 'Cosmik Frequency',
    slug: 'cosmik-frequency', 
    featured: true,
    avatar: cosmikFrequencyAvatar,
    bio: 'Transmitting cosmic vibrations through deep bass frequencies, Cosmik Frequency explores the infinite expanse of consciousness.',
    genre: 'Cosmic Psytrance',
    socialLinks: {
      soundcloud: '#',
      facebook: '#'
    },
    releases: []
  },
  {
    id: '4',
    name: 'Brainwavez',
    slug: 'brainwavez',
    featured: true,
    avatar: brainwavezAvatar,
    logo: brainwavezLogo,
    bio: 'Manipulating neural pathways through intricate sound design, Brainwavez creates immersive journeys into altered states of consciousness.',
    genre: 'Progressive Psytrance',
    socialLinks: {
      soundcloud: '#',
      instagram: '#',
      bandcamp: '#'
    },
    releases: []
  }
]

export const useArtistsStore = defineStore('artists', () => {
  const artists: Ref<Artist[]> = ref([])
  const currentArtist: Ref<Artist | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  const { get } = useApi()
  
  // Computed
  const featuredArtists: ComputedRef<Artist[]> = computed(() => {
    // Use store data if available, otherwise use mock data
    if (artists.value.length > 0) {
      return artists.value.filter(artist => artist.featured).slice(0, 6)
    }
    return mockArtists.filter(artist => artist.featured).slice(0, 6)
  })
  
  const artistsWithReleases: ComputedRef<Artist[]> = computed(() =>
    artists.value.filter(artist => artist.releases && artist.releases.length > 0)
  )

  const allArtists: ComputedRef<Artist[]> = computed(() => {
    // Use store data if available, otherwise use mock data
    if (artists.value.length > 0) {
      return artists.value
    }
    return mockArtists
  })
  
  // Actions
  const fetchArtists = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      const data: Artist[] = await get('/artists')
      artists.value = data
    } catch (err: any) {
      error.value = err.message
      console.error('Failed to fetch artists:', err)
      console.info('Using mock artists data as fallback')
      // Mock data will be used as fallback
    } finally {
      loading.value = false
    }
  }
  
  const fetchArtistBySlug = async (slug: string): Promise<Artist> => {
    try {
      loading.value = true
      error.value = null
      const data: Artist = await get(`/artists/${slug}`)
      currentArtist.value = data
      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Failed to fetch artist:', err)
      
      // Try to find in mock data
      const mockArtist = mockArtists.find(artist => artist.slug === slug)
      if (mockArtist) {
        currentArtist.value = mockArtist
        return mockArtist
      }
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const getArtistBySlug = (slug: string): Artist | undefined => {
    const storeArtist = artists.value.find(artist => artist.slug === slug)
    if (storeArtist) return storeArtist
    return mockArtists.find(artist => artist.slug === slug)
  }
  
  const getArtistById = (id: string): Artist | undefined => {
    const storeArtist = artists.value.find(artist => artist.id === id)
    if (storeArtist) return storeArtist
    return mockArtists.find(artist => artist.id === id)
  }
  
  return {
    // State
    artists,
    currentArtist,
    loading,
    error,
    
    // Getters
    featuredArtists,
    artistsWithReleases,
    allArtists,
    
    // Actions
    fetchArtists,
    fetchArtistBySlug,
    getArtistBySlug,
    getArtistById
  }
}) 