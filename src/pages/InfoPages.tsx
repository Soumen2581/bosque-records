import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Masonry, ScrollReveal } from '@/bits'
import { Reveal } from '@/components/Reveal'
import { TransitionLink } from '@/components/TransitionLink'
import { label } from '@/config/label'
import { formatEventDate, labelEvents } from '@/data/events'
import { releases, rosterArtists } from '@/lib/catalog'
import logo from '@/assets/styles/image/logos/Bosque Records Logo.png'

const empty = { name: '', email: '', organization: '', artist: '', eventName: '', date: '', venue: '', city: '', eventType: 'Performance', message: '', company: '' }

export function AboutPage() {
  return (
    <div className="page about-page">
      <header className="page-head">
        <h1>About</h1>
        <p className="lede">{label.statement}</p>
      </header>
      <Reveal as="section" className="story-band about-band">
        <div className="story-copy">
          <ScrollReveal tag="h2" effect="rise" mode="scrub" splitBy="words" enableBlur baseOpacity={0.15} blurStrength={2} stagger={0.04}>
            Published through Bandcamp
          </ScrollReveal>
          <ScrollReveal tag="p" effect="fade" mode="scrub" splitBy="words" enableBlur={false} baseOpacity={0.2} stagger={0.02} containerClassName="lede">
            Releases, artists, and gatherings on this site come from the label catalog and public posts. Further history is added only when it can be sourced.
          </ScrollReveal>
          <div className="actions">
            <a className="btn solid" href={label.links.bandcamp} target="_blank" rel="noreferrer">Bandcamp</a>
            <TransitionLink className="btn" to="/contact">Contact</TransitionLink>
          </div>
        </div>
        <div className="story-art" aria-hidden="true">
          <img src={logo} alt="" />
        </div>
      </Reveal>
    </div>
  )
}

