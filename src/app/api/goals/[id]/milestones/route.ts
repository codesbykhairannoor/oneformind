import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existingGoal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!existingGoal || existingGoal.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, completed, order, targetDate } = body;

    const milestone = await prisma.goalMilestone.create({
      data: {
        goalId,
        title,
        completed: completed || false,
        order: order || 0,
        targetDate: targetDate ? new Date(targetDate) : null,
      }
    });

    return NextResponse.json(milestone);
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
