import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const artistsRoute = new Elysia({ prefix: '/artists' })
  .get('/', async () => {
    try {
      const artists = await prisma.artist.findMany({
        include: {
          releases: {
            orderBy: { releaseDate: 'desc' }
          },
          events: {
            where: {
              date: {
                gte: new Date()
              }
            },
            orderBy: { date: 'asc' }
          }
        },
        orderBy: { name: 'asc' }
      })
      return artists
    } catch (error) {
      console.error('Error fetching artists:', error)
      return { error: 'Failed to fetch artists' }
    }
  })
  .get('/:slug', async ({ params }) => {
    try {
      const artist = await prisma.artist.findUnique({
        where: { slug: params.slug },
        include: {
          releases: {
            include: {
              tracks: {
                orderBy: { order: 'asc' }
              }
            },
            orderBy: { releaseDate: 'desc' }
          },
          events: {
            orderBy: { date: 'desc' }
          }
        }
      })
      if (!artist) {
        return { error: 'Artist not found', status: 404 }
      }
      return artist
    } catch (error) {
      console.error('Error fetching artist:', error)
      return { error: 'Failed to fetch artist' }
    }
  }, {
    params: t.Object({
      slug: t.String()
    })
  })
  .post('/', async ({ body }) => {
    try {
      const artist = await prisma.artist.create({
        data: body as any
      })
      return artist
    } catch (error) {
      console.error('Error creating artist:', error)
      return { error: 'Failed to create artist' }
    }
  }, {
    body: t.Object({
      name: t.String(),
      slug: t.String(),
      bio: t.Optional(t.String()),
      avatar: t.Optional(t.String()),
      socialLinks: t.Optional(t.String())
    })
  }) 