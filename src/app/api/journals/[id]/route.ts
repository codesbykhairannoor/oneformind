import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const journalId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.journal.findUnique({ where: { id: journalId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.mood !== undefined) updateData.mood = body.mood;
    if (body.imagePath !== undefined) updateData.imagePath = body.imagePath;
    if (body.isPinned !== undefined) updateData.isPinned = body.isPinned;
    if (body.aiSentiment !== undefined) updateData.aiSentiment = body.aiSentiment;
    if (body.moodScore !== undefined) updateData.moodScore = body.moodScore !== null ? Number(body.moodScore) : null;

    const journal = await prisma.journal.update({
      where: { id: journalId },
      data: updateData,
    });

    return NextResponse.json(journal);
  } catch (error) {
    console.error('Error updating journal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const journalId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.journal.findUnique({ where: { id: journalId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.journal.delete({
      where: { id: journalId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting journal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
