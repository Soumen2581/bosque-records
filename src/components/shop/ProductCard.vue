<template>
  <article
    class="group relative bg-forest-black/80 border border-forest-green/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-mystical-gold/50 hover:shadow-gold-glow"
  >
    <!-- Badges -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <span
        v-if="product.hasDiscount"
        class="px-2 py-1 text-xs font-bold bg-mystical-gold text-forest-black rounded"
      >
        -{{ product.discountPercent }}%
      </span>
      <span
        v-if="product.productType === 'digital'"
        class="px-2 py-1 text-xs font-bold bg-green-accent text-white rounded"
      >
        Digital
      </span>
      <span
        v-if="product.productType === 'vinyl'"
        class="px-2 py-1 text-xs font-bold bg-forest-green text-mystical-gold rounded"
      >
        Vinyl
      </span>
      <span
        v-if="!product.inStock || product.quantity <= 5"
        class="px-2 py-1 text-xs font-bold bg-red-900/80 text-white rounded"
      >
        {{ !product.inStock ? 'Sold Out' : `Only ${product.quantity} left` }}
      </span>
    </div>

    <!-- Image -->
    <router-link :to="`/shop/${product.slug}`" class="block aspect-square overflow-hidden">
      <img
        :src="product.images[0] || '/placeholder-product.svg'"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-forest-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
      >
        <span class="text-mystical-gold font-fell-sc text-sm tracking-wider">
          View Details
        </span>
      </div>
    </router-link>

    <!-- Content -->
    <div class="p-4">
      <!-- Category -->
      <p class="text-xs text-gray-medium uppercase tracking-wider mb-1">
        {{ product.category }}
      </p>

      <!-- Title -->
      <router-link :to="`/shop/${product.slug}`">
        <h3
          class="font-fell text-lg text-gray-light group-hover:text-mystical-gold transition-colors line-clamp-2 mb-2"
        >
          {{ product.name }}
        </h3>
      </router-link>

      <!-- Price -->
      <div class="flex items-center gap-2 mb-3">
        <span
          v-if="product.hasDiscount"
          class="text-gray-medium line-through text-sm"
        >
          €{{ product.price.toFixed(2) }}
        </span>
        <span class="text-mystical-gold font-fell text-xl">
          €{{ (product.salePrice || product.price).toFixed(2) }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          v-if="product.inStock && product.quantity > 0"
          @click="handleAddToCart"
          :disabled="isAdding"
          class="flex-1 py-2 px-4 bg-forest-green hover:bg-green-accent text-gray-light text-sm font-fell rounded transition-colors disabled:opacity-50"
        >
          <span v-if="isAdding">
            <i class="fas fa-spinner fa-spin mr-1"></i>
            Adding...
          </span>
          <span v-else>
            <i class="fas fa-cart-plus mr-1"></i>
            Add to Cart
          </span>
        </button>
        <button
          v-else
          disabled
          class="flex-1 py-2 px-4 bg-gray-dark/50 text-gray-medium text-sm font-fell rounded cursor-not-allowed"
        >
          Sold Out
        </button>
      </div>

      <!-- Quick view on mobile -->
      <router-link
        :to="`/shop/${product.slug}`"
        class="mt-3 block text-center text-sm text-gray-medium hover:text-mystical-gold transition-colors md:hidden"
      >
        View Details
      </router-link>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  productType: 'physical' | 'digital' | 'vinyl'
  inStock: boolean
  quantity: number
  hasDiscount: boolean
  discountPercent: number
}

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const isAdding = ref(false)

const handleAddToCart = async () => {
  isAdding.value = true

  cartStore.addItem({
    productId: props.product.id,
    name: props.product.name,
    slug: props.product.slug,
    price: props.product.price,
    salePrice: props.product.salePrice,
    image: props.product.images[0] || '',
    productType: props.product.productType,
    maxQuantity: props.product.quantity
  })

  // Brief delay for visual feedback
  await new Promise((resolve) => setTimeout(resolve, 500))
  isAdding.value = false
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
