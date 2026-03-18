<template>
  <div class="release-grid">
    <!-- Grid Container -->
    <div 
      v-if="releases.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ReleaseCard 
        v-for="(release, index) in releases"
        :key="release.id || release.slug"
        :release="release"
        @play="handlePlay"
        :class="'organic-grow'"
        :style="{ animationDelay: `${(index % 8) * 0.1}s` }"
      />
    </div>
    
    <!-- Empty State -->
    <div 
      v-else-if="!loading"
      class="text-center py-16"
    >
      <div class="text-6xl text-mystical-gold mb-4">🌿</div>
      <h3 class="text-2xl title-font mb-4 text-mystical-gold">No Releases Found</h3>
      <p class="text-gray-medium mb-6">
        The forest spirits have not yet blessed us with releases matching your search.
      </p>
      <button 
        @click="$emit('clear-filters')"
        class="px-6 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300"
      >
        Clear Filters
      </button>
    </div>
    
    <!-- Loading State -->
    <div 
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div 
        v-for="i in skeletonCount"
        :key="i"
        class="release-skeleton"
      >
        <div class="bg-forest-green bg-opacity-20 border border-forest-green p-4 animate-pulse">
          <div class="aspect-square bg-forest-green bg-opacity-30 mb-4"></div>
          <div class="h-6 bg-forest-green bg-opacity-30 mb-2"></div>
          <div class="h-4 bg-forest-green bg-opacity-20 mb-3 w-3/4"></div>
          <div class="flex justify-between items-center">
            <div class="h-3 bg-forest-green bg-opacity-20 w-20"></div>
            <div class="h-8 bg-forest-green bg-opacity-20 w-16"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div 
      v-if="showPagination && !loading"
      class="flex justify-center items-center gap-4 mt-12"
    >
      <button 
        @click="$emit('previous-page')"
        :disabled="currentPage <= 1"
        class="px-4 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fas fa-chevron-left mr-2"></i>
        Previous
      </button>
      
      <div class="flex items-center gap-2">
        <span class="text-gray-medium">Page</span>
        <span class="text-mystical-gold font-bold">{{ currentPage }}</span>
        <span class="text-gray-medium">of</span>
        <span class="text-mystical-gold font-bold">{{ totalPages }}</span>
      </div>
      
      <button 
        @click="$emit('next-page')"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <i class="fas fa-chevron-right ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ReleaseCard from './ReleaseCard.vue'

const props = defineProps({
  releases: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  showPagination: {
    type: Boolean,
    default: false
  },
  skeletonCount: {
    type: Number,
    default: 8
  }
})

const emit = defineEmits(['play', 'clear-filters', 'previous-page', 'next-page'])

const handlePlay = (payload) => {
  emit('play', payload)
}
</script>

<style scoped>
.release-skeleton {
  @apply transition-opacity duration-300;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 