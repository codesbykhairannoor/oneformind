import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://tranvas.com';
  
  // Public indexable routes
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/features', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms-of-service', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // Feature Subpages
    { path: '/features/planner', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/habit', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/finance', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/journal', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/neural-os', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/job', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/goal', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/features/calendar', priority: 0.85, changeFrequency: 'weekly' as const },

    // Solutions Subpages
    { path: '/solutions/deep-work', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/second-brain', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/student', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/finance-mastery', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/career-accelerator', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/mental-clarity', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/atomic-system', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/freelancer', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/solutions/personalgrowth', priority: 0.8, changeFrequency: 'weekly' as const },

    // Resources Subpages
    { path: '/resources/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/resources/guide', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/resources/changelog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/resources/community', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/resources/stories', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/resources/ai-trust', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/resources/help', priority: 0.7, changeFrequency: 'weekly' as const },

    // Auth
    { path: '/login', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/register', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // English (defaultLocale: 'en' with localePrefix: 'as-needed' -> NO /en prefix)
  routes.forEach((route) => {
    const enUrl = route.path === '' ? baseUrl : `${baseUrl}${route.path}`;
    const idUrl = route.path === '' ? `${baseUrl}/id` : `${baseUrl}/id${route.path}`;

    sitemapEntries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          id: idUrl,
        },
      },
    });

    // Indonesian (prefixed with /id)
    sitemapEntries.push({
      url: idUrl,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          id: idUrl,
        },
      },
    });
  });

  return sitemapEntries;
}
