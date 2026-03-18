<template>
  <div class="min-h-screen flex items-center justify-center py-16">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-6xl title-font mb-6 text-mystical-gold">404</h1>
        <h2 class="text-3xl title-font mb-6">Lost in the Forest</h2>
        <p class="text-xl text-gray-light mb-8">
          The path you seek has been consumed by ancient roots and mystical mists.
        </p>
        <MysticalDivider />
        <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <router-link 
            to="/"
            class="px-8 py-3 bg-transparent border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300"
          >
            Return Home
          </router-link>
          <router-link 
            to="/releases"
            class="px-8 py-3 bg-forest-green bg-opacity-70 hover:bg-opacity-100 text-white transition duration-300"
          >
            Explore Releases
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MysticalDivider from '@/components/common/MysticalDivider.vue'
</script> 