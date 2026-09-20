'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    Sparkles,
    Copy,
    Check,
    DollarSign,
    Users,
    TrendingUp,
    Clock,
    ArrowUpRight,
    CreditCard,
    ShieldCheck,
    Settings,
    ListFilter,
    RefreshCw,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { AffiliateDashboardStats } from '@/lib/affiliate/affiliate-service';

export default function AffiliatePortalDashboard() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AffiliateDashboardStats | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions' | 'payouts' | 'settings'>('overview');
    
    const [copied, setCopied] = useState(false);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState<string>('');
    const [payoutBank, setPayoutBank] = useState<string>('');
    const [payoutAccountNum, setPayoutAccountNum] = useState<string>('');
    const [payoutAccountName, setPayoutAccountName] = useState<string>('');
    const [payoutSubmitting, setPayoutSubmitting] = useState(false);
    const [payoutMessage, setPayoutMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [settingsBank, setSettingsBank] = useState('');
    const [settingsAccountNum, setSettingsAccountNum] = useState('');
    const [settingsAccountName, setSettingsAccountName] = useState('');
    const [customRefCode, setCustomRefCode] = useState('');
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchPortalData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/affiliates/portal');
            if (res.ok) {
                const json = await res.json();
                if (json?.data) {
                    setStats(json.data);
                    setSettingsBank(json.data.profile.payout_bank_name || '');
                    setSettingsAccountNum(json.data.profile.payout_account_number || '');
                    setSettingsAccountName(json.data.profile.payout_account_name || '');
                    setCustomRefCode(json.data.profile.ref_code || '');

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

    const affiliateLink = typeof window !== 'undefined' && stats?.profile?.ref_code
        ? `${window.location.origin}?ref=${stats.profile.ref_code}`
        : `https://tranvas.com?ref=${stats?.profile?.ref_code || 'PARTNER'}`;

    const handleCopyLink = () => {
        if (!navigator?.clipboard) return;
        navigator.clipboard.writeText(affiliateLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

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
                setPayoutMessage({ type: 'success', text: t('affiliate_payout_success') || 'Permintaan penarikan berhasil dikirim!' });
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

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsSaving(true);
        setSettingsMessage(null);

        try {
            const res = await fetch('/api/affiliates/portal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payout_bank_name: settingsBank,
                    payout_account_number: settingsAccountNum,
                    payout_account_name: settingsAccountName,
                    custom_ref_code: customRefCode,
                }),
            });

            const json = await res.json();
            if (res.ok && json.success) {
                setSettingsMessage({ type: 'success', text: t('affiliate_settings_saved') || 'Pengaturan berhasil disimpan!' });
                fetchPortalData();
            } else {
                setSettingsMessage({ type: 'error', text: json.error || 'Gagal menyimpan pengaturan.' });
            }
        } catch (err: any) {
            setSettingsMessage({ type: 'error', text: err?.message || 'Server error' });
        } finally {
            setSettingsSaving(false);
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
            <div className="min-h-[500px] flex flex-col items-center justify-center p-12 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium text-sm">
                    {isId ? 'Memuat Partner Portal...' : 'Loading Partner Portal...'}
                </p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/30">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700 dark:text-red-400 font-bold">
                    {isId ? 'Gagal memuat portal partner.' : 'Failed to load affiliate portal.'}
                </p>
                <button
                    onClick={fetchPortalData}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                    {isId ? 'Coba Lagi' : 'Retry'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* TOP HEADER & AFFILIATE LINK BOX */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider border border-indigo-400/30">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>60% Recurring Partner</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                            {t('affiliate_portal_title') || 'Portal Partner & Afiliasi'}
                        </h2>
                        <p className="text-indigo-200/80 text-sm leading-relaxed">
                            {t('affiliate_portal_subtitle') || 'Lacak performa referral, komisi 60% recurring, dan kelola penarikan saldo Anda secara real-time.'}
                        </p>
                    </div>

                    {/* Copy Link Component */}
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 w-full lg:w-auto lg:min-w-[420px] space-y-2">
                        <div className="flex items-center justify-between text-xs text-indigo-200">
                            <span className="font-bold flex items-center gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5" />
                                {t('affiliate_your_link') || 'Link Afiliasi Anda'}
                            </span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full border border-emerald-400/30">
                                90-Day Cookie
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-white/10">
                            <input
                                type="text"
                                readOnly
                                value={affiliateLink}
                                className="bg-transparent text-xs text-indigo-100 font-mono flex-1 outline-none px-2 select-all"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                    copied
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        <span>{t('affiliate_link_copied') || 'Tersalin!'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>{t('affiliate_copy_link') || 'Salin'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* METRICS ROW */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* 1. Clicks */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {t('affiliate_metric_clicks') || 'Total Kunjungan'}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                        {stats.metrics.totalClicks.toLocaleString()}
                    </div>
                </div>

                {/* 2. Signups / Leads */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {t('affiliate_metric_signups') || 'Pendaftar (Leads)'}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                        {stats.metrics.totalSignups.toLocaleString()}
                    </div>
                </div>

                {/* 3. Paying Subscribers */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {t('affiliate_metric_conversions') || 'Pelanggan Aktif'}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-2">
                        <span>{stats.metrics.convertedSignups}</span>
                        <span className="text-xs font-bold text-slate-400">({stats.metrics.conversionRate}%)</span>
                    </div>
                </div>

                {/* 4. Total 60% Earned */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {t('affiliate_metric_total_earned') || 'Total Komisi'}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-purple-600 dark:text-purple-400">
                        {formatCurrency(stats.metrics.totalEarned)}
                    </div>
                </div>
            </div>

            {/* BALANCE & PAYOUT CARD */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                {t('affiliate_metric_available') || 'Saldo Siap Ditarik'}
                            </span>
                            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(stats.metrics.availableBalance)}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                                Net-14 Escrow Cleared
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                {t('affiliate_metric_escrow') || 'Dalam Escrow (14 Hari)'}
                            </span>
                            <div className="text-2xl font-black text-amber-500">
                                {formatCurrency(stats.metrics.pendingEscrow)}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                                Anti-refund security holding
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                {t('affiliate_metric_paid') || 'Total Ditransfer'}
                            </span>
                            <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
                                {formatCurrency(stats.metrics.totalPaid)}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                                Successfully disbursed
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowPayoutModal(true)}
                            disabled={stats.metrics.availableBalance < (isId ? 50000 : 5)}
                            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            <span>{t('affiliate_btn_request_payout') || 'Tarik Komisi'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'overview'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{t('affiliate_tab_overview') || 'Ringkasan'}</span>
                </button>

                <button
                    onClick={() => setActiveTab('referrals')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'referrals'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t('affiliate_tab_referrals') || 'Referrals'} ({stats.referrals.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('commissions')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'commissions'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{t('affiliate_tab_commissions') || 'Komisi'} ({stats.commissions.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('payouts')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'payouts'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{t('affiliate_tab_payouts') || 'Penarikan'} ({stats.payouts.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'settings'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('affiliate_tab_settings') || 'Pengaturan Rekening'}</span>
                </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            <span>{isId ? 'Ketentuan Program 60% Recurring' : '60% Recurring Program Rules'}</span>
                        </h3>
                        <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span><strong>60% Komisi Berulang Bulanan</strong> untuk setiap pembayaran langganan aktif dari referral Anda.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span><strong>Masa Aktif 8 Bulan</strong> per subscriber yang Anda referensikan.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span><strong>90-Day Cookie Window</strong> dengan proteksi 1st-party + local storage backup.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span><strong>Net-14 Escrow</strong> saldo otomatis masuk ke status siap ditarik setelah 14 hari tanpa refund.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>{isId ? 'Tips Maksimalkan Pendapatan' : 'Tips to Maximize Earnings'}</span>
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {isId
                                ? 'Bagikan link unik Anda di channel YouTube, template Notion, grup Discord/Telegram produktivitas, atau profil media sosial. Calon pengguna mendapatkan Free Trial 14 Hari sehingga tingkat konversi pendaftaran sangat tinggi!'
                                : 'Share your link in productivity YouTube videos, Notion templates, Discord communities, or social bios. Users get a 14-Day Free Trial making conversion rates remarkably high!'}
                        </p>
                    </div>
                </div>
            )}

            {/* TAB 2: REFERRALS LOG */}
            {activeTab === 'referrals' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {stats.referrals.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <Users className="w-10 h-10 mx-auto opacity-40" />
                            <p className="text-sm font-medium">{t('affiliate_empty_referrals') || 'Belum ada pendaftar melalui link Anda.'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="p-4">Tanggal Pendaftaran</th>
                                        <th className="p-4">Kode Digunakan</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {stats.referrals.map((ref) => (
                                        <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-mono">
                                                {new Date(ref.registered_at).toLocaleString(isId ? 'id-ID' : 'en-US', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {ref.ref_code_used}
                                            </td>
                                            <td className="p-4">
                                                {ref.status === 'converted' ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                                                        {t('affiliate_status_converted') || 'Langganan Aktif (60%)'}
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                                                        {t('affiliate_status_registered') || 'Terdaftar'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: COMMISSIONS HISTORY */}
            {activeTab === 'commissions' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {stats.commissions.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <DollarSign className="w-10 h-10 mx-auto opacity-40" />
                            <p className="text-sm font-medium">{t('affiliate_empty_commissions') || 'Belum ada komisi tercatat.'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="p-4">Tanggal Transaksi</th>
                                        <th className="p-4">Paket / Gateway</th>
                                        <th className="p-4">Nilai Transaksi</th>
                                        <th className="p-4">Komisi (60%)</th>
                                        <th className="p-4">Siklus</th>
                                        <th className="p-4">Status / Escrow</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {stats.commissions.map((comm) => (
                                        <tr key={comm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-mono">
                                                {new Date(comm.created_at).toLocaleDateString(isId ? 'id-ID' : 'en-US', {
                                                    dateStyle: 'medium',
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold capitalize">{comm.plan_name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase">{comm.gateway}</div>
                                            </td>
                                            <td className="p-4 font-mono">
                                                {formatCurrency(comm.transaction_amount)}
                                            </td>
                                            <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(comm.commission_amount)}
                                            </td>
                                            <td className="p-4 font-mono font-bold">
                                                {t('affiliate_cycle_label') || 'Bulan ke-'}{comm.billing_cycle}/8
                                            </td>
                                            <td className="p-4">
                                                {comm.status === 'approved' ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                                                        {t('affiliate_status_approved') || 'Disetujui'}
                                                    </span>
                                                ) : (
                                                    <div className="space-y-0.5">
                                                        <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                                                            {t('affiliate_status_pending') || 'Escrow 14 Hari'}
                                                        </span>
                                                        <div className="text-[9px] text-slate-400 font-mono">
                                                            Rilis: {new Date(comm.holding_until).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: PAYOUTS HISTORY */}
            {activeTab === 'payouts' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {stats.payouts.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <CreditCard className="w-10 h-10 mx-auto opacity-40" />
                            <p className="text-sm font-medium">{t('affiliate_empty_payouts') || 'Belum ada riwayat penarikan komisi.'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="p-4">Tanggal Pengajuan</th>
                                        <th className="p-4">Nominal</th>
                                        <th className="p-4">Tujuan Rekening</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {stats.payouts.map((pay) => (
                                        <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-mono">
                                                {new Date(pay.requested_at).toLocaleDateString(isId ? 'id-ID' : 'en-US', {
                                                    dateStyle: 'medium',
                                                })}
                                            </td>
                                            <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(pay.amount)}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold">{pay.bank_name} • {pay.account_number}</div>
                                                <div className="text-[10px] text-slate-400">{pay.account_name}</div>
                                            </td>
                                            <td className="p-4">
                                                {pay.status === 'completed' && (
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                                                        {t('affiliate_status_completed') || 'Selesai'}
                                                    </span>
                                                )}
                                                {pay.status === 'pending' && (
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                                                        {t('affiliate_status_pending') || 'Menunggu'}
                                                    </span>
                                                )}
                                                {pay.status === 'processing' && (
                                                    <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-[10px]">
                                                        {t('affiliate_status_processing') || 'Diproses'}
                                                    </span>
                                                )}
                                                {pay.status === 'rejected' && (
                                                    <span className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-bold text-[10px]">
                                                        {t('affiliate_status_rejected') || 'Ditolak'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 5: SETTINGS */}
            {activeTab === 'settings' && (
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-indigo-600" />
                        <span>{t('affiliate_settings_title') || 'Informasi Pembayaran & Rekening'}</span>
                    </h3>

                    {settingsMessage && (
                        <div className={`p-4 rounded-xl text-xs font-bold mb-6 ${
                            settingsMessage.type === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                                : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200'
                        }`}>
                            {settingsMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                {t('affiliate_custom_code_label') || 'Kustomisasi Kode Referral'}
                            </label>
                            <input
                                type="text"
                                value={customRefCode}
                                onChange={(e) => setCustomRefCode(e.target.value.toUpperCase())}
                                placeholder="CONTOH: TRANVASPRO"
                                className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase font-bold outline-none focus:border-indigo-600"
                                required
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                {t('affiliate_custom_code_hint') || 'Hanya huruf, angka, tanda hubung (3-25 karakter)'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                {t('affiliate_payout_bank_label') || 'Bank / Metode Pembayaran'}
                            </label>
                            <input
                                type="text"
                                value={settingsBank}
                                onChange={(e) => setSettingsBank(e.target.value)}
                                placeholder="Contoh: BCA / Mandiri / BRI / QRIS / PayPal"
                                className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-600 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                {t('affiliate_payout_account_num') || 'Nomor Rekening / Email PayPal'}
                            </label>
                            <input
                                type="text"
                                value={settingsAccountNum}
                                onChange={(e) => setSettingsAccountNum(e.target.value)}
                                placeholder="1234567890 / email@paypal.com"
                                className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-600 font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                {t('affiliate_payout_account_name') || 'Nama Pemilik Rekening'}
                            </label>
                            <input
                                type="text"
                                value={settingsAccountName}
                                onChange={(e) => setSettingsAccountName(e.target.value)}
                                placeholder="Nama lengkap sesuai buku tabungan / PayPal"
                                className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-600 font-medium"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                        >
                            {settingsSaving ? 'Menyimpan...' : (t('affiliate_settings_save') || 'Simpan Pengaturan')}
                        </button>
                    </form>
                </div>
            )}

            {/* PAYOUT REQUEST MODAL */}
            {showPayoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-6 shadow-2xl relative">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                <span>{t('affiliate_payout_modal_title') || 'Ajukan Penarikan Komisi'}</span>
                            </h3>
                            <button
                                onClick={() => setShowPayoutModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {payoutMessage && (
                            <div className={`p-4 rounded-xl text-xs font-bold ${
                                payoutMessage.type === 'success'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200'
                                    : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200'
                            }`}>
                                {payoutMessage.text}
                            </div>
                        )}

                        <form onSubmit={handlePayoutSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                    {t('affiliate_payout_amount_label') || 'Nominal Penarikan'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={isId ? 50000 : 5}
                                        max={stats.metrics.availableBalance}
                                        step={isId ? 1000 : 0.01}
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        placeholder={isId ? '50000' : '5.00'}
                                        className="w-full pl-4 pr-16 py-3 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-600"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPayoutAmount(String(stats.metrics.availableBalance))}
                                        className="absolute right-2 top-2 px-2.5 py-1.5 text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                                    <span>Tersedia: {formatCurrency(stats.metrics.availableBalance)}</span>
                                    <span>{t('affiliate_payout_min_note') || 'Min: Rp 50.000'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                    {t('affiliate_payout_bank_label') || 'Bank / Metode Penerimaan'}
                                </label>
                                <input
                                    type="text"
                                    value={payoutBank}
                                    onChange={(e) => setPayoutBank(e.target.value)}
                                    placeholder="BCA / Mandiri / BRI / QRIS / PayPal"
                                    className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-600 font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                    {t('affiliate_payout_account_num') || 'Nomor Rekening / Email PayPal'}
                                </label>
                                <input
                                    type="text"
                                    value={payoutAccountNum}
                                    onChange={(e) => setPayoutAccountNum(e.target.value)}
                                    placeholder="1234567890"
                                    className="w-full px-4 py-3 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                                    {t('affiliate_payout_account_name') || 'Nama Pemilik Rekening'}
                                </label>
                                <input
                                    type="text"
                                    value={payoutAccountName}
                                    onChange={(e) => setPayoutAccountName(e.target.value)}
                                    placeholder="Nama Sesuai Rekening"
                                    className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-600 font-medium"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPayoutModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={payoutSubmitting}
                                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20"
                                >
                                    {payoutSubmitting ? 'Mengirim...' : (t('affiliate_payout_submit') || 'Kirim Pengajuan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