export function EventsPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcoming = labelEvents.filter((event) => new Date(`${event.end ?? event.start}T00:00:00`) >= today)
  const past = labelEvents.filter((event) => new Date(`${event.end ?? event.start}T00:00:00`) < today)
  const latest = past[0]
  const earlier = past.slice(1)
  return (
    <div className="page">
      <header className="page-head">
        <h1>Events</h1>
        <p className="lede">Dates and pictures taken from the label’s public Instagram posts. A biography of the night is not added beyond that post.</p>
        <Link className="btn" to="/bookings">Book the label</Link>
      </header>
      {upcoming.length ? (
        <section>
          <h2>Upcoming</h2>
          <div className="event-list">
            {upcoming.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </section>
      ) : null}
      {latest ? (
        <section>
          <h2>Latest</h2>
          <div className="event-list">
            <EventCard event={latest} />
          </div>
        </section>
      ) : null}
      {earlier.length ? (
        <section>
          <h2>Past</h2>
          <div className="event-list">
            {earlier.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function EventCard({ event }: { event: (typeof labelEvents)[number] }) {
  return (
    <article className={event.images.length ? 'event-card' : 'event-card no-photo'}>
      {event.images.length ? (
        <div className="event-photos">
          {event.images.map((src) => <img key={src} src={src} alt="" />)}
        </div>
      ) : null}
      <div>
        <p className="kicker">{formatEventDate(event)}</p>
        <h3>{event.title}</h3>
        <p>{event.place}</p>
        <p className="meta">{event.detail}</p>
        <ul>
          {event.lineup.map((name) => <li key={name}>{name}</li>)}
        </ul>
        {event.artists.length ? (
          <div className="event-artists">
            {event.artists.map((artist) => (
              <TransitionLink key={artist.id} to={`/artists/${artist.id}`}>
                <img src={artist.image} alt="" />
                <span>{artist.name}</span>
              </TransitionLink>
            ))}
          </div>
        ) : null}
        <p><a href={event.instagram}>Instagram post</a></p>
      </div>
    </article>
  )
}

export function ShopPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Shop</h1>
        <p className="lede">Music is sold on the official Bandcamp. This site does not take payment or invent merchandise.</p>
        <a className="btn solid" href={label.links.bandcamp}>Buy on Bandcamp</a>
      </header>
    </div>
  )
}

export function VisualPage() {
  const items = useMemo(
    () => releases.map((release) => ({
      id: release.id,
      img: release.coverImage,
      width: 1000,
      height: 1000,
      title: release.title,
      description: `${release.artist.name} · Bosque Records artwork`,
      alt: `${release.title} cover art`,
      url: `/releases/${release.slug}`
    })),
    []
  )

  return (
    <div className="page">
      <header className="page-head">
        <h1>Visual arts</h1>
        <p className="lede">
          Label artwork as it appears on published releases. Separate artwork credits appear here when the label publishes them.
        </p>
      </header>
      <div className="visual-masonry">
        <Masonry
          items={items}
          columns="auto"
          columnWidth={240}
          gap={14}
          radius={4}
          animateFrom="bottom"
          stagger={0.04}
          duration={0.55}
          bounce={0}
          blurToFocus
          revealOnScroll
          hoverEffect="lift"
          captions="hover"
          lightbox
          draggable={false}
        />
      </div>
    </div>
  )
}

export function ContactPage() {
  return (
    <InquiryPage
      title="Contact"
      intro={`Write ${label.email}, or send a note below. It is stored only when the label API accepts it.`}
      eventType="General inquiry"
    />
  )
}

export function BookingsPage() {
  return (
    <InquiryPage
      title="Bookings"
      intro="Tell the label about the event. The request is saved when the API is running."
      eventType="Performance"
    />
  )
}

function InquiryPage({ title, intro, eventType }: { title: string; intro: string; eventType: string }) {
  const [form, setForm] = useState({ ...empty, eventType })
  const [status, setStatus] = useState<'idle' | 'sending' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (form.company) return
    if (!form.name.trim() || !form.email.includes('@') || !form.date) {
      setStatus('error')
      setError('Name, a valid email, and a date are required.')
      return
    }
    const details = [
      form.organization && `Organization: ${form.organization}`,
      form.artist && `Artist: ${form.artist}`,
      form.eventName && `Event: ${form.eventName}`,
      form.venue && `Venue: ${form.venue}`,
      form.city && `City: ${form.city}`,
      form.message
    ].filter(Boolean).join('\n')
    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          eventType: form.eventType,
          date: form.date,
          message: details
        })
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok || body.error || body.success === false) {
        throw new Error(body.error || 'The label API did not accept this note.')
      }
      setStatus('saved')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not reach the label API.')
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>{title}</h1>
        <p className="lede">{intro}</p>
      </header>
      <form className="form" onSubmit={onSubmit}>
        <label className="honeypot">Company<input value={form.company} onChange={set('company')} tabIndex={-1} autoComplete="off" /></label>
        <label className="field"><span>Name</span><input required value={form.name} onChange={set('name')} /></label>
        <label className="field"><span>Email</span><input required type="email" value={form.email} onChange={set('email')} /></label>
        <label className="field"><span>Organization</span><input value={form.organization} onChange={set('organization')} /></label>
        <label className="field"><span>Artist</span>
          <select value={form.artist} onChange={set('artist')}>
            <option value="">Label choice</option>
            {rosterArtists.map((artist) => <option key={artist.id}>{artist.name}</option>)}
          </select>
        </label>
        <label className="field"><span>Event name</span><input value={form.eventName} onChange={set('eventName')} /></label>
        <label className="field"><span>Date</span><input required type="date" value={form.date} onChange={set('date')} /></label>
        <label className="field"><span>Venue</span><input value={form.venue} onChange={set('venue')} /></label>
        <label className="field"><span>City</span><input value={form.city} onChange={set('city')} /></label>
        <label className="field"><span>Type</span>
          <select value={form.eventType} onChange={set('eventType')}>
            <option>Performance</option>
            <option>General inquiry</option>
            <option>Artist submission</option>
          </select>
        </label>
        <label className="field"><span>Message</span><textarea rows={5} value={form.message} onChange={set('message')} /></label>
        <button className="btn solid" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Send'}
        </button>
        {status === 'saved' && <p className="ok">Saved. The label can read it in the booking list.</p>}
        {status === 'error' && <p className="error">{error} You can also write {label.email}.</p>}
      </form>
    </div>
  )
}

export function NotFoundPage() {
  return <div className="page"><h1>Page not found</h1><Link to="/">Return home</Link></div>
}
