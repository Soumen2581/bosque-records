import { Link, useParams } from 'react-router-dom'
import { Cover } from '@/components/Cover'
import { useListen } from '@/components/Listen'
import { TransitionLink } from '@/components/TransitionLink'
import { useEffect } from 'react'
import { setTintFrom } from '@/atmosphere'
import { formatDate, formatDuration, releaseBySlug, releases } from '@/lib/catalog'

export function ReleasePage() {
  const { slug } = useParams()
  const listen = useListen()
  const release = slug ? releaseBySlug(slug) : undefined
  useEffect(() => {
    if (release) setTintFrom(release.slug)
  }, [release])
  if (!release) {
    return (
      <div className="page">
        <h1>Release not found</h1>
        <Link to="/releases">Back to releases</Link>
      </div>
    )
  }
  const related = releases.filter((item) => item.artist.id === release.artist.id && item.slug !== release.slug)

  return (
    <article className="page release">
      <div>
        <Cover src={release.coverImage} title={release.title} transitionName={`art-${release.slug}`} />
      </div>
      <div>
        <p className="kicker">{release.releaseType}</p>
        <h1>{release.title}</h1>
        <p><TransitionLink to={`/artists/${release.artist.id}`}>{release.artist.name}</TransitionLink></p>
        <p className="meta">Bosque Records · {formatDate(release.releaseDate)}</p>
        <p><button type="button" className="btn solid" onClick={() => listen.open(release)}>Listen on Bandcamp</button></p>
        <table className="tracks">
          <tbody>
            {release.tracks.map((track) => (
              <tr key={track.id}>
                <td>{track.position}</td>
                <td>{track.title}</td>
                <td>{formatDuration(track.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {related.length > 0 && (
          <>
            <h2>More from {release.artist.name}</h2>
            <ul>
              {related.map((item) => (
                <li key={item.id}><TransitionLink to={`/releases/${item.slug}`}>{item.title}</TransitionLink></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  )
}
