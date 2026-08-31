import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = params.id;
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
      const goUrl = `${proto}://${host}/api/go-goals-milestones?goalId=${goalId}`;
      
      const goRes = await fetch(goUrl, {
        method: 'POST',
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

    const { title, completed, order, targetDate } = body;

    const milestone = await prisma.goalMilestone.create({
      data: {
        goalId: parseInt(goalId),
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
