import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Duitku callback — called directly by Duitku servers (verified via MD5 signature in Go backend)
export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        const apiBase =
            process.env.NEXT_PUBLIC_API_URL ||
            `${(process.env.APP_URL || 'https://tranvas.com').replace(/\/$/, '')}/api`;
        const goUrl = `${apiBase}?route=payment-duitku-callback`;

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
            return NextResponse.json({ error: text || 'Signature verification failed' }, { status: goRes.status });
        }

        const data = await goRes.json();

        // SECURITY: Only record affiliate commission when Go backend cryptographically verified
        // the Duitku MD5 signature and returned `verified: true` with verified user_id and amount.
        if (data?.verified === true && data?.user_id && Number(data?.amount) > 0) {
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { recordAffiliateCommission } = await import('@/lib/affiliate/affiliate-service');
                await recordAffiliateCommission(supabaseAdmin, {
                    referredUserId: String(data.user_id),
                    gateway: 'duitku',
                    transactionId: String(data.merchantOrderId || `duitku_${Date.now()}`),
                    planName: String(data.plan || 'architect'),
                    transactionAmount: Number(data.amount),
                    currency: 'IDR',
                });
            } catch (affErr) {
                console.warn('Duitku affiliate commission hook notice:', affErr);
            }
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Duitku Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
