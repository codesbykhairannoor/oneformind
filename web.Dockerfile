# Dockerfile.next
# Clean build: No Prisma, no postinstall scripts, just Next.js + Supabase
FROM public.ecr.aws/docker/library/node:22-slim AS builder

WORKDIR /app

# Install openssl (required by some packages on Debian slim)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy dependency files first (layer caching)
COPY package.json package-lock.json* ./

# Install dependencies — no postinstall scripts, clean and fast
RUN npm ci

# Copy source code
COPY . .

# Next.js telemetry is disabled
ENV NEXT_TELEMETRY_DISABLED=1

# Pass build-time environment arguments needed by Next.js
ARG NEXT_PUBLIC_SUPABASE_URL=https://esahuobozjxkyjvpxslu.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWh1b2Jvemp4a3lqdnB4c2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDk3NzMsImV4cCI6MjA4NDQ4NTc3M30.V6ZBvGe00D7HsduaxstN8bquN8-Snnl61LbwPVSi3ks
ARG NEXT_PUBLIC_API_URL=http://api:8080/api
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application
RUN npm run build

# --- Production runner ---
FROM public.ecr.aws/docker/library/node:22-slim AS runner

WORKDIR /app

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
