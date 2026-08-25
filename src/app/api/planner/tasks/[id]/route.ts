import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const taskId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.plannerTask.findUnique({ where: { id: taskId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    
    // Allow partial updates
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.isCompleted !== undefined) updateData.isCompleted = body.isCompleted;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.startTime !== undefined) {
      updateData.startTime = body.startTime ? new Date(`1970-01-01T${body.startTime}:00.000Z`) : null;
    }
    if (body.endTime !== undefined) {
      updateData.endTime = body.endTime ? new Date(`1970-01-01T${body.endTime}:00.000Z`) : null;
    }

    const task = await prisma.plannerTask.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating planner task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const taskId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.plannerTask.findUnique({ where: { id: taskId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.plannerTask.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting planner task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
