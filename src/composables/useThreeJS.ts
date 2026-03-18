import { ref, onUnmounted, type Ref } from 'vue'
import * as THREE from 'three'

export function useThreeJS() {
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let mandalaGroup: THREE.Group | null = null
  let particleSystem: THREE.Points | null = null
  let animationId: number | null = null
  let lastFrameTime = 0
  let time = 0
  
  const isInitialized: Ref<boolean> = ref(false)
  
  // Custom shader for psychedelic mandala effects
  const mandalaVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Add some vertex displacement for organic movement
      vec3 pos = position;
      pos.z += sin(pos.x * 10.0 + time) * 0.05;
      pos.z += cos(pos.y * 8.0 + time * 1.5) * 0.03;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `
  
  const mandalaFragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // Complex number operations for fractal generation
    vec2 complexMul(vec2 a, vec2 b) {
      return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
    }
    
    vec2 complexPow(vec2 z, float n) {
      float r = length(z);
      float theta = atan(z.y, z.x);
      return pow(r, n) * vec2(cos(n * theta), sin(n * theta));
    }
    
    // Mandala pattern generation
    float mandalaPattern(vec2 uv, float t) {
      vec2 center = uv - 0.5;
      float r = length(center);
      float a = atan(center.y, center.x);
      
      // Create symmetrical patterns
      float pattern = 0.0;
      
      // Multiple layers of rotating patterns
      for(int i = 0; i < 8; i++) {
        float angle = a * float(i + 1) + t * 0.5;
        float wave = sin(r * 20.0 - t * 2.0) * 0.5 + 0.5;
        pattern += sin(angle + wave) * exp(-r * 2.0) / float(i + 1);
      }
      
      // Add fractal details
      vec2 z = center * 3.0;
      for(int j = 0; j < 5; j++) {
        z = complexPow(z, 2.0) + center * 0.5;
        pattern += exp(-length(z)) * 0.1;
      }
      
      return pattern;
    }
    
    // Color cycling function
    vec3 psychedelicColor(float value, float time) {
      vec3 color1 = vec3(0.8, 0.2, 0.8); // Magenta
      vec3 color2 = vec3(0.2, 0.8, 0.8); // Cyan
      vec3 color3 = vec3(0.8, 0.8, 0.2); // Yellow
      vec3 color4 = vec3(0.2, 0.8, 0.2); // Green
      
      float cycle = sin(time * 0.5) * 0.5 + 0.5;
      vec3 baseColor = mix(mix(color1, color2, cycle), mix(color3, color4, cycle), sin(time * 0.3));
      
      return baseColor * (0.5 + value * 1.5);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create multiple overlapping mandala layers
      float pattern1 = mandalaPattern(uv, time);
      float pattern2 = mandalaPattern(uv * 1.5 + 0.3, time * 1.3);
      float pattern3 = mandalaPattern(uv * 0.7 - 0.2, time * 0.7);
      
      float finalPattern = (pattern1 + pattern2 * 0.7 + pattern3 * 0.5) / 2.2;
      
      // Add pulsing effect
      float pulse = sin(time * 3.0) * 0.3 + 0.7;
      finalPattern *= pulse;
      
      // Generate psychedelic colors
      vec3 color = psychedelicColor(finalPattern, time);
      
      // Add glow effect
      float glow = exp(-length(vUv - 0.5) * 2.0) * 0.3;
      color += glow * vec3(0.5, 0.3, 0.8);
      
      gl_FragColor = vec4(color, 0.8);
    }
  `
  
  const initThreeJS = (canvas: HTMLCanvasElement): void => {
    if (isInitialized.value) return
    
    try {
      // Create scene
      scene = new THREE.Scene()
      
      // Create camera
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 8
      
      // Create renderer
      renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000011, 1)
      
      // Create mandala group
      mandalaGroup = new THREE.Group()
      scene.add(mandalaGroup)
      
      // Create multiple mandala layers
      createMandalaLayers()
      
      // Create particle system
      createParticleSystem()
      
      // Add dynamic lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
      scene.add(ambientLight)
      
      const pointLight1 = new THREE.PointLight(0xff00ff, 1, 100)
      pointLight1.position.set(10, 10, 10)
      scene.add(pointLight1)
      
      const pointLight2 = new THREE.PointLight(0x00ffff, 1, 100)
      pointLight2.position.set(-10, -10, 10)
      scene.add(pointLight2)
      
      // Handle window resize
      window.addEventListener('resize', onWindowResize)
      
      // Handle visibility change for performance
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // Start animation
      animate()
      
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize Three.js:', error)
    }
  }
  
  const createMandalaLayers = (): void => {
    if (!mandalaGroup) return
    
    // Create multiple mandala discs with different sizes and rotations
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.PlaneGeometry(15 - i * 2, 15 - i * 2, 64, 64)
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: mandalaVertexShader,
        fragmentShader: mandalaFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })
      
      const mandala = new THREE.Mesh(geometry, material)
      mandala.position.z = -i * 0.5
      mandala.rotation.z = (i * Math.PI) / 4
      
      mandalaGroup.add(mandala)
    }
    
    // Add rotating geometric shapes
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.TorusGeometry(2 + i * 0.5, 0.1, 8, 16)
      const mat = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 12, 1, 0.5),
        transparent: true,
        opacity: 0.6,
        emissive: new THREE.Color().setHSL(i / 12, 0.5, 0.1)
      })
      
      const torus = new THREE.Mesh(geo, mat)
      torus.position.z = -5 + i * 0.3
      torus.rotation.x = (i * Math.PI) / 6
      
      mandalaGroup.add(torus)
    }
  }
  
  const createParticleSystem = (): void => {
    if (!scene) return
    
    const particleCount = 1000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Spiral distribution
      const angle = (i / particleCount) * Math.PI * 20
      const radius = (i / particleCount) * 15
      
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // Random colors
      const color = new THREE.Color().setHSL(Math.random(), 1, 0.5)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      sizes[i] = Math.random() * 3 + 1
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    })
    
    particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)
  }
  
  const onWindowResize = (): void => {
    if (!camera || !renderer) return
    
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  const handleVisibilityChange = (): void => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    } else if (!animationId && isInitialized.value) {
      animate()
    }
  }
  
  const animate = (): void => {
    const now = performance.now()
    if (now - lastFrameTime < 16.67) { // 60fps
      animationId = requestAnimationFrame(animate)
      return
    }
    lastFrameTime = now
    
    if (document.hidden) {
      animationId = requestAnimationFrame(animate)
      return
    }
    
    time += 0.01
    
    // Animate mandala group
    if (mandalaGroup) {
      mandalaGroup.rotation.z += 0.002
      
      // Update shader uniforms for each mandala layer
      mandalaGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          child.material.uniforms.time.value = time + index * 0.5
          child.rotation.z += 0.001 * (index + 1)
        }
        
        // Animate torus rings
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          child.rotation.x += 0.01
          child.rotation.y += 0.005
          
          // Pulsing scale effect
          const scale = 1 + Math.sin(time * 2 + index) * 0.1
          child.scale.setScalar(scale)
        }
      })
    }
    
    // Animate particle system
    if (particleSystem) {
      particleSystem.rotation.z += 0.001
      const positions = particleSystem.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += Math.sin(time + i * 0.01) * 0.02
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true
    }
    
    // Animate camera for subtle movement
    if (camera) {
      camera.position.x = Math.sin(time * 0.1) * 0.5
      camera.position.y = Math.cos(time * 0.15) * 0.3
      camera.lookAt(0, 0, 0)
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
    
    animationId = requestAnimationFrame(animate)
  }
  
  const cleanup = (): void => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    if (renderer) {
      renderer.dispose()
    }
    
    if (scene) {
      scene.clear()
    }
    
    window.removeEventListener('resize', onWindowResize)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    isInitialized.value = false
  }
  
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    initThreeJS,
    cleanup,
    isInitialized
  }
} 