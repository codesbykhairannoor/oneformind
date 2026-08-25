import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { plan = 'architect', billing = 'yearly', paymentMethod = '' } = body;

        // Map Plan + Billing to Price (IDR)
        const prices: Record<string, Record<string, number>> = {
            'architect': { 'yearly': 79000, 'monthly': 99000 },
            'quantum': { 'yearly': 109000, 'monthly': 159000 },
            'legendary': { 'yearly': 899000, 'monthly': 899000 }, // same for lifetime
            'lifetime': { 'yearly': 899000, 'monthly': 899000 }
        };

        const planKey = plan.toLowerCase();
        let paymentAmount = prices[planKey]?.[billing] || 79000;
        let productDetails = `OneForMind ${plan.charAt(0).toUpperCase() + plan.slice(1)} (${billing.charAt(0).toUpperCase() + billing.slice(1)}) Subscription`;

        if (billing === 'yearly' && planKey !== 'lifetime' && planKey !== 'legendary') {
            paymentAmount *= 12;
            productDetails = `OneForMind ${plan.charAt(0).toUpperCase() + plan.slice(1)} Annual (12 Months) Subscription`;
        }

        if (planKey === 'lifetime' || planKey === 'legendary') {
            productDetails = 'OneForMind Legendary Founder Edition (Lifetime)';
        }

        const userId = session.user.id;
        const merchantOrderId = `${planKey.toUpperCase()}-${userId}-${Date.now()}`;
        
        // Fetch user for email
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const email = user.email;
        const merchantCode = process.env.DUITKU_MERCHANT_CODE || '';
        const apiKey = process.env.DUITKU_API_KEY || '';
        const env = process.env.DUITKU_ENV || 'sandbox';

        if (!merchantCode || !apiKey) {
            console.error('Duitku API Credentials Missing', { env });
            return NextResponse.json({ error: 'Duitku API credentials not configured.' }, { status: 500 });
        }

        const timestamp = Date.now();
        const signatureStr = merchantCode + timestamp + apiKey;
        const signature = crypto.createHash('sha256').update(signatureStr).digest('hex');

        const itemDetails = [{
            name: productDetails,
            price: paymentAmount,
            quantity: 1
        }];

        const origin = req.headers.get('origin') || process.env.APP_URL || 'https://oneformind.com';
        const callbackUrl = `${process.env.APP_URL || origin}/api/payment/duitku/callback`;
        const returnUrl = `${origin}/id/payment/status`;

        const params: any = {
            paymentAmount,
            merchantOrderId,
            productDetails,
            email,
            itemDetails,
            callbackUrl,
            returnUrl,
            expiryPeriod: 60
        };

        if (paymentMethod && paymentMethod !== '00') {
            params.paymentMethod = paymentMethod;
        }

        const url = env === 'production'
            ? 'https://api-prod.duitku.com/api/merchant/createInvoice'
            : 'https://api-sandbox.duitku.com/api/merchant/createInvoice';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-duitku-signature': signature,
                'x-duitku-timestamp': timestamp.toString(),
                'x-duitku-merchantcode': merchantCode
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        if (response.ok && data.paymentUrl) {
            return NextResponse.json({
                paymentUrl: data.paymentUrl,
                reference: data.reference || null
            });
        } else {
            console.error('Duitku Gateway Error:', data);
            return NextResponse.json({ error: data.Message || data.responseMessage || 'Failed to create invoice' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Duitku Checkout Exception:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
