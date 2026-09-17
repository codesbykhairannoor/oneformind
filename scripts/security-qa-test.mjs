import crypto from 'crypto';

// 1. IMPORT SANITIZER
import { sanitizeHtml } from '../src/lib/sanitize.ts';

// 2. IMPORT SUBSCRIPTION LOGIC
import { 
  getTrialStatus, 
  getEffectiveTier, 
  isSubscriptionActive, 
  isArchitect, 
  isQuantum, 
  isLegendary, 
  hasAiFeature 
} from '../src/lib/auth/subscription.ts';

console.log("\n=======================================================");
console.log("🛡️  ONEFORMIND SECURITY & INJECTION QA TEST SUITE");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

function assertTest(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// ==========================================
// TEST GROUP 1: XSS & HTML INJECTION SANITIZATION
// ==========================================
console.log("--- 1. XSS & Script Injection Tests ---");

const xssPayloads = [
  {
    input: '<script>alert("XSS")</script>',
    expectedNotContain: '<script>',
    name: 'Strip <script> tag'
  },
  {
    input: '<img src="x" onerror="alert(1)" />',
    expectedNotContain: 'onerror',
    name: 'Strip onerror event handler'
  },
  {
    input: '<a href="javascript:alert(document.cookie)">Click me</a>',
    expectedNotContain: 'javascript:',
    name: 'Strip javascript: pseudo-protocol in href'
  },
  {
    input: '<iframe src="https://attacker.com"></iframe>',
    expectedNotContain: '<iframe',
    name: 'Strip <iframe> tag'
  },
  {
    input: '<object data="malicious.swf"></object>',
    expectedNotContain: '<object',
    name: 'Strip <object> tag'
  },
  {
    input: '<p onclick="stealTokens()">Safe paragraph</p>',
    expectedNotContain: 'onclick',
    name: 'Strip onclick handler from valid tag'
  },
  {
    input: '<h1><strong>Safe formatted text</strong></h1>',
    expectedContain: '<h1><strong>Safe formatted text</strong></h1>',
    name: 'Preserve safe formatting tags'
  }
];

for (const tc of xssPayloads) {
  const result = sanitizeHtml(tc.input);
  if (tc.expectedNotContain) {
    assertTest(!result.includes(tc.expectedNotContain), `XSS - ${tc.name}`);
  }
  if (tc.expectedContain) {
    assertTest(result.includes(tc.expectedContain), `Formatting - ${tc.name}`);
  }
}

// ==========================================
// TEST GROUP 2: OPEN REDIRECT SANITIZATION
// ==========================================
console.log("\n--- 2. Open Redirect & Protocol Smuggling Tests ---");

function sanitizeRedirect(rawNext) {
  let safeNext = '/dashboard';
  if (
    rawNext &&
    rawNext.startsWith('/') &&
    !rawNext.startsWith('//') &&
    !rawNext.startsWith('/\\') &&
    !rawNext.includes('\\')
  ) {
    try {
      const parsed = new URL(rawNext, 'http://localhost');
      if (parsed.pathname.startsWith('/')) {
        safeNext = parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      safeNext = '/dashboard';
    }
  }
  return safeNext;
}

const redirectPayloads = [
  { input: '//evil.com', expected: '/dashboard', name: 'Protocol-relative URL (//evil.com)' },
  { input: '/\\evil.com', expected: '/dashboard', name: 'Backslash bypass (/\\evil.com)' },
  { input: 'https://evil.com', expected: '/dashboard', name: 'Absolute external URL' },
  { input: 'javascript:alert(1)', expected: '/dashboard', name: 'JavaScript URI' },
  { input: '/planner?view=week', expected: '/planner?view=week', name: 'Safe internal relative route' },
  { input: '/habits#today', expected: '/habits#today', name: 'Safe internal route with hash' },
  { input: '', expected: '/dashboard', name: 'Empty next parameter' },
  { input: null, expected: '/dashboard', name: 'Null next parameter' },
];

for (const tc of redirectPayloads) {
  const res = sanitizeRedirect(tc.input);
  assertTest(res === tc.expected, `Redirect - ${tc.name} -> '${res}'`);
}

// ==========================================
// TEST GROUP 3: WEBHOOK SIGNATURE INTEGRITY
// ==========================================
console.log("\n--- 3. Webhook HMAC & Replay Integrity Tests ---");

function verifyWebhook(secret, signature, body) {
  if (!secret) return true; // not configured in test/dev
  if (!signature) return false; // MUST fail if secret is set but signature is missing
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');
  return digest.length === signatureBuffer.length && crypto.timingSafeEqual(digest, signatureBuffer);
}

const secretKey = 'test_webhook_secret_key_123';
const rawBody = JSON.stringify({ event: 'order_created', user_id: '123' });
const validSignature = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
const invalidSignature = 'deadbeef00000000000000000000000000000000000000000000000000000000';

assertTest(verifyWebhook(secretKey, validSignature, rawBody) === true, "Valid HMAC signature accepted");
assertTest(verifyWebhook(secretKey, invalidSignature, rawBody) === false, "Forged HMAC signature rejected");
assertTest(verifyWebhook(secretKey, '', rawBody) === false, "Missing signature rejected when secret is configured");
assertTest(verifyWebhook(secretKey, null, rawBody) === false, "Null signature rejected when secret is configured");

// ==========================================
// TEST GROUP 4: ROUTE PARAMETER SANITIZATION & PROXY URL
// ==========================================
console.log("\n--- 4. Route Parameter & URL Injection Tests ---");

function buildProxyUrl(route, queryParams, baseApi = 'http://localhost:8080') {
  const safeRoute = (route || '').replace(/[^a-zA-Z0-9_\-]/g, '');
  if (!safeRoute) return null;

  const targetUrl = new URL(baseApi);
  targetUrl.searchParams.set('route', safeRoute);

  if (queryParams) {
    const incoming = new URLSearchParams(queryParams);
    incoming.forEach((val, key) => {
      if (key !== 'route') {
        targetUrl.searchParams.set(key, val);
      }
    });
  }
  return targetUrl.toString();
}

const p1 = buildProxyUrl('habits', 'month=2026-09');
assertTest(p1 === 'http://localhost:8080/?route=habits&month=2026-09', "Safe route + query constructed");

const p2 = buildProxyUrl('habits/../../admin', 'route=override&filter=all');
assertTest(p2 === 'http://localhost:8080/?route=habitsadmin&filter=all', "Path traversal & route override injection blocked");

const p3 = buildProxyUrl('$$$^^^@@@', '');
assertTest(p3 === null, "Purely invalid non-alphanumeric route rejected with null/400");

// ==========================================
// TEST GROUP 5: SUBSCRIPTION TIER HIERARCHY & BOUNDARY FUZZING
// ==========================================
console.log("\n--- 5. Subscription Hierarchy & Expiration Boundary Fuzzing ---");

// Fuzz 1: Quantum must ALWAYS inherit Architect access
const quantumUser = { planType: 'quantum', isPremium: true, premiumUntil: new Date(Date.now() + 86400000 * 30).toISOString() };
assertTest(getEffectiveTier(quantumUser) === 3, "Quantum user is Level 3");
assertTest(isArchitect(quantumUser) === true, "Quantum inherits Architect (isArchitect === true)");
assertTest(hasAiFeature(quantumUser) === true, "Quantum has full AI access");

// Fuzz 2: Legendary must ALWAYS inherit Architect access
const legendaryUser = { planType: 'legendary', isPremium: true, createdAt: new Date().toISOString() };
assertTest(getEffectiveTier(legendaryUser) === 4, "Legendary user is Level 4");
assertTest(isArchitect(legendaryUser) === true, "Legendary inherits Architect (isArchitect === true)");
assertTest(hasAiFeature(legendaryUser) === true, "Legendary has AI bonus during first 2 months");

// Fuzz 3: Architect user CANNOT access Quantum AI Coach
const architectUser = { planType: 'architect', isPremium: true, premiumUntil: new Date(Date.now() + 86400000 * 30).toISOString() };
assertTest(getEffectiveTier(architectUser) === 2, "Architect user is Level 2");
assertTest(isArchitect(architectUser) === true, "Architect has Architect access");
assertTest(isQuantum(architectUser) === false, "Architect is NOT Quantum");
assertTest(hasAiFeature(architectUser) === false, "Architect CANNOT access Quantum AI Coach without trial");

// Fuzz 4: Expired subscription immediately downgrades to Explorer
const expiredQuantum = { planType: 'quantum', isPremium: true, premiumUntil: new Date(Date.now() - 1000).toISOString() };
assertTest(isSubscriptionActive(expiredQuantum) === false, "Expired Quantum is not active");
assertTest(getEffectiveTier(expiredQuantum) === 1, "Expired Quantum downgraded to Explorer (Level 1)");
assertTest(isArchitect(expiredQuantum) === false, "Expired Quantum blocked from Architect tools");
assertTest(hasAiFeature(expiredQuantum) === false, "Expired Quantum blocked from AI");

// Fuzz 5: Expired Trial immediately downgrades
const expiredTrial = { planType: 'explorer', is_trial: true, trialEndsAt: new Date(Date.now() - 1000).toISOString() };
assertTest(getTrialStatus(expiredTrial).isActive === false, "Expired trial is inactive");
assertTest(getEffectiveTier(expiredTrial) === 1, "Expired trial downgraded to Explorer (Level 1)");

console.log("\n=======================================================");
console.log(`🏁 QA SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
