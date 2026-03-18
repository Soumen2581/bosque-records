import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const adminRoute = new Elysia({ prefix: '/admin' })

// ========== ARTISTS ADMIN ==========
.group('/artists', (app) => 
  app
    .get('/', async () => {
      try {
        return await prisma.artist.findMany({
          include: {
            releases: { select: { id: true, title: true } },
            events: { select: { id: true, title: true } },
            _count: { select: { releases: true, events: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
      } catch (error) {
        console.error('Error fetching artists:', error)
        return { error: 'Failed to fetch artists' }
      }
    })
    
    .post('/', async ({ body }) => {
      try {
        return await prisma.artist.create({
          data: {
            ...body,
            socialLinks: body.socialLinks ? JSON.stringify(body.socialLinks) : null
          }
        })
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
        socialLinks: t.Optional(t.Any())
      })
    })
    
    .put('/:id', async ({ params, body }) => {
      try {
        return await prisma.artist.update({
          where: { id: params.id },
          data: {
            ...body,
            socialLinks: body.socialLinks ? JSON.stringify(body.socialLinks) : null
          }
        })
      } catch (error) {
        console.error('Error updating artist:', error)
        return { error: 'Failed to update artist' }
      }
    }, {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        socialLinks: t.Optional(t.Any())
      })
    })
    
    .delete('/:id', async ({ params }) => {
      try {
        await prisma.artist.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting artist:', error)
        return { error: 'Failed to delete artist' }
      }
    }, {
      params: t.Object({ id: t.String() })
    })
)

// ========== RELEASES ADMIN ==========
.group('/releases', (app) => 
  app
    .get('/', async () => {
      try {
        return await prisma.release.findMany({
          include: {
            artist: { select: { id: true, name: true } },
            tracks: { select: { id: true, title: true } },
            _count: { select: { tracks: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
      } catch (error) {
        console.error('Error fetching releases:', error)
        return { error: 'Failed to fetch releases' }
      }
    })
    
    .post('/', async ({ body }) => {
      try {
        return await prisma.release.create({
          data: {
            ...body,
            releaseDate: new Date(body.releaseDate)
          },
          include: { artist: true }
        })
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
    
    .put('/:id', async ({ params, body }) => {
      try {
        return await prisma.release.update({
          where: { id: params.id },
          data: {
            ...body,
            releaseDate: body.releaseDate ? new Date(body.releaseDate) : undefined
          },
          include: { artist: true }
        })
      } catch (error) {
        console.error('Error updating release:', error)
        return { error: 'Failed to update release' }
      }
    }, {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        releaseDate: t.Optional(t.String()),
        coverImage: t.Optional(t.String()),
        featured: t.Optional(t.Boolean()),
        price: t.Optional(t.Number()),
        artistId: t.Optional(t.String()),
        tags: t.Optional(t.String())
      })
    })
    
    .delete('/:id', async ({ params }) => {
      try {
        await prisma.release.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting release:', error)
        return { error: 'Failed to delete release' }
      }
    }, {
      params: t.Object({ id: t.String() })
    })
)

// ========== TRACKS ADMIN ==========
.group('/tracks', (app) => 
  app
    .get('/', async () => {
      try {
        return await prisma.track.findMany({
          include: {
            release: { 
              select: { id: true, title: true, artist: { select: { name: true } } }
            }
          },
          orderBy: [{ releaseId: 'asc' }, { order: 'asc' }]
        })
      } catch (error) {
        console.error('Error fetching tracks:', error)
        return { error: 'Failed to fetch tracks' }
      }
    })
    
    .post('/', async ({ body }) => {
      try {
        return await prisma.track.create({
          data: body,
          include: { release: true }
        })
      } catch (error) {
        console.error('Error creating track:', error)
        return { error: 'Failed to create track' }
      }
    }, {
      body: t.Object({
        title: t.String(),
        duration: t.Number(),
        audioFile: t.Optional(t.String()),
        preview: t.Optional(t.String()),
        order: t.Number(),
        releaseId: t.String()
      })
    })
    
    .put('/:id', async ({ params, body }) => {
      try {
        return await prisma.track.update({
          where: { id: params.id },
          data: body,
          include: { release: true }
        })
      } catch (error) {
        console.error('Error updating track:', error)
        return { error: 'Failed to update track' }
      }
    }, {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        duration: t.Optional(t.Number()),
        audioFile: t.Optional(t.String()),
        preview: t.Optional(t.String()),
        order: t.Optional(t.Number()),
        releaseId: t.Optional(t.String())
      })
    })
    
    .delete('/:id', async ({ params }) => {
      try {
        await prisma.track.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting track:', error)
        return { error: 'Failed to delete track' }
      }
    }, {
      params: t.Object({ id: t.String() })
    })
)

// ========== EVENTS ADMIN ==========
.group('/events', (app) => 
  app
    .get('/', async () => {
      try {
        return await prisma.event.findMany({
          include: {
            artists: { select: { id: true, name: true } },
            _count: { select: { artists: true } }
          },
          orderBy: { createdAt: 'desc' }
        })
      } catch (error) {
        console.error('Error fetching events:', error)
        return { error: 'Failed to fetch events' }
      }
    })
    
    .post('/', async ({ body }) => {
      try {
        const { artistIds, ...eventData } = body
        return await prisma.event.create({
          data: {
            ...eventData,
            date: new Date(eventData.date),
            endDate: eventData.endDate ? new Date(eventData.endDate) : null,
            artists: artistIds ? {
              connect: artistIds.map((id: string) => ({ id }))
            } : undefined
          },
          include: { artists: true }
        })
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
        featured: t.Optional(t.Boolean()),
        artistIds: t.Optional(t.Array(t.String()))
      })
    })
    
    .put('/:id', async ({ params, body }) => {
      try {
        const { artistIds, ...eventData } = body
        return await prisma.event.update({
          where: { id: params.id },
          data: {
            ...eventData,
            date: eventData.date ? new Date(eventData.date) : undefined,
            endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
            artists: artistIds ? {
              set: artistIds.map((id: string) => ({ id }))
            } : undefined
          },
          include: { artists: true }
        })
      } catch (error) {
        console.error('Error updating event:', error)
        return { error: 'Failed to update event' }
      }
    }, {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        location: t.Optional(t.String()),
        venue: t.Optional(t.String()),
        image: t.Optional(t.String()),
        ticketUrl: t.Optional(t.String()),
        featured: t.Optional(t.Boolean()),
        artistIds: t.Optional(t.Array(t.String()))
      })
    })
    
    .delete('/:id', async ({ params }) => {
      try {
        await prisma.event.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting event:', error)
        return { error: 'Failed to delete event' }
      }
    }, {
      params: t.Object({ id: t.String() })
    })
)

// ========== PRODUCTS ADMIN ==========
.group('/products', (app) => 
  app
    .get('/', async () => {
      try {
        return await prisma.product.findMany({
          orderBy: { createdAt: 'desc' }
        })
      } catch (error) {
        console.error('Error fetching products:', error)
        return { error: 'Failed to fetch products' }
      }
    })
    
    .post('/', async ({ body }) => {
      try {
        return await prisma.product.create({
          data: {
            ...body,
            images: JSON.stringify(body.images)
          }
        })
      } catch (error) {
        console.error('Error creating product:', error)
        return { error: 'Failed to create product' }
      }
    }, {
      body: t.Object({
        name: t.String(),
        slug: t.String(),
        description: t.Optional(t.String()),
        price: t.Number(),
        images: t.Array(t.String()),
        category: t.String(),
        inStock: t.Optional(t.Boolean()),
        quantity: t.Optional(t.Number())
      })
    })
    
    .put('/:id', async ({ params, body }) => {
      try {
        return await prisma.product.update({
          where: { id: params.id },
          data: {
            ...body,
            images: body.images ? JSON.stringify(body.images) : undefined
          }
        })
      } catch (error) {
        console.error('Error updating product:', error)
        return { error: 'Failed to update product' }
      }
    }, {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String()),
        price: t.Optional(t.Number()),
        images: t.Optional(t.Array(t.String())),
        category: t.Optional(t.String()),
        inStock: t.Optional(t.Boolean()),
        quantity: t.Optional(t.Number())
      })
    })
    
    .delete('/:id', async ({ params }) => {
      try {
        await prisma.product.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting product:', error)
        return { error: 'Failed to delete product' }
      }
    }, {
      params: t.Object({ id: t.String() })
    })
)

