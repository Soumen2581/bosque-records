import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SpotlightCard } from '@/bits'
import { Cover } from '@/components/Cover'
import { TransitionLink } from '@/components/TransitionLink'
import { artists, formatDate, releases, releaseTypes, years } from '@/lib/catalog'

export function ReleasesPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const year = params.get('year') ?? ''
  const type = params.get('type') ?? ''
  const artist = params.get('artist') ?? ''
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest'

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase()
    const list = releases.filter((release) => {
      const haystack = `${release.title} ${release.artist.name}`.toLowerCase()
      if (query && !haystack.includes(query)) return false
      if (year && !release.releaseDate.startsWith(year)) return false
      if (type && release.releaseType !== type) return false
      if (artist && release.artist.id !== artist) return false
      return true
    })
    return sort === 'oldest' ? [...list].reverse() : list
  }, [q, year, type, artist, sort])

  return (
    <div className="page">
      <header className="page-head">
        <h1>Releases</h1>
        <p className="lede">The Bosque Records catalog, verified from the label Bandcamp.</p>
      </header>
      <form className="filters" onSubmit={(event) => event.preventDefault()}>
        <input aria-label="Search releases" value={q} placeholder="Search title or artist" onChange={(event) => set('q', event.target.value)} />
        <select aria-label="Year" value={year} onChange={(event) => set('year', event.target.value)}>
          <option value="">All years</option>
          {years.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Release type" value={type} onChange={(event) => set('type', event.target.value)}>
          <option value="">All types</option>
          {releaseTypes.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Artist" value={artist} onChange={(event) => set('artist', event.target.value)}>
          <option value="">All artists</option>
          {artists.filter((item) => item.releases.length).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select aria-label="Sort" value={sort} onChange={(event) => set('sort', event.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </form>
      {visible.length === 0 ? <p>No releases match those filters.</p> : (
        <div className="catalog">
          {visible.map((release) => (
            <SpotlightCard
              key={release.id}
              className="catalog-spot bosque-spot"
              spotlightColor="rgba(101, 118, 83, 0.32)"
              intensity={0.2}
              spotlightSize={260}
              softness={0.72}
              borderGlow={0.4}
              flare={false}
              grain={0.06}
            >
              <TransitionLink to={`/releases/${release.slug}`} className="catalog-card">
                <Cover src={release.coverImage} title={release.title} transitionName={`art-${release.slug}`} />
                <h2>{release.title}</h2>
                <p>{release.artist.name}</p>
                <p>{release.releaseType} · {formatDate(release.releaseDate)}</p>
              </TransitionLink>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  )
}
