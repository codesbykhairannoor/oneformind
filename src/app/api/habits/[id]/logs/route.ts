import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const habitId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const { date, status, notes } = body; // status can be 'completed', 'skipped', 'empty'

    // date should be a valid string 'YYYY-MM-DD'
    const logDate = new Date(date);

    if (status === 'empty') {
      // Delete the log if it exists
      await prisma.habitLog.deleteMany({
        where: {
          habitId,
          date: logDate,
        }
      });
      return NextResponse.json({ success: true, status: 'empty' });
    }

    // Since we don't have a direct upsert without ID (unless we use the unique constraint),
    // Wait, we do have a unique constraint: @@unique([habitId, date])
    // But we need to define the compound unique index in Prisma for upsert to work, which we did.

    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: logDate,
        }
      },
      update: {
        status,
        notes,
      },
      create: {
        habitId,
        date: logDate,
        status,
        notes,
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error toggling habit log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
