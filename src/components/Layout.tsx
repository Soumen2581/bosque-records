import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { label } from '@/config/label'
import { AtmosphereToggle, LivingBackground } from '@/components/LivingBackground'
import { ListeningDock, ListenProvider } from '@/components/Listen'
import { SlidingRail } from '@/components/NavIndicator'
import { TransitionNavLink } from '@/components/TransitionLink'
import mark from '@/assets/styles/image/logos/Bosque_Header.png'

const links = [
  ['/discover', 'Discover'],
  ['/releases', 'Releases'],
  ['/artists', 'Artists'],
  ['/events', 'Events'],
  ['/about', 'About'],
  ['/contact', 'Contact']
] as const

export function Layout() {
  return (
    <ListenProvider>
      <Frame />
    </ListenProvider>
  )
}

function Frame() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [compact, setCompact] = useState(false)
  const location = useLocation()
  const navType = useNavigationType()
  const activeNav = useMemo(() => {
    const match = links.find(([to]) => location.pathname === to || location.pathname.startsWith(`${to}/`))
    return match?.[0] ?? null
  }, [location.pathname])

  useEffect(() => {
    if (navType === 'POP') return
    window.scrollTo(0, 0)
  }, [location.pathname, navType])

  const [menuPath, setMenuPath] = useState(location.pathname)
  if (location.pathname !== menuPath) {
    setMenuPath(location.pathname)
    if (open) setOpen(false)
  }

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(1, window.scrollY / height) : 0)
      setCompact(window.scrollY > 28)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="shell">
      <LivingBackground />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <a className="skip" href="#content">Skip to content</a>
      <header className={compact || open ? 'top is-compact' : 'top'}>
        <TransitionNavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={mark} alt="Bosque Records" />
        </TransitionNavLink>
        <button className="menu-btn" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((value) => !value)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="primary-nav" className={open ? 'nav open' : 'nav'} aria-label="Primary">
          <SlidingRail activeKey={open ? null : activeNav} className="nav-rail">
            {links.map(([to, name]) => (
              <TransitionNavLink key={to} to={to} data-indicator-key={to} onClick={() => setOpen(false)}>
                {name}
              </TransitionNavLink>
            ))}
          </SlidingRail>
        </nav>
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="foot">
        <div>
          <h2>Bosque Records</h2>
          <p>{label.statement}</p>
          <p><a href={`mailto:${label.email}`}>{label.email}</a></p>
        </div>
        <div>
          <h2>Listen</h2>
          <ul>
            <li><a href={label.links.bandcamp} target="_blank" rel="noreferrer">Bandcamp</a></li>
            <li><a href={label.links.soundcloud} target="_blank" rel="noreferrer">SoundCloud</a></li>
            <li><a href={label.links.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={label.links.facebook} target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href={label.links.linktree} target="_blank" rel="noreferrer">Linktree</a></li>
          </ul>
        </div>
        <div>
          <h2>Label</h2>
          <ul>
            <li><TransitionNavLink to="/bookings">Bookings</TransitionNavLink></li>
            <li><TransitionNavLink to="/shop">Shop</TransitionNavLink></li>
            <li><TransitionNavLink to="/visual-arts">Visual arts</TransitionNavLink></li>
          </ul>
        </div>
        <p className="legal">
          © {new Date().getFullYear()} Bosque Records
          <span className="legal-actions">
            <AtmosphereToggle />
            <button type="button" className="btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
          </span>
        </p>
      </footer>
      <ListeningDock />
    </div>
  )
}
