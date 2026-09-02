import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.text();
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const apiBase = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : `${proto}://${host}/api`;
    const goUrl = `${apiBase}?route=payment-upgrade`;

    const goRes = await fetch(goUrl, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body,
    });

    if (!goRes.ok) {
      const text = await goRes.text();
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

    const data = await goRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error upgrading user subscription via Go backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
