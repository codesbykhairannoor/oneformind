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
      throw new Error(`Go backend returned ${goRes.status}: ${text}`);
    }

    const data = await goRes.json();

    // Record 60% affiliate commission for eligible referrals
    try {
      const parsedBody = JSON.parse(body || '{}');
      const { recordAffiliateCommission } = await import('@/lib/affiliate/affiliate-service');
      const txAmount = Number(parsedBody.amount || data.amount || 15.0);

      await recordAffiliateCommission(supabase, {
        referredUserId: session.user.id,
        gateway: 'paypal',
        transactionId: String(parsedBody.orderID || data.orderID || `pp_${Date.now()}`),
        planName: parsedBody.plan || 'architect',
        transactionAmount: txAmount,
        currency: parsedBody.currency || 'USD',
      });
    } catch (affErr) {
      console.warn('PayPal affiliate reward notice:', affErr);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('PayPal Capture Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

