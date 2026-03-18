<template>
  <PageLayout>
    <PageHeader 
      type="records" 
      subtitle="Meet the forest dwellers who craft the mystical soundscapes of Bosque Records"
    />
    
    <!-- Loading State -->
    <div 
      v-if="loading" 
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <div 
        v-for="i in 4" 
        :key="i"
        class="bg-black bg-opacity-50 border border-forest-green animate-pulse"
      >
        <div class="aspect-square bg-forest-green bg-opacity-30"></div>
        <div class="p-6">
          <div class="h-6 bg-forest-green bg-opacity-30 mb-2"></div>
          <div class="h-4 bg-forest-green bg-opacity-20 mb-3 w-3/4"></div>
          <div class="h-4 bg-forest-green bg-opacity-20 mb-2"></div>
          <div class="h-4 bg-forest-green bg-opacity-20 w-2/3"></div>
        </div>
      </div>
    </div>
    
    <!-- Artists Grid -->
    <div 
      v-else-if="!loading && allArtists.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      <ArtistCard 
        v-for="artist in allArtists"
        :key="artist.id"
        :artist="artist"
      />
    </div>
    
    <!-- Empty State -->
    <EmptyState 
      v-else
      title="No Artists Found"
      message="The forest spirits are gathering new talent..."
      emoji="🌿"
    />
  </PageLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ArtistCard from '@/components/common/ArtistCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useArtistsStore } from '@/stores/artists'

const artistsStore = useArtistsStore()

const loading = computed(() => artistsStore.loading)
const allArtists = computed(() => artistsStore.allArtists)

onMounted(async () => {
  // Try to load artists from the API
  try {
    await artistsStore.fetchArtists()
  } catch (error) {
    console.error('Failed to load artists:', error)
    // Mock data will be used as fallback
  }
})
</script> 