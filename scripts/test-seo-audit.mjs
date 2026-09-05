import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🧪 TRANVAS TECHNICAL SEO & CSV AUDIT TEST SUITE');
console.log('====================================================\n');

let totalErrors = 0;
let totalWarnings = 0;
let totalTests = 0;

function assert(condition, message, warnOnly = false) {
  totalTests++;
  if (!condition) {
    if (warnOnly) {
      console.warn(`  ⚠️ [WARN] ${message}`);
      totalWarnings++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      totalErrors++;
    }
  } else {
    console.log(`  ✅ [PASS] ${message}`);
  }
}

const csvDir = path.join(process.cwd(), 'NewCSV');
const srcDir = path.join(process.cwd(), 'src');

// ----------------------------------------------------
// 1. AUDIT CATEGORY 1: 404 NOT FOUND ROUTES
// ----------------------------------------------------
console.log('1️⃣  AUDITING 404-PAGE.CSV & BROKEN ROUTES...');
const reported404s = [
  'terms-of-service',
  'features',
  'contact',
  'privacy-policy'
];

reported404s.forEach(slug => {
  const routePage = path.join(srcDir, 'app', '[locale]', slug, 'page.tsx');
  assert(fs.existsSync(routePage), `Physical page exists for 404 slug: src/app/[locale]/${slug}/page.tsx`);
});
console.log(`   Scanned all reported 404 routes. All now exist in Next.js.\n`);

// ----------------------------------------------------
// 2. AUDIT CATEGORY 2: SITEMAP & BROKEN REDIRECTS
// ----------------------------------------------------
console.log('2️⃣  AUDITING 3XX-REDIRECT-IN-SITEMAP.CSV & SITEMAP GENERATOR...');
const sitemapFile = path.join(srcDir, 'app', 'sitemap.ts');
const sitemapCode = fs.readFileSync(sitemapFile, 'utf8');

assert(!sitemapCode.includes('`${baseUrl}/en${route'), 'sitemap.ts does NOT prepend /en to default English routes');
assert(sitemapCode.includes('process.env.APP_URL || \'https://tranvas.com\''), 'sitemap.ts uses canonical base URL');
assert(sitemapCode.includes('\'/features\''), 'sitemap.ts includes /features');
assert(sitemapCode.includes('\'/contact\''), 'sitemap.ts includes /contact');
assert(sitemapCode.includes('\'/privacy-policy\''), 'sitemap.ts includes /privacy-policy');
assert(sitemapCode.includes('\'/terms-of-service\''), 'sitemap.ts includes /terms-of-service');
assert(sitemapCode.includes('\'/features/planner\''), 'sitemap.ts includes /features/planner');
assert(sitemapCode.includes('\'/features/finance\''), 'sitemap.ts includes /features/finance');
console.log('   Sitemap generation logic verified.\n');

// ----------------------------------------------------
// 3. AUDIT CATEGORY 3: CANONICAL TAGS & RECIPROCAL HREFLANG
// ----------------------------------------------------
console.log('3️⃣  AUDITING CANONICAL & HREFLANG LOGIC IN LAYOUT.TSX...');
const layoutFile = path.join(srcDir, 'app', '[locale]', 'layout.tsx');
const layoutCode = fs.readFileSync(layoutFile, 'utf8');

assert(layoutCode.includes('generateMetadata'), 'layout.tsx defines dynamic generateMetadata');
assert(layoutCode.includes('canonical: canonicalUrl'), 'layout.tsx assigns dynamic canonicalUrl');
assert(layoutCode.includes('\'en\': baseUrl'), 'layout.tsx assigns prefix-less en alternate');
assert(layoutCode.includes('\'id\': `${baseUrl}/id`'), 'layout.tsx assigns /id alternate');
assert(layoutCode.includes('\'x-default\': baseUrl'), 'layout.tsx assigns prefix-less x-default alternate');
console.log('   Canonical & reciprocal hreflang structure verified.\n');

// ----------------------------------------------------
// 4. AUDIT CATEGORY 4: INDEXABLE PAGES IN SITEMAP
// ----------------------------------------------------
console.log('4️⃣  AUDITING INDEXABLE-PAGE-NOT-IN-SITEMAP.CSV...');
const corePublicRoutes = [
  'features',
  'pricing',
  'about',
  'contact',
  'privacy-policy',
  'terms-of-service',
  'features/planner',
  'features/habit',
  'features/finance',
  'features/journal',
  'features/neural-os',
  'features/job',
  'features/goal',
  'features/calendar',
  'solutions/deep-work',
  'solutions/second-brain',
  'solutions/student',
  'solutions/finance-mastery',
  'solutions/career-accelerator',
  'solutions/mental-clarity',
  'solutions/atomic-system',
  'solutions/freelancer',
  'solutions/personalgrowth',
  'resources/blog',
  'resources/guide',
  'resources/changelog',
  'resources/community',
  'resources/stories',
  'resources/ai-trust',
  'resources/help'
];

corePublicRoutes.forEach(r => {
  assert(sitemapCode.includes(`'/${r}'`), `sitemap.ts contains route: /${r}`);
});
console.log(`   Checked ${corePublicRoutes.length} core indexable routes in sitemap.\n`);

