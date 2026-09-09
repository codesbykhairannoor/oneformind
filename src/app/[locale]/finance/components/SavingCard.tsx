'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowDownCircle, ArrowUpCircle, Trash2, Edit3, ShieldAlert, Sparkles, History, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export interface VaultMutationLog {
    id: string;
    amount: number;
    type: 'deposit' | 'withdraw';
    date: string;
    note?: string;
}

export interface SavingsVaultItem {
    id: number | string;
    name: string;
    target: number;
    current: number;
    icon: string;
    color: string;
    isEmergencyFund?: boolean;
    targetMonths?: number; // e.g. 3, 6, 12 months
    logs?: VaultMutationLog[];
}

interface SavingCardProps {
    saving: SavingsVaultItem;
    monthlyBurnRate?: number; // for emergency fund runway calculation
    onDeposit: (saving: SavingsVaultItem) => void;
    onWithdraw: (saving: SavingsVaultItem) => void;
    onEdit?: (saving: SavingsVaultItem) => void;
    onDelete?: (saving: SavingsVaultItem) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function SavingCard({
    saving,
    monthlyBurnRate = 0,
    onDeposit,
    onWithdraw,
    onEdit,
    onDelete,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: SavingCardProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [showLogs, setShowLogs] = useState(false);

    const isEmergency = saving.isEmergencyFund || 
        saving.name.toLowerCase().includes('darurat') || 
        saving.name.toLowerCase().includes('emergency');

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    const progress = saving.target > 0 ? Math.min(100, Math.round((saving.current / saving.target) * 100)) : 0;
    const isCompleted = progress >= 100;

    // Runway calculation for Emergency Fund
    const runwayMonths = monthlyBurnRate > 0 ? (saving.current / monthlyBurnRate).toFixed(1) : null;

    return (
        <div 
            className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col justify-between overflow-hidden border-t-4 ${
                isEmergency ? 'ring-1 ring-amber-500/20' : ''
            }`}
            style={{ borderTopColor: saving.color || '#6366f1' }}
        >
            {/* Top Glow Ambient */}
            <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-15 pointer-events-none transition-opacity duration-1000 group-hover:opacity-30" 
                style={{ backgroundColor: saving.color || '#6366f1' }}
            />
            
            {/* Card Content Top */}
            <div className="p-6 pb-3 space-y-4 relative z-10">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div 
                            className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl shadow-sm transform group-hover:scale-110 transition-all duration-500 shrink-0"
                            style={{ backgroundColor: `${saving.color || '#6366f1'}15` }}
                        >
                            {saving.icon || (isEmergency ? '🛡️' : '🏦')}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="text-base font-black text-slate-800 dark:text-white truncate">
                                    {saving.name}
                                </h3>
                                {isCompleted && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-wider">
                                        <CheckCircle2 size={11} /> {isIndo ? 'Tercapai!' : 'Achieved!'}
                                    </span>
                                )}
                            </div>

                            {/* Emergency Fund Badge / Indicator */}
                            {isEmergency ? (
                                <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                                    <ShieldAlert size={12} />
                                    <span>{isIndo ? 'Dana Darurat' : 'Emergency Fund'}</span>
                                    {runwayMonths && (
                                        <span className="ml-1 text-slate-500 dark:text-slate-400 font-mono">
                                            • {runwayMonths} {isIndo ? 'Bulan Aman' : 'Mo Runway'}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-wide">
                                    {isIndo ? 'Goal Tabungan Terkunci' : 'Dedicated Goal Vault'}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {onEdit && (
                            <button 
                                type="button"
                                onClick={() => onEdit(saving)} 
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all active:scale-90"
                                title="Edit Target"
                            >
                                <Edit3 size={13} />
                            </button>
                        )}
                        {onDelete && (
                            <button 
                                type="button"
                                onClick={() => onDelete(saving)} 
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-all active:scale-90"
                                title="Hapus Vault"
                            >
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Bar & Percent */}
                <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                            {isIndo ? 'Progres Tabungan' : 'Target Progress'}
                        </span>
                        <span className="font-mono font-black text-slate-700 dark:text-slate-200">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out" 
                            style={{ 
                                width: `${progress}%`, 
                                backgroundColor: saving.color || '#6366f1',
                                backgroundImage: progress >= 100 ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)' : undefined,
                                backgroundSize: '1rem 1rem'
                            }}
                        />
                    </div>
                </div>

                {/* Current Collected vs Target */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                    <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                            {isIndo ? 'Terkumpul Saat Ini' : 'Current Saved'}
                        </span>
                        <p className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
                            {formatMoney(saving.current)}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                            {isIndo ? 'Target Dana' : 'Target Goal'}
                        </span>
                        <p className="text-base font-black text-slate-400 font-mono mt-0.5">
                            {formatMoney(saving.target)}
                        </p>
                    </div>
                </div>

                {/* Optional History Logs Accordion */}
                {saving.logs && saving.logs.length > 0 && (
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={() => setShowLogs(!showLogs)}
                            className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition py-1"
                        >
                            <span className="flex items-center gap-1.5">
                                <History size={12} />
                                {isIndo ? 'Riwayat Mutasi Setoran' : 'Mutation History'} ({saving.logs.length})
                            </span>
                            {showLogs ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>

                        {showLogs && (
                            <div className="mt-2 space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/40 dark:border-slate-700/40 text-[10px]">
                                {saving.logs.slice().reverse().map(log => (
                                    <div key={log.id} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700/40 last:border-none">
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-700 dark:text-slate-300 truncate">
                                                {log.type === 'deposit' ? '➕ Setoran' : '➖ Penarikan'} {log.note ? `• ${log.note}` : ''}
                                            </p>
                                            <span className="text-[8px] text-slate-400">{log.date}</span>
                                        </div>
                                        <span className={`font-mono font-black shrink-0 ${log.type === 'deposit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {log.type === 'deposit' ? '+' : '-'}{formatMoney(log.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Card Footer: Setor & Tarik Buttons */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2 relative z-10">
                <button 
                    type="button"
                    onClick={() => onDeposit(saving)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black tracking-wide shadow-md shadow-indigo-600/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                    <ArrowDownCircle size={15} />
                    <span>{isIndo ? 'Setor Dana' : 'Deposit'}</span>
                </button>

                <button 
                    type="button"
                    onClick={() => onWithdraw(saving)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-all active:scale-95 text-xs font-black border border-slate-200/60 dark:border-slate-700/60"
                >
                    <ArrowUpCircle size={15} />
                    <span>{isIndo ? 'Tarik' : 'Withdraw'}</span>
                </button>
            </div>
        </div>
    );
}
