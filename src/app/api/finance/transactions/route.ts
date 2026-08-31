import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function proxyToGo(req: Request, userId: string, method: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const { search } = new URL(req.url);
  const goUrl = `${protocol}://${host}/api?route=finance-transactions${search ? '&' + search.slice(1) : ''}`;

  try {
    const response = await fetch(goUrl, {
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

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    try {
      const data = await proxyToGo(req, userId, 'GET');
      const res = NextResponse.json(data);
      res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=10');
      return res;
    } catch (e) {
      console.warn('Falling back to Prisma');
    }
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');

  try {
    const whereClause: any = { userId: parseInt(userId) };
    if (month) {
      const [y, m] = month.split('-');
      const year = parseInt(y);
      const mm = parseInt(m);
      const startDate = new Date(Date.UTC(year, mm - 1, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, mm, 0, 23, 59, 59, 999));
      whereClause.date = { gte: startDate, lte: endDate };
    }

    const transactions = await prisma.financeTransaction.findMany({
      where: whereClause,
      orderBy: [{ date: 'desc' }, { id: 'desc' }]
    });

    const res = NextResponse.json(transactions);
    res.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=10');
    return res;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const body = await req.json();

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      try {
        const data = await proxyToGo(req, userId, 'POST', body);
        return NextResponse.json(data);
      } catch (e) {
        console.warn('Falling back to Prisma');
      }
    }

    const { title, amount, type, category, date, notes } = body;
    const transaction = await prisma.financeTransaction.create({
      data: {
        userId: parseInt(userId),
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
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
