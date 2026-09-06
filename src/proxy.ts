import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createMiddleware(routing);

// Next.js 16: file renamed from middleware.ts to proxy.ts
// Using named export `proxy` as required by the new API
export const proxy = async (req: any) => {
  const pathname = req.nextUrl.pathname;
  
  // Fast cookie check without network calls
  const hasAuthCookie = req.cookies.has('sb-access-token') || 
    req.cookies.getAll().some((c: any) => c.name.startsWith('sb-') && c.name.includes('-auth-token'));

  // Strictly match top-level application / dashboard routes, NOT public marketing pages like /features/* or /solutions/*
  const isProtectedRoute = /^\/(?:en|id)?\/?(?:dashboard|habits|goals|study|jobs|journals|journal|coach|calendar|settings|billing|profile|finance|planner)(?:\/.*)?$/.test(pathname) &&
    !pathname.startsWith('/features') &&
    !pathname.startsWith('/id/features') &&
    !pathname.startsWith('/en/features') &&
    !pathname.startsWith('/solutions') &&
    !pathname.startsWith('/id/solutions') &&
    !pathname.startsWith('/en/solutions');

  // Fast-path 1: Protected route with NO auth cookie -> Redirect instantly without querying Supabase
  if (isProtectedRoute && !hasAuthCookie) {
    const isIndonesian = pathname.startsWith('/id');
    const loginUrl = new URL(isIndonesian ? '/id/login' : '/login', req.url);
    return Response.redirect(loginUrl);
  }

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  
  // Fast-path 2: Logged-in user visiting landing or auth pages -> Redirect to dashboard
  if ((pathname === '/' || pathname === '/id' || pathname === '/en' || isAuthPage) && hasAuthCookie) {
    const locale = (pathname.startsWith('/en') || pathname === '/en') ? 'en' : 'id';
    return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // Fast-path 3: Public marketing routes & anonymous users -> Skip Supabase network call completely!
  let supabaseResponse = null;
  if (hasAuthCookie && isProtectedRoute) {
    supabaseResponse = await updateSession(req);
  }

  // Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(req);
  
  // Merge updated Supabase session cookies if present
  if (supabaseResponse) {
    supabaseResponse.cookies.getAll().forEach((cookie: any) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
  }

  return intlResponse;
};
 
export const config = {
  // Match all pathnames except api, _next, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
