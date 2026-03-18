<template>
  <div class="release-filter bg-black bg-opacity-50 border border-forest-green p-6 mb-8">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Search -->
      <div class="flex-1">
        <label class="block text-sm font-medium text-mystical-gold mb-2">
          <i class="fas fa-search mr-2"></i>
          Search Releases
        </label>
        <input
          v-model="localFilters.search"
          @input="debouncedUpdate"
          type="text"
          placeholder="Search by title, artist, or tags..."
          class="w-full px-4 py-3 bg-black bg-opacity-50 border border-forest-green text-white placeholder-gray-medium focus:outline-none focus:ring-1 focus:ring-mystical-gold focus:border-mystical-gold transition-colors duration-300"
        />
      </div>
      
      <!-- Year Filter -->
      <div class="lg:w-48">
        <label class="block text-sm font-medium text-mystical-gold mb-2">
          <i class="fas fa-calendar mr-2"></i>
          Release Year
        </label>
        <select
          v-model="localFilters.year"
          @change="updateFilters"
          class="w-full px-4 py-3 bg-black bg-opacity-50 border border-forest-green text-white focus:outline-none focus:ring-1 focus:ring-mystical-gold focus:border-mystical-gold transition-colors duration-300"
        >
          <option value="">All Years</option>
          <option 
            v-for="year in availableYears"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
      </div>
      
      <!-- Artist Filter -->
      <div class="lg:w-48">
        <label class="block text-sm font-medium text-mystical-gold mb-2">
          <i class="fas fa-user mr-2"></i>
          Artist
        </label>
        <select
          v-model="localFilters.artist"
          @change="updateFilters"
          class="w-full px-4 py-3 bg-black bg-opacity-50 border border-forest-green text-white focus:outline-none focus:ring-1 focus:ring-mystical-gold focus:border-mystical-gold transition-colors duration-300"
        >
          <option value="">All Artists</option>
          <option 
            v-for="artist in availableArtists"
            :key="artist.id"
            :value="artist.id"
          >
            {{ artist.name }}
          </option>
        </select>
      </div>
      
      <!-- Sort -->
      <div class="lg:w-48">
        <label class="block text-sm font-medium text-mystical-gold mb-2">
          <i class="fas fa-sort mr-2"></i>
          Sort By
        </label>
        <select
          v-model="localFilters.sortBy"
          @change="updateFilters"
          class="w-full px-4 py-3 bg-black bg-opacity-50 border border-forest-green text-white focus:outline-none focus:ring-1 focus:ring-mystical-gold focus:border-mystical-gold transition-colors duration-300"
        >
          <option value="releaseDate-desc">Newest First</option>
          <option value="releaseDate-asc">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="artist-asc">Artist A-Z</option>
        </select>
      </div>
    </div>
    
    <!-- Tags Filter -->
    <div v-if="availableTags.length > 0" class="mt-6">
      <label class="block text-sm font-medium text-mystical-gold mb-3">
        <i class="fas fa-tags mr-2"></i>
        Filter by Tags
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in availableTags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="[
            'px-3 py-2 text-sm border transition duration-300',
            localFilters.tags.includes(tag)
              ? 'bg-mystical-gold text-black border-mystical-gold'
              : 'bg-transparent text-mystical-gold border-mystical-gold hover:bg-mystical-gold hover:bg-opacity-20'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>
    
    <!-- Active Filters & Clear -->
    <div v-if="hasActiveFilters" class="mt-6 pt-4 border-t border-forest-green">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-gray-medium">Active filters:</span>
        
        <span v-if="localFilters.search" class="inline-flex items-center px-3 py-1 bg-mystical-gold bg-opacity-20 text-mystical-gold text-sm rounded-sm">
          Search: "{{ localFilters.search }}"
          <button @click="clearSearch" class="ml-2 text-xs hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
        
        <span v-if="localFilters.year" class="inline-flex items-center px-3 py-1 bg-mystical-gold bg-opacity-20 text-mystical-gold text-sm rounded-sm">
          Year: {{ localFilters.year }}
          <button @click="clearYear" class="ml-2 text-xs hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
        
        <span v-if="localFilters.artist" class="inline-flex items-center px-3 py-1 bg-mystical-gold bg-opacity-20 text-mystical-gold text-sm rounded-sm">
          Artist: {{ getArtistName(localFilters.artist) }}
          <button @click="clearArtist" class="ml-2 text-xs hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
        
        <span 
          v-for="tag in localFilters.tags"
          :key="tag"
          class="inline-flex items-center px-3 py-1 bg-mystical-gold bg-opacity-20 text-mystical-gold text-sm rounded-sm"
        >
          {{ tag }}
          <button @click="removeTag(tag)" class="ml-2 text-xs hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
        
        <button
          @click="clearAllFilters"
          class="px-4 py-2 text-sm border border-red-500 text-red-400 hover:bg-red-500 hover:bg-opacity-20 transition duration-300"
        >
          <i class="fas fa-trash mr-2"></i>
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      search: '',
      year: '',
      artist: '',
      tags: [],
      sortBy: 'releaseDate-desc'
    })
  },
  availableYears: {
    type: Array,
    default: () => []
  },
  availableArtists: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({ ...props.filters })

// Debounced search update
let searchTimeout = null
const debouncedUpdate = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    updateFilters()
  }, 300)
}

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

const hasActiveFilters = computed(() => {
  return localFilters.value.search ||
         localFilters.value.year ||
         localFilters.value.artist ||
         localFilters.value.tags.length > 0
})

const toggleTag = (tag) => {
  const tags = [...localFilters.value.tags]
  const index = tags.indexOf(tag)
  
  if (index >= 0) {
    tags.splice(index, 1)
  } else {
    tags.push(tag)
  }
  
  localFilters.value.tags = tags
  updateFilters()
}

const removeTag = (tag) => {
  localFilters.value.tags = localFilters.value.tags.filter(t => t !== tag)
  updateFilters()
}

const clearSearch = () => {
  localFilters.value.search = ''
  updateFilters()
}

const clearYear = () => {
  localFilters.value.year = ''
  updateFilters()
}

const clearArtist = () => {
  localFilters.value.artist = ''
  updateFilters()
}

const clearAllFilters = () => {
  localFilters.value = {
    search: '',
    year: '',
    artist: '',
    tags: [],
    sortBy: localFilters.value.sortBy // Keep sort preference
  }
  updateFilters()
}

const getArtistName = (artistId) => {
  const artist = props.availableArtists.find(a => a.id === artistId)
  return artist ? artist.name : 'Unknown'
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script> 