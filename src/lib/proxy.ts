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

    const data = await goRes.json();
    const response = NextResponse.json(data);
    
    // Only set cache headers for GET requests if needed, but since it's user-specific, we keep it private
    if (req.method === 'GET') {
      response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');
    }

    return response;
  } catch (error: any) {
    console.error(`Proxy to Go error [${route}]:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
