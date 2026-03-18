# Bosque Recordings - Bun Backend
FROM oven/bun:1-debian

WORKDIR /app

# Install OpenSSL for Prisma compatibility
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    ca-certificates \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy prisma schema first (for generation)
COPY prisma ./prisma/

# Generate Prisma client
RUN bunx prisma generate

# Copy rest of source code
COPY . .

# Create uploads directory and initialize database
RUN mkdir -p uploads

# Initialize the database
RUN bunx prisma db push

# Expose port 3001
EXPOSE 3001

# Health check (using wget to get the response)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:3001/ || exit 1

# Start the server
CMD ["bun", "run", "start"]
