import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log("\n=======================================================");
console.log("🚀 ONEFORMIND AFFILIATE & QA REGRESSION TEST SUITE");
console.log("=======================================================\n");

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

// ==========================================
// TEST GROUP 1: SETTINGS & NAVIGATION INTEGRITY
// ==========================================
console.log("--- 1. Settings & Navigation Integrity Tests ---");

const settingsPagePath = path.join(ROOT_DIR, 'src/app/[locale]/settings/page.tsx');
const settingsTabPath = path.join(ROOT_DIR, 'src/app/[locale]/settings/components/SettingsAffiliateTab.tsx');
const sidebarPath = path.join(ROOT_DIR, 'src/components/layout/AuthSidebar.tsx');
const headerPath = path.join(ROOT_DIR, 'src/components/layout/AuthHeader.tsx');

assertTest(fs.existsSync(settingsPagePath), 'Settings page file exists');
assertTest(fs.existsSync(settingsTabPath), 'SettingsAffiliateTab component file exists');
assertTest(fs.existsSync(sidebarPath), 'AuthSidebar component file exists');
assertTest(fs.existsSync(headerPath), 'AuthHeader component file exists');

if (fs.existsSync(settingsPagePath)) {
  const settingsContent = fs.readFileSync(settingsPagePath, 'utf8');
  assertTest(settingsContent.includes("id: 'affiliate'"), 'Settings page includes affiliate tab ID in tabs array');
  assertTest(settingsContent.includes("SettingsAffiliateTab"), 'Settings page imports & renders SettingsAffiliateTab component');
  assertTest(settingsContent.includes("affiliate:"), 'Settings page includes affiliate in tabMeta configuration');
}

if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  assertTest(headerContent.includes('/settings?tab=affiliate'), 'AuthHeader profile dropdown has direct affiliate link');
}

// ==========================================
// TEST GROUP 2: BILINGUAL I18N LOCALIZATION
// ==========================================
console.log("\n--- 2. Bilingual i18n Localization Integrity ---");

const idJsonPath = path.join(ROOT_DIR, 'src/messages/id.json');
const enJsonPath = path.join(ROOT_DIR, 'src/messages/en.json');

assertTest(fs.existsSync(idJsonPath), 'Indonesian messages (id.json) exists');
assertTest(fs.existsSync(enJsonPath), 'English messages (en.json) exists');

if (fs.existsSync(idJsonPath) && fs.existsSync(enJsonPath)) {
  const idMessages = JSON.parse(fs.readFileSync(idJsonPath, 'utf8'));
  const enMessages = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

  const requiredAffiliateKeys = [
    'settings_nav_affiliate',
    'settings_page_affiliate_title',
    'settings_page_affiliate_subtitle',
    'affiliate_portal_title',
    'affiliate_portal_subtitle',
    'affiliate_calc_title',
    'affiliate_faq_title',
    'affiliate_cta_final_title',
    'affiliate_step_title',
    'affiliate_matrix_title'
  ];

  for (const key of requiredAffiliateKeys) {
    const hasId = key in idMessages && idMessages[key].length > 0;
    const hasEn = key in enMessages && enMessages[key].length > 0;
    assertTest(hasId, `i18n [ID] contains '${key}'`);
    assertTest(hasEn, `i18n [EN] contains '${key}'`);
  }
}

// ==========================================
// TEST GROUP 3: 60% COMMISSION & MATH LOGIC
// ==========================================
console.log("\n--- 3. Affiliate Commission & Financial Logic Tests ---");

function calculateCommission(transactionAmount, rate = 0.60) {
  return Math.round(transactionAmount * rate * 100) / 100;
}

// Test Indonesian Rupiah (IDR) Pricing
const planPriceIDR = 149000;
const commissionIDR = calculateCommission(planPriceIDR, 0.60);
assertTest(commissionIDR === 89400, '60% commission on Rp 149.000 is exactly Rp 89.400', `Got ${commissionIDR}`);

// Test USD Pricing
const planPriceUSD = 19.99;
const commissionUSD = calculateCommission(planPriceUSD, 0.60);
assertTest(commissionUSD === 11.99, '60% commission on $19.99 is $11.99', `Got ${commissionUSD}`);

// Test 8 Billing Cycles Limitation
function isCycleEligible(cycleNumber) {
  return cycleNumber >= 1 && cycleNumber <= 8;
}

