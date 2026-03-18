<template>
  <header class="bg-black bg-opacity-90 border-b border-forest-green sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo Option 1: Combined Headers -->

        <router-link to="/" class="flex items-center group">
      
          <div class="flex flex-col items-center space-y-1">
            <img 
              :src="bosqueHeaderLogo" 
              alt="Bosque Header" 
              class="h-10 w-auto transition-transform group-hover:scale-105"
            >
            <img 
              :src="recordsSubHeaderLogo" 
              alt="Records Sub Header" 
              class="h-6 w-auto transition-transform group-hover:scale-105"
            >
          </div>
        </router-link>
        
        <!-- Logo Option 2: Horizontal Headers (uncomment to use) -->
        <!--
        <router-link to="/" class="flex items-center group space-x-2">
          <img 
            :src="bosqueHeaderLogo" 
            alt="Bosque Header" 
            class="h-12 w-auto transition-transform group-hover:scale-105"
          >
          <img 
            :src="recordsSubHeaderLogo" 
            alt="Records Sub Header" 
            class="h-8 w-auto transition-transform group-hover:scale-105"
          >
        </router-link>
        -->
        
        <!-- Logo Option 3: Original Logo + Text (uncomment to use) -->
        <!--
        <router-link to="/" class="flex items-center group">
          <img 
            :src="bosqueRecordsLogo" 
            alt="Bosque Records Logo" 
            class="h-12 w-auto mr-3 transition-transform group-hover:scale-110 organic-float"
          >
          <h1 class="text-2xl title-font tracking-wider">
            <span class="text-white transition-colors group-hover:text-gray-200">BOSQUE</span>
            <span class="text-mystical-gold transition-colors group-hover:text-yellow-400">RECORDS</span>
          </h1>
        </router-link>
        -->
        
        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-gray-medium hover:text-white focus:outline-none transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          <i class="fas fa-bars text-2xl"></i>
        </button>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link text-gray-medium hover:text-white transition-colors duration-300"
            active-class="text-white"
          >
            {{ item.label }}
          </router-link>
          
          <!-- Cart Icon -->
          <router-link
            to="/cart"
            class="relative text-gray-medium hover:text-mystical-gold transition-colors"
            active-class="text-mystical-gold"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-mystical-gold text-forest-black text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ cartStore.itemCount > 9 ? '9+' : cartStore.itemCount }}
            </span>
          </router-link>
          
          <!-- Account Icon -->
          <router-link
            to="/account"
            class="text-gray-medium hover:text-mystical-gold transition-colors"
            active-class="text-mystical-gold"
          >
            <i class="fas fa-user text-xl"></i>
          </router-link>
        </nav>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <MobileMenu 
      v-show="showMobileMenu" 
      :items="navItems" 
      @close="closeMobileMenu" 
    />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import MobileMenu from './MobileMenu.vue'
import { useCartStore } from '@/stores/cart'
import bosqueHeaderLogo from '@/assets/styles/image/logos/Bosque_Header.png'
import recordsSubHeaderLogo from '@/assets/styles/image/logos/Records_Sub_Header.png'
import bosqueRecordsLogo from '@/assets/styles/image/logos/Bosque Records Logo.png'

const cartStore = useCartStore()
const showMobileMenu = ref(false)

const navItems = [
  
  { path: '/about', label: 'About' },
  { path: '/releases', label: 'Releases' },
  { path: '/roster', label: 'Roster' },
  { path: '/visual-arts', label: 'Visual Arts' },
  { path: '/shop', label: 'Shop' },
  { path: '/bookings', label: 'Bookings' },
  { path: '/contact', label: 'Contact' },
  { path: '/events', label: 'Events' },
  //{ path: '/admin', label: '🔧 Admin' }
]

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>

<style scoped>
.router-link-active {
  @apply text-white;
}

.router-link-active::after {
  width: 100%;
}
</style> 