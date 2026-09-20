import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { recordAffiliateClick } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const refCode = body.ref_code;

        if (!refCode) {
            return NextResponse.json({ success: false });
        }

        const supabase = await createClient();
        const success = await recordAffiliateClick(supabase, refCode);
        return NextResponse.json({ success });
    } catch (e) {
        return NextResponse.json({ success: false });
    }
}
