import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const artworksRoute = new Elysia({ prefix: '/artworks' })
  .get('/', async () => {
    try {
      const artworks = await prisma.artwork.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return artworks
    } catch (error) {
      console.error('Error fetching artworks:', error)
      return { error: 'Failed to fetch artworks' }
    }
  })
  .get('/featured', async () => {
    try {
      const featured = await prisma.artwork.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
        take: 6
      })
      return featured
    } catch (error) {
      console.error('Error fetching featured artworks:', error)
      return []
    }
  })
  .get('/categories', async () => {
    try {
      const categories = await prisma.artwork.findMany({
        select: {
          category: true
        },
        distinct: ['category']
      })
      return categories.map(c => c.category)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  })
  .get('/:id', async ({ params }) => {
    try {
      const artwork = await prisma.artwork.findUnique({
        where: { id: params.id }
      })
      if (!artwork) {
        return { error: 'Artwork not found', status: 404 }
      }
      return artwork
    } catch (error) {
      console.error('Error fetching artwork:', error)
      return { error: 'Failed to fetch artwork' }
    }
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .post('/', async ({ body }) => {
    try {
      const artwork = await prisma.artwork.create({
        data: body as any
      })
      return artwork
    } catch (error) {
      console.error('Error creating artwork:', error)
      return { error: 'Failed to create artwork' }
    }
  }, {
    body: t.Object({
      title: t.String(),
      description: t.Optional(t.String()),
      imageUrl: t.String(),
      artist: t.String(),
      category: t.String(),
      featured: t.Optional(t.Boolean())
    })
  }) 