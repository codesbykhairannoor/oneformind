import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAffiliateDashboardData, updateAffiliateSettings } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const stats = await getAffiliateDashboardData(supabase, session.user.id, {
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            email: session.user.email,
        });

        if (!stats) {
            return NextResponse.json({ error: 'Failed to load affiliate portal data' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: stats });
    } catch (error: any) {
        console.error('Affiliate portal GET error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = await updateAffiliateSettings(supabase, session.user.id, {
            payout_bank_name: body.payout_bank_name,
            payout_account_number: body.payout_account_number,
            payout_account_name: body.payout_account_name,
            custom_ref_code: body.custom_ref_code,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Affiliate portal PUT error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
