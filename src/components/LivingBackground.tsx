import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { atmosphere, cycleAtmosphere, setAtmosphereEnergy, useAtmosphereLevel } from '@/atmosphere'

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform vec3 uTint;
uniform float uEnergy;
uniform float uMotion;
uniform vec2 uTrail0;
uniform vec2 uTrail1;
uniform vec2 uTrail2;
uniform vec2 uTrail3;
uniform vec2 uTrail4;
uniform vec2 uTrail5;
uniform float uW0;
uniform float uW1;
uniform float uW2;
uniform float uW3;
uniform float uW4;
uniform float uW5;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return value;
}

float ink(vec2 uv, vec2 point, float weight, vec2 aspect) {
  vec2 delta = (uv - point) * aspect;
  float dist = dot(delta, delta);
  return exp(-dist * 22.0) * weight;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  float time = uTime * uMotion;
  vec2 pointer = (uv - uPointer) * aspect;
  float dist = length(pointer);
  float speed = clamp(length(uVelocity), 0.0, 2.0);
  vec2 flow = vec2(
    fbm(uv * aspect * 1.35 + vec2(time * 0.035, time * 0.02)),
    fbm(uv * aspect * 1.35 + vec2(4.2, -time * 0.028))
  );
  vec2 displace = (flow - 0.5) * 0.055 * uEnergy;
  float field = exp(-dist * dist * 7.5);
  vec2 push = dist > 0.0008 ? pointer / dist : vec2(0.0);
  displace += push * field * (0.04 + speed * 0.06) * uMotion;
  float ripple = field * (0.55 + speed * 0.7);
  ripple += ink(uv, uTrail0, uW0, aspect);
  ripple += ink(uv, uTrail1, uW1, aspect) * 0.85;
  ripple += ink(uv, uTrail2, uW2, aspect) * 0.7;
  ripple += ink(uv, uTrail3, uW3, aspect) * 0.55;
  ripple += ink(uv, uTrail4, uW4, aspect) * 0.4;
  ripple += ink(uv, uTrail5, uW5, aspect) * 0.28;
  vec2 sampleUv = uv * aspect + displace;
  float broad = fbm(sampleUv * 1.45 + vec2(time * 0.04, 0.2));
  float mid = fbm(sampleUv * 2.6 - vec2(0.4, time * 0.03));
  float detail = fbm(sampleUv * 5.5 + broad);
  vec3 deep = vec3(0.02, 0.03, 0.024);
  vec3 forest = vec3(0.07, 0.11, 0.08);
  vec3 moss = vec3(0.16, 0.22, 0.12);
  vec3 teal = vec3(0.06, 0.14, 0.12);
  vec3 amber = vec3(0.18, 0.13, 0.06);
  vec3 violet = vec3(0.12, 0.08, 0.14);
  vec3 color = mix(deep, forest, smoothstep(0.15, 0.82, broad));
  color = mix(color, moss, smoothstep(0.48, 0.9, mid) * 0.42 * uEnergy);
  color = mix(color, teal, smoothstep(0.55, 0.95, broad * mid) * 0.22);
  color = mix(color, amber, smoothstep(0.7, 0.96, detail) * 0.08);
  color = mix(color, violet, smoothstep(0.72, 1.0, mid) * 0.1 * uEnergy);
  color = mix(color, uTint, 0.22 * uEnergy);
  vec3 liquid = mix(vec3(0.12, 0.22, 0.12), vec3(0.14, 0.08, 0.16), clamp(speed * 0.8, 0.0, 1.0));
  color += liquid * ripple * 0.42 * uMotion;
  float vignette = smoothstep(1.25, 0.15, length((uv - 0.5) * vec2(1.15, 1.0)));
  color *= mix(0.55, 1.0, vignette);
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.018;
  gl_FragColor = vec4(color, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function LivingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const level = useAtmosphereLevel()
  const location = useLocation()
  const pointer = useRef({ tx: 0.72, ty: 0.58, x: 0.72, y: 0.58, vx: 0, vy: 0 })

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      if (media.matches && atmosphere.level === 'on') {
        atmosphere.level = 'reduced'
        document.documentElement.dataset.atmosphere = 'reduced'
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const path = location.pathname
    if (path === '/about' || path === '/contact' || path === '/bookings') setAtmosphereEnergy(0.38)
    else if (path.startsWith('/releases/') || path.startsWith('/artists/')) setAtmosphereEnergy(0.62)
    else setAtmosphereEnergy(1)
  }, [location.pathname])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.tx = event.clientX / Math.max(window.innerWidth, 1)
      pointer.current.ty = 1 - event.clientY / Math.max(window.innerHeight, 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || level === 'off') return
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    })
    if (!gl) return
    const vertex = compile(gl, gl.VERTEX_SHADER, VERT)
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vertex || !fragment) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.bindAttribLocation(program, 0, 'aPos')
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uPointer = gl.getUniformLocation(program, 'uPointer')
    const uVelocity = gl.getUniformLocation(program, 'uVelocity')
    const uTint = gl.getUniformLocation(program, 'uTint')
    const uEnergy = gl.getUniformLocation(program, 'uEnergy')
    const uMotion = gl.getUniformLocation(program, 'uMotion')
    const trails = [0, 1, 2, 3, 4, 5].map((index) => gl.getUniformLocation(program, `uTrail${index}`))
    const weightsLoc = [0, 1, 2, 3, 4, 5].map((index) => gl.getUniformLocation(program, `uW${index}`))
    const trail = Array.from({ length: 6 }, () => ({ x: 0.72, y: 0.58, w: 0 }))
    const tint = [...atmosphere.tint]
    let energy = atmosphere.energy
    let lastDropX = 0.72
    let lastDropY = 0.58
    let last = performance.now()
    let raf = 0
    let alive = true
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.25)
      const scale = coarse ? 0.42 : 0.62
      const width = Math.max(2, Math.floor(canvas.clientWidth * ratio * scale))
      const height = Math.max(2, Math.floor(canvas.clientHeight * ratio * scale))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const draw = (now: number, motion: number, follow: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const point = pointer.current
      const followRate = 1 - Math.exp(-dt * 7)
      const previousX = point.x
      const previousY = point.y
      point.x += (point.tx - point.x) * followRate
      point.y += (point.ty - point.y) * followRate
      const instantX = (point.x - previousX) / Math.max(dt, 0.001)
      const instantY = (point.y - previousY) / Math.max(dt, 0.001)
      point.vx += (instantX - point.vx) * 0.4
      point.vy += (instantY - point.vy) * 0.4
      if (Math.hypot(point.tx - point.x, point.ty - point.y) < 0.003) {
        const settle = Math.exp(-dt * 5)
        point.vx *= settle
        point.vy *= settle
      }
      if (follow > 0 && Math.hypot(point.x - lastDropX, point.y - lastDropY) > 0.018) {
        for (let index = trail.length - 1; index > 0; index -= 1) {
          trail[index].x = trail[index - 1].x
          trail[index].y = trail[index - 1].y
          trail[index].w = trail[index - 1].w
        }
        trail[0].x = point.x
        trail[0].y = point.y
        trail[0].w = Math.min(1, 0.4 + Math.hypot(point.vx, point.vy) * 0.12)
        lastDropX = point.x
        lastDropY = point.y
      }
      const fade = Math.exp(-dt * 1.2)
      for (const drop of trail) drop.w *= fade
      const blend = 1 - Math.exp(-dt * 1.5)
      tint[0] += (atmosphere.tint[0] - tint[0]) * blend
      tint[1] += (atmosphere.tint[1] - tint[1]) * blend
      tint[2] += (atmosphere.tint[2] - tint[2]) * blend
      energy += (atmosphere.energy - energy) * blend
      resize()
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, now * 0.001)
      gl.uniform2f(uPointer, point.x, point.y)
      gl.uniform2f(uVelocity, point.vx * follow, point.vy * follow)
      gl.uniform3f(uTint, tint[0], tint[1], tint[2])
      gl.uniform1f(uEnergy, energy)
      gl.uniform1f(uMotion, motion)
      for (let index = 0; index < trail.length; index += 1) {
        const weight = follow > 0 ? trail[index].w : 0
        gl.uniform2f(trails[index], trail[index].x, trail[index].y)
        gl.uniform1f(weightsLoc[index], weight)
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const frame = (now: number) => {
      if (!alive) return
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      const still = reduced()
      const quiet = atmosphere.level === 'reduced' || still
      const interval = coarse ? 1000 / 18 : 1000 / 60
      if (now - last < interval) return
      const motion = still ? 0 : quiet ? 0.22 : coarse ? 0.45 : 1
      draw(now, motion, still || quiet ? 0 : 1)
    }

    resize()
    draw(performance.now(), reduced() ? 0 : atmosphere.level === 'reduced' ? 0.22 : 1, 0)
    if (!reduced()) raf = requestAnimationFrame(frame)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [level])

  if (level === 'off') return null

  return (
    <>
      <canvas ref={canvasRef} className="living-canvas" aria-hidden="true" />
      <svg className="liquid-defs" aria-hidden="true">
        <filter id="cover-liquid" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
        </filter>
      </svg>
    </>
  )
}

export function AtmosphereToggle() {
  const level = useAtmosphereLevel()
  const label = level === 'on' ? 'Atmosphere on' : level === 'reduced' ? 'Atmosphere quiet' : 'Atmosphere off'
  return (
    <button type="button" className="atmosphere-toggle" onClick={() => cycleAtmosphere()}>
      {label}
    </button>
  )
}
