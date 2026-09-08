'use client';

import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';

interface HabitEmptyStateProps {
    activeFilter: 'all' | 'morning' | 'afternoon' | 'evening' | 'quit';
    isIndo: boolean;
    t: any;
    openCreateModal: () => void;
    handleCopyPreviousHabits: () => void;
}

export default function HabitEmptyState({
    activeFilter,
    isIndo,
    t,
    openCreateModal,
    handleCopyPreviousHabits
}: HabitEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 mx-4 md:mx-0">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center text-3xl mb-4 text-indigo-500">
                ✨
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                {activeFilter === 'all' 
                    ? (t('habits_empty_title') || 'Belum Ada Habit') 
                    : (isIndo ? 'Tidak Ada Habit di Kategori Ini' : 'No Habits in this Filter')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto mb-6">
                {isIndo ? 'Mulai bangun rutinitas positif Anda hari ini atau salin dari bulan sebelumnya.' : 'Start building positive routines today or copy from last month.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={openCreateModal}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
                >
                    <Plus size={15} strokeWidth={3} />
                    <span>{t('habits_add_btn') || 'Tambah Habit'}</span>
                </button>
                <button
                    type="button"
                    onClick={handleCopyPreviousHabits}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl hover:bg-slate-200 transition active:scale-95 flex items-center gap-2"
                >
                    <ArrowRight size={15} strokeWidth={3} />
                    <span>{isIndo ? 'Salin dari Bulan Lalu' : 'Copy from Last Month'}</span>
                </button>
            </div>
        </div>
    );
}
