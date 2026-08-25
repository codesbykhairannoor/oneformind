'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export interface BudgetItem {
    id: number;
    category: string;
    limit: number;
    icon: string;
    spent: number;
}

interface CategoryItem {
    slug: string;
    name: string;
    icon: string;
    type: 'income' | 'expense';
}

interface BudgetSidebarProps {
    budgets: BudgetItem[];
    categories: CategoryItem[];
    expenseStats: Record<string, number>;
    incomeStats: Record<string, number>;
    onAddBudget: () => void;
    onEditBudget: (b: BudgetItem) => void;
    onDeleteBudget: (id: number) => void;
    onAddCategory: () => void;
    onEditCategory: (c: CategoryItem) => void;
    onDeleteCategory: (c: CategoryItem) => void;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function BudgetSidebar({
    budgets,
    categories,
    expenseStats,
    incomeStats,
    onAddBudget,
    onEditBudget,
    onDeleteBudget,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: BudgetSidebarProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    const getCat = (slug: string) => {
        const found = categories.find(c => c.slug === slug);
        return found || { name: slug, icon: '💸', slug, type: 'expense' as const };
    };

    const getProgress = (cat: string, limit: number) => limit > 0 ? Math.min(((expenseStats[cat] || 0) / limit) * 100, 100) : 0;
    const getBarColor = (p: number) => p > 90 ? 'bg-rose-500' : p > 75 ? 'bg-orange-500' : 'bg-indigo-500';

    // Income list — 1:1 from BudgetSidebar.vue line 20-28
    const incomeList = useMemo(() => {
        return categories
            .filter(c => c.type === 'income')
            .map(cat => ({
                ...cat,
                amount: incomeStats[cat.slug] || 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [categories, incomeStats]);

    // Total budget — 1:1 from BudgetSidebar.vue line 31-38
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limit), 0);
    const totalBudgetExpense = budgets.reduce((sum, b) => sum + Number(expenseStats[b.category] || 0), 0);

    return (
        // 1:1 from BudgetSidebar.vue line 45
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none h-fit flex flex-col gap-6 transition-colors duration-500">
            
            {/* Tab Switcher — 1:1 from BudgetSidebar.vue line 47 */}
            <div className="flex p-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl transition-colors duration-500">
                <button
                    onClick={() => setActiveTab('expense')}
                    className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all ${
                        activeTab === 'expense'
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                    {t('expense') || 'Pengeluaran'}
                </button>
                <button
                    onClick={() => setActiveTab('income')}
                    className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all ${
                        activeTab === 'income'
                            ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-none'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                    {t('income') || 'Pemasukan'}
                </button>
            </div>

            {/* Expense Tab — 1:1 from BudgetSidebar.vue line 52 */}
            {activeTab === 'expense' && (
                <div className="space-y-6">
                    <div className="flex min-w-0 justify-between items-center gap-2">
                        <h3 className="min-w-0 flex-1 truncate font-bold text-slate-800 dark:text-white text-sm transition-colors duration-500">
                            {t('budget_target') || 'Target Budget'}
                        </h3>
                        <button
                            onClick={onAddBudget}
                            className="shrink-0 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition duration-300 flex items-center gap-1.5"
                        >
                            <span>+</span>
                            {t('set_budget') || 'Set Budget'}
                        </button>
                    </div>

                    {budgets.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 transition-colors duration-500">
                            <span className="text-2xl block mb-2">🎯</span>
                            {t('no_budget') || 'Belum ada budget yang di-set'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Total Budget Summary — 1:1 from BudgetSidebar.vue line 76 */}
                            <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/5 flex justify-between items-center shadow-inner dark:shadow-none transition-colors duration-500">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-indigo-400 dark:text-indigo-500 tracking-tight transition-colors duration-500">Total budget</span>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 mt-0.5 transition-colors duration-500">{formatMoney(totalBudget)}</span>
                                </div>
                                <div className="text-right flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 tracking-tight transition-colors duration-500">Terpakai</span>
                                    <span className={`text-sm font-black mt-0.5 ${totalBudgetExpense > totalBudget ? 'text-rose-500 dark:text-rose-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                        {formatMoney(totalBudgetExpense)}
                                    </span>
                                </div>
                            </div>

                            {/* Budget Items — 1:1 from BudgetSidebar.vue line 89 */}
                            <div className="space-y-3">
                                {budgets.map(b => {
                                    const cat = getCat(b.category);
                                    const progress = getProgress(b.category, b.limit);
                                    const barColor = getBarColor(progress);
                                    const spent = expenseStats[b.category] || 0;

                                    return (
                                        <div key={b.id} className="relative pb-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0 transition-colors duration-500">
                                            <div className="flex justify-between items-end text-sm mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-sm transition-all duration-500">
                                                        {cat.icon}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-700 dark:text-slate-200 capitalize text-sm leading-tight transition-colors duration-500">{cat.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-0.5 transition-colors duration-500">
                                                            {formatMoney(spent)} / {formatMoney(b.limit)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex gap-1">
                                                        <button onClick={() => onEditBudget(b)} className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-1.5 py-0.5 rounded transition">
                                                            ✏️{t('edit') || 'Edit'}
                                                        </button>
                                                        <button onClick={() => onDeleteBudget(b.id)} className="text-[10px] font-bold text-rose-400 dark:text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-1.5 py-0.5 rounded transition">
                                                            🗑️{t('delete') || 'Hapus'}
                                                        </button>
                                                    </div>
                                                    <span className={`text-[10px] font-black font-mono transition-colors duration-500 ${progress > 90 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                                        {Math.round(progress)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner relative transition-colors duration-500">
                                                <div
                                                    className={`absolute top-0 left-0 h-full transition-all duration-1000 rounded-full ${barColor}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Income Tab — 1:1 from BudgetSidebar.vue line 128 */}
            {activeTab === 'income' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm transition-colors duration-500">
                            {t('fund_source') || 'Sumber Dana'}
                        </h3>
                        <button
                            onClick={onAddCategory}
                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition duration-300"
                        >
                            + {t('add_category') || 'Tambah Kategori'}
                        </button>
                    </div>

                    {incomeList.length === 0 ? (
                        <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl transition-colors duration-500">
                            <span className="text-2xl block mb-2">💸</span>
                            {t('no_fund_source') || 'Belum ada sumber pemasukan'}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {incomeList.map(item => (
                                <div key={item.slug} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0 relative transition-colors duration-500">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shadow-inner dark:shadow-none border border-emerald-100 dark:border-emerald-500/20 transition-all duration-500">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 dark:text-slate-200 capitalize text-sm transition-colors duration-500">{item.name}</span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium transition-colors duration-500">
                                                {item.amount > 0 ? (t('active') || 'Aktif') : (t('empty') || 'Belum ada')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm tracking-wide transition-colors duration-500">
                                            +{formatMoney(item.amount)}
                                        </span>
                                        <div className="flex gap-1">
                                            <button onClick={() => onEditCategory(item)} className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-1.5 py-0.5 rounded transition duration-300">
                                                ✏️{t('edit') || 'Edit'}
                                            </button>
                                            <button onClick={() => onDeleteCategory(item)} className="text-[10px] font-bold text-rose-400 dark:text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-1.5 py-0.5 rounded transition duration-300">
                                                🗑️{t('delete') || 'Hapus'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
