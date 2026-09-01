import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function proxyToGo(req: Request, userId: string, method: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const { search } = new URL(req.url);
  const goUrl = `${protocol}://${host}/api?route=goals${search ? '&' + search.slice(1) : ''}&userId=${userId}`;

  try {
    const response = await fetch(goUrl, {
      cache: 'no-store',
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Go API returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Go Proxy Error:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await proxyToGo(req, session.user.id, 'GET');
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=30');
    return res;
  } catch (error) {
    console.error('Error proxying GET goals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const bodyText = await req.text();
    let body;
    try {
        body = JSON.parse(bodyText);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    const data = await proxyToGo(req, session.user.id, 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying POST goals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
