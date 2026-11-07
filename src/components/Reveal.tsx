import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/motion'

export type RevealVariant = 'rise' | 'fade' | 'clip' | 'scale'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'article' | 'aside'
  delay?: number
  variant?: RevealVariant
  style?: CSSProperties
  id?: string
}

export function Reveal({
  children,
  className = '',
  as = 'div',
  delay = 0,
  variant = 'rise',
  style,
  id
}: Props) {
  const [ref, visible] = useReveal<HTMLDivElement>()
  const Tag = as
  return (
    <Tag
      id={id}
      ref={ref as never}
      className={`reveal reveal-${variant} ${visible ? 'is-in' : ''} ${className}`.trim()}
      style={{ ...style, transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
