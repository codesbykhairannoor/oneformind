import { NextRequest, NextResponse } from 'next/server';
import { proxyToGo } from '@/lib/proxy';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'study-archives', searchParams.toString(), token.sub);
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'study-archives', searchParams.toString(), token.sub);
}

