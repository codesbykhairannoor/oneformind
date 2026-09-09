'use client';

import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Wallet, Plus, ShieldCheck, Target, Sparkles, TrendingUp } from 'lucide-react';
import SavingCard, { SavingsVaultItem } from './SavingCard';
import { SavingVault } from './SavingModal';

interface SavingsVaultSectionProps {
    savingsVault: SavingsVaultItem[];
    monthlyBurnRate?: number;
    t: any;
    onOpenCreateVault: () => void;
    onEditVault?: (vault: SavingVault) => void;
    onDeleteVault?: (vault: SavingVault) => void;
    onDeposit: (vault: SavingVault) => void;
    onWithdraw: (vault: SavingVault) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function SavingsVaultSection({
    savingsVault = [],
    monthlyBurnRate = 0,
    t,
    onOpenCreateVault,
    onEditVault,
    onDeleteVault,
    onDeposit,
    onWithdraw,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: SavingsVaultSectionProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            maximumFractionDigits: 0
        }).format(val);
    };

    const { totalSaved, totalTarget, emergencyFundSaved } = useMemo(() => {
        let saved = 0;
        let target = 0;
        let emergency = 0;

        savingsVault.forEach(v => {
            saved += Number(v.current) || 0;
            target += Number(v.target) || 0;
            if (v.isEmergencyFund || v.name.toLowerCase().includes('darurat') || v.name.toLowerCase().includes('emergency')) {
                emergency += Number(v.current) || 0;
            }
        });

        return { totalSaved: saved, totalTarget: target, emergencyFundSaved: emergency };
    }, [savingsVault]);

    const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
    const emergencyMonths = monthlyBurnRate > 0 ? (emergencyFundSaved / monthlyBurnRate).toFixed(1) : '0';

    return (
        <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl shadow-sm">
                        🛡️
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider mb-0.5">
                            {isIndo ? 'Dana Darurat & Tabungan Terkunci' : 'Emergency Fund & Goal Vaults'}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            {t('vault_header_title') || 'The Vault & Target Tabungan'}
                        </h3>
                    </div>
                </div>

                <button
                    onClick={onOpenCreateVault}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-2xl text-xs font-black tracking-wide hover:scale-105 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 shrink-0 self-start sm:self-auto"
                >
                    <Plus size={16} strokeWidth={3} />
                    <span>{t('vault_btn_add') || (isIndo ? 'Buat Target Tabungan' : 'Create Vault')}</span>
                </button>
            </div>

            {/* Top Summary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Total Saved */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        {isIndo ? 'Total Saldo Semua Vault' : 'Total Saved in Vaults'}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                        {formatMoney(totalSaved)}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-slate-400 text-[11px] font-medium">
                            {isIndo ? 'Target: ' : 'Target: '}<span className="font-mono font-bold text-slate-600 dark:text-slate-300">{formatMoney(totalTarget)}</span>
                        </span>
                        <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono">
                            {overallProgress}%
                        </span>
                    </div>
                </div>

                {/* Dana Darurat Health Status */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {isIndo ? 'Ketahanan Dana Darurat' : 'Emergency Fund Runway'}
                            </p>
                            <ShieldCheck size={16} className="text-emerald-500" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                            {emergencyMonths} <span className="text-sm font-bold text-slate-400">{isIndo ? 'Bulan' : 'Months'}</span>
                        </p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">
                        {isIndo ? 'Standar ideal perencana keuangan: 3–6 bulan pengeluaran' : 'Recommended ideal runway: 3–6 months'}
                    </p>
                </div>

                {/* Active Goals Count */}
                <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                            {isIndo ? 'Jumlah Pos Tabungan' : 'Active Savings Goals'}
                        </p>
                        <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                            {savingsVault.length} <span className="text-sm font-bold text-slate-400">{isIndo ? 'Vault Aktif' : 'Vaults'}</span>
                        </p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                        <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>

            </div>

            {/* Savings Cards Grid (Replaced old horizontal overflow!) */}
            {savingsVault.length === 0 ? (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-10 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-4">
                        🛡️
                    </div>
                    <h4 className="text-base font-black text-slate-800 dark:text-white mb-1">
                        {t('vault_empty_title') || (isIndo ? 'Belum Ada Target Tabungan / Dana Darurat' : 'No Savings Goals Set Yet')}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                        {isIndo 
                            ? 'Pisahkan tabungan darurat, impian liburan, beli gadget, atau DP rumah dari saldo belanja harian agar tidak terpakai!' 
                            : 'Segregate emergency funds and savings goals from daily cashflow!'}
                    </p>
                    <button 
                        onClick={onOpenCreateVault} 
                        className="text-xs font-black tracking-wide text-white bg-indigo-600 px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                    >
                        + {t('vault_empty_btn') || (isIndo ? 'Buat Pos Tabungan Pertama' : 'Create First Vault')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savingsVault.map(s => (
                        <SavingCard
                            key={s.id}
                            saving={s}
                            monthlyBurnRate={monthlyBurnRate}
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
                            onEdit={onEditVault ? (saving) => onEditVault({
                                id: saving.id,
                                title: saving.name,
                                target_amount: saving.target,
                                current_amount: saving.current,
                                icon: saving.icon,
                                color: saving.color
                            }) : undefined}
                            onDelete={onDeleteVault ? (saving) => onDeleteVault({
                                id: saving.id,
                                title: saving.name,
                                target_amount: saving.target,
                                current_amount: saving.current,
                                icon: saving.icon,
                                color: saving.color
                            }) : undefined}
                            activeCurrency={activeCurrency}
                            currencyLocale={currencyLocale}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}
