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
    Edit3,
    CheckCircle2
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

    // Custom code state (Sekali bikin)
    const [isEditingCode, setIsEditingCode] = useState(false);
    const [customCodeInput, setCustomCodeInput] = useState('');
    const [codeSaving, setCodeSaving] = useState(false);
    const [codeMessage, setCodeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Saved payout account settings state
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountSaving, setAccountSaving] = useState(false);
    const [accountSaved, setAccountSaved] = useState(false);

    // Simple history toggle
    const [historyTab, setHistoryTab] = useState<'commissions' | 'payouts'>('commissions');

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
                    setCustomCodeInput(json.data.profile.ref_code || '');

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
        setTimeout(() => setCopied(false), 2500);
    };

    // Simpan Custom Referral Code (Sekali bikin)
    const handleSaveCustomCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setCodeSaving(true);
        setCodeMessage(null);

        const clean = customCodeInput.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
        if (clean.length < 3 || clean.length > 25) {
            setCodeMessage({ type: 'error', text: isId ? 'Kode harus 3-25 karakter alphanumeric.' : 'Code must be 3-25 alphanumeric characters.' });
            setCodeSaving(false);
            return;
        }

        try {
            const res = await fetch('/api/affiliates/portal', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ custom_ref_code: clean }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                setCodeMessage({ type: 'success', text: isId ? 'Kode referral berhasil disimpan!' : 'Referral code saved!' });
                setIsEditingCode(false);
                fetchPortalData();
            } else {
                setCodeMessage({ type: 'error', text: json.error || 'Gagal mengubah kode.' });
            }
        } catch (err: any) {
            setCodeMessage({ type: 'error', text: err.message || 'Server error' });
        } finally {
            setCodeSaving(false);
        }
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
                    {isId ? 'Memuat data afiliasi...' : 'Loading affiliate data...'}
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
            {/* 1. KOTAK LINK REFERRAL & KODE SEKALI BIKIN */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-500/20 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 mb-2">
                            <Sparkles className="w-3 h-3" />
                            <span>60% Recurring • 8 Bulan</span>
                        </div>
                        <h2 className="text-lg font-black text-white">
                            {isId ? 'Link Referral Anda' : 'Your Referral Link'}
                        </h2>
                        <p className="text-xs text-indigo-200/80">
                            {isId ? 'Bagikan link ini. Komisi 60% otomatis masuk tiap kali referral Anda berlangganan.' : 'Share this link to earn 60% monthly recurring commissions.'}
                        </p>
                    </div>

                    {/* KODE REFERRAL AKTIF & TOMBOL EDIT SEKALI */}
                    <div className="flex items-center gap-2">
                        {!isEditingCode ? (
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                                <span className="text-xs text-slate-300">{isId ? 'Kode:' : 'Code:'}</span>
                                <span className="text-xs font-mono font-black text-emerald-400">{stats.profile.ref_code}</span>
                                <button
                                    onClick={() => {
                                        setIsEditingCode(true);
                                        setCustomCodeInput(stats.profile.ref_code);
                                    }}
                                    title={isId ? 'Kustomisasi kode referral' : 'Customize referral code'}
                                    className="p-1 hover:text-indigo-300 text-slate-400 transition cursor-pointer"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveCustomCode} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={customCodeInput}
                                    onChange={(e) => setCustomCodeInput(e.target.value)}
                                    placeholder="KODEUNIK"
                                    maxLength={25}
                                    className="px-3 py-1.5 bg-slate-900 border border-indigo-400 rounded-xl text-xs text-white font-mono uppercase w-32 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={codeSaving}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                                >
                                    {codeSaving ? '...' : (isId ? 'Simpan' : 'Save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingCode(false)}
                                    className="px-2 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                                >
                                    ✕
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {codeMessage && (
                    <div className={`text-xs px-3 py-1.5 rounded-lg ${codeMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {codeMessage.text}
                    </div>
                )}

                {/* INPUT LINK & TOMBOL COPY */}
                <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-white/10">
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
                                ? 'bg-emerald-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? (isId ? 'Tersalin!' : 'Copied!') : (isId ? 'Salin Link' : 'Copy Link')}</span>
                    </button>
                </div>
            </div>

            {/* 2. RINGKASAN SALDO & 3 METRIK INTI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Saldo Siap Ditarik */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Saldo Siap Ditarik' : 'Available Balance'}
                        </span>
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                            Escrow Cleared
                        </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(stats.metrics.availableBalance)}
                    </div>
                    <button
                        onClick={() => setShowPayoutModal(true)}
                        disabled={stats.metrics.availableBalance < (isId ? 50000 : 5)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition"
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>{isId ? 'Tarik Saldo Komisi' : 'Withdraw Balance'}</span>
                    </button>
                </div>

                {/* Total Komisi Didapat */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Total Komisi Didapat' : 'Total Earned'}
                        </span>
                        <DollarSign className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                        {formatCurrency(stats.metrics.totalEarned)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {isId ? `Termasuk dalam escrow: ${formatCurrency(stats.metrics.pendingEscrow)}` : `In escrow: ${formatCurrency(stats.metrics.pendingEscrow)}`}
                    </p>
                </div>

                {/* Total Pendaftar (Leads) */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {isId ? 'Total Referral' : 'Total Referrals'}
                        </span>
                        <Users className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {stats.referrals.length} <span className="text-xs font-normal text-slate-400">({stats.metrics.convertedSignups} {isId ? 'langganan aktif' : 'active'})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                        {isId ? `Total klik link: ${stats.metrics.totalClicks}` : `Total link clicks: ${stats.metrics.totalClicks}`}
                    </p>
                </div>
            </div>

            {/* 3. REKENING PENARIKAN (RINGKAS & TERSIMPAN) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-indigo-600" />
                            <span>{isId ? 'Rekening Tujuan Penarikan' : 'Payout Account Details'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            {isId ? 'Rekening tujuan saat Anda melakukan pencairan komisi.' : 'Account used when withdrawing your affiliate earnings.'}
                        </p>
                    </div>
                    {accountSaved && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
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
                            placeholder="Contoh: BCA / Mandiri / PayPal"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Nomor Rekening / Email PayPal</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="1234567890"
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
                                placeholder="Nama sesuai buku tabungan"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={accountSaving}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                            >
                                {accountSaving ? '...' : (isId ? 'Simpan' : 'Save')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* 4. RIWAYAT RINGKAS (KOMISI & PENARIKAN) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-2 gap-2 bg-slate-50/50 dark:bg-slate-800/30">
                    <button
                        onClick={() => setHistoryTab('commissions')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            historyTab === 'commissions'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        {isId ? 'Riwayat Komisi' : 'Commissions'} ({stats.commissions.length})
                    </button>
                    <button
                        onClick={() => setHistoryTab('payouts')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            historyTab === 'payouts'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        {isId ? 'Riwayat Penarikan' : 'Payout History'} ({stats.payouts.length})
                    </button>
                </div>

                {historyTab === 'commissions' ? (
                    stats.commissions.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            {isId ? 'Belum ada komisi tercatat. Setiap pelanggan yang berlangganan lewat link Anda otomatis muncul di sini.' : 'No commissions recorded yet.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">Tanggal</th>
                                        <th className="p-3">Paket</th>
                                        <th className="p-3">Komisi 60%</th>
                                        <th className="p-3">Siklus</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.commissions.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-mono text-[11px]">{new Date(c.created_at).toLocaleDateString()}</td>
                                            <td className="p-3 font-bold capitalize">{c.plan_name}</td>
                                            <td className="p-3 font-mono font-bold text-emerald-600">{formatCurrency(c.commission_amount)}</td>
                                            <td className="p-3 font-mono text-[11px]">{c.billing_cycle}/8</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    c.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    stats.payouts.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            {isId ? 'Belum ada riwayat penarikan komisi.' : 'No payout requests yet.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3">Tanggal</th>
                                        <th className="p-3">Nominal</th>
                                        <th className="p-3">Tujuan</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {stats.payouts.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-3 font-mono text-[11px]">{new Date(p.requested_at).toLocaleDateString()}</td>
                                            <td className="p-3 font-mono font-bold">{formatCurrency(p.amount)}</td>
                                            <td className="p-3">{p.bank_name} • {p.account_number}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    p.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* MODAL TARIK SALDO */}
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
                                    Bank / PayPal
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
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                            >
                                {payoutSubmitting ? '...' : (isId ? 'Kirim Pengajuan' : 'Submit Request')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
