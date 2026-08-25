'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface JournalHeaderProps {
    todayDate?: string;
    synergy?: {
        tasks_completed?: number;
        tasks_total?: number;
        habits_completed?: number;
        expense_total?: number;
    };
}

export default function JournalHeader({ synergy }: JournalHeaderProps) {
    const t = useTranslations();
    
    const tasksCompleted = synergy?.tasks_completed ?? 0;
    const tasksTotal = synergy?.tasks_total ?? 0;
    const habitsCompleted = synergy?.habits_completed ?? 0;
    const expenseTotal = synergy?.expense_total ?? 0;

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        // 1:1 from JournalHeader.vue line 25-58
        <div className="relative z-[60] transition-all bg-white dark:bg-slate-900 border-b shadow-sm border-slate-100 dark:border-slate-800 duration-500">
            <div className="flex w-full min-w-0 flex-col items-stretch justify-between gap-4 px-4 sm:px-6 lg:px-8 py-4 md:flex-row md:items-center">
                
                <div className="flex items-center gap-2 w-full min-w-0 md:w-auto md:max-w-[min(100%,28rem)]">
                    <p className="shrink-0 text-[13px] font-black capitalize tracking-wide text-slate-700 dark:text-slate-300 mr-2 pr-4">
                        {t('journal_title') || 'My Journal'}
                    </p>
                </div>

                <div className="flex min-w-0 flex-wrap items-center w-full gap-3 md:w-auto md:flex-nowrap md:justify-end">
                    
                    <div className="hidden lg:flex items-center gap-5 px-5 border-x border-slate-200 dark:border-slate-800 h-10 transition-colors duration-500">
                        <div className="flex flex-col justify-center">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-none mb-1 transition-colors duration-500">
                                {t('journal_tasks') || 'Tugas'}
                            </span>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-300 leading-none transition-colors duration-500">
                                {tasksCompleted}/{tasksTotal}
                            </span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-none mb-1 transition-colors duration-500">
                                {t('journal_habit') || 'Habit'}
                            </span>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-300 leading-none transition-colors duration-500">
                                {habitsCompleted}
                            </span>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-none mb-1 transition-colors duration-500">
                                {t('journal_expense') || 'Keluar'}
                            </span>
                            <span className="text-sm font-black text-slate-700 dark:text-slate-300 leading-none font-mono transition-colors duration-500">
                                {formatMoney(expenseTotal)}
                            </span>
                        </div>
                    </div>

                    <Link 
                        href="/journal/write" 
                        className="flex min-w-0 items-center justify-center flex-1 h-12 px-6 text-sm font-black text-white transition shadow-lg md:flex-none md:shrink-0 bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none gap-2 active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span className="tracking-tight md:inline">{t('journal_add') || 'Tambah jurnal'}</span>
                    </Link>

                </div>
            </div>
        </div>
    );
}
