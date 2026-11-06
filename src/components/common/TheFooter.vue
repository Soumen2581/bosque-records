<template>
  <footer class="bg-black border-t border-forest-green py-12 mt-auto">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand Section -->
        <div>
          <div class="flex items-center mb-4">
            <img 
              :src="bosqueHeaderLogo" 
              alt="Bosque Header" 
              class="h-10 w-auto"
            >
          </div>
          <p class="text-gray-medium mb-4">
            Deep forest psychedelic trance label and collective.
          </p>
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-medium hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mystical-gold"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
        
        <!-- Explore Section -->
        <div>
          <h5 class="text-lg title-font mb-4 text-mystical-gold">EXPLORE</h5>
          <ul class="space-y-2">
            <li v-for="link in exploreLinks" :key="link.path">
              <router-link 
                :to="link.path" 
                class="text-gray-medium hover:text-white transition-colors duration-300"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Support Section -->
        <div>
          <h5 class="text-lg title-font mb-4 text-mystical-gold">SUPPORT</h5>
          <ul class="space-y-2">
            <li v-for="link in supportLinks" :key="link.path">
              <router-link 
                :to="link.path" 
                class="text-gray-medium hover:text-white transition-colors duration-300"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>
        
        <div>
          <h5 class="text-lg title-font mb-4 text-mystical-gold">LABEL</h5>
          <ul class="space-y-2">
            <li>
              <a :href="`mailto:${label.email}`" class="text-gray-medium hover:text-white">{{ label.email }}</a>
            </li>
            <li>
              <a :href="label.links.linktree" target="_blank" rel="noopener noreferrer" class="text-gray-medium hover:text-white">Linktree</a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-forest-green pt-8 text-center text-gray-dark text-sm">
        <p>© {{ currentYear }} Bosque Records. All rights reserved. Crafted with ♥ in the heart of the forest.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import bosqueHeaderLogo from '@/assets/styles/image/logos/Bosque_Header.png'
import { label } from '@/config/label'

const currentYear = computed(() => new Date().getFullYear())

const exploreLinks = [
  { path: '/releases', label: 'Releases' },
  { path: '/roster', label: 'Artists' },
  { path: '/events', label: 'Events' },
  { path: '/visual-arts', label: 'Visual Arts' }
]

const supportLinks = [
  { path: '/shop', label: 'Shop' },
  { path: '/bookings', label: 'Bookings' },
  { path: '/contact', label: 'Contact' },
  { path: '/about', label: 'About' }
]

const socialLinks = [
  { label: 'Bandcamp', href: label.links.bandcamp },
  { label: 'SoundCloud', href: label.links.soundcloud },
  { label: 'Instagram', href: label.links.instagram },
  { label: 'Facebook', href: label.links.facebook }
]
</script> 