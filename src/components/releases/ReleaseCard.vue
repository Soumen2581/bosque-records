<template>
  <div class="bg-black bg-opacity-50 border border-forest-green p-4 hover-glow group organic-float">
    <div class="mb-4 overflow-hidden bg-forest-green bg-opacity-20 rounded-sm">
      <img 
        :src="currentImageSrc" 
        :alt="release.title"
        class="w-full album-cover"
        :class="{ 'opacity-90': imageError }"
        loading="eager"
        decoding="sync"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>
    
    <h4 class="text-xl title-font mb-2 text-mystical-gold">{{ release.title }}</h4>
    <p class="text-gray-medium mb-2">by {{ release.artist?.name || 'Unknown Artist' }}</p>
    
    <div v-if="release.tags && release.tags.length" class="mb-3">
      <span 
        v-for="tag in release.tags.slice(0, 3)" 
        :key="tag"
        class="inline-block text-xs bg-forest-green bg-opacity-30 text-gray-light px-2 py-1 rounded-sm mr-1 mb-1"
      >
        {{ tag }}
      </span>
    </div>
    
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-dark">{{ formatDate(release.releaseDate) }}</span>
      <div class="flex gap-2">
        <button 
          v-if="release.tracks && release.tracks.length > 0"
          @click="handlePlay"
          :disabled="loading"
          class="text-xs text-mystical-gold border border-mystical-gold px-3 py-1 hover:bg-forest-green hover:bg-opacity-30 transition duration-300 disabled:opacity-50"
        >
          <i class="fas fa-play mr-1"></i>
          {{ loading ? 'Loading...' : 'Listen' }}
        </button>
        
        <router-link 
          :to="`/releases/${release.slug}`"
          class="text-xs text-white border border-gray-medium px-3 py-1 hover:bg-gray-medium hover:bg-opacity-20 transition duration-300"
        >
          <i class="fas fa-info-circle mr-1"></i>
          Details
        </router-link>
      </div>
    </div>
    
    <!-- Track Count Indicator -->
    <div v-if="release.tracks" class="mt-2 text-xs text-gray-dark">
      {{ release.tracks.length }} {{ release.tracks.length === 1 ? 'track' : 'tracks' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  release: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['play'])

const loading = ref(false)
const imageError = ref(false)
const errorLoopCount = ref(0)

// Create a simple, always-working placeholder that never fails
const createPlaceholder = (text) => {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="300" fill="#14331e"/>
    <text x="150" y="150" text-anchor="middle" dominant-baseline="middle" 
          fill="#d4af37" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
      ${(text || 'Release').substring(0, 15)}${text && text.length > 15 ? '...' : ''}
    </text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Safe placeholder that always works
const placeholderImage = computed(() => {
  return createPlaceholder(props.release.title)
})

// Track failed image paths to avoid retrying
const failedImagePaths = new Set()

// Helper function to resolve image paths
const resolveImagePath = (imagePath) => {
  if (!imagePath) return placeholderImage.value
  
  // If this path has already failed, use placeholder immediately
  if (failedImagePaths.has(imagePath)) return placeholderImage.value
  
  // If it's already a data URL, return as-is
  if (imagePath.startsWith('data:')) return imagePath
  
  // If it's already a full URL (including Vite processed URLs), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:') || imagePath.includes('/@fs/')) return imagePath
  
  // If it's a relative path starting with /, treat as asset
  if (imagePath.startsWith('/')) return imagePath
  
  // If it's just a filename (likely from API), use placeholder for now
  // since uploads folder is empty in development
  if (!imagePath.includes('/')) {
    console.info(`Using placeholder for missing image: ${imagePath}`)
    return placeholderImage.value
  }
  
  // For any other case, return the image path as-is (it might be a valid import)
  return imagePath
}

// Current image source with error handling
const currentImageSrc = ref(resolveImagePath(props.release.coverImage))

const formatDate = (date) => {
  if (!date) return 'TBA'
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(date))
}

const handlePlay = async () => {
  if (!props.release.tracks || props.release.tracks.length === 0) return
  
  loading.value = true
  
  try {
    emit('play', {
      release: props.release,
      track: props.release.tracks[0] // Play first track by default
    })
  } catch (error) {
    console.error('Error playing release:', error)
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  // Prevent infinite error loops
  errorLoopCount.value++
  
  if (errorLoopCount.value > 2) {
    // If we've already had multiple errors, stop trying
    return
  }
  
  const img = event.target
  if (img && currentImageSrc.value !== placeholderImage.value) {
    console.warn(`Failed to load image for release "${props.release.title}". Resolved path: "${currentImageSrc.value}"`)
    
    // Track this path as failed to avoid future attempts
    if (props.release.coverImage) {
      failedImagePaths.add(props.release.coverImage)
    }
    
    imageError.value = true
    currentImageSrc.value = placeholderImage.value
  }
}

const handleImageLoad = () => {
  // Only reset if we successfully loaded a non-placeholder image
  if (currentImageSrc.value !== placeholderImage.value) {
    imageError.value = false
    errorLoopCount.value = 0
  }
}

// Watch for changes in the release coverImage prop
watch(() => props.release.coverImage, (newPath) => {
  const resolvedPath = resolveImagePath(newPath)
  if (resolvedPath !== currentImageSrc.value) {
    currentImageSrc.value = resolvedPath
    imageError.value = false
    errorLoopCount.value = 0
  }
})
</script>

<style scoped>
.album-cover {
  @apply transition-all;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  aspect-ratio: 1;
  object-fit: cover;
  background-color: rgba(20, 51, 30, 0.2);
  will-change: transform;
}

.group:hover .album-cover {
  transform: scale(1.08) translateY(-4px);
  filter: brightness(1.1) contrast(1.05);
  box-shadow: 0 12px 40px rgba(20, 51, 30, 0.5),
              0 4px 16px rgba(212, 175, 55, 0.3);
}

.album-cover[src*="placeholder"] {
  @apply opacity-80;
}

/* Organic card lift on hover */
.group {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.group:hover {
  transform: translateY(-6px);
  border-color: rgba(212, 175, 55, 0.6);
  box-shadow: 0 12px 40px rgba(20, 51, 30, 0.4),
              0 6px 20px rgba(212, 175, 55, 0.2);
}
</style> 