'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Plus, Video, Target, Briefcase, CheckSquare, Leaf, DollarSign } from 'lucide-react';
import { UnifiedCalendarEvent, detectMeetingPlatform } from '../lib/calendarAnalytics';
import { CalendarLayerFilters } from './CalendarFilterBar';

export interface MonthGridDayItem {
    date: string; // YYYY-MM-DD
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: UnifiedCalendarEvent[];
    jobInterviews: any[];
    milestones: any[];
    plannerTasks: any[];
    habitCount: number;
    financeExpense: number;
}

interface CalendarMonthViewProps {
    days: MonthGridDayItem[];
    selectedDate: string;
    layers: CalendarLayerFilters;
    onSelectDate: (date: string) => void;
    onOpenDayDetail: (date: string) => void;
    onAddEventOnDate: (date: string) => void;
}

export default function CalendarMonthView({
    days,
    selectedDate,
    layers,
    onSelectDate,
    onOpenDayDetail,
    onAddEventOnDate
}: CalendarMonthViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const weekDays = isIndo 
        ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const formatCurrencyCompact = (val: number) => {
        if (!val) return '';
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
        return String(val);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-colors">
            
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {weekDays.map((day, idx) => (
                    <div 
                        key={day} 
                        className={`py-3 text-center text-[11px] font-black tracking-widest uppercase ${
                            idx >= 5 ? 'text-rose-500/80 dark:text-rose-400/80' : 'text-slate-400 dark:text-slate-500'
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Month Day Cells Grid */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60">
                {days.map((day, idx) => {
                    const isSelected = selectedDate === day.date;
                    const plannerDone = day.plannerTasks.filter(p => p.isCompleted).length;
                    const plannerTotal = day.plannerTasks.length;

                    return (
                        <div
                            key={idx}
                            onClick={() => onSelectDate(day.date)}
                            onDoubleClick={() => onOpenDayDetail(day.date)}
                            className={`min-h-[120px] sm:min-h-[150px] p-2 sm:p-2.5 flex flex-col justify-between relative group transition-all duration-200 cursor-pointer ${
                                !day.isCurrentMonth 
                                    ? 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-300 dark:text-slate-700 opacity-40' 
                                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                            } ${
                                day.isToday 
                                    ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/10 dark:bg-indigo-950/20' 
                                    : ''
                            } ${
                                isSelected 
                                    ? 'bg-indigo-50/20 dark:bg-indigo-900/20' 
                                    : ''
                            }`}
                        >
                            {/* Top row: Day Number + Quick Add Trigger */}
                            <div className="flex items-center justify-between">
                                <span className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                                    day.isToday 
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105' 
                                        : isSelected
                                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600'
                                }`}>
                                    {day.dayNumber}
                                </span>

                                {/* Hover "+" Add Event Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddEventOnDate(day.date);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-600 transition-all flex items-center justify-center shadow-sm"
                                    title={isIndo ? 'Tambah agenda di tanggal ini' : 'Add event on this date'}
                                >
                                    <Plus size={13} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Middle: Events & Meetings list */}
                            <div className="flex-1 my-1.5 space-y-1 overflow-hidden">
                                
                                {/* Events Layer */}
                                {layers.events && day.events.slice(0, 2).map((ev) => {
                                    const meeting = detectMeetingPlatform(ev.meeting_url || ev.description);
                                    return (
                                        <div
                                            key={ev.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenDayDetail(day.date);
                                            }}
                                            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate flex items-center gap-1 border shadow-xs transition-all hover:scale-[1.02]"
                                            style={{
                                                backgroundColor: `${ev.color || '#4f46e5'}15`,
                                                borderColor: `${ev.color || '#4f46e5'}40`,
                                                color: ev.color || '#4f46e5'
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ev.color || '#4f46e5' }} />
                                            <span className="truncate flex-1">{ev.title}</span>
                                            {meeting.platform && (
                                                <Video size={10} className="shrink-0 opacity-70" />
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Job Interviews Layer */}
                                {layers.jobs && day.jobInterviews.slice(0, 1).map((job, jIdx) => (
                                    <div
                                        key={jIdx}
                                        className="px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate flex items-center gap-1 bg-purple-500/15 border border-purple-500/40 text-purple-700 dark:text-purple-300"
                                    >
                                        <Briefcase size={10} className="shrink-0" />
                                        <span className="truncate">{job.company}</span>
                                    </div>
                                ))}

                                {/* Goal Milestones Layer */}
                                {layers.goals && day.milestones.slice(0, 1).map((ms, mIdx) => (
                                    <div
                                        key={mIdx}
                                        className="px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate flex items-center gap-1 bg-orange-500/15 border border-orange-500/40 text-orange-700 dark:text-orange-300"
                                    >
                                        <Target size={10} className="shrink-0" />
                                        <span className="truncate">{ms.title}</span>
                                    </div>
                                ))}

                                {/* More Counter */}
                                {(day.events.length + day.jobInterviews.length + day.milestones.length) > 3 && (
                                    <span className="text-[9px] font-bold text-slate-400 block px-1">
                                        +{(day.events.length + day.jobInterviews.length + day.milestones.length) - 3} {isIndo ? 'lainnya' : 'more'}
                                    </span>
                                )}
                            </div>

                            {/* Bottom: Life OS Indicators (Habits, Planner, Expenses) */}
                            <div className="flex items-center gap-1 pt-1 border-t border-slate-100/60 dark:border-slate-800/60 text-[10px]">
                                {layers.planner && plannerTotal > 0 && (
                                    <span 
                                        className={`px-1 rounded text-[9px] font-black flex items-center gap-0.5 ${
                                            plannerDone >= plannerTotal 
                                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                        title={`${plannerDone}/${plannerTotal} ${isIndo ? 'Tugas selesai' : 'Tasks done'}`}
                                    >
                                        <CheckSquare size={9} />
                                        <span>{plannerDone}/{plannerTotal}</span>
                                    </span>
                                )}

                                {layers.habits && day.habitCount > 0 && (
                                    <span 
                                        className="px-1 rounded text-[9px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"
                                        title={`${day.habitCount} ${isIndo ? 'Kebiasaan tuntas' : 'Habits checked'}`}
                                    >
                                        <Leaf size={9} />
                                        <span>{day.habitCount}</span>
                                    </span>
                                )}

                                {layers.finance && day.financeExpense > 0 && (
                                    <span 
                                        className="px-1 rounded text-[9px] font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-0.5 ml-auto"
                                        title={`${isIndo ? 'Pengeluaran' : 'Expense'}: ${day.financeExpense}`}
                                    >
                                        <DollarSign size={9} />
                                        <span>{formatCurrencyCompact(day.financeExpense)}</span>
                                    </span>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}
