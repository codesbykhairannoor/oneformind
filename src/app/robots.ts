import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://tranvas.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard/',
          '/id/dashboard/',
          '/habits/',
          '/id/habits/',
          '/finance/',
          '/id/finance/',
          '/planner/',
          '/id/planner/',
          '/goals/',
          '/id/goals/',
          '/study/',
          '/id/study/',
          '/jobs/',
          '/id/jobs/',
          '/journals/',
          '/id/journals/',
          '/settings/',
          '/id/settings/',
          '/billing/',
          '/id/billing/',
          '/profile/',
          '/id/profile/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
