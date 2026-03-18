<template>
  <!-- Cart Drawer -->
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click="close"
        class="fixed inset-0 bg-black/70 z-50"
      ></div>
    </Transition>

    <!-- Drawer -->
    <Transition name="slide">
      <aside
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-full max-w-md bg-forest-black border-l border-forest-green z-50 flex flex-col shadow-2xl"
      >
        <!-- Header -->
        <header class="flex items-center justify-between p-4 border-b border-forest-green">
          <h2 class="font-fell-sc text-xl text-mystical-gold">
            <i class="fas fa-shopping-bag mr-2"></i>
            Your Cart
            <span class="text-gray-medium text-base ml-1">({{ cartStore.itemCount }})</span>
          </h2>
          <button
            @click="close"
            class="p-2 text-gray-medium hover:text-mystical-gold transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </header>

        <!-- Free shipping progress -->
        <div v-if="cartStore.hasPhysicalItems" class="px-4 py-3 bg-forest-green/20">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-light">
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
          <div class="h-1 bg-forest-black rounded-full overflow-hidden">
            <div
              class="h-full bg-mystical-gold transition-all duration-300"
              :style="{ width: `${cartStore.freeShippingProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Cart items -->
        <div class="flex-1 overflow-y-auto">
          <template v-if="cartStore.items.length > 0">
            <ul class="divide-y divide-forest-green/30">
              <li
                v-for="item in cartStore.items"
                :key="`${item.productId}-${item.variant?.value || ''}`"
                class="p-4 flex gap-4"
              >
                <!-- Image -->
                <router-link :to="`/shop/${item.slug}`" @click="close">
                  <img
                    :src="item.image || '/placeholder.svg'"
                    :alt="item.name"
                    class="w-20 h-20 object-cover rounded border border-forest-green"
                  />
                </router-link>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <router-link
                    :to="`/shop/${item.slug}`"
                    @click="close"
                    class="font-fell text-gray-light hover:text-mystical-gold transition-colors line-clamp-2"
                  >
                    {{ item.name }}
                  </router-link>

                  <p v-if="item.variant" class="text-xs text-gray-medium mt-1">
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
                      class="text-xs text-gray-medium line-through"
                    >
                      €{{ item.price.toFixed(2) }}
                    </span>
                    <span class="text-mystical-gold font-fell">
                      €{{ (item.salePrice || item.price).toFixed(2) }}
                    </span>
                  </div>

                  <!-- Quantity controls -->
                  <div class="flex items-center gap-3 mt-2">
                    <div class="flex items-center border border-forest-green rounded">
                      <button
                        @click="decrementQuantity(item)"
                        class="px-2 py-1 text-gray-medium hover:text-mystical-gold transition-colors"
                      >
                        <i class="fas fa-minus text-xs"></i>
                      </button>
                      <span class="px-3 text-gray-light text-sm">{{ item.quantity }}</span>
                      <button
                        @click="incrementQuantity(item)"
                        class="px-2 py-1 text-gray-medium hover:text-mystical-gold transition-colors"
                        :disabled="item.maxQuantity && item.quantity >= item.maxQuantity"
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
              </li>
            </ul>
          </template>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center h-full p-8 text-center">
            <i class="fas fa-shopping-bag text-6xl text-forest-green mb-4"></i>
            <h3 class="font-fell text-xl text-gray-light mb-2">Your cart is empty</h3>
            <p class="text-gray-medium text-sm mb-6">
              Explore our collection of music and merchandise
            </p>
            <router-link
              to="/shop"
              @click="close"
              class="px-6 py-2 bg-forest-green hover:bg-green-accent text-gray-light font-fell rounded transition-colors"
            >
              Browse Shop
            </router-link>
          </div>
        </div>

        <!-- Footer -->
        <footer v-if="cartStore.items.length > 0" class="border-t border-forest-green p-4 space-y-4">
          <!-- Totals -->
          <div class="space-y-2">
            <div class="flex justify-between text-gray-medium text-sm">
              <span>Subtotal</span>
              <span>€{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.shippingCost > 0" class="flex justify-between text-gray-medium text-sm">
              <span>Shipping</span>
              <span>€{{ cartStore.shippingCost.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.discount > 0" class="flex justify-between text-green-accent text-sm">
              <span>Discount</span>
              <span>-€{{ cartStore.discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-mystical-gold text-xl font-fell pt-2 border-t border-forest-green">
              <span>Total</span>
              <span>€{{ cartStore.total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Checkout button -->
          <router-link
            to="/checkout"
            @click="close"
            class="block w-full py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc text-center rounded transition-colors"
          >
            Proceed to Checkout
          </router-link>

          <!-- Continue shopping -->
          <button
            @click="close"
            class="w-full py-2 text-gray-medium hover:text-mystical-gold text-sm transition-colors"
          >
            Continue Shopping
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore, type CartItem } from '@/stores/cart'

const cartStore = useCartStore()

const isOpen = computed(() => cartStore.items.length > 0)

const close = () => {
  // Emit event to close (parent handles)
}

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
