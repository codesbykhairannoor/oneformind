import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  try {
    const events = await prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
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
