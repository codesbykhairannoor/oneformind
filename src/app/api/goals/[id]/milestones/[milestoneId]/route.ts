import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string; milestoneId: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = params.id;
  const milestoneId = params.milestoneId;
  const userId = session.user.id;
  const bodyText = await req.text();
  let body;
  try {
      body = JSON.parse(bodyText);
  } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api/go-goals-milestones?goalId=${goalId}&milestoneId=${milestoneId}`;
      
      const goRes = await fetch(goUrl, {
        method: 'PUT',
        headers: {
          'X-User-Id': userId,
          'Content-Type': 'application/json'
        },
        body: bodyText,
        cache: 'no-store'
      });
      
      if (!goRes.ok) throw new Error(`Go backend returned ${goRes.status}`);
      const data = await goRes.json();
      return NextResponse.json(data);
    } catch (e) {
      console.error('Go proxy failed, falling back to Node.js Prisma:', e);
    }
  }

  try {
    const existingGoal = await prisma.goal.findUnique({ where: { id: parseInt(goalId) } });
    if (!existingGoal || existingGoal.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.completed !== undefined) updateData.completed = body.completed;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.targetDate !== undefined) updateData.targetDate = body.targetDate ? new Date(body.targetDate) : null;

    const milestone = await prisma.goalMilestone.update({
      where: { id: parseInt(milestoneId) },
      data: updateData,
    });

    return NextResponse.json(milestone);
  } catch (error) {
    console.error('Error updating milestone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string; milestoneId: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = params.id;
  const milestoneId = params.milestoneId;
  const userId = session.user.id;

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api/go-goals-milestones?goalId=${goalId}&milestoneId=${milestoneId}`;
      
      const goRes = await fetch(goUrl, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!goRes.ok) throw new Error(`Go backend returned ${goRes.status}`);
      const data = await goRes.json();
      return NextResponse.json(data);
    } catch (e) {
      console.error('Go proxy failed, falling back to Node.js Prisma:', e);
    }
  }

  try {
    const existingGoal = await prisma.goal.findUnique({ where: { id: parseInt(goalId) } });
    if (!existingGoal || existingGoal.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.goalMilestone.delete({
      where: { id: parseInt(milestoneId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
