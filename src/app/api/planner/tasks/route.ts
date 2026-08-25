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
  const dateStr = searchParams.get('date');

  try {
    const tasks = await prisma.plannerTask.findMany({
      where: {
        userId,
        ...(dateStr ? { date: new Date(dateStr) } : {}),
      },
      orderBy: [
        { startTime: 'asc' },
        { id: 'asc' }
      ]
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching planner tasks:', error);
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
    const { date, startTime, endTime, title, notes, type, isCompleted } = body;

    const task = await prisma.plannerTask.create({
      data: {
        userId,
        date: new Date(date),
        startTime: startTime ? new Date(`1970-01-01T${startTime}:00.000Z`) : null,
        endTime: endTime ? new Date(`1970-01-01T${endTime}:00.000Z`) : null,
        title,
        notes: notes || null,
        type: type || 1,
        isCompleted: isCompleted || false,
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating planner task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
