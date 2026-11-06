import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { label } from '@/config/label'
import { artists } from '@/lib/catalog'

const empty = { name: '', email: '', organization: '', artist: '', eventName: '', date: '', venue: '', city: '', eventType: 'Performance', message: '', company: '' }

export function AboutPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>About</h1>
        <p className="lede">{label.statement}</p>
        <p>The label publishes through <a href={label.links.bandcamp}>Bandcamp</a>. Further history is added only when it can be sourced.</p>
      </header>
    </div>
  )
}

export function EventsPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Events</h1>
        <p className="lede">No upcoming events are published. Past dates stay in the archive once they are verified.</p>
        <Link className="btn" to="/bookings">Book the label</Link>
      </header>
    </div>
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
  return (
    <div className="page">
      <header className="page-head">
        <h1>Visual arts</h1>
        <p className="lede">Artwork credits will appear here when the label publishes them. Album covers stay on their release pages.</p>
      </header>
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
            {artists.map((artist) => <option key={artist.id}>{artist.name}</option>)}
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
