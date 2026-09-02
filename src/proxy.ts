import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createMiddleware(routing);

// Next.js 16: file renamed from middleware.ts to proxy.ts
// Using named export `proxy` as required by the new API
export const proxy = async (req: any) => {
  // Update Supabase session
  const supabaseResponse = await updateSession(req);
  
  const isProtectedRoute = 
    req.nextUrl.pathname.includes('/dashboard') || 
    req.nextUrl.pathname.includes('/planner') || 
    req.nextUrl.pathname.includes('/finance') || 
    req.nextUrl.pathname.includes('/habits') ||
    req.nextUrl.pathname.includes('/goals') ||
    req.nextUrl.pathname.includes('/study') ||
    req.nextUrl.pathname.includes('/jobs') ||
    req.nextUrl.pathname.includes('/journals');

  // Supabase stores user session in cookies which updateSession verifies
  // However, in Next.js middleware it's often easier to check auth status by retrieving the user.
  // Actually, updateSession already refreshes the token, so we can just let layout/page handle hard redirects, 
  // or check the Supabase cookie directly.
  
  // Since we don't want to make a network request to Supabase on every single static route,
  // we let the server components (layout.tsx) handle the strict redirect.
  // But for simple middleware protection, if it's protected and they have no supabase cookie:
  const hasAuthCookie = req.cookies.has('sb-access-token') || req.cookies.getAll().some((c: any) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
  
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL('/id/login', req.url);
    return Response.redirect(loginUrl);
  }

  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  
  if ((pathname === '/' || pathname === '/id' || pathname === '/en' || isAuthPage) && hasAuthCookie) {
    const locale = (pathname.startsWith('/en') || pathname === '/en') ? 'en' : 'id';
    return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // Copy cookies from supabaseResponse to the final intlResponse
  const intlResponse = intlMiddleware(req);
  
  // Need to merge cookies
  supabaseResponse.cookies.getAll().forEach((cookie: any) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
};
 
export const config = {
  // Match all pathnames except api, _next, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
