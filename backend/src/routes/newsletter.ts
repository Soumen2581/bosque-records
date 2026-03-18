import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const newsletterRoute = new Elysia({ prefix: '/newsletter' })
  .post('/subscribe', async ({ body }) => {
    try {
      const existingSubscription = await prisma.newsletter.findUnique({
        where: { email: body.email }
      })

      if (existingSubscription) {
        if (existingSubscription.active) {
          return { 
            success: false, 
            message: 'Email already subscribed to newsletter' 
          }
        } else {
          // Reactivate subscription
          await prisma.newsletter.update({
            where: { email: body.email },
            data: { active: true }
          })
          return { 
            success: true, 
            message: 'Successfully resubscribed to newsletter' 
          }
        }
      }

      await prisma.newsletter.create({
        data: { email: body.email }
      })

      return { 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      return { error: 'Failed to subscribe to newsletter' }
    }
  }, {
    body: t.Object({
      email: t.String()
    })
  })
  .post('/unsubscribe', async ({ body }) => {
    try {
      await prisma.newsletter.update({
        where: { email: body.email },
        data: { active: false }
      })
      return { 
        success: true, 
        message: 'Successfully unsubscribed from newsletter' 
      }
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error)
      return { error: 'Failed to unsubscribe from newsletter' }
    }
  }, {
    body: t.Object({
      email: t.String()
    })
  })
  .get('/subscribers', async () => {
    try {
      const subscribers = await prisma.newsletter.findMany({
        where: { active: true },
        select: { email: true, createdAt: true }
      })
      return subscribers
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      return { error: 'Failed to fetch subscribers' }
    }
  }) 