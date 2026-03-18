import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ref } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Bosque Records | Dark Forest Psytrance' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About | Bosque Records' }
  },
  {
    path: '/releases',
    name: 'Releases',
    component: () => import('@/views/ReleasesView.vue'),
    meta: { title: 'Releases | Bosque Records' }
  },
  {
    path: '/releases/:slug',
    name: 'ReleaseDetail',
    component: () => import('@/views/ReleaseDetailView.vue'),
    meta: { title: 'Release | Bosque Records' }
  },
  {
    path: '/roster',
    name: 'Roster',
    component: () => import('@/views/RosterView.vue'),
    meta: { title: 'Artists | Bosque Records' }
  },
  {
    path: '/roster/:slug',
    name: 'ArtistProfile',
    component: () => import('@/views/ArtistProfileView.vue'),
    meta: { title: 'Artist | Bosque Records' }
  },
  {
    path: '/visual-arts',
    name: 'VisualArts',
    component: () => import('@/views/VisualArtsView.vue'),
    meta: { title: 'Visual Arts | Bosque Records' }
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Shop | Bosque Records' }
  },
  {
    path: '/shop/:slug',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Product | Bosque Records' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Cart | Bosque Records' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Checkout | Bosque Records' }
  },
  {
    path: '/checkout/success',
    name: 'OrderSuccess',
    component: () => import('@/views/OrderSuccessView.vue'),
    meta: { title: 'Order Confirmed | Bosque Records' }
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/AccountView.vue'),
    meta: { title: 'My Account | Bosque Records' }
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import('@/views/BookingsView.vue'),
    meta: { title: 'Bookings | Bosque Records' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contact | Bosque Records' }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('@/views/EventsView.vue'),
    meta: { title: 'Events | Bosque Records' }
  },
  {
    path: '/events/:slug',
    name: 'EventDetail',
    component: () => import('@/views/EventDetailView.vue'),
    meta: { title: 'Event | Bosque Records' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { title: 'Admin | Bosque Records' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 | Bosque Records' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Global loading state for route navigation
export const isNavigating = ref(false)

// Global navigation guard for meta titles and loading state
router.beforeEach((to, from, next) => {
  document.title = (to.meta?.title as string) || 'Bosque Records'
  // Only show loader for actual route changes (not initial load)
  if (from.name) {
    isNavigating.value = true
  }
  next()
})

router.afterEach(() => {
  // Small delay to allow page render, then hide loader
  setTimeout(() => {
    isNavigating.value = false
  }, 200)
})

router.onError(() => {
  isNavigating.value = false
})

// Export router for use in components
export { router }

export default router 