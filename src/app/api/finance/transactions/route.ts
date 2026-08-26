import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month'); // e.g. "2026-08"

  try {
    const whereClause: any = { userId };
    if (month) {
      const [y, m] = month.split('-');
      const year = parseInt(y);
      const mm = parseInt(m);
      const startDate = new Date(Date.UTC(year, mm - 1, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, mm, 0, 23, 59, 59, 999));
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const transactions = await prisma.financeTransaction.findMany({
      where: whereClause,
      orderBy: [
        { date: 'desc' },
        { id: 'desc' }
      ]
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  try {
    const body = await req.json();
    const { title, amount, type, category, date, notes } = body;

    const transaction = await prisma.financeTransaction.create({
      data: {
        userId,
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
