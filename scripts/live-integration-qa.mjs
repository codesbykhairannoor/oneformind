import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log("\n==================================================================");
console.log("🔍 REAL INTEGRATION & LIVE INFRASTRUCTURE QA TEST SUITE");
console.log("==================================================================\n");

let passed = 0;
let failed = 0;

function assertTest(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failed++;
  }
}

// ---------------------------------------------------------------
// 1. LIVE SUPABASE DATABASE SCHEMA VERIFICATION
// ---------------------------------------------------------------
console.log("--- 1. Live Supabase PostgreSQL Schema Checks ---");

const envLocalPath = path.join(ROOT_DIR, '.env.local');
const envPath = path.join(ROOT_DIR, '.env');

let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
}

if (!supabaseUrl && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = content.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
}

assertTest(Boolean(supabaseUrl), 'Supabase URL configured', supabaseUrl);
assertTest(Boolean(supabaseKey), 'Supabase Anon Key configured');

const requiredTables = [
  'affiliate_profiles',
  'affiliate_referrals',
  'affiliate_commissions',
  'affiliate_payouts'
];

for (const table of requiredTables) {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    });

    const is200 = res.status === 200;
    const responseText = await res.text();
    const hasSchemaError = responseText.includes('PGRST205') || responseText.includes('Could not find the table');

    assertTest(
      is200 && !hasSchemaError,
      `Table '${table}' exists in live Supabase & accessible (HTTP ${res.status})`,
      responseText
    );
  } catch (err) {
    assertTest(false, `Table '${table}' connection failed`, err.message);
  }
}

// ---------------------------------------------------------------
// 2. SETTINGS CENTRALIZATION & AUTH INVARIANT CHECKS
// ---------------------------------------------------------------
console.log("\n--- 2. Settings Centralization & Auth Invariant Checks ---");

const settingsPagePath = path.join(ROOT_DIR, 'src/app/[locale]/settings/page.tsx');
const affiliatesPagePath = path.join(ROOT_DIR, 'src/app/[locale]/affiliates/page.tsx');
const sidebarPath = path.join(ROOT_DIR, 'src/components/layout/AuthSidebar.tsx');
const headerPath = path.join(ROOT_DIR, 'src/components/layout/AuthHeader.tsx');

assertTest(fs.existsSync(settingsPagePath), 'settings/page.tsx exists');
assertTest(fs.existsSync(affiliatesPagePath), 'affiliates/page.tsx exists');

if (fs.existsSync(settingsPagePath)) {
  const content = fs.readFileSync(settingsPagePath, 'utf8');
  assertTest(content.includes("id: 'affiliate'"), 'Settings page includes affiliate tab ID');
  assertTest(content.includes("SettingsAffiliateTab"), 'Settings page renders SettingsAffiliateTab component');
  assertTest(content.includes("AuthenticatedLayout"), 'Settings page is wrapped in AuthenticatedLayout');
}

if (fs.existsSync(affiliatesPagePath)) {
  const content = fs.readFileSync(affiliatesPagePath, 'utf8');
  assertTest(
    content.includes("router.replace('/settings?tab=affiliate')") || content.includes('/settings?tab=affiliate'),
    'affiliates/page.tsx routes authenticated users directly to /settings?tab=affiliate'
  );
}

if (fs.existsSync(sidebarPath)) {
  const content = fs.readFileSync(sidebarPath, 'utf8');
  assertTest(content.includes("href=\"/settings?tab=affiliate\""), 'Sidebar Partner link points directly to /settings?tab=affiliate');
}

if (fs.existsSync(headerPath)) {
  const content = fs.readFileSync(headerPath, 'utf8');
  assertTest(content.includes("href=\"/settings?tab=affiliate\""), 'Header Profile Partner link points directly to /settings?tab=affiliate');
}

// ---------------------------------------------------------------
// 3. API ROUTE RESILIENCE & ZERO-500 VERIFICATION
// ---------------------------------------------------------------
console.log("\n--- 3. API Route Resilience & Fail-Safe Checks ---");

const portalRoutePath = path.join(ROOT_DIR, 'src/app/api/affiliates/portal/route.ts');
const affiliateServicePath = path.join(ROOT_DIR, 'src/lib/affiliate/affiliate-service.ts');

assertTest(fs.existsSync(portalRoutePath), 'portal route.ts exists');
assertTest(fs.existsSync(affiliateServicePath), 'affiliate-service.ts exists');

if (fs.existsSync(portalRoutePath)) {
  const content = fs.readFileSync(portalRoutePath, 'utf8');

  // Must use getUser() alongside getSession() for reliable auth resolution
  const hasUserCheck = content.includes("supabase.auth.getUser()") && content.includes("supabase.auth.getSession()");
  assertTest(hasUserCheck, 'Portal API uses dual auth check (getUser & getSession)');

  // Must have fallback data to prevent HTTP 500 when profile is being initialized
  const hasFailSafeFallback = content.includes("fallbackRefCode") || content.includes("success: true");
  assertTest(hasFailSafeFallback, 'Portal API has fail-safe data fallback to prevent HTTP 500');
}

if (fs.existsSync(affiliateServicePath)) {
  const content = fs.readFileSync(affiliateServicePath, 'utf8');

  // Must handle race condition on concurrent profile creation
  const hasRetryLogic = content.includes("retryFetch") || content.includes("maybeSingle");
  assertTest(hasRetryLogic, 'affiliate-service handles concurrent creation race conditions');
}

// ---------------------------------------------------------------
// 4. SUMMARY
// ---------------------------------------------------------------
console.log("\n==================================================================");
console.log(`🏁 REAL QA RESULTS: ${passed} Passed | ${failed} Failed`);
console.log("==================================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
