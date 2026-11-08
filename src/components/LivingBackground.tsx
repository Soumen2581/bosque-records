import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import DarkVeil from '@/bits/DarkVeil'
import {
  atmosphere,
  cycleAtmosphere,
  setAtmosphereEnergy,
  useAtmosphereLevel,
  useAtmosphereSnapshot
} from '@/atmosphere'
import forestWallpaper from '@/assets/atmosphere/forest-wallpaper.webp'
import forestWallpaperJpg from '@/assets/atmosphere/forest-wallpaper.jpg'

function tintHex(tint: [number, number, number]) {
  const channel = (value: number) => Math.round(Math.min(1, Math.max(0, value)) * 255).toString(16).padStart(2, '0')
  return `#${channel(tint[0])}${channel(tint[1])}${channel(tint[2])}`
}

function useMediaFlag(query: string) {
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  ))
  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])
  return matches
}

function useForestWallpaper(enabled: boolean) {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    if (!enabled) {
      root.style.removeProperty('--forest-wallpaper')
      body.classList.remove('has-forest-wallpaper')
      return
    }
    const preferWebp = CSS.supports('background-image', `url("${forestWallpaper}")`)
    root.style.setProperty('--forest-wallpaper', `url("${preferWebp ? forestWallpaper : forestWallpaperJpg}")`)
    body.classList.add('has-forest-wallpaper')
    return () => {
      root.style.removeProperty('--forest-wallpaper')
      body.classList.remove('has-forest-wallpaper')
    }
  }, [enabled])
}

function detectWebgl2() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

export function LivingBackground() {
  const level = useAtmosphereLevel()
  const snapshot = useAtmosphereSnapshot()
  const location = useLocation()
  const reduceMotion = useMediaFlag('(prefers-reduced-motion: reduce)')
  const coarse = useMediaFlag('(pointer: coarse)')
  const narrow = useMediaFlag('(max-width: 900px)')
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [webgl2] = useState(detectWebgl2)
  const tint = tintHex(snapshot.tint)
  const energy = snapshot.energy

  useForestWallpaper(level !== 'off')

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
    if (path === '/about' || path === '/contact' || path === '/bookings' || path === '/shop') {
      setAtmosphereEnergy(0.34)
    } else if (path.startsWith('/releases/') || path.startsWith('/artists/')) {
      setAtmosphereEnergy(0.58)
    } else if (path === '/releases' || path === '/artists' || path === '/discover' || path === '/visual-arts') {
      setAtmosphereEnergy(0.72)
    } else {
      setAtmosphereEnergy(1)
    }
  }, [location.pathname])

  const interactive = level === 'on' && !reduceMotion && webgl2
  const quiet = level === 'reduced' || reduceMotion
  const mobileLite = coarse || narrow

  const veil = useMemo(() => {
    const strength = Math.max(0.28, Math.min(1, energy))
    if (!interactive) {
      return {
        paused: true as const,
        mouseInteraction: false,
        opacity: quiet ? 0.2 : 0,
        speed: 0,
        quality: 0.28,
        mouseStrength: 0,
        warp: 0.08,
        flow: 0.4,
        brightness: 0.55,
        glow: 0.16,
        grain: 0.035,
        sheen: 0.08,
        scale: 1.05
      }
    }
    return {
      paused: false as const,
      mouseInteraction: !mobileLite,
      opacity: mobileLite ? 0.32 * strength : 0.42 * strength,
      speed: mobileLite ? 0.18 * strength : 0.34 * strength,
      quality: mobileLite ? 0.3 : 0.52,
      mouseStrength: mobileLite ? 0.35 : 1 * strength,
      warp: mobileLite ? 0.14 : 0.32 * strength,
      flow: mobileLite ? 0.5 : 0.88,
      brightness: 0.48 + 0.14 * strength,
      glow: 0.14 + 0.1 * strength,
      grain: 0.04,
      sheen: 0.1,
      scale: 1.08
    }
  }, [interactive, quiet, mobileLite, energy])

  if (!mounted || level === 'off') {
    return level === 'off'
      ? createPortal(<div className="living-atmosphere is-off" aria-hidden="true" />, document.body)
      : null
  }

  return createPortal(
    (
      <div
        className={`living-atmosphere${quiet ? ' is-quiet' : ''}${mobileLite ? ' is-mobile' : ''}`}
        aria-hidden="true"
        style={{
          ['--living-tint' as string]: tint,
          ['--living-energy' as string]: String(Math.max(0.3, energy))
        }}
      >
        <div className="living-mist" />
        {webgl2 && (interactive || quiet) ? (
          <DarkVeil
            className="living-veil"
            color={tint}
            speed={veil.speed}
            scale={veil.scale}
            rotation={12}
            flow={veil.flow}
            warp={veil.warp}
            variation={0.35}
            brightness={veil.brightness}
            sheen={veil.sheen}
            glow={veil.glow}
            grain={veil.grain}
            quality={veil.quality}
            mouseInteraction={veil.mouseInteraction}
            mouseStrength={veil.mouseStrength}
            intro={!quiet}
            fade={0.18}
            opacity={veil.opacity}
            paused={veil.paused}
            dpr={mobileLite ? 1 : undefined}
          />
        ) : null}
        <div className="living-scrim" />
        <svg className="liquid-defs">
          <filter id="cover-liquid" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
          </filter>
        </svg>
      </div>
    ),
    document.body
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
