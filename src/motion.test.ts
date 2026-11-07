import { describe, expect, it } from 'vitest'
import { ease, motion } from './motion'

describe('motion tokens', () => {
  it('keeps the shared forest easing curve', () => {
    expect(ease).toBe('cubic-bezier(0.22, 1, 0.36, 1)')
  })

  it('orders durations from micro to editorial', () => {
    expect(motion.micro).toBeLessThan(motion.nav)
    expect(motion.nav).toBeLessThan(motion.content)
    expect(motion.content).toBeLessThan(motion.editorial)
  })
})
