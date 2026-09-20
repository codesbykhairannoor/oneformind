import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { recordSignupReferral } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const refCode = body.ref_code;
        const referredUserId = body.user_id;

        if (!refCode) {
            return NextResponse.json({ success: false, message: 'No ref code provided' });
        }

        const supabase = await createClient();
        
        // If user_id is not passed, check current session
        let targetUserId = referredUserId;
        if (!targetUserId) {
            const { data: { session } } = await supabase.auth.getSession();
            targetUserId = session?.user?.id;
        }

        if (!targetUserId) {
            return NextResponse.json({ error: 'User ID required for referral attribution' }, { status: 400 });
        }

        const result = await recordSignupReferral(supabase, targetUserId, refCode);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Register referral error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
