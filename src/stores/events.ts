import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Event } from '@/types'

// Mock events data for development when API is unavailable
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Forest Gathering 2024',
    slug: 'forest-gathering-2024',
    description: 'An immersive outdoor psytrance experience in the heart of ancient woods',
    date: '2024-06-15T20:00:00Z',
    venue: 'Sacred Grove',
    location: 'Black Forest, Germany',
    artists: [
      { id: '1', name: 'Ghost Noize' },
      { id: '2', name: 'Foe Xan' }
    ],
    ticketUrl: '#',
    price: 35,
    featured: true
  },
  {
    id: '2',
    title: 'Moonlit Ceremony',
    slug: 'moonlit-ceremony',
    description: 'A mystical night of shamanic sounds under the full moon',
    date: '2024-07-20T22:00:00Z',
    venue: 'The Stone Circle',
    location: 'Cornwall, UK',
    artists: [
      { id: '3', name: 'Cosmik Frequency' },
      { id: '4', name: 'Brainwavez' }
    ],
    featured: false
  }
]

export const useEventsStore = defineStore('events', () => {
  const events: Ref<Event[]> = ref([])
  const currentEvent: Ref<Event | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  const { get } = useApi()
  
  // Computed
  const upcomingEvents: ComputedRef<Event[]> = computed(() => {
    const now = new Date()
    const data = events.value.length > 0 ? events.value : mockEvents
    return data
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3)
  })
  
  const featuredEvents: ComputedRef<Event[]> = computed(() => {
    const data = events.value.length > 0 ? events.value : mockEvents
    return data.filter(event => event.featured)
  })
  
  const pastEvents: ComputedRef<Event[]> = computed(() => {
    const now = new Date()
    const data = events.value.length > 0 ? events.value : mockEvents
    return data
      .filter(event => new Date(event.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })
  
  // Actions
  const fetchEvents = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      const data: Event[] = await get('/events')
      events.value = data
    } catch (err: any) {
      // Don't set error state for API unavailability - just log and use fallback
      console.info('API server unavailable, using mock events data as fallback')
    } finally {
      loading.value = false
    }
  }
  
  const fetchUpcomingEvents = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      const data: Event[] = await get('/events/upcoming')
      // Update events array with upcoming events
      data.forEach(event => {
        const index = events.value.findIndex(e => e.id === event.id)
        if (index >= 0) {
          events.value[index] = event
        } else {
          events.value.push(event)
        }
      })
    } catch (err: any) {
      // Don't set error state for API unavailability - just log and use fallback
      console.info('API server unavailable, using mock upcoming events data as fallback')
      // The upcomingEvents computed property will automatically use mockEvents as fallback
    } finally {
      loading.value = false
    }
  }
  
  const fetchEventBySlug = async (slug: string): Promise<Event> => {
    try {
      loading.value = true
      error.value = null
      const data: Event = await get(`/events/${slug}`)
      currentEvent.value = data
      return data
    } catch (err: any) {
      error.value = err.message
      console.error('Failed to fetch event:', err)
      
      // Try to find in mock data
      const mockEvent = mockEvents.find(event => event.slug === slug)
      if (mockEvent) {
        currentEvent.value = mockEvent
        return mockEvent
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const getEventBySlug = (slug: string): Event | undefined => {
    const storeEvent = events.value.find(event => event.slug === slug)
    if (storeEvent) return storeEvent
    return mockEvents.find(event => event.slug === slug)
  }
  
  return {
    // State
    events,
    currentEvent,
    loading,
    error,
    
    // Getters
    upcomingEvents,
    featuredEvents,
    pastEvents,
    
    // Actions
    fetchEvents,
    fetchUpcomingEvents,
    fetchEventBySlug,
    getEventBySlug
  }
}) 