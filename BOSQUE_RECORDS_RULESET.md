# Bosque Records Website Development Ruleset

## Project Overview
**Project Name**: Bosque Records - Dark Forest Psytrance Label Website  
**Tech Stack**: Vue.js 3 (Composition API) + TailwindCSS + Prisma/Elysia Backend  
**Theme**: Mystical, dark forest aesthetic with gold accents  

## 1. Design System & Branding

### Color Palette
```css
/* Primary Colors */
--primary-black: #0a0a0a      /* Deep black background */
--primary-green: #14331e      /* Dark forest green */
--primary-gold: #d4af37       /* Mystical gold accents */

/* Secondary Colors */
--gray-light: #e5e5e5         /* Primary text */
--gray-medium: #a1a1aa        /* Secondary text */
--gray-dark: #374151          /* Muted text */
--green-accent: #2a7a4a       /* Hover states */
--green-border: #065f46       /* Borders */
```

### Typography
- **Primary Font**: 'IM Fell English' (serif) - Body text
- **Title Font**: 'IM Fell English SC' (serif) - Headers and titles
- **Fallback**: serif

### Visual Elements
- **Mystical Symbols**: ✧, ✦, ♥ 
- **Dividers**: Gold/green dual-line with centered symbol
- **Patterns**: Subtle forest-inspired SVG backgrounds
- **Shadows**: Gold glow effects on hover

## 2. Frontend Architecture (Vue.js 3)

### Project Structure
```
src/
├── components/
│   ├── common/
│   │   ├── TheHeader.vue
│   │   ├── TheFooter.vue
│   │   ├── MobileMenu.vue
│   │   ├── MysticalDivider.vue
│   │   └── LoadingSpinner.vue
│   ├── home/
│   │   ├── HeroSection.vue
│   │   ├── LatestReleases.vue
│   │   ├── UpcomingEvents.vue
│   │   └── NewsletterSignup.vue
│   ├── releases/
│   │   ├── ReleaseCard.vue
│   │   ├── ReleaseGrid.vue
│   │   ├── ReleasePlayer.vue
│   │   └── ReleaseFilter.vue
│   ├── artists/
│   │   ├── ArtistCard.vue
│   │   ├── ArtistProfile.vue
│   │   └── ArtistGrid.vue
│   ├── events/
│   │   ├── EventCard.vue
│   │   ├── EventCalendar.vue
│   │   └── EventDetails.vue
│   ├── shop/
│   │   ├── ProductCard.vue
│   │   ├── ShoppingCart.vue
│   │   └── ProductGallery.vue
│   └── visuals/
│       ├── GalleryGrid.vue
│       ├── ImageModal.vue
│       └── ArtworkViewer.vue
├── views/
│   ├── HomeView.vue
│   ├── AboutView.vue
│   ├── ReleasesView.vue
│   ├── RosterView.vue
│   ├── VisualArtsView.vue
│   ├── ShopView.vue
│   ├── BookingsView.vue
│   ├── ContactView.vue
│   └── EventsView.vue
├── composables/
│   ├── useApi.js
│   ├── useAudio.js
│   ├── useCart.js
│   └── useThreeJS.js
├── stores/
│   ├── releases.js
│   ├── artists.js
│   ├── events.js
│   └── cart.js
├── assets/
├── router/
└── main.js
```

### Composition API Standards

#### 1. Composables Pattern
```javascript
// composables/useApi.js
import { ref, reactive } from 'vue'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  
  const apiCall = async (endpoint, options = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) throw new Error(response.statusText)
      return await response.json()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return { loading, error, apiCall }
}
```

