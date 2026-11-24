import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tranvas — The Unified Life OS',
    short_name: 'Tranvas',
    description:
      'Unified Life Operating System combining Daily Planner, 28-Day Habit Matrix, Zero-Based Finance, WOOP Goals, Career Pipeline, Mindful Journal, Study & Calendar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    orientation: 'portrait-primary',
    categories: ['productivity', 'finance', 'lifestyle', 'education'],
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
