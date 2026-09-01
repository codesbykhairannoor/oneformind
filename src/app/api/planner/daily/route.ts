import { NextRequest, NextResponse } from 'next/server';
import { proxyToGo } from '@/lib/proxy';
import { getAuthToken } from '@/lib/auth-edge';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'planner-daily', searchParams.toString(), token.sub);
}

export async function PUT(req: NextRequest) {
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'planner-daily', searchParams.toString(), token.sub);
}

