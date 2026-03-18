<template>
  <PageLayout>
    <PageHeader 
      type="default"
      title="My Account"
      :subtitle="customerStore.isAuthenticated ? `Welcome back, ${customerStore.fullName}` : 'Manage your account'"
    />

    <div class="max-w-4xl mx-auto">
      <!-- Not logged in -->
      <div v-if="!customerStore.isAuthenticated" class="space-y-8">
        <!-- Login -->
        <div class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6">
          <h2 class="font-fell-sc text-xl text-mystical-gold mb-6">Login</h2>
          <form @submit.prevent="handleLogin" class="space-y-4">
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
            <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors disabled:opacity-50"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              Login
            </button>
          </form>
        </div>

        <!-- Register -->
        <div class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6">
          <h2 class="font-fell-sc text-xl text-mystical-gold mb-6">Create Account</h2>
          <form @submit.prevent="handleRegister" class="space-y-4">
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
            </div>
            <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-forest-green hover:bg-green-accent text-gray-light font-fell-sc rounded transition-colors disabled:opacity-50"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              Create Account
            </button>
          </form>
        </div>
      </div>

      <!-- Logged in -->
      <div v-else class="space-y-8">
        <!-- Navigation tabs -->
        <div class="flex border-b border-forest-green/30">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-3 font-fell transition-colors"
            :class="
              activeTab === tab.id
                ? 'text-mystical-gold border-b-2 border-mystical-gold'
                : 'text-gray-medium hover:text-gray-light'
            "
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.label }}
          </button>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6">
          <h2 class="font-fell-sc text-xl text-mystical-gold mb-6">Profile Information</h2>
          <form @submit.prevent="handleUpdateProfile" class="space-y-4 max-w-lg">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-medium mb-1">First Name</label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-medium mb-1">Last Name</label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  class="w-full px-4 py-3 bg-forest-green/20 border border-forest-green/50 rounded text-gray-light focus:border-mystical-gold focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-medium mb-1">Email</label>
              <input
                :value="customerStore.customer?.email"
                type="email"
                disabled
                class="w-full px-4 py-3 bg-forest-green/10 border border-forest-green/30 rounded text-gray-medium cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              :disabled="isUpdating"
              class="px-6 py-3 bg-mystical-gold hover:bg-yellow-500 text-forest-black font-fell-sc rounded transition-colors disabled:opacity-50"
            >
              <i v-if="isUpdating" class="fas fa-spinner fa-spin mr-2"></i>
              Update Profile
            </button>
          </form>
        </div>

        <!-- Orders Tab -->
        <div v-if="activeTab === 'orders'" class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6">
          <h2 class="font-fell-sc text-xl text-mystical-gold mb-6">Order History</h2>
          <div v-if="customerStore.orders.length === 0" class="text-center py-8">
            <i class="fas fa-receipt text-4xl text-forest-green mb-4"></i>
            <p class="text-gray-medium">No orders yet</p>
            <router-link
              to="/shop"
              class="inline-block mt-4 px-6 py-2 bg-forest-green hover:bg-green-accent text-gray-light rounded transition-colors"
            >
              Start Shopping
            </router-link>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="order in customerStore.orders"
              :key="order.id"
              class="border border-forest-green/30 rounded p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="text-mystical-gold font-fell">#{{ order.orderNumber }}</p>
                  <p class="text-sm text-gray-medium">{{ formatDate(order.createdAt) }}</p>
                </div>
                <span
                  class="px-3 py-1 text-xs rounded-full"
                  :class="{
                    'bg-yellow-900/30 text-yellow-500': order.status === 'pending',
                    'bg-green-900/30 text-green-500': order.status === 'paid' || order.status === 'delivered',
                    'bg-blue-900/30 text-blue-500': order.status === 'processing',
                    'bg-red-900/30 text-red-500': order.status === 'cancelled'
                  }"
                >
                  {{ order.status }}
                </span>
              </div>
              <div class="flex items-center gap-4 text-sm text-gray-medium">
                <span>{{ order.items.length }} items</span>
                <span class="text-mystical-gold">€{{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Library Tab -->
        <div v-if="activeTab === 'library'" class="bg-forest-black/80 border border-forest-green/30 rounded-lg p-6">
          <h2 class="font-fell-sc text-xl text-mystical-gold mb-6">Digital Library</h2>
          <div v-if="customerStore.digitalLibrary.length === 0" class="text-center py-8">
            <i class="fas fa-music text-4xl text-forest-green mb-4"></i>
            <p class="text-gray-medium">Your purchased digital products will appear here</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in customerStore.digitalLibrary"
              :key="item.id"
              class="border border-forest-green/30 rounded p-4 flex gap-4"
            >
              <img
                :src="item.product.images[0]"
                :alt="item.product.name"
                class="w-20 h-20 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="text-gray-light font-fell">{{ item.product.name }}</h4>
                <p class="text-xs text-gray-medium mt-1">
                  <i class="fas fa-download mr-1"></i>
                  MP3: {{ item.downloadCountMp3 }} | WAV: {{ item.downloadCountWav }}
                </p>
                <div class="mt-2 flex gap-2">
                  <a
                    v-if="item.product.downloadMp3"
                    @click.prevent="downloadFile(item.productId, 'mp3')"
                    href="#"
                    class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                  >
                    <i class="fas fa-download mr-1"></i>MP3
                  </a>
                  <a
                    v-if="item.product.downloadWav"
                    @click.prevent="downloadFile(item.productId, 'wav')"
                    href="#"
                    class="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors"
                  >
                    <i class="fas fa-download mr-1"></i>WAV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Logout -->
        <button
          @click="customerStore.logout"
          class="px-6 py-3 border border-red-800 text-red-400 hover:bg-red-900/30 rounded transition-colors"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import PageLayout from '@/components/common/PageLayout.vue'
import PageHeader from '@/components/common/PageHeader.vue'

const customerStore = useCustomerStore()

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
  { id: 'orders', label: 'Orders', icon: 'fas fa-receipt' },
  { id: 'library', label: 'Library', icon: 'fas fa-music' }
]

const activeTab = ref('profile')
const isLoading = ref(false)
const isUpdating = ref(false)
const error = ref('')

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ email: '', password: '', firstName: '', lastName: '' })
const profileForm = reactive({ firstName: '', lastName: '' })

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  const success = await customerStore.login(loginForm.email, loginForm.password)

  if (!success) {
    error.value = customerStore.error || 'Login failed'
  }

  isLoading.value = false
}

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''

  const success = await customerStore.register(
    registerForm.email,
    registerForm.password,
    registerForm.firstName,
    registerForm.lastName
  )

  if (!success) {
    error.value = customerStore.error || 'Registration failed'
  }

  isLoading.value = false
}

const handleUpdateProfile = async () => {
  isUpdating.value = true

  await customerStore.updateProfile({
    firstName: profileForm.firstName,
    lastName: profileForm.lastName
  })

  isUpdating.value = false
}

const downloadFile = async (productId: string, format: 'mp3' | 'wav') => {
  const url = await customerStore.getDownloadUrl(productId, format)
  if (url) {
    window.open(url, '_blank')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  if (customerStore.customer) {
    profileForm.firstName = customerStore.customer.firstName || ''
    profileForm.lastName = customerStore.customer.lastName || ''
  }
  if (customerStore.isAuthenticated) {
    customerStore.fetchCustomerData()
  }
})
</script>
