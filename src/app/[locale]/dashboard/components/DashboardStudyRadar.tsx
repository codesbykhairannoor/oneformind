'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { GraduationCap, BookOpen, Clock, ArrowRight, BookMarked, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface DashboardStudyRadarProps {
    studyData: {
        upcoming_assignments: any[];
        active_book: any | null;
        reading_goal: { year: number; target_books: number };
        completed_books_count: number;
        total_books_count: number;
        focus_stats: { completedSessions: number; totalFocusMinutes: number };
    };
    t: any;
    locale: string;
}

export default function DashboardStudyRadar({ studyData, t, locale }: DashboardStudyRadarProps) {
    const { upcoming_assignments, active_book, reading_goal, completed_books_count, focus_stats } = studyData;

    const getDeadlineBadge = (deadlineStr: string) => {
        if (!deadlineStr) return null;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const due = new Date(deadlineStr);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                label: locale === 'id' ? 'Terlewat' : 'Overdue',
                className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            };
        } else if (diffDays === 0) {
            return {
                label: t('dash_due_today') || (locale === 'id' ? 'Hari Ini' : 'Today'),
                className: 'bg-rose-500 text-white animate-pulse'
            };
        } else if (diffDays === 1) {
            return {
                label: t('dash_due_tomorrow') || (locale === 'id' ? 'Besok' : 'Tomorrow'),
                className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            };
        } else {
            return {
                label: locale === 'id' ? `${diffDays} hari lagi` : `in ${diffDays} days`,
                className: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
            };
        }
    };

    const bookPercent = active_book && active_book.total_pages > 0
        ? Math.min(100, Math.round(((active_book.current_page || 0) / active_book.total_pages) * 100))
        : 0;

    const focusHours = (focus_stats.totalFocusMinutes / 60).toFixed(1);

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Academic Radar / Upcoming Deadlines */}
            <div className="bento-card bento-card-hover rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                                <GraduationCap size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {t('dash_upcoming_deadlines') || 'Deadline & Ujian'}
                                </h3>
                                <p className="text-[10px] text-slate-400">
                                    {upcoming_assignments.length > 0
                                        ? `${upcoming_assignments.length} ${locale === 'id' ? 'tugas menunggu' : 'tasks pending'}`
                                        : (locale === 'id' ? 'Semua teratasi' : 'All clear')}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/study"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            {locale === 'id' ? 'Radar' : 'View'}
                            <ArrowRight size={13} />
                        </Link>
                    </div>

                    <div className="mt-4 space-y-2.5">
                        {upcoming_assignments.length > 0 ? (
                            upcoming_assignments.map((item: any) => {
                                const badge = getDeadlineBadge(item.deadline);
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-all duration-300 hover:border-slate-200 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {item.type || 'Tugas'}
                                                </span>
                                                <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-[11px] text-slate-400">
                                                {item.course_name || 'Akademik'}
                                            </p>
                                        </div>
                                        {badge && (
                                            <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold tracking-tight ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 p-4 text-center dark:border-white/10 dark:bg-white/[0.01]">
                                <CheckCircle2 className="mx-auto text-emerald-500 mb-1.5" size={24} />
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {t('dash_no_deadlines') || 'Semua tugas & ujian aman!'}
                                </p>
                                <Link
                                    href="/study"
                                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    <Plus size={12} />
                                    {locale === 'id' ? 'Buka Academic Center' : 'Open Academic Center'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Micro Focus Stat Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-[11px]">
                        <Clock size={13} className="text-indigo-500" />
                        {t('dash_focus_hours') || 'Jam Fokus'}: <strong className="text-slate-800 dark:text-slate-200">{focusHours}h</strong>
                    </span>
                    <Link href="/study" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        {locale === 'id' ? 'Mulai Sprint' : 'Start Sprint'} &rarr;
                    </Link>
                </div>
            </div>

            {/* 2. Knowledge & Book Tracker */}
            <div className="bento-card bento-card-hover rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {t('dash_current_reading') || 'Buku Yang Dibaca'}
                                </h3>
                                <p className="text-[10px] text-slate-400">
                                    {completed_books_count} / {reading_goal.target_books || 20} {locale === 'id' ? 'buku selesai' : 'books read'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/study?tab=books"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
                        >
                            {locale === 'id' ? 'Rak Buku' : 'Shelf'}
                            <ArrowRight size={13} />
                        </Link>
                    </div>

                    <div className="mt-4">
                        {active_book ? (
                            <div className="flex items-center gap-4 rounded-xl border border-purple-500/15 bg-purple-50/40 dark:bg-purple-950/20 dark:border-purple-500/20 p-3.5">
                                <div className="h-16 w-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md text-white font-bold text-base">
                                    {active_book.cover_image ? (
                                        <img
                                            src={active_book.cover_image}
                                            alt={active_book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <BookMarked size={20} className="text-white/80" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                        {active_book.title}
                                    </h4>
                                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                        {active_book.author || (locale === 'id' ? 'Penulis' : 'Author')}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mt-2.5">
                                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                                            <span>
                                                {active_book.current_page || 0} / {active_book.total_pages || 0} {locale === 'id' ? 'hlm' : 'pages'}
                                            </span>
                                            <span className="text-purple-600 dark:text-purple-400 font-bold">{bookPercent}%</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                                                style={{ width: `${bookPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 p-4 text-center dark:border-white/10 dark:bg-white/[0.01]">
                                <Sparkles className="mx-auto text-purple-400 mb-1.5" size={24} />
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {t('dash_no_current_reading') || 'Belum ada buku yang sedang dibaca.'}
                                </p>
                                <Link
                                    href="/study?tab=books"
                                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                    <Plus size={12} />
                                    {locale === 'id' ? 'Pilih Buku Baru' : 'Add a New Book'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Annual Reading Goal Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px]">
                        🎯 {t('dash_reading_goal_status') || 'Target'}: <strong className="text-slate-800 dark:text-slate-200">{reading_goal.year || 2026} ({reading_goal.target_books || 20} buku)</strong>
                    </span>
                    <Link href="/study?tab=books" className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                        {locale === 'id' ? 'Buka Rak' : 'Shelf'} &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
}
