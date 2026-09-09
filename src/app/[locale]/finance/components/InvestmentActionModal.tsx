'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, RefreshCw, PlusCircle, ArrowUpRight, ArrowDownRight, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { InvestmentAssetItem } from './InvestmentPortfolioSection';

export type InvestmentActionMode = 'revalue' | 'topup' | 'withdraw';

interface InvestmentActionModalProps {
    show: boolean;
    asset: InvestmentAssetItem | null;
    mode: InvestmentActionMode;
    onClose: () => void;
    onExecute: (data: {
        assetId: string | number;
        mode: InvestmentActionMode;
        amount: number;
        logCashflow: boolean;
        date: string;
        notes?: string;
    }) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function InvestmentActionModal({
    show,
    asset,
    mode,
    onClose,
    onExecute,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: InvestmentActionModalProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const todayStr = new Date().toISOString().split('T')[0];

    const [amount, setAmount] = useState('');
    const [logCashflow, setLogCashflow] = useState(true);
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(todayStr);

    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const clean = isDotSeparator ? raw.replace(/\./g, '') : raw.replace(/,/g, '');
        if (!isNaN(Number(clean)) || clean === '') {
            setAmount(clean);
        }
    };

    useEffect(() => {
        if (show && asset) {
            setDate(todayStr);
            setNotes('');
            if (mode === 'revalue') {
                setAmount(String(asset.currentValue || asset.capital || ''));
                setLogCashflow(false);
            } else {
                setAmount('');
                setLogCashflow(true);
            }
        }
    }, [show, asset, mode, todayStr]);

    if (!show || !asset) return null;

    const numAmount = Number(amount) || 0;

    // Computed preview values based on action mode
    let previewCapital = asset.capital;
    let previewCurrentValue = asset.currentValue;

    if (mode === 'revalue') {
        previewCurrentValue = numAmount;
    } else if (mode === 'topup') {
        previewCapital = asset.capital + numAmount;
        previewCurrentValue = asset.currentValue + numAmount;
    } else if (mode === 'withdraw') {
        const ratio = asset.currentValue > 0 ? Math.min(1, numAmount / asset.currentValue) : 0;
        previewCapital = Math.max(0, asset.capital * (1 - ratio));
        previewCurrentValue = Math.max(0, asset.currentValue - numAmount);
    }

    const previewPL = previewCurrentValue - previewCapital;
    const previewROI = previewCapital > 0 ? (previewPL / previewCapital) * 100 : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (numAmount <= 0) return;

        if (mode === 'withdraw' && numAmount > asset.currentValue) {
            alert(isIndo ? 'Nominal pencairan melebihi nilai aset terkini!' : 'Withdrawal amount exceeds current asset value!');
            return;
        }

        onExecute({
            assetId: asset.id,
            mode,
            amount: numAmount,
            logCashflow: mode === 'revalue' ? false : logCashflow,
            date,
            notes: notes.trim() || undefined
        });

        onClose();
    };

    const getTitle = () => {
        switch (mode) {
            case 'revalue': return isIndo ? 'Update Nilai Pasar' : 'Revalue Market Price';
            case 'topup': return isIndo ? 'Top-Up / Tambah Modal' : 'Top-Up Capital';
            case 'withdraw': return isIndo ? 'Cairkan / Jual Aset' : 'Liquidate / Withdraw';
        }
    };

