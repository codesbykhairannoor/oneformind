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
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Duitku Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

