import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_URL || 'https://tranvas.com';

  const privateRoutes = [
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
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privateRoutes,
      },
      // GEO Standards: Explicitly welcoming AI search crawlers to index marketing & documentation
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Applebot-Extended',
          'Google-Extended',
          'OAI-SearchBot',
          'CCBot',
          'cohere-ai',
          'Meta-ExternalAgent',
          'DuckAssistBot',
          'YouBot',
          'Diffbot',
        ],
        allow: '/',
        disallow: privateRoutes,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
