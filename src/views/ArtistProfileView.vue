<template>
  <PageLayout>
    <ContentContainer size="medium">
        <!-- Back Button -->
        <router-link 
          to="/roster" 
          class="inline-flex items-center text-mystical-gold hover:text-white mb-6 transition-colors"
        >
          ← Back to Roster
        </router-link>

        <!-- Loading State -->
        <LoadingSpinner 
          v-if="loading" 
          :full-screen="false"
          text="Loading artist..."
          subtitle="Summoning the forest dweller..."
          container-class="py-16"
        />

        <!-- Artist Profile Content -->
        <div v-else-if="artist" class="grid md:grid-cols-3 gap-8">
          <!-- Artist Avatar -->
          <div class="space-y-4">
            <div class="aspect-square overflow-hidden border border-forest-green">
              <img 
                :src="artist.avatar" 
                :alt="artist.name"
                class="w-full h-full object-cover"
              >
            </div>
            
            <!-- Artist Logo (if available) -->
            <div v-if="artist.logo" class="bg-black bg-opacity-50 border border-forest-green p-4">
              <img 
                :src="artist.logo" 
                :alt="`${artist.name} Logo`"
                class="w-full h-auto object-contain"
              >
            </div>
          </div>

          <!-- Artist Info -->
          <div class="md:col-span-2 space-y-6">
            <div>
              <h1 class="title-font text-3xl text-mystical-gold mb-2">{{ artist.name }}</h1>
              <p class="text-lg text-gray-400">{{ artist.genre }}</p>
            </div>

            <div class="space-y-4">
              <div>
                <h3 class="title-font text-lg text-white mb-2">Biography</h3>
                <p class="text-gray-300 leading-relaxed">
                  {{ artist.bio }}
                </p>
              </div>

              <div v-if="artist.socialLinks">
                <h3 class="title-font text-lg text-white mb-2">Social Links</h3>
                <div class="flex space-x-4">
                  <a 
                    v-if="artist.socialLinks.soundcloud"
                    :href="artist.socialLinks.soundcloud" 
                    class="text-mystical-gold hover:text-white transition-colors flex items-center"
                  >
                    <i class="fab fa-soundcloud mr-2"></i>
                    SoundCloud
                  </a>
                  <a 
                    v-if="artist.socialLinks.bandcamp"
                    :href="artist.socialLinks.bandcamp" 
                    class="text-mystical-gold hover:text-white transition-colors flex items-center"
                  >
                    <i class="fab fa-bandcamp mr-2"></i>
                    Bandcamp
                  </a>
                  <a 
                    v-if="artist.socialLinks.instagram"
                    :href="artist.socialLinks.instagram" 
                    class="text-mystical-gold hover:text-white transition-colors flex items-center"
                  >
                    <i class="fab fa-instagram mr-2"></i>
                    Instagram
                  </a>
                  <a 
                    v-if="artist.socialLinks.facebook"
                    :href="artist.socialLinks.facebook" 
                    class="text-mystical-gold hover:text-white transition-colors flex items-center"
                  >
                    <i class="fab fa-facebook mr-2"></i>
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Artist Not Found -->
        <EmptyState 
          v-else
          title="Artist Not Found"
          message="This forest dweller has not yet emerged from the shadows..."
          emoji="🌿"
        >
          <template #actions>
            <router-link 
              to="/roster"
              class="inline-block px-6 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300"
            >
              Return to Roster
            </router-link>
          </template>
        </EmptyState>

        <!-- Artist Releases -->
        <div v-if="artist" class="mt-12">
          <h2 class="title-font text-2xl text-mystical-gold mb-6">Releases</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div v-if="artist.releases && artist.releases.length > 0">
              <!-- TODO: Display actual releases -->
            </div>
            <div v-else class="bg-forest-green bg-opacity-30 border border-forest-green p-8 text-center">
              <p class="text-gray-medium">No releases available yet</p>
              <p class="text-gray-light text-sm mt-2">New sonic rituals coming soon...</p>
            </div>
          </div>
        </div>
    </ContentContainer>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/common/PageLayout.vue'
import ContentContainer from '@/components/common/ContentContainer.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useArtistsStore } from '@/stores/artists'

const route = useRoute()
const artistsStore = useArtistsStore()

const artistSlug = ref(route.params.slug)
const loading = computed(() => artistsStore.loading)
const artist = computed(() => artistsStore.currentArtist)

onMounted(async () => {
  try {
    await artistsStore.fetchArtistBySlug(artistSlug.value)
  } catch (error) {
    console.error('Failed to load artist:', error)
  }
})
</script>

<style scoped>
.title-font {
  font-family: 'IM Fell English SC', serif;
}
</style> 