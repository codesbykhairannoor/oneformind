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
  const period = searchParams.get('period'); // Format: YYYY-MM
  
  let startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

  if (period && period.match(/^\d{4}-\d{2}$/)) {
    const [year, month] = period.split('-').map(Number);
    startDate = new Date(Date.UTC(year, month - 1, 1));
    endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  }

  try {
    const [events, journals, plannerTasks, financeTransactions, habitLogs] = await Promise.all([
      prisma.calendarEvent.findMany({
        where: { userId, startDate: { gte: startDate, lte: endDate } },
      }),
      prisma.journal.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      prisma.plannerTask.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      prisma.financeTransaction.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
      }),
      prisma.habitLog.findMany({
        where: { habit: { userId }, date: { gte: startDate, lte: endDate }, status: 'completed' },
      })
    ]);

    return NextResponse.json({
      events,
      journals,
      plannerTasks,
      financeTransactions,
      habitLogs
    });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
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
    const { title, description, type, color, startDate, endDate, isAllDay, startTime, endTime } = body;

    const event = await prisma.calendarEvent.create({
      data: {
        userId,
        title,
        description: description || null,
        type: type || 'event',
        color: color || '#3b82f6',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isAllDay: isAllDay || false,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
