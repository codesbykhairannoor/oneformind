import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId, meetingTag, type, fileName, filePath, linkUrl } = body;

    // Verify ownership of the course
    const course = await prisma.studyCourse.findUnique({
      where: { id: courseId },
    });

    if (!course || course.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Course not found or forbidden' }, { status: 403 });
    }

    const newArchive = await prisma.studyArchive.create({
      data: {
        courseId,
        meetingTag,
        type,
        fileName,
        filePath,
        linkUrl,
      },
    });

    return NextResponse.json(newArchive);
  } catch (error) {
    console.error('Error creating archive:', error);
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

    // Verify ownership via course
    const archive = await prisma.studyArchive.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!archive || archive.course.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    await prisma.studyArchive.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting archive:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
