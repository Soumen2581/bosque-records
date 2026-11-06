import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { label } from '@/config/label'
import { AtmosphereToggle, LivingBackground } from '@/components/LivingBackground'
import { ListeningDock, ListenProvider } from '@/components/Listen'
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
  const location = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    if (navType === 'POP') return
    window.scrollTo(0, 0)
  }, [location.pathname, navType])

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(1, window.scrollY / height) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="shell">
      <LivingBackground />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      <a className="skip" href="#content">Skip to content</a>
      <header className="top">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={mark} alt="Bosque Records" />
        </NavLink>
        <button className="menu-btn" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <nav className={open ? 'nav open' : 'nav'} aria-label="Primary">
          {links.map(([to, name]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {name}
            </NavLink>
          ))}
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
            <li><NavLink to="/bookings">Bookings</NavLink></li>
            <li><NavLink to="/shop">Shop</NavLink></li>
            <li><NavLink to="/visual-arts">Visual arts</NavLink></li>
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
