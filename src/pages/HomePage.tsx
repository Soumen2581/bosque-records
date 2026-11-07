import { useNavigate } from 'react-router-dom'
import { label } from '@/config/label'
import { ArtistExplorer, ReleaseExplorer } from '@/components/Explorers'
import { Cover } from '@/components/Cover'
import { Reveal } from '@/components/Reveal'
import { transitionTo, TransitionLink } from '@/components/TransitionLink'
import { formatEventDate, labelEvents } from '@/data/events'
import { formatDate, releases, rosterArtists } from '@/lib/catalog'
import logo from '@/assets/styles/image/logos/Bosque Records Logo.png'

const featured = releases.find((release) => release.featured) ?? releases[0]
const latestEvent = labelEvents[0]
const pastEvents = labelEvents.slice(0, 3)

export function HomePage() {
  const navigate = useNavigate()

  function discover() {
    const pick = releases[Math.floor(Math.random() * releases.length)]
    transitionTo(() => navigate(`/releases/${pick.slug}`))
  }

  return (
    <>
      <section className="hero stage">
        <div className="hero-copy">
          <img className="mark hero-mark" src={logo} alt="Bosque Records" />
          <h1>A sanctuary of resonant frequencies</h1>
          <p className="lede">{label.statement}</p>
          <div className="actions">
            <TransitionLink className="btn solid" to="/releases">Discover releases</TransitionLink>
            <TransitionLink className="btn" to="/artists">Explore artists</TransitionLink>
            <button type="button" className="btn ghost" onClick={discover}>Open a release</button>
          </div>
        </div>
        <a className="scroll-cue" href="#identity">Continue</a>
      </section>

      <Reveal as="section" className="section story-band" id="identity" variant="clip">
        <div className="story-copy">
          <h2>Forest frequencies for the underground</h2>
          <p className="lede">
            The label publishes through Bandcamp. Releases, artists, and gatherings on this site come from that catalog and from the label’s public posts — nothing invented for atmosphere.
          </p>
          <TransitionLink className="btn" to="/about">About the label</TransitionLink>
        </div>
        <div className="story-art" aria-hidden="true">
          <img src={logo} alt="" />
        </div>
      </Reveal>

      {featured ? (
        <Reveal as="section" className="section feature-release" variant="scale">
          <Cover src={featured.coverImage} title={featured.title} className="feature-cover" />
          <div className="feature-copy">
            <p className="meta">{featured.releaseType} · {formatDate(featured.releaseDate)}</p>
            <h2>{featured.title}</h2>
            <p className="lede">
              <TransitionLink to={`/artists/${featured.artist.id}`}>{featured.artist.name}</TransitionLink>
            </p>
            <p className="meta">{featured.tracks.length} tracks on Bandcamp. Playback and purchase stay there.</p>
            <div className="actions">
              <TransitionLink className="btn solid" to={`/releases/${featured.slug}`}>View release</TransitionLink>
              <a className="btn" href={featured.bandcampUrl} target="_blank" rel="noreferrer">Listen on Bandcamp</a>
            </div>
          </div>
        </Reveal>
      ) : null}

      <Reveal as="section" className="section explorer-stage" variant="fade">
        <ReleaseExplorer items={releases} title="Release discovery" />
      </Reveal>

      <Reveal as="section" className="section explorer-stage" variant="fade" delay={40}>
        <ArtistExplorer items={rosterArtists} />
      </Reveal>

      <Reveal as="section" className="section story-band reverse" variant="clip">
        <div className="story-copy">
          <h2>The label in the forest</h2>
          <p className="lede">{label.statement}</p>
          <p className="meta">Further history is added only when it can be sourced from the label itself.</p>
          <div className="actions">
            <TransitionLink className="btn" to="/about">Read about</TransitionLink>
            <TransitionLink className="btn" to="/contact">Contact</TransitionLink>
          </div>
        </div>
        <div className="story-panel" aria-hidden="true" />
      </Reveal>

      <Reveal as="section" className="section events-strip" variant="rise">
        <div className="section-head">
          <h2>Gatherings</h2>
          <TransitionLink className="btn" to="/events">All events</TransitionLink>
        </div>
        <p className="meta">Dated from the label’s public Instagram. Latest first.</p>
        <div className="event-rail">
          {pastEvents.map((event) => (
            <article key={event.id} className="event-tile">
              {event.images[0] ? <img src={event.images[0]} alt="" loading="lazy" /> : <div className="plate">{event.title}</div>}
              <p className="meta">{formatEventDate(event)}</p>
              <h3>{event.title}</h3>
              <p className="meta">{event.place}</p>
            </article>
          ))}
        </div>
        {latestEvent ? <p className="meta">Latest dated gathering: {latestEvent.title}</p> : null}
      </Reveal>

      {featured ? (
        <Reveal as="section" className="section listen-band" variant="scale">
          <Cover src={featured.coverImage} title={featured.title} className="listen-cover" />
          <div>
            <h2>Listen on Bandcamp</h2>
            <p className="lede">
              {featured.title} by {featured.artist.name.trim()}. Open the official player — this site does not invent controls or autoplay.
            </p>
            <div className="actions">
              <a className="btn solid" href={featured.bandcampUrl} target="_blank" rel="noreferrer">Open Bandcamp</a>
              <TransitionLink className="btn" to="/discover">Discover more</TransitionLink>
            </div>
          </div>
        </Reveal>
      ) : null}

      <Reveal as="section" className="section timeline-band" variant="rise">
        <div className="section-head">
          <h2>Release timeline</h2>
          <TransitionLink className="btn" to="/releases">Full catalog</TransitionLink>
        </div>
        <ol className="timeline">
          {releases.map((release) => (
            <li key={release.id}>
              <TransitionLink to={`/releases/${release.slug}`}>
                <span className="meta">{formatDate(release.releaseDate)}</span>
                <strong>{release.title}</strong>
                <span className="meta">{release.artist.name}</span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal as="section" className="section finale" variant="fade">
        <img className="mark" src={logo} alt="" />
        <h2>Bosque Records</h2>
        <p className="lede">{label.statement}</p>
        <div className="finale-links">
          <a href={label.links.bandcamp} target="_blank" rel="noreferrer">Bandcamp</a>
          <a href={label.links.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={label.links.soundcloud} target="_blank" rel="noreferrer">SoundCloud</a>
          <a href={label.links.linktree} target="_blank" rel="noreferrer">Linktree</a>
          <a href={`mailto:${label.email}`}>{label.email}</a>
        </div>
      </Reveal>
    </>
  )
}
