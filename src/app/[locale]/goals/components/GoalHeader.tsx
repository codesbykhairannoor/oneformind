'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Plus, Target, Sparkles } from 'lucide-react';

interface GoalHeaderProps {
    onAddClick: () => void;
}

export default function GoalHeader({ onAddClick }: GoalHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    return (
        <div className="relative z-[60] transition-all bg-white dark:bg-slate-900 border-b shadow-sm border-slate-100 dark:border-slate-800 duration-500">
            <div className="mx-auto flex w-full min-w-0 flex-col items-stretch justify-between gap-3 px-4 md:px-6 lg:px-8 py-4 md:flex-row md:items-center lg:max-w-[96%]">
                
                <div className="flex items-center gap-3 w-full min-w-0 md:w-auto">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-800/40">
                        <Target className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                        <h1 className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">
                            {isIndo ? 'Pelacak Target & Visi Hidup' : 'Goal & Vision Mastery'}
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {isIndo ? 'Sistem Eksekusi Mandiri' : 'Self-Contained Execution System'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center w-full min-w-0 gap-2 md:w-auto md:justify-end mt-1 md:mt-0">
                    <button 
                        type="button"
                        onClick={onAddClick} 
                        className="flex items-center justify-center flex-1 md:flex-none h-10 px-5 transition shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl gap-2 active:scale-95 whitespace-nowrap min-w-0"
                    >
                        <Plus className="w-4 h-4 text-white stroke-[3]" />
                        <span className="text-xs font-black text-white tracking-tight">
                            {isIndo ? 'Buat Target Baru' : 'Set New Goal'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