    const getSubtitle = () => {
        switch (mode) {
            case 'revalue': return isIndo ? 'Sesuaikan harga portofolio terkini' : 'Sync latest market valuation';
            case 'topup': return isIndo ? 'Tambah modal investasi dan catat arus kas' : 'Inject fresh capital into asset';
            case 'withdraw': return isIndo ? 'Jual sebagian atau seluruh aset ke kas' : 'Cash out asset back to cashflow';
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                    
                    {/* Header */}
                    <div className="p-6 sm:p-7 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                                style={{ backgroundColor: `${asset.color || '#10b981'}15`, color: asset.color || '#10b981' }}
                            >
                                {asset.icon || '📈'}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {getTitle()}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {asset.name} {asset.ticker ? `(${asset.ticker})` : ''}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-95"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
                        
                        {/* Current Asset Overview Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Modal Awal' : 'Cost Basis'}</span>
                                <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{formatMoney(asset.capital)}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{isIndo ? 'Nilai Saat Ini' : 'Current Value'}</span>
                                <span className="font-black font-mono text-slate-900 dark:text-white">{formatMoney(asset.currentValue)}</span>
                            </div>
                        </div>

                        {/* Input Nominal */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                {mode === 'revalue' 
                                    ? (isIndo ? 'Nilai Pasar Baru Keseluruhan' : 'New Total Market Value')
                                    : (isIndo ? 'Nominal Transaksi' : 'Transaction Amount')
                                } ({activeCurrency})
                            </label>
                            <input
                                type="text"
                                required
                                autoFocus
                                value={formatDisplay(amount)}
                                onChange={handleMoneyChange}
                                placeholder="0"
                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-900 dark:text-white font-mono font-black text-xl transition-all"
                            />
                        </div>

                        {/* Quick Presets for Revalue or Topup */}
                        {mode === 'revalue' && asset.currentValue > 0 && (
                            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                                {[
                                    { label: '-10%', mult: 0.9 },
                                    { label: '-5%', mult: 0.95 },
                                    { label: '+5%', mult: 1.05 },
                                    { label: '+10%', mult: 1.1 },
                                    { label: '+20%', mult: 1.2 }
                                ].map((p, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setAmount(String(Math.round(asset.currentValue * p.mult)))}
                                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition shrink-0"
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Live Calculation Preview */}
                        {numAmount > 0 && (
                            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-xs space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                    <span>{isIndo ? 'Estimasi Nilai Baru:' : 'Estimated New Value:'}</span>
                                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{formatMoney(previewCurrentValue)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                    <span>{isIndo ? 'Estimasi P/L & ROI:' : 'Estimated P/L & ROI:'}</span>
                                    <span className={`font-mono font-black ${previewPL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {previewPL >= 0 ? '+' : ''}{formatMoney(previewPL)} ({previewROI >= 0 ? '+' : ''}{previewROI.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Auto Log to Cashflow Checkbox */}
                        {mode !== 'revalue' && (
                            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:bg-slate-100/70 transition">
                                <input
                                    type="checkbox"
                                    checked={logCashflow}
                                    onChange={(e) => setLogCashflow(e.target.checked)}
                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {mode === 'topup'
                                        ? (isIndo ? 'Catat sebagai Pengeluaran (Investasi) di Arus Kas' : 'Log as Expense (Investment) in Cashflow')
                                        : (isIndo ? 'Catat sebagai Pemasukan (Pencairan Investasi) di Arus Kas' : 'Log as Income (Asset Liquidation) in Cashflow')
                                    }
                                </span>
                            </label>
                        )}

                        {/* Note */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? 'Catatan Mutasi (Opsional)' : 'Mutation Note (Optional)'}
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={isIndo ? "cth: Rebalancing bulanan / Dividen" : "e.g. Monthly DCA / Rebalancing"}
                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-2.5 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            >
                                {t('btn_cancel') || 'Batal'}
                            </button>

                            <button
                                type="submit"
                                disabled={numAmount <= 0}
                                className={`px-6 py-3 rounded-2xl text-white font-black text-xs shadow-lg transition active:scale-95 disabled:opacity-50 disabled:grayscale ${
                                    mode === 'withdraw'
                                        ? 'bg-rose-600 shadow-rose-600/20 hover:bg-rose-700'
                                        : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700'
                                }`}
                            >
                                {mode === 'revalue' && (isIndo ? 'Simpan Nilai Baru' : 'Save Market Value')}
                                {mode === 'topup' && (isIndo ? 'Konfirmasi Top-Up' : 'Confirm Top-Up')}
                                {mode === 'withdraw' && (isIndo ? 'Konfirmasi Pencairan' : 'Confirm Liquidation')}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
