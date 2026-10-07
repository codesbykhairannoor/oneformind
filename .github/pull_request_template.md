## 🎯 Summary & Problem Statement
<!-- Describe the objective or bug being solved. What was missing, broken, or requested? -->

---

## 🚦 Gate 2: Definition of Ready (DoR) Checklist
*Work cannot proceed without its inputs. All items below must be verified before building.*
- [ ] **Input Spec / Requirement Linked:** (e.g. Issue #, PRD link, or user story)
- [ ] **Solution & Design Plan:** Clear rationale for why this approach was selected
- [ ] **Acceptance Criteria Defined:** Gherkin scenarios (Given/When/Then) listed below

---

## 🧪 Acceptance Criteria (Gherkin Scenarios)
```gherkin
Scenario: [Primary Objective]
  Given [initial state or preconditions]
  When [action or event triggered by user/system]
  Then [expected outcome and persisted data invariant]

Scenario: [Edge Case / Failure Boundary]
  Given [boundary state or invalid input]
  When [unauthorized or out-of-bounds action occurs]
  Then [graceful error handling, 401/403/400 returned, no data corruption]
```

---

## 🛡️ Risk & Severity Assessment
Stop at first match:
- [ ] **P0 (Blocker):** Core objective cannot be achieved, main function broken, no workaround.
- [ ] **P1 (Major):** Data-integrity issue, incorrect calculation underneath, or manual workaround only.
- [ ] **P2 (Minor):** Works and data is correct, limited non-blocking edge case.
- [ ] **P3 (Cosmetic):** Purely visual, copy, or styling.

---

## 🔍 Modules Impacted
- [ ] Habits
- [ ] Finance
- [ ] Goals
- [ ] Planner
- [ ] Journal
- [ ] Jobs
- [ ] Study
- [ ] Calendar
- [ ] Auth & Multi-Tenant Core

---

## 🏁 Gate 3: Definition of Done (DoD) & Verification
- [ ] **Automated Test Net Added/Updated:** Regression check in place to prevent silent regressions
- [ ] **Data Correctness Verified:** Checked database persisted state and outcome, not just the UI screen
- [ ] **No Weakened Assertions:** Test went from red to green by fixing code, not gutting checks
- [ ] **Full Quality Net Passes:** `npm run test:qa` passes with 0 P0/P1 defects
- [ ] **Release Safe:** Does not introduce unmitigated security or performance regressions
