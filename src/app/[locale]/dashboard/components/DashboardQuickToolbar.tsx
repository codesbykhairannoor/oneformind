'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { Plus, TrendingUp, Zap, Brain, GraduationCap, BookOpen } from 'lucide-react';

interface DashboardQuickToolbarProps {
    t: any;
}

export default function DashboardQuickToolbar({ t }: DashboardQuickToolbarProps) {
    return (
        <div className="mb-8 overflow-x-auto scroll-smooth no-scrollbar pb-1">
            <div className="flex w-max items-center gap-2.5">
                <Link
                    href="/planner"
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
                >
                    <Plus size={15} strokeWidth={2.5} />
                    {t('btn_add_task') || 'Tambah Tugas'}
                </Link>

                <Link
                    href="/habits"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <Zap size={14} className="text-amber-500" />
                    {t('btn_check_habit') || 'Cek Kebiasaan'}
                </Link>

                <Link
                    href="/study"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <GraduationCap size={15} className="text-indigo-500" />
                    {t('dash_quick_study') || 'Ruang Belajar'}
                </Link>

                <Link
                    href="/study?tab=books"
                    className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/70 px-4 py-2.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100 active:scale-95 dark:border-purple-500/30 dark:bg-purple-950/30 dark:text-purple-300"
                >
                    <BookOpen size={14} />
                    {t('dash_quick_book') || 'Baca Buku'}
                </Link>

                <Link
                    href="/finance"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    <TrendingUp size={14} className="text-emerald-500" />
                    {t('btn_log_expense') || 'Catat Transaksi'}
                </Link>

                <Link
                    href="/journal"
                    className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 active:scale-95 dark:border-indigo-500/30 dark:bg-indigo-950/30 dark:text-indigo-200"
                >
                    <Brain size={14} />
                    {t('btn_journal') || 'Refleksi Jurnal'}
                </Link>
            </div>
        </div>
    );
}
