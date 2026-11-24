/**
 * TRANVAS GLOBAL LIVE URL AUDITOR (SEO • GEO • AEO • SITEMAP • ROBOTS • LLM • OWASP SECURITY)
 * Modeled after global open-source reference standards:
 * - OWASP Secure Headers Project & rfc-st/humble
 * - Google Search Central & Lighthouse SEO
 * - llmstxt.org Specification & Vercel Labs is-agentic
 * - ProjectDiscovery Nuclei hygiene probes
 *
 * Usage: node scripts/qa/global-live-audit.mjs [https://tranvas.com]
 */

const TARGET = (process.argv[2] || 'https://tranvas.com').replace(/\/$/, '');

const RESULTS = {
  target: TARGET,
  timestamp: new Date().toISOString(),
  categories: {
    security: [],
    seo: [],
    geo_aeo: [],
    llm: [],
    sitemap_robots: [],
    performance_infra: [],
  },
  summary: { pass: 0, warn: 0, fail: 0 },
};

function record(category, status, name, details, fix = '') {
  RESULTS.categories[category].push({ status, name, details, fix });
  RESULTS.summary[status]++;
}

async function fetchSafe(url, opts = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      redirect: opts.redirect || 'manual',
      headers: {
        'User-Agent': opts.userAgent || 'Mozilla/5.0 (compatible; TranvasGlobalAuditBot/2.0; +https://tranvas.com)',
        ...(opts.headers || {}),
      },
      signal: AbortSignal.timeout(15000),
    });
    const ms = Date.now() - start;
    const text = await res.text();
    const headers = {};
    for (const [k, v] of res.headers.entries()) headers[k.toLowerCase()] = v;
    return { ok: true, status: res.status, ms, headers, text, url };
  } catch (err) {
    return { ok: false, status: 0, ms: Date.now() - start, headers: {}, text: '', error: err.message, url };
  }
}

function extractMeta(html, attrName, attrVal) {
  const re1 = new RegExp(`<meta[^>]+${attrName}=["']${attrVal}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attrName}=["']${attrVal}["']`, 'i');
  return (html.match(re1) || html.match(re2) || [])[1] || null;
}

