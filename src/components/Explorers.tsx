import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DepthCarousel } from '@/bits'
import { TransitionLink, transitionTo } from '@/components/TransitionLink'
import { useListen } from '@/components/Listen'
import { setTintFrom } from '@/atmosphere'
import { formatDate, type ArtistSummary, type Release } from '@/lib/catalog'
import logo from '@/assets/styles/image/logos/Bosque Records Logo.png'

function useCarouselSize() {
  const [size, setSize] = useState({ width: 280, height: 280, spread: 84, tilt: 14 })
  useEffect(() => {
    const sync = () => {
      const wide = window.matchMedia('(min-width: 900px)').matches
      const mid = window.matchMedia('(min-width: 640px)').matches
      if (wide) setSize({ width: 320, height: 320, spread: 96, tilt: 16 })
      else if (mid) setSize({ width: 260, height: 260, spread: 72, tilt: 12 })
      else setSize({ width: 210, height: 210, spread: 54, tilt: 8 })
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])
  return size
}

export function ReleaseExplorer({ items, title }: { items: Release[]; title: string }) {
  const [index, setIndex] = useState(0)
  const listen = useListen()
  const navigate = useNavigate()
  const size = useCarouselSize()
  const active = items[index] ?? items[0]
  const carouselItems = useMemo(
    () => items.map((release) => ({ image: release.coverImage, alt: release.title })),
    [items]
  )

  useEffect(() => {
    if (active) setTintFrom(active.slug)
  }, [active])

  if (!active) return null

  return (
    <section className="explorer-block" id="discography">
      <header className="explorer-head">
        <div>
          <h2>{title}</h2>
          <p className="meta">{index + 1} / {items.length}</p>
        </div>
        <div className="explorer-controls">
          <button type="button" className="btn" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>Previous</button>
          <button type="button" className="btn" onClick={() => setIndex(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1}>Next</button>
        </div>
      </header>
      <div className="depth-explorer">
        <DepthCarousel
          items={carouselItems}
          activeIndex={index}
          ariaLabel={title}
          autoplay={false}
          loop={false}
          showControls={false}
          showIndicators={false}
          cardWidth={size.width}
          cardHeight={size.height}
          spread={size.spread}
          tilt={size.tilt}
          depth={180}
          blur={3}
          radius={8}
          tint="#0C120D"
          onChange={(next) => setIndex(next)}
          onActivate={(next) => {
            const release = items[next]
            if (release) transitionTo(() => navigate(`/releases/${release.slug}`))
          }}
        />
      </div>
      <div className="progress" aria-hidden="true"><span style={{ width: `${((index + 1) / items.length) * 100}%` }} /></div>
      <div className="focus-panel" aria-live="polite" key={active.id}>
        <p className="meta">{active.releaseType} · {formatDate(active.releaseDate)} · {active.tracks.length} tracks</p>
        <h3>{active.title}</h3>
        <p>
          <TransitionLink to={`/artists/${active.artist.id}`}>{active.artist.name}</TransitionLink>
        </p>
        <div className="actions">
          <button type="button" className="btn solid" onClick={() => listen.open(active)}>Listen on Bandcamp</button>
          <TransitionLink className="btn" to={`/releases/${active.slug}`}>View release</TransitionLink>
        </div>
      </div>
    </section>
  )
}

export function ArtistExplorer({ items }: { items: ArtistSummary[] }) {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const size = useCarouselSize()
  const active = items[index] ?? items[0]
  const cover = active?.releases[0]
  const carouselItems = useMemo(
    () => items.map((artist) => ({
      image: artist.image || artist.releases[0]?.coverImage || logo,
      alt: artist.name
    })),
    [items]
  )

  useEffect(() => {
    if (active) setTintFrom(active.releases[0]?.slug ?? active.id)
  }, [active])

  if (!active) return null

  return (
    <section className="explorer-block">
      <header className="explorer-head">
        <div>
          <h2>The artists</h2>
          <p className="meta">{index + 1} / {items.length}</p>
        </div>
        <div className="explorer-controls">
          <button type="button" className="btn" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>Previous</button>
          <button type="button" className="btn" onClick={() => setIndex(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1}>Next</button>
        </div>
      </header>
      <div className="depth-explorer">
        <DepthCarousel
          items={carouselItems}
          activeIndex={index}
          ariaLabel="Artists"
          autoplay={false}
          loop={false}
          showControls={false}
          showIndicators={false}
          cardWidth={size.width}
          cardHeight={size.height}
          spread={size.spread}
          tilt={size.tilt}
          depth={180}
          blur={3}
          radius={8}
          tint="#0C120D"
          onChange={(next) => setIndex(next)}
          onActivate={(next) => {
            const artist = items[next]
            if (artist) transitionTo(() => navigate(`/artists/${artist.id}`))
          }}
        />
      </div>
      <div className="progress" aria-hidden="true"><span style={{ width: `${((index + 1) / items.length) * 100}%` }} /></div>
      <div className="focus-panel" aria-live="polite" key={active.id}>
        <p className="meta">
          {active.role === 'label' ? 'Label roster' : active.role === 'release' ? 'Release artist' : active.role}
          {active.releases.length ? ` · ${active.releases.length} ${active.releases.length === 1 ? 'release' : 'releases'}` : ''}
        </p>
        <h3>{active.name}</h3>
        <p className="meta">{cover && !active.image ? `Shown with artwork from ${cover.title}. ` : ''}A published biography is not on file.</p>
        <div className="actions">
          <TransitionLink className="btn solid" to={`/artists/${active.id}`}>Open artist</TransitionLink>
          {active.instagram ? <a className="btn" href={active.instagram} target="_blank" rel="noreferrer">Instagram</a> : null}
          {cover ? <TransitionLink className="btn" to={`/releases/${cover.slug}`}>Related release</TransitionLink> : null}
        </div>
      </div>
    </section>
  )
}
