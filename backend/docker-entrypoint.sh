#!/bin/sh
set -eu
mkdir -p /data /app/uploads
export DATABASE_URL="${DATABASE_URL:-file:/data/bosque.db}"
bunx prisma db push --skip-generate
exec bun run src/index.ts
