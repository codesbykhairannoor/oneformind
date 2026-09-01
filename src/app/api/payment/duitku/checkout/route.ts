import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser) {
      dbUser = await prisma.user.create({ data: { email: user.email, name: user.user_metadata?.name || user.user_metadata?.full_name || user.email } });
  }
  const session = { user: { id: dbUser.id.toString(), email: user.email } };

        const body = await req.json();
        const proto = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const goUrl = `${proto}://${host}/api?route=payment-duitku-checkout&userId=${session.user.id}`;

        const goRes = await fetch(goUrl, {
      cache: 'no-store',
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
