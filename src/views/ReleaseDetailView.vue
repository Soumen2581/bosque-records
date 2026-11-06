<template>
  <PageLayout>
    <ContentContainer size="medium">
        <!-- Back Button -->
        <router-link 
          to="/releases" 
          class="inline-flex items-center text-mystical-gold hover:text-white mb-6 transition-colors"
        >
          ← Back to Releases
        </router-link>

        <!-- Loading State -->
        <LoadingSpinner 
          v-if="loading" 
          :full-screen="false"
          text="Loading release..."
          subtitle="Gathering mystical sounds..."
          container-class="py-16"
        />

        <!-- Release Detail Content -->
        <div v-else-if="release" class="grid md:grid-cols-2 gap-8">
          <!-- Cover Art -->
          <div class="space-y-4">
            <div class="aspect-square bg-forest-green bg-opacity-20 border border-forest-green overflow-hidden rounded-sm">
              <img 
                v-if="release.coverImage"
                :src="release.coverImage" 
                :alt="release.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                <p class="text-center">No Cover Art</p>
              </div>
            </div>
            
            <div v-if="release.embedUrl" class="bandcamp-embed">
              <iframe
                :src="release.embedUrl"
                :title="`${release.title} on Bandcamp`"
                loading="lazy"
                width="100%"
                height="120"
                style="border: 0;"
              />
            </div>
            <div v-if="release.bandcampUrl" class="text-center">
              <a 
                :href="release.bandcampUrl" 
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block px-6 py-2 bg-forest-green bg-opacity-70 hover:bg-opacity-100 text-white transition duration-300"
              >
                <i class="fab fa-bandcamp mr-2"></i>
                Listen on Bandcamp
              </a>
            </div>
          </div>

          <!-- Release Info -->
          <div class="space-y-6">
            <div>
              <h1 class="title-font text-3xl text-mystical-gold mb-2">{{ release.title }}</h1>
              <p class="text-xl text-gray-400">{{ release.artist?.name || 'Unknown Artist' }}</p>
            </div>

            <div v-if="release.description" class="text-gray-medium">
              <p>{{ release.description }}</p>
            </div>

            <div class="space-y-4">
              <div>
                <h3 class="title-font text-lg text-white mb-2">Release Information</h3>
                <div class="space-y-2 text-sm">
                  <p>
                    <span class="text-mystical-gold">Release Date:</span> 
                    <span class="text-gray-300">{{ formatDate(release.releaseDate) }}</span>
                  </p>
                  <p v-if="release.tags && release.tags.length > 0">
                    <span class="text-mystical-gold">Tags:</span> 
                    <span class="text-gray-300">{{ release.tags.join(', ') }}</span>
                  </p>
                  <p>
                    <span class="text-mystical-gold">Label:</span> 
                    <span class="text-gray-300">Bosque Records</span>
                  </p>
                  <p v-if="release.price">
                    <span class="text-mystical-gold">Price:</span> 
                    <span class="text-gray-300">${{ release.price.toFixed(2) }}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 class="title-font text-lg text-white mb-2">Tracklist</h3>
                <div class="space-y-2">
                  <div 
                    v-if="release.tracks && release.tracks.length > 0"
                    class="space-y-2"
                  >
                    <div
                      v-for="(track, index) in release.tracks"
                      :key="track.id"
                      class="bg-forest-green bg-opacity-50 border border-forest-green p-3 hover:bg-opacity-70 transition duration-300 cursor-pointer"
                      @click="playTrack(track)"
                    >
                      <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                          <span class="text-mystical-gold text-sm">{{ index + 1 }}.</span>
                          <span class="text-white">{{ track.title }}</span>
                        </div>
                        <div class="flex items-center gap-4">
                          <span class="text-gray-400 text-sm">{{ formatDuration(track.duration) }}</span>
                          <button
                            class="text-mystical-gold hover:text-white transition-colors"
                            @click.stop="playTrack(track)"
                            aria-label="Play track"
                          >
                            <i class="fas fa-play"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    v-else
                    class="bg-forest-green bg-opacity-50 border border-green-800 p-3"
                  >
                    <p class="text-sm text-gray-400">No tracks available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Not Found -->
        <EmptyState 
          v-else
          title="Release Not Found"
          message="The forest spirits have not yet revealed this release..."
          emoji="🌿"
        >
          <template #actions>
            <router-link 
              to="/releases"
              class="inline-block px-6 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300"
            >
              Back to Releases
            </router-link>
          </template>
        </EmptyState>
    </ContentContainer>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/common/PageLayout.vue'
import ContentContainer from '@/components/common/ContentContainer.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useReleasesStore } from '@/stores/releases'

const route = useRoute()
const releasesStore = useReleasesStore()
const releaseSlug = ref(route.params.slug as string)
const loading = ref(true)

const release = computed(() => releasesStore.currentRelease)

const formatDate = (date: string | undefined) => {
  if (!date) return 'Coming Soon'
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  } catch {
    return date
  }
}

const formatDuration = (seconds: number | undefined) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const playTrack = (track: any) => {
  // Emit play event to parent
  console.log('Play track:', track, release.value)
  // This will be handled by the parent component
}

onMounted(async () => {
  loading.value = true
  try {
    // First try to get from store if already loaded
    const existingRelease = releasesStore.getReleaseBySlug(releaseSlug.value)
    if (!existingRelease) {
      // Fetch release data based on slug
      await releasesStore.fetchReleaseBySlug(releaseSlug.value)
    }
  } catch (error) {
    console.error('Failed to load release:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.title-font {
  font-family: 'IM Fell English SC', serif;
}
</style> 