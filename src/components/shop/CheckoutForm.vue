<template>
  <div class="space-y-6">
    <!-- Step indicators -->
    <div class="flex items-center justify-center gap-2 mb-8">
      <div
        v-for="(stepLabel, index) in steps"
        :key="index"
        class="flex items-center"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
          :class="
            index + 1 <= currentStep
              ? 'bg-mystical-gold text-forest-black'
              : 'bg-forest-green/30 text-gray-medium border border-forest-green'
          "
        >
          <i v-if="index + 1 < currentStep" class="fas fa-check"></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span
          class="ml-2 text-sm hidden sm:inline"
          :class="index + 1 <= currentStep ? 'text-gray-light' : 'text-gray-medium'"
        >
          {{ stepLabel }}
        </span>
        <div
          v-if="index < steps.length - 1"
          class="w-8 sm:w-16 h-0.5 mx-2"
          :class="index + 1 < currentStep ? 'bg-mystical-gold' : 'bg-forest-green/30'"
        ></div>
      </div>
    </div>

    <!-- Step 1: Account -->
    <div v-if="currentStep === 1" class="space-y-4">
      <h3 class="font-fell-sc text-xl text-mystical-gold">
        <i class="fas fa-user mr-2"></i>
        {{ customerStore.isAuthenticated ? 'Account Details' : 'Account' }}
      </h3>

      <template v-if="customerStore.isAuthenticated">
        <div class="p-4 bg-forest-green/20 rounded border border-forest-green/30">
          <p class="text-gray-light">
            <i class="fas fa-check-circle text-green-accent mr-2"></i>
            Logged in as {{ customerStore.fullName }}
          </p>
          <p class="text-sm text-gray-medium mt-1">
            {{ customerStore.customer?.email }}
          </p>
        </div>
      </template>

      <template v-else>
        <!-- Login/Register tabs -->
        <div class="flex border-b border-forest-green/30">
          <button
            @click="authMode = 'login'"
            class="px-6 py-3 font-fell transition-colors"
            :class="
              authMode === 'login'
                ? 'text-mystical-gold border-b-2 border-mystical-gold'
                : 'text-gray-medium hover:text-gray-light'
            "
          >
            Login
          </button>
          <button
            @click="authMode = 'register'"
            class="px-6 py-3 font-fell transition-colors"
            :class="
              authMode === 'register'
                ? 'text-mystical-gold border-b-2 border-mystical-gold'
                : 'text-gray-medium hover:text-gray-light'
            "
          >
            Register
          </button>
          <button
            @click="authMode = 'guest'"
            class="px-6 py-3 font-fell transition-colors"
            :class="
              authMode === 'guest'
                ? 'text-mystical-gold border-b-2 border-mystical-gold'
                : 'text-gray-medium hover:text-gray-light'
            "
          >
            Guest Checkout
          </button>
        </div>

        <!-- Login form -->
        <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-medium mb-1">Email</label>
            <input
              v-model="loginForm.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-medium mb-1">Password</label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
            />
          </div>
          <p v-if="authError" class="text-red-400 text-sm">{{ authError }}</p>
          <button
            type="submit"
            :disabled="isAuthLoading"
            class="w-full py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors disabled:opacity-50"
          >
            <i v-if="isAuthLoading" class="fas fa-spinner fa-spin mr-2"></i>
            Login
          </button>
        </form>

        <!-- Register form -->
        <form v-else-if="authMode === 'register'" @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-medium mb-1">First Name</label>
              <input
                v-model="registerForm.firstName"
                type="text"
                class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-medium mb-1">Last Name</label>
              <input
                v-model="registerForm.lastName"
                type="text"
                class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-medium mb-1">Email *</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-medium mb-1">Password *</label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
            />
            <p class="text-xs text-gray-medium mt-1">Minimum 8 characters</p>
          </div>
          <p v-if="authError" class="text-red-400 text-sm">{{ authError }}</p>
          <button
            type="submit"
            :disabled="isAuthLoading"
            class="w-full py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors disabled:opacity-50"
          >
            <i v-if="isAuthLoading" class="fas fa-spinner fa-spin mr-2"></i>
            Create Account & Checkout
          </button>
        </form>

        <!-- Guest checkout -->
        <div v-else class="space-y-4">
          <p class="text-gray-medium text-sm">
            Continue as guest. You'll receive order updates via email.
          </p>
          <div>
            <label class="block text-sm text-gray-medium mb-1">Email *</label>
            <input
              v-model="guestForm.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-medium mb-1">Full Name *</label>
            <input
              v-model="guestForm.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- Step 2: Shipping -->
    <div v-if="currentStep === 2" class="space-y-4">
      <h3 class="font-fell-sc text-xl text-mystical-gold">
        <i class="fas fa-truck mr-2"></i>
        Shipping Address
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm text-gray-medium mb-1">Full Name *</label>
          <input
            v-model="shippingForm.name"
            type="text"
            required
            class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm text-gray-medium mb-1">Street Address *</label>
          <input
            v-model="shippingForm.street"
            type="text"
            required
            class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-medium mb-1">Postal Code *</label>
          <input
            v-model="shippingForm.postalCode"
            type="text"
            required
            class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-medium mb-1">City *</label>
          <input
            v-model="shippingForm.city"
            type="text"
            required
            class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-medium mb-1">Country *</label>
          <select
            v-model="shippingForm.country"
            required
            class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
          >
            <option value="">Select Country</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="IT">Italy</option>
            <option value="ES">Spain</option>
            <option value="NL">Netherlands</option>
            <option value="BE">Belgium</option>
            <option value="AT">Austria</option>
            <option value="PL">Poland</option>
            <option value="PT">Portugal</option>
            <option value="GR">Greece</option>
            <option value="SE">Sweden</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="IE">Ireland</option>
            <option value="CZ">Czech Republic</option>
            <option value="HU">Hungary</option>
            <option value="RO">Romania</option>
            <option value="SK">Slovakia</option>
            <option value="BG">Bulgaria</option>
            <option value="HR">Croatia</option>
            <option value="SI">Slovenia</option>
            <option value="LT">Lithuania</option>
            <option value="LV">Latvia</option>
            <option value="EE">Estonia</option>
            <option value="MT">Malta</option>
            <option value="CY">Cyprus</option>
            <option value="LU">Luxembourg</option>
            <option value="GB">United Kingdom</option>
            <option value="CH">Switzerland</option>
            <option value="NO">Norway</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="JP">Japan</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-medium mb-1">Phone (optional)</label>
          <input
            v-model="shippingForm.phone"
            type="tel"
            class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
          />
        </div>
      </div>

      <!-- Saved addresses for logged-in users -->
      <div v-if="customerStore.isAuthenticated && customerStore.savedAddresses.length > 0">
        <label class="block text-sm text-gray-medium mb-2">Or choose a saved address:</label>
        <div class="space-y-2">
          <button
            v-for="address in customerStore.savedAddresses"
            :key="address.id"
            @click="selectSavedAddress(address)"
            class="w-full p-4 bg-forest-green/20 border border-forest-green/50 rounded text-left hover:border-mystical-gold transition-colors"
          >
            <p class="text-gray-light">{{ address.name }}</p>
            <p class="text-sm text-gray-medium">{{ address.street }}, {{ address.postalCode }} {{ address.city }}</p>
          </button>
        </div>
      </div>

      <!-- Digital products notice -->
      <div v-if="!cartStore.hasPhysicalItems" class="p-4 bg-blue-900/20 border border-blue-800/50 rounded">
        <p class="text-sm text-gray-light">
          <i class="fas fa-download text-blue-400 mr-2"></i>
          Your order contains digital products only - no shipping required.
        </p>
      </div>
    </div>

    <!-- Step 3: Payment -->
    <div v-if="currentStep === 3" class="space-y-4">
      <h3 class="font-fell-sc text-xl text-mystical-gold">
        <i class="fas fa-credit-card mr-2"></i>
        Payment Method
      </h3>

      <!-- Payment method selection -->
      <div class="space-y-3">
        <label
          class="flex items-center gap-4 p-4 bg-forest-green/20 border rounded cursor-pointer transition-all"
          :class="
            selectedPayment === 'stripe'
              ? 'border-mystical-gold bg-mystical-gold/10'
              : 'border-forest-green/50 hover:border-forest-green'
          "
        >
          <input
            type="radio"
            value="stripe"
            v-model="selectedPayment"
            class="w-5 h-5 accent-mystical-gold"
          />
          <div class="flex items-center gap-3">
            <i class="fab fa-stripe text-2xl text-purple-400"></i>
            <div>
              <p class="text-gray-light font-medium">Credit/Debit Card</p>
              <p class="text-xs text-gray-medium">Visa, Mastercard, and more</p>
            </div>
          </div>
        </label>

        <label
          class="flex items-center gap-4 p-4 bg-forest-green/20 border rounded cursor-pointer transition-all"
          :class="
            selectedPayment === 'sepa'
              ? 'border-mystical-gold bg-mystical-gold/10'
              : 'border-forest-green/50 hover:border-forest-green'
          "
        >
          <input
            type="radio"
            value="sepa"
            v-model="selectedPayment"
            class="w-5 h-5 accent-mystical-gold"
          />
          <div class="flex items-center gap-3">
            <i class="fas fa-university text-2xl text-blue-400"></i>
            <div>
              <p class="text-gray-light font-medium">SEPA Bank Transfer</p>
              <p class="text-xs text-gray-medium">European bank transfer (2-5 days)</p>
            </div>
          </div>
        </label>
      </div>

      <!-- Payment form -->
      <div v-if="selectedPayment === 'stripe'" class="mt-4">
        <StripePaymentForm
          ref="stripeFormRef"
          :client-secret="stripeClientSecret"
          @ready="stripeReady = true"
          @error="handleStripeError"
          @success="handleStripeSuccess"
        />
      </div>

      <div v-else-if="selectedPayment === 'sepa'" class="mt-4">
        <SEPAPaymentInfo
          :bank-details="sepaDetails"
          :amount="cartStore.total"
        />
      </div>
    </div>

    <!-- Step 4: Review -->
    <div v-if="currentStep === 4" class="space-y-4">
      <h3 class="font-fell-sc text-xl text-mystical-gold">
        <i class="fas fa-clipboard-check mr-2"></i>
        Review Order
      </h3>

      <!-- Order items -->
      <div class="bg-forest-green/20 rounded border border-forest-green/30 overflow-hidden">
        <div class="p-4 border-b border-forest-green/30">
          <h4 class="text-gray-light font-medium mb-2">Items ({{ cartStore.itemCount }})</h4>
        </div>
        <ul class="divide-y divide-forest-green/30">
          <li
            v-for="item in cartStore.items"
            :key="`${item.productId}-${item.variant?.value}`"
            class="p-4 flex items-center gap-4"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-1">
              <p class="text-gray-light">{{ item.name }}</p>
              <p v-if="item.variant" class="text-xs text-gray-medium">
                {{ item.variant.type }}: {{ item.variant.value }}
              </p>
              <p class="text-xs text-gray-medium">Qty: {{ item.quantity }}</p>
            </div>
            <p class="text-mystical-gold font-fell">
              €{{ ((item.salePrice || item.price) * item.quantity).toFixed(2) }}
            </p>
          </li>
        </ul>
      </div>

      <!-- Shipping address -->
      <div v-if="cartStore.hasPhysicalItems" class="bg-forest-green/20 rounded border border-forest-green/30 p-4">
        <h4 class="text-gray-light font-medium mb-2">
          <i class="fas fa-truck mr-2 text-mystical-gold"></i>
          Shipping Address
        </h4>
        <p class="text-gray-medium text-sm">
          {{ shippingForm.name }}<br>
          {{ shippingForm.street }}<br>
          {{ shippingForm.postalCode }} {{ shippingForm.city }}<br>
          {{ shippingForm.country }}
        </p>
      </div>

      <!-- Payment method -->
      <div class="bg-forest-green/20 rounded border border-forest-green/30 p-4">
        <h4 class="text-gray-light font-medium mb-2">
          <i class="fas fa-credit-card mr-2 text-mystical-gold"></i>
          Payment Method
        </h4>
        <p class="text-gray-medium text-sm">
          {{ selectedPayment === 'stripe' ? 'Credit/Debit Card' : 'SEPA Bank Transfer' }}
        </p>
      </div>

      <!-- Order total -->
      <div class="bg-mystical-gold/10 rounded border border-mystical-gold/30 p-4">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-medium">Subtotal</span>
            <span class="text-gray-light">€{{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.shippingCost > 0" class="flex justify-between text-sm">
            <span class="text-gray-medium">Shipping</span>
            <span class="text-gray-light">€{{ cartStore.shippingCost.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.freeShippingProgress >= 100" class="flex justify-between text-sm text-green-accent">
            <span>Free Shipping</span>
            <span>-€7.50</span>
          </div>
          <div class="flex justify-between text-xl pt-2 border-t border-forest-green/30">
            <span class="text-gray-light font-fell-sc">Total</span>
            <span class="text-mystical-gold font-fell-sc">€{{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <div class="flex justify-between pt-6 border-t border-forest-green/30">
      <button
        v-if="currentStep > 1"
        @click="prevStep"
        class="px-6 py-3 border border-forest-green text-gray-light hover:bg-forest-green/30 rounded transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back
      </button>
      <div v-else></div>

      <button
        v-if="currentStep < 4"
        @click="nextStep"
        :disabled="!canProceed"
        class="px-8 py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors disabled:opacity-50"
      >
        Continue
        <i class="fas fa-arrow-right ml-2"></i>
      </button>

      <button
        v-else
        @click="placeOrder"
        :disabled="isPlacingOrder"
        class="px-8 py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors disabled:opacity-50"
      >
        <i v-if="isPlacingOrder" class="fas fa-spinner fa-spin mr-2"></i>
        <i v-else class="fas fa-lock mr-2"></i>
        Place Order - €{{ cartStore.total.toFixed(2) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCustomerStore, type SavedAddress } from '@/stores/customer'
import StripePaymentForm from './StripePaymentForm.vue'
import SEPAPaymentInfo from './SEPAPaymentInfo.vue'

const router = useRouter()
const cartStore = useCartStore()
const customerStore = useCustomerStore()

const steps = ['Account', 'Shipping', 'Payment', 'Review']
const currentStep = ref(1)
const authMode = ref<'login' | 'register' | 'guest'>('guest')
const selectedPayment = ref<'stripe' | 'sepa'>('stripe')

// Auth forms
const authError = ref('')
const isAuthLoading = ref(false)
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ email: '', password: '', firstName: '', lastName: '' })
const guestForm = ref({ email: '', name: '' })

// Shipping form
const shippingForm = ref({
  name: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  phone: ''
})

// Stripe
const stripeFormRef = ref<InstanceType<typeof StripePaymentForm> | null>(null)
const stripeClientSecret = ref('')
const stripeReady = ref(false)
const isPlacingOrder = ref(false)

// SEPA details (placeholder - in real app, fetch from API)
const sepaDetails = {
  bankName: 'Placeholder Bank',
  iban: 'DE00 0000 0000 0000 0000 00',
  bic: 'XXXXXXXXXXX',
  accountHolder: 'Bosque Records',
  reference: ''
}

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return (
        customerStore.isAuthenticated ||
        guestForm.value.email ||
        authMode.value !== 'guest'
      )
    case 2:
      if (!cartStore.hasPhysicalItems) return true
      return (
        shippingForm.value.name &&
        shippingForm.value.street &&
        shippingForm.value.city &&
        shippingForm.value.postalCode &&
        shippingForm.value.country
      )
    case 3:
      return !!selectedPayment.value
    default:
      return true
  }
})

// Methods
const handleLogin = async () => {
  isAuthLoading.value = true
  authError.value = ''

  const success = await customerStore.login(
    loginForm.value.email,
    loginForm.value.password
  )

  if (success) {
    nextStep()
  } else {
    authError.value = customerStore.error || 'Login failed'
  }

  isAuthLoading.value = false
}

const handleRegister = async () => {
  isAuthLoading.value = true
  authError.value = ''

  const success = await customerStore.register(
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.firstName,
    registerForm.value.lastName
  )

  if (success) {
    nextStep()
  } else {
    authError.value = customerStore.error || 'Registration failed'
  }

  isAuthLoading.value = false
}

const selectSavedAddress = (address: SavedAddress) => {
  shippingForm.value.name = address.name
  shippingForm.value.street = address.street
  shippingForm.value.city = address.city
  shippingForm.value.postalCode = address.postalCode
  shippingForm.value.country = address.country
  shippingForm.value.phone = address.phone || ''
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleStripeError = (message: string) => {
  console.error('Stripe error:', message)
}

const handleStripeSuccess = (paymentIntentId: string) => {
  console.log('Stripe success:', paymentIntentId)
}

const placeOrder = async () => {
  isPlacingOrder.value = true

  try {
    const items = cartStore.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      variant: item.variant
    }))

    const customerEmail = customerStore.isAuthenticated
      ? customerStore.customer?.email || ''
      : guestForm.value.email

    const customerName = customerStore.isAuthenticated
      ? customerStore.fullName
      : guestForm.value.name

    const orderData = {
      customerEmail,
      customerName,
      customerId: customerStore.customer?.id || null,
      items,
      shippingAddress: cartStore.hasPhysicalItems ? shippingForm.value : null,
      notes: ''
    }

    if (selectedPayment.value === 'sepa') {
      // Create SEPA order
      const response = await fetch('/api/v1/orders/sepa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.order) {
        cartStore.clearCart()
        router.push(`/checkout/success?orderNumber=${data.order.orderNumber}&method=sepa`)
      } else {
        throw new Error(data.error || 'Order creation failed')
      }
    } else {
      // Create Stripe order first to get client secret
      const orderResponse = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const orderData = await orderResponse.json()

      if (orderData.clientSecret) {
        // Process payment with Stripe
        const paymentSuccess = await stripeFormRef.value?.processPayment()

        if (paymentSuccess) {
          // Confirm order
          await fetch(`/api/v1/orders/confirm-stripe/${orderData.order.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: orderData.paymentIntentId,
              customerId: customerStore.customer?.id
            })
          })

          cartStore.clearCart()
          router.push(`/checkout/success?orderNumber=${orderData.order.orderNumber}&method=stripe`)
        }
      } else {
        throw new Error('Failed to create payment intent')
      }
    }
  } catch (error: any) {
    console.error('Order placement failed:', error)
    alert(error.message || 'Order placement failed. Please try again.')
  } finally {
    isPlacingOrder.value = false
  }
}

// Watch for auth state changes
watch(
  () => customerStore.isAuthenticated,
  (isAuth) => {
    if (isAuth && authMode.value !== 'guest') {
      guestForm.value.email = customerStore.customer?.email || ''
    }
  }
)
</script>
