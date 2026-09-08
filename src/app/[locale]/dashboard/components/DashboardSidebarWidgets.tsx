'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { HelpCircle, Wallet, TrendingUp, Target, ChevronRight } from 'lucide-react';

interface DashboardSidebarWidgetsProps {
    trend: { day: string; score: number }[];
    trendMax: number;
    synergy: any;
    t: any;
}

export default function DashboardSidebarWidgets({
    trend,
    trendMax,
    synergy,
    t
}: DashboardSidebarWidgetsProps) {
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number ?? 0);
    };

    return (
        <aside className="space-y-4 lg:col-span-4">
            {/* Widget 1: Weekly Rhythm Chart */}
            <div className="bento-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {t('dash_weekly_rhythm') || 'Irama 7 Hari'}
                    </h3>
                    <div className="group relative">
                        <HelpCircle size={14} className="text-slate-300 dark:text-slate-600 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-2xl leading-relaxed">
                            {t('dash_rhythm_info') || 'Melacak rata-rata penyelesaian Habit dan Planner Task Anda selama seminggu terakhir.'}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex h-24 items-end justify-between gap-1 mt-1">
                        {trend.map((day, idx) => (
                            <div key={idx} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1 group/bar">
                                <div
                                    className="w-full max-w-[28px] rounded-t-md bg-indigo-500/85 dark:bg-indigo-400/80 transition-all duration-500 group-hover/bar:bg-indigo-600 dark:group-hover/bar:bg-indigo-300"
                                    style={{ height: `${Math.max(12, (day.score / trendMax) * 100)}%` }}
                                    title={`${day.day}: ${day.score}%`}
                                />
                                <span className="truncate text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Widget 2: Finance Overview */}
            <Link
                href="/finance"
                className="bento-card bento-card-hover block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5"
            >
                <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <Wallet className="text-emerald-600 dark:text-emerald-400" size={18} />
                        {t('dash_finance_overview') || 'Ringkasan Keuangan'}
                    </span>
                    <TrendingUp size={14} className="text-slate-400" />
                </div>
                <div className="space-y-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            {t('dash_total_expenses') || 'Total Pengeluaran Bulan Ini'}
                        </p>
                        <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                            {formatRupiah(synergy.finance.expense)}
                        </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 dark:border-white/5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            {t('dash_income') || 'Pemasukan Bulan Ini'}
                        </p>
                        <p className="text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                            {formatRupiah(synergy.finance.income)}
                        </p>
                    </div>
                </div>
            </Link>

            {/* Widget 3: Top Goal Progress */}
            <Link
                href="/goals"
                className="bento-card bento-card-hover block rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5"
            >
                <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <Target className="text-amber-600 dark:text-amber-400" size={18} />
                        {t('dash_goal_progress') || 'Target Utama'}
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                </div>
                {synergy.goals.top_goal ? (
                    <>
                        <p className="line-clamp-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {synergy.goals.top_goal.title}
                        </p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div
                                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                                style={{ width: `${synergy.goals.top_goal.percent}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t('dash_goal_empty_cta') || 'Belum ada target aktif. Buat sekarang!'}
                    </p>
                )}
            </Link>

            {/* Widget 4: Journal Status */}
            <div className="bento-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {t('dash_journal_title') || 'Jurnal Harian'}
                    </span>
                    <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            synergy.journal.is_written
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                        }`}
                    >
                        {synergy.journal.is_written
                            ? t('dash_journal_written_status') || 'Sudah Ditulis'
                            : t('dash_pending') || 'Belum Ditulis'}
                    </span>
                </div>
                <Link
                    href="/journal"
                    className="mt-3 inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    {synergy.journal.is_written
                        ? t('dash_journal_continue') || 'Lihat / Edit Jurnal'
                        : t('dash_journal_start') || 'Tulis Jurnal Hari Ini'}
                </Link>
            </div>
        </aside>
    );
}
