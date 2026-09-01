import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function proxyToGo(req: Request, userId: string, method: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const { search } = new URL(req.url);
  const goUrl = `${protocol}://${host}/api?route=finance-budgets${search ? '&' + search.slice(1) : ''}&userId=${userId}`;

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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying GET budgets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = await proxyToGo(req, session.user.id, 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying POST budget:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
