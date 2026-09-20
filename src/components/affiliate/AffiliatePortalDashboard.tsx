'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    Sparkles,
    Copy,
    Check,
    DollarSign,
    Users,
    CreditCard,
    ArrowUpRight,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Lock,
    MousePointerClick,
    TrendingUp,
    ShieldCheck,
    UserCheck,
    Clock,
    CheckCircle
} from 'lucide-react';
import { AffiliateDashboardStats } from '@/lib/affiliate/affiliate-service';

export default function AffiliatePortalDashboard() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AffiliateDashboardStats | null>(null);
    const [copied, setCopied] = useState(false);

    // Payout modal state
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState<string>('');
    const [payoutBank, setPayoutBank] = useState<string>('BCA');
    const [payoutAccountNum, setPayoutAccountNum] = useState<string>('');
    const [payoutAccountName, setPayoutAccountName] = useState<string>('');
    const [payoutSubmitting, setPayoutSubmitting] = useState(false);
    const [payoutMessage, setPayoutMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Saved payout account settings state
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountSaving, setAccountSaving] = useState(false);
    const [accountSaved, setAccountSaved] = useState(false);

    const [activeTab, setActiveTab] = useState<'referrals' | 'commissions' | 'payouts'>('referrals');
    const [linkDestination, setLinkDestination] = useState<'register' | 'landing'>('register');

    const fetchPortalData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/affiliates/portal');
            if (res.ok) {
                const json = await res.json();
                if (json?.data) {
                    setStats(json.data);
                    setBankName(json.data.profile.payout_bank_name || 'BCA');
                    setAccountNumber(json.data.profile.payout_account_number || '');
                    setAccountName(json.data.profile.payout_account_name || '');

                    setPayoutBank(json.data.profile.payout_bank_name || 'BCA');
                    setPayoutAccountNum(json.data.profile.payout_account_number || '');
                    setPayoutAccountName(json.data.profile.payout_account_name || '');
                }
            }
        } catch (e) {
            console.error('Error loading partner portal data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortalData();
    }, []);

    const registerLink = typeof window !== 'undefined' && stats?.profile?.ref_code
        ? `${window.location.origin}/${locale}/register?ref=${stats.profile.ref_code}`
        : `https://tranvas.com/${locale}/register?ref=${stats?.profile?.ref_code || 'PARTNER'}`;

    const landingLink = typeof window !== 'undefined' && stats?.profile?.ref_code
        ? `${window.location.origin}/${locale}?ref=${stats.profile.ref_code}`
        : `https://tranvas.com/${locale}?ref=${stats?.profile?.ref_code || 'PARTNER'}`;

    const activeAffiliateLink = linkDestination === 'register' ? registerLink : landingLink;

    const handleCopyLink = () => {
        if (!navigator?.clipboard) return;
        navigator.clipboard.writeText(activeAffiliateLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Simpan Rekening Pembayaran
    const handleSaveAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setAccountSaving(true);
        setAccountSaved(false);

        try {
            const res = await fetch('/api/affiliates/portal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payout_bank_name: bankName,
                    payout_account_number: accountNumber,
                    payout_account_name: accountName,
                }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                setAccountSaved(true);
                setTimeout(() => setAccountSaved(false), 3000);
                fetchPortalData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAccountSaving(false);
        }
    };

    // Submit Penarikan
    const handlePayoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPayoutMessage(null);
        setPayoutSubmitting(true);

        try {
            const res = await fetch('/api/affiliates/payouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(payoutAmount),
                    currency: isId ? 'IDR' : 'USD',
                    bank_name: payoutBank,
                    account_number: payoutAccountNum,
                    account_name: payoutAccountName,
                }),
            });

            const json = await res.json();
            if (res.ok && json.success) {
                setPayoutMessage({ type: 'success', text: isId ? 'Pengajuan penarikan berhasil dikirim!' : 'Payout request submitted!' });
                setPayoutAmount('');
                setTimeout(() => {
                    setShowPayoutModal(false);
                    fetchPortalData();
                }, 1500);
            } else {
                setPayoutMessage({ type: 'error', text: json.error || 'Gagal mengajukan penarikan.' });
            }
        } catch (err: any) {
            setPayoutMessage({ type: 'error', text: err?.message || 'Server error' });
        } finally {
            setPayoutSubmitting(false);
        }
    };

    const formatCurrency = (val: number) => {
        if (isId) {
            return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
        }
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium text-xs">
                    {isId ? 'Memuat data portal partner...' : 'Loading partner portal data...'}
                </p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-6 text-center bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30">
                <AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-400 font-bold text-sm">
                    {isId ? 'Gagal memuat portal partner.' : 'Failed to load affiliate portal.'}
                </p>
                <button
                    onClick={fetchPortalData}
                    className="mt-3 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                    {isId ? 'Coba Lagi' : 'Retry'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 1. KOTAK LINK REFERRAL PERMANEN (LOCKED & ZERO EDIT) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-500/20 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 mb-2">
                            <Sparkles className="w-3 h-3" />
                            <span>60% Recurring • 8 Bulan • 90-Day Cookie</span>
                        </div>
                        <h2 className="text-lg font-black text-white">
                            {isId ? 'Link Referral Permanen Anda' : 'Your Permanent Referral Link'}
                        </h2>
                        <p className="text-xs text-indigo-200/80">
                            {isId ? 'Bagikan link unik ini. Komisi 60% berulang otomatis masuk tiap kali referral Anda berlangganan.' : 'Share this unique link to earn 60% monthly recurring commissions.'}
                        </p>
                    </div>

                    {/* KODE REFERRAL PERMANEN LOCKED */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                            <Lock className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs text-slate-300 font-medium">{isId ? 'Kode Permanen:' : 'Permanent Code:'}</span>
                            <span className="text-xs font-mono font-black text-emerald-400 select-all tracking-wider">{stats.profile.ref_code}</span>
                        </div>
                    </div>
                </div>

                {/* PILIHAN TUJUAN LINK REFERRAL */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                        type="button"
                        onClick={() => setLinkDestination('register')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            linkDestination === 'register'
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                    >
                        <span>🎯 {isId ? 'Link Pendaftaran Langsung (Rekomendasi)' : 'Direct Registration (High Conversion)'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setLinkDestination('landing')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            linkDestination === 'landing'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                    >
                        <span>🌐 {isId ? 'Link Beranda / Landing Page' : 'Homepage / Landing Page'}</span>
                    </button>
                </div>

                {/* INPUT LINK & TOMBOL COPY */}
                <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-white/10">
                    <input
                        type="text"
                        readOnly
                        value={activeAffiliateLink}
                        className="bg-transparent text-xs text-indigo-100 font-mono flex-1 outline-none px-2 select-all font-semibold"
                    />
                    <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                            copied
                                ? 'bg-emerald-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? (isId ? 'Tersalin!' : 'Copied!') : (isId ? 'Salin Link' : 'Copy Link')}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-indigo-200/60 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                        {isId 
                            ? 'Link mengarahkan calon pengguna langsung ke pendaftaran dengan kode referral otomatis terisi & cookie aktif 90 hari.' 
                            : 'Link directs leads straight to signup with referral code auto-filled & 90-day tracking cookie.'}
                    </span>
                </div>
            </div>

            {/* 2. STATISTIK PERFORMA & PEMANTAUAN TRAFIK / KLIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Saldo Siap Ditarik */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Saldo Siap Ditarik' : 'Available Balance'}
                        </span>
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                            Cleared
                        </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(stats.metrics.availableBalance)}
                    </div>
                    <button
                        onClick={() => setShowPayoutModal(true)}
                        disabled={stats.metrics.availableBalance < (isId ? 50000 : 5)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition shadow-sm"
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{isId ? 'Tarik Saldo Komisi' : 'Withdraw Balance'}</span>
                    </button>
                </div>

                {/* Total Komisi Didapat */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Total Komisi Didapat' : 'Total Earned'}
                        </span>
                        <DollarSign className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                        {formatCurrency(stats.metrics.totalEarned)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {isId ? `Escrow (14 hari): ${formatCurrency(stats.metrics.pendingEscrow)}` : `Escrow (14-day): ${formatCurrency(stats.metrics.pendingEscrow)}`}
                    </p>
                </div>

                {/* Pemantauan Total Klik Link */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Total Klik Link' : 'Total Link Clicks'}
                        </span>
                        <MousePointerClick className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {(stats.metrics.totalClicks || stats.profile.total_clicks || 0).toLocaleString()}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {isId ? `Cookie tracking: 90 hari aktif` : `90-day cookie active`}
                    </p>
                </div>

                {/* Total Pendaftar (Leads & Converted) */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Total Pendaftar (Leads)' : 'Total Leads'}
                        </span>
                        <Users className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {stats.referrals.length} <span className="text-xs font-normal text-slate-400">({stats.metrics.convertedSignups} {isId ? 'langganan' : 'paid'})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {isId ? `Konversi: ${stats.metrics.conversionRate}%` : `Conversion: ${stats.metrics.conversionRate}%`}
                    </p>
                </div>
            </div>

            {/* 3. REKENING PENARIKAN KOMISI */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-indigo-600" />
                            <span>{isId ? 'Rekening Tujuan Pencairan Komisi' : 'Payout Destination Account'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {isId ? 'Informasi rekening atau PayPal tempat komisi Anda ditransfer saat melakukan penarikan.' : 'Account or PayPal destination where your commissions are transferred.'}
                        </p>
                    </div>
                    {accountSaved && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isId ? 'Tersimpan!' : 'Saved!'}
                        </span>
                    )}
                </div>

                <form onSubmit={handleSaveAccount} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Bank / E-Wallet / PayPal</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="BCA / Mandiri / BRI / PayPal"
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Nomor Rekening / Email PayPal</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="1234567890 / email@paypal.com"
                            required
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Nama Pemilik Rekening</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                placeholder="Nama sesuai rekening"
                                required
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={accountSaving}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-sm"
                            >
                                {accountSaving ? '...' : (isId ? 'Simpan' : 'Save')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* 4. TABEL AKTIVITAS LENGKAP: 1. REFERRAL (LEADS), 2. KOMISI, 3. PENARIKAN */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-2 gap-2 bg-slate-50/50 dark:bg-slate-800/30 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('referrals')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                            activeTab === 'referrals'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>{isId ? 'Daftar Referral & Pendaftar' : 'Referrals & Leads'}</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                            {stats.referrals.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('commissions')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                            activeTab === 'commissions'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{isId ? 'Riwayat Komisi (60%)' : 'Commission History'}</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                            {stats.commissions.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('payouts')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                            activeTab === 'payouts'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{isId ? 'Riwayat Penarikan Dana' : 'Payout History'}</span>
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                            {stats.payouts.length}
                        </span>
                    </button>
                </div>

                {/* TAB 1: DAFTAR REFERRAL (PENGGUNA YANG LOGIN/DAFTAR DENGAN LINK MITRA) */}
                {activeTab === 'referrals' && (
                    stats.referrals.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {isId ? 'Belum Ada Pendaftar Melalui Link Anda' : 'No Referrals Registered Yet'}
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                                {isId 
                                    ? 'Setiap pengguna yang mengklik dan mendaftar akun di OneForMind melalui link Anda akan langsung muncul di tabel ini.' 
                                    : 'Anyone who registers through your link will immediately appear in this table.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3.5">#</th>
                                        <th className="p-3.5">{isId ? 'Waktu Pendaftaran' : 'Registration Time'}</th>
                                        <th className="p-3.5">{isId ? 'Akun Referral' : 'Referred Account'}</th>
                                        <th className="p-3.5">{isId ? 'Kode Dipakai' : 'Ref Code'}</th>
                                        <th className="p-3.5">{isId ? 'Status Pelanggan' : 'Subscription Status'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.referrals.map((r, idx) => (
                                        <tr key={r.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="p-3.5 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                                            <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                                {new Date(r.registered_at).toLocaleString(isId ? 'id-ID' : 'en-US', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="p-3.5 font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                                                    {idx + 1}
                                                </div>
                                                <span>
                                                    {r.referred_user?.email 
                                                        ? `${r.referred_user.email.slice(0, 3)}***@${r.referred_user.email.split('@')[1] || 'user'}`
                                                        : `Pengguna Terdaftar #${idx + 1}`}
                                                </span>
                                            </td>
                                            <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {r.ref_code_used}
                                            </td>
                                            <td className="p-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                                    r.status === 'converted'
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                                }`}>
                                                    {r.status === 'converted' ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3" />
                                                            <span>{isId ? 'Berlangganan Aktif (Komisi Masuk)' : 'Paid Subscriber (Converted)'}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3" />
                                                            <span>{isId ? 'Masa Percobaan 14 Hari (Trial)' : 'Free 14-Day Trial'}</span>
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* TAB 2: RIWAYAT KOMISI */}
                {activeTab === 'commissions' && (
                    stats.commissions.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <DollarSign className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {isId ? 'Belum Ada Transaksi Komisi' : 'No Commissions Recorded Yet'}
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                                {isId ? 'Komisi 60% berulang bulanan akan otomatis tercatat setiap kali referral Anda membayar langganan.' : 'Recurring 60% commissions will appear here each time your referral renews.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3.5">{isId ? 'Tanggal' : 'Date'}</th>
                                        <th className="p-3.5">{isId ? 'Paket' : 'Plan'}</th>
                                        <th className="p-3.5">{isId ? 'Gateway' : 'Gateway'}</th>
                                        <th className="p-3.5">{isId ? 'Komisi 60%' : '60% Commission'}</th>
                                        <th className="p-3.5">{isId ? 'Siklus' : 'Cycle'}</th>
                                        <th className="p-3.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.commissions.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                                {new Date(c.created_at).toLocaleDateString(isId ? 'id-ID' : 'en-US')}
                                            </td>
                                            <td className="p-3.5 font-bold capitalize">{c.plan_name}</td>
                                            <td className="p-3.5 uppercase font-mono text-[10px] text-slate-500">{c.gateway}</td>
                                            <td className="p-3.5 font-mono font-black text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(c.commission_amount)}
                                            </td>
                                            <td className="p-3.5 font-mono text-[11px] font-bold">{c.billing_cycle}/8</td>
                                            <td className="p-3.5">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    c.status === 'approved' 
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                                }`}>
                                                    {c.status === 'approved' ? (isId ? 'Siap Cair' : 'Approved') : (isId ? 'Escrow 14 Hari' : 'Net-14 Escrow')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}

                {/* TAB 3: RIWAYAT PENARIKAN */}
                {activeTab === 'payouts' && (
                    stats.payouts.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <CreditCard className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                {isId ? 'Belum Ada Riwayat Penarikan Dana' : 'No Payout Requests Yet'}
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                                {isId ? 'Pengajuan penarikan saldo komisi Anda akan dicatat dan dilacak statusnya di sini.' : 'Your payout requests and transfer statuses will be logged here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3.5">{isId ? 'Tanggal Pengajuan' : 'Request Date'}</th>
                                        <th className="p-3.5">{isId ? 'Nominal' : 'Amount'}</th>
                                        <th className="p-3.5">{isId ? 'Rekening Tujuan' : 'Destination'}</th>
                                        <th className="p-3.5">Status</th>
                                        <th className="p-3.5">{isId ? 'Catatan Admin / Bukti' : 'Admin Note / Proof'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.payouts.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                                {new Date(p.requested_at).toLocaleDateString(isId ? 'id-ID' : 'en-US')}
                                            </td>
                                            <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">
                                                {formatCurrency(p.amount)}
                                            </td>
                                            <td className="p-3.5">{p.bank_name} • <span className="font-mono">{p.account_number}</span></td>
                                            <td className="p-3.5">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    p.status === 'completed' 
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                                        : p.status === 'rejected'
                                                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                                }`}>
                                                    {p.status === 'completed' ? (isId ? 'Selesai Ditransfer' : 'Completed') : p.status === 'rejected' ? (isId ? 'Ditolak' : 'Rejected') : (isId ? 'Diproses' : 'Pending')}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-[11px] text-slate-500">
                                                {p.admin_notes || p.transfer_proof_url ? (
                                                    <div>
                                                        {p.admin_notes && <span>{p.admin_notes}</span>}
                                                        {p.transfer_proof_url && (
                                                            <a href={p.transfer_proof_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-indigo-600 underline">
                                                                {isId ? 'Lihat Bukti' : 'View Proof'}
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* MODAL AJUKAN PENARIKAN SALDO */}
            {showPayoutModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isId ? 'Ajukan Penarikan Komisi' : 'Request Payout'}
                            </h3>
                            <button
                                onClick={() => setShowPayoutModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {payoutMessage && (
                            <div className={`p-3 rounded-xl text-xs ${payoutMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 text-red-600'}`}>
                                {payoutMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePayoutSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                    {isId ? 'Nominal Penarikan' : 'Withdrawal Amount'}
                                </label>
                                <input
                                    type="number"
                                    min={isId ? 50000 : 5}
                                    max={stats.metrics.availableBalance}
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    placeholder={isId ? 'Min. 50000' : 'Min. 5'}
                                    required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono outline-none focus:border-indigo-500"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                    {isId ? `Saldo tersedia: ${formatCurrency(stats.metrics.availableBalance)}` : `Available: ${formatCurrency(stats.metrics.availableBalance)}`}
                                </span>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                    Bank / E-Wallet / PayPal
                                </label>
                                <input
                                    type="text"
                                    value={payoutBank}
                                    onChange={(e) => setPayoutBank(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                    {isId ? 'Nomor Rekening / Email PayPal' : 'Account Number / PayPal Email'}
                                </label>
                                <input
                                    type="text"
                                    value={payoutAccountNum}
                                    onChange={(e) => setPayoutAccountNum(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                    {isId ? 'Nama Pemilik Rekening' : 'Account Holder Name'}
                                </label>
                                <input
                                    type="text"
                                    value={payoutAccountName}
                                    onChange={(e) => setPayoutAccountName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={payoutSubmitting}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
                            >
                                {payoutSubmitting ? '...' : (isId ? 'Kirim Pengajuan Penarikan' : 'Submit Payout Request')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
