import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // ==========================================
  // 🚀 STRANGLER FIG PROXY TO GO SERVERLESS
  // ==========================================
  if (process.env.VERCEL) {
    try {
      const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = process.env.VERCEL_URL || req.headers.get('host');
      const goUrl = `${proto}://${host}/api?route=jobs`;
      
      const goRes = await fetch(goUrl, {
        method: 'GET',
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
    const jobs = await prisma.job.findMany({
      where: { userId: parseInt(userId) },
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
      const goUrl = `${proto}://${host}/api?route=jobs`;
      
      const goRes = await fetch(goUrl, {
        method: 'POST',
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
    const { title, company, status, salary, location, job_url, notes, applied_date } = body;

    const job = await prisma.job.create({
      data: {
        userId: parseInt(userId),
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
