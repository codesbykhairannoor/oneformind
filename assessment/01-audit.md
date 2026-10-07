# Platform Quality Audit & Severity-Ranked Risk Register

**System Under Evaluation:** OneForMind Fullstack Productivity Platform (8 Core Modules)  
**Evaluation Role:** Fullstack Engineer (SDET Depth)  
**Standard:** SDET Case Study Quality Bar (Severity Taxonomy P0-P3, Seam Defects, Systemic Root Causes)  
**Date:** October 2026  
**Status:** Audit Completed & Remediated  

---

## Executive Summary (5-Minute Briefing)

OneForMind is an integrated SaaS platform comprising 8 productivity modules: **Planner, Habits, Finance, Goals, Journal, Jobs, Study, and Calendar**. The web layer is built on **Next.js 16 (Turbopack, React 19)**, communicating via edge API routes to an authenticated backend and a live PostgreSQL/Supabase database.

### The Real Risk
Prior to quality hardening, the platform exhibited three systemic vulnerability patterns:
1. **The Seam Mirage (UI vs DB Desynchronization):** The client UI frequently allowed local optimistic interactions (such as left-clicking to clear habit statuses or toggling goal milestones) without verifying whether the underlying database transaction succeeded or was idempotent.
2. **Ghost Specs & Missing Input Preconditions:** Several edge cases (e.g. habit rest days vs skip days, currency precision calculations, and multi-tenant authorization boundaries) lacked explicit Gherkin acceptance criteria, leading to ad-hoc implementation assumptions.
3. **Multi-Tenant Exposure Risk:** When querying relational endpoints with foreign IDs, insufficient parameter validation could expose resources to Insecure Direct Object Reference (IDOR) attacks if not strictly bounded by JWT claim verification.

---

## The Ship / Do-Not-Ship Line

| Release Status | Condition | Current State |
| :--- | :--- | :--- |
| **DO NOT SHIP (BLOCKED)** | Any open P0 (Blocker) or P1 (Major Data-Integrity) defects. | **0 Open P0 / 0 Open P1** |
| **SAFE TO SHIP (GREEN)** | 100% of P0 & P1 remediated, automated regression test net passing, and zero data corruption across 8 modules. | **CLEARED FOR SHIPMENT** |

---

## Severity-Ranked Risk Register

### P0 (Blocker) Risks
*Definition: The objective cannot be achieved at all; no workaround. The main function is broken.*

#### [P0-1] Unauthenticated Edge API Exposure & JWT Claim Bypass
* **Classification:** Built Wrong (Security Invariant)
* **One-Line Impact:** Unauthenticated malicious actors could trigger proxy requests without a valid session token, causing server exceptions or unauthorized access.
* **Repro Steps / Evidence:**
  1. Send direct `GET /api/habits` or `POST /api/finance/transactions` without an `sb-access-token` cookie or Bearer header.
  2. If the API route lacked edge token verification, the request would attempt unauthenticated proxying to Go/DB.
* **Remediation & Current Status:** **FIXED.** Enforced edge authentication via `getAuthToken(req)`. Every API route strictly verifies `token?.sub` and returns `401 Unauthorized` before processing. Automated guard: `scripts/qa/adversarial-rls-guard.mjs`.

---

### P1 (Major) Risks
*Definition: It looks like it works, but the data or logic underneath is wrong; or data-integrity issue.*

#### [P1-1] Habit State Desynchronization on Rest (☕) and Skipped (⏸️) Statuses
* **Classification:** Built Wrong (Seam Bug: Client UI vs Database Persistence)
* **One-Line Impact:** Users clicking a cell with a planned Rest day or Skipped note had their log wiped out to empty status, losing their vacation records and streak protection silently.
* **Repro Steps / Evidence:**
  1. Mark a habit as "Rest" via context menu.
  2. Left-click the cell in `HabitMatrixTable.tsx`.
  3. UI immediately toggled from `rest` -> `empty`, silently deleting the row in PostgreSQL without user consent.
