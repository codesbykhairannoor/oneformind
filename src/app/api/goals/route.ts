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
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: { milestones: true },
      orderBy: { id: 'desc' }
    });

    const res = NextResponse.json(goals);
    // Goals rarely change, cache for 2 minutes
    res.headers.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=30');
    return res;
  } catch (error) {
    console.error('Error fetching goals:', error);
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
    const { title, category, type, targetValue, currentValue, startDate, endDate, status, coverImageUrl, reward, priority, color } = body;

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        category: category || null,
        type: type || 'custom',
        targetValue: targetValue ? Number(targetValue) : 100,
        currentValue: currentValue ? Number(currentValue) : 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'active',
        coverImageUrl: coverImageUrl || null,
        reward: reward || null,
        priority: priority || 'medium',
        color: color || null,
      },
      include: { milestones: true }
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
