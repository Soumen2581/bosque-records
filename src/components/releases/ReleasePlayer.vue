<template>
  <div 
    v-if="currentTrack.id"
    class="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 border-t border-forest-green backdrop-blur-sm z-40"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row items-center gap-4">
        <!-- Track Info -->
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div 
            v-if="currentTrack.coverImage"
            class="w-12 h-12 flex-shrink-0 overflow-hidden border border-forest-green"
          >
            <img 
              :src="currentTrack.coverImage" 
              :alt="currentTrack.release"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-medium text-white truncate">{{ currentTrack.title }}</h4>
            <p class="text-xs text-gray-medium truncate">
              {{ currentTrack.artist }} - {{ currentTrack.release }}
            </p>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="flex items-center gap-3">
          <button
            @click="togglePlayback"
            :disabled="isLoading"
            class="w-10 h-10 flex items-center justify-center bg-mystical-gold text-black rounded-full hover:bg-opacity-80 transition duration-300 disabled:opacity-50"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <i v-else-if="isPlaying" class="fas fa-pause"></i>
            <i v-else class="fas fa-play"></i>
          </button>
          
          <button
            @click="clearTrack"
            class="w-8 h-8 flex items-center justify-center text-gray-medium hover:text-white transition duration-300"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Progress Bar -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <span class="text-xs text-gray-medium whitespace-nowrap">{{ formattedCurrentTime }}</span>
          
          <div 
            class="flex-1 h-2 bg-forest-green bg-opacity-30 rounded-full cursor-pointer"
            @click="handleProgressClick"
            ref="progressBar"
          >
            <div 
              class="h-full bg-mystical-gold rounded-full transition-all duration-100"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          
          <span class="text-xs text-gray-medium whitespace-nowrap">{{ formattedDuration }}</span>
        </div>
        
        <!-- Volume Control -->
        <div class="flex items-center gap-2">
          <button
            @click="toggleMute"
            class="w-8 h-8 flex items-center justify-center text-gray-medium hover:text-white transition duration-300"
          >
            <i v-if="volume === 0" class="fas fa-volume-mute"></i>
            <i v-else-if="volume < 0.5" class="fas fa-volume-down"></i>
            <i v-else class="fas fa-volume-up"></i>
          </button>
          
          <div class="w-20 h-2 bg-forest-green bg-opacity-30 rounded-full cursor-pointer">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              @input="setVolume(parseFloat($event.target.value))"
              class="w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              class="h-full bg-mystical-gold rounded-full pointer-events-none"
              :style="{ width: `${volume * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="mt-2 text-red-400 text-sm text-center">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAudio } from '@/composables/useAudio'

const {
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  error,
  currentTrack,
  progress,
  formattedCurrentTime,
  formattedDuration,
  togglePlayback,
  setVolume,
  toggleMute,
  seekToPercentage,
  clearTrack
} = useAudio()

const progressBar = ref(null)

const handleProgressClick = (event) => {
  if (!progressBar.value || duration.value === 0) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = (clickX / rect.width) * 100
  
  seekToPercentage(Math.max(0, Math.min(100, percentage)))
}

// Expose audio functionality to parent components
defineExpose({
  isPlaying,
  isLoading,
  currentTrack,
  playTrack: useAudio().playTrack,
  togglePlayback,
  clearTrack
})
</script>

<style scoped>
/* Custom range input styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: transparent;
  height: 100%;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #d4af37;
  cursor: pointer;
  border: none;
}

input[type="range"]::-moz-range-track {
  background: transparent;
  height: 100%;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #d4af37;
  cursor: pointer;
  border: none;
}
</style> 