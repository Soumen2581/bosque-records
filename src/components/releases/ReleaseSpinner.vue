<template>
  <div class="release-spinner-container">
    <div class="spinner-header">
      <h2 class="text-3xl title-font text-mystical-gold mb-2">✦ Release Carousel ✦</h2>
      <p class="text-gray-medium mb-6">Drag or click to spin the releases</p>
    </div>
    
    <div 
      ref="spinnerRef"
      class="release-spinner"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div 
        class="spinner-wheel"
        :style="{ transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)` }"
      >
        <div
          v-for="(release, index) in releases"
          :key="release.id"
          class="spinner-item"
          :style="getItemStyle(index)"
          @click="selectRelease(release)"
        >
          <div class="spinner-item-content">
            <img 
              :src="release.coverImage || placeholderImage"
              :alt="release.title"
              class="spinner-item-image"
              @error="handleImageError"
            />
            <div class="spinner-item-overlay">
              <h3 class="spinner-item-title">{{ release.title }}</h3>
              <p class="spinner-item-artist">{{ release.artist?.name || 'Unknown' }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Center indicator -->
      <div class="spinner-center">
        <div class="center-ring"></div>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="spinner-controls">
      <button 
        @click="spinLeft"
        class="control-button"
        aria-label="Spin left"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button 
        @click="stopSpin"
        class="control-button"
        aria-label="Stop spinning"
      >
        <i class="fas fa-stop"></i>
      </button>
      <button 
        @click="spinRight"
        class="control-button"
        aria-label="Spin right"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    
    <!-- Selected Release Info -->
    <div v-if="selectedRelease" class="selected-release-info">
      <h3 class="text-xl title-font text-mystical-gold mb-2">{{ selectedRelease.title }}</h3>
      <p class="text-gray-medium mb-4">by {{ selectedRelease.artist?.name || 'Unknown' }}</p>
      <div class="flex gap-4">
        <button 
          @click="viewRelease(selectedRelease)"
          class="px-6 py-2 border border-mystical-gold text-mystical-gold hover:bg-forest-green hover:bg-opacity-30 transition duration-300"
        >
          View Details
        </button>
        <button 
          v-if="selectedRelease.tracks && selectedRelease.tracks.length > 0"
          @click="playRelease(selectedRelease)"
          class="px-6 py-2 bg-forest-green bg-opacity-70 hover:bg-opacity-100 text-white transition duration-300"
        >
          Play
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  releases: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['play', 'view'])

const router = useRouter()
const spinnerRef = ref<HTMLElement | null>(null)

const rotationY = ref(0)
const rotationX = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0, rotationY: 0, rotationX: 0 })
const spinVelocity = ref(0)
const selectedRelease = ref(null)

const placeholderImage = computed(() => {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="300" fill="#14331e"/>
    <text x="150" y="150" text-anchor="middle" dominant-baseline="middle" 
          fill="#d4af37" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
      Release
    </text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
})

const itemCount = computed(() => props.releases.length - 2)
const angleStep = computed(() => itemCount.value > 0 ? 360 / itemCount.value : 0)
const radius = 250 // Distance from center in pixels

const getItemStyle = (index: number) => {
  const angle = (index * angleStep.value) * (Math.PI / 180)
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  
  return {
    transform: `translateX(${x}px) translateZ(${z}px) rotateY(${angle * (180 / Math.PI)}deg)`,
    '--item-index': index
  }
}

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    rotationY: rotationY.value,
    rotationX: rotationX.value
  }
  spinVelocity.value = 0
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y
  
  // Direct linear movement - no easing or sine interpolation
  rotationY.value = dragStart.value.rotationY + deltaX * 0.5
  rotationX.value = Math.max(-15, Math.min(15, dragStart.value.rotationX + deltaY * 0.3))
  
  // Calculate velocity for momentum
  spinVelocity.value = deltaX * 0.1
}

const handleMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    // Apply momentum
    if (Math.abs(spinVelocity.value) > 2) {
      applyMomentum()
    }
  }
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging.value = true
    dragStart.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      rotationY: rotationY.value,
      rotationX: rotationX.value
    }
    spinVelocity.value = 0
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return
  
  const deltaX = e.touches[0].clientX - dragStart.value.x
  const deltaY = e.touches[0].clientY - dragStart.value.y
  
  // Direct linear movement - no easing or sine interpolation
  rotationY.value = dragStart.value.rotationY + deltaX * 0.5
  rotationX.value = Math.max(-15, Math.min(15, dragStart.value.rotationX + deltaY * 0.3))
  
  spinVelocity.value = deltaX * 0.1
}

const handleTouchEnd = () => {
  if (isDragging.value) {
    isDragging.value = false
    if (Math.abs(spinVelocity.value) > 2) {
      applyMomentum()
    }
  }
}

const applyMomentum = () => {
  const animate = () => {
    if (Math.abs(spinVelocity.value) < 0.5) {
      spinVelocity.value = 0
      return
    }
    
    // Linear momentum - direct addition, no sine interpolation
    rotationY.value += spinVelocity.value
    spinVelocity.value *= 0.95 // Linear friction decay
    
    requestAnimationFrame(animate)
  }
  animate()
}

