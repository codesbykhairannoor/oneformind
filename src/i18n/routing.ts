import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['en', 'id'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // PERF/SEO: Prevent Set-Cookie: NEXT_LOCALE on anonymous public pages so Vercel/Cloudflare CDN can edge-cache HTML (HIT)
  localeCookie: false,
  localeDetection: false
});
 
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
