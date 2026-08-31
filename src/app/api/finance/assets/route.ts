import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const assets = await prisma.financeAsset.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching finance assets:', error);
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
    const { name, value, icon, color } = body;

    const newAsset = await prisma.financeAsset.create({
      data: {
        userId: parseInt(session.user.id),
        name,
        value,
        icon,
        color,
      },
    });

    return NextResponse.json(newAsset);
  } catch (error) {
    console.error('Error creating finance asset:', error);
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
    const { id, name, value, icon, color } = body;

    // Verify ownership
    const existing = await prisma.financeAsset.findUnique({ where: { id } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    const updatedAsset = await prisma.financeAsset.update({
      where: { id },
      data: {
        name,
        value,
        icon,
        color,
      },
    });

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error('Error updating finance asset:', error);
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

    const assetId = parseInt(id);

    // Verify ownership
    const existing = await prisma.financeAsset.findUnique({ where: { id: assetId } });
    if (!existing || existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    await prisma.financeAsset.delete({
      where: { id: assetId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting finance asset:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
