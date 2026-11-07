import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { TransitionLink } from '@/components/TransitionLink'
import { useListen } from '@/components/Listen'
import { setTintFrom } from '@/atmosphere'
import { formatDate, type ArtistSummary, type Release } from '@/lib/catalog'

function useCenteredIndex(count: number) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const drag = useRef({ active: false, x: 0, left: 0, moved: false })

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const cards = () => [...el.querySelectorAll<HTMLElement>('[data-card]')]
    const measure = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDistance = Number.POSITIVE_INFINITY
      cards().forEach((card, cardIndex) => {
        const mid = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(mid - center)
        if (distance < bestDistance) {
          bestDistance = distance
          best = cardIndex
        }
      })
      setIndex(best)
    }
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    return () => el.removeEventListener('scroll', measure)
  }, [count])

  function go(next: number) {
    const el = scroller.current
    const card = el?.querySelectorAll<HTMLElement>('[data-card]')[next]
    if (!el || !card) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    card.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(Math.min(count - 1, index + 1))
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(Math.max(0, index - 1))
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    const el = scroller.current
    if (!el) return
    drag.current = { active: true, x: event.clientX, left: el.scrollLeft, moved: false }
    el.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = scroller.current
    if (!el || !drag.current.active) return
    const delta = event.clientX - drag.current.x
    if (Math.abs(delta) > 6) drag.current.moved = true
    if (drag.current.moved) el.scrollLeft = drag.current.left - delta
  }

  function onPointerUp() {
    const wasDragging = drag.current.moved
    drag.current.active = false
    if (wasDragging) {
      const el = scroller.current
      if (!el) return
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDistance = Number.POSITIVE_INFINITY
      el.querySelectorAll<HTMLElement>('[data-card]').forEach((card, cardIndex) => {
        const mid = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(mid - center)
        if (distance < bestDistance) {
          bestDistance = distance
          best = cardIndex
        }
      })
      go(best)
    }
  }

  return { scroller, index, go, onKey, onPointerDown, onPointerMove, onPointerUp, moved: () => drag.current.moved }
}

export function ReleaseExplorer({ items, title }: { items: Release[]; title: string }) {
  const { scroller, index, go, onKey, onPointerDown, onPointerMove, onPointerUp, moved } = useCenteredIndex(items.length)
  const listen = useListen()
  const active = items[index]
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
          <button type="button" className="btn" onClick={() => go(Math.max(0, index - 1))} disabled={index === 0}>Previous</button>
          <button type="button" className="btn" onClick={() => go(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1}>Next</button>
        </div>
      </header>
      <div
        className="explorer"
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label={title}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((release, cardIndex) => (
          <article key={release.id} data-card className={cardIndex === index ? 'is-active' : ''} aria-current={cardIndex === index ? 'true' : undefined}>
            <TransitionLink
              to={`/releases/${release.slug}`}
              aria-label={release.title}
              onClick={(event) => {
                if (moved()) event.preventDefault()
              }}
            >
              <img
                src={release.coverImage}
                alt=""
                draggable={false}
                style={{ viewTransitionName: cardIndex === index ? `art-${release.slug}` : 'none' }}
              />
            </TransitionLink>
          </article>
        ))}
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
  const { scroller, index, go, onKey, onPointerDown, onPointerMove, onPointerUp, moved } = useCenteredIndex(items.length)
  const active = items[index]
  useEffect(() => {
    if (active) setTintFrom(active.releases[0]?.slug ?? active.id)
  }, [active])
  if (!active) return null
  const cover = active.releases[0]

  return (
    <section className="explorer-block">
      <header className="explorer-head">
        <div>
          <h2>The artists</h2>
          <p className="meta">{index + 1} / {items.length}</p>
        </div>
        <div className="explorer-controls">
          <button type="button" className="btn" onClick={() => go(Math.max(0, index - 1))} disabled={index === 0}>Previous</button>
          <button type="button" className="btn" onClick={() => go(Math.min(items.length - 1, index + 1))} disabled={index === items.length - 1}>Next</button>
        </div>
      </header>
      <div
        className="explorer"
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Artists"
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {items.map((artist, cardIndex) => (
          <article key={artist.id} data-card className={cardIndex === index ? 'is-active' : ''} aria-current={cardIndex === index ? 'true' : undefined}>
            <TransitionLink
              to={`/artists/${artist.id}`}
              aria-label={artist.name}
              onClick={(event) => {
                if (moved()) event.preventDefault()
              }}
            >
              {artist.image || artist.releases[0]?.coverImage
                ? (
                  <img
                    src={artist.image || artist.releases[0]?.coverImage}
                    alt=""
                    draggable={false}
                    style={{ viewTransitionName: cardIndex === index ? `artist-${artist.id}` : 'none' }}
                  />
                )
                : <div className="plate">{artist.name}</div>}
            </TransitionLink>
          </article>
        ))}
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
