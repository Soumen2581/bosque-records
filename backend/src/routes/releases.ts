import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const releasesRoute = new Elysia({ prefix: '/releases' })
  .get('/', async () => {
    try {
      const releases = await prisma.release.findMany({
        include: {
          artist: true,
          tracks: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { releaseDate: 'desc' }
      })
      return releases
    } catch (error) {
      console.error('Error fetching releases:', error)
      return { error: 'Failed to fetch releases' }
    }
  })
  .get('/featured', async () => {
    try {
      const featured = await prisma.release.findMany({
        where: { featured: true },
        include: { 
          artist: true,
          tracks: {
            orderBy: { order: 'asc' }
          }
        },
        take: 4,
        orderBy: { releaseDate: 'desc' }
      })
      return featured
    } catch (error) {
      console.error('Error fetching featured releases:', error)
      return []
    }
  })
  .get('/:slug', async ({ params }) => {
    try {
      const release = await prisma.release.findUnique({
        where: { slug: params.slug },
        include: {
          artist: true,
          tracks: { orderBy: { order: 'asc' } }
        }
      })
      if (!release) {
        return { error: 'Release not found', status: 404 }
      }
      return release
    } catch (error) {
      console.error('Error fetching release:', error)
      return { error: 'Failed to fetch release' }
    }
  }, {
    params: t.Object({
      slug: t.String()
    })
  })
  .post('/', async ({ body }) => {
    try {
      const release = await prisma.release.create({
        data: body as any,
        include: {
          artist: true,
          tracks: true
        }
      })
      return release
    } catch (error) {
      console.error('Error creating release:', error)
      return { error: 'Failed to create release' }
    }
  }, {
    body: t.Object({
      title: t.String(),
      slug: t.String(),
      description: t.Optional(t.String()),
      releaseDate: t.String(),
      coverImage: t.String(),
      featured: t.Optional(t.Boolean()),
      price: t.Optional(t.Number()),
      artistId: t.String(),
      tags: t.Optional(t.String())
    })
  }) 