import { Link, useParams } from 'react-router-dom'
import { artistById, artists, formatDate } from '@/lib/catalog'

export function ArtistsPage() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>Artists</h1>
        <p className="lede">Names credited on Bosque Records releases. Biographies are shown only when the label has published them.</p>
      </header>
      <div className="artists">
        {artists.map((artist) => (
          <Link key={artist.id} to={`/artists/${artist.id}`}>
            {artist.name}
            <span className="meta">{artist.releases.length}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ArtistPage() {
  const { id } = useParams()
  const artist = id ? artistById(id) : undefined
  if (!artist) {
    return <div className="page"><h1>Artist not found</h1><Link to="/artists">Back to artists</Link></div>
  }
  return (
    <div className="page">
      <header className="page-head">
        <h1>{artist.name}</h1>
        <p className="lede">Label releases credited to this name. A published biography is not on file yet.</p>
      </header>
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
    </div>
  )
}
