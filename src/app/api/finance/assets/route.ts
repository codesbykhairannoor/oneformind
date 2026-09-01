import { NextRequest, NextResponse } from 'next/server';
import { proxyToGo } from '@/lib/proxy';
import { getAuthToken } from '@/lib/auth-edge';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'finance-assets', searchParams.toString(), token.sub);
}

export async function POST(req: NextRequest) {
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'finance-assets', searchParams.toString(), token.sub);
}

export async function PUT(req: NextRequest) {
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'finance-assets', searchParams.toString(), token.sub);
}

export async function DELETE(req: NextRequest) {
  const token = await getAuthToken(req);
  if (!token?.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  searchParams.set('userId', token.sub);
  
  return proxyToGo(req as any, 'finance-assets', searchParams.toString(), token.sub);
}

