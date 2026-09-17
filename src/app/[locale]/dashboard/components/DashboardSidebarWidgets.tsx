'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { HelpCircle, Wallet, TrendingUp, Target, ChevronRight, BookOpen, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { useActiveModules } from '@/hooks/useActiveModules';

import { useLocale } from 'next-intl';

interface DashboardSidebarWidgetsProps {
    trend: { day: string; fullDate: string; score: number }[];
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
    const locale = useLocale();
    const { isTabActive } = useActiveModules();

    const isHabitActive = isTabActive('habit');
    const isFinanceActive = isTabActive('finance');
    const isGoalActive = isTabActive('goal');
    const isJournalActive = isTabActive('journal');

    const effectiveCurrency = synergy.finance?.currency || (locale === 'id' ? 'IDR' : 'USD');
    const effectiveCurrencyLocale = effectiveCurrency === 'IDR' ? 'id-ID' : (effectiveCurrency === 'EUR' ? 'de-DE' : 'en-US');

    const formatMoney = (number: number) => {
        return new Intl.NumberFormat(effectiveCurrencyLocale, {
            style: 'currency',
            currency: effectiveCurrency,
            maximumFractionDigits: 0,
        }).format(number ?? 0);
    };

    const netCashflow = (synergy.finance?.income || 0) - (synergy.finance?.expense || 0);

    const hasAnyWidget = isHabitActive || isFinanceActive || isGoalActive || isJournalActive;

    return (
        <aside className="space-y-4 lg:col-span-4">
            {/* Widget 1: Weekly Rhythm Chart (Only if Habit active) */}
            {isHabitActive && (
            <div className="bento-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        {t('dash_weekly_rhythm') || 'Irama 7 Hari'}
                    </h3>
                    <div className="group relative">
                        <HelpCircle size={14} className="text-slate-300 dark:text-slate-600 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-52 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-2xl leading-relaxed">
                            {t('dash_rhythm_info') || 'Melacak persentase penyelesaian Habit harian Anda selama 7 hari terakhir.'}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-col gap-4">
                    <div className="flex h-28 items-end justify-between gap-2 mt-1 px-1">
                        {trend.map((item, idx) => {
                            const isToday = idx === trend.length - 1;
                            const heightPct = Math.max(12, (item.score / Math.max(trendMax, 1)) * 100);
                            return (
                                <div key={idx} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5 group/bar">
                                    <div className="relative w-full flex justify-center">
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-7 scale-0 group-hover/bar:scale-100 transition-transform bg-slate-900 text-white text-[10px] font-bold py-0.5 px-1.5 rounded pointer-events-none z-10 whitespace-nowrap">
                                            {item.score}%
                                        </div>
                                        <div
                                            className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                                                isToday
                                                    ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-indigo-300 shadow-sm shadow-indigo-500/20'
                                                    : 'bg-indigo-500/50 hover:bg-indigo-500/80 dark:bg-indigo-400/40 dark:hover:bg-indigo-400/80'
                                            }`}
                                            style={{ height: `${heightPct}%` }}
                                        />
                                    </div>
                                    <span className={`truncate text-[10px] font-bold uppercase tracking-tight ${
                                        isToday ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 dark:text-slate-500'
                                    }`}>
                                        {item.day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            )}

            {/* Widget 2: Finance Pulse (Only if Finance active) */}
            {isFinanceActive && synergy.finance && (
            <Link
                href="/finance"
                className="bento-card bento-card-hover block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
                            {t('dash_total_expenses') || 'Pengeluaran Bulan Ini'}
                        </p>
                        <p className="text-xl font-black tabular-nums text-slate-900 dark:text-white flex items-center gap-1.5">
                            <ArrowDownRight size={18} className="text-rose-500" />
                            {formatMoney(synergy.finance.expense)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-white/5 text-xs">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {t('dash_income') || 'Pemasukan'}
                            </p>
                            <p className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                <ArrowUpRight size={13} />
                                {formatMoney(synergy.finance.income)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {t('dash_net_cashflow') || 'Arus Kas'}
                            </p>
                            <p className={`font-bold tabular-nums ${netCashflow >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {formatMoney(netCashflow)}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
            )}

            {/* Widget 3: Top Goal Progress (Only if Goal active) */}
            {isGoalActive && synergy.goals && (
            <Link
                href="/goals"
                className="bento-card bento-card-hover block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <Target className="text-amber-500" size={18} />
                        {t('dash_goal_progress') || 'Target Strategis'}
                    </span>
                    <ChevronRight size={14} className="text-slate-400" />
                </div>
                {synergy.goals.top_goal ? (
                    <div>
                        <p className="line-clamp-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {synergy.goals.top_goal.title}
                        </p>
                        <div className="mt-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                                <span>{synergy.goals.top_goal.completedMilestones || 0}/{synergy.goals.top_goal.totalMilestones || 0} Milestones</span>
                                <span className="text-amber-600 dark:text-amber-400">{synergy.goals.top_goal.percent}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                                    style={{ width: `${synergy.goals.top_goal.percent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {t('dash_goal_empty_cta') || 'Belum ada target aktif. Buat sekarang!'}
                    </p>
                )}
            </Link>
            )}

            {/* Widget 4: Journal Pulse (Only if Journal active) */}
            {isJournalActive && synergy.journal && (
            <div className="bento-card rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <BookOpen className="text-indigo-500" size={18} />
                        {t('dash_journal_title') || 'Jurnal Harian'}
                    </span>
                    <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            synergy.journal.is_written
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                        }`}
                    >
                        {synergy.journal.is_written
                            ? (t('dash_journal_written_status') || 'Tercatat')
                            : (t('dash_pending') || 'Belum')}
                    </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {synergy.journal.is_written
                        ? (t('dash_journal_written') || 'Refleksi hari ini sudah tersimpan. Pertahankan kesadaran diri.')
                        : (t('dash_journal_prompt') || 'Bagaimana perasaan Anda hari ini? Luangkan 3 menit untuk menulis.')}
                </p>
                <Link
                    href="/journal"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    {synergy.journal.is_written
                        ? (t('dash_journal_continue') || 'Lihat / Edit Jurnal')
                        : (t('dash_journal_start') || 'Tulis Refleksi Sekarang')} &rarr;
                </Link>
            </div>
            )}

            {/* Empty State Fallback if all sidebar widgets modules are inactive */}
            {!hasAnyWidget && (
                <div className="bento-card rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5 text-center dark:border-slate-800 dark:bg-slate-900/60">
                    <Layers className="mx-auto text-slate-400 mb-2" size={24} />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {t('dash_active_modules_clean') || 'Tampilan sidebar disesuaikan dengan modul aktif Anda.'}
                    </p>
                    <Link
                        href="/settings"
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        {t('settings_manage_tabs') || 'Kelola Tab Aktif'} &rarr;
                    </Link>
                </div>
            )}
        </aside>
    );
}
