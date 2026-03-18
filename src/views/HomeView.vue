<template>
  <div class="min-h-screen">
    <!-- Initial Page Loading -->
    <LoadingSpinner 
      v-if="initialLoading" 
      :full-screen="false"
      text="Entering the forest..."
      subtitle="Gathering mystical energies..."
      container-class="py-32"
    />
    
    <template v-else>
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Release Carousel Spinner -->
      <section 
        v-if="!releasesStore.loading && releasesStore.allReleases.length > 0" 
        ref="carouselSection" 
        class="carousel-section fade-in"
      >
        <ReleaseSpinner 
          :releases="releasesStore.allReleases.slice(0, 12)"
          @play="handlePlay"
          @view="(release) => router.push(`/releases/${release.slug}`)"
        />
      </section>
      
      <!-- Loading state for spinner -->
      <section 
        v-else-if="releasesStore.loading"
        class="py-16 text-center"
      >
        <LoadingSpinner 
          :full-screen="false"
          text="Loading releases..."
          subtitle="Gathering mystical sounds..."
        />
      </section>
      
      <!-- No releases message -->
      <section 
        v-else-if="!releasesStore.loading && releasesStore.allReleases.length === 0"
        class="py-16 text-center"
      >
        <div class="text-6xl text-mystical-gold mb-4">🌿</div>
        <h3 class="text-2xl title-font mb-4 text-mystical-gold">No Releases Found</h3>
        <p class="text-gray-medium">
          The forest spirits are still preparing new sounds...
        </p>
      </section>
      
      <!-- Latest Releases -->
      <section ref="releasesSection" class="opacity-0">
        <LatestReleases @play="handlePlay" />
      </section>
      
      <!-- Upcoming Events -->
      <section ref="eventsSection" class="opacity-0">
        <UpcomingEvents />
      </section>
      
      <!-- Newsletter Signup -->
      <section ref="newsletterSection" class="opacity-0">
        <NewsletterSignup />
      </section>
      
      <!-- About Preview -->
      <section ref="aboutSection" class="opacity-0">
        <AboutPreview />
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from '@/components/home/HeroSection.vue'
import LatestReleases from '@/components/home/LatestReleases.vue'
import UpcomingEvents from '@/components/home/UpcomingEvents.vue'
import NewsletterSignup from '@/components/home/NewsletterSignup.vue'
import AboutPreview from '@/components/home/AboutPreview.vue'
import ReleaseSpinner from '@/components/releases/ReleaseSpinner.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useReleasesStore } from '@/stores/releases'
import { useEventsStore } from '@/stores/events'
import { useScrollAnimations } from '@/composables/useScrollAnimations'

const router = useRouter()

const emit = defineEmits(['play'])

const releasesStore = useReleasesStore()
const eventsStore = useEventsStore()
const initialLoading = ref(true)

const carouselSection = ref<HTMLElement | null>(null)
const releasesSection = ref<HTMLElement | null>(null)
const eventsSection = ref<HTMLElement | null>(null)
const newsletterSection = ref<HTMLElement | null>(null)
const aboutSection = ref<HTMLElement | null>(null)

const { setupIntersectionObserver } = useScrollAnimations()

const handlePlay = (payload) => {
  emit('play', payload)
}

onMounted(async () => {
  // Load all releases for the carousel and featured releases, plus upcoming events
  try {
    await Promise.all([
      releasesStore.fetchReleases(), // Load all releases for the spinner
      releasesStore.fetchFeaturedReleases(), // Also fetch featured for LatestReleases component
      eventsStore.fetchUpcomingEvents()
    ])
  } catch (error) {
    console.error('Failed to load home page data:', error)
  } finally {
    initialLoading.value = false
    
    // Setup scroll-based animations after content loads
    setTimeout(() => {
      // Fade in carousel immediately (it's right after hero, always in viewport)
      if (carouselSection.value) {
        carouselSection.value.classList.add('fade-in')
        carouselSection.value.style.opacity = '1'
      }
      if (releasesSection.value) setupIntersectionObserver(releasesSection)
      if (eventsSection.value) setupIntersectionObserver(eventsSection)
      if (newsletterSection.value) setupIntersectionObserver(newsletterSection)
      if (aboutSection.value) setupIntersectionObserver(aboutSection)
    }, 200)
  }
})
</script>

<style scoped>
.carousel-section {
  opacity: 1;
  transition: opacity 0.6s ease-in-out;
}
</style> 