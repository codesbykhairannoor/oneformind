# <p align="center"><img src="https://tranvas.com/favicon.svg" width="48" height="48" alt="Tranvas Logo" style="vertical-align: middle; margin-right: 12px;" /> Tranvas</p>

<p align="center">
  <strong>The Unified Cognitive Life OS & Autonomous Productivity Engine</strong>
</p>

<p align="center">
  <em>Synthesizing daily planning, habit architecture, cognitive CBT reflection, and career/academic execution into a single, cohesive intelligence ecosystem.</em>
</p>

<p align="center">
  <a href="https://tranvas.com" target="_blank"><img src="https://img.shields.io/badge/Live%20Platform-tranvas.com-00DC82?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Platform" /></a>
  <a href="https://codesbykhairannoor.github.io/oneformind/" target="_blank"><img src="https://img.shields.io/badge/Open%20Docs-GitHub%20Pages-6366F1?style=for-the-badge&logo=github&logoColor=white" alt="Open Docs Showcase" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.2%20(Turbopack)-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/Intelligence-Claude%203.5%20Sonnet-d97706?style=flat-square&logo=anthropic" alt="Claude 3.5 Sonnet" />
  <img src="https://img.shields.io/badge/Database-Supabase%20Postgres-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Security-Multi--Tenant%20RLS-blueviolet?style=flat-square&logo=shield" alt="RLS" />
  <img src="https://img.shields.io/badge/Tests-53%20Passing%20(Vitest)-brightgreen?style=flat-square&logo=vitest" alt="Vitest 53/53" />
  <img src="https://img.shields.io/badge/TypeScript-Strict%205.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-Proprietary-gray?style=flat-square" alt="License" />
</p>

---

## 🌟 Executive Overview

Modern high-performers suffer from **productivity fragmentation**: task planners in Todoist, daily habits in Habitica, reflective writing in Day One, finances in spreadsheets, and academic/career pipelines in Notion. This disjointed sprawl results in cognitive overload, fragmented metrics, and a total lack of cross-domain synergy.

