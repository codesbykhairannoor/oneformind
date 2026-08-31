import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const proto = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const goUrl = `${proto}://${host}/api/go-payment-duitku/checkout`;

        const goRes = await fetch(goUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': session.user.id,
                'Origin': req.headers.get('origin') || process.env.APP_URL || 'https://tranvas.com',
            },
            body: JSON.stringify(body)
        });

        if (!goRes.ok) {
            const text = await goRes.text();
            throw new Error(`Go backend returned ${goRes.status}: ${text}`);
        }

        const data = await goRes.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Duitku Checkout Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
