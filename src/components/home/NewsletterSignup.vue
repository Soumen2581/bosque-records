<template>
  <section class="py-16 bg-gradient-to-r from-forest-green to-black">
    <div class="container mx-auto px-4 text-center">
      <h3 class="text-3xl title-font mb-6 text-mystical-gold">✦ JOIN OUR CIRCLE ✦</h3>
      <p class="text-gray-light max-w-2xl mx-auto mb-8">
        Receive updates on new releases, exclusive content, and invitations to secret forest gatherings.
      </p>
      
      <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
        <div class="flex flex-col sm:flex-row gap-2">
          <input 
            v-model="email"
            type="email" 
            placeholder="Your sacred email" 
            required
            class="flex-grow px-4 py-3 bg-black bg-opacity-50 border border-forest-green text-white placeholder-gray-medium focus:outline-none focus:ring-1 focus:ring-mystical-gold focus:border-mystical-gold transition-colors duration-300"
          >
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-3 bg-forest-green hover:bg-green-accent text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            <span v-else>Subscribe</span>
          </button>
        </div>
        
        <p v-if="message" :class="messageClass" class="mt-4 text-sm">
          {{ message }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

const { post, loading } = useApi()

const email = ref('')
const message = ref('')
const success = ref(false)

const messageClass = computed(() => ({
  'text-mystical-gold': success.value,
  'text-red-400': !success.value
}))

const handleSubmit = async () => {
  if (!email.value.trim()) return
  
  try {
    await post('/newsletter/subscribe', { email: email.value })
    message.value = 'Successfully subscribed to our mystical updates! 🌿'
    success.value = true
    email.value = ''
  } catch (error) {
    message.value = error.message || 'Failed to subscribe. Please try again.'
    success.value = false
  }
  
  // Clear message after 5 seconds
  setTimeout(() => {
    message.value = ''
  }, 5000)
}
</script> 