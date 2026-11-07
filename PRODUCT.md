# Bosque Records

## Purpose
Bosque Records is an underground psychedelic / forest psytrance label. The public website presents the verified Bandcamp catalog, the approved artist roster, dated events from official Instagram posts, and ways to listen or contact the label.

## Primary users
Listeners and dancers discovering the label’s releases, artists, and gatherings. Bookers looking for verified contact paths.

## Jobs
- Browse and open real releases with Bandcamp as the purchase and playback destination.
- Explore approved artists and move from an artist to their releases.
- Review dated past events with pictures from public Instagram posts.
- Contact or book the label without inventing merch, fake events, or biographies.

## Positioning
A sanctuary of resonant frequencies unfolding psychedelia. Conjured by Foe'Xan in South India and now blooming in the United States. Dark forest, underground, atmospheric — not a mainstream dance-label storefront.

## Product facts that must stay true
- Catalog source of truth is Bandcamp (bosquerecords.bandcamp.com). Do not invent releases, tracklists, prices, or credits.
- Bandcamp owns purchase and playback. No fake play/pause, no autoplay.
- Do not invent biographies, event dates, or merch. Events and artist facts come from verified public posts.
- Official links: bosquerecords.com, Bandcamp, Instagram @bosque.records, SoundCloud bosque-productions, Linktree, email bosquerecords43@gmail.com.
- Brainwavez and IxMuk are two projects by one person.
- Live frontend is React + Vite (not Vue). Stack must stay React unless the user changes it.

## Stack
- Frontend: React 19 + Vite + TypeScript + react-router-dom
- Local preview: Docker nginx on port 8088
- Optional API: Bun/Elysia + Prisma SQLite (not required for the public static experience)

## Accessibility
- Prefer reduced-motion support for nonessential animation.
- Keep navigation usable without motion.
- Content must remain readable over atmospheric backgrounds.

## Open decisions
- Newsletter is not configured; do not invent a working signup.
- Equinox / guest festival appearances are not Bosque-owned events unless the label posts them as such.
