<template>
  <div class="bg-black bg-opacity-50 border border-forest-green hover:border-mystical-gold hover-glow group organic-float">
    <router-link :to="`/roster/${artist.slug}`" class="block">
      <!-- Artist Avatar -->
      <div class="aspect-square overflow-hidden bg-forest-green bg-opacity-20">
        <img 
          :src="artist.avatar" 
          :alt="artist.name"
          class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);"
        >
      </div>
      
      <!-- Artist Info -->
      <div class="p-6">
        <h3 class="text-xl title-font text-mystical-gold mb-2 group-hover:text-white transition-colors">
          {{ artist.name }}
        </h3>
        <p class="text-gray-medium text-sm mb-3">{{ artist.genre }}</p>
        <p class="text-gray-light text-sm line-clamp-3">{{ artist.bio }}</p>
        
        <!-- Social Links -->
        <div class="flex space-x-3 mt-4" @click.prevent>
          <a 
            v-if="artist.socialLinks?.soundcloud"
            :href="artist.socialLinks.soundcloud" 
            class="text-gray-medium hover:text-white transition-colors"
            aria-label="SoundCloud"
          >
            <i class="fab fa-soundcloud text-lg"></i>
          </a>
          <a 
            v-if="artist.socialLinks?.bandcamp"
            :href="artist.socialLinks.bandcamp" 
            class="text-gray-medium hover:text-white transition-colors"
            aria-label="Bandcamp"
          >
            <i class="fab fa-bandcamp text-lg"></i>
          </a>
          <a 
            v-if="artist.socialLinks?.instagram"
            :href="artist.socialLinks.instagram" 
            class="text-gray-medium hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <i class="fab fa-instagram text-lg"></i>
          </a>
          <a 
            v-if="artist.socialLinks?.facebook"
            :href="artist.socialLinks.facebook" 
            class="text-gray-medium hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <i class="fab fa-facebook text-lg"></i>
          </a>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
const props = defineProps({
  artist: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Organic card lift on hover */
.group {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.group:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(20, 51, 30, 0.4),
              0 6px 20px rgba(212, 175, 55, 0.2);
}
</style> 