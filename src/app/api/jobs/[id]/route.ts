import { NextRequest, NextResponse } from 'next/server';
import { proxyToGo } from '@/lib/proxy';
import { getToken } from 'next-auth/jwt';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', token.sub);
  searchParams.set('id', resolvedParams.id);
  
  return proxyToGo(req as any, 'jobs', searchParams.toString(), token.sub);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  searchParams.set('userId', token.sub);
  searchParams.set('id', resolvedParams.id);
  
  return proxyToGo(req as any, 'jobs', searchParams.toString(), token.sub);
}

