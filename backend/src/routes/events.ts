import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const eventsRoute = new Elysia({ prefix: '/events' })
  .get('/', async () => {
    try {
      const events = await prisma.event.findMany({
        include: {
          artists: true
        },
        orderBy: { date: 'desc' }
      })
      return events
    } catch (error) {
      console.error('Error fetching events:', error)
      return { error: 'Failed to fetch events' }
    }
  })
  .get('/upcoming', async () => {
    try {
      const upcoming = await prisma.event.findMany({
        where: {
          date: {
            gte: new Date()
          }
        },
        include: {
          artists: true
        },
        orderBy: { date: 'asc' },
        take: 6
      })
      return upcoming
    } catch (error) {
      console.error('Error fetching upcoming events:', error)
      return []
    }
  })
  .get('/featured', async () => {
    try {
      const featured = await prisma.event.findMany({
        where: { 
          featured: true,
          date: {
            gte: new Date()
          }
        },
        include: {
          artists: true
        },
        orderBy: { date: 'asc' },
        take: 3
      })
      return featured
    } catch (error) {
      console.error('Error fetching featured events:', error)
      return []
    }
  })
  .get('/:slug', async ({ params }) => {
    try {
      const event = await prisma.event.findUnique({
        where: { slug: params.slug },
        include: {
          artists: {
            include: {
              releases: {
                orderBy: { releaseDate: 'desc' },
                take: 3
              }
            }
          }
        }
      })
      if (!event) {
        return { error: 'Event not found', status: 404 }
      }
      return event
    } catch (error) {
      console.error('Error fetching event:', error)
      return { error: 'Failed to fetch event' }
    }
  }, {
    params: t.Object({
      slug: t.String()
    })
  })
  .post('/', async ({ body }) => {
    try {
      const event = await prisma.event.create({
        data: body as any,
        include: {
          artists: true
        }
      })
      return event
    } catch (error) {
      console.error('Error creating event:', error)
      return { error: 'Failed to create event' }
    }
  }, {
    body: t.Object({
      title: t.String(),
      slug: t.String(),
      description: t.Optional(t.String()),
      date: t.String(),
      endDate: t.Optional(t.String()),
      location: t.String(),
      venue: t.Optional(t.String()),
      image: t.Optional(t.String()),
      ticketUrl: t.Optional(t.String()),
      featured: t.Optional(t.Boolean())
    })
  }) 