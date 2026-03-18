import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const bookingsRoute = new Elysia({ prefix: '/bookings' })
  .get('/', async () => {
    try {
      const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return bookings
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return { error: 'Failed to fetch bookings' }
    }
  })
  .post('/', async ({ body }) => {
    try {
      const booking = await prisma.booking.create({
        data: {
          ...body as any,
          date: new Date(body.date)
        }
      })
      return { 
        success: true, 
        message: 'Booking request submitted successfully',
        booking 
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      return { error: 'Failed to create booking' }
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      phone: t.Optional(t.String()),
      eventType: t.String(),
      date: t.String(),
      message: t.Optional(t.String())
    })
  })
  .put('/:id/status', async ({ params, body }) => {
    try {
      const booking = await prisma.booking.update({
        where: { id: params.id },
        data: { status: body.status }
      })
      return booking
    } catch (error) {
      console.error('Error updating booking status:', error)
      return { error: 'Failed to update booking status' }
    }
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      status: t.String()
    })
  }) 