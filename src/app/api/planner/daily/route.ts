import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
      return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
    }

    const date = new Date(dateStr);

    const daily = await prisma.plannerDaily.findUnique({
      where: {
        userId_date: {
          userId: parseInt(session.user.id),
          date,
        },
      },
    });

    return NextResponse.json(daily || {});
  } catch (error) {
    console.error('Error fetching planner daily:', error);
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
    const { date: dateStr, notes, meals, waterGlasses, inbox } = body;

    if (!dateStr) {
      return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
    }

    const date = new Date(dateStr);
    const userId = parseInt(session.user.id);

    const dataToUpdate: any = {};
    if (notes !== undefined) dataToUpdate.notes = notes;
    if (meals !== undefined) dataToUpdate.meals = meals;
    if (waterGlasses !== undefined) dataToUpdate.waterGlasses = waterGlasses;
    if (inbox !== undefined) dataToUpdate.inbox = inbox;

    const updated = await prisma.plannerDaily.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: dataToUpdate,
      create: {
        userId,
        date,
        ...dataToUpdate,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating planner daily:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
