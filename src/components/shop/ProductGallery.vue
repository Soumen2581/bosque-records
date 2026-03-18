<template>
  <div class="space-y-4">
    <!-- Main Image -->
    <div
      class="relative aspect-square bg-forest-black rounded-lg overflow-hidden border border-forest-green/30"
      @click="openLightbox(activeIndex)"
    >
      <img
        :src="images[activeIndex] || '/placeholder-product.svg'"
        :alt="`Product image ${activeIndex + 1}`"
        class="w-full h-full object-contain"
      />

      <!-- Zoom hint -->
      <div class="absolute bottom-4 right-4 bg-forest-black/80 px-3 py-1 rounded text-xs text-gray-medium">
        <i class="fas fa-search-plus mr-1"></i>
        Click to zoom
      </div>

      <!-- Navigation arrows -->
      <button
        v-if="images.length > 1"
        @click.stop="prevImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-forest-black/80 hover:bg-forest-green rounded-full flex items-center justify-center text-mystical-gold transition-colors"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        v-if="images.length > 1"
        @click.stop="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-forest-black/80 hover:bg-forest-green rounded-full flex items-center justify-center text-mystical-gold transition-colors"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="activeIndex = index"
        class="flex-shrink-0 w-16 h-16 rounded border-2 transition-colors overflow-hidden"
        :class="
          index === activeIndex
            ? 'border-mystical-gold'
            : 'border-forest-green/30 hover:border-forest-green'
        "
      >
        <img
          :src="image"
          :alt="`Thumbnail ${index + 1}`"
          class="w-full h-full object-cover"
        />
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightboxOpen"
          @click="closeLightbox"
          class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        >
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 w-12 h-12 bg-forest-black/80 hover:bg-forest-green rounded-full flex items-center justify-center text-gray-light hover:text-mystical-gold transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>

          <button
            v-if="images.length > 1"
            @click.stop="prevImage"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-forest-black/80 hover:bg-forest-green rounded-full flex items-center justify-center text-mystical-gold transition-colors"
          >
            <i class="fas fa-chevron-left text-2xl"></i>
          </button>

          <img
            :src="images[lightboxIndex]"
            :alt="`Product image ${lightboxIndex + 1}`"
            class="max-w-full max-h-[90vh] object-contain"
            @click.stop
          />

          <button
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-forest-black/80 hover:bg-forest-green rounded-full flex items-center justify-center text-mystical-gold transition-colors"
          >
            <i class="fas fa-chevron-right text-2xl"></i>
          </button>

          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(image, index) in images"
              :key="index"
              @click.stop="lightboxIndex = index"
              class="w-3 h-3 rounded-full transition-colors"
              :class="
                index === lightboxIndex
                  ? 'bg-mystical-gold'
                  : 'bg-gray-medium hover:bg-gray-light'
              "
            ></button>
          </div>

          <p class="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-medium text-sm">
            {{ lightboxIndex + 1 }} / {{ images.length }}
          </p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const activeIndex = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const prevImage = () => {
  if (props.images.length <= 1) return
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}

const nextImage = () => {
  if (props.images.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

const openLightbox = (index: number) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

// Sync lightbox index with main image
watch(activeIndex, (newIndex) => {
  if (lightboxOpen.value) {
    lightboxIndex.value = newIndex
  }
})

// Handle keyboard navigation
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (!lightboxOpen.value) return

    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
