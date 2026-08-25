import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
 
const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isProtectedRoute = 
    req.nextUrl.pathname.includes('/dashboard') || 
    req.nextUrl.pathname.includes('/planner') || 
    req.nextUrl.pathname.includes('/finance') || 
    req.nextUrl.pathname.includes('/habits');

  if (isProtectedRoute && !req.auth) {
    const loginUrl = new URL('/id/login', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  return intlMiddleware(req);
});
 
export const config = {
  // Match all pathnames except api, _next, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
