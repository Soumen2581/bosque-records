import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { setTintFrom } from '@/atmosphere'
import { artistById, artists, formatDate, rosterArtists, samePersonNote, type ArtistSummary } from '@/lib/catalog'

function ArtistCard({ artist }: { artist: ArtistSummary }) {
  return (
    <Link className="roster-card" to={`/artists/${artist.id}`}>
      {artist.image ? <img src={artist.image} alt="" /> : artist.releases[0] ? <img src={artist.releases[0].coverImage} alt="" /> : <div className="plate">{artist.name}</div>}
      <strong>{artist.name}</strong>
      <span className="meta">{artist.releases.length ? `${artist.releases.length} release${artist.releases.length === 1 ? '' : 's'}` : 'Bosque Records'}</span>
    </Link>
  )
}

export function ArtistsPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Artists</h1>
        <p className="lede">Bosque Records artists. A biography is shown only when the label has published one.</p>
      </header>
      <div className="roster">
        {rosterArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
      </div>
    </div>
  )
}

export function ArtistPage() {
  const { id } = useParams()
  const artist = id ? artistById(id) : undefined
  useEffect(() => {
    if (artist) setTintFrom(artist.releases[0]?.slug ?? artist.id)
  }, [artist])
  if (!artist) {
    return <div className="page"><h1>Artist not found</h1><Link to="/artists">Back to artists</Link></div>
  }
  const projects = artist.personId ? artists.filter((item) => item.personId === artist.personId && item.id !== artist.id) : []
  return (
    <div className="page">
      <header className="page-head artist-head">
        {artist.image ? <img src={artist.image} alt="" /> : null}
        <div>
          <h1>{artist.name}</h1>
          <p className="lede">A published biography is not on file.</p>
          {projects.length ? <p>{samePersonNote}</p> : null}
          {projects.map((project) => (
            <p key={project.id}><Link to={`/artists/${project.id}`}>{project.name}</Link></p>
          ))}
          {artist.instagram ? <p><a href={artist.instagram}>Instagram</a></p> : null}
        </div>
      </header>
      {artist.releases.length ? (
        <ol className="index">
          {artist.releases.map((release) => (
            <li key={release.id}>
              <Link to={`/releases/${release.slug}`}>
                <span>{formatDate(release.releaseDate)}</span>
                <strong>{release.title}</strong>
                <span>{release.releaseType}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
      {artist.credits.length ? (
        <>
          <h2>Credits</h2>
          <ol className="index">
            {artist.credits.map((credit) => (
              <li key={`${credit.release.id}-${credit.detail}`}>
                <Link to={`/releases/${credit.release.slug}`}>
                  <span>{credit.release.title}</span>
                  <strong>{credit.detail}</strong>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </div>
  )
}
