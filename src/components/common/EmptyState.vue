<template>
  <div class="empty-state text-center py-16">
    <div class="icon-container mb-6">
      <i v-if="icon" :class="icon" class="text-6xl text-mystical-gold mb-4"></i>
      <div v-else-if="emoji" class="text-6xl mb-4">{{ emoji }}</div>
    </div>
    <h3 class="text-2xl md:text-3xl title-font mb-4 text-mystical-gold">
      {{ title }}
    </h3>
    <p v-if="message" class="text-gray-medium max-w-md mx-auto mb-6">
      {{ message }}
    </p>
    <slot name="actions" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  emoji: {
    type: String,
    default: '🌿'
  }
})
</script>

<style scoped>
.empty-state {
  @apply min-h-[400px] flex flex-col items-center justify-center;
}
</style>

