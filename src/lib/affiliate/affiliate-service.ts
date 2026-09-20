import { SupabaseClient } from '@supabase/supabase-js';

export interface AffiliateProfile {
    id: string;
    user_id: string;
    ref_code: string;
    commission_rate: number; // e.g. 0.60 (60%)
    payout_bank_name: string | null;
    payout_account_number: string | null;
    payout_account_name: string | null;
    is_active: boolean;
    total_clicks: number;
    total_signups: number;
    total_earned: number;
    total_paid: number;
    created_at: string;
    updated_at: string;
}

export interface AffiliateReferral {
    id: string;
    affiliate_user_id: string;
    referred_user_id: string;
    ref_code_used: string;
    first_click_at: string | null;
    registered_at: string;
    status: 'registered' | 'converted' | 'churned';
    referred_user?: {
        email?: string;
        full_name?: string;
        created_at?: string;
    };
}

export interface AffiliateCommission {
    id: string;
    affiliate_user_id: string;
    referred_user_id: string;
    gateway: 'duitku' | 'lemonsqueezy' | 'paypal' | string;
    transaction_id: string;
    plan_name: string;
    transaction_amount: number;
    currency: string;
    commission_rate: number;
    commission_amount: number;
    billing_cycle: number; // 1 to 8
    status: 'pending' | 'approved' | 'paid' | 'voided';
    holding_until: string;
    created_at: string;
    approved_at: string | null;
    paid_at: string | null;
}

export interface AffiliatePayout {
    id: string;
    affiliate_user_id: string;
    amount: number;
    currency: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    admin_notes?: string | null;
    transfer_proof_url?: string | null;
    requested_at: string;
    completed_at?: string | null;
}

export interface AffiliateDashboardStats {
    profile: AffiliateProfile;
    referrals: AffiliateReferral[];
    commissions: AffiliateCommission[];
    payouts: AffiliatePayout[];
    metrics: {
        totalClicks: number;
        totalSignups: number;
        convertedSignups: number;
        conversionRate: number;
        totalEarned: number;
        pendingEscrow: number;
        availableBalance: number;
        totalPaid: number;
    };
}

/**
 * Clean & generate a unique ref code based on user identity
 */
