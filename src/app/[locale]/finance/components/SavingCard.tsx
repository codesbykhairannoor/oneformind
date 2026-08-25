'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowDownCircle, ArrowUpCircle, Trash2, Edit3 } from 'lucide-react';

export interface SavingsVaultItem {
    id: number | string;
    name: string;
    target: number;
    current: number;
    icon: string;
    color: string;
}

interface SavingCardProps {
    saving: SavingsVaultItem;
    onDeposit: (saving: SavingsVaultItem) => void;
    onWithdraw: (saving: SavingsVaultItem) => void;
    onEdit?: (saving: SavingsVaultItem) => void;
    onDelete?: (saving: SavingsVaultItem) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function SavingCard({
    saving,
    onDeposit,
    onWithdraw,
    onEdit,
    onDelete,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: SavingCardProps) {
    const t = useTranslations();
    const locale = useLocale();

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

    return (
        <div 
            className="group relative bg-[#ffffff05] dark:bg-slate-900/40 rounded-[2.5rem] border border-white/10 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 overflow-hidden flex flex-col h-full border-b-4"
            style={{ borderBottomColor: saving.color || '#6366f1' }}
        >
            {/* Floating Glow */}
            <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-opacity duration-1000 group-hover:opacity-30" 
                style={{ backgroundColor: saving.color || '#6366f1' }}
            ></div>
            
            {/* Header: Icon & Quick Actions */}
            <div className="p-6 pb-2 flex items-start justify-between relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/10 dark:border-white/5 flex items-center justify-center text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                    {saving.icon || '🏦'}
                </div>
                
                <div className="flex gap-2">
                    {onEdit && (
                        <button 
                            type="button"
                            onClick={() => onEdit(saving)} 
                            className="w-9 h-9 rounded-full bg-white/10 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all transform hover:scale-110 active:scale-95 shadow-sm"
                        >
                            <Edit3 size={15} />
                        </button>
                    )}
                    {onDelete && (
                        <button 
                            type="button"
                            onClick={() => onDelete(saving)} 
                            className="w-9 h-9 rounded-full bg-white/10 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all transform hover:scale-110 active:scale-95 shadow-sm"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </div>

            {/* Body: Progress & Stats */}
            <div className="p-6 pt-2 flex flex-col flex-1 relative z-10">
                <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white truncate pr-2">{saving.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-black text-slate-400 tracking-widest">{progress}% {t('vault_progress_suffix') || 'Tercapai'}</p>
                        <div className="h-1 flex-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${progress}%`, backgroundColor: saving.color || '#6366f1' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <span className="text-[8px] font-black text-slate-400 tracking-tighter opacity-70">{t('vault_card_current') || 'Terkumpul'}</span>
                        <p className="text-sm font-black text-slate-800 dark:text-white tabular-nums">{formatMoney(saving.current)}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[8px] font-black text-slate-400 tracking-tighter opacity-70">{t('target') || 'Target'}</span>
                        <p className="text-sm font-black text-slate-400 tabular-nums">{formatMoney(saving.target)}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                    <button 
                        type="button"
                        onClick={() => onDeposit(saving)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black tracking-widest hover:bg-indigo-700 hover:scale-[1.02] shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                        <ArrowDownCircle size={14} />
                        {t('vault_btn_deposit_short') || 'Setor'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => onWithdraw(saving)}
                        className="w-[50px] flex items-center justify-center py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowUpCircle size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
