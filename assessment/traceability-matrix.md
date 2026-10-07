# Bidirectional Requirements Traceability Matrix (RTM)

**System:** OneForMind Productivity Platform  
**Standard:** SDET Case Study Gate G3 (Release-Ready: "traceability complete both ways")  
**Scope:** 8 Core Modules & Core Security/Quality Net  

---

## Traceability Mapping (Requirement -> Spec -> Code -> Automated Test)

| Req ID | Module | Business Requirement | Gherkin Acceptance Criteria (Given/When/Then) | Implementation File | Automated Quality Test | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | **Habits** | Rest day (☕) and Skipped day (⏸️) protection against accidental deletion | **Given** a habit marked as rest/skipped<br>**When** user left-clicks the cell<br>**Then** note modal opens and status is NOT deleted | `useHabitActions.ts`, `HabitMatrixTable.tsx` | `data-integrity-guard.mjs` | 🟢 Verified |
| **REQ-02** | **Habits** | Hall of Fame graduation and prestige tier calculation | **Given** a habit with N completions<br>**When** total >= 100/50/25<br>**Then** assign Diamond, Gold, or Silver tier | `HabitHallOfFameModal.tsx` | `data-integrity-guard.mjs` | 🟢 Verified |
| **REQ-03** | **Finance** | Double-entry cashflow mathematical invariant | **Given** recorded income and expenses<br>**When** net balance is computed<br>**Then** `Income - Expense == CashFlow` without float drift | `src/app/api/finance/` | `data-integrity-guard.mjs` | 🟢 Verified |
| **REQ-04** | **Finance** | Concurrency idempotency on transactions | **Given** a debit transaction with idempotency key<br>**When** burst requests replay the key<br>**Then** exactly one transaction is debited | `src/app/api/finance/transactions` | `concurrency-fuzz-guard.mjs` | 🟢 Verified |
| **REQ-05** | **Goals** | Milestone progress percentage boundary | **Given** N milestones with K completed<br>**When** progress is computed<br>**Then** `0 <= (K/N)*100 <= 100` and zero division returns 0% | `src/app/api/goals/` | `data-integrity-guard.mjs` | 🟢 Verified |
| **REQ-06** | **Planner** | ISO date format and time-window validity | **Given** a daily task time allocation<br>**When** start and end time are validated<br>**Then** `startTime < endTime` and date matches ISO `YYYY-MM-DD` | `src/app/api/planner/` | `data-integrity-guard.mjs` | 🟢 Verified |
| **REQ-07** | **Auth / Multi-Tenant** | Cryptographic tenant isolation & IDOR prevention | **Given** User A and User B<br>**When** User A queries or mutates User B's resource<br>**Then** request is rejected with 401/403/404 | `auth-edge.ts`, `proxy.ts`, `api/...` | `adversarial-rls-guard.mjs` | 🟢 Verified |
| **REQ-08** | **Affiliate** | Revenue share and escrow holding period | **Given** an active referral purchase<br>**When** commission is generated<br>**Then** apply 60% rate and lock in Net-14 escrow | `affiliate-service.ts` | `affiliate-qa-test.mjs` | 🟢 Verified |
| **REQ-09** | **i18n / UX** | Instant zero-refresh language switching | **Given** user switches locale between ID and EN<br>**When** language is changed<br>**Then** messages switch in-memory without RSC page reload | `InstantIntlProvider.tsx` | `test-seo-audit.mjs` | 🟢 Verified |
