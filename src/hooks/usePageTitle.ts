'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { getRouteTitle, SITE_NAME } from '@/lib/titles';

/**
 * Sets the browser tab title for client-side pages following global SaaS and SEO/GEO standards.
 * Usage: usePageTitle('Planner — Focus & Time Blocking') → "Planner — Focus & Time Blocking | Tranvas"
 * Usage: usePageTitle('Tranvas — The Unified Life OS...') → "Tranvas — The Unified Life OS..."
 * Usage: usePageTitle() → automatically resolves based on active route and locale
 */
export function usePageTitle(pageTitle?: string) {
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    let finalTitle = '';

    if (pageTitle && pageTitle.trim()) {
      // Strip any em-dash AI slogan if provided
      let clean = pageTitle.split('—')[0].trim();
      clean = clean.replace(/\s*\|\s*Tranvas\s*$/i, '').trim();
      finalTitle = clean.toLowerCase().includes('tranvas') ? clean : `${clean} | ${SITE_NAME}`;
    } else {
      const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
      finalTitle = getRouteTitle(path, locale);
    }

    if (typeof document !== 'undefined') {
      document.title = finalTitle;
    }

    // Persist title through Next.js client-side router transitions
    const timeout = setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.title = finalTitle;
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [pageTitle, pathname, locale]);
}
