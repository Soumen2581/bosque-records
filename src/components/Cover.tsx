import { useState } from 'react'

export function Cover({ src, title, transitionName }: { src: string; title: string; transitionName?: string }) {
  const [failed, setFailed] = useState(!src)
  const style = transitionName ? { viewTransitionName: transitionName } : undefined
  if (failed) return <div className="plate" role="img" aria-label={title} style={style}>{title}</div>
  return <img src={src} alt="" style={style} onError={() => setFailed(true)} />
}
