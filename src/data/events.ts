import heaven from '@/assets/events/heaven-on-earth.jpg'
import cosmica from '@/assets/events/cosmica.jpg'
import concilium from '@/assets/events/concilium.jpg'
import abduction from '@/assets/events/abduction.jpg'
import synnergia from '@/assets/events/synnergia.jpg'
import n3xu5 from '@/assets/events/n3xu5.jpg'
import { portraits } from '@/data/portraits'

export interface EventArtist {
  id: string
  name: string
  image: string
}

export interface LabelEvent {
  id: string
  title: string
  start: string
  end?: string
  place: string
  detail: string
  lineup: string[]
  images: string[]
  artists: EventArtist[]
  instagram: string
}

function face(id: string, name: string, image = portraits[id]): EventArtist {
  return { id, name, image }
}

export const labelEvents: LabelEvent[] = [
  {
    id: 'synnergia',
    title: 'Synnergia Festival',
    start: '2026-10-30',
    end: '2026-11-02',
    place: 'Hidalgo, near Mexico City',
    detail: 'The label posted that the festival opened this day, with Foe’Xan closing the first stage from 4:30pm to 6:00pm.',
    lineup: ['Foe’Xan, 4:30pm–6:00pm'],
    images: [synnergia],
    artists: [face('foe-xan', 'Foe’Xan')],
    instagram: 'https://www.instagram.com/bosque.records/p/DfIIBNNxHpR/'
  },
  {
    id: 'abduction-zone',
    title: 'Abduction Zone',
    start: '2026-10-09',
    end: '2026-10-11',
    place: 'Southern California',
    detail: 'The label posted that Psychonaut and Taika played a back-to-back as the gathering opened.',
    lineup: ['Psychonaut and Taika, back-to-back'],
    images: [abduction],
    artists: [],
    instagram: 'https://www.instagram.com/bosque.records/p/DePlCURmoeL/'
  },
  {
    id: 'bosque-concilium',
    title: 'Bosque Concilium',
    start: '2026-06-20',
    end: '2026-06-21',
    place: 'Silk Bar & Lounge, 10255 Chapel Hill Road, Morrisville, North Carolina',
    detail: 'Bosque Records gathering marking two years of the label. Doors at 6:00pm on June 20.',
    lineup: [
      'N3xu5, live',
      'Archetypes, live',
      'Foe’Xan, DJ',
      'Ghost Noize, DJ',
      'IxMuk, live',
      'Mombi Yuleman, live',
      'Raffidelic, DJ',
      'Skrapz, DJ'
    ],
    images: [concilium],
    artists: [
      face('foe-xan', 'Foe’Xan'),
      face('n3xu5', 'N3xu5', n3xu5),
      face('ghost-noize', 'Ghost Noize'),
      face('ixmuk', 'IxMuk')
    ],
    instagram: 'https://www.instagram.com/bosque.records/reel/DZedJHFODBz/'
  },
  {
    id: 'cosmica-campout',
    title: 'Cosmica Campout',
    start: '2026-06-12',
    end: '2026-06-14',
    place: 'Anza Borrego Mountains',
    detail: 'Sunday sets posted by the label.',
    lineup: [
      'N3xu5, live, 1:00am–2:30am',
      'Foe’Xan, DJ, 4:00am–5:30am',
      'Psychonaut, DJ, 7:00am–8:30am',
      'Cosmik Frequency, live, 8:30pm–close'
    ],
    images: [cosmica],
    artists: [
      face('n3xu5', 'N3xu5', n3xu5),
      face('foe-xan', 'Foe’Xan'),
      face('cosmik-frequency', 'Cosmik Frequency')
    ],
    instagram: 'https://www.instagram.com/bosque.records/p/DZflHBqDl50/'
  },
  {
    id: 'heaven-on-earth',
    title: 'Heaven on Earth',
    start: '2026-05-22',
    end: '2026-05-24',
    place: 'Heaven on Earth',
    detail: 'Kabiri Records and Bosque Records shared a ritual across the weekend. These are the sets the label published.',
    lineup: [
      'Psychonaut, Saturday 5:00am–7:00am',
      'Cosmik Frequency, Saturday 11:00am–1:00pm',
      'Snapgon, Sunday 6:00pm–8:00pm',
      'Foe’Xan, Sunday 8:00pm–10:00pm'
    ],
    images: [heaven],
    artists: [
      face('cosmik-frequency', 'Cosmik Frequency'),
      face('foe-xan', 'Foe’Xan')
    ],
    instagram: 'https://www.instagram.com/bosque.records/p/DYpZR30jn6L/'
  },
  {
    id: 'pi-bar-2025',
    title: 'Alquimia Bosque night',
    start: '2025-02-08',
    place: 'Pi Bar & Grill, Chapel Hill, Morrisville',
    detail: 'One-year gathering posted by the label. Doors at 7:00pm.',
    lineup: ['Kri Samadhi', 'Foe’Xan', 'Ghost Noize', 'Raffidelic', 'Skrapz'],
    images: [],
    artists: [
      face('foe-xan', 'Foe’Xan'),
      face('ghost-noize', 'Ghost Noize')
    ],
    instagram: 'https://www.instagram.com/bosque.records/reel/DFP93cgxXLl/'
  }
]

export function formatEventDate(event: LabelEvent) {
  const start = new Date(`${event.start}T00:00:00`)
  const startText = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  if (!event.end || event.end === event.start) return startText
  const end = new Date(`${event.end}T00:00:00`)
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`
  }
  const endText = end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `${startText} – ${endText}`
}
