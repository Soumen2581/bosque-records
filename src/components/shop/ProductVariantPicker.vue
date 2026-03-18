<template>
  <div class="space-y-4">
    <!-- Size selector -->
    <div v-if="variants?.sizes?.length" class="space-y-2">
      <div class="flex justify-between items-center">
        <label class="text-sm text-gray-medium">Size</label>
        <button
          v-if="selectedSize"
          @click="selectedSize = ''"
          class="text-xs text-mystical-gold hover:underline"
        >
          Clear
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in variants.sizes"
          :key="size"
          @click="selectedSize = size"
          class="min-w-[3rem] px-3 py-2 border rounded text-sm font-medium transition-all"
          :class="
            selectedSize === size
              ? 'border-mystical-gold bg-mystical-gold/20 text-mystical-gold'
              : 'border-forest-green/50 text-gray-light hover:border-forest-green'
          "
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Color selector -->
    <div v-if="variants?.colors?.length" class="space-y-2">
      <div class="flex justify-between items-center">
        <label class="text-sm text-gray-medium">Color</label>
        <span v-if="selectedColor" class="text-sm text-gray-light">
          {{ selectedColor }}
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="color in variants.colors"
          :key="color"
          @click="selectedColor = color"
          class="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center"
          :class="
            selectedColor === color
              ? 'border-mystical-gold scale-110'
              : 'border-forest-green/50 hover:border-forest-green'
          "
          :title="color"
        >
          <span
            class="w-6 h-6 rounded-full"
            :style="{ backgroundColor: getColorCode(color) }"
          ></span>
        </button>
      </div>
    </div>

    <!-- Selected variant summary -->
    <div v-if="selectedSize || selectedColor" class="p-3 bg-forest-green/20 rounded border border-forest-green/30">
      <p class="text-sm text-gray-light">
        Selected:
        <span class="text-mystical-gold">
          {{ [selectedSize, selectedColor].filter(Boolean).join(' / ') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProductVariant } from '@/stores/cart'

interface Variants {
  sizes?: string[]
  colors?: string[]
}

const props = defineProps<{
  variants?: Variants
  modelValue?: ProductVariant
}>()

const emit = defineEmits<{
  'update:modelValue': [variant?: ProductVariant]
}>()

const selectedSize = ref('')
const selectedColor = ref('')

const selectedVariant = computed(() => {
  if (!selectedSize.value && !selectedColor.value) return undefined

  const variant: ProductVariant = {
    type: selectedSize.value ? 'size' : 'color',
    value: selectedSize.value || selectedColor.value
  }

  return variant
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (val.type === 'size') selectedSize.value = val.value
      else selectedColor.value = val.value
    }
  },
  { immediate: true }
)

watch(selectedVariant, (val) => {
  emit('update:modelValue', val)
})

// Color name to hex code mapping
const colorMap: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  gray: '#6b7280',
  grey: '#6b7280',
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#eab308',
  orange: '#ea580c',
  purple: '#9333ea',
  pink: '#ec4899',
  brown: '#78350f',
  navy: '#1e3a5f',
  gold: '#d4af37',
  silver: '#c0c0c0',
  beige: '#f5f5dc',
  olive: '#808000',
  teal: '#008080',
  burgundy: '#800020',
  forest: '#14331e'
}

const getColorCode = (colorName: string): string => {
  return colorMap[colorName.toLowerCase()] || '#888888'
}
</script>
