import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api?route=goals`;
      
      const goRes = await fetch(goUrl, {
        method: 'GET',
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
    const goals = await prisma.goal.findMany({
      where: { userId: parseInt(userId) },
      include: { milestones: true },
      orderBy: { id: 'desc' }
    });

    const res = NextResponse.json(goals);
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
      const goUrl = `${proto}://${host}/api?route=goals`;
      
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
    const { title, category, type, targetValue, currentValue, startDate, endDate, status, coverImageUrl, reward, priority, color } = body;

    const goal = await prisma.goal.create({
      data: {
        userId: parseInt(userId),
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
