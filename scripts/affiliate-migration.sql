-- ==============================================================================
-- TRANVAS LIFE OS: NATIVE AFFILIATE & PARTNER SYSTEM DATABASE SCHEMA
-- Zero-cost, self-hosted, scalable affiliate attribution for Supabase
-- ==============================================================================

-- 1. TABEL PROFIL AFILIASI (PARTNER PROFILES)
CREATE TABLE IF NOT EXISTS public.affiliate_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    ref_code VARCHAR(50) UNIQUE NOT NULL,
    commission_rate NUMERIC DEFAULT 0.60 NOT NULL, -- 60% standard recurring commission
    payout_bank_name VARCHAR(50),                  -- e.g. 'BCA', 'Mandiri', 'BRI', 'QRIS', 'PayPal', 'Wise'
    payout_account_number VARCHAR(100),            -- Bank account number or PayPal email
    payout_account_name VARCHAR(100),              -- Account holder name
    is_active BOOLEAN DEFAULT true NOT NULL,
    total_clicks INT DEFAULT 0 NOT NULL,
    total_signups INT DEFAULT 0 NOT NULL,
    total_earned NUMERIC DEFAULT 0 NOT NULL,
    total_paid NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. TABEL PELACAKAN REFERRAL (REFERRAL LEADS)
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    ref_code_used VARCHAR(50) NOT NULL,
    first_click_at TIMESTAMPTZ,
    registered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status VARCHAR(20) DEFAULT 'registered' NOT NULL -- 'registered' | 'converted' | 'churned'
);

-- 3. TABEL LOG KOMISI TRANSAKSI (COMMISSION LEDGER)
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    gateway VARCHAR(30) NOT NULL, -- 'duitku' | 'lemonsqueezy' | 'paypal'
    transaction_id VARCHAR(100) NOT NULL,
    plan_name VARCHAR(50) NOT NULL, -- 'architect' | 'quantum' | 'legendary'
    transaction_amount NUMERIC NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR' NOT NULL,
    commission_rate NUMERIC DEFAULT 0.60 NOT NULL,
    commission_amount NUMERIC NOT NULL,
    billing_cycle INT DEFAULT 1 NOT NULL, -- Bulan ke-1 s/d 8
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending' | 'approved' | 'paid' | 'voided'
    holding_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days') NOT NULL, -- 14-Day Escrow / Guarantee Period
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ
);

-- 4. TABEL PENGAJUAN PENCAIRAN (PAYOUT REQUESTS)
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR' NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending' | 'processing' | 'completed' | 'rejected'
    admin_notes TEXT,
    transfer_proof_url TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY SPEED
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_affiliate_profiles_ref_code ON public.affiliate_profiles(ref_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate ON public.affiliate_referrals(affiliate_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred ON public.affiliate_referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate ON public.affiliate_commissions(affiliate_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_referred ON public.affiliate_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_status ON public.affiliate_commissions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate ON public.affiliate_payouts(affiliate_user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can view own affiliate profile"
    ON public.affiliate_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create/update own affiliate profile"
    ON public.affiliate_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own affiliate profile"
    ON public.affiliate_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- 2. Referrals RLS
CREATE POLICY "Users can view their referrals"
    ON public.affiliate_referrals FOR SELECT
    USING (auth.uid() = affiliate_user_id);

-- 3. Commissions RLS
CREATE POLICY "Users can view their commissions"
    ON public.affiliate_commissions FOR SELECT
    USING (auth.uid() = affiliate_user_id);

-- 4. Payouts RLS
CREATE POLICY "Users can view their payouts"
    ON public.affiliate_payouts FOR SELECT
    USING (auth.uid() = affiliate_user_id);

CREATE POLICY "Users can request payouts"
    ON public.affiliate_payouts FOR INSERT
    WITH CHECK (auth.uid() = affiliate_user_id);
