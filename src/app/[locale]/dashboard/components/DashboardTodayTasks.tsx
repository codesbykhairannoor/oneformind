'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Plus, Zap, ChevronRight } from 'lucide-react';

interface DashboardTodayTasksProps {
    plannerData: any;
    synergy: any;
    t: any;
}

export default function DashboardTodayTasks({ plannerData, synergy, t }: DashboardTodayTasksProps) {
    const plannerTaskCount = plannerData.total;

    return (
        <section className="bento-card bento-card-hover rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {t('dash_today') || 'Fokus Hari Ini'}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {t('dash_planner_tasks_today') ? t('dash_planner_tasks_today', { count: plannerTaskCount }) : `${plannerTaskCount} tugas terjadwal untuk Anda`}
                    </p>
                </div>
                <Link
                    href="/planner"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    {t('dash_schedule') || 'Jadwal Lengkap'}
                    <ArrowRight size={14} />
                </Link>
            </div>

            {plannerData.upcoming.length > 0 ? (
                <div className="space-y-2">
                    {plannerData.upcoming.map((task: any, index: number) => (
                        <div
                            key={task.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-transparent bg-slate-50/80 px-3 py-3 transition-all duration-300 hover:border-slate-200 dark:bg-white/[0.04] dark:hover:border-white/10 hover:translate-x-1"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="shrink-0 rounded-lg bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                                    {task.start_time || '—'}
                                </span>
                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {task.title}
                                </p>
                            </div>
                            <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                                {t('dash_task_scheduled') || 'Terjadwal'}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center dark:border-white/10 dark:bg-white/[0.02]">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t('dash_all_tasks_done') || 'Semua tugas hari ini selesai! Bagus sekali.'}
                    </p>
                    <Link
                        href="/planner"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                    >
                        <Plus size={14} />
                        {t('btn_add_task') || 'Tambah Tugas'}
                    </Link>
                </div>
            )}

            {/* Habit Progress Bar */}
            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                            <Zap className="text-indigo-500" size={16} />
                            {t('dash_habit_title') || 'Status Kebiasaan'}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                            {synergy.habits.completed}/{synergy.habits.total} {t('dash_done') || 'Selesai'}
                        </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-700 dark:bg-indigo-400"
                            style={{ width: `${synergy.habits.percent}%` }}
                        />
                    </div>
                </div>
                <Link
                    href="/habits"
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                    {t('btn_check_habit') || 'Cek Habit'}
                    <ChevronRight size={14} />
                </Link>
            </div>
        </section>
    );
}
