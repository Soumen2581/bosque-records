<template>
  <PageLayout>
    <PageHeader 
      type="default"
      title="Checkout"
      subtitle="Complete your order"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Checkout Form -->
      <div class="lg:col-span-2">
        <div class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6 md:p-8">
          <CheckoutForm />
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <aside class="lg:col-span-1">
        <div class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6 sticky top-24">
          <h3 class="font-fell-sc text-lg text-mystical-gold mb-4 flex items-center">
            <i class="fas fa-shopping-bag mr-2"></i>
            Order Summary
          </h3>

          <!-- Items -->
          <ul class="divide-y divide-forest-green/30 mb-4">
            <li
              v-for="item in cartStore.items"
              :key="`${item.productId}-${item.variant?.value}`"
              class="py-3 flex items-center gap-3"
            >
              <div class="relative">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-14 h-14 object-cover rounded"
                />
                <span
                  class="absolute -top-2 -right-2 w-5 h-5 bg-mystical-gold text-forest-black text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-light text-sm truncate">{{ item.name }}</p>
                <p v-if="item.variant" class="text-xs text-gray-medium">
                  {{ item.variant.value }}
                </p>
              </div>
              <p class="text-mystical-gold text-sm">
                €{{ ((item.salePrice || item.price) * item.quantity).toFixed(2) }}
              </p>
            </li>
          </ul>

          <!-- Totals -->
          <div class="space-y-2 pt-4 border-t border-forest-green/30">
            <div class="flex justify-between text-sm">
              <span class="text-gray-medium">Subtotal</span>
              <span class="text-gray-light">€{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-medium">Shipping</span>
              <span v-if="cartStore.shippingCost === 0" class="text-green-accent">
                <template v-if="cartStore.hasPhysicalItems">
                  <span v-if="cartStore.freeShippingProgress >= 100">FREE</span>
                  <span v-else class="text-gray-medium">Calculated next</span>
                </template>
                <span v-else class="text-gray-medium">Digital - Free</span>
              </span>
              <span v-else class="text-gray-light">
                €{{ cartStore.shippingCost.toFixed(2) }}
              </span>
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

          <!-- Secure checkout badge -->
          <div class="mt-6 pt-4 border-t border-forest-green/30">
            <div class="flex items-center justify-center gap-4 text-xs text-gray-medium">
              <span class="flex items-center gap-1">
                <i class="fas fa-lock text-green-accent"></i>
                Secure
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-shield-alt text-green-accent"></i>
                Protected
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-undo text-green-accent"></i>
                Refunds
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Empty cart redirect -->
    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <i class="fas fa-shopping-cart text-6xl text-forest-green mb-4"></i>
      <h2 class="font-fell text-2xl text-gray-light mb-2">Your cart is empty</h2>
      <p class="text-gray-medium mb-6">Add some items to your cart to checkout</p>
      <router-link
        to="/shop"
        class="px-6 py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors"
      >
        Browse Shop
      </router-link>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import CheckoutForm from '@/components/shop/CheckoutForm.vue'

const cartStore = useCartStore()
</script>
