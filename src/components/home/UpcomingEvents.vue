<template>
  <section class="py-16 bg-gradient-to-b from-black via-forest-green to-black bg-opacity-70">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h3 class="text-3xl title-font mb-4 text-mystical-gold">✦ UPCOMING EVENTS ✦</h3>
        <MysticalDivider />
      </div>
      
      <div class="max-w-4xl mx-auto">
        <div 
          v-for="i in 3" 
          :key="i"
          class="flex flex-col md:flex-row mb-8 border-b border-forest-green pb-8 last:border-b-0"
        >
          <div class="md:w-1/3 mb-4 md:mb-0">
            <div class="border border-mystical-gold p-2 text-center">
              <div class="text-4xl title-font text-mystical-gold">{{ 20 + i }}</div>
              <div class="text-lg uppercase">July</div>
              <div class="text-sm text-gray-medium">2024</div>
            </div>
          </div>
          <div class="md:w-2/3">
            <h4 class="text-2xl title-font mb-2">Forest Gathering {{ i }}</h4>
            <p class="text-gray-medium mb-3">Ancient Grove, Sacred Forest</p>
            <p class="text-gray-light mb-4">
              A mystical journey through sound and consciousness in the heart of the ancient forest.
            </p>
            <router-link 
              to="/events" 
              class="text-sm text-mystical-gold hover:underline"
            >
              More Info & Tickets
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import MysticalDivider from '@/components/common/MysticalDivider.vue'
</script> 