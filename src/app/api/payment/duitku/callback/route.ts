import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); // or formData if they send it as form-urlencoded, but usually JSON
        // Duitku sends application/x-www-form-urlencoded by default for callbacks!
        // Wait, Next.js handles form-urlencoded differently. Let's try parsing as text first or use request.formData()
        // Legacy code used $request->input('amount') which handles both JSON and form data.
        
        const contentType = req.headers.get('content-type') || '';
        const proto = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const goUrl = `${proto}://${host}/api?route=payment-duitku-callback`;
        
        // Pass everything directly to Go (either form or json)
        let requestBody;
        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.text(); // Get raw URL encoded text
            requestBody = formData;
        } else {
            const json = await req.json();
            requestBody = JSON.stringify(json);
        }

        const goRes = await fetch(goUrl, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
            },
            body: requestBody
        });

        if (!goRes.ok) {
            const text = await goRes.text();
            throw new Error(`Go backend returned ${goRes.status}: ${text}`);
        }

        const data = await goRes.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Duitku Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
