<template>
  <div class="mystical-divider" :class="customClass">
    <span 
      v-if="symbol" 
      class="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-forest-black px-2 text-mystical-gold text-xl"
    >
      {{ symbol }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  symbol: {
    type: String,
    default: '✧'
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.mystical-divider {
  @apply border-t border-forest-green border-b border-mystical-gold h-0 my-8 relative;
}
</style> 