'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface FinanceStatsProps {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeTarget: number;
    onUpdateTarget?: (val: number) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function FinanceStats({ 
    totalIncome, 
    totalExpense, 
    balance, 
    incomeTarget, 
    onUpdateTarget,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: FinanceStatsProps) {
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

    // --- INLINE SALARY EDIT (1:1 from FinanceStats.vue) ---
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [rawSalary, setRawSalary] = useState(incomeTarget);
    const inputSalaryRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isEditingSalary) setRawSalary(incomeTarget);
    }, [incomeTarget, isEditingSalary]);

    const startEditing = () => {
        setRawSalary(incomeTarget);
        setIsEditingSalary(true);
        setTimeout(() => inputSalaryRef.current?.focus(), 50);
    };

    const cancelEdit = () => {
        setIsEditingSalary(false);
        setRawSalary(incomeTarget);
    };

    const saveSalary = () => {
        if (rawSalary !== incomeTarget && onUpdateTarget) {
            onUpdateTarget(rawSalary);
        }
        setIsEditingSalary(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch">
            
            {/* Left Big Card: Available Balance — 1:1 from FinanceStats.vue line 51 */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-700 dark:via-indigo-600 dark:to-violet-700 p-6 md:p-8 text-white shadow-2xl dark:shadow-none shadow-indigo-200/50 dark:shadow-indigo-900/20 flex flex-col justify-center min-h-[200px] transition-all duration-500">
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-[10px] font-black text-white/60 tracking-widest text-shadow-sm">
                                {t('available_balance') || 'Available Balance'}
                            </h4>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                                {formatMoney(balance)}
                            </h3>
                        </div>
                        <div className="bg-white/10 dark:bg-black/20 p-2 rounded-xl border border-white/10">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-300 border-2 border-indigo-600"></div>
                            <div className="w-6 h-6 rounded-full bg-violet-300 border-2 border-indigo-600"></div>
                        </div>
                        <span className="text-[10px] font-medium text-indigo-100">
                            {t('monthly_finance_desc') || 'Your financial performance this month.'}
                        </span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Right Cards — 1:1 from FinanceStats.vue line 77 */}
            <div className="lg:col-span-5 grid grid-rows-[auto_1fr] gap-4">
                
                {/* Base Capital Card with inline edit — 1:1 from FinanceStats.vue line 79 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] px-6 py-5 shadow-sm dark:shadow-none hover:shadow-md transition-all relative overflow-hidden group flex items-center justify-between h-fit transition-colors duration-500">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1.5 flex items-center gap-1 transition-colors duration-500">
                            {t('base_capital') || 'Base Capital'}
                            {!isEditingSalary && (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-500 transition-colors"></span>
                            )}
                        </h4>
                        
                        {!isEditingSalary ? (
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white truncate pr-2 transition-colors duration-500">
                                    {formatMoney(incomeTarget)}
                                </h4>
                                <button 
                                    onClick={startEditing} 
                                    title="Edit Target / Modal Awal" 
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm dark:shadow-none duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 w-full mt-1">
                                <input 
                                    ref={inputSalaryRef}
                                    type="number"
                                    value={rawSalary}
                                    onChange={(e) => setRawSalary(Number(e.target.value))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveSalary();
                                        if (e.key === 'Escape') cancelEdit();
                                    }}
                                    onBlur={saveSalary}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 py-1.5 text-xl font-black text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Income and Expense Grid — 1:1 from FinanceStats.vue line 109 */}
                <div className="grid grid-cols-2 gap-4 h-full min-h-[160px]">
                    {/* Income */}
                    <div className="bg-emerald-50/40 dark:bg-emerald-500/5 border border-emerald-100/60 dark:border-emerald-500/20 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden group hover:bg-emerald-50 dark:hover:bg-emerald-500/10 shadow-sm dark:shadow-none transition-colors duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[9px] font-black text-emerald-600/60 dark:text-emerald-400/60 tracking-widest transition-colors duration-500">
                                {t('income') || 'Income'}
                            </p>
                            <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition duration-300">↓</div>
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-emerald-700 dark:text-emerald-400 truncate transition-colors duration-500">
                            {formatMoney(totalIncome)}
                        </h4>
                    </div>

                    {/* Expense */}
                    <div className="bg-rose-50/40 dark:bg-rose-500/5 border border-rose-100/60 dark:border-rose-500/20 rounded-[2rem] p-5 flex flex-col justify-center relative overflow-hidden group hover:bg-rose-50 dark:hover:bg-rose-500/10 shadow-sm dark:shadow-none transition-colors duration-500">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[9px] font-black text-rose-600/60 dark:text-rose-400/60 tracking-widest transition-colors duration-500">
                                {t('expense') || 'Expense'}
                            </p>
                            <div className="w-5 h-5 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center text-[10px] text-rose-600 dark:text-rose-400 group-hover:scale-110 transition duration-300">↑</div>
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-rose-700 dark:text-rose-400 truncate transition-colors duration-500">
                            {formatMoney(totalExpense)}
                        </h4>
                    </div>
                </div>

            </div>
        </div>
    );
}
