import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { autoReleaseMaturedCommissions } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // SECURITY CRITICAL (FAIL-CLOSED): Protect cron endpoint with CRON_SECRET bearer verification
        const cronSecret = process.env.CRON_SECRET || '';
        if (!cronSecret) {
            return NextResponse.json({ error: 'Cron secret not configured' }, { status: 503 });
        }

        const authHeader = req.headers.get('authorization') || '';
        const expected = `Bearer ${cronSecret}`;
        const a = Buffer.from(authHeader, 'utf8');
        const b = Buffer.from(expected, 'utf8');
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const result = await autoReleaseMaturedCommissions(supabaseAdmin);
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            releasedCount: result.releasedCount,
        });
    } catch (error: any) {
        console.error('Escrow release cron error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
