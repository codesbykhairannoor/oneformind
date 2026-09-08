import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';
        const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        // Verify webhook signature if secret is configured
        if (webhookSecret && signature) {
            const hmac = crypto.createHmac('sha256', webhookSecret);
            const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
            const signatureBuffer = Buffer.from(signature, 'utf8');

            if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload?.meta?.event_name;
        const customData = payload?.meta?.custom_data || {};
        const attributes = payload?.data?.attributes || {};
        const userId = customData.user_id || payload?.meta?.user_id;
        const userEmail = attributes.user_email || attributes.customer_email;

        const proto = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const apiBase = process.env.NEXT_PUBLIC_API_URL
            ? process.env.NEXT_PUBLIC_API_URL
            : `${proto}://${host}/api`;
        const goUrl = `${apiBase}?route=payment-lemonsqueezy-webhook`;

        // Forward event to backend for user subscription status synchronization
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

        return NextResponse.json({ received: true, event: eventName });
    } catch (error: any) {
        console.error('Lemon Squeezy Webhook Error:', error);
        return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
    }
}
