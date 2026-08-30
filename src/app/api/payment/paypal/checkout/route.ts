import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Helper to get PayPal Access Token
async function getPayPalAccessToken() {
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const clientId = process.env[`PAYPAL_${mode.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`PAYPAL_${mode.toUpperCase()}_CLIENT_SECRET`];
    
    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials missing');
    }

    const baseUrl = mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!res.ok) {
        throw new Error('Failed to get PayPal access token');
    }

    const data = await res.json();
    return { token: data.access_token, baseUrl };
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { plan = 'architect', billing = 'yearly' } = body;

        // Convert IDR to USD for PayPal roughly (e.g. 15,000 IDR = $1)
        // Let's define absolute USD prices based on legacy logic
        const pricesUsd: Record<string, Record<string, string>> = {
            'architect': { 'yearly': '59.00', 'monthly': '7.99' },
            'quantum': { 'yearly': '89.00', 'monthly': '11.99' },
            'legendary': { 'yearly': '599.00', 'monthly': '599.00' },
            'lifetime': { 'yearly': '599.00', 'monthly': '599.00' }
        };

        const planKey = plan.toLowerCase();
        const paymentAmount = pricesUsd[planKey]?.[billing] || '59.00';
        
        let productDetails = `Tranvas ${plan.charAt(0).toUpperCase() + plan.slice(1)} (${billing.charAt(0).toUpperCase() + billing.slice(1)})`;
        if (planKey === 'lifetime' || planKey === 'legendary') {
            productDetails = 'Tranvas Legendary Founder Edition';
        }

        const { token, baseUrl } = await getPayPalAccessToken();

        const orderPayload = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: `${planKey.toUpperCase()}-${session.user.id}-${Date.now()}`,
                    description: productDetails,
                    amount: {
                        currency_code: 'USD',
                        value: paymentAmount
                    }
                }
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        };

        const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderPayload)
        });

        const orderData = await orderRes.json();

        if (orderRes.ok && orderData.id) {
            return NextResponse.json({ id: orderData.id });
        } else {
            console.error('PayPal Order Error:', orderData);
            return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('PayPal Checkout Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
