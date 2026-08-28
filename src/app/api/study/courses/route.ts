import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const courses = await prisma.studyCourse.findMany({
      where: { userId: parseInt(session.user.id) },
      include: { archives: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
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
    const { courseName, semester, sks, grade } = body;

    const newCourse = await prisma.studyCourse.create({
      data: {
        userId: parseInt(session.user.id),
        courseName,
        semester,
        sks,
        grade,
      },
      include: { archives: true },
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
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
    const { id, courseName, semester, sks, grade } = body;

    // Verify ownership
    const existing = await prisma.studyCourse.findUnique({ where: { id } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    const updatedCourse = await prisma.studyCourse.update({
      where: { id },
      data: {
        courseName,
        semester,
        sks,
        grade,
      },
      include: { archives: true },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
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

    const courseId = parseInt(id);

    // Verify ownership
    const existing = await prisma.studyCourse.findUnique({ where: { id: courseId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    await prisma.studyCourse.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
