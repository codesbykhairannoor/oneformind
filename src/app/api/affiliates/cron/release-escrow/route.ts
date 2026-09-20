import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { autoReleaseMaturedCommissions } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
