import { useEffect, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GlareHover, ScrollReveal, SpotlightCard, TiltedCard } from '@/bits'
import { useListen } from '@/components/Listen'
import { TransitionLink } from '@/components/TransitionLink'
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
      <div className="release-art">
        <TiltedCard
          imageSrc={release.coverImage}
          altText={release.title}
          captionText=""
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          scaleOnHover={1.02}
          rotateAmplitude={6}
          showTooltip={false}
          glare={0.18}
          glareColor="rgba(233, 230, 217, 0.35)"
          shadow={0.35}
          radius={4}
          className="release-tilt"
          style={{ viewTransitionName: `art-${release.slug}` } as CSSProperties}
        />
      </div>
      <div>
        <p className="kicker">{release.releaseType}</p>
        <h1>{release.title}</h1>
        <p><TransitionLink to={`/artists/${release.artist.id}`}>{release.artist.name}</TransitionLink></p>
        <p className="meta">Bosque Records · {formatDate(release.releaseDate)}</p>
        <ScrollReveal
          tag="p"
          effect="fade"
          mode="enter"
          splitBy="words"
          enableBlur={false}
          baseOpacity={0.25}
          stagger={0.025}
          containerClassName="release-reveal meta"
        >
          {release.tracks.length} tracks. Playback and purchase stay on Bandcamp.
        </ScrollReveal>
        <p>
          <GlareHover
            className="glare-btn"
            glareColor="#B49A66"
            glareOpacity={0.2}
            softness={0.75}
            variant="sheen"
            mode="hover"
            borderRadius="0"
            background="transparent"
            width="auto"
            height="auto"
          >
            <button type="button" className="btn solid" onClick={() => listen.open(release)}>Listen on Bandcamp</button>
          </GlareHover>
        </p>
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
            <ul className="related-list">
              {related.map((item) => (
                <li key={item.id}>
                  <SpotlightCard
                    className="related-spot bosque-spot"
                    spotlightColor="rgba(15, 39, 34, 0.55)"
                    intensity={0.16}
                    spotlightSize={180}
                    softness={0.8}
                    borderGlow={0.3}
                    flare={false}
                  >
                    <TransitionLink to={`/releases/${item.slug}`}>{item.title}</TransitionLink>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  )
}