export function generateDefaultRefCode(nameOrEmail?: string): string {
    const raw = (nameOrEmail || 'PARTNER')
        .split('@')[0]
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 10);
    
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${raw || 'TRANVAS'}${randomSuffix}`;
}

/**
 * Retrieve or automatically initialize an affiliate profile for a user
 */
export async function getOrCreateAffiliateProfile(
    supabase: SupabaseClient,
    userId: string,
    userMeta?: { name?: string; email?: string }
): Promise<AffiliateProfile | null> {
    try {
        // 1. Try to fetch existing profile
        const { data: existing, error: fetchErr } = await supabase
            .from('affiliate_profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (existing) {
            return existing as AffiliateProfile;
        }

        // 2. Generate new unique referral code
        let uniqueCode = generateDefaultRefCode(userMeta?.name || userMeta?.email);
        
        // Ensure uniqueness
        const { data: duplicate } = await supabase
            .from('affiliate_profiles')
            .select('id')
            .eq('ref_code', uniqueCode)
            .maybeSingle();

        if (duplicate) {
            uniqueCode = `${uniqueCode.slice(0, 8)}${Math.floor(100 + Math.random() * 900)}`;
        }

        const newProfile = {
            user_id: userId,
            ref_code: uniqueCode,
            commission_rate: 0.60, // 60% Standard Recurring Commission
            payout_bank_name: null,
            payout_account_number: null,
            payout_account_name: null,
            is_active: true,
            total_clicks: 0,
            total_signups: 0,
            total_earned: 0,
            total_paid: 0,
        };

        const { data: created, error: insertErr } = await supabase
            .from('affiliate_profiles')
            .insert(newProfile)
            .select('*')
            .single();

        if (insertErr) {
            console.error('Error creating affiliate profile:', insertErr);
            return null;
        }

        return created as AffiliateProfile;
    } catch (err) {
        console.error('Affiliate profile operation failed:', err);
        return null;
    }
}

/**
 * Record a new signup referral linkage between a referred user and an affiliate partner
 */
export async function recordSignupReferral(
    supabase: SupabaseClient,
    referredUserId: string,
    refCode: string
): Promise<{ success: boolean; message: string }> {
    try {
        if (!refCode || !referredUserId) {
            return { success: false, message: 'Missing referral code or user id' };
        }

        const cleanCode = refCode.trim().toUpperCase();

        // 1. Find the partner owning this ref code
        const { data: partner, error: partnerErr } = await supabase
            .from('affiliate_profiles')
            .select('user_id, is_active')
            .eq('ref_code', cleanCode)
            .maybeSingle();

        if (partnerErr || !partner || !partner.is_active) {
            return { success: false, message: 'Referral code not found or partner inactive' };
        }

        // 2. Self-referral prevention rule
        if (partner.user_id === referredUserId) {
            return { success: false, message: 'Self-referral is strictly disallowed' };
        }

        // 3. Check if referral relationship already exists
        const { data: existingRef } = await supabase
            .from('affiliate_referrals')
            .select('id')
            .eq('referred_user_id', referredUserId)
            .maybeSingle();

        if (existingRef) {
            return { success: true, message: 'Referral already recorded previously' };
        }

        // 4. Insert new referral
        const { error: insertErr } = await supabase
            .from('affiliate_referrals')
            .insert({
                affiliate_user_id: partner.user_id,
                referred_user_id: referredUserId,
                ref_code_used: cleanCode,
                status: 'registered',
            });

        if (insertErr) {
            console.error('Failed to link referral in DB:', insertErr);
            return { success: false, message: insertErr.message };
        }

        // 5. Increment total_signups counter on affiliate profile
        try {
            await supabase.rpc('increment_affiliate_signups', { partner_id: partner.user_id });
        } catch {
            // Fallback manual increment if RPC not created
            const { data: prof } = await supabase
                .from('affiliate_profiles')
                .select('total_signups')
                .eq('user_id', partner.user_id)
                .single();
            if (prof) {
                await supabase
                    .from('affiliate_profiles')
                    .update({ total_signups: (prof.total_signups || 0) + 1 })
                    .eq('user_id', partner.user_id);
            }
        }

        return { success: true, message: 'Referral linked successfully' };
    } catch (err: any) {
        console.error('Referral attribution exception:', err);
        return { success: false, message: err?.message || 'Unknown attribution error' };
    }
}

/**
 * Increment click count for a given ref code
 */
export async function recordAffiliateClick(
    supabase: SupabaseClient,
    refCode: string
): Promise<boolean> {
    try {
        const cleanCode = refCode.trim().toUpperCase();
        const { data: partner } = await supabase
            .from('affiliate_profiles')
            .select('user_id, total_clicks')
            .eq('ref_code', cleanCode)
            .maybeSingle();

        if (!partner) return false;

        await supabase
            .from('affiliate_profiles')
            .update({ total_clicks: (partner.total_clicks || 0) + 1 })
            .eq('user_id', partner.user_id);

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Automatically approve commissions that have passed their 14-day Net-14 Escrow holding date
 */
export async function autoReleaseMaturedCommissions(supabase: SupabaseClient, userId?: string) {
    try {
        const now = new Date().toISOString();
        let query = supabase
            .from('affiliate_commissions')
            .update({
                status: 'approved',
                approved_at: now,
            })
            .eq('status', 'pending')
            .lte('holding_until', now);

        if (userId) {
            query = query.eq('affiliate_user_id', userId);
        }

        const { data, error } = await query.select('id, commission_amount');
        if (error) {
            console.warn('Auto-release escrow error:', error);
            return { releasedCount: 0 };
        }

        return { releasedCount: data?.length || 0, data };
    } catch (e) {
        return { releasedCount: 0 };
    }
}

/**
 * Fetch all partner portal dashboard data and calculated financial metrics
 */
export async function getAffiliateDashboardData(
    supabase: SupabaseClient,
    userId: string,
    userMeta?: { name?: string; email?: string }
): Promise<AffiliateDashboardStats | null> {
    try {
        // 0. Auto-release any matured escrow commissions for this user
        await autoReleaseMaturedCommissions(supabase, userId);

        // 1. Get or create profile
        const profile = await getOrCreateAffiliateProfile(supabase, userId, userMeta);
        if (!profile) return null;

        // 2. Fetch referrals
        const { data: referralsData } = await supabase
            .from('affiliate_referrals')
            .select('*')
            .eq('affiliate_user_id', userId)
            .order('registered_at', { ascending: false });

        const referrals: AffiliateReferral[] = (referralsData || []) as AffiliateReferral[];

        // 3. Fetch commissions
        const { data: commissionsData } = await supabase
            .from('affiliate_commissions')
            .select('*')
            .eq('affiliate_user_id', userId)
            .order('created_at', { ascending: false });

        const commissions: AffiliateCommission[] = (commissionsData || []) as AffiliateCommission[];

        // 4. Fetch payouts
        const { data: payoutsData } = await supabase
            .from('affiliate_payouts')
            .select('*')
            .eq('affiliate_user_id', userId)
            .order('requested_at', { ascending: false });

        const payouts: AffiliatePayout[] = (payoutsData || []) as AffiliatePayout[];

        // 5. Compute real-time metrics
        const totalClicks = profile.total_clicks || 0;
        const totalSignups = profile.total_signups || referrals.length;
        const convertedSignups = referrals.filter(r => r.status === 'converted').length;
        const conversionRate = totalSignups > 0 ? (convertedSignups / totalSignups) * 100 : 0;

        let totalEarned = 0;
        let pendingEscrow = 0;
        let approvedAvailable = 0;
        const now = new Date().getTime();

        commissions.forEach(c => {
            const amount = Number(c.commission_amount) || 0;
            if (c.status === 'voided') return;

            totalEarned += amount;

            const holdingDate = new Date(c.holding_until).getTime();
            if (c.status === 'pending' && holdingDate > now) {
                pendingEscrow += amount;
            } else if (c.status === 'approved' || (c.status === 'pending' && holdingDate <= now)) {
                approvedAvailable += amount;
            }
        });

        // Deduct requested or processing payouts from available balance
        let pendingPayoutAmount = 0;
        let totalPaid = 0;

        payouts.forEach(p => {
            const pAmount = Number(p.amount) || 0;
            if (p.status === 'completed') {
                totalPaid += pAmount;
            } else if (p.status === 'pending' || p.status === 'processing') {
                pendingPayoutAmount += pAmount;
            }
        });

        const availableBalance = Math.max(0, approvedAvailable - pendingPayoutAmount);

        return {
            profile,
            referrals,
            commissions,
            payouts,
            metrics: {
                totalClicks,
                totalSignups,
                convertedSignups,
                conversionRate: Number(conversionRate.toFixed(1)),
                totalEarned,
                pendingEscrow,
                availableBalance,
                totalPaid,
            }
        };
    } catch (err) {
        console.error('Error compiling affiliate dashboard:', err);
        return null;
    }
}

/**
 * Update payout details or custom referral handle
 */
export async function updateAffiliateSettings(
    supabase: SupabaseClient,
    userId: string,
    params: {
        payout_bank_name?: string;
        payout_account_number?: string;
        payout_account_name?: string;
        custom_ref_code?: string;
    }
): Promise<{ success: boolean; message: string; ref_code?: string }> {
    try {
        const updatePayload: Record<string, any> = {
            updated_at: new Date().toISOString(),
        };

        if (params.payout_bank_name !== undefined) updatePayload.payout_bank_name = params.payout_bank_name;
        if (params.payout_account_number !== undefined) updatePayload.payout_account_number = params.payout_account_number;
        if (params.payout_account_name !== undefined) updatePayload.payout_account_name = params.payout_account_name;

        // If user wants to customize their ref code
        if (params.custom_ref_code) {
            const cleanCode = params.custom_ref_code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
            if (cleanCode.length < 3 || cleanCode.length > 25) {
                return { success: false, message: 'Custom code must be between 3 and 25 alphanumeric characters.' };
            }

            // Check uniqueness
            const { data: existing } = await supabase
                .from('affiliate_profiles')
                .select('id, user_id')
                .eq('ref_code', cleanCode)
                .maybeSingle();

            if (existing && existing.user_id !== userId) {
                return { success: false, message: 'This referral code is already taken. Please pick another.' };
            }

            updatePayload.ref_code = cleanCode;
        }

        const { error } = await supabase
            .from('affiliate_profiles')
            .update(updatePayload)
            .eq('user_id', userId);

        if (error) throw error;

        return {
            success: true,
            message: 'Affiliate settings successfully updated',
            ref_code: updatePayload.ref_code,
        };
    } catch (err: any) {
        return { success: false, message: err?.message || 'Failed to update settings' };
    }
}

/**
 * Request a payout withdrawal
 */
export async function requestAffiliatePayout(
    supabase: SupabaseClient,
    userId: string,
    params: {
        amount: number;
        currency?: string;
        bank_name: string;
        account_number: string;
        account_name: string;
    }
): Promise<{ success: boolean; message: string; payout?: AffiliatePayout }> {
    try {
        const stats = await getAffiliateDashboardData(supabase, userId);
        if (!stats) return { success: false, message: 'Partner profile not found' };

        const currency = params.currency || 'IDR';
        const minThreshold = currency === 'IDR' ? 50000 : 5; // Rp 50.000 or $5

        if (params.amount < minThreshold) {
            return {
                success: false,
                message: currency === 'IDR' 
                    ? 'Minimum pencairan saldo adalah Rp 50.000' 
                    : 'Minimum payout threshold is $5.00'
            };
        }

        if (params.amount > stats.metrics.availableBalance) {
            return {
                success: false,
                message: 'Requested amount exceeds your available approved balance.'
            };
        }

        const { data: payout, error } = await supabase
            .from('affiliate_payouts')
            .insert({
                affiliate_user_id: userId,
                amount: params.amount,
                currency,
                bank_name: params.bank_name,
                account_number: params.account_number,
                account_name: params.account_name,
                status: 'pending',
                requested_at: new Date().toISOString(),
            })
            .select('*')
            .single();

        if (error) throw error;

        return {
            success: true,
            message: 'Payout request successfully submitted for review.',
            payout: payout as AffiliatePayout
        };
    } catch (err: any) {
        return { success: false, message: err?.message || 'Failed to submit payout request' };
    }
}

/**
 * Universal Multi-Gateway Commission Engine (Lemon Squeezy, Duitku, PayPal)
 * 60% Recurring commission for up to 8 billing cycles with 14-day anti-refund holding period.
 */
export async function recordAffiliateCommission(
    supabase: SupabaseClient,
    params: {
        referredUserId: string;
        gateway: 'duitku' | 'lemonsqueezy' | 'paypal' | string;
        transactionId: string;
        planName: string;
        transactionAmount: number;
        currency: string;
        billingCycle?: number;
    }
): Promise<{ rewarded: boolean; commissionAmount: number; partnerId?: string; reason?: string }> {
    try {
        // 1. Locate referral relationship
        const { data: referral, error: refErr } = await supabase
            .from('affiliate_referrals')
            .select('*')
            .eq('referred_user_id', params.referredUserId)
            .maybeSingle();

        if (refErr || !referral) {
            return { rewarded: false, commissionAmount: 0, reason: 'No affiliate referral linked for this user' };
        }

        // 2. Locate affiliate partner profile
        const { data: partner, error: partErr } = await supabase
            .from('affiliate_profiles')
            .select('*')
            .eq('user_id', referral.affiliate_user_id)
            .maybeSingle();

        if (partErr || !partner || !partner.is_active) {
            return { rewarded: false, commissionAmount: 0, reason: 'Partner inactive or profile not found' };
        }

        // 3. Check billing cycle count (Max 8 recurring cycles per user)
        const cycle = params.billingCycle || 1;
        if (cycle > 8) {
            return { rewarded: false, commissionAmount: 0, reason: 'Exceeded maximum 8 billing cycles limit' };
        }

        // 4. Calculate 60% commission
        const rate = Number(partner.commission_rate) || 0.60;
        const commissionAmount = Math.round(params.transactionAmount * rate * 100) / 100;

        // 5. Holding period: 14 days escrow
        const holdingDate = new Date();
        holdingDate.setDate(holdingDate.getDate() + 14);

        // 6. Insert into commission ledger
        const { error: commErr } = await supabase
            .from('affiliate_commissions')
            .insert({
                affiliate_user_id: partner.user_id,
                referred_user_id: params.referredUserId,
                gateway: params.gateway,
                transaction_id: params.transactionId,
                plan_name: params.planName,
                transaction_amount: params.transactionAmount,
                currency: params.currency,
                commission_rate: rate,
                commission_amount: commissionAmount,
                billing_cycle: cycle,
                status: 'pending',
                holding_until: holdingDate.toISOString(),
            });

        if (commErr) {
            console.error('Failed to log affiliate commission:', commErr);
            return { rewarded: false, commissionAmount: 0, reason: commErr.message };
        }

        // 7. Update referral status to converted
        await supabase
            .from('affiliate_referrals')
            .update({ status: 'converted' })
            .eq('id', referral.id);

        // 8. Update partner total earned
        await supabase
            .from('affiliate_profiles')
            .update({
                total_earned: (Number(partner.total_earned) || 0) + commissionAmount,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', partner.user_id);

        return {
            rewarded: true,
            commissionAmount,
            partnerId: partner.user_id,
        };
    } catch (err: any) {
        console.error('Commission recording exception:', err);
        return { rewarded: false, commissionAmount: 0, reason: err?.message || 'Server error' };
    }
}
