import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // or formData if they send it as form-urlencoded, but usually JSON
        // Duitku sends application/x-www-form-urlencoded by default for callbacks!
        // Wait, Next.js handles form-urlencoded differently. Let's try parsing as text first or use request.formData()
        // Legacy code used $request->input('amount') which handles both JSON and form data.
        
        let amount, merchantOrderId, signature, resultCode;

        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            amount = formData.get('amount')?.toString();
            merchantOrderId = formData.get('merchantOrderId')?.toString();
            signature = formData.get('signature')?.toString();
            resultCode = formData.get('resultCode')?.toString();
        } else {
            const json = await req.json();
            amount = json.amount?.toString();
            merchantOrderId = json.merchantOrderId?.toString();
            signature = json.signature?.toString();
            resultCode = json.resultCode?.toString();
        }

        if (!amount || !merchantOrderId || !signature || !resultCode) {
            return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
        }

        const merchantCode = process.env.DUITKU_MERCHANT_CODE || '';
        const apiKey = process.env.DUITKU_API_KEY || '';

        const signatureStr = merchantCode + amount + merchantOrderId + apiKey;
        const calcSignature = crypto.createHash('md5').update(signatureStr).digest('hex');

        if (signature !== calcSignature) {
            return NextResponse.json({ message: 'Bad Signature' }, { status: 400 });
        }

        if (resultCode === '00') {
            const parts = merchantOrderId.split('-');
            const planType = parts[0]?.toUpperCase() || 'ARCHITECT';
            const userId = parts[1] || null;

            if (userId) {
                const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
                
                if (user) {
                    let durationMonths = 1; // Default to 1 month, but we should know if it's yearly from the price or merchantId.
                    // Let's infer yearly vs monthly based on price to be completely accurate, or just add a standard year.
                    // Wait, legacy code gave 1 month for architect/quantum and 1200 months for lifetime!
                    // Wait! The legacy code actually didn't distinguish monthly vs yearly in the callback!
                    // Look at line 223: $duration = 1;
                    // That means the legacy code gave EVERYONE 1 month, even if they paid for a year!
                    // Wow, that was a bug in their legacy code. I'll fix it by parsing the amount.

                    let finalPlan = planType.toLowerCase();
                    let premiumUntil = new Date();

                    if (planType === 'LIFETIME' || planType === 'LEGENDARY') {
                        finalPlan = 'legendary';
                        premiumUntil.setFullYear(premiumUntil.getFullYear() + 100);
                    } else {
                        // Check if amount matches yearly
                        const isYearly = Number(amount) > 200000; // Anything above 200k IDR is yearly
                        if (isYearly) {
                            premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
                        } else {
                            premiumUntil.setMonth(premiumUntil.getMonth() + 1);
                        }
                    }

                    if (planType === 'QUANTUM') {
                        finalPlan = 'quantum';
                    }

                    await prisma.user.update({
                        where: { id: Number(userId) },
                        data: {
                            isPremium: true,
                            planType: finalPlan,
                            premiumUntil: premiumUntil
                        }
                    });

                    console.log(`Successfully upgraded user ${userId} to ${finalPlan} until ${premiumUntil}`);
                }
            }
        }

        return NextResponse.json({ message: 'Callback processed' });
    } catch (error: any) {
        console.error('Duitku Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
