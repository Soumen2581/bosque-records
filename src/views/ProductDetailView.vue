<template>
  <PageLayout>
    <!-- Loading -->
    <div v-if="shopStore.isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="aspect-square bg-forest-green/20 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 bg-forest-green/20 rounded w-3/4"></div>
          <div class="h-4 bg-forest-green/20 rounded w-1/4"></div>
          <div class="h-12 bg-forest-green/20 rounded w-1/3"></div>
          <div class="h-24 bg-forest-green/20 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="shopStore.loadError" class="text-center py-16">
      <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <h2 class="font-fell text-2xl text-gray-light mb-2">Product Not Found</h2>
      <p class="text-gray-medium mb-6">{{ shopStore.loadError }}</p>
      <router-link
        to="/shop"
        class="px-6 py-3 bg-forest-green hover:bg-green-accent text-gray-light rounded transition-colors"
      >
        Back to Shop
      </router-link>
    </div>

    <!-- Product -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Gallery -->
      <div>
        <ProductGallery :images="product.images" />
      </div>

      <!-- Details -->
      <div class="space-y-6">
        <!-- Category & Type badges -->
        <div class="flex gap-2">
          <span class="px-3 py-1 text-xs bg-forest-green/30 text-mystical-gold rounded border border-forest-green">
            {{ product.category }}
          </span>
          <span
            v-if="product.productType === 'digital'"
            class="px-3 py-1 text-xs bg-green-accent/30 text-green-accent rounded border border-green-accent/50"
          >
            Digital Download
          </span>
          <span
            v-else-if="product.productType === 'vinyl'"
            class="px-3 py-1 text-xs bg-purple-900/30 text-purple-400 rounded border border-purple-800/50"
          >
            Vinyl Record
          </span>
        </div>

        <!-- Title -->
        <h1 class="font-fell-sc text-3xl md:text-4xl text-gray-light">
          {{ product.name }}
        </h1>

        <!-- Price -->
        <div class="flex items-center gap-4">
          <span
            v-if="product.hasDiscount"
            class="text-2xl text-gray-medium line-through"
          >
            €{{ product.price.toFixed(2) }}
          </span>
          <span class="text-4xl text-mystical-gold font-fell">
            €{{ (product.salePrice || product.price).toFixed(2) }}
          </span>
          <span
            v-if="product.hasDiscount"
            class="px-3 py-1 bg-mystical-gold text-forest-black text-sm font-bold rounded"
          >
            -{{ product.discountPercent }}% OFF
          </span>
        </div>

        <!-- Stock status -->
        <div class="flex items-center gap-2">
          <span
            v-if="product.inStock && product.quantity > 5"
            class="flex items-center text-green-accent"
          >
            <i class="fas fa-check-circle mr-2"></i>
            In Stock
          </span>
          <span
            v-else-if="product.inStock && product.quantity <= 5"
            class="flex items-center text-yellow-500"
          >
            <i class="fas fa-exclamation-circle mr-2"></i>
            Only {{ product.quantity }} left
          </span>
          <span v-else class="flex items-center text-red-500">
            <i class="fas fa-times-circle mr-2"></i>
            Sold Out
          </span>
        </div>

        <!-- Description -->
        <div class="prose prose-invert max-w-none">
          <p class="text-gray-light leading-relaxed">{{ product.description }}</p>
        </div>

        <!-- Variants -->
        <ProductVariantPicker
          v-if="product.variants"
          :variants="product.variants"
          v-model="selectedVariant"
        />

        <!-- Quantity & Add to Cart -->
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center border border-forest-green rounded">
              <button
                @click="quantity = Math.max(1, quantity - 1)"
                class="px-4 py-3 text-gray-medium hover:text-mystical-gold transition-colors"
              >
                <i class="fas fa-minus"></i>
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="product.quantity"
                class="w-16 text-center bg-transparent text-gray-light border-x border-forest-green py-3"
              />
              <button
                @click="quantity = Math.min(product.quantity, quantity + 1)"
                class="px-4 py-3 text-gray-medium hover:text-mystical-gold transition-colors"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>

            <span v-if="product.productType !== 'digital'" class="text-sm text-gray-medium">
              {{ product.quantity }} available
            </span>
          </div>

          <button
            @click="addToCart"
            :disabled="!product.inStock || isAdding"
            class="w-full py-4 text-lg font-fell-sc rounded transition-all"
            :class="
              product.inStock
                ? 'bg-mystical-gold hover:bg-yellow-500 text-forest-black'
                : 'bg-gray-dark text-gray-medium cursor-not-allowed'
            "
          >
            <i v-if="isAdding" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else-if="addedToCart" class="fas fa-check mr-2"></i>
            <i v-else class="fas fa-cart-plus mr-2"></i>
            {{
              addedToCart
                ? 'Added to Cart!'
                : product.inStock
                  ? 'Add to Cart'
                  : 'Sold Out'
            }}
          </button>

          <!-- Digital download info -->
          <div
            v-if="product.productType === 'digital'"
            class="p-4 bg-blue-900/20 border border-blue-800/50 rounded"
          >
            <h4 class="text-gray-light font-medium mb-2 flex items-center gap-2">
              <i class="fas fa-download text-blue-400"></i>
              Digital Download Includes
            </h4>
            <ul class="text-sm text-gray-medium space-y-1">
              <li v-if="product.downloadMp3">
                <i class="fas fa-music mr-2 text-blue-400"></i>
                MP3 Format (320kbps)
              </li>
              <li v-if="product.downloadWav">
                <i class="fas fa-file-audio mr-2 text-blue-400"></i>
                WAV Format (Lossless)
              </li>
              <li v-if="product.streamUrl">
                <i class="fas fa-headphones mr-2 text-blue-400"></i>
                Online Streaming Access
              </li>
            </ul>
          </div>

          <!-- Vinyl info -->
          <div
            v-if="product.productType === 'vinyl'"
            class="p-4 bg-purple-900/20 border border-purple-800/50 rounded"
          >
            <h4 class="text-gray-light font-medium mb-2 flex items-center gap-2">
              <i class="fas fa-compact-disc text-purple-400"></i>
              Vinyl Details
            </h4>
            <ul class="text-sm text-gray-medium space-y-1">
              <li v-if="product.weight">
                <i class="fas fa-weight mr-2 text-purple-400"></i>
                {{ product.weight }}g vinyl
              </li>
              <li>
                <i class="fas fa-shipping-fast mr-2 text-purple-400"></i>
                Ships within 5-7 business days
              </li>
            </ul>
          </div>
        </div>

        <!-- Bandcamp link -->
        <div v-if="product.bandcampUrl" class="pt-4 border-t border-forest-green/30">
          <a
            :href="product.bandcampUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
          >
            <i class="fab fa-bandcamp"></i>
            Buy on Bandcamp
          </a>
        </div>

        <!-- Tags -->
        <div v-if="product.tags" class="pt-4 border-t border-forest-green/30">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags.split(',')"
              :key="tag"
              class="px-2 py-1 text-xs bg-forest-green/20 text-gray-medium rounded"
            >
              #{{ tag.trim() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <section v-if="product?.related?.length" class="mt-20">
      <MysticalDivider />
      <h2 class="font-fell-sc text-2xl text-mystical-gold text-center mb-8">
        You May Also Like
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="relatedProduct in product.related"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
    </section>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import { useCartStore, type ProductVariant } from '@/stores/cart'
