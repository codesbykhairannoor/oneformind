import { NextResponse } from 'next/server';

export async function proxyToGo(req: Request, route: string, queryParams: string, accessToken: string) {
  try {
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const goUrl = `${proto}://${host}/api?route=${route}&${queryParams}`;

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

    if (!goRes.ok) {
      const text = await goRes.text();
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

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
