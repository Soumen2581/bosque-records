# Bosque Records — Release Readiness (2026-11-08)

Local engineering QA against the working tree on branch `main` (uncommitted media/atmosphere work preserved).

## Architecture (source of truth)

- Public site: React 19 + Vite + TypeScript + React Router + custom CSS + React Bits + Dark Veil WebGL.
- Catalog: static Bandcamp-derived JSON + portraits/events assets (no invented content).
- Optional API: Bun/Elysia/Prisma SQLite (`compose` service `api`, host port 8089).
- Production static host: multi-stage Dockerfile → nginx (`8088:80`).

## Executed results

| Gate | Result | Evidence |
| --- | --- | --- |
| Lint | **PASSED** | `npm run lint` exit 0 (Node 20) |
| Typecheck | **PASSED** | `tsc --noEmit` exit 0 (Node 20) |
| Unit tests | **PASSED** | Vitest **17/17** across catalog, motion, atmosphere, events |
| Production build | **PASSED** | `vite build` (~536 kB JS gzip 187 kB) |
| `npm run ci` | **PASSED** | lint + typecheck + test + build |
| HTTP SPA routes | **PASSED** | `/`, releases, artists, discover, events, about, contact, 404 → 200 via SPA fallback |
| Browser smoke | **PASSED** | Homepage renders hero, explorers, gatherings, Bandcamp CTAs |
| Backend `bun test` | **BLOCKED** | Hang after Prisma generate / during test run (known Elysia suite fragility) |
| Docker compose | **BLOCKED** | Docker CLI present; daemon socket unavailable (`docker.sock` missing) |
| Playwright E2E | **NOT APPLICABLE / deferred** | Not installed this pass; HTTP + browser smoke used instead |
| Lighthouse | **NOT RUN** | Daemon/browser automation incomplete for lab scores |
| npm audit | **FAILED (known)** | 18 vulns (2 critical / 6 high), mostly Vite/Vitest/Rollup toolchain — not shipped in nginx static HTML |

## Defects fixed this pass

1. `Explorers` carousel size used `depth` in state but `spread` in props → TypeScript break; renamed to `spread`.
2. `LivingBackground` lint cascade (`setState` in effect) → `useSyncExternalStore` mount + lazy WebGL detect.
3. `ScrollReveal` TS2590 complex union on polymorphic `Tag` → `React.createElement`.
4. Tooling: documented/enforced **Node 20** (`.nvmrc`, `engines`); Node 26 hangs `typescript-eslint` / `tsc` locally.
5. Tests: atmosphere store, events/portraits integrity, Bandcamp URL invariants.

## Remaining risks

- Main JS chunk >500 kB (Dark Veil + GSAP bits); needs route-level code splitting.
- React Bits files still trip strict React 19 hook lint if linted wholesale (override scoped for ports).
- Optional API not validated end-to-end while Docker daemon is down / bun tests hang.
- Production Render deploy not re-validated from this machine.

## Production readiness assessment

**Conditional go for static frontend** after Node-20 CI green and Docker daemon validation.

**Not a full controlled release** until: Docker compose health passes, backend suite is unblocked or quarantined with a documented skip, Playwright journey suite lands, and high/critical audit items are triaged for the static deploy path.
