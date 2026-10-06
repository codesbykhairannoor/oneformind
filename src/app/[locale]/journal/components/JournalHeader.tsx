'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Plus, Flame, Sparkles, BookOpen, CheckCircle2, Calendar, Download } from 'lucide-react';
import ModuleHeader from '@/components/layout/ModuleHeader';

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
    onOpenExportModal?: () => void;
}

export default function JournalHeader({ 
    totalJournals = 0,
    totalWords = 0,
    streakDays = 1,
    synergy,
    onOpenExportModal
}: JournalHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    
    const tasksCompleted = synergy?.tasks_completed ?? 0;
    const tasksTotal = synergy?.tasks_total ?? 0;
    const habitsCompleted = synergy?.habits_completed ?? 0;

    return (
        <ModuleHeader
            icon={<BookOpen size={18} strokeWidth={2.5} />}
            title={isIndo ? 'Jurnal Refleksi & Pikiran' : 'Cognitive Reflection Journal'}
            badge={
                <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-800/40">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    AI Neural CBT
                </span>
            }
            subtitle={isIndo ? 'Ruang aman untuk menjernihkan pikiran, emosi & pola kognitif' : 'Declutter thoughts, track emotional trajectory & cognitive reframing'}
            centerContent={
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Streak Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-xs shadow-xs">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                        <span>{streakDays} {isIndo ? 'Hari Beruntun' : 'Day Streak'}</span>
                    </div>

                    {/* Synergy Micro-pills */}
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                        {/* Stories count */}
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                            <div className="flex items-baseline gap-1">
                                <span className="text-[9px] font-bold text-slate-400 leading-none">{isIndo ? 'Cerita' : 'Stories'}:</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200">{totalJournals}</span>
                            </div>
                        </div>

                        <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />

                        {/* Planner tasks */}
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <div className="flex items-baseline gap-1">
                                <span className="text-[9px] font-bold text-slate-400 leading-none">{isIndo ? 'Tugas' : 'Tasks'}:</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200">{tasksCompleted}/{tasksTotal}</span>
                            </div>
                        </div>

                        <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />

                        {/* Habit count */}
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-purple-500" />
                            <div className="flex items-baseline gap-1">
                                <span className="text-[9px] font-bold text-slate-400 leading-none">Habits:</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200">{habitsCompleted}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
            actions={
                <div className="flex items-center gap-2">
                    {/* Export Button */}
                    {onOpenExportModal && (
                        <button
                            type="button"
                            onClick={onOpenExportModal}
                            title={isIndo ? 'Ekspor Data Jurnal (CSV/JSON)' : 'Export Journal Data (CSV/JSON)'}
                            className="h-10 px-3.5 flex items-center justify-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
                        >
                            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span>{isIndo ? 'Ekspor' : 'Export'}</span>
                        </button>
                    )}

                    {/* CTA: Write New Journal Button */}
                    <Link 
                        href="/journal/write" 
                        className="h-10 px-4 sm:px-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>{isIndo ? 'Tulis Cerita Hari Ini' : 'Write Today\'s Story'}</span>
                    </Link>
                </div>
            }
        />
    );
}
