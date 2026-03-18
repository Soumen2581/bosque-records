<template>
  <canvas ref="canvasRef" class="fractal-background"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrame: number | null = null
let time = 0

const drawFractal = (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
    ctx.clearRect(0, 0, width, height)
    
    // Deep dark base with subtle gradient - very dark forest feel
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 1.2)
    gradient.addColorStop(0, 'rgba(5, 10, 5, 0.98)')
    gradient.addColorStop(0.3, 'rgba(3, 8, 3, 0.99)')
    gradient.addColorStop(0.6, 'rgba(2, 5, 2, 1)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Fractal pattern layers
  const layers = 8
  const centerX = width / 2
  const centerY = height / 2
  
  for (let layer = 0; layer < layers; layer++) {
    const layerTime = t * (0.3 + layer * 0.1)
    const radius = (width * 0.3) + Math.sin(layerTime * 0.5) * (width * 0.1)
    const rotation = layerTime * 0.2 + layer * Math.PI / layers
    
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)
    
    // Create glowing fractal branches
    const branches = 6 + layer * 2
    for (let i = 0; i < branches; i++) {
      const angle = (i * 2 * Math.PI) / branches + Math.sin(layerTime * 0.3) * 0.2
      const branchLength = radius * (0.6 + Math.sin(layerTime * 0.7 + i) * 0.3)
      
      // Draw main branch with glow
      const x = Math.cos(angle) * branchLength
      const y = Math.sin(angle) * branchLength
      
      // Deep dark glowing outer aura
      const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, branchLength * 0.8)
      glowGradient.addColorStop(0, `rgba(20, 51, 30, ${0.4 - layer * 0.04})`)
      glowGradient.addColorStop(0.3, `rgba(15, 40, 20, ${0.25 - layer * 0.025})`)
      glowGradient.addColorStop(0.6, `rgba(10, 25, 12, ${0.15 - layer * 0.015})`)
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(x, y, branchLength * 0.8, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner glowing core - deeper, darker green glow
      const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, branchLength * 0.3)
      coreGradient.addColorStop(0, `rgba(34, 83, 44, ${0.5 - layer * 0.06})`)
      coreGradient.addColorStop(0.5, `rgba(20, 51, 30, ${0.3 - layer * 0.04})`)
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(x, y, branchLength * 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Brightest center point - subtle mystical gold hints
      ctx.fillStyle = `rgba(${20 + layer * 3}, ${51 + layer * 5}, ${30 + layer * 3}, ${0.3 - layer * 0.04})`
      ctx.beginPath()
      ctx.arc(x, y, branchLength * 0.08, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw connecting lines with glow
      if (layer > 0) {
        const prevAngle = angle - (2 * Math.PI) / branches
        const prevLength = radius * (0.6 + Math.sin(layerTime * 0.7 + i - 1) * 0.3)
        const prevX = Math.cos(prevAngle) * prevLength
        const prevY = Math.sin(prevAngle) * prevLength
        
        // Glowing line effect
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(20, 51, 30, ${0.3 - layer * 0.03})`
        ctx.strokeStyle = `rgba(20, 51, 30, ${0.2 - layer * 0.02})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      
      // Recursive sub-branches for fractal effect with deeper glow
      if (layer < 3) {
        const subBranches = 3
        for (let j = 0; j < subBranches; j++) {
          const subAngle = angle + (j - 1) * 0.3
          const subLength = branchLength * 0.4
          const subX = x + Math.cos(subAngle) * subLength
          const subY = y + Math.sin(subAngle) * subLength
          
          // Glowing sub-branches
          const subGlow = ctx.createRadialGradient(subX, subY, 0, subX, subY, subLength * 0.4)
          subGlow.addColorStop(0, `rgba(20, 51, 30, ${0.25 - layer * 0.04})`)
          subGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          
          ctx.fillStyle = subGlow
          ctx.beginPath()
          ctx.arc(subX, subY, subLength * 0.4, 0, Math.PI * 2)
          ctx.fill()
          
          // Small bright point
          ctx.fillStyle = `rgba(34, 83, 44, ${0.3 - layer * 0.04})`
          ctx.beginPath()
          ctx.arc(subX, subY, subLength * 0.15, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    
    ctx.restore()
  }
    
  // Add floating mystical particles with glow
  const particles = 40
  for (let i = 0; i < particles; i++) {
    const x = (Math.sin(t * 0.5 + i) * 0.5 + 0.5) * width
    const y = (Math.cos(t * 0.3 + i * 0.7) * 0.5 + 0.5) * height
    const size = 1.5 + Math.sin(t + i) * 1.5
    const opacity = 0.08 + Math.sin(t * 2 + i) * 0.12
    
    // Glow effect for particles
    ctx.shadowBlur = size * 3
    ctx.shadowColor = `rgba(212, 175, 55, ${opacity})`
    ctx.fillStyle = `rgba(212, 175, 55, ${opacity * 0.8})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }
  
  // Add deep forest mist/atmosphere layers
  for (let mist = 0; mist < 3; mist++) {
    const mistOpacity = 0.03 + Math.sin(t * 0.2 + mist) * 0.02
    const mistGradient = ctx.createRadialGradient(
      width * (0.3 + mist * 0.2), 
      height * (0.4 + mist * 0.15),
      0,
      width * (0.3 + mist * 0.2),
      height * (0.4 + mist * 0.15),
      width * 0.6
    )
    mistGradient.addColorStop(0, `rgba(20, 51, 30, ${mistOpacity})`)
    mistGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = mistGradient
    ctx.fillRect(0, 0, width, height)
  }
}

const animate = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set canvas size
  const rect = canvas.getBoundingClientRect()
  if (canvas.width !== rect.width || canvas.height !== rect.height) {
    canvas.width = rect.width
    canvas.height = rect.height
  }
  
  time += 0.01
  drawFractal(ctx, canvas.width, canvas.height, time)
  
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  if (canvasRef.value) {
    animate()
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.fractal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -20;
  pointer-events: none;
}
</style>

