'use client';

import React from 'react';
import { CalendarDayItem } from './CalendarGrid';
import { CalendarFilters } from './CalendarFilterBar';

interface CalendarMobileViewProps {
    calendarDays: CalendarDayItem[];
    selectedDate: string;
    selectedDay?: CalendarDayItem;
    filters: CalendarFilters;
    weekDays: string[];
    onOpenDetail: (date: string) => void;
    hasAnyMetric: (day: CalendarDayItem) => boolean;
    formatDateDisplay: (dateStr: string) => string;
    compactCurrency: (value?: number) => string;
}

export default function CalendarMobileView({
    calendarDays,
    selectedDate,
    selectedDay,
    filters,
    weekDays,
    onOpenDetail,
    hasAnyMetric,
    formatDateDisplay,
    compactCurrency
}: CalendarMobileViewProps) {
    return (
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
    );
}
