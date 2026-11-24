import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    const { data: { session } } = await supabase.auth.getSession();
    if (userErr || !user || !session?.access_token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.text();
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      `${(process.env.APP_URL || 'https://tranvas.com').replace(/\/$/, '')}/api`;
    const goUrl = `${apiBase}?route=payment-paypal-checkout`;

    const rawOrigin = req.headers.get('origin') || '';
    const safeOrigin = /^https:\/\/(?:www\.)?tranvas\.com$|^http:\/\/localhost(?::\d+)?$/i.test(rawOrigin)
      ? rawOrigin
      : (process.env.APP_URL || 'https://tranvas.com');

    const goRes = await fetch(goUrl, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'Origin': safeOrigin,
      },
      body,
    });

    if (!goRes.ok) {
      const text = await goRes.text();
      return NextResponse.json({ error: text || 'PayPal checkout failed' }, { status: goRes.status });
    }

    const data = await goRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PayPal Checkout Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
