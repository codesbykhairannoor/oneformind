---
description: Critical architecture rules for OneForMind - Monorepo (Next.js + Golang) and deployment constraints on Coolify.
---
# OneForMind Architecture & Deployment Rules

1. **Architecture Separation**: 
   - The frontend is **Next.js** (which strictly requires Node.js). It was NEVER moved to Go.
   - The backend API is **Golang**.
   - Both reside in the same repository (Monorepo).

2. **Coolify Deployment Invariants**:
   - The Next.js frontend MUST ALWAYS be deployed using `web.Dockerfile` as the Build Strategy.
   - **NEVER** switch the Coolify Build Pack/Strategy to Nixpacks. Nixpacks auto-detects the `go.mod` file in the root and mistakenly builds the Go backend instead of the Node frontend, causing fatal 404 errors.
   - The longer build time (6-10 minutes) for `web.Dockerfile` is an acceptable tradeoff for deployment stability. Do not attempt to "optimize" it by switching to Nixpacks.
