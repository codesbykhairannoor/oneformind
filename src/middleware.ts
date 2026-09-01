import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

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
    '/api/goals': 'goals',
    '/api/goals/milestones': 'goals-milestones',
    '/api/study/courses': 'study-courses',
    '/api/study/archives': 'study-archives',
    '/api/jobs': 'jobs',
    '/api/journals': 'journals',
    '/api/planner/daily': 'planner-daily',
    '/api/planner/tasks': 'planner-tasks',
    '/api/calendar': 'calendar',
};

export default auth((req) => {
    const { nextUrl } = req;
    
    // Check if the current path matches any of our known Go API prefixes
    // Note: Some requests have IDs like /api/finance/transactions/123
    let matchPath = nextUrl.pathname;
    let goRoute = '';
    
    // Find the longest matching prefix in ROUTE_MAP
    let matchedPrefix = '';
    for (const prefix of Object.keys(ROUTE_MAP).sort((a, b) => b.length - a.length)) {
        if (nextUrl.pathname === prefix || nextUrl.pathname.startsWith(`${prefix}/`)) {
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
        
        // Rewrite to the Go Serverless Function (/api?route=...)
        // This avoids double HTTP hops and Node.js proxying overhead!
        const searchParams = new URLSearchParams(nextUrl.searchParams.toString());
        searchParams.set('route', goRoute);
        searchParams.set('userId', userId);
        
        // Pass any dynamic ID params via query (e.g. /api/finance/transactions/123 -> id=123)
        const remainder = nextUrl.pathname.substring(matchedPrefix.length);
        const parts = remainder.split('/').filter(Boolean);
        if (parts.length > 0) {
            // For Go API, IDs are usually expected in the URL query as ?id=... or via route params
            // Since Go backend uses `id := r.URL.Query().Get("id")` in most places:
            searchParams.set('id', parts[parts.length - 1]);
        }
        
        const rewriteUrl = new URL(`/api?${searchParams.toString()}`, req.url);
        
        // Clone headers to pass X-User-Id just in case Go reads it from headers instead of query
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('X-User-Id', userId);
        
        return NextResponse.rewrite(rewriteUrl, {
            request: {
                headers: requestHeaders,
            }
        });
    }
    
    return NextResponse.next();
});

export const config = {
    matcher: [
        '/api/finance/:path*',
        '/api/habits/:path*',
        '/api/user/:path*',
        '/api/goals/:path*',
        '/api/study/:path*',
        '/api/jobs/:path*',
        '/api/journals/:path*',
        '/api/planner/:path*',
        '/api/calendar/:path*'
    ],
};
