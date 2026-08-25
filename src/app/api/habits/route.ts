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
  const period = searchParams.get('period');

  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isArchived: false,
        ...(period ? { period } : {}),
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        logs: true,
      }
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
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
    const { name, icon, color, period, monthlyTarget } = body;

    // Get max position to append to end
    const lastHabit = await prisma.habit.findFirst({
      where: { userId, period, isArchived: false },
      orderBy: { position: 'desc' },
    });
    
    const position = lastHabit ? lastHabit.position + 1 : 1;

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        icon,
        color: color || '#6366f1',
        period,
        monthlyTarget: monthlyTarget || 30,
        status: 'active',
        position,
      },
      include: {
        logs: true,
      }
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
