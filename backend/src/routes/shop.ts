import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const shopRoute = new Elysia({ prefix: '/shop' })
  .get('/', async () => {
    try {
      const products = await prisma.product.findMany({
        where: { inStock: true },
        orderBy: { createdAt: 'desc' }
      })
      return products
    } catch (error) {
      console.error('Error fetching products:', error)
      return { error: 'Failed to fetch products' }
    }
  })
  .get('/categories', async () => {
    try {
      const categories = await prisma.product.findMany({
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
  .get('/:slug', async ({ params }) => {
    try {
      const product = await prisma.product.findUnique({
        where: { slug: params.slug }
      })
      if (!product) {
        return { error: 'Product not found', status: 404 }
      }
      return product
    } catch (error) {
      console.error('Error fetching product:', error)
      return { error: 'Failed to fetch product' }
    }
  }, {
    params: t.Object({
      slug: t.String()
    })
  })
  .post('/', async ({ body }) => {
    try {
      const product = await prisma.product.create({
        data: body as any
      })
      return product
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
      images: t.String(),
      category: t.String(),
      quantity: t.Optional(t.Number())
    })
  }) 