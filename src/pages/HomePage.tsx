import { useNavigate } from 'react-router-dom'
import { label } from '@/config/label'
import { ArtistExplorer, ReleaseExplorer } from '@/components/Explorers'
import { transitionTo, TransitionLink } from '@/components/TransitionLink'
import { formatDate, releases, rosterArtists } from '@/lib/catalog'
import logo from '@/assets/styles/image/logos/Bosque Records Logo.png'

const chronological = [...releases].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))

export function HomePage() {
  const navigate = useNavigate()

  function discover() {
    const pick = releases[Math.floor(Math.random() * releases.length)]
    transitionTo(() => navigate(`/releases/${pick.slug}`))
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <img className="mark" src={logo} alt="" />
          <h1>A sanctuary of resonant frequencies</h1>
          <p className="lede">{label.statement}</p>
          <div className="actions">
            <a className="btn solid" href="#discography">Enter the discography</a>
            <button type="button" className="btn" onClick={discover}>Discover a release</button>
          </div>
        </div>
        <a className="scroll-cue" href="#discography">Scroll</a>
      </section>
      <ReleaseExplorer items={releases} title="Explore the frequencies" />
      <ArtistExplorer items={rosterArtists} />
      <section className="section">
        <h2>Release timeline</h2>
        <ol className="index">
          {chronological.map((release) => (
            <li key={release.id}>
              <TransitionLink to={`/releases/${release.slug}`}>
                <span>{formatDate(release.releaseDate)}</span>
                <strong>{release.title}</strong>
                <span>{release.artist.name}</span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
