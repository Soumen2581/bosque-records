<template>
  <PageLayout>
    <div class="max-w-2xl mx-auto text-center py-12">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="w-24 h-24 mx-auto bg-green-accent/20 rounded-full flex items-center justify-center">
          <i class="fas fa-check text-5xl text-green-accent"></i>
        </div>
      </div>

      <!-- Success Message -->
      <h1 class="font-fell-sc text-3xl md:text-4xl text-mystical-gold mb-4">
        {{ successTitle }}
      </h1>
      <p class="text-gray-light text-lg mb-2">
        {{ successMessage }}
      </p>

      <!-- Order Number -->
      <div class="inline-block px-6 py-3 bg-forest-green/30 border border-forest-green rounded-lg mb-8">
        <p class="text-sm text-gray-medium">Order Number</p>
        <p class="text-2xl text-mystical-gold font-fell-sc tracking-wider">{{ orderNumber }}</p>
      </div>

      <!-- SEPA Instructions -->
      <div v-if="paymentMethod === 'sepa'" class="text-left bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-8">
        <h3 class="text-xl text-blue-400 font-fell-sc mb-4 flex items-center gap-2">
          <i class="fas fa-info-circle"></i>
          Bank Transfer Instructions
        </h3>
        <div class="space-y-3 text-gray-light">
          <p>Please transfer the total amount to the following account:</p>
          <div class="bg-forest-black/50 rounded p-4 font-mono">
            <p><span class="text-gray-medium">IBAN:</span> DE00 0000 0000 0000 0000 00</p>
            <p><span class="text-gray-medium">BIC:</span> XXXXXXXXXXX</p>
            <p><span class="text-gray-medium">Reference:</span> {{ orderNumber }}</p>
          </div>
          <p class="text-sm text-gray-medium">
            Transfers usually take 2-5 business days. You'll receive an email confirmation once payment is received.
          </p>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6 mb-8 text-left">
        <h3 class="text-lg text-mystical-gold font-fell-sc mb-4">What's Next?</h3>
        <ul class="space-y-3 text-gray-light">
          <li class="flex items-start gap-3">
            <i class="fas fa-envelope text-mystical-gold mt-1"></i>
            <span>You'll receive an order confirmation email at <strong class="text-gray-light">{{ customerEmail }}</strong></span>
          </li>
          <li v-if="paymentMethod === 'stripe'" class="flex items-start gap-3">
            <i class="fas fa-check-circle text-green-accent mt-1"></i>
            <span>Your payment has been processed successfully</span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-box text-mystical-gold mt-1"></i>
            <span>
              {{ paymentMethod === 'sepa' ? 'Your order will be processed once payment is received' : 'Your order is being prepared' }}
            </span>
          </li>
          <li class="flex items-start gap-3">
            <i class="fas fa-truck text-mystical-gold mt-1"></i>
            <span>Shipping within 5-7 business days</span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/shop"
          class="px-8 py-3 bg-forest-green hover:bg-green-accent text-gray-light font-fell-sc rounded transition-colors"
        >
          <i class="fas fa-shopping-bag mr-2"></i>
          Continue Shopping
        </router-link>
        <router-link
          v-if="customerStore.isAuthenticated"
          to="/account/orders"
          class="px-8 py-3 bg-forest-green/30 border border-forest-green hover:bg-forest-green/50 text-gray-light font-fell-sc rounded transition-colors"
        >
          <i class="fas fa-receipt mr-2"></i>
          View Orders
        </router-link>
      </div>

      <!-- Support -->
      <p class="mt-8 text-gray-medium text-sm">
        Questions about your order?
        <a href="mailto:info@bosquerecords.com" class="text-mystical-gold hover:underline">
          Contact Support
        </a>
      </p>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import PageLayout from '@/components/common/PageLayout.vue'

const route = useRoute()
const customerStore = useCustomerStore()

const orderNumber = computed(() => route.query.orderNumber as string || '')
const paymentMethod = computed(() => route.query.method as string || 'stripe')
const customerEmail = ref('')

const successTitle = computed(() => {
  if (paymentMethod.value === 'sepa') {
    return 'Order Received!'
  }
  return 'Order Confirmed!'
})

const successMessage = computed(() => {
  if (paymentMethod.value === 'sepa') {
    return 'Thank you for your order. Please complete the bank transfer to finalize your purchase.'
  }
  return 'Thank you for your purchase! Your order has been confirmed.'
})

onMounted(() => {
  customerEmail.value = customerStore.customer?.email || 'your email'
})
</script>