const spinLeft = () => {
  rotationY.value -= angleStep.value * 2
  findNearestRelease()
}

const spinRight = () => {
  rotationY.value += angleStep.value * 2
  findNearestRelease()
}

const stopSpin = () => {
  spinVelocity.value = 0
  findNearestRelease()
}

const findNearestRelease = () => {
  if (itemCount.value === 0) {
    selectedRelease.value = null
    return
  }
  
  const normalizedRotation = ((rotationY.value % 360) + 360) % 360
  let nearestIndex = Math.round(normalizedRotation / angleStep.value) % itemCount.value
  if (nearestIndex < 0) nearestIndex += itemCount.value
  selectedRelease.value = props.releases[nearestIndex] || null
}

const selectRelease = (release: any) => {
  selectedRelease.value = release
  // Snap to this release
  const index = props.releases.findIndex(r => r.id === release.id)
  if (index >= 0) {
    rotationY.value = index * angleStep.value
  }
}

const viewRelease = (release: any) => {
  emit('view', release)
  router.push(`/releases/${release.slug}`)
}

const playRelease = (release: any) => {
  if (release.tracks && release.tracks.length > 0) {
    emit('play', {
      release,
      track: release.tracks[0]
    })
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img.src !== placeholderImage.value) {
    img.src = placeholderImage.value
  }
}

  // Auto-rotate slowly when idle
  let autoRotateInterval: number | null = null

// Watch for rotation changes to update selected release
watch(() => rotationY.value, () => {
  if (!isDragging.value && Math.abs(spinVelocity.value) < 1) {
    findNearestRelease()
  }
}, { immediate: true })

// Watch for releases changes
watch(() => props.releases.length, () => {
  if (props.releases.length > 0 && !selectedRelease.value) {
    selectedRelease.value = props.releases[0]
    findNearestRelease()
  }
})

onMounted(() => {
  if (props.releases.length > 0) {
    selectedRelease.value = props.releases[0]
    findNearestRelease()
  }
  
  // Subtle auto-rotation - very slow organic drift
  autoRotateInterval = window.setInterval(() => {
    if (!isDragging.value && Math.abs(spinVelocity.value) < 0.5) {
      rotationY.value += 0.05
    }
  }, 100)
})

onUnmounted(() => {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval)
  }
})
</script>

<style scoped>
.release-spinner-container {
  @apply py-16 px-4;
  perspective: 1200px;
}

.spinner-header {
  @apply text-center mb-12;
}

.release-spinner {
  @apply relative mx-auto;
  width: 600px;
  height: 600px;
  perspective: 1200px;
  cursor: grab;
  user-select: none;
}

.release-spinner:active {
  cursor: grabbing;
}

.spinner-wheel {
  @apply relative w-full h-full;
  transform-style: preserve-3d;
  transition: transform 0.05s linear;
  will-change: transform;
}

.spinner-item {
  @apply absolute;
  width: 200px;
  height: 200px;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
  transform-style: preserve-3d;
  transition: transform 0.15s linear;
  cursor: pointer;
  will-change: transform;
}

.spinner-item-content {
  @apply relative w-full h-full;
  transform-style: preserve-3d;
}

.spinner-item-image {
  @apply w-full h-full object-cover rounded-lg border-2 border-forest-green;
  box-shadow: 0 10px 40px rgba(20, 51, 30, 0.6),
              0 0 20px rgba(212, 175, 55, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.spinner-item:hover .spinner-item-image {
  transform: scale(1.1);
  box-shadow: 0 15px 60px rgba(20, 51, 30, 0.8),
              0 0 30px rgba(212, 175, 55, 0.5);
  border-color: rgba(212, 175, 55, 0.8);
}

.spinner-item-overlay {
  @apply absolute inset-0 bg-black bg-opacity-70 opacity-0 transition-opacity duration-300 rounded-lg flex flex-col items-center justify-center;
}

.spinner-item:hover .spinner-item-overlay {
  opacity: 1;
}

.spinner-item-title {
  @apply text-lg title-font text-mystical-gold mb-1 px-4 text-center;
}

.spinner-item-artist {
  @apply text-sm text-gray-medium px-4 text-center;
}

.spinner-center {
  @apply absolute top-1/2 left-1/2;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 10;
}

.center-ring {
  @apply w-full h-full rounded-full border-2 border-mystical-gold;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5),
              inset 0 0 20px rgba(212, 175, 55, 0.2);
  animation: organic-pulse 3s ease-in-out infinite;
}

.spinner-controls {
  @apply flex justify-center items-center gap-6 mt-12;
}

.control-button {
  @apply w-12 h-12 rounded-full border-2 border-mystical-gold text-mystical-gold bg-black bg-opacity-50 hover:bg-forest-green hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center;
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.control-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

.control-button:active {
  transform: scale(0.95);
}

.selected-release-info {
  @apply mt-12 text-center max-w-md mx-auto p-6 bg-black bg-opacity-50 border border-forest-green rounded-lg;
}

@keyframes organic-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@media (max-width: 768px) {
  .release-spinner {
    width: 100%;
    max-width: 400px;
    height: 400px;
  }
  
  .spinner-item {
    width: 150px;
    height: 150px;
    margin-left: -75px;
    margin-top: -75px;
  }
}
</style>

