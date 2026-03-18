import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ProductVariant {
  type: 'size' | 'color'
  value: string
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  salePrice?: number
  image: string
  quantity: number
  variant?: ProductVariant
  productType: 'physical' | 'digital' | 'vinyl'
  maxQuantity?: number
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface BillingAddress {
  name: string
  street: string
  city: string
  postalCode: string
  country: string
}

const CART_STORAGE_KEY = 'bosque_cart'
const SHIPPING_CONFIG = {
  flatRate: 7.5,
  freeThreshold: 75
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const shippingAddress = ref<ShippingAddress | null>(null)
  const billingAddress = ref<BillingAddress | null>(null)
  const couponCode = ref<string | null>(null)
  const couponDiscount = ref<number>(0)

  // Load cart from localStorage
  function loadFromStorage() {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        items.value = parsed.items || []
        shippingAddress.value = parsed.shippingAddress || null
      } catch (e) {
        console.error('Failed to parse cart from storage:', e)
      }
    }
  }

  // Save cart to localStorage
  function saveToStorage() {
    if (typeof window === 'undefined') return
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: items.value,
        shippingAddress: shippingAddress.value
      })
    )
  }

  // Computed properties
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const hasPhysicalItems = computed(() =>
    items.value.some(
      (item) => item.productType === 'physical' || item.productType === 'vinyl'
    )
  )

  const subtotal = computed(() =>
    items.value.reduce(
      (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
      0
    )
  )

  const discount = computed(() => couponDiscount.value)

  const shippingCost = computed(() => {
    if (!hasPhysicalItems.value) return 0
    if (subtotal.value >= SHIPPING_CONFIG.freeThreshold) return 0
    return SHIPPING_CONFIG.flatRate
  })

  const freeShippingProgress = computed(() => {
    if (!hasPhysicalItems.value) return 100
    if (subtotal.value >= SHIPPING_CONFIG.freeThreshold) return 100
    return Math.min(100, Math.round((subtotal.value / SHIPPING_CONFIG.freeThreshold) * 100))
  })

  const amountUntilFreeShipping = computed(() => {
    if (subtotal.value >= SHIPPING_CONFIG.freeThreshold) return 0
    return SHIPPING_CONFIG.freeThreshold - subtotal.value
  })

  const total = computed(() =>
    subtotal.value + shippingCost.value - discount.value
  )

  // Actions
  function addItem(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    const existingIndex = items.value.findIndex(
      (i) =>
        i.productId === item.productId &&
        JSON.stringify(i.variant) === JSON.stringify(item.variant)
    )

    if (existingIndex >= 0) {
      const newQty = items.value[existingIndex].quantity + quantity
      if (item.maxQuantity && newQty > item.maxQuantity) {
        items.value[existingIndex].quantity = item.maxQuantity
      } else {
        items.value[existingIndex].quantity = newQty
      }
    } else {
      items.value.push({ ...item, quantity })
    }

    saveToStorage()
  }

  function removeItem(productId: string, variant?: ProductVariant) {
    const index = items.value.findIndex(
      (i) =>
        i.productId === productId &&
        JSON.stringify(i.variant) === JSON.stringify(variant)
    )

    if (index >= 0) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function updateQuantity(
    productId: string,
    quantity: number,
    variant?: ProductVariant
  ) {
    const item = items.value.find(
      (i) =>
        i.productId === productId &&
        JSON.stringify(i.variant) === JSON.stringify(variant)
    )

    if (item) {
      if (quantity <= 0) {
        removeItem(productId, variant)
      } else {
        if (item.maxQuantity && quantity > item.maxQuantity) {
          item.quantity = item.maxQuantity
        } else {
          item.quantity = quantity
        }
        saveToStorage()
      }
    }
  }

  function clearCart() {
    items.value = []
    shippingAddress.value = null
    billingAddress.value = null
    couponCode.value = null
    couponDiscount.value = 0
    saveToStorage()
  }

  function setShippingAddress(address: ShippingAddress) {
    shippingAddress.value = address
    saveToStorage()
  }

  function setBillingAddress(address: BillingAddress) {
    billingAddress.value = address
  }

  function applyCoupon(code: string, discountPercent: number) {
    couponCode.value = code
    couponDiscount.value = Math.round((subtotal.value * discountPercent) / 100 * 100) / 100
  }

  function removeCoupon() {
    couponCode.value = null
    couponDiscount.value = 0
  }

  function getItem(productId: string, variant?: ProductVariant) {
    return items.value.find(
      (i) =>
        i.productId === productId &&
        JSON.stringify(i.variant) === JSON.stringify(variant)
    )
  }

  // Initialize
  if (typeof window !== 'undefined') {
    loadFromStorage()
  }

  return {
    // State
    items,
    shippingAddress,
    billingAddress,
    couponCode,
    couponDiscount,

    // Computed
    itemCount,
    hasPhysicalItems,
    subtotal,
    discount,
    shippingCost,
    freeShippingProgress,
    amountUntilFreeShipping,
    total,
    freeShippingThreshold: SHIPPING_CONFIG.freeThreshold,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setShippingAddress,
    setBillingAddress,
    applyCoupon,
    removeCoupon,
    getItem
  }
})
