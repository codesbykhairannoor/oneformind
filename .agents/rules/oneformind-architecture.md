---
description: Critical architecture rules for OneForMind - Monorepo (Next.js + Golang) and deployment constraints on Coolify.
---
# OneForMind Architecture & Deployment Rules

1. **Architecture Separation**: 
   - The frontend is **Next.js** (which strictly requires Node.js). It was NEVER moved to Go.
   - The backend API is **Golang**.
   - Both reside in the same repository (Monorepo).

2. **Coolify Deployment Invariants**:
   - The application MUST ALWAYS be deployed using **Docker Compose** (`docker-compose.yml`) as the Build Strategy.
   - This ensures both the Next.js frontend (`web`) and the Golang backend (`api`) are spun up together.
   - **NEVER** use `web.Dockerfile` as a standalone build strategy in Coolify, as it will leave the Go backend offline.
   - **NEVER** switch the Coolify Build Pack to Nixpacks, as Nixpacks auto-detects `go.mod` and breaks the frontend build.