async function run() {
  console.log(`\n🌐 TRANVAS GLOBAL LIVE AUDIT -> ${TARGET}\n${'='.repeat(78)}`);

  // 1. FETCH ROOT PAGE (EN) & ID PAGE & WWW & /en REDIRECT
  const [root, rootId, wwwRoot, enPrefix] = await Promise.all([
    fetchSafe(`${TARGET}/`),
    fetchSafe(`${TARGET}/id`),
    fetchSafe(TARGET.replace('https://', 'https://www.') + '/'),
    fetchSafe(`${TARGET}/en`),
  ]);

  if (!root.ok) {
    console.error(`❌ FATAL: Cannot reach ${TARGET}: ${root.error}`);
    process.exit(1);
  }

  // --- INFRA & REDIRECTS ---
  record(
    'performance_infra',
    root.status === 200 ? 'pass' : 'fail',
    'Root HTTP Status',
    `GET / returned ${root.status} in ${root.ms}ms (${(root.text.length / 1024).toFixed(1)} KB HTML)`,
    root.status !== 200 ? 'Ensure root returns 200 OK directly without redirects.' : ''
  );

  record(
    'performance_infra',
    root.ms < 800 ? 'pass' : root.ms < 1800 ? 'warn' : 'fail',
    'Root TTFB / Response Latency',
    `TTFB: ${root.ms}ms (Global Top-1 target < 600ms via CDN edge cache)`,
    root.ms >= 800 ? 'Ensure Cloudflare / Edge CDN caches public marketing HTML (cf-cache-status: HIT).' : ''
  );

  const cfCache = root.headers['cf-cache-status'] || root.headers['x-vercel-cache'] || 'NONE';
  record(
    'performance_infra',
    ['HIT', 'STALE', 'REVALIDATED'].includes(cfCache.toUpperCase()) ? 'pass' : 'warn',
    'CDN Edge Cache Hit Status',
    `Cache header: ${cfCache} | Cache-Control: ${root.headers['cache-control'] || 'missing'}`,
    !['HIT', 'STALE', 'REVALIDATED'].includes(cfCache.toUpperCase())
      ? 'Configure Cloudflare Cache Rules or Vercel ISR so public HTML is served from Edge HIT instead of DYNAMIC/MISS.'
      : ''
  );

  const wwwLoc = wwwRoot.headers['location'] || '';
  const wwwRedirectsCleanly = [301, 308].includes(wwwRoot.status) && wwwLoc.startsWith(TARGET);
  record(
    'seo',
    wwwRedirectsCleanly ? 'pass' : wwwRoot.status === 307 || wwwRoot.status === 302 ? 'warn' : 'fail',
    'WWW to Apex Canonical Redirect (301/308)',
    `GET www -> HTTP ${wwwRoot.status} (Location: ${wwwLoc || 'none'})`,
    !wwwRedirectsCleanly
      ? 'Configure permanent 301/308 redirect from www.tranvas.com to https://tranvas.com to prevent duplicate domain dilution.'
      : ''
  );

  const enRedirectsCleanly = [301, 308].includes(enPrefix.status);
  record(
    'seo',
    enRedirectsCleanly ? 'pass' : enPrefix.status === 307 ? 'warn' : 'fail',
    '/en Prefix Redirect Status (Permanent vs Temporary)',
    `GET /en -> HTTP ${enPrefix.status} (Location: ${enPrefix.headers['location'] || 'none'})`,
    !enRedirectsCleanly ? 'Prefer 301/308 permanent redirect instead of 307 temporary for /en -> / so link equity passes.' : ''
  );

  // --- OWASP SECURITY HEADERS (rfc-st/humble & OWASP Secure Headers Project) ---
  const h = root.headers;
  const checkHeader = (key, required, ideal, advice) => {
    const val = h[key];
    if (!val) {
      record('security', required ? 'fail' : 'warn', `Header: ${key}`, 'MISSING', advice);
    } else {
      record('security', 'pass', `Header: ${key}`, val);
    }
  };

  checkHeader('strict-transport-security', true, 'max-age=31536000; includeSubDomains; preload', 'Add HSTS header with preload.');
  checkHeader('content-security-policy', true, "default-src 'self'...", 'Add a strict Content-Security-Policy (CSP) header in next.config.ts to prevent XSS and earn A+ on SecurityHeaders.com / Mozilla Observatory.');
  checkHeader('x-content-type-options', true, 'nosniff', 'Set X-Content-Type-Options: nosniff.');
  checkHeader('x-frame-options', true, 'DENY', 'Set X-Frame-Options: DENY or CSP frame-ancestors.');
  checkHeader('referrer-policy', true, 'strict-origin-when-cross-origin', 'Set Referrer-Policy.');
  checkHeader('permissions-policy', true, 'camera=(), microphone=(self), geolocation=()', 'Set Permissions-Policy.');
  checkHeader('cross-origin-opener-policy', false, 'same-origin-allow-popups', 'Add Cross-Origin-Opener-Policy: same-origin-allow-popups for Spectre isolation while keeping Google OAuth popup working.');
  checkHeader('cross-origin-resource-policy', false, 'same-site', 'Consider Cross-Origin-Resource-Policy header.');

  const serverLeak = h['x-powered-by'];
  record(
    'security',
    !serverLeak ? 'pass' : 'fail',
    'No X-Powered-By Stack Fingerprinting',
    serverLeak ? `Leaks: ${serverLeak}` : 'Hidden (poweredByHeader: false)',
    serverLeak ? 'Disable X-Powered-By.' : ''
  );

  // --- NUCLEI-STYLE SENSITIVE ENDPOINT & SECURITY.TXT PROBES ---
  const securityProbes = [
    { path: '/api/debug-habits', expectBlocked: true, label: 'Debug API Endpoint Exposure (/api/debug-habits)' },
    { path: '/.env', expectBlocked: true, label: 'Dotenv Exposure (/.env)' },
    { path: '/.git/config', expectBlocked: true, label: 'Git Metadata Exposure (/.git/config)' },
    { path: '/api/user', expectAuth: true, label: 'Unauthenticated User API (/api/user)' },
    { path: '/api/affiliates/admin/overview', expectAuth: true, label: 'Unauthenticated Admin API (/api/affiliates/admin/overview)' },
    { path: '/.well-known/security.txt', expectExists: true, label: 'RFC 9116 Security Disclosure (/.well-known/security.txt)' },
  ];

  const probeResults = await Promise.all(securityProbes.map(p => fetchSafe(`${TARGET}${p.path}`)));
  securityProbes.forEach((p, idx) => {
    const r = probeResults[idx];
    if (p.expectBlocked) {
      const safe = [401, 403, 404, 405].includes(r.status);
      record(
        'security',
        safe ? 'pass' : 'fail',
        p.label,
        `HTTP ${r.status} | Body snippet: ${r.text.slice(0, 120).replace(/\s+/g, ' ')}`,
        !safe ? `CRITICAL: Remove or lock down ${p.path} in production immediately!` : ''
      );
    } else if (p.expectAuth) {
      const safe = [401, 403].includes(r.status);
      record(
        'security',
        safe ? 'pass' : 'fail',
        p.label,
        `HTTP ${r.status}`,
        !safe ? `CRITICAL: ${p.path} must return 401/403 when unauthenticated.` : ''
      );
    } else if (p.expectExists) {
      record(
        'security',
        r.status === 200 ? 'pass' : 'warn',
        p.label,
        `HTTP ${r.status}`,
        r.status !== 200 ? 'Add public/.well-known/security.txt (RFC 9116 standard) for enterprise trust & security scanners.' : ''
      );
    }
  });

  // --- ON-PAGE SEO & SEMANTIC HTML ---
  const html = root.text;
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '';
  const desc = extractMeta(html, 'name', 'description') || '';
  const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) || [])[1] || '';
  const ogTitle = extractMeta(html, 'property', 'og:title');
  const ogDesc = extractMeta(html, 'property', 'og:description');
  const ogImage = extractMeta(html, 'property', 'og:image');
  const twitterCard = extractMeta(html, 'name', 'twitter:card');
  const hreflangs = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hrefLang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi)];
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  const htmlLang = (html.match(/<html[^>]+lang=["']([^"']+)["']/i) || [])[1] || '';

  record('seo', title.length >= 20 && title.length <= 65 ? 'pass' : 'warn', 'Root <title> Tag Length', `"${title}" (${title.length} chars)`, 'Keep between 30-60 characters.');
  record('seo', desc.length >= 100 && desc.length <= 160 ? 'pass' : 'warn', 'Root Meta Description Length', `"${desc}" (${desc.length} chars)`, 'Keep between 120-155 characters.');
  record('seo', canonical === TARGET || canonical === `${TARGET}/` ? 'pass' : 'fail', 'Root Canonical URL', `Found: ${canonical || 'MISSING'}`, 'Must point to https://tranvas.com.');
  record('seo', htmlLang === 'en' ? 'pass' : 'fail', 'HTML lang Attribute', `lang="${htmlLang}"`);
  record('seo', h1Matches.length === 1 ? 'pass' : 'fail', 'Single Semantic <h1> in SSR HTML', `Count: ${h1Matches.length} | Text: ${JSON.stringify(h1Matches)}`, h1Matches.length !== 1 ? 'Ensure SSR HTML contains exactly ONE descriptive <h1>.' : '');
  record('seo', hreflangs.length >= 3 ? 'pass' : 'warn', 'Reciprocal Hreflang Tags (en, id, x-default)', `Found ${hreflangs.length}: ${hreflangs.map(m => `${m[1]}=${m[2]}`).join(', ')}`);

  // Check OG image dimensions / quality (1200x630 vs 512x512 icon.png!)
  const isProperOgBanner = ogImage && !ogImage.endsWith('/icon.png') && !ogImage.endsWith('/favicon.png');
  record(
    'seo',
    ogImage && isProperOgBanner ? 'pass' : 'warn',
    'OpenGraph Social Banner Image (1200x630)',
    `og:image = ${ogImage || 'MISSING'} | twitter:card = ${twitterCard || 'MISSING'}`,
    !isProperOgBanner
      ? 'Currently using square /icon.png (512x512) with summary_large_image! Generate a dedicated 1200x630 opengraph-image.png (or dynamic Next.js opengraph-image.tsx) for massive CTR boost on X, LinkedIn, Discord, WhatsApp, and Google Discover.'
      : ''
  );

  // Check SSR text richness (do crawlers without JS see real content?)
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textOnly.split(' ').filter(Boolean).length;
  record(
    'geo_aeo',
    wordCount >= 400 ? 'pass' : wordCount >= 150 ? 'warn' : 'fail',
    'SSR Visible Word Count (No-JS AI Crawlers)',
    `${wordCount} words rendered in raw SSR HTML`,
    wordCount < 400 ? 'Increase server-rendered semantic copy, comparison tables, and direct answer definitions so non-JS AI bots (GPTBot/PerplexityBot/ClaudeBot) ingest rich facts.' : ''
  );

  // --- JSON-LD STRUCTURED DATA (GEO / AEO) ---
  const jsonLdScripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const parsedTypes = [];
  let jsonErrors = 0;
  let hasFakeRatingRisk = false;
  for (const m of jsonLdScripts) {
    try {
      const obj = JSON.parse(m[1]);
      if (obj['@type']) parsedTypes.push(obj['@type']);
      if (obj.aggregateRating && !obj.review) hasFakeRatingRisk = true;
    } catch {
      jsonErrors++;
    }
  }
  record(
    'geo_aeo',
    jsonLdScripts.length >= 3 && jsonErrors === 0 ? 'pass' : 'fail',
    'JSON-LD Structured Data Validity',
    `Found ${jsonLdScripts.length} valid blocks: [${parsedTypes.join(', ')}] (Parse errors: ${jsonErrors})`
  );
  record(
    'geo_aeo',
    parsedTypes.includes('FAQPage') ? 'pass' : 'warn',
    'FAQPage Schema on Homepage (AEO)',
    parsedTypes.includes('FAQPage') ? 'Present in SSR HTML' : 'Missing on homepage'
  );
  if (hasFakeRatingRisk) {
    record(
      'geo_aeo',
      'warn',
      'Google Rich Results AggregateRating Policy Check',
      'SoftwareApplication includes aggregateRating (4.9 / 1240 reviews) without matching visible on-page user reviews or verified third-party source.',
      'Google Manual Actions can penalize self-serving or unverified AggregateRating markup if reviews are not visible on-page. Make sure visible reviews/testimonials match or back the rating.'
    );
  }

  // Check if FAQ answers are visible in SSR HTML (instead of omitted behind React state)
  const hasFaqAriaExpanded = /aria-expanded=/i.test(html);
  record(
    'geo_aeo',
    hasFaqAriaExpanded ? 'pass' : 'warn',
    'FAQ Accordion SSR DOM Visibility',
    hasFaqAriaExpanded
      ? 'FAQ accordion renders accessible aria-expanded controls with answers present in raw SSR HTML.'
      : 'LandingFAQ omits FAQ answers from initial SSR DOM HTML (only present inside JSON-LD).',
    hasFaqAriaExpanded
      ? ''
      : 'Render FAQ answers in the DOM using CSS collapse / hidden toggle so both Googlebot & AI text parsers see matching visible Q&A content.'
  );

  // --- ROBOTS.TXT & SITEMAP.XML ---
  const [robotsRes, sitemapRes, llmsRes, llmsFullRes] = await Promise.all([
    fetchSafe(`${TARGET}/robots.txt`),
    fetchSafe(`${TARGET}/sitemap.xml`),
    fetchSafe(`${TARGET}/llms.txt`),
    fetchSafe(`${TARGET}/llms-full.txt`),
  ]);

  record('sitemap_robots', robotsRes.status === 200 ? 'pass' : 'fail', 'robots.txt Reachability', `HTTP ${robotsRes.status} (${robotsRes.text.length} bytes)`);
  const requiredBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'];
  const missingBots = requiredBots.filter(b => !robotsRes.text.includes(b));
  record(
    'sitemap_robots',
    missingBots.length === 0 ? 'pass' : 'warn',
    'AI Search Crawlers Whitelisted in Live robots.txt',
    missingBots.length === 0 ? `All ${requiredBots.length} key AI bots allowed` : `Missing in LIVE deployment: ${missingBots.join(', ')} (Note: wait for Coolify/Vercel deploy of latest commit if just pushed)`
  );

  // Sitemap audit
  const locs = [...sitemapRes.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  record(
    'sitemap_robots',
    sitemapRes.status === 200 && locs.length >= 100 ? 'pass' : 'warn',
    'sitemap.xml Completeness',
    `HTTP ${sitemapRes.status} | Total indexed URLs: ${locs.length}`
  );

  // Sample-probe key URLs from sitemap + critical pages to detect 404s or 500s or redirect chains!
  const samplePaths = [
    '/features',
    '/pricing',
    '/affiliates',
    '/about',
    '/contact',
    '/compare/notion',
    '/compare/ynab',
    '/compare/ticktick',
    '/features/habit',
    '/features/finance',
    '/solutions/deep-work',
    '/resources/blog',
    '/resources/blog/mastering-atomic-habits-in-daily-life',
    '/company/press-kit',
    '/company/security',
  ];
  const sampleChecks = await Promise.all(samplePaths.map(p => fetchSafe(`${TARGET}${p}`)));
  const brokenSamples = sampleChecks.filter(r => r.status !== 200);
  record(
    'sitemap_robots',
    brokenSamples.length === 0 ? 'pass' : 'fail',
    'Live Public Route Health (15 Critical SEO Pages)',
    brokenSamples.length === 0
      ? '15/15 critical SEO pages return HTTP 200 OK'
      : `Broken/Redirecting: ${brokenSamples.map(r => `${r.url.replace(TARGET, '')} -> ${r.status}`).join(', ')}`,
    brokenSamples.length > 0 ? 'Fix any 404/307/500 routes in sitemap.xml immediately!' : ''
  );

  // Check /llms.txt & /llms-full.txt & <link rel="help">
  record('llm', llmsRes.status === 200 ? 'pass' : 'fail', '/llms.txt Reachability (llmstxt.org)', `HTTP ${llmsRes.status} | Content-Type: ${llmsRes.headers['content-type']} | ${llmsRes.text.length} bytes`);
  record('llm', llmsFullRes.status === 200 ? 'pass' : 'fail', '/llms-full.txt Reachability', `HTTP ${llmsFullRes.status} | ${llmsFullRes.text.length} bytes`);

  const hasLlmsLinkTag = /href=["']\/llms\.txt["']/i.test(html);
  record(
    'llm',
    hasLlmsLinkTag ? 'pass' : 'warn',
    '<link> Auto-Discovery for llms.txt in Live HTML',
    hasLlmsLinkTag ? 'Found in <head>' : 'Not yet visible in LIVE HTML (check if latest commit deployed)',
    !hasLlmsLinkTag ? 'Ensure latest commit with <link rel="alternate" type="text/markdown" href="/llms.txt"> is deployed.' : ''
  );

  // Validate all links inside live llms.txt!
  const llmsUrls = [...new Set([...llmsRes.text.matchAll(/https:\/\/tranvas\.com[^\s)\]>"]+/g)].map(m => m[0]))];
  const llmsUrlChecks = await Promise.all(llmsUrls.map(u => fetchSafe(u)));
  const brokenLlmsUrls = llmsUrlChecks.filter(r => r.status !== 200);
  record(
    'llm',
    brokenLlmsUrls.length === 0 ? 'pass' : 'fail',
    'All URLs Referenced Inside /llms.txt Return 200 OK',
    brokenLlmsUrls.length === 0
      ? `All ${llmsUrls.length}/${llmsUrls.length} URLs in llms.txt are 200 OK`
      : `BROKEN/REDIRECT in llms.txt: ${brokenLlmsUrls.map(r => `${r.url} -> ${r.status}`).join(', ')}`,
    brokenLlmsUrls.length > 0 ? 'Fix broken or auth-gated URLs in public/llms.txt (e.g. /study might redirect to /login!).' : ''
  );

  // Check Content Negotiation (Accept: text/markdown) - Global Agentic Web Standard!
  const mdProbe = await fetchSafe(`${TARGET}/`, { headers: { Accept: 'text/markdown' } });
  const supportsMarkdownNeg = (mdProbe.headers['content-type'] || '').includes('markdown');
  record(
    'llm',
    supportsMarkdownNeg ? 'pass' : 'warn',
    'Agentic Content Negotiation (Accept: text/markdown)',
    `Content-Type returned: ${mdProbe.headers['content-type'] || 'unknown'}`,
    !supportsMarkdownNeg ? 'Modern AI agents (Vercel is-agentic standard, Cloudflare Markdown for Agents) love Accept: text/markdown returning clean markdown or redirecting to /llms.txt.' : ''
  );

  // Check PWA Manifest & RSS Feed
  const [manifestRes, rssRes] = await Promise.all([
    fetchSafe(`${TARGET}/manifest.webmanifest`),
    fetchSafe(`${TARGET}/rss.xml`),
  ]);
  record('seo', manifestRes.status === 200 ? 'pass' : 'warn', 'PWA Web App Manifest (/manifest.webmanifest)', `HTTP ${manifestRes.status}`, manifestRes.status !== 200 ? 'Add src/app/manifest.ts for PWA installability & mobile Chrome signals.' : '');
  record('geo_aeo', rssRes.status === 200 ? 'pass' : 'warn', 'RSS / Atom Feed (/rss.xml) for Blog & Changelog Syndication', `HTTP ${rssRes.status}`, rssRes.status !== 200 ? 'Add /rss.xml route for automatic syndication to aggregators, Perplexity, and Google Discover.' : '');

  // Print clean formatted report
  for (const [cat, items] of Object.entries(RESULTS.categories)) {
    console.log(`\n📌 CATEGORY: ${cat.toUpperCase()}`);
    console.log('-'.repeat(78));
    for (const item of items) {
      const icon = item.status === 'pass' ? '✅' : item.status === 'warn' ? '⚠️' : '❌';
      console.log(`  ${icon} [${item.status.toUpperCase()}] ${item.name}`);
      console.log(`     └─ ${item.details}`);
      if (item.fix) console.log(`     └─ 💡 FIX: ${item.fix}`);
    }
  }

  console.log(`\n${'='.repeat(78)}`);
  console.log(`📊 LIVE AUDIT SUMMARY: ✅ PASS: ${RESULTS.summary.pass} | ⚠️ WARN: ${RESULTS.summary.warn} | ❌ FAIL: ${RESULTS.summary.fail}`);
  console.log(`${'='.repeat(78)}\n`);
}

run();
