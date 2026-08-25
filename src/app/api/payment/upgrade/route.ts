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
    const { plan } = body;

    if (!plan) {
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 });
    }

    // Set premium_until to 1 year from now for this simulation
    const premiumUntil = new Date();
    premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        isPremium: true,
        planType: plan,
        premiumUntil: premiumUntil,
      },
      select: {
        id: true,
        name: true,
        email: true,
        planType: true,
        isPremium: true,
        premiumUntil: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error upgrading user subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
