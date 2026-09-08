'use client';

import React from 'react';
import { CalendarDayItem } from './CalendarGrid';
import { CalendarFilters } from './CalendarFilterBar';

interface CalendarDesktopGridProps {
    calendarDays: CalendarDayItem[];
    selectedDate: string;
    filters: CalendarFilters;
    weekDays: string[];
    onOpenDetail: (date: string) => void;
    hasAnyMetric: (day: CalendarDayItem) => boolean;
    compactCurrency: (value?: number) => string;
    t: any;
}

export default function CalendarDesktopGrid({
    calendarDays,
    selectedDate,
    filters,
    weekDays,
    onOpenDetail,
    hasAnyMetric,
    compactCurrency,
    t
}: CalendarDesktopGridProps) {
    return (
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden transition-colors duration-500">
            <div className="flex flex-col p-8 pb-8">
                
                <div className="grid grid-cols-7 mb-6 border-b border-slate-50 dark:border-slate-800 pb-5">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-[11px] font-black text-slate-400 tracking-[0.2em]">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr gap-4">
                    {calendarDays.map((day, index) => (
                        <div 
                            key={index}
                            onClick={() => day.date && onOpenDetail(day.date)}
                            className={`min-h-[220px] flex flex-col relative group rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${
                                !day.date 
                                    ? 'border-transparent' 
                                    : !day.isCurrentMonth 
                                        ? 'bg-slate-50/30 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 border-slate-50 dark:border-slate-800 opacity-40' 
                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 dark:hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-none cursor-pointer z-10'
                            } ${
                                day.isToday ? 'ring-[3px] ring-indigo-500/20 ring-offset-4 dark:ring-offset-slate-900 shadow-xl shadow-indigo-500/5' : ''
                            } ${
                                selectedDate === day.date ? 'border-indigo-500 !bg-indigo-50/5 dark:!bg-indigo-500/5' : ''
                            }`}
                        >
                            {day.date && (
                                <>
                                    <div className="flex justify-between items-start p-5 pb-2">
                                        <span className={`w-11 h-11 flex items-center justify-center rounded-2xl text-lg font-black transition-all duration-500 ${
                                            day.isToday 
                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none -translate-y-1' 
                                                : 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-500/30 group-hover:-translate-y-1'
                                        }`}>
                                            {day.dayNumber}
                                        </span>
                                        {day.isToday && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-indigo-500 tracking-widest">{t('calendar_today') || 'Today'}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shadow-sm"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-1 p-4 pb-5 gap-3">
                                        <div className="flex flex-col gap-2 w-full shrink-0">
                                            {filters.events && day.events?.slice(0, 2).map(ev => (
                                                <div 
                                                    key={ev.id}
                                                    className="px-3 py-1.5 rounded-xl border border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-sm text-slate-700 dark:text-slate-300 text-[11px] font-bold truncate flex items-center gap-2 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50 transition-all"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: ev.color || '#6366f1' }}></div>
                                                    <span className="truncate">{ev.title}</span>
                                                </div>
                                            ))}

                                            {filters.goals && day.milestones?.slice(0, 1).map(ms => (
                                                <div 
                                                    key={ms.id}
                                                    className="px-3 py-1.5 rounded-xl border border-orange-100/50 dark:border-orange-900/30 bg-orange-50/20 dark:bg-orange-950/20 text-slate-700 dark:text-slate-300 text-[11px] font-bold truncate flex items-center gap-2 transition-all"
                                                >
                                                    <div className="shrink-0">🎯</div>
                                                    <span className="truncate">{ms.title}</span>
                                                </div>
                                            ))}

                                            {((day.events?.length || 0) + (day.milestones?.length || 0)) > 3 && (
                                                <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg w-fit ml-1 border border-slate-100 dark:border-slate-800">
                                                    +{(day.events?.length || 0) + (day.milestones?.length || 0) - 3} more
                                                </div>
                                            )}
                                        </div>

                                        {hasAnyMetric(day) && (
                                            <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-100/50 dark:border-slate-800/50 transition-colors">
                                                {day.hasJournal && filters.journal && (
                                                    <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-[11px] border border-purple-100 dark:border-purple-800/40 shadow-sm" title={t('calendar_journal') || 'Journal'}>📓</div>
                                                )}
                                                {(day.habitDone || 0) > 0 && filters.habits && (
                                                    <div className="px-2 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40 shadow-sm" title={t('calendar_habits') || 'Habits'}>
                                                        <span>🌱</span> <span className="font-black">{day.habitDone}</span>
                                                    </div>
                                                )}
                                                {(day.planner?.total || 0) > 0 && filters.planner && (
                                                    <div className="px-2 h-7 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 shadow-sm" title={t('calendar_planner') || 'Planner'}>
                                                        <span>{day.planner && day.planner.done >= day.planner.total ? '✅' : '⏳'}</span> <span className="font-black">{day.planner?.done}</span>
                                                    </div>
                                                )}
                                                {(day.expense || 0) > 0 && filters.finance && (
                                                    <div className="px-2 h-7 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center gap-1.5 text-[11px] font-bold text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800/40 shadow-sm" title={t('calendar_finance') || 'Finance'}>
                                                        <span>💸</span> <span className="font-black">{compactCurrency(day.expense)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