* **Remediation & Current Status:** **FIXED.** Added guards in `useHabitActions.ts` and `HabitMatrixTable.tsx` preventing toggle-to-empty when `currentStatus` is `'rest'` or `'skipped'`. Left-clicking now safely opens `HabitNoteModal` instead of deleting the entry.

#### [P1-2] Floating-Point Precision Drift in Finance Ledger Calculations
* **Classification:** Built Wrong (Data Integrity)
* **One-Line Impact:** Storing or calculating financial balances with naive JavaScript floats (`0.1 + 0.2`) produces floating point drift (`0.30000000000000004`), causing balance rollups and budget ratios to disagree with user bank statements.
* **Repro Steps / Evidence:**
  1. Add multiple small fractional expense items.
  2. Sum raw floats without decimal scaling or integer cents rounding.
* **Remediation & Current Status:** **FIXED.** Implemented integer cent rounding and safe cash flow equations in financial computations. Automated guard: `scripts/qa/data-integrity-guard.mjs`.

#### [P1-3] Concurrency Burst / Race Condition on Rapid Habit Check-Ins
* **Classification:** Missing Spec (Idempotency Handling)
* **One-Line Impact:** Double-clicking or rapid clicking in poor network conditions fired multiple parallel `POST /api/habits/[id]/logs`, risking duplicate rows in `habit_logs`.
* **Repro Steps / Evidence:**
  1. Send 10 concurrent requests to `/api/habits/101/logs` for date `2026-10-07`.
  2. Without atomic UPSERT (`ON CONFLICT DO UPDATE`), database threw duplicate key errors or created orphaned duplicates.
* **Remediation & Current Status:** **FIXED.** Validated atomic upsert semantics and added client-side debounce/optimistic lock. Automated guard: `scripts/qa/concurrency-fuzz-guard.mjs`.

---

### P2 (Minor) Risks
*Definition: It works and the data is correct, but there is a limited, non-blocking issue.*

#### [P2-1] Client-Side Language Switch RSC Layout Remount Flicker
* **Classification:** Built Wrong (UX Performance)
* **One-Line Impact:** Switching language (ID <-> EN) caused Next.js RSC router navigation, reloading server components and resetting scroll position.
* **Remediation & Current Status:** **FIXED.** Upgraded `InstantIntlProvider.tsx` to update messages in-memory via `window.history.replaceState` and React state (0ms latency, zero page refresh).

---

### P3 (Cosmetic) Risks
*Definition: Purely visual or copy. No function or data impact.*

#### [P3-1] Hall of Fame Blinding White Boxes in Dark Mode
* **Classification:** Built Wrong (Tailwind Class Fallback)
* **One-Line Impact:** Stat counter pills rendered with blinding white background (`bg-white/80`) due to invalid Tailwind utility `dark:bg-slate-850/80`.
* **Remediation & Current Status:** **FIXED.** Completely overhauled `HabitHallOfFameModal.tsx` with luxury Obsidian Dark Glass HUD (`bg-slate-900/80 backdrop-blur-md`).

---

## Systemic Root Cause Analysis

Across the defects uncovered during the audit, one overarching systemic pattern emerged:

> **"The Ghost-Spec Trap":** Features were historically engineered from UI prototypes without a hard Definition of Ready (DoR) gate. When acceptance criteria (Given/When/Then) were not explicitly defined upstream, edge cases (such as Rest vs Skip semantics, financial division-by-zero, and multi-tenant JWT propagation) were implemented with implicit assumptions.

### Systemic Prevention Implemented
1. **Gate 2 (Definition of Ready):** Work cannot proceed to build without formal Gherkin acceptance criteria in `.github/pull_request_template.md`.
2. **Gate 3 (Automated Quality Net):** Automated regression suite (`npm run test:qa`) covering adversarial security, concurrency fuzzing, and mathematical invariants runs on every commit.
