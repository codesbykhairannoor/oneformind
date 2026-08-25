import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const eventId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.calendarEvent.findUnique({ where: { id: eventId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.isAllDay !== undefined) updateData.isAllDay = body.isAllDay;
    if (body.startTime !== undefined) updateData.startTime = body.startTime ? new Date(body.startTime) : null;
    if (body.endTime !== undefined) updateData.endTime = body.endTime ? new Date(body.endTime) : null;

    const event = await prisma.calendarEvent.update({
      where: { id: eventId },
      data: updateData,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const eventId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.calendarEvent.findUnique({ where: { id: eventId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.calendarEvent.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
