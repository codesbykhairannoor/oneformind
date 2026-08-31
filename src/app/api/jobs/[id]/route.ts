import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = params.id;
  const userId = session.user.id;
  const bodyText = await req.text();
  let body;
  try {
      body = JSON.parse(bodyText);
  } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api?route=jobs&id=${jobId}`;
      
      const goRes = await fetch(goUrl, {
        method: 'PUT',
        headers: {
          'X-User-Id': userId,
          'Content-Type': 'application/json'
        },
        body: bodyText,
        cache: 'no-store'
      });
      
      if (!goRes.ok) throw new Error(`Go backend returned ${goRes.status}`);
      const data = await goRes.json();
      return NextResponse.json(data);
    } catch (e) {
      console.error('Go proxy failed, falling back to Node.js Prisma:', e);
    }
  }

  try {
    const existing = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

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
      where: { id: parseInt(jobId) },
      data: updateData,
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = params.id;
  const userId = session.user.id;

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api?route=jobs&id=${jobId}`;
      
      const goRes = await fetch(goUrl, {
        method: 'DELETE',
        headers: {
          'X-User-Id': userId,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!goRes.ok) throw new Error(`Go backend returned ${goRes.status}`);
      const data = await goRes.json();
      return NextResponse.json(data);
    } catch (e) {
      console.error('Go proxy failed, falling back to Node.js Prisma:', e);
    }
  }

  try {
    const existing = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!existing || existing.userId !== parseInt(userId)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: parseInt(jobId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