// ========== ARTWORKS ADMIN ==========
.group('/artworks', (app) => 
  app
    .get('/', async () => {
      try {
        return await prisma.artwork.findMany({
          orderBy: { createdAt: 'desc' }
        })
      } catch (error) {
        console.error('Error fetching artworks:', error)
        return { error: 'Failed to fetch artworks' }
      }
    })
    
    .post('/', async ({ body }) => {
      try {
        return await prisma.artwork.create({
          data: body
        })
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
    
    .put('/:id', async ({ params, body }) => {
      try {
        return await prisma.artwork.update({
          where: { id: params.id },
          data: body
        })
      } catch (error) {
        console.error('Error updating artwork:', error)
        return { error: 'Failed to update artwork' }
      }
    }, {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        imageUrl: t.Optional(t.String()),
        artist: t.Optional(t.String()),
        category: t.Optional(t.String()),
        featured: t.Optional(t.Boolean())
      })
    })
    
    .delete('/:id', async ({ params }) => {
      try {
        await prisma.artwork.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting artwork:', error)
        return { error: 'Failed to delete artwork' }
      }
    }, {
      params: t.Object({ id: t.String() })
    })
)

// ========== DASHBOARD STATS ==========
.get('/stats', async () => {
  try {
    const [
      artistCount,
      releaseCount,
      trackCount,
      eventCount,
      productCount,
      artworkCount,
      newsletterCount
    ] = await Promise.all([
      prisma.artist.count(),
      prisma.release.count(),
      prisma.track.count(),
      prisma.event.count(),
      prisma.product.count(),
      prisma.artwork.count(),
      prisma.newsletter.count()
    ])

    return {
      artists: artistCount,
      releases: releaseCount,
      tracks: trackCount,
      events: eventCount,
      products: productCount,
      artworks: artworkCount,
      subscribers: newsletterCount
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { error: 'Failed to fetch stats' }
  }
}) 