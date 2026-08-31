import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

async function proxyToGo(req: Request, userId: string, method: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const { search } = new URL(req.url);
  const goUrl = `${protocol}://${host}/api?route=planner-daily${search ? '&' + search.slice(1) : ''}&userId=${userId}`;

  try {
    const response = await fetch(goUrl, {
      cache: 'no-store',
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error(`Go API returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Go Proxy Error:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const userId = session.user.id;

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    try {
      const data = await proxyToGo(req, userId, 'GET');
      return NextResponse.json(data);
    } catch (e) {
      console.warn('Falling back to Prisma');
    }
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    if (!dateStr) return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });

    const date = new Date(dateStr);
    const daily = await prisma.plannerDaily.findUnique({
      where: { userId_date: { userId: parseInt(userId), date } },
    });
    return NextResponse.json(daily || {});
  } catch (error) {
    console.error('Error fetching planner daily:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const body = await req.json();

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      try {
        const data = await proxyToGo(req, userId, 'PUT', body);
        return NextResponse.json(data);
      } catch (e) {
        console.warn('Falling back to Prisma');
      }
    }

    const { date: dateStr, notes, meals, waterGlasses, inbox } = body;
    if (!dateStr) return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });

    const date = new Date(dateStr);
    const dataToUpdate: any = {};
    if (notes !== undefined) dataToUpdate.notes = notes;
    if (meals !== undefined) dataToUpdate.meals = meals;
    if (waterGlasses !== undefined) dataToUpdate.waterGlasses = waterGlasses;
    if (inbox !== undefined) dataToUpdate.inbox = inbox;

    const updated = await prisma.plannerDaily.upsert({
      where: { userId_date: { userId: parseInt(userId), date } },
      update: dataToUpdate,
      create: { userId: parseInt(userId), date, ...dataToUpdate },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating planner daily:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
