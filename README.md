# 🌿 Bosque Records

> Dark Forest Psytrance Label & Network

A mystical digital sanctuary for the dark forest psytrance community. Discover artists, releases, events, and visual arts from the underground.

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.x-%23fbf0df.svg)](https://bun.sh/)

## ✨ Features

### Frontend (Vue 3 + Vite)
- **Vue 3** with Composition API and TypeScript
- **Vite** for lightning-fast development and builds
- **Tailwind CSS** with custom forest/mystical theme
- **Three.js** animated fractal background
- **Pinia** for state management
- **Vue Router** for SPA navigation
- **HTTP Basic Auth** protection
- **PWA-ready** with web manifest

### Backend (Bun + Prisma)
- **Bun** runtime for blazing-fast performance
- **Prisma ORM** with SQLite database
- **RESTful API** for all content management
- **File uploads** support for media assets

### Accessibility & SEO
- 🌙 Dark mode default (light mode available)
- ♿ WCAG 2.1 compliant
- 📱 Responsive design (mobile, tablet, desktop)
- 🔍 Schema.org structured data
- 🕷️ SEO optimized meta tags
- 📋 Open Graph & Twitter Cards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Bun 1.0+ (for backend)
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)

```bash
# Start the full stack
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### Option 2: Local Development

#### Backend
```bash
cd backend

# Install dependencies
bun install

# Setup database
bun run db:generate
bun run db:push
bun run db:seed  # Optional: seed with sample data

# Start development server
bun run dev
```

#### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build frontend
npm run build

# Build backend
cd backend && bun run build
```

## 📁 Project Structure

```
bosque-recordings/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Vue components
│   │   ├── admin/       # Admin-specific components
│   │   ├── common/      # Shared components
│   │   ├── home/        # Home page components
│   │   └── releases/     # Release components
│   ├── composables/      # Vue composables
│   ├── router/           # Vue Router config
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript types
│   ├── views/            # Page views
│   └── App.vue           # Root component
├── backend/
│   ├── prisma/           # Database schema
│   ├── src/              # Backend source
│   └── uploads/          # User uploads
├── public/               # Static public assets
├── index.html            # Entry HTML
└── package.json
```

## 🌐 API Endpoints

### Public API (Read-only)
| Endpoint | Description |
|----------|-------------|
| `GET /api/releases` | All releases |
| `GET /api/artists` | All artists |
| `GET /api/events` | All events |
| `GET /api/shop` | All products |
| `GET /api/artworks` | All artworks |

### Admin API (Full CRUD)
| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/admin/artists` | GET, POST, PUT, DELETE | Artist management |
| `/api/admin/releases` | GET, POST, PUT, DELETE | Release management |
| `/api/admin/tracks` | GET, POST, PUT, DELETE | Track management |
| `/api/admin/events` | GET, POST, PUT, DELETE | Event management |
| `/api/admin/products` | GET, POST, PUT, DELETE | Product management |
| `/api/admin/artworks` | GET, POST, PUT, DELETE | Artwork management |
| `/api/admin/stats` | GET | Dashboard statistics |

### Admin Access
Navigate to `/admin` and authenticate with HTTP Basic Auth credentials.

## 📱 PWA Installation

This app is PWA-ready. To install on mobile:

1. **iOS**: Tap Share → "Add to Home Screen"
2. **Android**: Tap "Install" prompt or browser menu → "Add to Home Screen"

Features:
- Offline support
- Auto-updates
- Native app-like experience

## 🎨 Theme & Accessibility

### Theme Modes
- 🌙 **Dark Mode** (default) - Mystical forest theme
- ☀️ **Light Mode** - Clean, accessible light theme
- 📴 **Low-Resolution Mode** - Reduced motion & lower data usage

Toggle theme using the sun/moon icon in the header.

### Accessibility Features
- Keyboard navigation
- Screen reader support
- Reduced motion support
- High contrast mode
- Focus indicators

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start frontend dev server
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Backend
cd backend
bun run dev          # Start backend dev server
bun run db:generate  # Generate Prisma client
bun run db:push      # Push schema to database
bun run db:seed      # Seed database
bun run db:studio    # Open Prisma Studio
```

### Environment Variables

Create `.env` files as needed:

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL="file:./prisma/dev.db"
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build images
docker build -t bosque-frontend ./frontend
docker build -t bosque-backend ./backend

# Run containers
docker-compose up -d
```

### Manual Deployment

1. Build the project: `npm run build && cd backend && bun run build`
2. Configure web server (nginx recommended)
3. Set up HTTPS (required for PWA)
4. Point domain to server

## 🔒 Security

- HTTP Basic Auth for admin routes
- Environment variables for secrets
- No sensitive data in client-side code
- CORS configured for API endpoints

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Artists & Labels** - For the endless inspiration
- **Open Source Community** - For Vue, Vite, Tailwind, and all the tools that make this possible
- **The Forest** - For being our muse

---

🌿 **Bosque Records** - Where mystical forest sounds meet modern technology
