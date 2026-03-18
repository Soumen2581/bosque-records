import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const SALT_ROUNDS = 10

// Simple JWT-like token (in production, use proper JWT)
function generateToken(customerId: string): string {
  const payload = { customerId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

function verifyToken(token: string): { customerId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    if (payload.exp < Date.now()) return null
    return { customerId: payload.customerId }
  } catch {
    return null
  }
}

export const customersRoutes = new Elysia({ prefix: '/api/v1/customers' })

  // Register new customer
  .post(
    '/register',
    async ({ body }) => {
      const { email, password, firstName, lastName } = body as any

      // Check if customer already exists
      const existing = await prisma.customer.findUnique({
        where: { email }
      })

      if (existing) {
        return { error: 'Email already registered' }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

      // Create customer
      const customer = await prisma.customer.create({
        data: {
          email,
          passwordHash,
          firstName: firstName || null,
          lastName: lastName || null
        }
      })

      // Generate token
      const token = generateToken(customer.id)

      return {
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName
        },
        token
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String())
      })
    }
  )

  // Login
  .post(
    '/login',
    async ({ body }) => {
      const { email, password } = body as any

      const customer = await prisma.customer.findUnique({
        where: { email }
      })

      if (!customer || !customer.passwordHash) {
        return { error: 'Invalid email or password' }
      }

      const validPassword = await bcrypt.compare(password, customer.passwordHash)

      if (!validPassword) {
        return { error: 'Invalid email or password' }
      }

      const token = generateToken(customer.id)

      return {
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName
        },
        token
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String()
      })
    }
  )

  // Get current user (requires auth header)
  .get(
    '/me',
    async ({ headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const customer = await prisma.customer.findUnique({
        where: { id: payload.customerId },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              items: true
            }
          },
          digitalLibraryItems: {
            include: {
              product: true
            }
          }
        }
      })

      if (!customer) {
        return { error: 'Customer not found' }
      }

      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        addresses: customer.addresses ? JSON.parse(customer.addresses) : [],
        orders: customer.orders.map((order) => ({
          ...order,
          shippingAddress: order.shippingAddress
            ? JSON.parse(order.shippingAddress)
            : null,
          billingAddress: order.billingAddress
            ? JSON.parse(order.billingAddress)
            : null
        })),
        digitalLibrary: customer.digitalLibraryItems.map((item) => ({
          ...item,
          product: {
            ...item.product,
            images: JSON.parse(item.product.images)
          }
        }))
      }
    }
  )

  // Update customer profile
  .put(
    '/me',
    async ({ body, headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const { firstName, lastName, phone } = body as any

      const customer = await prisma.customer.update({
        where: { id: payload.customerId },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phone: phone || undefined
        }
      })

      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      }
    },
    {
      body: t.Object({
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        phone: t.Optional(t.String())
      })
    }
  )

  // Add saved address
  .post(
    '/addresses',
    async ({ body, headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const { address } = body as any

      const customer = await prisma.customer.findUnique({
        where: { id: payload.customerId }
      })

      if (!customer) {
        return { error: 'Customer not found' }
      }

      const addresses = customer.addresses
        ? JSON.parse(customer.addresses)
        : []
      addresses.push({ ...address, id: Date.now().toString() })

      await prisma.customer.update({
        where: { id: payload.customerId },
        data: {
          addresses: JSON.stringify(addresses)
        }
      })

      return { addresses }
    },
    {
      body: t.Object({
        address: t.Any()
      })
    }
  )

  // Delete saved address
  .delete(
    '/addresses/:addressId',
    async ({ params, headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const customer = await prisma.customer.findUnique({
        where: { id: payload.customerId }
      })

      if (!customer) {
        return { error: 'Customer not found' }
      }

      const addresses = customer.addresses
        ? JSON.parse(customer.addresses)
        : []
      const filtered = addresses.filter(
        (a: any) => a.id !== params.addressId
      )

      await prisma.customer.update({
        where: { id: payload.customerId },
        data: {
          addresses: JSON.stringify(filtered)
        }
      })

      return { addresses: filtered }
    },
    {
      params: t.Object({
        addressId: t.String()
      })
    }
  )

  // Get digital library
  .get(
    '/library',
    async ({ headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const libraryItems = await prisma.digitalLibrary.findMany({
        where: { customerId: payload.customerId },
        include: {
          product: true
        }
      })

      return libraryItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          images: JSON.parse(item.product.images)
        },
        canDownload: !item.downloadExpiry || item.downloadExpiry > new Date()
      }))
    }
  )

  // Record download
  .post(
    '/library/:productId/download',
    async ({ params, body, headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const { format } = body as any // 'mp3' or 'wav'

      const item = await prisma.digitalLibrary.findUnique({
        where: {
          customerId_productId: {
            customerId: payload.customerId,
            productId: params.productId
          }
        }
      })

      if (!item) {
        return { error: 'Product not in library' }
      }

      if (item.downloadExpiry && item.downloadExpiry < new Date()) {
        return { error: 'Download expired' }
      }

      // Increment download count
      await prisma.digitalLibrary.update({
        where: { id: item.id },
        data: {
          downloadCountMp3:
            format === 'mp3' ? item.downloadCountMp3 + 1 : item.downloadCountMp3,
          downloadCountWav:
            format === 'wav' ? item.downloadCountWav + 1 : item.downloadCountWav,
          lastDownloadAt: new Date()
        }
      })

      // Return download URL
      const product = await prisma.product.findUnique({
        where: { id: params.productId }
      })

      if (!product) {
        return { error: 'Product not found' }
      }

      const downloadUrl =
        format === 'wav' ? product.downloadWav : product.downloadMp3

      if (!downloadUrl) {
        return { error: `${format.toUpperCase()} not available` }
      }

      return { downloadUrl }
    },
    {
      params: t.Object({
        productId: t.String()
      }),
      body: t.Object({
        format: t.Union([t.Literal('mp3'), t.Literal('wav')])
      })
    }
  )

  // Change password
  .post(
    '/change-password',
    async ({ body, headers }) => {
      const authHeader = headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return { error: 'Unauthorized' }
      }

      const token = authHeader.slice(7)
      const payload = verifyToken(token)
      if (!payload) {
        return { error: 'Invalid or expired token' }
      }

      const { currentPassword, newPassword } = body as any

      const customer = await prisma.customer.findUnique({
        where: { id: payload.customerId }
      })

      if (!customer || !customer.passwordHash) {
        return { error: 'Customer not found' }
      }

      const validPassword = await bcrypt.compare(
        currentPassword,
        customer.passwordHash
      )

      if (!validPassword) {
        return { error: 'Current password is incorrect' }
      }

      const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

      await prisma.customer.update({
        where: { id: payload.customerId },
        data: { passwordHash: newHash }
      })

      return { success: true }
    },
    {
      body: t.Object({
        currentPassword: t.String(),
        newPassword: t.String({ minLength: 8 })
      })
    }
  )
