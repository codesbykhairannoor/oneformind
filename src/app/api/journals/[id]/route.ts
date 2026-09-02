import { NextRequest, NextResponse } from 'next/server';
import { proxyToGo } from '@/lib/proxy';
import { getAuthToken } from '@/lib/auth-edge';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  searchParams.set('id', resolvedParams.id);
  
  return proxyToGo(req as any, 'journals', searchParams.toString(), token.accessToken);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  searchParams.set('id', resolvedParams.id);
  
  return proxyToGo(req as any, 'journals', searchParams.toString(), token.accessToken);
}

