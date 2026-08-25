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
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  try {
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const transactions = await prisma.financeTransaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const monthlyStats: Record<string, { income: number; expense: number }> = {};
    for (let i = 1; i <= 12; i++) {
        const monthKey = `${year}-${String(i).padStart(2, '0')}`;
        monthlyStats[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const monthKey = t.date.toISOString().substring(0, 7); // e.g., "2026-08"
      if (monthlyStats[monthKey]) {
          if (t.type === 'income') {
              monthlyStats[monthKey].income += Number(t.amount);
          } else if (t.type === 'expense') {
              monthlyStats[monthKey].expense += Number(t.amount);
          }
      }
    });

    const savings = await prisma.financeSaving.findMany({
        where: { userId }
    });
    const totalSavings = savings.reduce((acc: number, s: any) => acc + Number(s.currentAmount || 0), 0);

    return NextResponse.json({
        year,
        monthlyStats,
        totalSavings
    });
  } catch (error) {
    console.error('Error fetching yearly stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
