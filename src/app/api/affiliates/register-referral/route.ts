import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { recordSignupReferral } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        // SECURITY: Require verified authenticated session and NEVER allow attributing arbitrary user_ids (blocks IDOR)
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const refCode = typeof body.ref_code === 'string'
            ? body.ref_code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')
            : '';

        if (!refCode) {
            return NextResponse.json({ success: false, message: 'No valid ref code provided' }, { status: 400 });
        }

        const result = await recordSignupReferral(supabase, user.id, refCode);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Register referral error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
