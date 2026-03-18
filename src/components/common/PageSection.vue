<template>
  <section :class="['page-section', customClass]">
    <div v-if="title || subtitle" class="section-header mb-8">
      <h2 v-if="title" class="text-3xl md:text-4xl title-font text-mystical-gold mb-4">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="text-gray-medium text-lg max-w-2xl">
        {{ subtitle }}
      </p>
      <MysticalDivider v-if="showDivider" class="mt-6" />
    </div>
    <div :class="['section-content', contentClass]">
      <slot />
    </div>
  </section>
</template>

<script setup>
import MysticalDivider from './MysticalDivider.vue'

defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  customClass: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  showDivider: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.page-section {
  @apply mb-16;
}

.section-header {
  @apply text-center;
}
</style>

