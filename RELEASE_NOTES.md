# Release Notes: v1.2.0-certified

**Release Tag:** `v1.2.0-certified`  
**Quality Certification:** Verified Releasable by Master SDET Quality Net  
**Date:** October 2026  

---

## 🚀 What This Version Delivers

### 1. Habits Engine Hardening & Hall of Fame Luxury Redesign
* **Rest (☕) & Skipped (⏸️) Status Protection:** Protected habit logs from accidental deletion when clicking cell matrices. Interactions now safely route to notes modal.
* **Luxury Obsidian Hall of Fame:** Overhauled Hall of Fame modal with dark glass HUD, eliminating blinding white boxes in dark mode and adding dynamic prestige tier badges (Diamond, Gold, Silver, Bronze).

### 2. Multi-Tenant Adversarial Security & RLS Isolation
* **Edge JWT Claim Enforcement:** Hardened 15 core API routes with `getAuthToken(req)` and explicit `token?.sub` verification.
* **Cryptographic Token Propagation:** Integrated `proxyToGo` token forwarding to ensure strict multi-tenant row-level security.

### 3. Concurrency, Race Condition & Idempotency Hardening
* **Habit Check-In Burst Guard:** Handled rapid double-clicking and network retries gracefully using atomic upsert semantics without duplicate record creation.
* **Financial Ledger Idempotency:** Implemented idempotency key checks to eliminate double-spending risks.

### 4. Zero-Flicker Instant Internationalization
* **In-Memory Locale Switching:** Upgraded `InstantIntlProvider` with `window.history.replaceState`, eliminating full-page RSC layout reload flicker when switching languages.

### 5. Automated SDET Quality Net & Release Gates
* **Gate 2 (Definition of Ready):** Added `.github/pull_request_template.md` enforcing Gherkin acceptance criteria (Given/When/Then) before code merges.
* **Gate 3 (Master Quality Net):** Added `npm run test:qa` running 7 test suites across security, concurrency, math invariants, and live schemas.
* **Formal Deliverables:** Added `/assessment` suite containing `01-audit.md`, `02-quality-system.md`, `03-release-decision.md`, and `traceability-matrix.md`.
