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

        const statusParam = req.nextUrl.searchParams.get('status');

        let query = supabase
            .from('affiliate_payouts')
            .select(`
                *,
                affiliate_profiles!inner (
                    ref_code,
                    total_earned,
                    total_paid,
                    user_id
                )
            `)
            .order('requested_at', { ascending: false });

        if (statusParam) {
            query = query.eq('status', statusParam);
        }

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ success: true, data: data || [] });
    } catch (error: any) {
        console.error('Admin affiliate payouts GET error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const { data: { session } } = await supabase.auth.getSession();
        const user = authUser || session?.user;

        if (!user || !isAdminUser(user)) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const payoutId = body.id;
        const newStatus = body.status; // 'completed' | 'processing' | 'rejected'
        const adminNotes = body.admin_notes || '';
        const transferProofUrl = body.transfer_proof_url || '';

        if (!payoutId || !newStatus) {
            return NextResponse.json({ error: 'Missing payout id or status' }, { status: 400 });
        }

        // Fetch existing payout
        const { data: payout, error: fetchErr } = await supabase
            .from('affiliate_payouts')
            .select('*')
            .eq('id', payoutId)
            .single();

        if (fetchErr || !payout) {
            return NextResponse.json({ error: 'Payout not found' }, { status: 404 });
        }

        const updatePayload: Record<string, any> = {
            status: newStatus,
            admin_notes: adminNotes,
            transfer_proof_url: transferProofUrl,
        };

        if (newStatus === 'completed') {
            updatePayload.completed_at = new Date().toISOString();

            // Increment total_paid on affiliate profile
            const { data: profile } = await supabase
                .from('affiliate_profiles')
                .select('total_paid')
                .eq('user_id', payout.affiliate_user_id)
                .single();

            if (profile) {
                await supabase
                    .from('affiliate_profiles')
                    .update({
                        total_paid: (Number(profile.total_paid) || 0) + Number(payout.amount),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', payout.affiliate_user_id);
            }
        }

        const { error: updateErr } = await supabase
            .from('affiliate_payouts')
            .update(updatePayload)
            .eq('id', payoutId);

        if (updateErr) throw updateErr;

        return NextResponse.json({ success: true, message: 'Payout status updated' });
    } catch (error: any) {
        console.error('Admin affiliate payouts PUT error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
