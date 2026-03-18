import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useApi } from '@/composables/useApi'
import { useRoasterImages } from '@/composables/useRoasterImages'
import type { Release } from '@/types'

// Get roaster images
const { getArtistImage } = useRoasterImages()

// Mock data for development when API is unavailable
const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Shaman\'s Dream',
    slug: 'shamans-dream',
    description: 'A mystical journey through ancient forest paths',
    releaseDate: '2023-06-15',
    coverImage: getArtistImage('ghost-noize') || '',
    featured: true,
    price: 12.99,
    artist: { id: '1', name: 'Ghost Noize' },
    tracks: [
      { id: '1', title: 'Awakening', duration: 480, preview: '#' },
      { id: '2', title: 'Vision Quest', duration: 360, preview: '#' }
    ],
    tags: ['psytrance', 'forest', 'shamanic']
  },
  {
    id: '2',
    title: 'Moonlit Ritual',
    slug: 'moonlit-ritual',
    description: 'Ceremonial sounds under the sacred moon',
    releaseDate: '2023-04-22',
    coverImage: getArtistImage('foe-xan') || '',
    featured: true,
    price: 10.99,
    artist: { id: '2', name: 'Foe Xan' },
    tracks: [
      { id: '3', title: 'Lunar Dance', duration: 420, preview: '#' }
    ],
    tags: ['psytrance', 'lunar', 'ritual']
  },
  {
    id: '3',
    title: 'Ancient Roots',
    slug: 'ancient-roots',
    description: 'Deep bass frequencies from the earth\'s core',
    releaseDate: '2023-02-10',
    coverImage: getArtistImage('cosmik-frequency') || '',
    featured: true,
    price: 15.99,
    artist: { id: '3', name: 'Cosmik Frequency' },
    tracks: [
      { id: '4', title: 'Earth Pulse', duration: 540, preview: '#' },
      { id: '5', title: 'Root Network', duration: 390, preview: '#' },
      { id: '6', title: 'Fungal Wisdom', duration: 450, preview: '#' }
    ],
    tags: ['psytrance', 'forest', 'earth', 'bass']
  },
  {
    id: '4',
    title: 'Spiral Grove',
    slug: 'spiral-grove',
    description: 'Spiraling melodies through twisted branches',
    releaseDate: '2022-12-05',
    coverImage: getArtistImage('brainwavez') || '',
    featured: true,
    price: 11.99,
    artist: { id: '4', name: 'Brainwavez' },
    tracks: [
      { id: '7', title: 'Twisted Path', duration: 480, preview: '#' }
    ],
    tags: ['psytrance', 'progressive', 'forest']
  },
  {
    id: '5',
    title: 'Ancient Whispers',
    slug: 'ancient-whispers',
    description: 'Echoes from the depths of the forest',
    releaseDate: '2023-08-15',
    coverImage: getArtistImage('ghost-noize', 1) || '',
    featured: false,
    price: 9.99,
    artist: { id: '1', name: 'Ghost Noize' },
    tracks: [
      { id: '8', title: 'Forest Whispers', duration: 420, preview: '#' },
      { id: '9', title: 'Ancient Call', duration: 380, preview: '#' }
    ],
    tags: ['psytrance', 'dark', 'forest']
  },
  {
    id: '6',
    title: 'Ethereal Paths',
    slug: 'ethereal-paths',
    description: 'Journey through mystical dimensions',
    releaseDate: '2023-07-20',
    coverImage: getArtistImage('foe-xan', 1) || '',
    featured: false,
    price: 11.99,
    artist: { id: '2', name: 'Foe Xan' },
    tracks: [
      { id: '10', title: 'Ethereal Journey', duration: 450, preview: '#' }
    ],
    tags: ['psytrance', 'ethereal', 'mystical']
  }
]

