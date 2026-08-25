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
    const savings = await prisma.financeSaving.findMany({
      where: { userId },
      orderBy: { id: 'asc' }
    });

    return NextResponse.json(savings);
  } catch (error) {
    console.error('Error fetching savings:', error);
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
    const { title, targetAmount, currentAmount, icon, color } = body;

    const saving = await prisma.financeSaving.create({
      data: {
        userId,
        title,
        targetAmount: targetAmount || 0,
        currentAmount: currentAmount || 0,
        icon: icon || null,
        color: color || null,
      }
    });

    return NextResponse.json(saving);
  } catch (error) {
    console.error('Error creating saving:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  try {
    const body = await req.json();
    const { id, currentAmount, title, targetAmount, icon, color } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existing = await prisma.financeSaving.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (currentAmount !== undefined) updateData.currentAmount = currentAmount;
    if (title !== undefined) updateData.title = title;
    if (targetAmount !== undefined) updateData.targetAmount = targetAmount;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;

    const saving = await prisma.financeSaving.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(saving);
  } catch (error) {
    console.error('Error updating saving:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
