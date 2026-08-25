import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        id: true,
        name: true,
        email: true,
        planType: true,
        isPremium: true,
        premiumUntil: true,
        settings: true,
        resumeText: true,
        resumeFilename: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
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
    const { name, settings } = body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (settings) dataToUpdate.settings = settings; // settings must be a valid JSON object
    if (body.resumeText !== undefined) dataToUpdate.resumeText = body.resumeText;
    if (body.resumeFilename !== undefined) dataToUpdate.resumeFilename = body.resumeFilename;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        planType: true,
        isPremium: true,
        premiumUntil: true,
        settings: true,
        resumeText: true,
        resumeFilename: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
