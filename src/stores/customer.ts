import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface SavedAddress {
  id: string
  name: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod?: string
  subtotal: number
  shippingCost: number
  total: number
  items: OrderItem[]
  shippingAddress?: SavedAddress
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  variant?: string
}

export interface DigitalLibraryItem {
  id: string
  productId: string
  product: any
  downloadCountMp3: number
  downloadCountWav: number
  lastDownloadAt?: string
  downloadExpiry?: string
  canDownload: boolean
}

const AUTH_TOKEN_KEY = 'bosque_auth_token'
const CUSTOMER_KEY = 'bosque_customer'

export const useCustomerStore = defineStore('customer', () => {
  const token = ref<string | null>(null)
  const customer = ref<Customer | null>(null)
  const orders = ref<Order[]>([])
  const digitalLibrary = ref<DigitalLibraryItem[]>([])
  const savedAddresses = ref<SavedAddress[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!customer.value)

  const fullName = computed(() => {
    if (!customer.value) return ''
    const name = [customer.value.firstName, customer.value.lastName]
      .filter(Boolean)
      .join(' ')
    return name || customer.value.email
  })

  const defaultAddress = computed(
    () => savedAddresses.value.find((a) => a.isDefault) || savedAddresses.value[0]
  )

  // Load from storage
  function loadFromStorage() {
    if (typeof window === 'undefined') return

    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const storedCustomer = localStorage.getItem(CUSTOMER_KEY)

    if (storedToken) token.value = storedToken
    if (storedCustomer) {
      try {
        customer.value = JSON.parse(storedCustomer)
      } catch (e) {
        console.error('Failed to parse customer from storage:', e)
      }
    }
  }

  // Save to storage
  function saveToStorage() {
    if (typeof window === 'undefined') return

    if (token.value) {
      localStorage.setItem(AUTH_TOKEN_KEY, token.value)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }

    if (customer.value) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer.value))
    } else {
      localStorage.removeItem(CUSTOMER_KEY)
    }
  }

  // API helper
  async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    const baseUrl = import.meta.env.VITE_API_URL || ''

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      return data
    } catch (e) {
      console.error('API Error:', e)
      return null
    }
  }

  // Actions
  async function register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiCall<{
        customer: Customer
        token: string
      }>('/customers/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName })
      })

      if (response) {
        customer.value = response.customer
        token.value = response.token
        saveToStorage()
        return true
      }

      error.value = 'Registration failed'
      return false
    } catch (e: any) {
      error.value = e.message || 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiCall<{
        customer: Customer
        token: string
      }>('/customers/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      if (response) {
        customer.value = response.customer
        token.value = response.token
        saveToStorage()
        await fetchCustomerData()
        return true
      }

      error.value = 'Login failed'
      return false
    } catch (e: any) {
      error.value = e.message || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    customer.value = null
    token.value = null
    orders.value = []
    digitalLibrary.value = []
    savedAddresses.value = []
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(CUSTOMER_KEY)
  }

  async function fetchCustomerData() {
    if (!isAuthenticated.value) return

    try {
      const response = await apiCall<any>('/customers/me')

      if (response && !response.error) {
        customer.value = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName
        }
        savedAddresses.value = response.addresses || []
        orders.value = response.orders || []
        digitalLibrary.value = response.digitalLibrary || []
        saveToStorage()
      }
    } catch (e) {
      console.error('Error fetching customer data:', e)
    }
  }

  async function updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiCall<Customer>('/customers/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      })

      if (response) {
        customer.value = { ...customer.value, ...response }
        saveToStorage()
        return true
      }

      return false
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function addAddress(address: Omit<SavedAddress, 'id'>) {
    try {
      const response = await apiCall<{ addresses: SavedAddress[] }>(
        '/customers/addresses',
        {
          method: 'POST',
          body: JSON.stringify({ address })
        }
      )

      if (response) {
        savedAddresses.value = response.addresses
        return true
      }

      return false
    } catch (e) {
      console.error('Error adding address:', e)
      return false
    }
  }

  async function removeAddress(addressId: string) {
    try {
      const response = await apiCall<{ addresses: SavedAddress[] }>(
        `/customers/addresses/${addressId}`,
        { method: 'DELETE' }
      )

      if (response) {
        savedAddresses.value = response.addresses
        return true
      }

      return false
    } catch (e) {
      console.error('Error removing address:', e)
      return false
    }
  }

  async function fetchDigitalLibrary() {
    if (!isAuthenticated.value) return

    try {
      const response = await apiCall<DigitalLibraryItem[]>('/customers/library')

      if (response && !response.error && Array.isArray(response)) {
        digitalLibrary.value = response
      }
    } catch (e) {
      console.error('Error fetching digital library:', e)
    }
  }

  async function getDownloadUrl(productId: string, format: 'mp3' | 'wav') {
    if (!isAuthenticated.value) return null

    try {
      const response = await apiCall<{ downloadUrl: string }>(
        `/customers/library/${productId}/download`,
        {
          method: 'POST',
          body: JSON.stringify({ format })
        }
      )

      if (response && response.downloadUrl) {
        // Update download count in local state
        const item = digitalLibrary.value.find((i) => i.productId === productId)
        if (item) {
          if (format === 'mp3') {
            item.downloadCountMp3++
          } else {
            item.downloadCountWav++
          }
          item.lastDownloadAt = new Date().toISOString()
        }

        return response.downloadUrl
      }

      return null
    } catch (e) {
      console.error('Error getting download URL:', e)
      return null
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiCall<{ success: boolean }>(
        '/customers/change-password',
        {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword })
        }
      )

      return response?.success || false
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Initialize
  if (typeof window !== 'undefined') {
    loadFromStorage()
    if (isAuthenticated.value) {
      fetchCustomerData()
    }
  }

  return {
    // State
    token,
    customer,
    orders,
    digitalLibrary,
    savedAddresses,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    fullName,
    defaultAddress,

    // Actions
    register,
    login,
    logout,
    fetchCustomerData,
    updateProfile,
    addAddress,
    removeAddress,
    fetchDigitalLibrary,
    getDownloadUrl,
    changePassword
  }
})
