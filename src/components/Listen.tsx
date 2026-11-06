import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Release } from '@/lib/catalog'

interface ListenValue {
  release: Release | null
  player: boolean
  open: (release: Release) => void
  togglePlayer: () => void
  close: () => void
}

const ListenContext = createContext<ListenValue | null>(null)

export function ListenProvider({ children }: { children: ReactNode }) {
  const [release, setRelease] = useState<Release | null>(null)
  const [player, setPlayer] = useState(false)
  const value: ListenValue = {
    release,
    player,
    open: (next) => {
      setRelease(next)
      setPlayer(false)
    },
    togglePlayer: () => setPlayer((current) => !current),
    close: () => {
      setRelease(null)
      setPlayer(false)
    }
  }
  return <ListenContext.Provider value={value}>{children}</ListenContext.Provider>
}

export function useListen() {
  const value = useContext(ListenContext)
  if (!value) throw new Error('ListenProvider is missing')
  return value
}

export function ListeningDock() {
  const { release, player, togglePlayer, close } = useListen()
  if (!release) return null
  return (
    <aside className="dock" aria-label="Selected release">
      <img src={release.coverImage} alt="" width="56" height="56" />
      <div>
        <strong>{release.title}</strong>
        <span>{release.artist.name}</span>
      </div>
      <button type="button" className="btn" onClick={togglePlayer}>
        {player ? 'Hide player' : 'Open Bandcamp player'}
      </button>
      <a className="btn solid" href={release.bandcampUrl} target="_blank" rel="noreferrer">Bandcamp</a>
      <button type="button" className="btn" onClick={close}>Close</button>
      {player && (
        <iframe title={`${release.title} on Bandcamp`} src={release.embedUrl} loading="lazy" />
      )}
    </aside>
  )
}
