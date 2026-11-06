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
        <div v-else class="max-w-xl">
          <h1 class="title-font text-3xl mb-3">Event not published</h1>
          <p class="text-gray-medium">No verified event matches this address.</p>
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