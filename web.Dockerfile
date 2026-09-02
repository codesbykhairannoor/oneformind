# Dockerfile.next
# Using node:22-slim (Debian) instead of Alpine for maximum Prisma compatibility
# Alpine uses musl libc which can cause binary incompatibility with Prisma engine
FROM node:22-slim AS builder

WORKDIR /app

# Install openssl (required by Prisma on Debian slim)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy dependency files first (layer caching)
COPY package.json package-lock.json* ./

# Copy prisma schema so postinstall can generate client
COPY prisma ./prisma/

# Install all dependencies (runs postinstall = prisma generate automatically)
RUN npm ci

# Copy the rest of source code
COPY . .

# Next.js telemetry is disabled
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# --- Production runner ---
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
