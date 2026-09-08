'use client';

import React from 'react';

export interface CalendarFilters {
    events: boolean;
    journal: boolean;
    habits: boolean;
    planner: boolean;
    finance: boolean;
    goals: boolean;
}

interface CalendarFilterBarProps {
    filters: CalendarFilters;
    toggleFilter: (key: keyof CalendarFilters) => void;
    t: any;
}

export default function CalendarFilterBar({
    filters,
    toggleFilter,
    t
}: CalendarFilterBarProps) {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-start px-2 sm:px-0 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-400 mr-2 tracking-widest hidden md:inline shrink-0">
                <svg className="w-4 h-4 inline-block -mt-0.5 mr-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                {t('calendar_focus') || 'Focus'}
            </span>
            
            <button 
                type="button" 
                onClick={() => toggleFilter('events')} 
                className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-500 border flex items-center gap-2.5 shrink-0 active:scale-95 ${
                    filters.events 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                }`}
            >
                <span>📅</span> <span className="text-[11px] font-bold tracking-tight">{t('calendar_events') || 'Events'}</span>
            </button>

            <button 
                type="button" 
                onClick={() => toggleFilter('goals')} 
                className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-500 border flex items-center gap-2.5 shrink-0 active:scale-95 ${
                    filters.goals 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-500/50'
                }`}
            >
                <span>🎯</span> <span className="text-[11px] font-bold tracking-tight">{t('calendar_goals') || 'Goals'}</span>
            </button>

            <button 
                type="button" 
                onClick={() => toggleFilter('journal')} 
                className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-500 border flex items-center gap-2.5 shrink-0 active:scale-95 ${
                    filters.journal 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50'
                }`}
            >
                <span>📓</span> <span className="text-[11px] font-bold tracking-tight">{t('calendar_journal') || 'Journal'}</span>
            </button>

            <button 
                type="button" 
                onClick={() => toggleFilter('habits')} 
                className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-500 border flex items-center gap-2.5 shrink-0 active:scale-95 ${
                    filters.habits 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50'
                }`}
            >
                <span>🌱</span> <span className="text-[11px] font-bold tracking-tight">{t('calendar_habits') || 'Habits'}</span>
            </button>

            <button 
                type="button" 
                onClick={() => toggleFilter('planner')} 
                className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-500 border flex items-center gap-2.5 shrink-0 active:scale-95 ${
                    filters.planner 
                        ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50'
                }`}
            >
                <span>✅</span> <span className="text-[11px] font-bold tracking-tight">{t('calendar_planner') || 'Planner'}</span>
            </button>

            <button 
                type="button" 
                onClick={() => toggleFilter('finance')} 
                className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl text-[11px] font-bold transition-all duration-500 border flex items-center gap-2.5 shrink-0 active:scale-95 ${
                    filters.finance 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200 dark:shadow-none' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50'
                }`}
            >
                <span>💸</span> <span className="text-[11px] font-bold tracking-tight">{t('calendar_finance') || 'Finance'}</span>
            </button>
        </div>
    );
}
