import { NextResponse } from 'next/server';

const ALLOWED_HOST_RE = /^(?:(?:www\.)?tranvas\.com|[a-z0-9-]+\.vercel\.app|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)$/i;

function resolveSafeApiBase(req: Request): string {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('api:8080')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
  const rawHost = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').split(',')[0].trim();
  if (rawHost && ALLOWED_HOST_RE.test(rawHost)) {
    const proto = rawHost.startsWith('localhost') || rawHost.startsWith('127.0.0.1') ? 'http' : 'https';
    return `${proto}://${rawHost}/api`;
  }
  return `${appUrl || 'https://tranvas.com'}/api`;
}

export async function proxyToGo(req: Request, route: string, queryParams: string, accessToken: string) {
  try {
    // Sanitize route to strictly allow only alphanumeric, hyphen, and underscore characters
    const safeRoute = (route || '').replace(/[^a-zA-Z0-9_\-]/g, '');
    if (!safeRoute) {
      return NextResponse.json({ error: 'Invalid route parameter' }, { status: 400 });
    }

    const baseApi = resolveSafeApiBase(req);
    const targetUrl = new URL(baseApi);
    targetUrl.searchParams.set('route', safeRoute);

    // Safely parse and merge incoming query parameters
    if (queryParams) {
      const incoming = new URLSearchParams(queryParams);
      incoming.forEach((val, key) => {
        // SECURITY: Prevent overwriting route OR injecting spoofed userId via query pollution
        if (key !== 'route' && key.toLowerCase() !== 'userid') {
          targetUrl.searchParams.set(key, val);
        }
      });
    }

    const goUrl = targetUrl.toString();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const origin = req.headers.get('origin');
    if (origin && /^https:\/\/(?:www\.)?tranvas\.com$|^http:\/\/localhost(?::\d+)?$/i.test(origin)) {
      headers['Origin'] = origin;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      cache: 'no-store',
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const reqText = await req.text();
      if (reqText) {
        fetchOptions.body = reqText;
      }
    }

    const goRes = await fetch(goUrl, fetchOptions);

    const rawBody = await goRes.arrayBuffer();
    return new Response(rawBody, {
      status: goRes.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error: any) {
    console.error(`Proxy to Go error [${route}]:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
