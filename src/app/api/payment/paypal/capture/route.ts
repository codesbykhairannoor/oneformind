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
    const goUrl = `${apiBase}?route=payment-paypal-capture`;

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
      return NextResponse.json({ error: text || 'PayPal capture rejected' }, { status: goRes.status });
    }

    const data = await goRes.json();

    // SECURITY: Only record affiliate commission using PayPal-verified server response fields
    // (NEVER trust client-supplied parsedBody.amount or parsedBody.plan).
    if (data?.verified === true && Number(data?.amount) > 0 && data?.orderID) {
      try {
        const { recordAffiliateCommission } = await import('@/lib/affiliate/affiliate-service');
        await recordAffiliateCommission(supabase, {
          referredUserId: user.id,
          gateway: 'paypal',
          transactionId: String(data.orderID),
          planName: String(data.plan || 'architect'),
          transactionAmount: Number(data.amount),
          currency: String(data.currency || 'USD'),
        });
      } catch (affErr) {
        console.warn('PayPal affiliate reward notice:', affErr);
      }
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PayPal Capture Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
