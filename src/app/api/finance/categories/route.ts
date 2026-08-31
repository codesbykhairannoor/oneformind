import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function proxyToGo(req: Request, userId: string, method: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const { search } = new URL(req.url);
  const goUrl = `${protocol}://${host}/api/go-finance-categories${search}`;

  try {
    const response = await fetch(goUrl, {
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
    const categories = await prisma.financeCategory.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const body = await req.json();

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      try {
        const data = await proxyToGo(req, userId, 'POST', body);
        return NextResponse.json(data);
      } catch (e) {
        console.warn('Falling back to Prisma');
      }
    }

    const { name, type, icon, color } = body;
    const category = await prisma.financeCategory.create({
      data: {
        userId: parseInt(userId),
        name,
        type,
        icon: icon || null,
        color: color || null,
      }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
