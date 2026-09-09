'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, TrendingUp, DollarSign, Coins, Building2, HelpCircle } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { InvestmentAssetItem } from './InvestmentPortfolioSection';

interface InvestmentAssetModalProps {
    show: boolean;
    editingAsset: InvestmentAssetItem | null;
    onClose: () => void;
    onSave: (asset: InvestmentAssetItem) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function InvestmentAssetModal({
    show,
    editingAsset,
    onClose,
    onSave,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: InvestmentAssetModalProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [name, setName] = useState('');
    const [type, setType] = useState<InvestmentAssetItem['type']>('stocks');
    const [ticker, setTicker] = useState('');
    const [capital, setCapital] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [icon, setIcon] = useState('📈');
    const [color, setColor] = useState('#3b82f6');
    const [notes, setNotes] = useState('');

    const isDotSeparator = ['IDR', 'EUR', 'de-DE'].includes(activeCurrency);

    const assetTypes: { id: InvestmentAssetItem['type']; label: string; icon: string; defaultColor: string }[] = [
        { id: 'stocks', label: isIndo ? 'Saham' : 'Stocks', icon: '📈', defaultColor: '#3b82f6' },
        { id: 'mutual_funds', label: isIndo ? 'Reksadana' : 'Mutual Funds', icon: '🏦', defaultColor: '#10b981' },
        { id: 'crypto', label: 'Crypto', icon: '🪙', defaultColor: '#f59e0b' },
        { id: 'gold', label: isIndo ? 'Emas / Logam' : 'Gold', icon: '🪙', defaultColor: '#eab308' },
        { id: 'real_estate', label: isIndo ? 'Properti / Bisnis' : 'Property', icon: '🏢', defaultColor: '#8b5cf6' },
        { id: 'other', label: isIndo ? 'Lainnya' : 'Other', icon: '📦', defaultColor: '#64748b' }
    ];

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#eab308', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

    useEffect(() => {
        if (editingAsset) {
            setName(editingAsset.name || '');
            setType(editingAsset.type || 'stocks');
            setTicker(editingAsset.ticker || '');
            setCapital(String(editingAsset.capital || ''));
            setCurrentValue(String(editingAsset.currentValue || ''));
            setIcon(editingAsset.icon || '📈');
            setColor(editingAsset.color || '#3b82f6');
            setNotes(editingAsset.notes || '');
        } else {
            setName('');
            setType('stocks');
            setTicker('');
            setCapital('');
            setCurrentValue('');
            setIcon('📈');
            setColor('#3b82f6');
            setNotes('');
        }
    }, [editingAsset, show]);

    if (!show) return null;

    const formatDisplay = (val: string) => {
        if (!val) return '';
        const str = val.toString();
        return isDotSeparator ? str.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleMoneyChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const clean = isDotSeparator ? raw.replace(/\./g, '') : raw.replace(/,/g, '');
        if (!isNaN(Number(clean)) || clean === '') {
            setter(clean);
        }
    };

    const handleTypeSelect = (selectedType: InvestmentAssetItem['type']) => {
        setType(selectedType);
        const match = assetTypes.find(t => t.id === selectedType);
        if (match) {
            setIcon(match.icon);
            if (!editingAsset) setColor(match.defaultColor);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numCapital = Number(capital) || 0;
        const numCurrent = currentValue !== '' ? Number(currentValue) : numCapital;

        if (!name.trim()) return;

        onSave({
            id: editingAsset?.id || `inv_${Date.now()}`,
            name: name.trim(),
            type,
            ticker: ticker.trim().toUpperCase() || undefined,
            capital: numCapital,
            currentValue: numCurrent,
            icon,
            color,
            notes: notes.trim() || undefined
        });

        onClose();
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="p-6 sm:p-8 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shadow-sm">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                    {editingAsset ? (isIndo ? 'Edit Instrumen Investasi' : 'Edit Investment Asset') : (isIndo ? 'Tambah Instrumen Aset' : 'Add Investment Asset')}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                                    {isIndo ? 'Kelola modal beli dan nilai pasar terkini' : 'Track cost basis & market valuation'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
                        
                        {/* Asset Type Selector */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? 'Kategori Instrumen' : 'Asset Category'}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {assetTypes.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => handleTypeSelect(t.id)}
                                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all text-xs font-bold ${
                                            type === t.id
                                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className="text-lg">{t.icon}</span>
                                        <span className="truncate">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name & Ticker */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Nama Aset / Sekuritas' : 'Asset / Security Name'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={isIndo ? "cth: Bank Central Asia / Bibit SBN" : "e.g. Apple Inc / Vanguard S&P500"}
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-800 dark:text-white font-bold text-sm transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Kode / Ticker' : 'Ticker (Opt)'}
                                </label>
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                    placeholder="BBCA / BTC"
                                    className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-800 dark:text-white font-mono font-black text-sm uppercase transition-all"
                                />
                            </div>
                        </div>

                        {/* Cost Basis (Capital) vs Current Market Value */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Modal Awal / Beli' : 'Cost Basis (Capital)'} ({activeCurrency})
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formatDisplay(capital)}
                                        onChange={handleMoneyChange(setCapital)}
                                        placeholder="0"
                                        className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-800 dark:text-white font-mono font-bold text-base transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                    {isIndo ? 'Nilai Pasar Terkini' : 'Current Market Value'} ({activeCurrency})
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatDisplay(currentValue)}
                                        onChange={handleMoneyChange(setCurrentValue)}
                                        placeholder={formatDisplay(capital) || '0'}
                                        className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-emerald-600 dark:text-emerald-400 font-mono font-black text-base transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accent Color */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? 'Warna Aksen' : 'Accent Color'}
                            </label>
                            <div className="flex flex-wrap gap-2.5">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        style={{ backgroundColor: c }}
                                        className={`w-8 h-8 rounded-xl transition-all ${
                                            color === c ? 'ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-emerald-500/40 scale-110' : 'opacity-70 hover:opacity-100'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? 'Catatan Tambahan (Opsional)' : 'Notes / Broker Platform'}
                            </label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={isIndo ? "cth: Akun Bibit / Ajaib Sekuritas / Cold Storage" : "e.g. IBKR broker / hardware ledger"}
                                className="w-full bg-slate-50 dark:bg-slate-800/70 border-2 border-transparent focus:border-emerald-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-2xl px-4 py-3 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                            />
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            >
                                {t('btn_cancel') || 'Batal'}
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition"
                            >
                                {editingAsset ? (isIndo ? 'Simpan Perubahan' : 'Update Asset') : (isIndo ? 'Simpan Aset' : 'Save Asset')}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
