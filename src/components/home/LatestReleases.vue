<template>
  <section class="py-16 bg-black bg-opacity-70">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h3 class="text-3xl title-font mb-4 text-mystical-gold">✦ LATEST RELEASES ✦</h3>
        <MysticalDivider />
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Loading Skeleton -->
        <div 
          v-if="loading"
          v-for="i in 4" 
          :key="i"
          class="bg-black bg-opacity-50 border border-forest-green p-4 organic-grow"
          :style="{ animationDelay: `${i * 0.1}s` }"
        >
          <div class="aspect-square bg-forest-green bg-opacity-30 mb-4 organic-pulse"></div>
          <div class="h-6 bg-forest-green bg-opacity-30 mb-2 organic-pulse" style="animation-delay: 0.2s;"></div>
          <div class="h-4 bg-forest-green bg-opacity-20 mb-3 w-3/4 organic-pulse" style="animation-delay: 0.4s;"></div>
          <div class="flex justify-between items-center">
            <div class="h-3 bg-forest-green bg-opacity-20 w-20 organic-pulse" style="animation-delay: 0.6s;"></div>
            <div class="h-8 bg-forest-green bg-opacity-20 w-16 organic-pulse" style="animation-delay: 0.8s;"></div>
          </div>
        </div>
        
        <!-- Featured Releases with staggered entrance -->
        <ReleaseCard 
          v-for="(release, index) in featuredReleases"
          :key="release.id"
          :release="release"
          @play="handlePlay"
          :class="'organic-grow'"
          :style="{ animationDelay: `${index * 0.15}s` }"
        />
        
        <!-- Empty State -->
        <div 
          v-if="!loading && featuredReleases.length === 0"
          class="col-span-full text-center py-16"
        >
          <div class="text-6xl text-mystical-gold mb-4">🌿</div>
          <h3 class="text-2xl title-font mb-4 text-mystical-gold">No Featured Releases</h3>
          <p class="text-gray-medium mb-6">
            The forest spirits are preparing new sounds...
          </p>
        </div>
      </div>
      
      <div class="text-center mt-12">
        <router-link 
          to="/releases"
          class="inline-block px-6 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300"
        >
          View All Releases
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import MysticalDivider from '@/components/common/MysticalDivider.vue'
import ReleaseCard from '@/components/releases/ReleaseCard.vue'
import { useReleasesStore } from '@/stores/releases'

// Import release cover images
import ghostNoizeCover from '@/assets/styles/image/roaster/GHOST_NOIZE_Bosque_Records/Photos/IMG_4025.PNG'
import foeXanCover from '@/assets/styles/image/roaster/FOE_XAN_Bosque_Records/Photos/IMG_0315.PNG'
import cosmikFrequencyCover from '@/assets/styles/image/roaster/COSMIK_FREQUENCY_Bosque_Records/Photos/IMG_1196.jpeg'
import brainwavezCover from '@/assets/styles/image/roaster/BRAINWAVEZ_Bosque_Records/Photos/319653d6-8ebf-4bc7-a97b-6d2f939dac4b.jpg'

const emit = defineEmits(['play'])
const releasesStore = useReleasesStore()

// Mock data for featured releases
const mockFeaturedReleases = [
  {
    id: '1',
    title: 'Shaman\'s Dream',
    slug: 'shamans-dream',
    description: 'A mystical journey through ancient forest paths',
    releaseDate: '2023-06-15',
    coverImage: ghostNoizeCover,
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
    coverImage: foeXanCover,
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
    coverImage: cosmikFrequencyCover,
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
    coverImage: brainwavezCover,
    featured: true,
    price: 11.99,
    artist: { id: '4', name: 'Brainwavez' },
    tracks: [
      { id: '7', title: 'Twisted Path', duration: 480, preview: '#' }
    ],
    tags: ['psytrance', 'progressive', 'forest']
  }
]

const loading = computed(() => releasesStore.loading)

const featuredReleases = computed(() => {
  // Use store data if available, otherwise use mock data
  if (releasesStore.featuredReleases.length > 0) {
    return releasesStore.featuredReleases.slice(0, 4)
  }
  return mockFeaturedReleases.slice(0, 4)
})

const handlePlay = (payload) => {
  emit('play', payload)
}

onMounted(async () => {
  // Try to load featured releases from the store
  try {
    await releasesStore.fetchFeaturedReleases()
  } catch (error) {
    console.error('Failed to load featured releases:', error)
    // Mock data will be used as fallback
  }
})
</script>

<style scoped>
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