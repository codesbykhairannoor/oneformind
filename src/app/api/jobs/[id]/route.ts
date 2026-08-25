import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.company !== undefined) updateData.company = body.company;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.salary !== undefined) updateData.salary = body.salary ? Number(body.salary) : null;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.job_url !== undefined) updateData.jobUrl = body.job_url;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.applied_date !== undefined) updateData.appliedDate = body.applied_date ? new Date(body.applied_date) : null;

    const job = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = parseInt(params.id);
  const userId = parseInt(session.user.id);

  try {
    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
