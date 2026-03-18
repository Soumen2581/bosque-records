<template>
  <aside class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-4 space-y-6">
    <h3 class="font-fell-sc text-lg text-mystical-gold flex items-center">
      <i class="fas fa-filter mr-2"></i>
      Filters
    </h3>

    <!-- Search -->
    <div>
      <label class="block text-sm text-gray-medium mb-2">Search</label>
      <div class="relative">
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          placeholder="Search products..."
          class="w-full px-4 py-2 pl-10 bg-forest-green/30 border border-forest-green/50 rounded text-gray-light placeholder-gray-medium focus:border-mystical-gold focus:outline-none transition-colors"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium"></i>
      </div>
    </div>

    <!-- Product Type -->
    <div>
      <label class="block text-sm text-gray-medium mb-2">Product Type</label>
      <div class="space-y-2">
        <label
          v-for="type in productTypes"
          :key="type.slug"
          class="flex items-center gap-2 cursor-pointer group"
        >
          <input
            type="radio"
            :value="type.slug"
            v-model="selectedType"
            @change="handleTypeChange"
            class="w-4 h-4 accent-mystical-gold"
          />
          <span class="text-gray-light group-hover:text-mystical-gold transition-colors">
            {{ type.name }}
          </span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            value=""
            v-model="selectedType"
            @change="handleTypeChange"
            class="w-4 h-4 accent-mystical-gold"
          />
          <span class="text-gray-light group-hover:text-mystical-gold transition-colors">
            All Types
          </span>
        </label>
      </div>
    </div>

    <!-- Categories -->
    <div>
      <label class="block text-sm text-gray-medium mb-2">Category</label>
      <select
        v-model="selectedCategory"
        @change="handleCategoryChange"
        class="w-full px-4 py-2 bg-forest-green/30 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none transition-colors"
      >
        <option value="">All Categories</option>
        <option
          v-for="category in categories"
          :key="category.slug"
          :value="category.name"
        >
          {{ category.name }} ({{ category.count }})
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div>
      <label class="block text-sm text-gray-medium mb-2">Price Range</label>
      <div class="flex items-center gap-2">
        <input
          v-model.number="minPrice"
          @change="handlePriceChange"
          type="number"
          min="0"
          placeholder="Min"
          class="w-full px-3 py-2 bg-forest-green/30 border border-forest-green/50 rounded text-gray-light placeholder-gray-medium focus:border-mystical-gold focus:outline-none transition-colors"
        />
        <span class="text-gray-medium">-</span>
        <input
          v-model.number="maxPrice"
          @change="handlePriceChange"
          type="number"
          min="0"
          placeholder="Max"
          class="w-full px-3 py-2 bg-forest-green/30 border border-forest-green/50 rounded text-gray-light placeholder-gray-medium focus:border-mystical-gold focus:outline-none transition-colors"
        />
      </div>
    </div>

    <!-- Sort -->
    <div>
      <label class="block text-sm text-gray-medium mb-2">Sort By</label>
      <select
        v-model="selectedSort"
        @change="handleSortChange"
        class="w-full px-4 py-2 bg-forest-green/30 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none transition-colors"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Name: A to Z</option>
      </select>
    </div>

    <!-- Clear Filters -->
    <button
      v-if="hasActiveFilters"
      @click="clearAllFilters"
      class="w-full py-2 border border-red-800 text-red-400 hover:bg-red-900/30 rounded transition-colors text-sm"
    >
      <i class="fas fa-times mr-2"></i>
      Clear All Filters
    </button>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="pt-4 border-t border-forest-green/30">
      <p class="text-xs text-gray-medium mb-2">Active Filters:</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-if="selectedType"
          class="px-2 py-1 text-xs bg-forest-green/50 text-gray-light rounded flex items-center gap-1"
        >
          {{ selectedType }}
          <button @click="selectedType = ''; handleTypeChange()" class="text-gray-medium hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
        <span
          v-if="selectedCategory"
          class="px-2 py-1 text-xs bg-forest-green/50 text-gray-light rounded flex items-center gap-1"
        >
          {{ selectedCategory }}
          <button @click="selectedCategory = ''; handleCategoryChange()" class="text-gray-medium hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
        <span
          v-if="minPrice > 0 || maxPrice > 0"
          class="px-2 py-1 text-xs bg-forest-green/50 text-gray-light rounded flex items-center gap-1"
        >
          €{{ minPrice || 0 }} - €{{ maxPrice || '∞' }}
          <button @click="minPrice = 0; maxPrice = 0; handlePriceChange()" class="text-gray-medium hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useShopStore } from '@/stores/shop'

const shopStore = useShopStore()

const searchQuery = ref('')
const selectedType = ref('')
const selectedCategory = ref('')
const minPrice = ref(0)
const maxPrice = ref(0)
const selectedSort = ref('newest')

const productTypes = [
  { slug: 'vinyl', name: 'Vinyl Records' },
  { slug: 'digital', name: 'Digital Downloads' },
  { slug: 'physical', name: 'Merchandise' }
]

const categories = computed(() => shopStore.categories)
const hasActiveFilters = computed(
  () =>
    selectedType.value ||
    selectedCategory.value ||
    minPrice.value > 0 ||
    maxPrice.value > 0 ||
    searchQuery.value
)

// Sync with store filters on mount
watch(
  () => shopStore.filters,
  (filters) => {
    selectedType.value = filters.productType || ''
    selectedCategory.value = filters.category || ''
    minPrice.value = filters.minPrice || 0
    maxPrice.value = filters.maxPrice || 0
    selectedSort.value = filters.sort || 'newest'
  },
  { immediate: true }
)

let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    shopStore.setFilter('search', searchQuery.value)
  }, 300)
}

const handleTypeChange = () => {
  shopStore.setFilter('productType', selectedType.value)
}

const handleCategoryChange = () => {
  shopStore.setFilter('category', selectedCategory.value)
}

const handlePriceChange = () => {
  shopStore.setFilter('minPrice', minPrice.value)
  shopStore.setFilter('maxPrice', maxPrice.value)
}

const handleSortChange = () => {
  shopStore.setFilter('sort', selectedSort.value)
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedCategory.value = ''
  minPrice.value = 0
  maxPrice.value = 0
  selectedSort.value = 'newest'
  shopStore.clearFilters()
}
</script>
