import { flushSync } from 'react-dom'
import { Link, type LinkProps, useNavigate } from 'react-router-dom'

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function transitionTo(run: () => void) {
  const start = (document as Document & { startViewTransition?: (callback: () => void) => void }).startViewTransition?.bind(document)
  if (!start || reducedMotion()) {
    run()
    return
  }
  start(() => {
    flushSync(run)
  })
}

export function TransitionLink({ to, onClick, ...props }: LinkProps) {
  const navigate = useNavigate()
  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        transitionTo(() => navigate(to))
      }}
      {...props}
    />
  )
}
