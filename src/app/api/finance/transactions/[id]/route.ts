import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function proxyToGo(req: Request, userId: string, method: string, transactionId: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const goUrl = `${protocol}://${host}/api?route=finance-transactions&id=${transactionId}&userId=${userId}`;

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
    if (!response.ok) throw new Error(`Go API returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Go Proxy Error:', error);
    throw error;
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const transactionId = params.id;

  try {
    const body = await req.json();

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      try {
        const data = await proxyToGo(req, userId, 'PUT', transactionId, body);
        return NextResponse.json(data);
      } catch (e) {
        console.warn('Falling back to Prisma');
      }
    }

    const { title, amount, type, category, date, notes } = body;
    const existing = await prisma.financeTransaction.findUnique({ where: { id: parseInt(transactionId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const transaction = await prisma.financeTransaction.update({
      where: { id: parseInt(transactionId) },
      data: {
        title,
        amount,
        type,
        category,
        date: new Date(date),
        notes: notes || null,
      }
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const transactionId = params.id;

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    try {
      const data = await proxyToGo(req, userId, 'DELETE', transactionId);
      return NextResponse.json(data);
    } catch (e) {
      console.warn('Falling back to Prisma');
    }
  }

  try {
    const existing = await prisma.financeTransaction.findUnique({ where: { id: parseInt(transactionId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.financeTransaction.delete({ where: { id: parseInt(transactionId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
