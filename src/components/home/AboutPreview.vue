<template>
  <section class="py-16 bg-black bg-opacity-80">
    <div class="container mx-auto px-4">
      <div class="flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 fade-in">
          <div class="w-full h-96 border border-forest-green flex items-center justify-center overflow-hidden hover-glow organic-float">
            <img 
              :src="bosqueWallpaper" 
              alt="Bosque Records Forest Wallpaper" 
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);"
            >
          </div>
        </div>
        <div class="lg:w-1/2 fade-in-delay-1">
          <h3 class="text-3xl title-font mb-6">About the label</h3>
          <p class="text-gray-light mb-6">
            Bosque Records is a sanctuary of resonant frequencies unfolding psychedelia. Conjured by Foe'Xan in South India and now blooming in the United States.
          </p>
          <router-link 
            to="/about"
            class="inline-block px-6 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 hover-glow organic-grow"
            style="animation-delay: 0.5s;"
          >
            Our Story
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import bosqueWallpaper from '@/assets/styles/image/logos/Bosque Logo Wallpaper.jpeg'
</script> 