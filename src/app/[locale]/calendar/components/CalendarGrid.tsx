'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export interface CalendarEvent {
    id: number | string;
    title: string;
    start_date?: string;
    end_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    is_all_day?: boolean;
    color?: string;
    description?: string | null;
}

export interface CalendarMilestone {
    id: number | string;
    title: string;
    goal_title?: string;
    goal_color?: string;
    completed?: boolean;
    is_completed?: boolean;
}

export interface CalendarDayItem {
    date: string; // YYYY-MM-DD
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events?: CalendarEvent[];
    milestones?: CalendarMilestone[];
    hasJournal?: boolean;
    habitDone?: number;
    planner?: {
        total: number;
        done: number;
    } | null;
    expense?: number;
}

interface CalendarGridProps {
    calendarDays: CalendarDayItem[];
    selectedDate: string;
    onOpenDetail: (date: string) => void;
    onOpenEventModal: (date?: string) => void;
}

export default function CalendarGrid({
    calendarDays, selectedDate, onOpenDetail, onOpenEventModal
}: CalendarGridProps) {
    const t = useTranslations();

    const [filters, setFilters] = useState({
        events: true,
        journal: true,
        habits: true,
        planner: true,
        finance: true,
        goals: true
    });

    const toggleFilter = (key: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const selectedDay = calendarDays.find(d => d.date === selectedDate);

    const activeMetricsCount = (day: CalendarDayItem) => {
        let count = 0;
        if (filters.journal && day.hasJournal) count++;
        if (filters.habits && (day.habitDone || 0) > 0) count++;
        if (filters.planner && day.planner && day.planner.total > 0) count++;
        if (filters.finance && (day.expense || 0) > 0) count++;
        if (filters.goals && (day.milestones?.length || 0) > 0) count++;
        return count;
    };

    const hasAnyMetric = (day: CalendarDayItem) => {
        return activeMetricsCount(day) > 0 || (filters.events && (day.events?.length || 0) > 0);
    };

    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const compactCurrency = (value?: number) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID', { 
            notation: 'compact', 
            maximumFractionDigits: 1 
        }).format(value);
    };

    const formatDateDisplay = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        // 1:1 from CalendarGrid.vue line 78-297
        <div className="flex flex-col gap-4 sm:gap-6">
            
            {/* Filter Bar */}
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

            {/* MOBILE LAYOUT (<md) */}
            <div className="md:hidden space-y-8 px-2 sm:px-0">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-5 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="grid grid-cols-7 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-[10px] font-bold text-slate-400 tracking-[0.15em]">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, index) => (
                            <button 
                                key={index}
                                type="button"
                                onClick={() => day.date && onOpenDetail(day.date)}
                                className={`aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all active:scale-90 ${
                                    !day.date 
                                        ? 'opacity-0' 
                                        : !day.isCurrentMonth 
                                            ? 'text-slate-300 dark:text-slate-700' 
                                            : 'text-slate-800 dark:text-slate-200'
                                } ${
                                    selectedDate === day.date 
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none scale-110 z-10' 
                                        : 'bg-slate-50/50 dark:bg-slate-800/30'
                                }`}
                            >
                                <span className="text-sm font-black">{day.dayNumber}</span>
                                {day.date && hasAnyMetric(day) && (
                                    <div className="absolute bottom-1.5 flex gap-0.5">
                                        {filters.events && !!day.events?.length && <div className="w-1 h-1 rounded-full bg-indigo-400 shadow-sm"></div>}
                                        {filters.goals && !!day.milestones?.length && <div className="w-1 h-1 rounded-full bg-orange-400 shadow-sm"></div>}
                                        {filters.planner && !!day.planner?.total && <div className="w-1 h-1 rounded-full bg-blue-400 shadow-sm"></div>}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Agenda View */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Agenda: {formatDateDisplay(selectedDate)}
                        </h3>
                    </div>

                    {selectedDay && (
                        <div className="space-y-4">
                            {filters.events && !!selectedDay.events?.length && (
                                <div className="space-y-3">
                                    {selectedDay.events.map(ev => (
                                        <div key={ev.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                                            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: ev.color || '#6366f1' }}></div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Event</p>
                                                <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight">{ev.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {filters.goals && !!selectedDay.milestones?.length && (
                                <div className="space-y-3">
                                    {selectedDay.milestones.map(ms => (
                                        <div key={ms.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-slate-50 dark:border-slate-800" style={{ backgroundColor: (ms.goal_color || '#6366f1') + '15', color: ms.goal_color || '#6366f1' }}>
                                                <span className="text-xl">🎯</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">{ms.goal_title}</p>
                                                <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight">{ms.title}</p>
                                            </div>
                                            {(ms.completed || ms.is_completed) && (
                                                <div className="bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-widest">Done</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {filters.journal && selectedDay.hasJournal && (
                                    <div className="bg-purple-50/50 dark:bg-purple-500/5 p-5 rounded-[2rem] border border-purple-100/50 dark:border-purple-900/20 flex flex-col gap-2">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-sm">📓</div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-purple-400 mb-0.5">Journal</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">New entry written</p>
                                        </div>
                                    </div>
                                )}
                                {filters.habits && !!selectedDay.habitDone && (
                                    <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-5 rounded-[2rem] border border-emerald-100/50 dark:border-emerald-900/20 flex flex-col gap-2">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-sm">🌱</div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-emerald-400 mb-0.5">Habits</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{selectedDay.habitDone} items done</p>
                                        </div>
                                    </div>
                                )}
                                {filters.planner && selectedDay.planner && (
                                    <div className="bg-blue-50/50 dark:bg-blue-500/5 p-5 rounded-[2rem] border border-blue-100/50 dark:border-blue-900/20 flex flex-col gap-2">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                                            {selectedDay.planner.done >= selectedDay.planner.total ? '✅' : '⏳'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-blue-400 mb-0.5">Tasks</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{selectedDay.planner.done}/{selectedDay.planner.total} completed</p>
                                        </div>
                                    </div>
                                )}
                                {filters.finance && !!selectedDay.expense && (
                                    <div className="bg-rose-50/50 dark:bg-rose-500/5 p-5 rounded-[2rem] border border-rose-100/50 dark:border-rose-900/20 flex flex-col gap-2">
                                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-sm">💸</div>
                                        <div>
                                            <p className="text-[10px] font-bold tracking-widest text-rose-400 mb-0.5">Finance</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{compactCurrency(selectedDay.expense)} spent</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!hasAnyMetric(selectedDay) && (
                                <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎐</div>
                                    <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">Steady winds ahead</h4>
                                    <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No activity recorded for this day yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* DESKTOP LAYOUT (>=md) */}
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
        </div>
    );
}