import type { Product } from '@/stores/shop'
import PageLayout from '@/components/common/PageLayout.vue'
import MysticalDivider from '@/components/common/MysticalDivider.vue'
import ProductGallery from '@/components/shop/ProductGallery.vue'
import ProductVariantPicker from '@/components/shop/ProductVariantPicker.vue'
import ProductCard from '@/components/shop/ProductCard.vue'

const route = useRoute()
const shopStore = useShopStore()
const cartStore = useCartStore()

const quantity = ref(1)
const selectedVariant = ref<ProductVariant | undefined>()
const isAdding = ref(false)
const addedToCart = ref(false)

const product = computed(() => shopStore.currentProduct)

const addToCart = async () => {
  if (!product.value) return

  isAdding.value = true

  cartStore.addItem(
    {
      productId: product.value.id,
      name: product.value.name,
      slug: product.value.slug,
      price: product.value.price,
      salePrice: product.value.salePrice,
      image: product.value.images[0] || '',
      productType: product.value.productType,
      maxQuantity: product.value.quantity,
      variant: selectedVariant.value
    },
    quantity.value
  )

  addedToCart.value = true

  await new Promise((resolve) => setTimeout(resolve, 1500))

  isAdding.value = false
  addedToCart.value = false
}

const fetchProduct = () => {
  const slug = route.params.slug as string
  if (slug) {
    shopStore.fetchProduct(slug)
  }
}

onMounted(fetchProduct)

watch(() => route.params.slug, fetchProduct)
</script>
