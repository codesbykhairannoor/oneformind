'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Wallet } from 'lucide-react';

interface FinanceStatsProps {
    totalIncome: number;
    totalExpense: number;
    balance: number;
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
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID',
    onManageWallets,
    walletsCount = 0
}: FinanceStatsProps) {
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    // Arus Kas Bersih (Net Cashflow) = Pemasukan - Pengeluaran
    const netCashflow = totalIncome - totalExpense;

    // Saldo Awal Bulan (Opening Balance) = Saldo Kas Saat Ini + Pengeluaran - Pemasukan
    const openingBalance = Math.max(0, balance - totalIncome + totalExpense);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
            
            {/* Left Big Card: Kas Likuid Dompet Tersedia */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-700 dark:via-indigo-600 dark:to-violet-700 p-6 md:p-8 text-white shadow-2xl dark:shadow-none shadow-indigo-200/50 dark:shadow-indigo-900/20 flex flex-col justify-between min-h-[200px] transition-all duration-500">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <h4 className="text-[10px] font-black text-white/70 tracking-widest uppercase">
                                    {isIndo ? 'Sisa Saldo Kas (Dompet)' : (t('available_balance') || 'Available Liquid Cash')}
                                </h4>
                                {walletsCount > 0 && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                                        {walletsCount} {isIndo ? 'Dompet Aktif' : 'Wallets'}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white drop-shadow-sm font-mono">
                                {formatMoney(balance)}
                            </h3>
                        </div>
                        <div className="bg-white/10 dark:bg-black/20 p-2.5 rounded-2xl border border-white/10 shrink-0">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs">📅</span>
                            <span className="text-xs font-bold text-white/90">
                                {isIndo ? 'Saldo Awal Bulan:' : 'Opening Month Balance:'}{' '}
                                <span className="font-mono font-black text-white">{formatMoney(openingBalance)}</span>
                            </span>
                        </div>
                        {onManageWallets && (
                            <button
                                onClick={onManageWallets}
                                type="button"
                                className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition active:scale-95 flex items-center gap-1.5 backdrop-blur-sm border border-white/20"
                                title={isIndo ? 'Buka daftar dompet & rekening' : 'Manage wallets and accounts'}
                            >
                                <span>💳</span>
                                <span>{isIndo ? 'Kelola Dompet' : 'Manage Wallets'}</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Right Cards: Net Cashflow & In/Out Grid */}
            <div className="lg:col-span-5 grid grid-rows-[auto_1fr] gap-4">
                
                {/* Net Cashflow KPI Card (Replaces the confusing static Base Capital) */}
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
                                ? (isIndo ? 'Pengeluaran lebih besar dari pemasukan bulan ini' : 'Outflows exceed inflows this month')
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
    );
}