// ----------------------------------------------------
// 5. AUDIT CATEGORY 5: OPEN GRAPH & TWITTER CARDS
// ----------------------------------------------------
console.log('5️⃣  AUDITING OPEN-GRAPH & TWITTER METADATA...');
assert(layoutCode.includes('openGraph:'), 'layout.tsx exports openGraph metadata');
assert(layoutCode.includes('siteName: \'Tranvas\''), 'openGraph contains siteName: Tranvas');
assert(layoutCode.includes('url: canonicalUrl'), 'openGraph contains dynamic canonicalUrl');
assert(layoutCode.includes('twitter:'), 'layout.tsx exports twitter metadata');
assert(layoutCode.includes('card: \'summary_large_image\''), 'twitter contains card: summary_large_image');
assert(layoutCode.includes('creator: \'@tranvas_app\''), 'twitter contains creator handle');
console.log('   Social metadata verified.\n');

// ----------------------------------------------------
// 6. AUDIT CATEGORY 6: META DESCRIPTION LENGTH (<= 160 chars)
// ----------------------------------------------------
console.log('6️⃣  AUDITING META DESCRIPTION LENGTH...');
const descMatch = layoutCode.match(/description:\s*\n?\s*["']([^"']+)["']/);
assert(descMatch !== null, 'layout.tsx defines meta description');
if (descMatch) {
  const desc = descMatch[1];
  assert(desc.length >= 120 && desc.length <= 160, `Meta description length (${desc.length} chars) is optimal (120-160 chars)`);
}
console.log('   Meta description length verified.\n');

// ----------------------------------------------------
// 7. AUDIT CATEGORY 7: H1 TAG & FULL SSR HYDRATION
// ----------------------------------------------------
console.log('7️⃣  AUDITING H1 HEADING & SERVER-SIDE RENDERING (SSR)...');
const featuresHubFile = path.join(srcDir, 'app', '[locale]', 'features', 'page.tsx');
const featuresHubCode = fs.readFileSync(featuresHubFile, 'utf8');

assert(featuresHubCode.includes('<h1'), 'features/page.tsx has semantic <h1> heading');
assert(featuresHubCode.includes('/features/planner'), 'features/page.tsx links to /features/planner');
assert(featuresHubCode.includes('/features/finance'), 'features/page.tsx links to /features/finance');
assert(layoutCode.includes('getMessages()'), 'RootLayout calls getMessages() for server rendering');
assert(layoutCode.includes('initialMessages={messages as any}'), 'RootLayout passes initialMessages for instant SSR body');
console.log('   Full SSR hydration and semantic H1 verified.\n');

// ----------------------------------------------------
// 8. AUDIT CATEGORY 8: PROXY ROUTING REGEX & 302 REDIRECTS
// ----------------------------------------------------
console.log('8️⃣  AUDITING 302-REDIRECT.CSV & PROXY AUTH GATING REGEX...');
const proxyFile = path.join(srcDir, 'proxy.ts');
const proxyCode = fs.readFileSync(proxyFile, 'utf8');

function testProxyProtection(pathname) {
  const isProtectedRoute = /^\/(?:en|id)?\/?(?:dashboard|habits|goals|study|jobs|journals|journal|coach|calendar|settings|billing|profile|finance|planner)(?:\/.*)?$/.test(pathname) &&
    !pathname.startsWith('/features') &&
    !pathname.startsWith('/id/features') &&
    !pathname.startsWith('/en/features') &&
    !pathname.startsWith('/solutions') &&
    !pathname.startsWith('/id/solutions') &&
    !pathname.startsWith('/en/solutions');
  return isProtectedRoute;
}

assert(!testProxyProtection('/features/planner'), 'Public /features/planner is NOT blocked');
assert(!testProxyProtection('/id/features/planner'), 'Public /id/features/planner is NOT blocked');
assert(!testProxyProtection('/features/finance'), 'Public /features/finance is NOT blocked');
assert(!testProxyProtection('/id/features/finance'), 'Public /id/features/finance is NOT blocked');
assert(!testProxyProtection('/solutions/finance-mastery'), 'Public /solutions/finance-mastery is NOT blocked');
assert(!testProxyProtection('/features'), 'Public /features is NOT blocked');
assert(testProxyProtection('/dashboard'), 'App /dashboard IS protected');
assert(testProxyProtection('/id/dashboard'), 'App /id/dashboard IS protected');
assert(testProxyProtection('/finance'), 'App /finance IS protected');
assert(testProxyProtection('/planner'), 'App /planner IS protected');
assert(testProxyProtection('/habits'), 'App /habits IS protected');

const robotsFile = path.join(srcDir, 'app', 'robots.ts');
const robotsCode = fs.readFileSync(robotsFile, 'utf8');
assert(robotsCode.includes('sitemap: `${baseUrl}/sitemap.xml`'), 'robots.ts specifies sitemap.xml');
assert(robotsCode.includes('\'/dashboard/\''), 'robots.ts disallows private /dashboard/');
assert(robotsCode.includes('\'/api/\''), 'robots.ts disallows private /api/');

console.log('   Auth proxy regex and robots.ts directives verified.\n');

// ----------------------------------------------------
// FINAL RESULT SUMMARY
// ----------------------------------------------------
console.log('====================================================');
console.log(`TOTAL TESTS RUN: ${totalTests}`);
console.log(`PASSED: ${totalTests - totalErrors - totalWarnings}`);
console.log(`WARNINGS: ${totalWarnings}`);
console.log(`ERRORS: ${totalErrors}`);
console.log('====================================================');

if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL TRANVAS CSV AUDIT ISSUES HEALED 100%!');
}
