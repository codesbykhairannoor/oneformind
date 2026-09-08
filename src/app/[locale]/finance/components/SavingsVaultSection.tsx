'use client';

import React from 'react';
import { Wallet, Plus } from 'lucide-react';
import SavingCard, { SavingsVaultItem } from './SavingCard';
import { SavingVault } from './SavingModal';

interface SavingsVaultSectionProps {
    savingsVault: SavingsVaultItem[];
    t: any;
    onOpenCreateVault: () => void;
    onDeposit: (vault: SavingVault) => void;
    onWithdraw: (vault: SavingVault) => void;
    activeCurrency: string;
    currencyLocale: string;
}

export default function SavingsVaultSection({
    savingsVault,
    t,
    onOpenCreateVault,
    onDeposit,
    onWithdraw,
    activeCurrency,
    currencyLocale
}: SavingsVaultSectionProps) {
    return (
        <div className="space-y-6 relative group">
            <div className="flex items-center justify-between px-1 lg:px-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm">
                        <Wallet size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <h3 className="text-base lg:text-lg font-black text-slate-800 dark:text-white tracking-tight">
                                {t('vault_header_title') || 'The Vault'}
                            </h3>
                            <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-wider leading-none mt-0.5">
                                {t('vault_header_subtitle') || 'Tabungan & Target'}
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onOpenCreateVault}
                    className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-[1.25rem] text-[10px] font-black tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none relative group/btn overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <Plus size={16} strokeWidth={3} />
                    <span className="relative z-10">{t('vault_btn_add') || 'Buat Vault'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {savingsVault.length === 0 ? (
                    <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-2 border-slate-100 dark:border-slate-800 p-10 text-center transition-colors shadow-sm col-span-1 md:col-span-2">
                        <div className="mb-4 text-3xl transform group-hover:scale-110 transition-transform duration-500 animate-bounce">🏦</div>
                        <h4 className="text-slate-400 font-bold text-[10px] lg:text-sm mb-4">{t('vault_empty_title') || 'Belum ada tabungan'}</h4>
                        <button onClick={onOpenCreateVault} className="text-[9px] lg:text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-6 py-2.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all active:scale-95 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                            {t('vault_empty_btn') || 'Buat Target Tabungan'}
                        </button>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto custom-scrollbar gap-4 pb-6 -mx-2 px-2 pt-2 md:col-span-2">
                        {savingsVault.map(s => (
                            <div key={s.id} className="shrink-0 w-[260px] md:w-[280px]">
                                <SavingCard
                                    saving={s}
                                    onDeposit={(saving) => onDeposit({
                                        id: saving.id,
                                        title: saving.name,
                                        target_amount: saving.target,
                                        current_amount: saving.current,
                                        icon: saving.icon,
                                        color: saving.color
                                    })}
                                    onWithdraw={(saving) => onWithdraw({
                                        id: saving.id,
                                        title: saving.name,
                                        target_amount: saving.target,
                                        current_amount: saving.current,
                                        icon: saving.icon,
                                        color: saving.color
                                    })}
                                    activeCurrency={activeCurrency}
                                    currencyLocale={currencyLocale}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
