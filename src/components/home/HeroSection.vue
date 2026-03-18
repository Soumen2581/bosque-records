<template>
  <section class="relative py-32 lg:py-48 overflow-hidden">
    <!-- Background Logo with organic float -->
    <div class="absolute inset-0 flex items-center justify-center opacity-10">
      <img 
        :src="bosqueRecordsLogo" 
        alt="Bosque Records Logo" 
        class="max-w-md max-h-md object-contain organic-float"
      >
    </div>
    
    <div class="container mx-auto px-4 text-center relative z-10">
      <h2 class="text-5xl md:text-7xl title-font mb-6 tracking-wider fade-in">
        <span class="text-white inline-block slide-up" style="animation-delay: 0.1s;">UNLEASH YOUR MIND'S</span>
        <br>
        <span class="text-mystical-red inline-block slide-up" style="animation-delay: 0.2s;">PLAYGROUND</span>
      </h2>
      <p class="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-medium fade-in-delay-2">
        Where ancient trees whisper secrets to the rhythm of the cosmos
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 fade-in-delay-3">
        <router-link 
          to="/releases"
          class="px-8 py-3 bg-transparent border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 hover-glow organic-grow"
        >
          Explore Releases
        </router-link>
        <router-link 
          to="/events"
          class="px-8 py-3 bg-forest-green bg-opacity-70 hover:bg-opacity-100 text-white organic-grow"
          style="animation-delay: 0.1s;"
        >
          Join the Ritual
        </router-link>
      </div>
    </div>
    
    <!-- Organic decorative elements -->
    <div class="absolute top-20 left-10 w-2 h-2 bg-mystical-gold rounded-full organic-float opacity-40"></div>
    <div class="absolute bottom-32 right-16 w-3 h-3 bg-forest-green rounded-full organic-float-delayed opacity-30"></div>
    <div class="absolute top-1/2 left-20 w-1 h-1 bg-mystical-gold rounded-full organic-float opacity-50" style="animation-delay: 2s;"></div>
  </section>
</template>

<script setup>
import bosqueRecordsLogo from '@/assets/styles/image/logos/Bosque Records Logo.png'
// Hero section doesn't need any reactive data for now
</script> 