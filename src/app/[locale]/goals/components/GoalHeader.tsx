'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

interface GoalHeaderProps {
    onAddClick: () => void;
}

export default function GoalHeader({ onAddClick }: GoalHeaderProps) {
    const t = useTranslations();

    return (
        // 1:1 from GoalHeader.vue line 21-41
        <div className="relative z-[60] transition-all bg-white dark:bg-slate-900 border-b shadow-sm border-slate-100 dark:border-slate-800 duration-500">
            <div className="mx-auto flex w-full min-w-0 flex-col items-stretch justify-between gap-3 px-4 md:px-6 lg:px-8 py-4 md:flex-row md:items-center lg:max-w-[96%]">
                
                <div className="flex items-center gap-2 w-full min-w-0 md:w-auto md:max-w-[min(100%,28rem)]">
                    <p className="shrink-0 text-[13px] font-black capitalize tracking-wide text-slate-700 dark:text-slate-300 mr-2 pr-4">
                        {t('goal_page_title') || 'Goal Tracker'}
                    </p>
                </div>

                <div className="flex items-center w-full min-w-0 gap-2 md:w-auto md:justify-end mt-1 md:mt-0">
                    <button 
                        type="button"
                        onClick={onAddClick} 
                        className="flex items-center justify-center flex-1 h-11 px-3 md:px-6 transition shadow-lg bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-indigo-100 dark:shadow-indigo-900/40 gap-2 active:scale-95 whitespace-nowrap min-w-0"
                    >
                        <Plus className="w-4 h-4 text-white stroke-[3]" />
                        <span className="text-[11px] font-black text-white tracking-tight truncate">
                            {t('goal_btn_add') || 'Set New Goal'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
