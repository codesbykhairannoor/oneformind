import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';
        const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        // SECURITY CRITICAL (FAIL-CLOSED): Never process webhooks if signing secret is unconfigured
        if (!webhookSecret) {
            console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not configured');
            return NextResponse.json({ error: 'Webhook verification not configured' }, { status: 503 });
        }

        if (!signature) {
            return NextResponse.json({ error: 'Missing x-signature header' }, { status: 401 });
        }

        const hmac = crypto.createHmac('sha256', webhookSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload?.meta?.event_name;
        const customData = payload?.meta?.custom_data || {};
        const attributes = payload?.data?.attributes || {};
        const userId = customData.user_id || payload?.meta?.user_id;
        const userEmail = attributes.user_email || attributes.customer_email;

        const apiBase =
            process.env.NEXT_PUBLIC_API_URL ||
            `${(process.env.APP_URL || 'https://tranvas.com').replace(/\/$/, '')}/api`;
        const goUrl = `${apiBase}?route=payment-lemonsqueezy-webhook`;

        // Forward verified event to backend for user subscription status synchronization
        try {
            await fetch(goUrl, {
                cache: 'no-store',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName,
                    userId,
                    userEmail,
                    status: attributes.status,
                    productName: attributes.product_name,
                    variantName: attributes.variant_name,
                    trialEndsAt: attributes.trial_ends_at,
                    renewsAt: attributes.renews_at,
                    endsAt: attributes.ends_at,
                    createdAt: attributes.created_at,
                }),
            });
        } catch (fetchErr) {
            console.warn('Backend webhook forward notice:', fetchErr);
        }

        // Record affiliate commission ONLY after valid HMAC verification
        if (
            userId &&
            (eventName === 'order_created' ||
             eventName === 'subscription_payment_success' ||
             eventName === 'subscription_created')
        ) {
            try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { recordAffiliateCommission } = await import('@/lib/affiliate/affiliate-service');
                const rawTotal = attributes.total || attributes.subtotal_usd || 0;
                const txAmount = typeof rawTotal === 'number' && rawTotal > 100 ? rawTotal / 100 : Number(rawTotal);

                if (txAmount > 0) {
                    await recordAffiliateCommission(supabaseAdmin, {
                        referredUserId: userId,
                        gateway: 'lemonsqueezy',
                        transactionId: String(payload.data?.id || `ls_${Date.now()}`),
                        planName: attributes.variant_name || attributes.product_name || 'architect',
                        transactionAmount: txAmount,
                        currency: attributes.currency || 'USD',
                    });
                }
            } catch (affErr) {
                console.warn('Lemon Squeezy affiliate reward notice:', affErr);
            }
        }

        return NextResponse.json({ received: true, event: eventName });
    } catch (error: any) {
        console.error('Lemon Squeezy Webhook Error:', error);
        return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
    }
}
