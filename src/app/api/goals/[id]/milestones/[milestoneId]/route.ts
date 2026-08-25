import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: { id: string, milestoneId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = parseInt(params.id);
  const milestoneId = parseInt(params.milestoneId);
  const userId = parseInt(session.user.id);

  try {
    const existingGoal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!existingGoal || existingGoal.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.completed !== undefined) updateData.completed = body.completed;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.targetDate !== undefined) updateData.targetDate = body.targetDate ? new Date(body.targetDate) : null;

    const milestone = await prisma.goalMilestone.update({
      where: { id: milestoneId, goalId },
      data: updateData,
    });

    return NextResponse.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string, milestoneId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = parseInt(params.id);
  const milestoneId = parseInt(params.milestoneId);
  const userId = parseInt(session.user.id);

  try {
    const existingGoal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!existingGoal || existingGoal.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.goalMilestone.delete({
      where: { id: milestoneId, goalId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
