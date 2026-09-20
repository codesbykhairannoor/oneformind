import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Duitku callback — called directly by Duitku servers (not authenticated users)
// No Prisma, no auth needed. Just forward to Go.
export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        const proto = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const apiBase = process.env.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL
            : `${proto}://${host}/api`;
        const goUrl = `${apiBase}?route=payment-duitku-callback`;

        // Read the body once as text (works for both form-urlencoded and JSON)
        const requestBody = await req.text();

        const goRes = await fetch(goUrl, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': contentType,
            },
            body: requestBody,
        });

        if (!goRes.ok) {
            const text = await goRes.text();
            throw new Error(`Go backend returned ${goRes.status}: ${text}`);
        }

        const data = await goRes.json();

        // Record 60% affiliate commission for eligible referrals upon successful Duitku payment
        try {
            let resultCode = '';
            let merchantOrderId = '';
            let amount = 0;
            let userId = data?.user_id || data?.userId || '';

            // Parse requestBody whether URL-encoded or JSON
            if (contentType.includes('application/json')) {
                const parsed = JSON.parse(requestBody || '{}');
                resultCode = parsed.resultCode || '';
                merchantOrderId = parsed.merchantOrderId || '';
                amount = Number(parsed.amount || 0);
                if (!userId && parsed.additionalParam) {
                    userId = parsed.additionalParam;
                }
            } else {
                const params = new URLSearchParams(requestBody);
                resultCode = params.get('resultCode') || '';
                merchantOrderId = params.get('merchantOrderId') || '';
                amount = Number(params.get('amount') || 0);
                if (!userId && params.get('additionalParam')) {
                    userId = params.get('additionalParam') || '';
                }
            }

            if (resultCode === '00' && userId && amount > 0) {
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { recordAffiliateCommission } = await import('@/lib/affiliate/affiliate-service');
                await recordAffiliateCommission(supabaseAdmin, {
                    referredUserId: userId,
                    gateway: 'duitku',
                    transactionId: String(merchantOrderId || `duitku_${Date.now()}`),
                    planName: 'quantum',
                    transactionAmount: amount,
                    currency: 'IDR',
                });
            }
        } catch (affErr) {
            console.warn('Duitku affiliate commission hook notice:', affErr);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Duitku Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

