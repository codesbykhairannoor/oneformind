import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { requestAffiliatePayout } from '@/lib/affiliate/affiliate-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const amount = Number(body.amount);
        const currency = body.currency || 'IDR';
        const bank_name = body.bank_name;
        const account_number = body.account_number;
        const account_name = body.account_name;

        if (!amount || amount <= 0 || !bank_name || !account_number || !account_name) {
            return NextResponse.json({ error: 'Missing required payout fields' }, { status: 400 });
        }

        const result = await requestAffiliatePayout(supabase, session.user.id, {
            amount,
            currency,
            bank_name,
            account_number,
            account_name,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Affiliate payout error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
