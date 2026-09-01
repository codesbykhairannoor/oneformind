import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function proxyToGo(req: Request, userId: string, method: string, habitId: string, action?: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const { search } = new URL(req.url);
  let goUrl = `${protocol}://${host}/api?route=habits${search ? '&' + search.slice(1) : ''}&userId=${userId}&habitId=${habitId}`;
  if (action) {
    goUrl += `&action=${action}`;
  }

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
    
    // Some routes return just {success: true}
    return await response.json();
  } catch (error) {
    console.error('Go Proxy Error:', error);
    throw error;
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = await proxyToGo(req, session.user.id, 'PUT', params.id, undefined, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying PUT habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await proxyToGo(req, session.user.id, 'DELETE', params.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying DELETE habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