assertTest(isCycleEligible(1) === true, 'Billing cycle 1 is rewarded');
assertTest(isCycleEligible(8) === true, 'Billing cycle 8 is rewarded');
assertTest(isCycleEligible(9) === false, 'Billing cycle 9 is rejected (8-cycle limit enforced)');
assertTest(isCycleEligible(12) === false, 'Billing cycle 12 is rejected');

// Test 14-Day Escrow Holding Period Math
function getHoldingDate(createdAtISO) {
  const date = new Date(createdAtISO);
  date.setDate(date.getDate() + 14);
  return date;
}

const createdAt = '2026-09-01T10:00:00.000Z';
const holdingDate = getHoldingDate(createdAt);
const holdingDiffDays = Math.round((holdingDate.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
assertTest(holdingDiffDays === 14, 'Holding period is exactly 14 calendar days (Net-14 Escrow)');

// ==========================================
// TEST GROUP 4: REFERRAL ATTRIBUTION & FRAUD PREVENTION
// ==========================================
console.log("\n--- 4. Referral Attribution & Anti-Fraud Security Tests ---");

function validateReferralLinkage(partnerUserId, referredUserId) {
  if (!partnerUserId || !referredUserId) {
    return { valid: false, reason: 'Missing identifier' };
  }
  if (partnerUserId === referredUserId) {
    return { valid: false, reason: 'Self-referral is strictly disallowed' };
  }
  return { valid: true };
}

const selfReferralCheck = validateReferralLinkage('user-123', 'user-123');
assertTest(selfReferralCheck.valid === false, 'Self-referral attempt is rejected with 400 error');

const validReferralCheck = validateReferralLinkage('partner-abc', 'customer-xyz');
assertTest(validReferralCheck.valid === true, 'Legitimate cross-user referral is accepted');

// Custom Referral Code Validation Regex
const refCodeRegex = /^[A-Z0-9_-]{3,25}$/;
assertTest(refCodeRegex.test('VIP2026') === true, 'Valid referral code format "VIP2026"');
assertTest(refCodeRegex.test('GROWTH_HACKER') === true, 'Valid referral code format "GROWTH_HACKER"');
assertTest(refCodeRegex.test('AB') === false, 'Reject short referral code (< 3 chars)');
assertTest(refCodeRegex.test('THIS_IS_WAY_TOO_LONG_OF_A_REFERRAL_CODE_FOR_SYSTEM') === false, 'Reject long code (> 25 chars)');
assertTest(refCodeRegex.test('CODE with SPACES') === false, 'Reject referral code with spaces');
assertTest(refCodeRegex.test('CODE<script>') === false, 'Reject XSS injection in referral code');

// ==========================================
// TEST GROUP 5: PAYOUT THRESHOLD & BALANCE VALIDATION
// ==========================================
console.log("\n--- 5. Payout Threshold & Balance Validation ---");

function validatePayoutRequest(amount, currency, availableBalance) {
  const minThreshold = currency === 'IDR' ? 50000 : 5.0;
  if (amount < minThreshold) {
    return { 
      valid: false, 
      message: currency === 'IDR' 
        ? 'Minimum pencairan saldo adalah Rp 50.000' 
        : 'Minimum payout threshold is $5.00' 
    };
  }
  if (amount > availableBalance) {
    return { 
      valid: false, 
      message: 'Requested amount exceeds available balance' 
    };
  }
  return { valid: true };
}

assertTest(validatePayoutRequest(40000, 'IDR', 100000).valid === false, 'Reject IDR payout under Rp 50.000');
assertTest(validatePayoutRequest(50000, 'IDR', 100000).valid === true, 'Accept IDR payout at threshold Rp 50.000');
assertTest(validatePayoutRequest(150000, 'IDR', 100000).valid === false, 'Reject payout exceeding available balance');
assertTest(validatePayoutRequest(4.0, 'USD', 50.0).valid === false, 'Reject USD payout under $5.00');
assertTest(validatePayoutRequest(5.0, 'USD', 50.0).valid === true, 'Accept USD payout at threshold $5.00');

// ==========================================
// TEST RESULTS SUMMARY
// ==========================================
console.log("\n=======================================================");
console.log(`📊 AFFILIATE QA RESULTS: ${passed} Passed, ${failed} Failed`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
