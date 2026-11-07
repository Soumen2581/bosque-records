import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/motion'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'article' | 'aside'
  delay?: number
  style?: CSSProperties
}

export function Reveal({ children, className = '', as = 'div', delay = 0, style }: Props) {
  const [ref, visible] = useReveal<HTMLDivElement>()
  const Tag = as
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'is-in' : ''} ${className}`.trim()}
      style={{ ...style, transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
