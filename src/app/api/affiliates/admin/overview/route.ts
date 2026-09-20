import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isAdminUser } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const { data: { session } } = await supabase.auth.getSession();
        const user = authUser || session?.user;

        if (!user || !isAdminUser(user)) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // 1. Fetch all affiliate profiles
        const { data: profiles, error: profErr } = await supabase
            .from('affiliate_profiles')
            .select('*')
            .order('total_earned', { ascending: false });

        if (profErr) throw profErr;

        // 2. Fetch all payout requests
        const { data: payouts, error: payErr } = await supabase
            .from('affiliate_payouts')
            .select('*')
            .order('requested_at', { ascending: false });

        if (payErr) throw payErr;

        // 3. Fetch recent commissions
        const { data: commissions, error: commErr } = await supabase
            .from('affiliate_commissions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        // 4. Fetch recent referrals across the platform
        const { data: referrals, error: refErr } = await supabase
            .from('affiliate_referrals')
            .select('*')
            .order('registered_at', { ascending: false })
            .limit(200);

        if (refErr) throw refErr;

        // 5. Calculate executive KPIs
        const partnerList = profiles || [];
        const payoutList = payouts || [];
        const commissionList = commissions || [];
        const referralList = referrals || [];

        let totalClicks = 0;
        let totalSignups = 0;
        let totalEarned = 0;
        let totalPaid = 0;

        partnerList.forEach(p => {
            totalClicks += Number(p.total_clicks) || 0;
            totalSignups += Number(p.total_signups) || 0;
            totalEarned += Number(p.total_earned) || 0;
            totalPaid += Number(p.total_paid) || 0;
        });

        let pendingPayoutsAmount = 0;
        let pendingPayoutsCount = 0;

        payoutList.forEach(p => {
            if (p.status === 'pending' || p.status === 'processing') {
                pendingPayoutsAmount += Number(p.amount) || 0;
                pendingPayoutsCount += 1;
            }
        });

        let escrowAmount = 0;
        const now = new Date().getTime();
        commissionList.forEach(c => {
            if (c.status === 'pending' && new Date(c.holding_until).getTime() > now) {
                escrowAmount += Number(c.commission_amount) || 0;
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                metrics: {
                    totalPartners: partnerList.length,
                    totalClicks,
                    totalSignups,
                    totalEarned,
                    totalPaid,
                    pendingPayoutsCount,
                    pendingPayoutsAmount,
                    escrowAmount,
                },
                partners: partnerList,
                referrals: referralList,
                pendingPayouts: payoutList.filter(p => p.status === 'pending' || p.status === 'processing'),
                allPayouts: payoutList,
                recentCommissions: commissionList,
            }
        });
    } catch (error: any) {
        console.error('Admin affiliate overview error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
