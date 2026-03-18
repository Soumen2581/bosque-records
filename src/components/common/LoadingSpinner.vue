<template>
  <div 
    :class="[
      'flex items-center justify-center',
      fullScreen ? 'fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm' : '',
      containerClass
    ]"
  >
    <div class="text-center">
      <!-- Animated Spinner with organic motion -->
      <div 
        :class="[
          'inline-block relative',
          size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12',
          'mb-4'
        ]"
      >
        <!-- Outer rotating ring -->
        <div 
          :class="[
            'absolute inset-0 border-4 border-forest-green rounded-full',
            'animate-spin-organic'
          ]"
          style="border-top-color: transparent; border-right-color: transparent;"
        ></div>
        <!-- Inner pulsing circle -->
        <div 
          :class="[
            'absolute inset-2 border-2 border-mystical-gold rounded-full',
            'animate-organic-pulse'
          ]"
          style="border-bottom-color: transparent;"
        ></div>
        <!-- Center glow -->
        <div 
          class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-mystical-gold rounded-full animate-organic-pulse"
          style="box-shadow: 0 0 12px rgba(212, 175, 55, 0.8);"
        ></div>
      </div>
      
      <!-- Optional Text -->
      <p 
        v-if="text || $slots.default" 
        :class="[
          'text-mystical-gold font-fell',
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'
        ]"
      >
        <slot>{{ text }}</slot>
      </p>
      
      <!-- Optional Subtitle -->
      <p 
        v-if="subtitle" 
        class="text-gray-medium text-sm mt-2"
      >
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
  text?: string
  subtitle?: string
  containerClass?: string
}

withDefaults(defineProps<Props>(), {
  fullScreen: false,
  size: 'md',
  text: '',
  subtitle: '',
  containerClass: ''
})
</script>

<style scoped>
/* Organic spinner animations */
@keyframes spin-organic {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes organic-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.animate-spin-organic {
  animation: spin-organic 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.animate-organic-pulse {
  animation: organic-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

