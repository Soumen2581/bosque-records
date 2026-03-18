<template>
  <div class="coming-soon-container">
    <div class="text-center mb-8">
      <div class="icon-container mb-6">
        <i :class="icon" class="text-6xl text-mystical-gold mb-4"></i>
      </div>
      <h2 class="text-3xl md:text-4xl title-font text-mystical-gold mb-4">
        {{ title || 'Coming Soon' }}
      </h2>
      <p v-if="message" class="text-gray-light text-lg max-w-2xl mx-auto mb-6">
        {{ message }}
      </p>
      <MysticalDivider />
    </div>
    
    <div v-if="description" class="max-w-3xl mx-auto mt-8">
      <div class="bg-black bg-opacity-50 border border-forest-green p-8 rounded-lg">
        <p class="text-gray-medium text-center leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import MysticalDivider from './MysticalDivider.vue'

defineProps({
  title: {
    type: String,
    default: 'Coming Soon'
  },
  message: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: 'fas fa-seedling'
  }
})
</script>

<style scoped>
.coming-soon-container {
  @apply py-8;
}

.icon-container {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>

