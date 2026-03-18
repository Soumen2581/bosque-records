<template>
  <div :class="['content-container', sizeClass, customClass]">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  const sizeMap = {
    small: 'max-w-2xl',
    medium: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-full'
  }
  return sizeMap[props.size] || sizeMap.medium
})
</script>

<style scoped>
.content-container {
  @apply mx-auto;
}
</style>

