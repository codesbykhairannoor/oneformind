'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { X, CheckSquare, Plus, Clock, Zap, ArrowRight } from 'lucide-react';

interface CalendarTaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    plannerTasks: any[];
    onScheduleTask: (task: any) => void;
}

export default function CalendarTaskDrawer({
    isOpen,
    onClose,
    plannerTasks,
    onScheduleTask
}: CalendarTaskDrawerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    if (!isOpen) return null;

    const pendingTasks = plannerTasks.filter(t => !t.isCompleted);

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <CheckSquare size={16} />
                    </div>
                    <div>
                        <h3 className="font-black text-sm text-slate-800 dark:text-white">
                            {isIndo ? 'Laci Time-Blocking Tugas' : 'Task Time-Blocking Drawer'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400">
                            {pendingTasks.length} {isIndo ? 'tugas menunggu dialokasikan' : 'tasks pending allocation'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Instruction Callout */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40">
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                    💡 {isIndo 
                        ? 'Klik tombol "Plot Jam" pada tugas di bawah untuk langsung menjadwalkan blok waktu 60 menit fokus di kalender.' 
                        : 'Click "Time-Block" on any task below to instantly create a 60-minute deep work block on your calendar.'}
                </p>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {pendingTasks.length === 0 ? (
                    <div className="text-center py-16 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl mx-auto">
                            🎉
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {isIndo ? 'Semua tugas telah tuntas!' : 'All tasks completed!'}
                        </p>
                    </div>
                ) : (
                    pendingTasks.map((t, idx) => (
                        <div
                            key={t.id || idx}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-500/50 transition-all flex items-center justify-between gap-3 group"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                    {t.title}
                                </p>
                                {t.description && (
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                        {t.description}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => onScheduleTask(t)}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
                            >
                                <Zap size={11} />
                                <span>{isIndo ? 'Plot Jam' : 'Time-Block'}</span>
                            </button>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
