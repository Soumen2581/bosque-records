import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  atmosphere,
  cycleAtmosphere,
  setAtmosphereEnergy,
  setAtmosphereLevel,
  setTintFrom
} from './atmosphere'

describe('atmosphere', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? false : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    })))
    setAtmosphereLevel('on')
    setAtmosphereEnergy(1)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    try {
      localStorage.removeItem('bosque-atmosphere')
    } catch {
      /* ignore */
    }
  })

  it('cycles on → reduced → off → on', () => {
    expect(atmosphere.level).toBe('on')
    cycleAtmosphere()
    expect(atmosphere.level).toBe('reduced')
    cycleAtmosphere()
    expect(atmosphere.level).toBe('off')
    cycleAtmosphere()
    expect(atmosphere.level).toBe('on')
  })

  it('persists level to localStorage', () => {
    setAtmosphereLevel('reduced')
    expect(localStorage.getItem('bosque-atmosphere')).toBe('reduced')
  })

  it('limits the cycle to reduced/off when reduced-motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    })))
    setAtmosphereLevel('reduced')
    cycleAtmosphere()
    expect(atmosphere.level).toBe('off')
    cycleAtmosphere()
    expect(atmosphere.level).toBe('reduced')
  })

  it('derives stable tint from an id', () => {
    setTintFrom('brainwavez')
    const first = [...atmosphere.tint]
    setTintFrom('brainwavez')
    expect(atmosphere.tint).toEqual(first)
    setTintFrom('ixmuk')
    expect(atmosphere.tint).not.toEqual(first)
  })

  it('clamps energy updates through the shared store', () => {
    setAtmosphereEnergy(0.42)
    expect(atmosphere.energy).toBe(0.42)
  })
})
