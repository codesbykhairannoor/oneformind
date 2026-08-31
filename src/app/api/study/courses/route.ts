import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const goUrl = `${proto}://${host}/api?route=study-courses`;

    const goRes = await fetch(goUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
      },
    });

    if (!goRes.ok) {
      const text = await goRes.text();
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

    const data = await goRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching courses from Go backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const goUrl = `${proto}://${host}/api?route=study-courses`;

    const goRes = await fetch(goUrl, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
      },
      body: JSON.stringify(body)
    });

    if (!goRes.ok) {
      const text = await goRes.text();
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

    const data = await goRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating course via Go backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const goUrl = `${proto}://${host}/api?route=study-courses`;

    const goRes = await fetch(goUrl, {
      cache: 'no-store',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
      },
      body: JSON.stringify(body)
    });

    if (!goRes.ok) {
      const text = await goRes.text();
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

    const data = await goRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating course via Go backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const goUrl = `${proto}://${host}/api?route=study-courses&id=${id}`;

    const goRes = await fetch(goUrl, {
      cache: 'no-store',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': session.user.id,
      },
    });

    if (!goRes.ok) {
      const text = await goRes.text();
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

    const data = await goRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting course via Go backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
