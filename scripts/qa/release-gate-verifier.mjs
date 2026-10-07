/**
 * ==============================================================================
 * ONEFORMIND MASTER QUALITY NET & RELEASE GATE VERIFIER
 * ==============================================================================
 * Standard: SDET Case Study Task 4: Cut a release and gate it
 * "On the tag (or release event), your pipeline runs your net and surfaces a clear
 * release status: green only if your quality gates pass, blocked otherwise.
 * The status should be tied to the tag, so anyone can see whether that version is releasable."
 * ==============================================================================
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const ASSESSMENT_DIR = path.join(ROOT_DIR, 'assessment');

console.log("\n================================================================================");
console.log("🚦 ONEFORMIND MASTER QUALITY NET: AUTOMATED RELEASE GATE RUNNER");
console.log("================================================================================\n");

const SUITES = [
  {
    id: 'security_sanitization',
    name: 'Security, XSS Sanitization & Subscription Hierarchy',
    cmd: 'npx tsx scripts/security-qa-test.mjs',
    severityIfFailed: 'P0',
  },
  {
    id: 'adversarial_rls',
    name: 'Adversarial Multi-Tenant & RLS Leak Guard',
    cmd: 'node scripts/qa/adversarial-rls-guard.mjs',
    severityIfFailed: 'P0',
  },
  {
    id: 'concurrency_fuzz',
    name: 'Concurrency, Race Condition & Idempotency Guard',
    cmd: 'node scripts/qa/concurrency-fuzz-guard.mjs',
    severityIfFailed: 'P1',
  },
  {
    id: 'data_integrity',
    name: 'Mathematical Invariants & Data Integrity Guard',
    cmd: 'node scripts/qa/data-integrity-guard.mjs',
    severityIfFailed: 'P1',
  },
  {
    id: 'affiliate_regression',
    name: 'Commercial & Affiliate Ledger Regression',
    cmd: 'node scripts/affiliate-qa-test.mjs',
    severityIfFailed: 'P1',
  },
  {
    id: 'live_integration',
    name: 'Live Infrastructure & Schema Validation',
    cmd: 'node scripts/live-integration-qa.mjs',
    severityIfFailed: 'P1',
  },
  {
    id: 'seo_crawlability',
    name: 'SEO, Crawlability & i18n Hydration Audit',
    cmd: 'npx tsx scripts/test-seo-audit.mjs',
    severityIfFailed: 'P2',
  },
];

const results = [];
let p0Count = 0;
let p1Count = 0;
let p2Count = 0;
let p3Count = 0;

for (const suite of SUITES) {
  process.stdout.write(`⏳ Running [${suite.name}]... `);
  const startTime = Date.now();
  let passed = false;
  let errorOutput = '';

  try {
    execSync(suite.cmd, { cwd: ROOT_DIR, stdio: 'pipe' });
    passed = true;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ PASSED (${duration}s)`);
  } catch (err) {
    passed = false;
    errorOutput = err.stderr ? err.stderr.toString() : err.message;
    console.log(`❌ FAILED (${suite.severityIfFailed})`);
    if (suite.severityIfFailed === 'P0') p0Count++;
    else if (suite.severityIfFailed === 'P1') p1Count++;
    else if (suite.severityIfFailed === 'P2') p2Count++;
    else p3Count++;
  }

  results.push({
    suiteId: suite.id,
    name: suite.name,
    passed,
    severityIfFailed: suite.severityIfFailed,
    errorOutput: passed ? null : errorOutput.slice(0, 300)
  });
}

// ------------------------------------------------------------------------------
// RELEASE DECISION CALCULATION (Per SDET Brief Section 3 & 4)
// ------------------------------------------------------------------------------
const isReleasable = p0Count === 0 && p1Count === 0;
const status = isReleasable ? 'RELEASABLE' : 'BLOCKED';

console.log("\n================================================================================");
console.log("📊 QUALITY GATE SUMMARY MATRIX");
console.log("================================================================================");
console.log(`  P0 (Blocker) Issues: ${p0Count}`);
console.log(`  P1 (Major) Issues:   ${p1Count}`);
console.log(`  P2 (Minor) Issues:   ${p2Count}`);
console.log(`  P3 (Cosmetic) Issues:${p3Count}`);
console.log("--------------------------------------------------------------------------------");
if (isReleasable) {
  console.log("  🟢 FINAL VERDICT: RELEASABLE (All critical quality gates passed!)");
} else {
  console.log("  🔴 FINAL VERDICT: BLOCKED (Release prohibited due to open P0/P1 defects!)");
}
console.log("================================================================================\n");

// Ensure assessment directory exists
if (!fs.existsSync(ASSESSMENT_DIR)) {
  fs.mkdirSync(ASSESSMENT_DIR, { recursive: true });
}

const auditPayload = {
  timestamp: new Date().toISOString(),
  gitBranch: 'main',
  status,
  summary: {
    totalSuites: SUITES.length,
    passedSuites: results.filter(r => r.passed).length,
    failedSuites: results.filter(r => !r.passed).length,
    p0Count,
    p1Count,
    p2Count,
    p3Count
  },
  suites: results
};

fs.writeFileSync(
  path.join(ASSESSMENT_DIR, 'release-decision-latest.json'),
  JSON.stringify(auditPayload, null, 2)
);

console.log(`📁 Audit report saved to: assessment/release-decision-latest.json\n`);

if (!isReleasable) {
  process.exit(1);
}
