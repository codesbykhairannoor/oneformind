import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

const ROUTE_MAP: Record<string, string> = {
    '/api/finance/transactions': 'finance-transactions',
    '/api/finance/categories': 'finance-categories',
    '/api/finance/budgets': 'finance-budgets',
    '/api/finance/savings': 'finance-savings',
    '/api/finance/assets': 'finance-assets',
    '/api/finance/yearly': 'finance-yearly',
    '/api/habits': 'habits',
    '/api/user': 'user',
    '/api/goals/milestones': 'goals-milestones',
    '/api/goals': 'goals',
    '/api/study/courses': 'study-courses',
    '/api/study/archives': 'study-archives',
    '/api/jobs': 'jobs',
    '/api/journals': 'journals',
    '/api/planner/daily': 'planner-daily',
    '/api/planner/tasks': 'planner-tasks',
    '/api/calendar': 'calendar',
};

// Next.js 16: file renamed from middleware.ts to proxy.ts
// Using named export `proxy` as required by the new API
export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;
  
  // 1. Check for Go API Proxy rewrite
  if (pathname.startsWith('/api/')) {
      let goRoute = '';
      let matchedPrefix = '';
      
      for (const prefix of Object.keys(ROUTE_MAP).sort((a, b) => b.length - a.length)) {
          if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
              goRoute = ROUTE_MAP[prefix];
              matchedPrefix = prefix;
              break;
          }
      }

      if (goRoute) {
          const userId = req.auth?.user?.id;
          if (!userId) {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          }
          
          const searchParams = new URLSearchParams(req.nextUrl.searchParams.toString());
          searchParams.set('route', goRoute);
          searchParams.set('userId', userId);
          
          const remainder = pathname.substring(matchedPrefix.length);
          const parts = remainder.split('/').filter(Boolean);
          if (parts.length > 0) {
              searchParams.set('id', parts[parts.length - 1]);
          }
          
          const rewriteUrl = new URL(`/api?${searchParams.toString()}`, req.url);
          const requestHeaders = new Headers(req.headers);
          requestHeaders.set('X-User-Id', userId);
          
          return NextResponse.rewrite(rewriteUrl, {
              request: { headers: requestHeaders }
          });
      }
      
      return NextResponse.next();
  }

  // 2. Normal Next.js routing / auth check for pages
  const isProtectedRoute = 
    pathname.includes('/dashboard') || 
    pathname.includes('/planner') || 
    pathname.includes('/finance') || 
    pathname.includes('/habits');

  if (isProtectedRoute && !req.auth) {
    const loginUrl = new URL('/id/login', req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  
  if ((pathname === '/' || pathname === '/id' || pathname === '/en' || isAuthPage) && req.auth) {
    const locale = (pathname.startsWith('/en') || pathname === '/en') ? 'en' : 'id';
    return Response.redirect(new URL(`/${locale}/dashboard`, req.nextUrl.origin));
  }

  return intlMiddleware(req);
});
 
export const config = {
  // Match both API and UI paths (ignore _next, static, etc)
  matcher: [
      '/api/finance/:path*',
      '/api/habits/:path*',
      '/api/user/:path*',
      '/api/goals/:path*',
      '/api/study/:path*',
      '/api/jobs/:path*',
      '/api/journals/:path*',
      '/api/planner/:path*',
      '/api/calendar/:path*',
      '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
