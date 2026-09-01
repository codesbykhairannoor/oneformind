import { NextResponse } from 'next/server';

export async function proxyToGo(req: Request, route: string, queryParams: string, userId: string) {
  try {
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const goUrl = `${proto}://${host}/api?route=${route}&${queryParams}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
    };

    const origin = req.headers.get('origin');
    if (origin) {
      headers['Origin'] = origin;
    }

    const fetchOptions: RequestInit & { duplex?: string } = {
      method: req.method,
      headers,
      cache: 'no-store',
    };

    // Stream the request body directly instead of buffering it.
    // This avoids reading the entire body into memory before forwarding.
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = req.body;
      fetchOptions.duplex = 'half'; // Required for streaming fetch in Edge Runtime
    }

    const goRes = await fetch(goUrl, fetchOptions);

    // Stream the response back directly — no buffering into arrayBuffer.
    return new Response(goRes.body, {
      status: goRes.status,
      headers: {
        'Content-Type': goRes.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error: any) {
    console.error(`Proxy to Go error [${route}]:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
