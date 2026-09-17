import { NextResponse } from 'next/server';

export async function proxyToGo(req: Request, route: string, queryParams: string, accessToken: string) {
  try {
    // Sanitize route to strictly allow only alphanumeric, hyphen, and underscore characters
    const safeRoute = (route || '').replace(/[^a-zA-Z0-9_\-]/g, '');
    if (!safeRoute) {
      return NextResponse.json({ error: 'Invalid route parameter' }, { status: 400 });
    }

    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3000';
    
    const baseApi = process.env.NEXT_PUBLIC_API_URL || `${proto}://${host}/api`;
    const targetUrl = new URL(baseApi);
    targetUrl.searchParams.set('route', safeRoute);

    // Safely parse and merge incoming query parameters
    if (queryParams) {
      const incoming = new URLSearchParams(queryParams);
      incoming.forEach((val, key) => {
        // Prevent overwriting the primary route param via query pollution
        if (key !== 'route') {
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
    if (origin) {
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

    // Forward all responses transparently, including 401s and 400s
    // so the frontend can handle token expiration or bad requests correctly.

    // Stream the raw Go response bytes directly to the client.
    // This avoids double JSON serialization which can turn null → {} in some runtimes.
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
