'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
    ShieldCheck,
    Users,
    DollarSign,
    CreditCard,
    Check,
    X,
    Clock,
    Search,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    ArrowUpRight,
    TrendingUp,
    ExternalLink
} from 'lucide-react';

interface AdminMetrics {
    totalPartners: number;
    totalClicks: number;
    totalSignups: number;
    totalEarned: number;
    totalPaid: number;
    pendingPayoutsCount: number;
    pendingPayoutsAmount: number;
    escrowAmount: number;
}

interface AdminData {
    metrics: AdminMetrics;
    partners: any[];
    pendingPayouts: any[];
    allPayouts: any[];
    recentCommissions: any[];
}

export default function AdminAffiliatePortal() {
    const locale = useLocale();
    const isId = locale === 'id';

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AdminData | null>(null);
    const [activeTab, setActiveTab] = useState<'payouts' | 'partners' | 'commissions'>('payouts');
    const [searchQuery, setSearchQuery] = useState('');

    // Processing payout modal
    const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
    const [actionType, setActionType] = useState<'complete' | 'reject' | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [proofUrl, setProofUrl] = useState('');
    const [actionSubmitting, setActionSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/affiliates/admin/overview');
            if (res.ok) {
                const json = await res.json();
                if (json?.data) {
                    setData(json.data);
                }
            } else if (res.status === 403) {
                console.warn('Access forbidden: Not an admin user');
            }
        } catch (e) {
            console.error('Failed to load admin overview:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdatePayout = async () => {
        if (!selectedPayout || !actionType) return;
        setActionSubmitting(true);
        setActionError(null);

        try {
            const res = await fetch('/api/affiliates/admin/payouts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedPayout.id,
                    status: actionType === 'complete' ? 'completed' : 'rejected',
                    admin_notes: adminNotes,
                    transfer_proof_url: proofUrl,
                }),
            });

            const json = await res.json();
            if (res.ok && json.success) {
                setSelectedPayout(null);
                setActionType(null);
                setAdminNotes('');
                setProofUrl('');
                fetchData();
            } else {
                setActionError(json.error || 'Failed to update payout status');
            }
        } catch (err: any) {
            setActionError(err.message || 'Server error');
        } finally {
            setActionSubmitting(false);
        }
    };

    const formatCurrency = (val: number, curr = 'IDR') => {
        if (curr === 'IDR' || isId) {
            return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
        }
        return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-medium text-xs">
                    {isId ? 'Memuat konsol admin afiliasi...' : 'Loading affiliate administration console...'}
                </p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/30">
                <ShieldCheck className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-amber-800 dark:text-amber-300 font-bold text-sm">
                    {isId ? 'Akses Terbatas: Hanya Administrator' : 'Restricted Access: Administrators Only'}
                </p>
                <p className="text-amber-700/80 dark:text-amber-400 text-xs mt-1">
                    {isId ? 'Akun Anda tidak memiliki hak akses admin untuk modul ini.' : 'Your account does not have admin permissions for this console.'}
                </p>
            </div>
        );
    }

    const filteredPartners = data.partners.filter(p => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.ref_code?.toLowerCase().includes(q) ||
            p.payout_account_name?.toLowerCase().includes(q) ||
            p.user_id?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. EXECUTIVE HEADER BANNER */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-indigo-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            {isId ? 'KONSOL ADMIN PLATFORM' : 'PLATFORM ADMIN CONSOLE'}
                        </span>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer text-indigo-200"
                    >
                        <RefreshCw className="w-3 h-3" />
                        <span>{isId ? 'Segarkan Data' : 'Refresh'}</span>
                    </button>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                    {isId ? 'Manajemen & Pemantauan Afiliator (60% Program)' : 'Affiliates Administration & Payouts'}
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl">
                    {isId 
                        ? 'Pantau total performa mitra afiliasi, validasi dan setujui penarikan saldo, serta tinjau buku besar komisi multi-gateway (Duitku, Lemon Squeezy, PayPal).' 
                        : 'Monitor all affiliate partners, approve withdrawal requests, and audit multi-gateway commission settlements.'}
                </p>
            </div>

            {/* 2. KPI METRICS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pending Payouts (Antrean Transfer) */}
                <div className={`p-5 rounded-2xl border transition-all ${
                    data.metrics.pendingPayoutsCount > 0
                        ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-950/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {isId ? 'Menunggu Transfer' : 'Pending Payouts'}
                        </span>
                        {data.metrics.pendingPayoutsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                                {data.metrics.pendingPayoutsCount} {isId ? 'Antrean' : 'Queue'}
                            </span>
                        )}
                    </div>
                    <div className="text-xl md:text-2xl font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(data.metrics.pendingPayoutsAmount)}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                        {data.metrics.pendingPayoutsCount} {isId ? 'permintaan penarikan mitra' : 'partner withdrawal requests'}
                    </p>
                </div>

                {/* Total Mitra Terdaftar */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isId ? 'Total Mitra Partner' : 'Total Affiliates'}
                    </span>
                    <div className="text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {data.metrics.totalPartners} <span className="text-xs font-normal text-slate-400">({data.metrics.totalSignups} {isId ? 'leads' : 'leads'})</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                        {data.metrics.totalClicks.toLocaleString()} {isId ? 'total klik tercatat' : 'total clicks recorded'}
                    </p>
                </div>

                {/* Total Komisi Dihasilkan */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isId ? 'Total Komisi Didapat Mitra' : 'Total Commission Earned'}
                    </span>
                    <div className="text-xl md:text-2xl font-black text-purple-600 dark:text-purple-400">
                        {formatCurrency(data.metrics.totalEarned)}
                    </div>
                    <p className="text-[10px] text-slate-400">
                        {formatCurrency(data.metrics.escrowAmount)} {isId ? 'dalam escrow 14 hari' : 'in 14-day escrow'}
                    </p>
                </div>

                {/* Total Komisi Telah Ditransfer */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isId ? 'Total Berhasil Ditransfer' : 'Total Disbursed'}
                    </span>
                    <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(data.metrics.totalPaid)}
                    </div>
                    <p className="text-[10px] text-slate-400">
                        {isId ? 'Telah cair ke rekening mitra' : 'Cleared & paid to partners'}
                    </p>
                </div>
            </div>

            {/* 3. NAVIGATION TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                    onClick={() => setActiveTab('payouts')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'payouts'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isId ? 'Antrean Pencairan' : 'Payout Queue'} ({data.pendingPayouts.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('partners')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'partners'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>{isId ? 'Direktori Mitra' : 'Partner Directory'} ({data.partners.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab('commissions')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        activeTab === 'commissions'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{isId ? 'Aliran Transaksi & Escrow' : 'Commission Stream'} ({data.recentCommissions.length})</span>
                </button>
            </div>

            {/* 4. TAB CONTENT: PAYOUT QUEUE */}
            {activeTab === 'payouts' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    {data.pendingPayouts.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 space-y-2">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-60" />
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                {isId ? 'Semua Beres! Tidak Ada Antrean Penarikan' : 'All Clear! No Pending Payouts'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {isId ? 'Semua komisi yang diajukan telah diproses dan ditransfer ke mitra.' : 'All requested payouts have been processed.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3.5">Tanggal Request</th>
                                        <th className="p-3.5">Nominal Penarikan</th>
                                        <th className="p-3.5">Metode / Bank</th>
                                        <th className="p-3.5">No. Rekening / PayPal</th>
                                        <th className="p-3.5">Nama Pemilik</th>
                                        <th className="p-3.5 text-right">Aksi Admin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {data.pendingPayouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                            <td className="p-3.5 font-mono text-[11px] text-slate-500">
                                                {new Date(payout.requested_at).toLocaleString(isId ? 'id-ID' : 'en-US', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="p-3.5 font-mono font-black text-emerald-600 text-sm">
                                                {formatCurrency(payout.amount, payout.currency)}
                                            </td>
                                            <td className="p-3.5 font-bold uppercase text-indigo-600">
                                                {payout.bank_name}
                                            </td>
                                            <td className="p-3.5 font-mono font-bold select-all bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                                {payout.account_number}
                                            </td>
                                            <td className="p-3.5 font-bold text-slate-800 dark:text-white">
                                                {payout.account_name}
                                            </td>
                                            <td className="p-3.5 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayout(payout);
                                                        setActionType('complete');
                                                    }}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    <span>{isId ? 'Setujui & Tandai Cair' : 'Mark as Paid'}</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayout(payout);
                                                        setActionType('reject');
                                                    }}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                                >
                                                    <X className="w-3 h-3" />
                                                    <span>{isId ? 'Tolak' : 'Reject'}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* 5. TAB CONTENT: PARTNER DIRECTORY */}
            {activeTab === 'partners' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4 p-4">
                    {/* Search bar */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isId ? 'Cari berdasarkan kode referral, nama, atau ID mitra...' : 'Search by referral code or partner name...'}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3">Kode Referral</th>
                                    <th className="p-3">Tarif Komisi</th>
                                    <th className="p-3">Klik Link</th>
                                    <th className="p-3">Leads Terdaftar</th>
                                    <th className="p-3">Total Komisi</th>
                                    <th className="p-3">Telah Dibayar</th>
                                    <th className="p-3">Rekening Tersimpan</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredPartners.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                        <td className="p-3 font-mono font-black text-indigo-600 dark:text-indigo-400">
                                            {p.ref_code}
                                        </td>
                                        <td className="p-3 font-bold text-emerald-600">
                                            {Math.round(p.commission_rate * 100)}%
                                        </td>
                                        <td className="p-3 font-mono">{p.total_clicks || 0}</td>
                                        <td className="p-3 font-mono font-bold">{p.total_signups || 0}</td>
                                        <td className="p-3 font-mono font-bold text-purple-600">
                                            {formatCurrency(p.total_earned)}
                                        </td>
                                        <td className="p-3 font-mono font-bold text-slate-600 dark:text-slate-300">
                                            {formatCurrency(p.total_paid)}
                                        </td>
                                        <td className="p-3 text-[11px] text-slate-500">
                                            {p.payout_bank_name ? `${p.payout_bank_name} • ${p.payout_account_number}` : '-'}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                p.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                                {p.is_active ? 'Aktif' : 'Suspended'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 6. TAB CONTENT: COMMISSION STREAM */}
            {activeTab === 'commissions' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3">Waktu Transaksi</th>
                                    <th className="p-3">Gateway</th>
                                    <th className="p-3">Paket</th>
                                    <th className="p-3">Nilai Transaksi</th>
                                    <th className="p-3">Komisi 60%</th>
                                    <th className="p-3">Siklus</th>
                                    <th className="p-3">Status / Escrow</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {data.recentCommissions.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                        <td className="p-3 font-mono text-[11px] text-slate-500">
                                            {new Date(c.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-3 font-bold uppercase text-indigo-500">
                                            {c.gateway}
                                        </td>
                                        <td className="p-3 font-bold capitalize">{c.plan_name}</td>
                                        <td className="p-3 font-mono">{formatCurrency(c.transaction_amount, c.currency)}</td>
                                        <td className="p-3 font-mono font-bold text-emerald-600">
                                            {formatCurrency(c.commission_amount, c.currency)}
                                        </td>
                                        <td className="p-3 font-mono">{c.billing_cycle}/8</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                c.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                {c.status === 'approved' ? 'Approved' : 'Escrow (14 Hari)'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 7. MODAL APPROVE / REJECT PAYOUT */}
            {selectedPayout && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {actionType === 'complete' ? (isId ? 'Konfirmasi Transfer Selesai' : 'Confirm Payout Completed') : (isId ? 'Tolak Pengajuan Penarikan' : 'Reject Payout Request')}
                            </h3>
                            <button
                                onClick={() => setSelectedPayout(null)}
                                className="text-slate-400 hover:text-white text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                            <p><strong>Nominal:</strong> <span className="font-mono text-emerald-600 font-bold">{formatCurrency(selectedPayout.amount, selectedPayout.currency)}</span></p>
                            <p><strong>Bank/PayPal:</strong> {selectedPayout.bank_name}</p>
                            <p><strong>No. Rekening:</strong> <span className="font-mono font-bold">{selectedPayout.account_number}</span></p>
                            <p><strong>Pemilik:</strong> {selectedPayout.account_name}</p>
                        </div>

                        {actionError && (
                            <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xs">
                                {actionError}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                    {isId ? 'Catatan Admin (Opsional)' : 'Admin Notes'}
                                </label>
                                <input
                                    type="text"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder={actionType === 'complete' ? 'Contoh: Transfer via BCA ref #81923' : 'Alasan penolakan...'}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500"
                                />
                            </div>

                            {actionType === 'complete' && (
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                                        {isId ? 'Link / URL Bukti Transfer (Opsional)' : 'Transfer Proof URL'}
                                    </label>
                                    <input
                                        type="text"
                                        value={proofUrl}
                                        onChange={(e) => setProofUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-indigo-500"
                                    />
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPayout(null)}
                                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                                >
                                    {isId ? 'Batal' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    disabled={actionSubmitting}
                                    onClick={handleUpdatePayout}
                                    className={`flex-1 py-2 text-white rounded-xl text-xs font-bold transition cursor-pointer ${
                                        actionType === 'complete' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                                    }`}
                                >
                                    {actionSubmitting ? '...' : (actionType === 'complete' ? (isId ? 'Tandai Selesai' : 'Confirm Paid') : (isId ? 'Konfirmasi Tolak' : 'Confirm Reject'))}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
