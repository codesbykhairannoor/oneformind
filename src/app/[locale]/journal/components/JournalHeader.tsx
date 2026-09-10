'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Plus, Flame, Sparkles, BookOpen, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

interface JournalHeaderProps {
    todayDate?: string;
    totalJournals?: number;
    totalWords?: number;
    streakDays?: number;
    synergy?: {
        tasks_completed?: number;
        tasks_total?: number;
        habits_completed?: number;
        expense_total?: number;
    };
}

export default function JournalHeader({ 
    totalJournals = 0,
    totalWords = 0,
    streakDays = 1,
    synergy 
}: JournalHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    
    const tasksCompleted = synergy?.tasks_completed ?? 0;
    const tasksTotal = synergy?.tasks_total ?? 0;
    const habitsCompleted = synergy?.habits_completed ?? 0;
    const expenseTotal = synergy?.expense_total ?? 0;

    const formatMoney = (val: number) => {
        if (isIndo) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="relative z-30 transition-all bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    
                    {/* Left: Title & Writing Streak */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {isIndo ? 'Jurnal Refleksi & Pikiran' : 'Cognitive Reflection Journal'}
                                </h1>
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    <Sparkles className="w-3 h-3 text-indigo-500" />
                                    AI Neural CBT
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                {isIndo 
                                    ? 'Ruang aman untuk menjernihkan pikiran, merekam jejak emosi & mendeteksi pola kognitif' 
                                    : 'A safe sanctuary to declutter thoughts, track emotional trajectory & reframe cognitive distortions'}
                            </p>
                        </div>

                        {/* Streak Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-black text-xs shadow-sm">
                            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                            <span>{streakDays} {isIndo ? 'Hari Beruntun' : 'Day Streak'}</span>
                        </div>
                    </div>

                    {/* Right: Daily Life OS Synergy & Action CTA */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:justify-end">
                        
                        {/* Synergy Micro-pills */}
                        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 px-3 sm:px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
                            {/* Stories count */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                                <div>
                                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                                        {isIndo ? 'Cerita' : 'Stories'}
                                    </p>
                                    <p className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 leading-tight">
                                        {totalJournals}
                                    </p>
                                </div>
                            </div>

                            <div className="w-px h-5 sm:h-6 bg-slate-200 dark:bg-slate-700" />

                            {/* Planner tasks */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                                <div>
                                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                                        {isIndo ? 'Tugas' : 'Tasks'}
                                    </p>
                                    <p className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 leading-tight">
                                        {tasksCompleted}/{tasksTotal}
                                    </p>
                                </div>
                            </div>

                            <div className="w-px h-5 sm:h-6 bg-slate-200 dark:bg-slate-700" />

                            {/* Habit count */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                                <div>
                                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
                                        {isIndo ? 'Habits' : 'Habits'}
                                    </p>
                                    <p className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 leading-tight">
                                        {habitsCompleted}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA: Write New Journal Button */}
                        <Link 
                            href="/journal/write" 
                            className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
                            <span>{isIndo ? 'Tulis Cerita Hari Ini' : 'Write Today\'s Story'}</span>
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
}

