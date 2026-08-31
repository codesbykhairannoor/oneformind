import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function proxyToGo(req: Request, userId: string, method: string, taskId: string, body?: any) {
  const host = req.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  // Send ID as a query param since Go is a single flat file handler
  const goUrl = `${protocol}://${host}/api?route=planner-tasks&id=${taskId}`;

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

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const taskId = params.id;

  try {
    const body = await req.json();

    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      try {
        const data = await proxyToGo(req, userId, 'PUT', taskId, body);
        return NextResponse.json(data);
      } catch (e) {
        console.warn('Falling back to Prisma');
      }
    }

    const existing = await prisma.plannerTask.findUnique({ where: { id: parseInt(taskId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.isCompleted !== undefined) updateData.isCompleted = body.isCompleted;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.startTime !== undefined) {
      updateData.startTime = body.startTime ? new Date(`1970-01-01T${body.startTime}:00.000Z`) : null;
    }
    if (body.endTime !== undefined) {
      updateData.endTime = body.endTime ? new Date(`1970-01-01T${body.endTime}:00.000Z`) : null;
    }

    const task = await prisma.plannerTask.update({
      where: { id: parseInt(taskId) },
      data: updateData,
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating planner task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const taskId = params.id;

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    try {
      const data = await proxyToGo(req, userId, 'DELETE', taskId);
      return NextResponse.json(data);
    } catch (e) {
      console.warn('Falling back to Prisma');
    }
  }

  try {
    const existing = await prisma.plannerTask.findUnique({ where: { id: parseInt(taskId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.plannerTask.delete({ where: { id: parseInt(taskId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting planner task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
