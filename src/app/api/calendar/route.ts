import { NextResponse } from 'next/server';
import { proxyToGo } from '@/lib/proxy';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', session.user.id);
  
  return proxyToGo(req, 'calendar', searchParams.toString(), session.user.id);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', session.user.id);
  
  return proxyToGo(req, 'calendar', searchParams.toString(), session.user.id);
}
