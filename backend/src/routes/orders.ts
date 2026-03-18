import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import {
  createPaymentIntent,
  retrievePaymentIntent
} from '../services/stripeService'
import { calculateShipping, getSEPAInstructions } from '../services/shippingService'
import { sendOrderConfirmation, sendDigitalDownloadAccess } from '../services/emailService'

const prisma = new PrismaClient()

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `BR-${timestamp}-${random}`
}

function parseImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return [imagesJson]
  }
}

export const ordersRoutes = new Elysia({ prefix: '/api/v1/orders' })
  
  // Get order by order number
  .get(
    '/:orderNumber',
    async ({ params }) => {
      const order = await prisma.order.findUnique({
        where: { orderNumber: params.orderNumber },
        include: {
          items: {
            include: {
              product: true
            }
          },
          customer: true
        }
      })

      if (!order) {
        return { error: 'Order not found' }
      }

      return {
        ...order,
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
        billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null
      }
    },
    {
      params: t.Object({
        orderNumber: t.String()
      })
    }
  )

  // Get customer orders (for logged-in customers)
  .get(
    '/customer/:customerId',
    async ({ params, headers }) => {
      const orders = await prisma.order.findMany({
        where: { customerId: params.customerId },
        include: {
          items: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return orders.map((order) => ({
        ...order,
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
        billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null
      }))
    },
    {
      params: t.Object({
        customerId: t.String()
      })
    }
  )

  // Create new order (with Stripe payment intent)
  .post(
    '/',
    async ({ body }) => {
      const {
        customerEmail,
        customerName,
        customerId,
        items,
        shippingAddress,
        billingAddress,
        notes,
        createAccount
      } = body as any

      // Validate items exist and calculate totals
      const productIds = items.map((i: any) => i.productId)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      })

      if (products.length !== items.length) {
        return { error: 'Some products not found' }
      }

      // Calculate shipping
      const cartItems = items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId)!
        return {
          productId: product.id,
          name: product.name,
          price: item.variant?.salePrice || product.salePrice || product.price,
          quantity: item.quantity,
          productType: product.productType as 'physical' | 'digital' | 'vinyl',
          weight: product.weight || undefined
        }
      })

      const shippingCalc = calculateShipping(cartItems)
      const subtotal = shippingCalc.subtotal
      const shippingCost = shippingCalc.shippingCost
      const total = subtotal + shippingCost

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: customerId || null,
          customerEmail,
          customerName,
          subtotal,
          shippingCost,
          total,
          status: 'pending',
          paymentMethod: 'pending',
          shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
          billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
          notes: notes || null,
          items: {
            create: items.map((item: any) => {
              const product = products.find((p) => p.id === item.productId)!
              const price = item.variant?.salePrice || product.salePrice || product.price
              return {
                productId: product.id,
                productName: product.name,
                productImage: parseImages(product.images)[0] || '',
                quantity: item.quantity,
                price,
                variant: item.variant ? JSON.stringify(item.variant) : null
              }
            })
          }
        },
        include: {
          items: true
        }
      })

      // Create Stripe payment intent
      const paymentIntent = await createPaymentIntent({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'eur',
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber
        },
        customerEmail,
        description: `Bosque Records Order #${order.orderNumber}`
      })

      // Update order with payment ID
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: paymentIntent.id }
      })

      return {
        order: {
          ...order,
          shippingAddress: shippingAddress,
          billingAddress: billingAddress
        },
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.id
      }
    },
    {
      body: t.Object({
        customerEmail: t.String(),
        customerName: t.String(),
        customerId: t.Optional(t.String()),
        items: t.Array(
          t.Object({
            productId: t.String(),
            quantity: t.Number(),
            variant: t.Optional(t.Any())
          })
        ),
        shippingAddress: t.Optional(t.Any()),
        billingAddress: t.Optional(t.Any()),
        notes: t.Optional(t.String()),
        createAccount: t.Optional(t.Boolean())
      })
    }
  )

  // Create SEPA order (no immediate payment)
  .post(
    '/sepa',
    async ({ body }) => {
      const {
        customerEmail,
        customerName,
        customerId,
        items,
        shippingAddress,
        billingAddress,
        notes
      } = body as any

      // Validate items exist and calculate totals
      const productIds = items.map((i: any) => i.productId)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      })

      if (products.length !== items.length) {
        return { error: 'Some products not found' }
      }

      // Calculate shipping
      const cartItems = items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId)!
        return {
          productId: product.id,
          name: product.name,
          price: item.variant?.salePrice || product.salePrice || product.price,
          quantity: item.quantity,
          productType: product.productType as 'physical' | 'digital' | 'vinyl'
        }
      })

      const shippingCalc = calculateShipping(cartItems)

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: customerId || null,
          customerEmail,
          customerName,
          subtotal: shippingCalc.subtotal,
          shippingCost: shippingCalc.shippingCost,
          total: shippingCalc.total,
          status: 'pending',
          paymentMethod: 'sepa',
          shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
          billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
          notes: notes || null,
          items: {
            create: items.map((item: any) => {
              const product = products.find((p) => p.id === item.productId)!
              const price = item.variant?.salePrice || product.salePrice || product.price
              return {
                productId: product.id,
                productName: product.name,
                productImage: parseImages(product.images)[0] || '',
                quantity: item.quantity,
                price,
                variant: item.variant ? JSON.stringify(item.variant) : null
              }
            })
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })

      // Get SEPA instructions
      const sepaInstructions = getSEPAInstructions(order.orderNumber)

      // Send order confirmation email
      try {
        await sendOrderConfirmation({
          orderNumber: order.orderNumber,
          customerEmail,
          customerName,
          total: order.total,
          items: order.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant || undefined
          })),
          shippingAddress,
          paymentMethod: 'sepa'
        })
      } catch (e) {
        console.error('Failed to send order confirmation:', e)
      }

      return {
        order: {
          ...order,
          shippingAddress: shippingAddress,
          billingAddress: billingAddress
        },
        sepaInstructions
      }
    },
    {
      body: t.Object({
        customerEmail: t.String(),
        customerName: t.String(),
        customerId: t.Optional(t.String()),
        items: t.Array(
          t.Object({
            productId: t.String(),
            quantity: t.Number(),
            variant: t.Optional(t.Any())
          })
        ),
        shippingAddress: t.Optional(t.Any()),
        billingAddress: t.Optional(t.Any()),
        notes: t.Optional(t.String())
      })
    }
  )

  // Confirm Stripe payment (webhook simulation endpoint)
  .post(
    '/confirm-stripe/:orderId',
    async ({ params, body }) => {
      const { paymentIntentId, customerId } = body as any

      try {
        const paymentIntent = await retrievePaymentIntent(paymentIntentId)

        if (paymentIntent.status === 'succeeded') {
          const order = await prisma.order.update({
            where: { id: params.orderId },
            data: {
              status: 'paid',
              paymentMethod: 'stripe',
              paymentId: paymentIntentId
            },
            include: {
              items: {
                include: {
                  product: true
                }
              }
            }
          })

          // Add digital products to library
          const digitalItems = order.items.filter(
            (item) => item.product.productType === 'digital'
          )

          if (digitalItems.length > 0 && customerId) {
            await prisma.digitalLibrary.createMany({
              data: digitalItems.map((item) => ({
                customerId,
                productId: item.productId,
                downloadExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
              })),
              skipDuplicates: true
            })
          }

          // Send confirmation email
          try {
            await sendOrderConfirmation({
              orderNumber: order.orderNumber,
              customerEmail: order.customerEmail,
              customerName: order.customerName || 'Customer',
              total: order.total,
              items: order.items.map((item) => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                variant: item.variant || undefined
              })),
              shippingAddress: order.shippingAddress
                ? JSON.parse(order.shippingAddress)
                : undefined,
              paymentMethod: 'stripe'
            })

            if (digitalItems.length > 0) {
              await sendDigitalDownloadAccess({
                orderNumber: order.orderNumber,
                customerEmail: order.customerEmail,
                customerName: order.customerName || 'Customer',
                items: digitalItems.map((item) => ({
                  productName: item.productName,
                  downloadMp3: item.product.downloadMp3 || undefined,
                  downloadWav: item.product.downloadWav || undefined
                }))
              })
            }
          } catch (e) {
            console.error('Failed to send emails:', e)
          }

          return { success: true, order }
        }

        return { success: false, error: 'Payment not completed' }
      } catch (e) {
        return { success: false, error: 'Payment verification failed' }
      }
    },
    {
      params: t.Object({
        orderId: t.String()
      }),
      body: t.Object({
        paymentIntentId: t.String(),
        customerId: t.Optional(t.String())
      })
    }
  )

  // Get order status
  .get(
    '/:orderNumber/status',
    async ({ params }) => {
      const order = await prisma.order.findUnique({
        where: { orderNumber: params.orderNumber },
        select: {
          orderNumber: true,
          status: true,
          paymentMethod: true,
          updatedAt: true
        }
      })

      if (!order) {
        return { error: 'Order not found' }
      }

      return order
    },
    {
      params: t.Object({
        orderNumber: t.String()
      })
    }
  )
