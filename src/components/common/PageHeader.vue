<!--
PageHeader Component Usage:
- type="default" - Uses Bosque_Header.png (main brand logo)
- type="records" - Uses Records_Sub_Header.png (for music/artist related pages)  
- type="creative" - Uses Unleash_Your_Minds_Playground_Header.png (for visual arts/events)
- type="custom" - Use with customLogo prop for specific logos
-->
<template>
  <div class="text-center mb-12">
    <!-- Dynamic Header Logo -->
    <div class="flex justify-center mb-6">
      <img 
        :src="headerLogo" 
        :alt="headerAlt" 
        class="h-20 md:h-24 w-auto"
        loading="eager"
        decoding="sync"
      >
    </div>
    
    <!-- Optional Title (for pages without logo headers) -->
    <h1 v-if="title && !useLogoAsTitle" class="text-4xl title-font mb-4 text-mystical-gold">
      {{ title }}
    </h1>
    
    <!-- Optional Subtitle -->
    <p v-if="subtitle" class="text-gray-medium max-w-2xl mx-auto mb-6">
      {{ subtitle }}
    </p>
    
    <!-- Mystical Divider -->
    <MysticalDivider />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MysticalDivider from './MysticalDivider.vue'

// Import header logos
import bosqueHeaderLogo from '@/assets/styles/image/logos/Bosque_Header.png'
import recordsSubHeaderLogo from '@/assets/styles/image/logos/Records_Sub_Header.png'
import unleashHeaderLogo from '@/assets/styles/image/logos/Unleash_Your_Minds_Playground_Header.png'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'records', 'creative', 'custom'].includes(value)
  },
  customLogo: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  useLogoAsTitle: {
    type: Boolean,
    default: true
  }
})

const headerLogo = computed(() => {
  switch (props.type) {
    case 'records':
      return recordsSubHeaderLogo
    case 'creative':
      return unleashHeaderLogo
    case 'custom':
      return props.customLogo || bosqueHeaderLogo
    default:
      return bosqueHeaderLogo
  }
})

const headerAlt = computed(() => {
  switch (props.type) {
    case 'records':
      return 'Records Sub Header'
    case 'creative':
      return 'Unleash Your Minds Playground Header'
    case 'custom':
      return 'Custom Header'
    default:
      return 'Bosque Header'
  }
})
</script> 