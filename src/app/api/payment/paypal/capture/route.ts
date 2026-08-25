import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
        const { token, plan = 'architect', billing = 'yearly' } = body;

        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 400 });
        }

        const { token: accessToken, baseUrl } = await getPayPalAccessToken();

        const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${token}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const captureData = await captureRes.json();

        if (captureRes.ok && captureData.status === 'COMPLETED') {
            // Update the user
            const userId = Number(session.user.id);
            const user = await prisma.user.findUnique({ where: { id: userId } });
            
            if (user) {
                const planKey = plan.toUpperCase();
                let finalPlan = planKey.toLowerCase();
                let premiumUntil = new Date();

                if (planKey === 'LIFETIME' || planKey === 'LEGENDARY') {
                    finalPlan = 'legendary';
                    premiumUntil.setFullYear(premiumUntil.getFullYear() + 100);
                } else {
                    if (billing === 'yearly') {
                        premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
                    } else {
                        premiumUntil.setMonth(premiumUntil.getMonth() + 1);
                    }
                }

                if (planKey === 'QUANTUM') {
                    finalPlan = 'quantum';
                }

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        isPremium: true,
                        planType: finalPlan,
                        premiumUntil: premiumUntil
                    }
                });

                console.log(`Successfully upgraded user ${userId} to ${finalPlan} via PayPal`);
                return NextResponse.json({ success: true });
            }
        } else {
            console.error('PayPal Capture Error:', captureData);
            return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('PayPal Capture Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
