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
    const jobs = await prisma.job.findMany({
      where: { userId },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
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
    const { title, company, status, salary, location, job_url, notes, applied_date } = body;

    const job = await prisma.job.create({
      data: {
        userId,
        title,
        company,
        status,
        salary: salary ? Number(salary) : null,
        location: location || null,
        jobUrl: job_url || null,
        notes: notes || null,
        appliedDate: applied_date ? new Date(applied_date) : null,
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
