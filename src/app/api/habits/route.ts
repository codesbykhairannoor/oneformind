import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Helper for Go Proxy
async function proxyToGo(req: Request, userId: string, method: string, body?: any) {
  // Use the host header to build the absolute URL to the Go Serverless function
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  // Forward the URL search params (like ?period=daily)
  const { search } = new URL(req.url);
  const goUrl = `${protocol}://${host}/api/go-habits${search}`;

  try {
    const response = await fetch(goUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId, // Pass User ID securely
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Go API returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Go Proxy Error:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period');

  // PROXY TO GO BACKEND (Only in Production/Vercel)
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    try {
      const data = await proxyToGo(req, userId, 'GET');
      const response = NextResponse.json(data);
      response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=10');
      return response;
    } catch (e) {
      // Fallback to Prisma if Go proxy fails during migration
      console.warn('Falling back to Node.js Prisma due to Go API error');
    }
  }

  // NODE.JS PRISMA FALLBACK (Used for Local Dev)
  try {
    const habits = await prisma.habit.findMany({
      where: {
        userId: parseInt(userId),
        isArchived: false,
        ...(period ? { period } : {}),
      },
      orderBy: { position: 'asc' },
      include: { logs: true }
    });

    const response = NextResponse.json(habits);
    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=10');
    return response;
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();

    // PROXY TO GO BACKEND (Only in Production/Vercel)
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      try {
        const data = await proxyToGo(req, userId, 'POST', body);
        return NextResponse.json(data);
      } catch (e) {
        console.warn('Falling back to Node.js Prisma due to Go API error');
      }
    }

    // NODE.JS PRISMA FALLBACK (Used for Local Dev)
    const { name, icon, color, period, monthlyTarget } = body;
    const lastHabit = await prisma.habit.findFirst({
      where: { userId: parseInt(userId), period, isArchived: false },
      orderBy: { position: 'desc' },
    });
    
    const position = lastHabit ? lastHabit.position + 1 : 1;

    const habit = await prisma.habit.create({
      data: {
        userId: parseInt(userId),
        name,
        icon,
        color: color || '#6366f1',
        period,
        monthlyTarget: monthlyTarget || 30,
        status: 'active',
        position,
      },
      include: { logs: true }
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
