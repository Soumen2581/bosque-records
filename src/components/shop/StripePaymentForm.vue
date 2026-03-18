<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 mb-4">
      <i class="fab fa-stripe text-2xl text-purple-400"></i>
      <span class="text-gray-light font-fell">Credit or Debit Card</span>
    </div>

    <!-- Stripe Elements Container -->
    <div
      ref="cardElementRef"
      id="stripe-card-element"
      class="p-4 bg-forest-green/20 border border-forest-green/50 rounded"
    >
      <!-- Stripe will mount here -->
    </div>

    <!-- Card preview -->
    <div class="flex items-center gap-3 p-3 bg-forest-black/50 rounded border border-forest-green/30">
      <div class="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
        <i class="fab fa-cc-visa text-white text-sm"></i>
      </div>
      <div class="w-10 h-7 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
        <i class="fab fa-cc-mastercard text-white text-sm"></i>
      </div>
      <span class="text-sm text-gray-medium">Visa, Mastercard, and more</span>
    </div>

    <!-- Error message -->
    <p v-if="error" class="text-red-400 text-sm">
      <i class="fas fa-exclamation-circle mr-1"></i>
      {{ error }}
    </p>

    <!-- Processing overlay -->
    <div v-if="isProcessing" class="absolute inset-0 bg-forest-black/80 flex items-center justify-center rounded">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-mystical-gold mb-2"></i>
        <p class="text-gray-light">Processing payment...</p>
      </div>
    </div>

    <!-- Security badges -->
    <div class="flex items-center gap-4 pt-2 text-xs text-gray-medium">
      <span class="flex items-center gap-1">
        <i class="fas fa-lock text-green-accent"></i>
        Secured by Stripe
      </span>
      <span class="flex items-center gap-1">
        <i class="fas fa-shield-alt text-green-accent"></i>
        256-bit SSL
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  clientSecret?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  ready: []
  error: [message: string]
  success: [paymentIntentId: string]
}>()

const cardElementRef = ref<HTMLElement | null>(null)
const error = ref('')
const isProcessing = ref(false)
const isReady = ref(false)

let stripe: any = null
let elements: any = null
let cardElement: any = null

const initStripe = async () => {
  if (typeof window === 'undefined') return

  // Load Stripe.js dynamically
  if (!window.Stripe) {
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => initializeCard()
    document.head.appendChild(script)
  } else {
    initializeCard()
  }
}

const initializeCard = async () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

  if (!publishableKey || publishableKey === 'pk_test_placeholder') {
    error.value = 'Stripe is not configured. Please use another payment method.'
    return
  }

  try {
    stripe = window.Stripe(publishableKey)
    elements = stripe.elements({
      fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap'
        }
      ]
    })

    cardElement = elements.create('card', {
      style: {
        base: {
          color: '#e5e5e5',
          fontFamily: '"IM Fell English", serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#a1a1aa'
          }
        },
        invalid: {
          color: '#f87171',
          iconColor: '#f87171'
        }
      }
    })

    if (cardElementRef.value) {
      cardElement.mount(cardElementRef.value)
    }

    cardElement.on('ready', () => {
      isReady.value = true
      emit('ready')
    })

    cardElement.on('change', (event: any) => {
      if (event.error) {
        error.value = event.error.message
        emit('error', event.error.message)
      } else {
        error.value = ''
      }
    })
  } catch (e) {
    console.error('Failed to initialize Stripe:', e)
    error.value = 'Failed to load payment form'
  }
}

const processPayment = async () => {
  if (!stripe || !cardElement || !props.clientSecret) {
    error.value = 'Payment form not ready'
    return false
  }

  isProcessing.value = true
  error.value = ''

  try {
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      props.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer'
          }
        }
      }
    )

    if (stripeError) {
      error.value = stripeError.message || 'Payment failed'
      emit('error', error.value)
      return false
    }

    if (paymentIntent.status === 'succeeded') {
      emit('success', paymentIntent.id)
      return true
    }

    return false
  } catch (e: any) {
    error.value = e.message || 'Payment processing failed'
    emit('error', error.value)
    return false
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  initStripe()
})

onUnmounted(() => {
  if (cardElement) {
    cardElement.destroy()
  }
})

// Expose method for parent component
defineExpose({
  processPayment,
  isReady
})
</script>

<style>
/* Stripe element styling */
.StripeElement {
  padding: 12px 0;
}

.StripeElement--focus {
  outline: none;
}

.StripeElement--invalid {
  border-color: #f87171;
}
</style>
