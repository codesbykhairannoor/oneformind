import { BLOG_POSTS } from '@/lib/blogPosts';

const BASE_URL = process.env.APP_URL || 'https://tranvas.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const itemsXml = BLOG_POSTS.map((post) => {
    const link = `${BASE_URL}/resources/blog/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(post.isoDate).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <author>editorial@tranvas.com (${escapeXml(post.author.name)})</author>
    </item>`;
  }).join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tranvas — Life OS Journal &amp; Engineering Insights</title>
    <link>${BASE_URL}</link>
    <description>Research-backed essays on Atomic Habits, Deep Work, Zero-Based Personal Finance, WOOP Goal Cascading, and building a Second Brain with Tranvas Life OS.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
