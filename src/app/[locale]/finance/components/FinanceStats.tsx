'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Wallet, Sliders, Calendar, Sparkles, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface FinanceStatsProps {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    monthlyBudget?: number;
    onUpdateMonthlyBudget?: (val: number) => void;
    totalCategoryBudget?: number;
    selectedMonthKey?: string;
    incomeTarget?: number;
    onUpdateTarget?: (val: number) => void;
    activeCurrency?: string;
    currencyLocale?: string;
    onManageWallets?: () => void;
    walletsCount?: number;
}

export default function FinanceStats({ 
    totalIncome, 
    totalExpense, 
    balance, 
    monthlyBudget = 0,
    onUpdateMonthlyBudget,
    totalCategoryBudget = 0,
    selectedMonthKey = '',
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID',
    onManageWallets,
    walletsCount = 0
}: FinanceStatsProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? String(monthlyBudget) : '');

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    // Calculate Days remaining in month
    const getDaysRemainingInfo = () => {
        const today = new Date();
        const [y, m] = selectedMonthKey ? selectedMonthKey.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
        const isCurrentMonth = today.getFullYear() === y && (today.getMonth() + 1) === m;
        
        const daysInMonth = new Date(y, m, 0).getDate();
        if (!isCurrentMonth) {
            const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            if (selectedMonthKey && selectedMonthKey < currentMonthKey) {
                return { daysRemaining: 0, isPast: true, totalDays: daysInMonth };
            }
            return { daysRemaining: daysInMonth, isPast: false, totalDays: daysInMonth };
        }
        const currentDay = today.getDate();
        return { daysRemaining: Math.max(1, daysInMonth - currentDay + 1), isPast: false, totalDays: daysInMonth };
    };

    const { daysRemaining, isPast } = getDaysRemainingInfo();

    // Jatah & Sisa Perhitungan
    const hasBudget = monthlyBudget > 0;
    const remainingBudget = monthlyBudget - totalExpense;
    const percentageSpent = hasBudget ? Math.min(100, Math.max(0, (totalExpense / monthlyBudget) * 100)) : 0;
    const dailyQuota = (hasBudget && remainingBudget > 0 && daysRemaining > 0) 
        ? Math.round(remainingBudget / daysRemaining) 
        : 0;

    // Arus Kas Bersih (Net Cashflow) = Pemasukan - Pengeluaran
    const netCashflow = totalIncome - totalExpense;

    const handleSaveBudget = () => {
        const num = parseFloat(budgetInput.replace(/[^0-9.]/g, '')) || 0;
        if (onUpdateMonthlyBudget) {
            onUpdateMonthlyBudget(num);
        }
        setIsBudgetModalOpen(false);
    };

    const handleOpenModal = () => {
        setBudgetInput(monthlyBudget > 0 ? String(monthlyBudget) : '');
        setIsBudgetModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
                
                {/* Left Big Card: JATAH BULANAN & ANGGARAN BELANJA (Safe-to-Spend) */}
                <div className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-700 dark:via-indigo-600 dark:to-violet-700 p-6 md:p-8 text-white shadow-2xl dark:shadow-none shadow-indigo-200/50 dark:shadow-indigo-900/20 flex flex-col justify-between min-h-[220px] transition-all duration-500">
                    <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        
                        {/* Top Bar: Title, Status Badge & Action */}
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <h4 className="text-[10px] font-black text-white/80 tracking-widest uppercase flex items-center gap-1.5">
                                        <span>💰</span>
                                        <span>{isIndo ? 'Jatah Belanja Bulan Ini (Safe to Spend)' : 'Monthly Spending Allowance'}</span>
                                    </h4>
                                    
                                    {hasBudget ? (
                                        <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                            remainingBudget < 0
                                                ? 'bg-rose-500/30 text-rose-100 border-rose-400/40'
                                                : percentageSpent >= 85
                                                ? 'bg-amber-500/30 text-amber-100 border-amber-400/40'
                                                : 'bg-emerald-500/30 text-emerald-100 border-emerald-400/40'
                                        }`}>
                                            {remainingBudget < 0 ? (
                                                <><span>🔴</span> {isIndo ? 'Overbudget' : 'Overbudget'}</>
                                            ) : percentageSpent >= 85 ? (
                                                <><span>🟡</span> {isIndo ? 'Mendekati Batas' : 'Near Limit'} ({percentageSpent.toFixed(0)}%)</>
                                            ) : (
                                                <><span>🟢</span> {isIndo ? 'Terkendali' : 'On Track'} ({percentageSpent.toFixed(0)}%)</>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-white/80 border border-white/20">
                                            {isIndo ? 'Belum Pasang Jatah' : 'No Budget Set'}
                                        </span>
                                    )}
                                </div>

                                {/* Main Value */}
                                {hasBudget ? (
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className={`text-4xl md:text-5xl font-black tracking-tight leading-none drop-shadow-sm font-mono ${
                                                remainingBudget < 0 ? 'text-rose-200' : 'text-white'
                                            }`}>
                                                {formatMoney(remainingBudget)}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-white/80 font-medium mt-1.5 flex items-center gap-1.5">
                                            <span>{isIndo ? 'Sisa uang belanja aman dari plafon' : 'Remaining safe budget of'}</span>
                                            <span className="font-mono font-bold text-white underline decoration-white/40 cursor-pointer" onClick={handleOpenModal}>
                                                {formatMoney(monthlyBudget)}
                                            </span>
                                            <span>•</span>
                                            <span className="text-white/70">{isIndo ? 'Terpakai' : 'Spent'}: {formatMoney(totalExpense)}</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white drop-shadow-sm font-mono">
                                            {formatMoney(totalExpense)}
                                        </h3>
                                        <p className="text-xs text-white/80 font-medium mt-1.5">
                                            {isIndo 
                                                ? 'Total pengeluaran bulan ini. Pasang jatah bulanan agar pengeluaran terkendali!' 
                                                : 'Current monthly spending. Set a monthly allowance to keep spending in check!'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Settings / Edit Button */}
                            <button
                                onClick={handleOpenModal}
                                type="button"
                                className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition active:scale-95 border border-white/20 backdrop-blur-sm shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-sm"
                                title={isIndo ? 'Atur jatah belanja bulanan' : 'Set monthly spending budget'}
                            >
                                <Sliders size={15} />
                                <span className="hidden sm:inline">{hasBudget ? (isIndo ? 'Ubah Jatah' : 'Edit Budget') : (isIndo ? 'Atur Jatah' : 'Set Budget')}</span>
                            </button>
                        </div>

                        {/* Progress Bar (Visible when budget is set) */}
                        {hasBudget && (
                            <div className="w-full space-y-1 my-1">
                                <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/10">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            remainingBudget < 0 
                                                ? 'bg-rose-400' 
                                                : percentageSpent >= 85 
                                                ? 'bg-amber-400' 
                                                : 'bg-emerald-300'
                                        }`}
                                        style={{ width: `${Math.min(100, Math.max(0, (totalExpense / monthlyBudget) * 100))}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bottom Row: Kuota Harian & Dompet Sinkronisasi */}
                        <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                            
                            {/* Kuota Harian (Daily Safe Spend Rate) */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm">⚡</span>
                                <div className="text-white/90 font-medium leading-tight">
                                    {hasBudget ? (
                                        remainingBudget > 0 && !isPast ? (
                                            <span>
                                                {isIndo ? 'Kuota Harian:' : 'Daily Allowance:'}{' '}
                                                <span className="font-mono font-black text-white">{formatMoney(dailyQuota)}</span>
                                                <span className="text-white/70 text-[11px]"> / hari ({daysRemaining} {isIndo ? 'hari tersisa' : 'days left'})</span>
                                            </span>
                                        ) : remainingBudget <= 0 ? (
                                            <span className="text-rose-200 font-bold">
                                                {isIndo ? 'Plafon jatah telah terlampaui!' : 'Monthly allowance exceeded!'}
                                            </span>
                                        ) : (
                                            <span>{isIndo ? 'Bulan telah berakhir' : 'Month completed'}</span>
                                        )
                                    ) : (
                                        <button 
                                            onClick={handleOpenModal}
                                            className="underline hover:text-white font-bold text-amber-200"
                                        >
                                            {isIndo ? '+ Klik untuk pasang jatah bulanan' : '+ Click to set monthly budget'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Wallet Deduction Info */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/70">
                                    {isIndo ? 'Kas Dompet:' : 'Cash Balance:'}{' '}
                                    <span className="font-mono font-bold text-white">{formatMoney(balance)}</span>
                                </span>
                                {onManageWallets && (
                                    <button
                                        onClick={onManageWallets}
                                        type="button"
                                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition flex items-center gap-1 border border-white/20"
                                        title={isIndo ? 'Buka daftar dompet' : 'View wallets'}
                                    >
                                        <Wallet size={11} />
                                        <span>{walletsCount > 0 ? `${walletsCount} ${isIndo ? 'Akun' : 'Wallets'}` : (isIndo ? 'Dompet' : 'Wallet')}</span>
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                {/* Right Cards: Net Cashflow & In/Out Grid */}
                <div className="lg:col-span-5 grid grid-rows-[auto_1fr] gap-4">
                    
                    {/* Net Cashflow KPI Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] px-6 py-5 shadow-sm dark:shadow-none hover:shadow-md transition-all relative overflow-hidden group flex items-center justify-between h-fit transition-colors duration-500">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                    {t('net_cashflow') || (isIndo ? 'Arus Kas Bersih (Net)' : 'Net Cashflow')}
                                </h4>
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                    netCashflow > 0
                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                        : netCashflow < 0
                                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                }`}>
                                    {netCashflow > 0 ? (
                                        <><span>🟢</span> {t('surplus') || 'Surplus'}</>
                                    ) : netCashflow < 0 ? (
                                        <><span>🔴</span> {t('deficit') || 'Defisit'}</>
                                    ) : (
                                        <><span>⚪</span> {isIndo ? 'Seimbang' : 'Balanced'}</>
                                    )}
                                </span>
                            </div>
                            
                            <div className="flex items-baseline justify-between">
                                <h4 className={`text-2xl md:text-3xl font-black font-mono tracking-tight truncate pr-2 ${
                                    netCashflow > 0 
                                        ? 'text-emerald-600 dark:text-emerald-400' 
                                        : netCashflow < 0 
                                        ? 'text-rose-600 dark:text-rose-400' 
                                        : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {netCashflow > 0 ? '+' : ''}{formatMoney(netCashflow)}
                                </h4>
                            </div>

                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                                {netCashflow > 0 
                                    ? (isIndo ? 'Pemasukan melampaui pengeluaran bulan ini' : 'Inflows exceed outflows this month')
                                    : netCashflow < 0
                                    ? (isIndo ? 'Pengeluaran memotong saldo dompet bulan ini' : 'Expenses deducted from wallet balance')
                                    : (isIndo ? 'Pemasukan dan pengeluaran seimbang' : 'Income and expenses are in balance')}
                            </p>
                        </div>
                    </div>

                    {/* Income and Expense Grid */}
                    <div className="grid grid-cols-2 gap-4 h-full min-h-[140px]">
                        {/* Income */}
                        <div className="bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100/60 dark:border-emerald-500/20 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden group hover:bg-emerald-50 dark:hover:bg-emerald-500/10 shadow-sm dark:shadow-none transition-colors duration-500">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[9px] font-black text-emerald-600/60 dark:text-emerald-400/60 tracking-widest transition-colors duration-500 uppercase">
                                    {t('income') || 'Income'}
                                </p>
                                <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-xs text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition duration-300">↓</div>
                            </div>
                            <h4 className="text-lg md:text-xl font-black text-emerald-700 dark:text-emerald-400 truncate font-mono transition-colors duration-500">
                                {formatMoney(totalIncome)}
                            </h4>
                        </div>

                        {/* Expense */}
                        <div className="bg-rose-50/40 dark:bg-rose-500/5 border border-rose-100/60 dark:border-rose-500/20 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden group hover:bg-rose-50 dark:hover:bg-rose-500/10 shadow-sm dark:shadow-none transition-colors duration-500">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[9px] font-black text-rose-600/60 dark:text-rose-400/60 tracking-widest transition-colors duration-500 uppercase">
                                    {t('expense') || 'Expense'}
                                </p>
                                <div className="w-6 h-6 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center text-xs text-rose-600 dark:text-rose-400 group-hover:scale-110 transition duration-300">↑</div>
                            </div>
                            <h4 className="text-lg md:text-xl font-black text-rose-700 dark:text-rose-400 truncate font-mono transition-colors duration-500">
                                {formatMoney(totalExpense)}
                            </h4>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Input Jatah Bulanan (Monthly Spending Allowance) */}
            {isBudgetModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg">
                                    💰
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        {isIndo ? 'Atur Jatah Belanja Bulanan' : 'Set Monthly Allowance'}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {isIndo ? 'Batas maksimal uang belanja yang boleh keluar bulan ini' : 'Max living spending cap for this month'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsBudgetModalOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Input Field */}
                        <div className="space-y-4 my-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                    {isIndo ? 'Plafon Jatah (Rupiah)' : 'Budget Amount'}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-slate-400 text-lg">
                                        Rp
                                    </span>
                                    <input 
                                        type="number"
                                        autoFocus
                                        value={budgetInput}
                                        onChange={(e) => setBudgetInput(e.target.value)}
                                        placeholder="5000000"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xl font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    {isIndo ? 'Pilihan Cepat:' : 'Quick Presets:'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[2000000, 3000000, 5000000, 7500000, 10000000].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setBudgetInput(String(amt))}
                                            className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                                        >
                                            {formatMoney(amt)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Suggestion from Category Budgets */}
                            {totalCategoryBudget > 0 && (
                                <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs">
                                            <span className="font-bold text-slate-700 dark:text-slate-300 block">
                                                {isIndo ? 'Total Anggaran Kategori:' : 'Category Budgets Sum:'}
                                            </span>
                                            <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                                                {formatMoney(totalCategoryBudget)}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setBudgetInput(String(totalCategoryBudget))}
                                            className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition active:scale-95 shadow-xs"
                                        >
                                            {isIndo ? 'Gunakan' : 'Apply'}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Actions */}
                        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                            {hasBudget && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onUpdateMonthlyBudget) onUpdateMonthlyBudget(0);
                                        setIsBudgetModalOpen(false);
                                    }}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition mr-auto"
                                >
                                    {isIndo ? 'Hapus Jatah' : 'Reset Budget'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsBudgetModalOpen(false)}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                {isIndo ? 'Batal' : 'Cancel'}
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveBudget}
                                className="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition active:scale-95"
                            >
                                {isIndo ? 'Simpan Jatah' : 'Save Budget'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