**[Tranvas](https://tranvas.com)** solves this with a **Unified Cognitive Life OS**. Rather than treating daily tasks, habits, reflections, and strategic objectives as siloed utilities, Tranvas synthesizes them through high-context intelligence powered by **Anthropic Claude 3.5 Sonnet**.

> **Live Production Platform**: [https://tranvas.com](https://tranvas.com)  
> **Interactive Documentation Showcase**: [https://codesbykhairannoor.github.io/oneformind/](https://codesbykhairannoor.github.io/oneformind/)

---

## 🧠 Flagship Intelligence: Claude 3.5 Sonnet Integration

Tranvas leverages **Claude 3.5 Sonnet** as its core cognitive intelligence engine across two flagship agentic subsystems:

### 1. Autonomous Life Synergy Coach
The Life Synergy Coach acts as an autonomous personal chief of staff. Rather than analyzing single data points in isolation, the coach ingests cross-module event telemetry:
- **Correlative Synthesis**: Detects systemic patterns between habit lapses, sleep/focus scores, and workload spikes.
- **Adaptive Schedule Restructuring**: Re-prioritizes daily timeblocks dynamically when cognitive fatigue thresholds are met.
- **Proactive Behavioral Nudges**: Delivers nuanced, high-empathy micro-interventions before burnout manifests.

### 2. Cognitive CBT Reflection & Thought Reframing
A clinical-grade cognitive journaling companion utilizing Claude 3.5 Sonnet's state-of-the-art conversational nuance and emotional comprehension:
- **Cognitive Distortion Diagnostic**: Scans natural language journal entries for 10 clinical distortion archetypes (e.g., *catastrophizing*, *all-or-nothing thinking*, *mind reading*, *emotional reasoning*).
- **Dialectical Reframing**: Formulates Socratic questioning sequences that guide users to decouple facts from subjective appraisals.
- **Actionable Growth Synthesis**: Automatically translates reframed perspectives into immediate, quantifiable tasks in the [Daily Planner](https://tranvas.com/planner).
- **Privacy & Isolation**: Operates over anonymized session context with zero cross-tenant leakage.

---

## 🏛️ The 8 Core Life OS Modules

Every module in Tranvas is designed as a first-class citizen with real-time state synchronization:

| Module | Core Capability | Key Technical Highlights |
| :--- | :--- | :--- |
| [**🗓️ Daily Planner**](https://tranvas.com/planner) | Timeboxed daily execution & priority matrix | Eisenhower matrix categorization, optimistic UI updates via SWR, drag-and-drop sequencing. |
| [**🔄 Habit Architecture**](https://tranvas.com/habits) | Identity-reinforcing habit formation | Streak velocity algorithms, dynamic cadences (daily, weekly, custom), completion heatmaps. |
| [**💰 Wealth & Cashflow**](https://tranvas.com/finance) | Real-time cashflow & net-worth trajectory | Multi-currency ledger, category analytics, balance forecast projections, chart visualizations. |
| [**🧠 Cognitive CBT Journal**](https://tranvas.com/journal) | Structured reflection & emotional reframing | Sentiment telemetry, distortion detection, guided Socratic reflection prompts. |
| [**🎯 Strategic Goals & OKRs**](https://tranvas.com/goals) | Hierarchical goal milestone tracking | Key Result progress aggregation, objective velocity calculation, timeline roadmaps. |
| [**💼 Career & Job Pipeline**](https://tranvas.com/jobs) | Full-cycle application & interview tracking | Kanban recruitment stages, interview preparation notes, salary negotiation tracker. |
| [**📚 Deep Study Hub**](https://tranvas.com/study) | Focus acceleration & academic mastery | Integrated Pomodoro cycles, curriculum tracking, study hour telemetry, exam milestone dates. |
| [**📆 Chrono Calendar**](https://tranvas.com/calendar) | Unified timeline & cross-module sync | Aggregated visual view of scheduled tasks, habit milestones, study blocks, and financial deadlines. |

---

## 📐 System Architecture

Tranvas employs a modern, security-first full-stack architecture designed for zero latency and uncompromised multi-tenant isolation:

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Layer (Next.js 16 + React 19)"]
        UI["Web App (App Router + Turbopack)"]
        SWR["Optimistic State & Caching (SWR)"]
        I18N["Internationalization Engine (next-intl)"]
    end

    subgraph Gateway ["Edge & Security Middleware"]
        MW["Auth Middleware & Session Guard"]
        RLS_CHECK["Tenant Boundary Verifier"]
    end

    subgraph Services ["Application & Compute Layer"]
        NEXT_API["Next.js Server Actions & Route Handlers"]
        GO_CORE["Go High-Concurrency Daemon (Realtime & Compute)"]
        CLAUDE_AI["Claude 3.5 Sonnet Cognitive Pipeline"]
    end

    subgraph Data ["Persistence & Security Layer (Supabase)"]
        PG["PostgreSQL Relational DB"]
        RLS["Row-Level Security (Multi-Tenant Enforced)"]
        STORAGE["Encrypted Asset Storage"]
    end

    UI --> SWR --> MW
    MW --> RLS_CHECK
    RLS_CHECK --> NEXT_API
    RLS_CHECK --> GO_CORE
    NEXT_API --> CLAUDE_AI
    NEXT_API --> RLS --> PG
    GO_CORE --> RLS --> PG
    NEXT_API --> STORAGE
```

---

## 🔒 Security, Privacy & Tenancy Isolation

- **Row-Level Security (RLS)**: Enforced directly at the PostgreSQL layer via Supabase. Every query is scoped to `auth.uid()`, mathematically preventing cross-tenant data leaks.
- **Adversarial Security Net**: Validated against automated adversarial penetration tests (`npm run test:qa:adversarial`), verifying that multi-tenant boundaries cannot be breached via parameter tampering or forged headers.
- **Privacy-Preserving AI Pipelines**: Claude 3.5 Sonnet integrations operate over strict contextual boundaries; user identifiers and sensitive credentials are encrypted and never utilized for model training.
- **Enterprise Web Security**: Strict Content Security Policy (CSP), HTTP-only SameSite cookies, CSRF prevention tokens, and zero client-side privilege escalation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16.3.2 (App Router, Turbopack, React Server Components) |
| **Core UI** | React 19.2.8, React Compiler (`babel-plugin-react-compiler`) |
| **Styling** | Tailwind CSS v4, PostCSS, Custom Design System Tokens |
| **Cognitive AI** | Anthropic Claude 3.5 Sonnet API |
| **Backend / DB** | Supabase PostgreSQL, Supabase SSR (`@supabase/ssr`), Raw PG client (`pg`) |
| **Microservice** | Go 1.23 High-Concurrency Daemon (`api-go`) |
| **Data Fetching** | SWR 2.5 (Optimistic mutations, Stale-While-Revalidate caching) |
| **Internationalization** | `next-intl` (Multi-locale routing: English & Indonesian) |
| **Visualization** | Chart.js 4.5, React-ChartJS-2 |
| **Testing** | Vitest 4.1, Node.js SDET Quality Net Guard Suite |

---

## 🧪 Comprehensive Quality Assurance

Tranvas runs an enterprise-grade automated test harness before any deployment:

```bash
# Execute unit, contract, and invariant tests
npm run test

# Execute the comprehensive SDET Quality Net (9 automated security & reliability gates)
npm run test:qa
```

### Verification Matrix
- ✅ **Vitest Unit & Integration Suite**: 53 / 53 Tests Passing
- ✅ **Adversarial Multi-Tenant RLS Guard**: Zero authorization leaks detected
- ✅ **Concurrency, Race Condition & Idempotency Guard**: Zero deadlocks or race anomalies
- ✅ **Mathematical Invariants & Data Integrity Guard**: Complete balance and streak integrity
- ✅ **SEO, Crawlability & i18n Hydration Audit**: Perfect tag compliance and locale structure
- ✅ **Container & Reproducible Deployment Guard**: Zero foreign binary execution issues in Docker CI

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Supabase Account**: A provisioned PostgreSQL project with RLS enabled

### 2. Clone and Install
```bash
git clone https://github.com/codesbykhairannoor/oneformind.git
cd oneformind
npm install
```

### 3. Configure Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-claude-api-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/oneformind
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the local instance.

---

## 🌐 Official Platform & Documentation

- **Live Production App**: [https://tranvas.com](https://tranvas.com)
- **Documentation & Showcase**: [https://codesbykhairannoor.github.io/oneformind/](https://codesbykhairannoor.github.io/oneformind/)
- **Contact & Inquiries**: [support@tranvas.com](mailto:support@tranvas.com)

---

<p align="center">
  <sub>© 2026 Tranvas Technologies. All rights reserved. Designed for cognitive clarity and peak execution.</sub>
</p>
