<template>
  <PageLayout>
    <ContentContainer size="medium">
        <!-- Back Button -->
        <router-link 
          to="/events" 
          class="inline-flex items-center text-mystical-gold hover:text-white mb-6 transition-colors"
        >
          ← Back to Events
        </router-link>

        <!-- Loading State -->
        <LoadingSpinner 
          v-if="loading" 
          :full-screen="false"
          text="Loading event..."
          subtitle="Gathering forest gatherings..."
          container-class="py-16"
        />

        <!-- Event Detail Content -->
        <div v-else class="grid md:grid-cols-2 gap-8">
          <!-- Event Image -->
          <div class="space-y-4">
            <div class="aspect-video bg-forest-green border border-green-800 p-4">
              <div class="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                Event Artwork
              </div>
            </div>
          </div>

          <!-- Event Info -->
          <div class="space-y-6">
            <div>
              <h1 class="title-font text-3xl text-mystical-gold mb-2">Event Title</h1>
              <p class="text-xl text-gray-400">Dark Forest Gathering</p>
            </div>

            <div class="space-y-4">
              <div>
                <h3 class="title-font text-lg text-white mb-2">Event Details</h3>
                <div class="space-y-2 text-sm">
                  <p><span class="text-mystical-gold">Date:</span> Coming Soon</p>
                  <p><span class="text-mystical-gold">Time:</span> TBA</p>
                  <p><span class="text-mystical-gold">Location:</span> Deep Forest</p>
                  <p><span class="text-mystical-gold">Venue:</span> Ancient Grove</p>
                </div>
              </div>

              <div>
                <h3 class="title-font text-lg text-white mb-2">Description</h3>
                <p class="text-gray-300 leading-relaxed">
                  Join us for an immersive journey into the depths of dark forest psytrance. 
                  Experience the mystical sounds of the underground scene.
                </p>
              </div>

              <div>
                <h3 class="title-font text-lg text-white mb-2">Lineup</h3>
                <div class="space-y-2">
                  <div class="bg-forest-green bg-opacity-50 border border-green-800 p-3">
                    <p class="text-sm text-gray-400">Artist lineup coming soon</p>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <button class="bg-mystical-gold text-black px-6 py-3 font-semibold hover:bg-yellow-500 transition-colors">
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
    </ContentContainer>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '@/components/common/PageLayout.vue'
import ContentContainer from '@/components/common/ContentContainer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const eventSlug = ref(String(route.params.slug))
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    // TODO: Fetch event data based on slug
    console.log('Loading event:', eventSlug.value)
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Failed to load event:', error)
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