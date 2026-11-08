import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlareHover, MaskedHeading, ScrollExpand, ScrollReveal, SpotlightCard, TextLoop } from '@/bits'
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
  const [expandEnabled, setExpandEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)')
    const sync = () => setExpandEnabled(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  function discover() {
    const pick = releases[Math.floor(Math.random() * releases.length)]
    transitionTo(() => navigate(`/releases/${pick.slug}`))
  }

  return (
    <>
      <section className="hero stage">
        <div className="hero-copy">
          <img className="mark hero-mark" src={logo} alt="Bosque Records" />
          <MaskedHeading
            className="hero-masked"
            text="A sanctuary of resonant frequencies"
            tag="h1"
            src={logo}
            mediaType="image"
            reveal="rise"
            trigger="mount"
            duration={1.15}
            stagger={0.045}
            tint="rgba(180, 210, 160, 0.55)"
            fillScale={1.15}
            brightness={1.28}
            outline
            outlineColor="rgba(246, 243, 234, 0.72)"
            outlineWidth={2}
            spotlight={false}
            align="left"
            tracking={-0.02}
            weight={400}
            lineHeight={0.95}
            textScale={0.14}
          />
          <p className="lede">{label.statement}</p>
          <div className="actions">
            <GlareHover
              className="glare-btn"
              glareColor="#B49A66"
              glareOpacity={0.22}
              softness={0.7}
              variant="sheen"
              mode="hover"
              borderRadius="0"
              background="transparent"
              width="auto"
              height="auto"
            >
              <TransitionLink className="btn solid" to="/releases">Discover releases</TransitionLink>
            </GlareHover>
            <TransitionLink className="btn" to="/artists">Explore artists</TransitionLink>
            <button type="button" className="btn ghost" onClick={discover}>Open a release</button>
          </div>
        </div>
        <a className="scroll-cue" href="#identity">Continue</a>
      </section>

      <section className="section story-band" id="identity">
        <div className="story-copy">
          <ScrollReveal
            tag="h2"
            effect="rise"
            mode="scrub"
            splitBy="words"
            enableBlur
            baseOpacity={0.12}
            blurStrength={3}
            stagger={0.04}
            containerClassName="story-reveal-title"
          >
            Forest frequencies for the underground
          </ScrollReveal>
          <ScrollReveal
            tag="p"
            effect="fade"
            mode="scrub"
            splitBy="words"
            enableBlur={false}
            baseOpacity={0.2}
            stagger={0.02}
            containerClassName="story-reveal-lede lede"
          >
            The label publishes through Bandcamp. Releases, artists, and gatherings on this site come from that catalog and from the label’s public posts — nothing invented for atmosphere.
          </ScrollReveal>
          <TransitionLink className="btn" to="/about">About the label</TransitionLink>
        </div>
        <div className="story-art" aria-hidden="true">
          <img src={logo} alt="" />
        </div>
      </section>

      {featured ? (
        <section className="feature-expand-wrap" aria-label="Featured release">
          <ScrollExpand
            className="feature-expand"
            src={featured.coverImage}
            alt={featured.title}
            title={featured.title}
            scrollHint={expandEnabled ? 'Scroll to expand' : ''}
            useWindowScroll
            enabled={expandEnabled}
            startWidth={38}
            startHeight={52}
            startRadius={10}
            endRadius={0}
            mediaZoom={1.28}
            scrollDistance={1.05}
            holdDistance={0.28}
            overlayScrim={0.42}
            smoothing={0.12}
          >
            <div className="feature-expand-copy">
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
          </ScrollExpand>
        </section>
      ) : null}

      <div className="brand-loop" aria-hidden="true">
        <TextLoop
          text="BOSQUE RECORDS · FOREST PSYCHEDELIA · UNDERGROUND FREQUENCIES · EXPERIMENTAL SOUND"
          shape="line"
          speed={28}
          fontSize={18}
          letterSpacing={4}
          uppercase
          color="#A5A69A"
          edgeFade={0.12}
          pauseOnHover
          ribbon={false}
          draggable={false}
        />
      </div>

      <Reveal as="section" className="section explorer-stage" variant="fade">
        <ReleaseExplorer items={releases} title="Release discovery" />
      </Reveal>

      <Reveal as="section" className="section explorer-stage" variant="fade" delay={40}>
        <ArtistExplorer items={rosterArtists} />
      </Reveal>

      <section className="section story-band reverse">
        <div className="story-copy">
          <ScrollReveal
            tag="h2"
            effect="rise"
            mode="enter"
            splitBy="words"
            enableBlur
            baseOpacity={0.15}
            blurStrength={2}
            stagger={0.05}
            containerClassName="story-reveal-title"
          >
            The label in the forest
          </ScrollReveal>
          <p className="lede">{label.statement}</p>
          <p className="meta">Further history is added only when it can be sourced from the label itself.</p>
          <div className="actions">
            <TransitionLink className="btn" to="/about">Read about</TransitionLink>
            <TransitionLink className="btn" to="/contact">Contact</TransitionLink>
          </div>
        </div>
        <div className="story-panel" aria-hidden="true" />
      </section>

      <Reveal as="section" className="section events-strip" variant="rise">
        <div className="section-head">
          <h2>Gatherings</h2>
          <TransitionLink className="btn" to="/events">All events</TransitionLink>
        </div>
        <p className="meta">Dated from the label’s public Instagram. Latest first.</p>
        <div className="event-rail">
          {pastEvents.map((event) => (
            <SpotlightCard
              key={event.id}
              className="event-tile bosque-spot"
              spotlightColor="rgba(180, 154, 102, 0.28)"
              intensity={0.18}
              spotlightSize={220}
              softness={0.75}
              borderGlow={0.35}
              flare={false}
              grain={0.08}
            >
              {event.images[0] ? <img src={event.images[0]} alt="" loading="lazy" /> : <div className="plate">{event.title}</div>}
              <p className="meta">{formatEventDate(event)}</p>
              <h3>{event.title}</h3>
              <p className="meta">{event.place}</p>
            </SpotlightCard>
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
              <GlareHover
                className="glare-btn"
                glareColor="#E9E6D9"
                glareOpacity={0.18}
                softness={0.8}
                variant="streak"
                mode="hover"
                borderRadius="0"
                background="transparent"
                width="auto"
                height="auto"
              >
                <a className="btn solid" href={featured.bandcampUrl} target="_blank" rel="noreferrer">Open Bandcamp</a>
              </GlareHover>
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
