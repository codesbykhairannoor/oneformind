import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

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
        const proto = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const goUrl = `${proto}://${host}/api?route=payment-paypal-capture`;

        const goRes = await fetch(goUrl, {
      cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': session.user.id,
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
        console.error('PayPal Capture Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
