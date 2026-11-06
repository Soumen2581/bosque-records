import { useSyncExternalStore } from 'react'

export type AtmosphereLevel = 'on' | 'reduced' | 'off'

const KEY = 'bosque-atmosphere'
const palette: Array<[number, number, number]> = [
  [0.09, 0.15, 0.1],
  [0.15, 0.17, 0.09],
  [0.07, 0.14, 0.13],
  [0.16, 0.12, 0.07],
  [0.12, 0.09, 0.14]
]

export const atmosphere = {
  level: 'on' as AtmosphereLevel,
  tint: [0.09, 0.14, 0.1] as [number, number, number],
  energy: 1
}

const listeners = new Set<() => void>()

function readStored(): AtmosphereLevel {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'on' || saved === 'reduced' || saved === 'off') return saved
  } catch {
    /* private mode */
  }
  return 'on'
}

export function loadAtmosphere() {
  atmosphere.level = readStored()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && atmosphere.level === 'on') {
    atmosphere.level = 'reduced'
  }
}

export function setAtmosphereLevel(level: AtmosphereLevel) {
  atmosphere.level = level
  try {
    localStorage.setItem(KEY, level)
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.atmosphere = level
  listeners.forEach((listener) => listener())
}

export function cycleAtmosphere() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const order: AtmosphereLevel[] = reduce ? ['reduced', 'off'] : ['on', 'reduced', 'off']
  const index = order.indexOf(atmosphere.level)
  setAtmosphereLevel(order[(index + 1) % order.length])
}

if (typeof window !== 'undefined') {
  loadAtmosphere()
  document.documentElement.dataset.atmosphere = atmosphere.level
}

export function setTintFrom(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) hash = (hash * 33 + id.charCodeAt(i)) >>> 0
  atmosphere.tint = palette[hash % palette.length]
}

export function setAtmosphereEnergy(energy: number) {
  atmosphere.energy = energy
}

export function useAtmosphereLevel() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => atmosphere.level,
    () => 'on' as AtmosphereLevel
  )
}
