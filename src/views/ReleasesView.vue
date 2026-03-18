<template>
  <PageLayout>
      <!-- Header -->
      <PageHeader 
        type="records" 
        subtitle="Explore our catalog of mystical forest sounds and psychedelic journeys"
      />
      
      <!-- Filter Controls -->
      <ReleaseFilter
        v-model:filters="filters"
        :available-years="availableYears"
        :available-artists="availableArtists"
        :available-tags="availableTags"
        @update:filters="handleFilterUpdate"
      />
      
      <!-- Results Count -->
      <div v-if="!releasesStore.loading" class="mb-6">
        <p class="text-gray-medium text-center">
          <span v-if="filteredReleases.length > 0">
            Showing {{ filteredReleases.length }} of {{ allReleases.length }} releases
          </span>
          <span v-else>
            No releases found matching your criteria
          </span>
        </p>
      </div>
      
      <!-- Loading State -->
      <div v-if="releasesStore.loading && releasesStore.releases.length === 0" class="py-16">
        <LoadingSpinner 
          :full-screen="false"
          text="Loading releases..."
          subtitle="Gathering mystical sounds from the forest..."
          container-class="py-16"
        />
      </div>
      
      <!-- Releases Grid -->
      <ReleaseGrid
        v-if="!releasesStore.loading"
        :releases="paginatedReleases"
        :loading="releasesStore.loading"
        :current-page="currentPage"
        :total-pages="totalPages"
        :show-pagination="totalPages > 1"
        @play="handlePlay"
        @clear-filters="clearAllFilters"
        @previous-page="previousPage"
        @next-page="nextPage"
      />
      
      <!-- Audio Player -->
      <ReleasePlayer ref="audioPlayer" />
  </PageLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ReleaseFilter from '@/components/releases/ReleaseFilter.vue'
import ReleaseGrid from '@/components/releases/ReleaseGrid.vue'
import ReleaseSpinner from '@/components/releases/ReleaseSpinner.vue'
import ReleasePlayer from '@/components/releases/ReleasePlayer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useReleasesStore } from '@/stores/releases'
import { useArtistsStore } from '@/stores/artists'

const route = useRoute()
const router = useRouter()
const releasesStore = useReleasesStore()
const artistsStore = useArtistsStore()
const audioPlayer = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Filters
const filters = ref({
  search: '',
  year: '',
  artist: '',
  tags: [],
  sortBy: 'releaseDate-desc'
})

// Get all releases from store (store handles fallback to mock data if API fails)
const allReleases = computed(() => releasesStore.allReleases)

// Computed properties
const availableYears = computed(() => {
  const years = allReleases.value.map(release => 
    new Date(release.releaseDate).getFullYear()
  )
  return [...new Set(years)].sort((a, b) => b - a)
})

const availableArtists = computed(() => {
  // Get unique artists from releases
  const artistsMap = new Map()
  allReleases.value.forEach(release => {
    if (release.artist) {
      artistsMap.set(release.artist.id, release.artist)
    }
  })
  return Array.from(artistsMap.values())
})

const availableTags = computed(() => {
  const tags = allReleases.value.flatMap(release => release.tags || [])
  return [...new Set(tags)].sort()
})

const filteredReleases = computed(() => {
  let filtered = [...allReleases.value]
  
  // Search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(release => 
      release.title.toLowerCase().includes(searchTerm) ||
      release.artist.name.toLowerCase().includes(searchTerm) ||
      (release.tags && release.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    )
  }
  
  // Year filter
  if (filters.value.year) {
    filtered = filtered.filter(release => 
      new Date(release.releaseDate).getFullYear() === parseInt(filters.value.year)
    )
  }
  
  // Artist filter
  if (filters.value.artist) {
    filtered = filtered.filter(release => release.artist.id === filters.value.artist)
  }
  
  // Tags filter
  if (filters.value.tags.length > 0) {
    filtered = filtered.filter(release => 
      release.tags && filters.value.tags.every(tag => release.tags.includes(tag))
    )
  }
  
  // Sort
  filtered.sort((a, b) => {
    const [field, direction] = filters.value.sortBy.split('-')
    
    let aValue, bValue
    
    switch (field) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'artist':
        aValue = a.artist.name.toLowerCase()
        bValue = b.artist.name.toLowerCase()
        break
      case 'releaseDate':
        aValue = new Date(a.releaseDate)
        bValue = new Date(b.releaseDate)
        break
      default:
        return 0
    }
    
    if (direction === 'desc') {
      return aValue < bValue ? 1 : -1
    } else {
      return aValue > bValue ? 1 : -1
    }
  })
  
  return filtered
})

const totalPages = computed(() => 
  Math.ceil(filteredReleases.value.length / itemsPerPage)
)

const paginatedReleases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredReleases.value.slice(start, end)
})

// Methods
const handleFilterUpdate = (newFilters) => {
  filters.value = { ...newFilters }
  currentPage.value = 1 // Reset to first page when filters change
  updateUrlParams()
}

const clearAllFilters = () => {
  filters.value = {
    search: '',
    year: '',
    artist: '',
    tags: [],
    sortBy: 'releaseDate-desc'
  }
  currentPage.value = 1
  updateUrlParams()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    updateUrlParams()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    updateUrlParams()
  }
}

const updateUrlParams = () => {
  const query = {}
  
  if (filters.value.search) query.search = filters.value.search
  if (filters.value.year) query.year = filters.value.year
  if (filters.value.artist) query.artist = filters.value.artist
  if (filters.value.tags.length > 0) query.tags = filters.value.tags.join(',')
  if (filters.value.sortBy !== 'releaseDate-desc') query.sort = filters.value.sortBy
  if (currentPage.value > 1) query.page = currentPage.value.toString()
  
  router.push({ query })
}

const loadFromUrlParams = () => {
  const query = route.query
  
  filters.value = {
    search: query.search || '',
    year: query.year || '',
    artist: query.artist || '',
    tags: query.tags ? query.tags.split(',') : [],
    sortBy: query.sort || 'releaseDate-desc'
  }
  
  currentPage.value = parseInt(query.page) || 1
}

const handlePlay = async ({ release, track }) => {
  try {
    if (audioPlayer.value && audioPlayer.value.playTrack) {
      await audioPlayer.value.playTrack(track, release)
    }
  } catch (error) {
    console.error('Error playing track:', error)
  }
}

// Watch for route changes
watch(() => route.query, loadFromUrlParams, { immediate: true })

onMounted(async () => {
  // Load URL parameters
  loadFromUrlParams()
  
  // Load data from stores
  await Promise.all([
    releasesStore.fetchReleases(),
    artistsStore.fetchArtists()
  ])
})
</script> 