<template>
  <PageLayout>
    <PageHeader 
      type="default"
      title="Shopping Cart"
      subtitle="Review your selections"
    />

    <div v-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="`${item.productId}-${item.variant?.value || ''}`"
          class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-4 flex gap-4"
        >
          <!-- Image -->
          <router-link :to="`/shop/${item.slug}`" class="flex-shrink-0">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-24 h-24 object-cover rounded"
            />
          </router-link>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <router-link
              :to="`/shop/${item.slug}`"
              class="font-fell text-lg text-gray-light hover:text-mystical-gold transition-colors"
            >
              {{ item.name }}
            </router-link>

            <p v-if="item.variant" class="text-sm text-gray-medium mt-1">
              {{ item.variant.type }}: {{ item.variant.value }}
            </p>

            <p class="text-xs text-gray-medium mt-1 capitalize">
              <i class="fas mr-1" :class="{
                'fa-compact-disc': item.productType === 'vinyl',
                'fa-music': item.productType === 'digital',
                'fa-box': item.productType === 'physical'
              }"></i>
              {{ item.productType }}
            </p>

            <!-- Price -->
            <div class="flex items-center gap-2 mt-2">
              <span
                v-if="item.salePrice"
                class="text-sm text-gray-medium line-through"
              >
                €{{ item.price.toFixed(2) }}
              </span>
              <span class="text-mystical-gold font-fell">
                €{{ (item.salePrice || item.price).toFixed(2) }}
              </span>
            </div>

            <!-- Quantity controls -->
            <div class="flex items-center gap-4 mt-3">
              <div class="flex items-center border border-forest-green rounded">
                <button
                  @click="decrementQuantity(item)"
                  class="px-3 py-2 text-gray-medium hover:text-mystical-gold transition-colors"
                >
                  <i class="fas fa-minus text-xs"></i>
                </button>
                <span class="px-4 text-gray-light">{{ item.quantity }}</span>
                <button
                  @click="incrementQuantity(item)"
                  class="px-3 py-2 text-gray-medium hover:text-mystical-gold transition-colors"
                >
                  <i class="fas fa-plus text-xs"></i>
                </button>
              </div>

              <button
                @click="removeItem(item)"
                class="text-gray-medium hover:text-red-400 transition-colors text-sm"
              >
                <i class="fas fa-trash mr-1"></i>
                Remove
              </button>
            </div>
          </div>

          <!-- Line total -->
          <div class="flex-shrink-0 text-right">
            <p class="text-lg text-mystical-gold font-fell">
              €{{ ((item.salePrice || item.price) * item.quantity).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <aside class="lg:col-span-1">
        <div class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6 sticky top-24">
          <h3 class="font-fell-sc text-lg text-mystical-gold mb-4">Order Summary</h3>

          <!-- Free shipping progress -->
          <div v-if="cartStore.hasPhysicalItems" class="mb-6">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-medium">
                <template v-if="cartStore.freeShippingProgress >= 100">
                  <i class="fas fa-check-circle text-green-accent mr-1"></i>
                  Free shipping unlocked!
                </template>
                <template v-else>
                  Add €{{ cartStore.amountUntilFreeShipping.toFixed(2) }} more for free shipping
                </template>
              </span>
              <span class="text-mystical-gold">{{ cartStore.freeShippingProgress }}%</span>
            </div>
            <div class="h-2 bg-forest-green/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-mystical-gold transition-all duration-300"
                :style="{ width: `${cartStore.freeShippingProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-3 pb-4 border-b border-forest-green/30">
            <div class="flex justify-between text-sm">
              <span class="text-gray-medium">Subtotal</span>
              <span class="text-gray-light">€{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.shippingCost > 0" class="flex justify-between text-sm">
              <span class="text-gray-medium">Shipping</span>
              <span class="text-gray-light">€{{ cartStore.shippingCost.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.discount > 0" class="flex justify-between text-sm text-green-accent">
              <span>Discount</span>
              <span>-€{{ cartStore.discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-xl pt-3 border-t border-forest-green/30">
              <span class="text-gray-light font-fell-sc">Total</span>
              <span class="text-mystical-gold font-fell-sc">€{{ cartStore.total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 space-y-3">
            <router-link
              to="/checkout"
              class="block w-full py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc text-center rounded transition-colors"
            >
              Proceed to Checkout
            </router-link>
            <router-link
              to="/shop"
              class="block w-full py-3 bg-forest-green hover:bg-green-accent text-gray-light font-fell text-center rounded transition-colors"
            >
              Continue Shopping
            </router-link>
          </div>

          <!-- Security badges -->
          <div class="mt-6 pt-4 border-t border-forest-green/30 flex justify-center gap-4 text-xs text-gray-medium">
            <span class="flex items-center gap-1">
              <i class="fas fa-lock text-green-accent"></i>
              Secure
            </span>
            <span class="flex items-center gap-1">
              <i class="fas fa-shield-alt text-green-accent"></i>
              Protected
            </span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-16 max-w-lg mx-auto">
      <i class="fas fa-shopping-cart text-6xl text-forest-green mb-4"></i>
      <h2 class="font-fell text-2xl text-gray-light mb-2">Your cart is empty</h2>
      <p class="text-gray-medium mb-6">
        Explore our collection of music, vinyl, and merchandise
      </p>
      <router-link
        to="/shop"
        class="inline-block px-8 py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors"
      >
        Browse Shop
      </router-link>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { useCartStore, type CartItem } from '@/stores/cart'
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const cartStore = useCartStore()

const incrementQuantity = (item: CartItem) => {
  cartStore.updateQuantity(item.productId, item.quantity + 1, item.variant)
}

const decrementQuantity = (item: CartItem) => {
  cartStore.updateQuantity(item.productId, item.quantity - 1, item.variant)
}

const removeItem = (item: CartItem) => {
  cartStore.removeItem(item.productId, item.variant)
}
</script>
