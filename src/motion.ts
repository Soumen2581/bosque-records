import { useEffect, useRef, useState, type RefObject } from 'react'

export const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const motion = {
  micro: 180,
  nav: 320,
  content: 520,
  editorial: 760
} as const

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReveal<T extends HTMLElement>(margin = '0px 0px -12% 0px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    const node = ref.current
    if (!node || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: margin, threshold: 0.18 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [margin, visible])

  return [ref, visible]
}
