import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Release } from '@/types'
import catalogData from '@/data/catalog.json'

const verifiedReleases: Release[] = (catalogData as Release[]).map((release) => ({
  ...release,
  tracks: release.tracks.map((track) => ({
    ...track,
    preview: release.bandcampUrl
  }))
}))


export const useReleasesStore = defineStore('releases', () => {
  const releases: Ref<Release[]> = ref<Release[]>(verifiedReleases)
  const currentRelease: Ref<Release | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  const { get } = useApi()
  
  // Computed
  const allReleases: ComputedRef<Release[]> = computed(() => releases.value)
  
  const featuredReleases: ComputedRef<Release[]> = computed(() => {
    return allReleases.value.filter(release => release.featured).slice(0, 4)
  })
  
  const latestReleases: ComputedRef<Release[]> = computed(() => {
    return [...allReleases.value]
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
      if (Array.isArray(data) && data.length > 0) {
        releases.value = data
      }
      console.log(`[Releases Store] Database release count: ${Array.isArray(data) ? data.length : 0}`)
    } catch (err: any) {
      console.warn('[Releases Store] Database API unavailable. Verified catalog stays in place:', err.message || err)
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
      if (!Array.isArray(data) || data.length === 0) {
        return
      }
      
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
        if (!data?.slug) {
          throw new Error('Release not found')
        }
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
        
        const catalogRelease = verifiedReleases.find(release => release.slug === slug)
        if (catalogRelease) {
          currentRelease.value = catalogRelease
          loading.value = false
          return catalogRelease
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
    return verifiedReleases.find(release => release.slug === slug)
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