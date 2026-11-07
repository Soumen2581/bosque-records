import { flushSync } from 'react-dom'
import type { MouseEvent } from 'react'
import { Link, NavLink, useNavigate, type LinkProps, type NavLinkProps } from 'react-router-dom'

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

function intercept(
  event: MouseEvent<HTMLAnchorElement>,
  to: LinkProps['to'],
  navigate: ReturnType<typeof useNavigate>,
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
) {
  onClick?.(event)
  if (event.defaultPrevented) return
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
  event.preventDefault()
  transitionTo(() => navigate(to))
}

export function TransitionLink({ to, onClick, ...props }: LinkProps) {
  const navigate = useNavigate()
  return (
    <Link
      to={to}
      onClick={(event) => intercept(event, to, navigate, onClick)}
      {...props}
    />
  )
}

export function TransitionNavLink({ to, onClick, ...props }: NavLinkProps) {
  const navigate = useNavigate()
  return (
    <NavLink
      to={to}
      onClick={(event) => intercept(event, to, navigate, onClick)}
      {...props}
    />
  )
}
