import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
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
      const goUrl = `${proto}://${host}/api?route=goals&id=${goalId}`;
      
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
    const existing = await prisma.goal.findUnique({ where: { id: parseInt(goalId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.targetValue !== undefined) updateData.targetValue = Number(body.targetValue);
    if (body.currentValue !== undefined) updateData.currentValue = Number(body.currentValue);
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.coverImageUrl !== undefined) updateData.coverImageUrl = body.coverImageUrl;
    if (body.reward !== undefined) updateData.reward = body.reward;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.color !== undefined) updateData.color = body.color;

    const goal = await prisma.goal.update({
      where: { id: parseInt(goalId) },
      data: updateData,
      include: { milestones: true }
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const goalId = params.id;
  const userId = session.user.id;

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api?route=goals&id=${goalId}`;
      
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
    const existing = await prisma.goal.findUnique({ where: { id: parseInt(goalId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id: parseInt(goalId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
