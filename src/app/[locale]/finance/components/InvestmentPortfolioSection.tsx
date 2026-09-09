'use client';

import React, { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { 
    TrendingUp, 
    Plus, 
    ArrowUpRight, 
    ArrowDownRight, 
    Edit3, 
    Trash2, 
    RefreshCw, 
    DollarSign,
    Coins,
    Building2,
    PieChart
} from 'lucide-react';

export interface InvestmentAssetItem {
    id: string | number;
    name: string;
    type: 'stocks' | 'mutual_funds' | 'crypto' | 'gold' | 'real_estate' | 'other';
    capital: number;
    currentValue: number;
    ticker?: string;
    icon?: string;
    color?: string;
    notes?: string;
}

interface InvestmentPortfolioSectionProps {
    assets: InvestmentAssetItem[];
    activeCurrency?: string;
    currencyLocale?: string;
    onOpenAddModal: () => void;
    onEditAsset: (asset: InvestmentAssetItem) => void;
    onDeleteAsset: (id: string | number) => void;
    onTopupAsset: (asset: InvestmentAssetItem) => void;
    onWithdrawAsset: (asset: InvestmentAssetItem) => void;
    onUpdateMarketValue: (asset: InvestmentAssetItem) => void;
}

export default function InvestmentPortfolioSection({
    assets = [],
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID',
    onOpenAddModal,
    onEditAsset,
    onDeleteAsset,
    onTopupAsset,
    onWithdrawAsset,
    onUpdateMarketValue
}: InvestmentPortfolioSectionProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    // Calculate Portfolio Summary Metrics
    const { totalCapital, totalCurrentValue, totalReturn, returnPercent } = useMemo(() => {
        let cap = 0;
        let cur = 0;

        assets.forEach(a => {
            cap += Number(a.capital) || 0;
            cur += Number(a.currentValue) || 0;
        });

        const pl = cur - cap;
        const pct = cap > 0 ? (pl / cap) * 100 : 0;

        return {
            totalCapital: cap,
            totalCurrentValue: cur,
            totalReturn: pl,
            returnPercent: pct
        };
    }, [assets]);

    // Filtered Assets
    const filteredAssets = useMemo(() => {
        if (selectedTypeFilter === 'all') return assets;
        return assets.filter(a => a.type === selectedTypeFilter);
    }, [assets, selectedTypeFilter]);

    // Type Breakdown
    const typeBreakdown = useMemo(() => {
        const map: Record<string, { label: string; icon: string; total: number; color: string }> = {
            stocks: { label: isIndo ? 'Saham' : 'Stocks', icon: '📈', total: 0, color: '#3b82f6' },
            mutual_funds: { label: isIndo ? 'Reksadana' : 'Mutual Funds', icon: '🏦', total: 0, color: '#10b981' },
            crypto: { label: 'Crypto', icon: '🪙', total: 0, color: '#f59e0b' },
            gold: { label: isIndo ? 'Emas / Logam' : 'Gold', icon: '🪙', total: 0, color: '#eab308' },
            real_estate: { label: isIndo ? 'Properti / Bisnis' : 'Real Estate', icon: '🏢', total: 0, color: '#8b5cf6' },
            other: { label: isIndo ? 'Lainnya' : 'Other', icon: '📦', total: 0, color: '#64748b' }
        };

        assets.forEach(a => {
            const t = a.type || 'other';
            if (map[t]) {
                map[t].total += Number(a.currentValue) || 0;
            } else {
                map.other.total += Number(a.currentValue) || 0;
            }
        });

        return Object.entries(map).filter(([_, v]) => v.total > 0);
    }, [assets, isIndo]);

    const getTypeBadge = (type: InvestmentAssetItem['type']) => {
        switch (type) {
            case 'stocks': return { text: isIndo ? 'Saham' : 'Stock', icon: '📈', color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' };
            case 'mutual_funds': return { text: isIndo ? 'Reksadana' : 'Mutual Fund', icon: '🏦', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' };
            case 'crypto': return { text: 'Crypto', icon: '🪙', color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' };
            case 'gold': return { text: isIndo ? 'Emas' : 'Gold', icon: '🪙', color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400' };
            case 'real_estate': return { text: isIndo ? 'Bisnis/Properti' : 'Property', icon: '🏢', color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' };
            default: return { text: 'Asset', icon: '📦', color: 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400' };
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-5 sm:p-7 border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 relative overflow-hidden transition-all space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                        <TrendingUp size={13} /> {isIndo ? 'Portofolio Aset & Saham' : 'Investment & Stock Portfolio'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isIndo ? 'Pusat Manajemen Portofolio' : 'Asset Growth & Portfolio'}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenAddModal}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition active:scale-95 shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{isIndo ? 'Tambah Aset' : 'Add Asset'}</span>
                    </button>
                </div>
            </div>

            {/* Top 3 Executive Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        {isIndo ? 'Total Nilai Portofolio Terkini' : 'Current Portfolio Value'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                        {formatMoney(totalCurrentValue)}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        {isIndo ? 'Modal awal: ' : 'Cost basis: '}
                        <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{formatMoney(totalCapital)}</span>
                    </p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        {isIndo ? 'Total Keuntungan / Kerugian (P/L)' : 'Total Profit / Loss'}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${totalReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {totalReturn >= 0 ? '+' : ''}{formatMoney(totalReturn)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        {totalReturn >= 0 ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />}
                        <span className={`text-xs font-black font-mono ${totalReturn >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {totalReturn >= 0 ? '+' : ''}{returnPercent.toFixed(2)}% ROI
                        </span>
                    </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                            {isIndo ? 'Diversifikasi Aset' : 'Asset Diversification'}
                        </p>
                        <p className="text-lg font-black text-slate-800 dark:text-white">
                            {assets.length} {isIndo ? 'Instrumen Aktif' : 'Instruments'}
                        </p>
                    </div>
                    
                    {/* Multi-color allocation progress bar */}
                    {totalCurrentValue > 0 && (
                        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-0.5 mt-2">
                            {typeBreakdown.map(([k, v]) => {
                                const widthPct = (v.total / totalCurrentValue) * 100;
                                return (
                                    <div
                                        key={k}
                                        style={{ width: `${widthPct}%`, backgroundColor: v.color }}
                                        title={`${v.label}: ${widthPct.toFixed(1)}%`}
                                        className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Allocation Badges */}
            {typeBreakdown.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    <span className="text-xs font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
                        <PieChart size={13} /> {isIndo ? 'Alokasi:' : 'Allocation:'}
                    </span>
                    {typeBreakdown.map(([k, v]) => {
                        const pct = totalCurrentValue > 0 ? Math.round((v.total / totalCurrentValue) * 100) : 0;
                        return (
                            <div
                                key={k}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0"
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }}></span>
                                <span className="text-slate-700 dark:text-slate-300">{v.label}</span>
                                <span className="text-slate-400 font-mono text-[10px]">({pct}%)</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Asset Instrument Cards */}
            {assets.length === 0 ? (
                <div className="text-center py-10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                        📈
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {isIndo ? 'Belum ada aset investasi terdaftar' : 'No investment assets added yet'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                        {isIndo ? 'Pantau saham (BBCA, BBRI), reksadana Bibit, crypto, atau tabungan emas dengan estimasi gain dan modal riil!' : 'Track stocks, mutual funds, crypto, or gold holdings with real cost basis and ROI!'}
                    </p>
                    <button
                        onClick={onOpenAddModal}
                        className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-black text-xs hover:bg-emerald-200 transition"
                    >
                        + {isIndo ? 'Tambah Portofolio Pertama' : 'Add First Asset'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssets.map(asset => {
                        const pl = Number(asset.currentValue) - Number(asset.capital);
                        const roi = asset.capital > 0 ? (pl / asset.capital) * 100 : 0;
                        const typeInfo = getTypeBadge(asset.type);

                        return (
                            <div
                                key={asset.id}
                                className="group p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div 
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: `${asset.color || '#10b981'}15`, color: asset.color || '#10b981' }}
                                        >
                                            {asset.icon || typeInfo.icon}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                                    {asset.name}
                                                </h4>
                                                {asset.ticker && (
                                                    <span className="text-[9px] font-black font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {asset.ticker}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                                                <span className={`px-2 py-0.5 rounded-md ${typeInfo.color}`}>
                                                    {typeInfo.text}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() => onEditAsset(asset)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
                                            title="Edit Aset"
                                        >
                                            <Edit3 size={13} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteAsset(asset.id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition"
                                            title="Hapus"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Capital vs Current Value */}
                                <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {isIndo ? 'Nilai Terkini' : 'Current Value'}
                                        </span>
                                        <span className="font-black text-base text-slate-900 dark:text-white font-mono">
                                            {formatMoney(asset.currentValue)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-baseline text-xs">
                                        <span className="text-[10px] text-slate-400">
                                            {isIndo ? 'Modal: ' : 'Cost: '}
                                            <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{formatMoney(asset.capital)}</span>
                                        </span>
                                        <span className={`font-bold font-mono text-[11px] ${pl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {pl >= 0 ? '+' : ''}{formatMoney(pl)} ({roi >= 0 ? '+' : ''}{roi.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom Quick Action Buttons */}
                                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                                    <button
                                        onClick={() => onUpdateMarketValue(asset)}
                                        className="py-1.5 px-2 rounded-xl bg-slate-200/70 dark:bg-slate-700/60 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center gap-1 transition active:scale-95"
                                        title="Sesuaikan nilai pasar terkini"
                                    >
                                        <RefreshCw size={11} />
                                        <span>Update</span>
                                    </button>

                                    <button
                                        onClick={() => onTopupAsset(asset)}
                                        className="py-1.5 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center gap-1 transition active:scale-95 border border-emerald-200 dark:border-emerald-800/40"
                                        title="Beli lagi / tambah modal"
                                    >
                                        <Plus size={11} />
                                        <span>Top-Up</span>
                                    </button>

                                    <button
                                        onClick={() => onWithdrawAsset(asset)}
                                        className="py-1.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-[10px] flex items-center justify-center gap-1 transition active:scale-95 border border-rose-200 dark:border-rose-800/40"
                                        title="Cairkan / Jual sebagian/seluruh aset"
                                    >
                                        <span>Cairkan</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
