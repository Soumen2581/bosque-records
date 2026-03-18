<template>
  <div id="app" class="min-h-screen flex flex-col relative">
    <!-- Fractal Background Layer -->
    <FractalBackground />
    
    <!-- Three.js Background Canvas -->
    <canvas 
      ref="threeCanvas" 
      class="fixed inset-0 w-full h-full -z-10 opacity-30"
    ></canvas>
    
    <!-- Global Page Loader -->
    <LoadingSpinner 
      v-if="isNavigating"
      :full-screen="true"
      text="Loading..."
      subtitle="Entering the mystical forest..."
    />
    
    <!-- Main Application Content -->
    <TheHeader />
    
    <main class="flex-1 relative z-10">
      <router-view @play="handlePlay" v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" @play="handlePlay" />
        </Transition>
      </router-view>
    </main>
    
    <TheFooter />
    
    <!-- Global Audio Player -->
    <ReleasePlayer ref="globalPlayer" />
  </div>
</template>

<script setup>
import { onMounted, ref, provide, computed } from 'vue'
import TheHeader from '@/components/common/TheHeader.vue'
import TheFooter from '@/components/common/TheFooter.vue'
import ReleasePlayer from '@/components/releases/ReleasePlayer.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import FractalBackground from '@/components/common/FractalBackground.vue'
import { useThreeJS } from '@/composables/useThreeJS'
import { isNavigating } from '@/router'

const threeCanvas = ref(null)
const globalPlayer = ref(null)
const { initThreeJS } = useThreeJS()

const handlePlay = async (payload) => {
  try {
    if (globalPlayer.value && globalPlayer.value.playTrack) {
      await globalPlayer.value.playTrack(payload.track, payload.release)
    }
  } catch (error) {
    console.error('Error playing track:', error)
  }
}

// Provide the global player to child components
provide('globalPlayer', globalPlayer)

onMounted(() => {
  if (threeCanvas.value) {
    initThreeJS(threeCanvas.value)
  }
})
</script>

<style scoped>
#app {
  background: #0a0a0a;
}
.text-mystical-gold {
  color: #d4af37;
}
.text-mystical-red {
  color: #851d1d !important;
}
.text-mystical-green {
  color: #0f9721;
}

/* Organic page transition animations - forest-inspired */
.page-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  filter: blur(4px);
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.99);
  filter: blur(3px);
}
</style> 