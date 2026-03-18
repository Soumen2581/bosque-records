<template>
  <PageLayout>
    <PageHeader 
      type="default"
      title="Shop"
      subtitle="Mystical merchandise, vinyl records, and digital downloads"
    />

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Filters Sidebar -->
      <aside class="lg:col-span-1">
        <ProductFilter />
      </aside>

      <!-- Products Grid -->
      <main class="lg:col-span-3">
        <!-- Loading state -->
        <div v-if="shopStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-forest-black/80 border border-forest-green/30 rounded-lg overflow-hidden animate-pulse"
          >
            <div class="aspect-square bg-forest-green/20"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-forest-green/20 rounded w-3/4"></div>
              <div class="h-3 bg-forest-green/20 rounded w-1/2"></div>
              <div class="h-6 bg-forest-green/20 rounded w-1/3"></div>
            </div>
          </div>
        </div>

        <!-- Products -->
        <div
          v-else-if="shopStore.products.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ProductCard
            v-for="product in shopStore.products"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!shopStore.isLoading"
          class="text-center py-16"
        >
          <i class="fas fa-search text-6xl text-forest-green mb-4"></i>
          <h3 class="font-fell text-xl text-gray-light mb-2">No products found</h3>
          <p class="text-gray-medium mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            @click="shopStore.clearFilters"
            class="px-6 py-2 bg-forest-green hover:bg-green-accent text-gray-light rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <!-- Pagination -->
        <div
          v-if="shopStore.pagination.totalPages > 1"
          class="mt-12 flex justify-center gap-2"
        >
          <button
            @click="shopStore.goToPage(shopStore.pagination.page - 1)"
            :disabled="shopStore.pagination.page <= 1"
            class="px-4 py-2 border border-forest-green text-gray-light hover:bg-forest-green/30 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="typeof page === 'number' && shopStore.goToPage(page)"
            class="px-4 py-2 border transition-colors rounded"
            :class="
              page === shopStore.pagination.page
                ? 'border-mystical-gold bg-mystical-gold/20 text-mystical-gold'
                : page === '...'
                  ? 'border-forest-green text-gray-medium cursor-default'
                  : 'border-forest-green text-gray-light hover:bg-forest-green/30'
            "
          >
            {{ page }}
          </button>

          <button
            @click="shopStore.goToPage(shopStore.pagination.page + 1)"
            :disabled="shopStore.pagination.page >= shopStore.pagination.totalPages"
            class="px-4 py-2 border border-forest-green text-gray-light hover:bg-forest-green/30 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useShopStore } from '@/stores/shop'
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import ProductFilter from '@/components/shop/ProductFilter.vue'

const shopStore = useShopStore()

const visiblePages = computed(() => {
  const total = shopStore.pagination.totalPages
  const current = shopStore.pagination.page
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

onMounted(async () => {
  await Promise.all([
    shopStore.fetchProducts(),
    shopStore.fetchCategories()
  ])
})
</script>