#### 2. Component Structure Standard
```vue
<template>
  <!-- Template with proper semantic HTML -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  // Define props with types
})

// Emits
const emit = defineEmits(['event-name'])

// Composables
const router = useRouter()

// Reactive data
const state = reactive({})
const loading = ref(false)

// Computed
const computedValue = computed(() => {})

// Methods
const handleAction = () => {}

// Lifecycle
onMounted(() => {})
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### State Management (Pinia)
```javascript
// stores/releases.js
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useReleasesStore = defineStore('releases', () => {
  const releases = ref([])
  const featured = ref([])
  const loading = ref(false)
  
  const { apiCall } = useApi()
  
  const fetchReleases = async () => {
    try {
      const data = await apiCall('/releases')
      releases.value = data
    } catch (error) {
      console.error('Failed to fetch releases:', error)
    }
  }
  
  const getFeaturedReleases = computed(() => 
    releases.value.filter(release => release.featured)
  )
  
  return {
    releases,
    featured,
    loading,
    fetchReleases,
    getFeaturedReleases
  }
})
```

## 3. Navigation Structure & Routing

### Route Configuration
```javascript
// router/index.js
const routes = [
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
    path: '/releases/:id',
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
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('@/views/EventDetailView.vue'),
    meta: { title: 'Event | Bosque Records' }
  }
]
```

## 4. Backend Architecture (Elysia.js + Prisma)

### Project Structure
```
backend/
├── src/
│   ├── routes/
│   │   ├── releases.ts
│   │   ├── artists.ts
│   │   ├── events.ts
│   │   ├── shop.ts
│   │   ├── bookings.ts
│   │   └── auth.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── cors.ts
│   │   └── validation.ts
│   ├── services/
│   │   ├── emailService.ts
│   │   ├── fileUpload.ts
│   │   └── paymentService.ts
│   ├── types/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── uploads/
└── package.json
```

### Database Schema (Prisma)
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Release {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  releaseDate DateTime
  coverImage  String
  featured    Boolean  @default(false)
  price       Float?
  artistId    String
  artist      Artist   @relation(fields: [artistId], references: [id])
  tracks      Track[]
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("releases")
}

model Artist {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  bio         String?
  avatar      String?
  socialLinks Json?
  releases    Release[]
  events      Event[]   @relation("EventArtists")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@map("artists")
}

model Track {
  id        String  @id @default(cuid())
  title     String
  duration  Int     // in seconds
  audioFile String?
  preview   String? // preview URL
  order     Int
  releaseId String
  release   Release @relation(fields: [releaseId], references: [id], onDelete: Cascade)
  
  @@map("tracks")
}

model Event {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String?
  date        DateTime
  endDate     DateTime?
  location    String
  venue       String?
  image       String?
  ticketUrl   String?
  featured    Boolean   @default(false)
  artists     Artist[]  @relation("EventArtists")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@map("events")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  price       Float
  images      String[]
  category    String
  inStock     Boolean  @default(true)
  quantity    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("products")
}

model Booking {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String?
  eventType   String
  date        DateTime
  message     String?
  status      String   @default("pending") // pending, confirmed, declined
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("bookings")
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  
  @@map("newsletter")
}

model Artwork {
  id          String   @id @default(cuid())
  title       String
  description String?
  imageUrl    String
  artist      String
  category    String
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@map("artworks")
}
```

### API Routes Structure (Elysia.js)
```typescript
// src/routes/releases.ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const releasesRoute = new Elysia({ prefix: '/releases' })
  .get('/', async () => {
    const releases = await prisma.release.findMany({
      include: {
        artist: true,
        tracks: true
      },
      orderBy: { releaseDate: 'desc' }
    })
    return releases
  })
  .get('/featured', async () => {
    const featured = await prisma.release.findMany({
      where: { featured: true },
      include: { artist: true },
      take: 4
    })
    return featured
  })
  .get('/:slug', async ({ params }) => {
    const release = await prisma.release.findUnique({
      where: { slug: params.slug },
      include: {
        artist: true,
        tracks: { orderBy: { order: 'asc' } }
      }
    })
    if (!release) throw new Error('Release not found')
    return release
  }, {
    params: t.Object({
      slug: t.String()
    })
  })
```

## 5. Component Development Standards

### Reusable Component Guidelines

#### 1. ReleaseCard Component
```vue
<template>
  <div class="bg-black bg-opacity-50 border border-green-800 p-4 hover-glow transition duration-300">
    <div class="mb-4 overflow-hidden">
      <img 
        :src="release.coverImage" 
        :alt="release.title"
        class="w-full album-cover"
        loading="lazy"
      />
    </div>
    <h4 class="text-xl title-font mb-2 gold-text">{{ release.title }}</h4>
    <p class="text-gray-400 mb-3">by {{ release.artist.name }}</p>
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-500">{{ formatDate(release.releaseDate) }}</span>
      <button 
        @click="playRelease"
        class="text-xs gold-text border gold-border px-3 py-1 hover:bg-green-900 hover:bg-opacity-30"
      >
        Listen
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  release: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['play'])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(date))
}

const playRelease = () => {
  emit('play', props.release)
}
</script>
```

