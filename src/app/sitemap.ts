import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://tranvas.com';
  const locales = ['en', 'id'];
  const routes = [
    '',
    '/features',
    '/pricing',
    '/login',
    '/register',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/solutions/deep-work',
    '/solutions/second-brain',
    '/solutions/student',
    '/solutions/finance-mastery',
    '/solutions/career-accelerator',
    '/solutions/mental-clarity',
    '/solutions/atomic-system',
    '/solutions/freelancer',
    '/solutions/personalgrowth',
    '/features/planner',
    '/features/habit',
    '/features/finance',
    '/features/journal',
    '/features/neural-os',
    '/features/job',
    '/resources/blog',
    '/resources/guide',
    '/resources/changelog',
    '/resources/community',
    '/resources/stories',
    '/resources/ai-trust',
    '/resources/help'
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