export const useReleasesStore = defineStore('releases', () => {
  const releases: Ref<Release[]> = ref([])
  const currentRelease: Ref<Release | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  const { get } = useApi()
  
  // Computed
  const allReleases: ComputedRef<Release[]> = computed(() => {
    // Use store releases if available, otherwise fallback to mock data
    return releases.value.length > 0 ? releases.value : mockReleases
  })
  
  const featuredReleases: ComputedRef<Release[]> = computed(() => {
    return allReleases.value.filter(release => release.featured).slice(0, 4)
  })
  
  const latestReleases: ComputedRef<Release[]> = computed(() => {
    return allReleases.value
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
      .slice(0, 8)
  })
  
  // Actions
  const fetchReleases = async (useBandcamp: boolean = true): Promise<void> => {
    loading.value = true
    error.value = null
    
    // Try to fetch from Bandcamp first if enabled
    if (useBandcamp) {
      try {
        console.log('[Releases Store] Fetching releases from Bandcamp API...')
        const bandcampResponse = await get('/bandcamp/releases')
        console.log('[Releases Store] Bandcamp API response:', { 
          success: bandcampResponse.success, 
          count: bandcampResponse.releases?.length || 0 
        })
        
        if (bandcampResponse.success && bandcampResponse.releases && bandcampResponse.releases.length > 0) {
          // Transform Bandcamp releases to match our Release interface
          releases.value = bandcampResponse.releases.map((bcRelease: any) => ({
            id: bcRelease.id,
            title: bcRelease.title,
            slug: bcRelease.slug,
            description: bcRelease.description || '',
            releaseDate: bcRelease.releaseDate,
            coverImage: bcRelease.coverImage,
            featured: bcRelease.featured || false,
            price: bcRelease.price,
            artist: bcRelease.artist,
            tracks: bcRelease.tracks || [],
            tags: bcRelease.tags || []
          }))
          console.log(`[Releases Store] Successfully loaded ${releases.value.length} releases from Bandcamp`)
          console.log(releases);
          loading.value = false
          return
        } else {
          console.warn('[Releases Store] Bandcamp API returned empty results, falling back to database')
        }
      } catch (bandcampErr: any) {
        console.warn('[Releases Store] Bandcamp fetch failed, falling back to database:', bandcampErr.message || bandcampErr)
        // Fall through to database fetch
      }
    }
    
    // Fallback to database releases
    try {
      console.log('[Releases Store] Fetching releases from database API...')
      const data: Release[] = await get('/releases')
      releases.value = data
      console.log(`[Releases Store] Successfully loaded ${releases.value.length} releases from database`)
    } catch (err: any) {
      console.warn('[Releases Store] Database API unavailable, will use mock data as fallback:', err.message || err)
      // Don't set error state - computed properties will use mock data as fallback
      // Clear releases array so computed fallback works
      releases.value = []
    } finally {
      loading.value = false
    }
  }
  
  const fetchFeaturedReleases = async (useBandcamp: boolean = true): Promise<void> => {
    loading.value = true
    error.value = null
    
    // Try to fetch from Bandcamp first if enabled
    if (useBandcamp) {
      try {
        console.log('[Releases Store] Fetching featured releases from Bandcamp API...')
        const bandcampResponse = await get('/bandcamp/releases/featured')
        console.log('[Releases Store] Bandcamp featured API response:', { 
          success: bandcampResponse.success, 
          count: bandcampResponse.releases?.length || 0 
        })
        
        if (bandcampResponse.success && bandcampResponse.releases && bandcampResponse.releases.length > 0) {
          // Transform Bandcamp releases to match our Release interface
          const featuredReleases = bandcampResponse.releases.map((bcRelease: any) => ({
            id: bcRelease.id,
            title: bcRelease.title,
            slug: bcRelease.slug,
            description: bcRelease.description || '',
            releaseDate: bcRelease.releaseDate,
            coverImage: bcRelease.coverImage,
            featured: true,
            price: bcRelease.price,
            artist: bcRelease.artist,
            tracks: bcRelease.tracks || [],
            tags: bcRelease.tags || []
          }))
          
          // If releases array is empty, populate it with featured releases
          // Otherwise, merge featured releases into existing array
          if (releases.value.length === 0) {
            releases.value = featuredReleases
            console.log(`[Releases Store] Populated releases array with ${releases.value.length} featured releases from Bandcamp`)
          } else {
            // Merge featured releases into existing array
            featuredReleases.forEach((featured: Release) => {
              const index = releases.value.findIndex(r => r.id === featured.id)
              if (index >= 0) {
                releases.value[index] = featured
              } else {
                releases.value.push(featured)
              }
            })
            console.log(`[Releases Store] Merged ${featuredReleases.length} featured releases from Bandcamp into existing array`)
          }
          loading.value = false
          return
        } else {
          console.warn('[Releases Store] Bandcamp featured API returned empty results, falling back to database')
        }
      } catch (bandcampErr: any) {
        console.warn('[Releases Store] Bandcamp featured fetch failed, falling back to database:', bandcampErr.message || bandcampErr)
        // Fall through to database fetch
      }
    }
    
    // Fallback to database featured releases
    try {
      console.log('[Releases Store] Fetching featured releases from database API...')
      const data: Release[] = await get('/releases/featured')
      
      // If releases array is empty, populate it with featured releases
      if (releases.value.length === 0) {
        releases.value = data
        console.log(`[Releases Store] Populated releases array with ${releases.value.length} featured releases from database`)
      } else {
        // Merge featured releases into existing array
        data.forEach(featured => {
          const index = releases.value.findIndex(r => r.id === featured.id)
          if (index >= 0) {
            releases.value[index] = featured
          } else {
            releases.value.push(featured)
          }
        })
        console.log(`[Releases Store] Merged ${data.length} featured releases from database into existing array`)
      }
    } catch (err: any) {
      console.warn('[Releases Store] Database featured API unavailable, will use mock data as fallback:', err.message || err)
      // Don't clear releases.value here - let computed fallback handle it
    } finally {
      loading.value = false
    }
  }
  
  const fetchReleaseBySlug = async (slug: string): Promise<Release> => {
    try {
      loading.value = true
      error.value = null
      
      // First check if we already have this release in the store (includes Bandcamp data)
      const existingRelease = releases.value.find(r => r.slug === slug)
      if (existingRelease) {
        console.log(`[Releases Store] Found release "${slug}" in loaded releases`)
        currentRelease.value = existingRelease
        loading.value = false
        return existingRelease
      }
      
      // Also check allReleases computed (which includes mock fallback)
      const allRelease = getReleaseBySlug(slug)
      if (allRelease) {
        console.log(`[Releases Store] Found release "${slug}" in all releases`)
        currentRelease.value = allRelease
        loading.value = false
        return allRelease
      }
      
      // Try to fetch from database API
      try {
        const data: Release = await get(`/releases/${slug}`)
        currentRelease.value = data
        // Add to releases array if not already there
        if (!releases.value.find(r => r.id === data.id)) {
          releases.value.push(data)
        }
        loading.value = false
        return data
      } catch (apiErr: any) {
        console.warn(`[Releases Store] API fetch failed for "${slug}", checking Bandcamp...`)
        
        // If API fails, try fetching from Bandcamp
        try {
          const bandcampData = await get('/bandcamp/releases')
          if (bandcampData.success && bandcampData.releases) {
            const bandcampRelease = bandcampData.releases.find((r: Release) => r.slug === slug)
            if (bandcampRelease) {
              console.log(`[Releases Store] Found release "${slug}" in Bandcamp data`)
              // Add to releases array
              if (!releases.value.find(r => r.id === bandcampRelease.id)) {
                releases.value.push(bandcampRelease)
              }
              currentRelease.value = bandcampRelease
              loading.value = false
              return bandcampRelease
            }
          }
        } catch (bandcampErr) {
          console.warn('[Releases Store] Bandcamp fetch also failed:', bandcampErr)
        }
        
        // If all else fails, try mock data
        const mockRelease = mockReleases.find(release => release.slug === slug)
        if (mockRelease) {
          console.log(`[Releases Store] Using mock data for "${slug}"`)
          currentRelease.value = mockRelease
          loading.value = false
          return mockRelease
        }
        
        throw apiErr
      }
    } catch (err: any) {
      error.value = err.message
      console.error(`[Releases Store] Failed to fetch release "${slug}":`, err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const getReleaseBySlug = (slug: string): Release | undefined => {
    const storeRelease = releases.value.find(release => release.slug === slug)
    if (storeRelease) return storeRelease
    return mockReleases.find(release => release.slug === slug)
  }
  
  return {
    // State
    releases,
    currentRelease,
    loading,
    error,
    
    // Getters
    allReleases,
    featuredReleases,
    latestReleases,
    
    // Actions
    fetchReleases,
    fetchFeaturedReleases,
    fetchReleaseBySlug,
    getReleaseBySlug
  }
}) 