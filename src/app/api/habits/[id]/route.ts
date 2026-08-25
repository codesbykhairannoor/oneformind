import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const habitId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    
    // Only allow updating specific fields
    const { name, icon, color, monthlyTarget, position, isArchived } = body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (monthlyTarget !== undefined) updateData.monthlyTarget = monthlyTarget;
    if (position !== undefined) updateData.position = position;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: updateData,
      include: { logs: true }
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const habitId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Instead of hard delete, you could also archive. But if DELETE method is called, we delete.
    await prisma.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
