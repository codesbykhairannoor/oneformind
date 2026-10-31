---
title: Tranvas API
emoji: ⚡
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# Tranvas Cognitive Life OS — REST API Backend

High-performance Go Chi REST API backend powering [tranvas.com](https://tranvas.com).

## Runtime Details
- **Architecture**: Go Chi Router with in-memory response caching
- **Port**: 7860 (Hugging Face default)
- **Database**: Supabase PostgreSQL (via pgx pool)
- **Healthcheck**: `GET /health`

