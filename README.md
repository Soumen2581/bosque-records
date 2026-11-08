# Bosque Records

Underground psychedelic / forest psytrance label site.

Authoritative product facts live in [`PRODUCT.md`](./PRODUCT.md).

## Stack

- **Frontend:** React 19 + Vite + TypeScript + React Router
- **Motion:** CSS transitions, IntersectionObserver reveals, View Transitions API
- **Atmosphere:** custom WebGL living background (`LivingBackground.tsx`)
- **Local web:** Docker nginx on **http://127.0.0.1:8088**
- **Optional API:** Bun + Elysia + Prisma SQLite on port **8089** (compose service `api`)

Older Vue / PostgreSQL notes in some docs are obsolete. Prefer this README and `PRODUCT.md`.

## Quick start (Docker)

```bash
docker compose up --build -d web
```

Open http://127.0.0.1:8088

Optional API:

```bash
docker compose up --build -d api
```

## Local frontend (without Docker)

Use **Node 20** (see `.nvmrc`). Node 22+ / 26 currently hangs `typescript-eslint` and `tsc` in this repo on some macOS hosts.

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"   # if needed
npm install --legacy-peer-deps
npm run ci                                          # lint + typecheck + test + build
npm run dev                                         # http://127.0.0.1:8088
# or serve the production build:
npm run build && npm run serve:dist
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite on 127.0.0.1:8088 |
| `npm run build` | Production build |
| `npm run serve:dist` | Static SPA serve of `dist/` on 8088 |
| `npm run type-check` | TypeScript |
| `npm run lint` | ESLint (React app sources) |
| `npm test` | Vitest unit tests |
| `npm run audit:prod` | Production dependency audit |
| `npm run ci` | lint + type-check + test + build |

Backend:

```bash
cd backend
bun install
bun run db:generate
bun run db:push
bun test
```

## Content rules

- Catalog source of truth: Bandcamp
- No invented bios, tracklists, prices, merch, or events
- Bandcamp owns playback and purchase (no fake players / autoplay)
- Brainwavez and IxMuk are two projects by one person

## Official links

- https://bosquerecords.com/
- https://bosquerecords.bandcamp.com/
- https://www.instagram.com/bosque.records/
- https://soundcloud.com/bosque-productions
- https://linktr.ee/bosqueproductions
