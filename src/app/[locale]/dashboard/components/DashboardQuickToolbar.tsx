'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { Plus, TrendingUp, Zap, Brain } from 'lucide-react';

interface DashboardQuickToolbarProps {
    t: any;
}

export default function DashboardQuickToolbar({ t }: DashboardQuickToolbarProps) {
    return (
        <div className="mb-8 overflow-x-auto scroll-smooth no-scrollbar">
            <div className="flex w-max items-center gap-2">
                <Link
                    href="/planner"
                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                    <Plus size={14} strokeWidth={2.5} />
                    {t('btn_add_task') || 'Tambah Tugas'}
                </Link>
                <Link
                    href="/finance"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <TrendingUp size={14} strokeWidth={2.5} />
                    {t('btn_log_expense') || 'Catat Transaksi'}
                </Link>
                <Link
                    href="/habits"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <Zap size={14} strokeWidth={2.5} />
                    {t('btn_check_habit') || 'Cek Kebiasaan'}
                </Link>
                <Link
                    href="/journal"
                    className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:scale-[0.98] dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
                >
                    <Brain size={14} strokeWidth={2.5} />
                    {t('btn_journal') || 'Refleksi Jurnal'}
                </Link>
            </div>
        </div>
    );
}
