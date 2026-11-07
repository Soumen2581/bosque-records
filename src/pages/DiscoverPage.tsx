import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidingRail } from '@/components/NavIndicator'
import { TransitionLink } from '@/components/TransitionLink'
import { formatDate, releases, rosterArtists } from '@/lib/catalog'

const tabs = [
  ['releases', 'Releases'],
  ['artists', 'Artists'],
  ['compilations', 'Compilations']
] as const

type Tab = (typeof tabs)[number][0]

export function DiscoverPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: Tab = requested === 'artists' || requested === 'compilations' ? requested : 'releases'
  const query = (params.get('q') ?? '').trim().toLowerCase()

  function setTab(next: Tab) {
    const copy = new URLSearchParams(params)
    copy.set('tab', next)
    setParams(copy, { replace: true })
  }

  const releaseList = useMemo(() => releases.filter((release) => {
    if (tab === 'compilations' && release.releaseType !== 'Compilation') return false
    if (tab === 'releases' && release.releaseType === 'Compilation') return false
    if (!query) return true
    return `${release.title} ${release.artist.name}`.toLowerCase().includes(query)
  }), [query, tab])

  const artistList = useMemo(() => rosterArtists.filter((artist) => {
    if (!query) return true
    return artist.name.toLowerCase().includes(query)
  }), [query])

  return (
    <div className="page">
      <header className="page-head">
        <h1>Discover</h1>
        <p className="lede">The published Bosque Records catalog. Compilations stay separate from single-artist releases.</p>
      </header>
      <SlidingRail activeKey={tab} className="tabs" >
        <div role="tablist" aria-label="Catalog" className="tab-row">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              data-indicator-key={id}
              className={tab === id ? 'is-on' : ''}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </SlidingRail>
      <form className="filters" onSubmit={(event) => event.preventDefault()}>
        <input
          aria-label="Search"
          value={params.get('q') ?? ''}
          placeholder="Search"
          onChange={(event) => {
            const copy = new URLSearchParams(params)
            if (event.target.value) copy.set('q', event.target.value)
            else copy.delete('q')
            setParams(copy, { replace: true })
          }}
        />
      </form>
      <div className="discover-pane" key={tab}>
        {tab === 'artists' ? (
          <div className="artists">
            {artistList.map((artist) => (
              <TransitionLink key={artist.id} to={`/artists/${artist.id}`}>
                {artist.name}
                <span className="meta">{artist.releases.length}</span>
              </TransitionLink>
            ))}
          </div>
        ) : (
          <ol className="index">
            {releaseList.map((release) => (
              <li key={release.id}>
                <TransitionLink to={`/releases/${release.slug}`}>
                  <span>{formatDate(release.releaseDate)}</span>
                  <strong>{release.title}</strong>
                  <span>{release.artist.name}</span>
                </TransitionLink>
              </li>
            ))}
          </ol>
        )}
        {tab !== 'artists' && releaseList.length === 0 && <p>No releases match.</p>}
        {tab === 'artists' && artistList.length === 0 && <p>No artists match.</p>}
      </div>
    </div>
  )
}
