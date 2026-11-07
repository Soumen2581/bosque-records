import { useState } from 'react'

export function Cover({
  src,
  title = '',
  transitionName,
  className = ''
}: {
  src: string
  title?: string
  transitionName?: string
  className?: string
}) {
  const [failed, setFailed] = useState(!src)
  const style = transitionName ? { viewTransitionName: transitionName } : undefined
  if (failed) return <div className={`plate ${className}`.trim()} role="img" aria-label={title || 'Cover'} style={style}>{title || 'Cover'}</div>
  return <img className={className || undefined} src={src} alt="" style={style} onError={() => setFailed(true)} />
}
