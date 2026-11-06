<template>
  <section class="py-16 bg-black bg-opacity-70">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h3 class="text-3xl title-font mb-4">Latest releases</h3>
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
          <h3 class="text-2xl title-font mb-4">No releases yet</h3>
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
import { computed } from 'vue'
import MysticalDivider from '@/components/common/MysticalDivider.vue'
import ReleaseCard from '@/components/releases/ReleaseCard.vue'
import { useReleasesStore } from '@/stores/releases'

const emit = defineEmits(['play'])
const releasesStore = useReleasesStore()

const loading = computed(() => releasesStore.loading && releasesStore.allReleases.length === 0)

const featuredReleases = computed(() => releasesStore.latestReleases.slice(0, 4))

const handlePlay = (payload) => {
  emit('play', payload)
}
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