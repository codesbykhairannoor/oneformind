'use client';

import { useEffect } from 'react';

const SITE_NAME = 'Tranvas';

/**
 * Sets the browser tab title for client-side pages.
 * Usage: usePageTitle('Dashboard') → "Dashboard | Tranvas"
 * Usage: usePageTitle('') → "Tranvas | Productivity OS"
 */
export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    const newTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : `${SITE_NAME} | Productivity OS`;
    
    document.title = newTitle;
    
    // Bypass Next.js App Router metadata overriding the client title on navigation
    const timeout = setTimeout(() => {
      document.title = newTitle;
    }, 50);

    return () => clearTimeout(timeout);
  }, [pageTitle]);
}
