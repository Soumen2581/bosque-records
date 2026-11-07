import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type Rect = { left: number; width: number; opacity: number }

const hidden: Rect = { left: 0, width: 0, opacity: 0 }

export function useSlidingIndicator(activeKey: string | null) {
  const root = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<Rect>(hidden)

  const measure = () => {
    const el = root.current
    if (!el || !activeKey) {
      setRect(hidden)
      return
    }
    const escape = typeof CSS !== 'undefined' && typeof CSS.escape === 'function' ? CSS.escape : (value: string) => value.replace(/["\\]/g, '\\$&')
    const active = el.querySelector<HTMLElement>(`[data-indicator-key="${escape(activeKey)}"]`)
    if (!active) {
      setRect(hidden)
      return
    }
    const parent = el.getBoundingClientRect()
    const box = active.getBoundingClientRect()
    setRect({
      left: box.left - parent.left + el.scrollLeft,
      width: box.width,
      opacity: 1
    })
  }

  useLayoutEffect(measure, [activeKey])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    observer?.observe(el)
    return () => {
      window.removeEventListener('resize', onResize)
      observer?.disconnect()
    }
  }, [activeKey])

  return { root, rect }
}

export function SlidingRail({
  activeKey,
  className = '',
  children
}: {
  activeKey: string | null
  className?: string
  children: ReactNode
}) {
  const { root, rect } = useSlidingIndicator(activeKey)
  return (
    <div ref={root} className={`sliding-rail ${className}`.trim()}>
      {children}
      <span
        className="sliding-indicator"
        aria-hidden="true"
        style={{
          transform: `translateX(${rect.left}px)`,
          width: `${rect.width}px`,
          opacity: rect.opacity
        }}
      />
    </div>
  )
}