#### 2. Navigation Component
```vue
<template>
  <header class="bg-black bg-opacity-90 border-b border-green-800 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <div class="text-3xl title-font gold-text mr-2">✧</div>
          <h1 class="text-2xl title-font tracking-wider">
            <span class="text-white">BOSQUE</span>
            <span class="gold-text">RECORDS</span>
          </h1>
        </router-link>
        
        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-gray-300 hover:text-white focus:outline-none"
        >
          <i class="fas fa-bars text-2xl"></i>
        </button>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link 
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link text-gray-300 hover:text-white"
            active-class="text-white"
          >
            {{ item.label }}
          </router-link>
        </nav>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <MobileMenu v-if="showMobileMenu" :items="navItems" @close="toggleMobileMenu" />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import MobileMenu from './MobileMenu.vue'

const showMobileMenu = ref(false)

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/releases', label: 'Releases' },
  { path: '/roster', label: 'Roster' },
  { path: '/visual-arts', label: 'Visual Arts' },
  { path: '/shop', label: 'Shop' },
  { path: '/bookings', label: 'Bookings' },
  { path: '/contact', label: 'Contact' },
  { path: '/events', label: 'Events' }
]

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>
```

## 6. TailwindCSS Configuration

### Custom Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'forest-black': '#0a0a0a',
        'forest-green': '#14331e',
        'mystical-gold': '#d4af37',
        'green-accent': '#2a7a4a',
      },
      fontFamily: {
        'fell': ['"IM Fell English"', 'serif'],
        'fell-sc': ['"IM Fell English SC"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: []
}
```

### Custom CSS Classes
```css
/* src/assets/styles/main.css */
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=IM+Fell+English:ital@0;1&display=swap');

.title-font {
  font-family: 'IM Fell English SC', serif;
}

.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #d4af37;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.hover-glow:hover {
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
}

.mystical-divider {
  border-top: 1px solid #14331e;
  border-bottom: 1px solid #d4af37;
  height: 0;
  margin: 2rem 0;
  position: relative;
}

.mystical-divider::before {
  content: '✧';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #0a0a0a;
  padding: 0 10px;
  color: #d4af37;
  font-size: 1.2rem;
}
```

## 7. Performance & Optimization Rules

### 1. Lazy Loading
- Implement route-based code splitting
- Lazy load images with `loading="lazy"`
- Use dynamic imports for heavy components

### 2. SEO Optimization
- Meta tags for each route
- Structured data for releases and events
- Open Graph tags for social sharing

### 3. Audio Handling
- Implement audio streaming for track previews
- Progressive loading for full tracks
- Audio visualization components

### 4. Image Optimization
- WebP format with fallbacks
- Responsive images with multiple sizes
- CDN integration for media assets

## 8. Development Workflow

### Git Workflow
```
main
├── develop
├── feature/component-name
├── feature/page-name
└── hotfix/issue-description
```

### Commit Convention
```
feat: add release player component
fix: resolve mobile menu toggle issue
style: update gold color consistency
docs: add component documentation
refactor: optimize API calls
test: add unit tests for releases store
```

### Code Quality Standards
- ESLint + Prettier configuration
- Vue 3 composition API best practices
- TypeScript for backend (optional for frontend)
- Unit tests with Vitest
- E2E tests with Playwright

## 9. Content Management

### Page-Specific Requirements

#### Home Page
- Hero section with Three.js background
- Featured releases grid (4 items)
- Upcoming events timeline (3 items)
- Newsletter signup
- About section preview

#### Releases Page
- Filterable grid of all releases
- Search functionality
- Pagination
- Release detail modal/page
- Audio player integration

#### Roster Page
- Artist grid with profile images
- Artist detail pages
- Social media links
- Discography per artist

#### Visual Arts Page
- Gallery grid with lightbox
- Artist credits
- High-resolution image viewing
- Category filtering

#### Shop Page
- Product grid with cart functionality
- Product detail pages
- Shopping cart and checkout
- Inventory management

#### Events Page
- Event calendar view
- Event detail pages
- Ticket integration
- Location maps

#### Bookings Page
- Contact form for bookings
- Event type selection
- Calendar integration
- Email notifications

#### Contact Page
- Contact form
- Social media links
- Label information
- Location/office details

## 10. Security & Authentication

### API Security
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### File Upload Security
- File type validation
- Size limits
- Malware scanning
- Secure storage

### Data Protection
- GDPR compliance for newsletter
- Data encryption
- Backup strategies
- Privacy policy integration

This ruleset provides a comprehensive foundation for building the Bosque Records website with modern best practices and the mystical dark forest aesthetic. 