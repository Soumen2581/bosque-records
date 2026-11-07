import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { PrismaClient } from '@prisma/client'

import { releasesRoute } from './routes/releases'
import { artistsRoute } from './routes/artists'
import { eventsRoute } from './routes/events'
import { shopRoute } from './routes/shop'
import { bookingsRoute } from './routes/bookings'
import { newsletterRoute } from './routes/newsletter'
import { artworksRoute } from './routes/artworks'
import { adminRoute } from './routes/admin'
import { bandcampRoute } from './routes/bandcamp'
import { ordersRoutes } from './routes/orders'
import { customersRoutes } from './routes/customers'

export const prisma = new PrismaClient()

export function createApp(options: { serveStatic?: boolean } = {}) {
  const serveStatic = options.serveStatic ?? true
  let app = new Elysia()
    .use(cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:8088', 'https://bosquerecords.com', 'https://www.bosquerecords.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }))

  if (serveStatic) {
    app = app.use(staticPlugin({
      assets: 'uploads',
      prefix: '/uploads'
    }))
  }

  return app
    .get('/', () => ({
      message: 'Bosque Records API',
      status: 'running',
      endpoints: [
        '/api/v1/releases',
        '/api/v1/artists',
        '/api/v1/events',
        '/api/v1/shop',
        '/api/v1/bookings',
        '/api/v1/newsletter',
        '/api/v1/artworks',
        '/api/v1/admin',
        '/api/v1/bandcamp/releases'
      ]
    }))
    .group('/api/v1', (group) =>
      group
        .use(releasesRoute)
        .use(artistsRoute)
        .use(eventsRoute)
        .use(shopRoute)
        .use(bookingsRoute)
        .use(newsletterRoute)
        .use(artworksRoute)
        .use(adminRoute)
        .use(bandcampRoute)
        .use(ordersRoutes)
        .use(customersRoutes)
    )
}

export const app = createApp()
