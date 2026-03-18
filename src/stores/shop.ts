import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  productType: 'physical' | 'digital' | 'vinyl'
  inStock: boolean
  quantity: number
  sku?: string
  weight?: number
  variants?: {
    sizes?: string[]
    colors?: string[]
  }
  bandcampUrl?: string
  downloadMp3?: string
  downloadWav?: string
  streamUrl?: string
  featured: boolean
  tags: string
  hasDiscount: boolean
  discountPercent: number
  related?: Product[]
}

export interface Category {
  slug: string
  name: string
  count: number
}

export interface ProductType {
  slug: string
  name: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProductsResponse {
  products: Product[]
  pagination: Pagination
}

export const useShopStore = defineStore('shop', () => {
  const { apiCall, loading, error } = useApi()

  const products = ref<Product[]>([])
  const featuredProducts = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const categories = ref<Category[]>([])
  const productTypes = ref<ProductType[]>([])

  const pagination = ref<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const filters = ref({
    category: '',
    productType: '',
    minPrice: 0,
    maxPrice: 0,
    search: '',
    sort: 'newest' as 'newest' | 'price_asc' | 'price_desc' | 'name' | 'oldest'
  })

  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  // Computed
  const hasProducts = computed(() => products.value.length > 0)
  const hasFilters = computed(
    () =>
      filters.value.category ||
      filters.value.productType ||
      filters.value.minPrice > 0 ||
      filters.value.maxPrice > 0 ||
      filters.value.search
  )

  // Actions
  async function fetchProducts(page = 1) {
    isLoading.value = true
    loadError.value = null

    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', pagination.value.limit.toString())

      if (filters.value.category) params.set('category', filters.value.category)
      if (filters.value.productType)
        params.set('productType', filters.value.productType)
      if (filters.value.minPrice > 0)
        params.set('minPrice', filters.value.minPrice.toString())
      if (filters.value.maxPrice > 0)
        params.set('maxPrice', filters.value.maxPrice.toString())
      if (filters.value.search) params.set('search', filters.value.search)
      if (filters.value.sort) params.set('sort', filters.value.sort)

      const response = await apiCall<ProductsResponse>(
        `/shop?${params.toString()}`
      )

      if (response && !response.error) {
        products.value = response.products
        pagination.value = response.pagination
      }
    } catch (e) {
      loadError.value = 'Failed to load products'
      console.error('Error fetching products:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProduct(slug: string) {
    isLoading.value = true
    loadError.value = null
    currentProduct.value = null

    try {
      const response = await apiCall<any>(`/shop/${slug}`)

      if (response && !response.error) {
        currentProduct.value = response
      } else {
        loadError.value = 'Product not found'
      }
    } catch (e) {
      loadError.value = 'Failed to load product'
      console.error('Error fetching product:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFeaturedProducts() {
    try {
      const response = await apiCall<Product[]>('/shop/featured')

      if (response && !response.error && Array.isArray(response)) {
        featuredProducts.value = response
      }
    } catch (e) {
      console.error('Error fetching featured products:', e)
    }
  }

  async function fetchCategories() {
    try {
      const response = await apiCall<Category[]>('/shop/categories')

      if (response && !response.error && Array.isArray(response)) {
        categories.value = response
      }
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

  async function fetchProductTypes() {
    try {
      const response = await apiCall<ProductType[]>('/shop/types')

      if (response && !response.error && Array.isArray(response)) {
        productTypes.value = response
      }
    } catch (e) {
      console.error('Error fetching product types:', e)
    }
  }

  function setFilter(key: keyof typeof filters.value, value: any) {
    filters.value[key] = value
    fetchProducts(1)
  }

  function clearFilters() {
    filters.value = {
      category: '',
      productType: '',
      minPrice: 0,
      maxPrice: 0,
      search: '',
      sort: 'newest'
    }
    fetchProducts(1)
  }

  function goToPage(page: number) {
    fetchProducts(page)
  }

  return {
    // State
    products,
    featuredProducts,
    currentProduct,
    categories,
    productTypes,
    pagination,
    filters,
    isLoading,
    loadError,

    // Computed
    hasProducts,
    hasFilters,

    // Actions
    fetchProducts,
    fetchProduct,
    fetchFeaturedProducts,
    fetchCategories,
    fetchProductTypes,
    setFilter,
    clearFilters,
    goToPage
  }
})
