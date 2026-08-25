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
    const journals = await prisma.journal.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(journals);
  } catch (error) {
    console.error('Error fetching journals:', error);
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
    const { date, title, content, mood, imagePath, isPinned, aiSentiment, moodScore } = body;

    const journal = await prisma.journal.create({
      data: {
        userId,
        date: new Date(date),
        title: title || null,
        content: content || null,
        mood: mood || null,
        imagePath: imagePath || null,
        isPinned: isPinned || false,
        aiSentiment: aiSentiment || null,
        moodScore: moodScore !== undefined ? Number(moodScore) : null,
      }
    });

    return NextResponse.json(journal);
  } catch (error) {
    console.error('Error creating journal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
