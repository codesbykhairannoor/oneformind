import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname;

  // Check if request has any supabase auth cookie
  const hasAuthCookie = request.cookies.has('sb-access-token') || 
    request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.includes('-auth-token'));

  // Strictly match top-level application / dashboard routes
  const isProtectedRoute = /^\/(?:en|id)?\/?(?:dashboard|habits|goals|study|jobs|journals|journal|coach|calendar|settings|billing|profile|finance|planner)(?:\/.*)?$/.test(pathname) &&
    !pathname.startsWith('/features') &&
    !pathname.startsWith('/id/features') &&
    !pathname.startsWith('/en/features') &&
    !pathname.startsWith('/solutions') &&
    !pathname.startsWith('/id/solutions') &&
    !pathname.startsWith('/en/solutions');

  const isLandingOrAuthPage = pathname === '/' || pathname === '/id' || pathname === '/en' ||
    pathname.includes('/login') || pathname.includes('/register');

  // Fast-path: Protected route with NO auth cookie at all -> Redirect immediately to login
  if (isProtectedRoute && !hasAuthCookie) {
    const isIndonesian = pathname.startsWith('/id');
    const redirectUrl = new URL(isIndonesian ? '/id/login' : '/login', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return redirectResponse;
  }

  // If there's an auth cookie, verify the user with Supabase
  if (hasAuthCookie) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Case 1: Authenticated user visiting landing page or auth pages -> Redirect to dashboard
      if (user?.email && isLandingOrAuthPage) {
        const locale = (pathname.startsWith('/en') || pathname === '/en') ? 'en' : 'id';
        const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        // Sync any refreshed session cookies to the redirect response
        response.cookies.getAll().forEach(c => redirectResponse.cookies.set(c.name, c.value, c));
        redirectResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        return redirectResponse;
      }

      // Case 2: Unauthenticated / expired user visiting protected route -> Redirect to login
      if (!user?.email && isProtectedRoute) {
        const isIndonesian = pathname.startsWith('/id');
        const redirectUrl = new URL(isIndonesian ? '/id/login' : '/login', request.url);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        redirectResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        return redirectResponse;
      }
    } catch (e) {
      console.error('Supabase auth check error in middleware:', e);
    }
  }

  return response;
}
