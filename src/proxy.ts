import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Next.js 16: file renamed from middleware.ts to proxy.ts
// Using named export `proxy` as required by the new API
export const proxy = async (req: NextRequest) => {
  // 1. Run next-intl middleware first to handle locale routing and headers
  const intlResponse = intlMiddleware(req);

  // 2. Pass intlResponse to Supabase updateSession to sync cookies and handle auth redirects safely
  return await updateSession(req, intlResponse);
};

export const config = {
  // Match all pathnames except api, _next, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
