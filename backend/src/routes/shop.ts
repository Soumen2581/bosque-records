import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function parseImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return [imagesJson]
  }
}

export const shopRoute = new Elysia({ prefix: '/api/v1/shop' })

  // Get products with pagination and filtering
  .get(
    '/',
    async ({ query }) => {
      const {
        page = '1',
        limit = '20',
        category,
        productType,
        minPrice,
        maxPrice,
        search,
        sort = 'newest',
        featured
      } = query as Record<string, string>

      const pageNum = parseInt(page) || 1
      const limitNum = Math.min(parseInt(limit) || 20, 100)
      const skip = (pageNum - 1) * limitNum

      const where: any = {}

      // Filter by category
      if (category) {
        where.category = category
      }

      // Filter by product type
      if (productType) {
        where.productType = productType
      }

      // Filter by price range
      if (minPrice || maxPrice) {
        where.price = {}
        if (minPrice) where.price.gte = parseFloat(minPrice)
        if (maxPrice) where.price.lte = parseFloat(maxPrice)
      }

      // Search
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
          { tags: { contains: search } }
        ]
      }

      // Featured filter
      if (featured === 'true') {
        where.featured = true
      }

      // Only show in-stock products by default
      where.inStock = true

      // Sorting
      let orderBy: any = { createdAt: 'desc' }
      switch (sort) {
        case 'price_asc':
          orderBy = { price: 'asc' }
          break
        case 'price_desc':
          orderBy = { price: 'desc' }
          break
        case 'name':
          orderBy = { name: 'asc' }
          break
        case 'oldest':
          orderBy = { createdAt: 'asc' }
          break
      }

      try {
        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limitNum
          }),
          prisma.product.count({ where })
        ])

        return {
          products: products.map((p) => ({
            ...p,
            images: parseImages(p.images),
            hasDiscount: p.salePrice !== null && p.salePrice < p.price,
            discountPercent: p.salePrice
              ? Math.round((1 - p.salePrice / p.price) * 100)
              : 0
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        return { error: 'Failed to fetch products' }
      }
    }
  )

  // Get featured products
  .get('/featured', async () => {
    try {
      const products = await prisma.product.findMany({
        where: {
          featured: true,
          inStock: true
        },
        orderBy: { createdAt: 'desc' },
        take: 8
      })

      return products.map((p) => ({
        ...p,
        images: parseImages(p.images),
        hasDiscount: p.salePrice !== null && p.salePrice < p.price,
        discountPercent: p.salePrice
          ? Math.round((1 - p.salePrice / p.price) * 100)
          : 0
      }))
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  })

  // Get products by category
  .get('/category/:category', async ({ params, query }) => {
    const { page = '1', limit = '20', sort = 'newest' } = query as Record<
      string,
      string
    >
    const pageNum = parseInt(page) || 1
    const limitNum = Math.min(parseInt(limit) || 20, 100)
    const skip = (pageNum - 1) * limitNum

    let orderBy: any = { createdAt: 'desc' }
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
    }

    try {
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: {
            category: params.category,
            inStock: true
          },
          orderBy,
          skip,
          take: limitNum
        }),
        prisma.product.count({
          where: { category: params.category, inStock: true }
        })
      ])

      return {
        products: products.map((p) => ({
          ...p,
          images: parseImages(p.images),
          hasDiscount: p.salePrice !== null && p.salePrice < p.price,
          discountPercent: p.salePrice
            ? Math.round((1 - p.salePrice / p.price) * 100)
            : 0
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    } catch (error) {
      console.error('Error fetching category products:', error)
      return { error: 'Failed to fetch products' }
    }
  })

  // Get all categories
  .get('/categories', async () => {
    try {
      const categories = await prisma.product.findMany({
        where: { inStock: true },
        select: {
          category: true,
          productType: true
        },
        distinct: ['category']
      })

      // Count products per category
      const categoryCounts = await prisma.product.groupBy({
        by: ['category'],
        where: { inStock: true },
        _count: true
      })

      const countMap = categoryCounts.reduce(
        (acc, c) => ({ ...acc, [c.category]: c._count }),
        {} as Record<string, number>
      )

      return categories.map((c) => ({
        slug: c.category.toLowerCase().replace(/\s+/g, '-'),
        name: c.category,
        count: countMap[c.category] || 0
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  })

  // Get product by slug
  .get(
    '/:slug',
    async ({ params }) => {
      try {
        const product = await prisma.product.findUnique({
          where: { slug: params.slug }
        })

        if (!product) {
          return { error: 'Product not found' }
        }

        // Get related products (same category, excluding current)
        const related = await prisma.product.findMany({
          where: {
            category: product.category,
            id: { not: product.id },
            inStock: true
          },
          take: 4,
          orderBy: { createdAt: 'desc' }
        })

        return {
          ...product,
          images: parseImages(product.images),
          variants: product.variants ? JSON.parse(product.variants) : null,
          hasDiscount: product.salePrice !== null && product.salePrice < product.price,
          discountPercent: product.salePrice
            ? Math.round((1 - product.salePrice / product.price) * 100)
            : 0,
          related: related.map((p) => ({
            ...p,
            images: parseImages(p.images)
          }))
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        return { error: 'Failed to fetch product' }
      }
    },
    {
      params: t.Object({
        slug: t.String()
      })
    }
  )

  // Get product types
  .get('/types', async () => {
    try {
      const types = await prisma.product.findMany({
        where: { inStock: true },
        select: {
          productType: true
        },
        distinct: ['productType']
      })

      return types.map((t) => ({
        slug: t.productType.toLowerCase(),
        name:
          t.productType === 'vinyl'
            ? 'Vinyl Records'
            : t.productType === 'digital'
              ? 'Digital Downloads'
              : 'Merchandise'
      }))
    } catch (error) {
      console.error('Error fetching product types:', error)
      return []
    }
  })

  // Admin: Create product
  .post(
    '/',
    async ({ body }) => {
      try {
        const product = await prisma.product.create({
          data: body as any
        })
        return {
          ...product,
          images: parseImages(product.images)
        }
      } catch (error) {
        console.error('Error creating product:', error)
        return { error: 'Failed to create product' }
      }
    },
    {
      body: t.Object({
        name: t.String(),
        slug: t.String(),
        description: t.Optional(t.String()),
        price: t.Number(),
        salePrice: t.Optional(t.Number()),
        images: t.String(),
        category: t.String(),
        productType: t.Optional(t.String()),
        inStock: t.Optional(t.Boolean()),
        quantity: t.Optional(t.Number()),
        sku: t.Optional(t.String()),
        weight: t.Optional(t.Number()),
        dimensions: t.Optional(t.String()),
        variants: t.Optional(t.String()),
        bandcampUrl: t.Optional(t.String()),
        downloadMp3: t.Optional(t.String()),
        downloadWav: t.Optional(t.String()),
        streamUrl: t.Optional(t.String()),
        featured: t.Optional(t.Boolean()),
        tags: t.Optional(t.String())
      })
    }
  )

  // Admin: Update product
  .put(
    '/:id',
    async ({ params, body }) => {
      try {
        const product = await prisma.product.update({
          where: { id: params.id },
          data: body as any
        })
        return {
          ...product,
          images: parseImages(product.images)
        }
      } catch (error) {
        console.error('Error updating product:', error)
        return { error: 'Failed to update product' }
      }
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  )

  // Admin: Delete product
  .delete(
    '/:id',
    async ({ params }) => {
      try {
        await prisma.product.delete({
          where: { id: params.id }
        })
        return { success: true }
      } catch (error) {
        console.error('Error deleting product:', error)
        return { error: 'Failed to delete product' }
      }
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  )
