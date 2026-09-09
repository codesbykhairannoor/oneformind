'use client';

import React, { useRef, useEffect } from 'react';
import { Check, Plus, Coffee, FileText, Sparkles } from 'lucide-react';
import { HabitItem, ProcessedHabitItem, MonthDateItem } from '../types';
import { getHabitDayInfo } from '../utils/habitMath';

interface HabitMobileViewProps {
    monthDates: MonthDateItem[];
    selectedMobileDate: string;
    setSelectedMobileDate: (d: string) => void;
    filteredHabits: ProcessedHabitItem[];
    numericViewMode: 'value' | 'percent';
    onSelectHabitDetail: (habit: HabitItem) => void;
    onOpenNumericPopover: (data: { 
        habitId: number; 
        habitName?: string;
        habitIcon?: string;
        habitColor?: string;
        dateStr: string; 
        currentVal: number; 
        targetVal: number; 
        unit: string;
        currentNotes?: string;
    }) => void;
    onToggleStatus: (habitId: number, dateStr: string) => void;
    onOpenNoteModal?: (d: { habit: HabitItem; dateStr: string; notes: string }) => void;
}

export default function HabitMobileView({
    monthDates,
    selectedMobileDate,
    setSelectedMobileDate,
    filteredHabits,
    numericViewMode,
    onSelectHabitDetail,
    onOpenNumericPopover,
    onToggleStatus,
    onOpenNoteModal
}: HabitMobileViewProps) {
    const dateStripRef = useRef<HTMLDivElement>(null);
    const activeDateBtnRef = useRef<HTMLButtonElement>(null);

    // Auto-scroll the date strip to center the active date
    useEffect(() => {
        if (activeDateBtnRef.current && dateStripRef.current) {
            activeDateBtnRef.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }
    }, [selectedMobileDate]);

    return (
        <div className="md:hidden space-y-4 pb-28">
            
            {/* Horizontal Date Strip with Auto-Scroll & Progress Dots */}
            <div 
                ref={dateStripRef}
                className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-2 scroll-smooth"
            >
                {monthDates.map(day => {
                    const isSelected = selectedMobileDate === day.dateString;
                    const hasCompletedHabit = filteredHabits.some(h => {
                        const info = getHabitDayInfo(h, day);
                        return info.status === 'completed';
                    });

                    return (
                        <button
                            key={day.dateString}
                            ref={isSelected ? activeDateBtnRef : null}
                            type="button"
                            onClick={() => setSelectedMobileDate(day.dateString)}
                            className={`flex-shrink-0 w-12 py-2 rounded-2xl flex flex-col items-center gap-0.5 transition-all duration-200 active:scale-95 ${
                                isSelected
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105 ring-2 ring-indigo-600/30'
                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                            }`}
                        >
                            <span className="text-[9px] font-black uppercase tracking-tighter opacity-75">{day.dayName}</span>
                            <span className="text-sm font-black">{day.dayNumber}</span>
                            <span 
                                className={`w-1.5 h-1.5 rounded-full transition-all mt-0.5 ${
                                    isSelected 
                                        ? 'bg-white' 
                                        : hasCompletedHabit 
                                        ? 'bg-emerald-500 shadow-sm' 
                                        : 'bg-transparent'
                                }`} 
                            />
                        </button>
                    );
                })}
            </div>

            {/* Mobile Habit Cards */}
            <div className="space-y-3 px-3">
                {filteredHabits.map(habit => {
                    const selectedDayObj = monthDates.find(d => d.dateString === selectedMobileDate) || monthDates[0];
                    const dayInfo = getHabitDayInfo(habit, selectedDayObj);
                    const isDone = dayInfo.status === 'completed';
                    const isRelapse = dayInfo.status === 'relapse';
                    const isRest = dayInfo.status === 'rest';

                    return (
                        <div
                            key={habit.id}
                            className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2.5 transition-all hover:border-indigo-100 dark:hover:border-slate-700"
                        >
                            {/* Card Top Row: Icon + Habit Details + Action Button */}
                            <div className="flex items-center gap-3">
                                {/* Habit Icon */}
                                <button
                                    type="button"
                                    onClick={() => onSelectHabitDetail(habit)}
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform active:scale-90"
                                    style={{ backgroundColor: `${habit.color}18`, color: habit.color }}
                                    title="Lihat Detail Habit"
                                >
                                    {habit.icon}
                                </button>

                                {/* Habit Title & Info */}
                                <div className="flex-1 min-w-0" onClick={() => onSelectHabitDetail(habit)}>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate max-w-[170px]">
                                            {habit.name}
                                        </h4>
                                        {habit.streak > 1 && (
                                            <span className="text-[9px] font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                                {habit.streak} 🔥
                                            </span>
                                        )}
                                    </div>

                                    {/* Monthly Target Count */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${habit.progress_percent}%`, backgroundColor: habit.color }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 shrink-0 font-mono">
                                            {habit.progress_count}/{habit.monthlyTarget}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Action Buttons */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Micro-Note Trigger */}
                                    {onOpenNoteModal && (
                                        <button
                                            type="button"
                                            onClick={() => onOpenNoteModal({
                                                habit,
                                                dateStr: selectedMobileDate,
                                                notes: dayInfo.notes || ''
                                            })}
                                            title="Catatan Harian"
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                dayInfo.notes && dayInfo.notes.trim().length > 0
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40'
                                                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <FileText size={15} strokeWidth={2.5} />
                                        </button>
                                    )}

                                    {/* Toggle / Counter Button */}
                                    {habit.measurementType === 'numeric' ? (() => {
                                        const val = dayInfo.value !== undefined ? dayInfo.value : (isDone ? (habit.targetValue || 10) : 0);
                                        const target = Math.max(1, habit.targetValue || 10);
                                        const percentVal = Math.round((val / target) * 100);
                                        const hasProgress = val > 0 || isDone || dayInfo.status === 'in_progress';

                                        return (
                                            <button
                                                type="button"
                                                onClick={() => onOpenNumericPopover({
                                                    habitId: habit.id,
                                                    habitName: habit.name,
                                                    habitIcon: habit.icon,
                                                    habitColor: habit.color,
                                                    dateStr: selectedMobileDate,
                                                    currentVal: val,
                                                    targetVal: target,
                                                    unit: habit.unit || '',
                                                    currentNotes: dayInfo.notes || ''
                                                })}
                                                className={`px-3.5 h-11 rounded-2xl font-black text-xs flex items-center gap-1 transition-all active:scale-95 ${
                                                    isDone
                                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none'
                                                        : hasProgress
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                {numericViewMode === 'percent' ? (
                                                    <span>{hasProgress ? `${percentVal}%` : '0%'}</span>
                                                ) : (
                                                    <>
                                                        <span>{val}</span>
                                                        <span className="text-[9px] opacity-70">/{habit.targetValue}</span>
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })() : (
                                        <button
                                            type="button"
                                            onClick={() => onToggleStatus(habit.id, selectedMobileDate)}
                                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${
                                                isDone
                                                    ? 'shadow-md shadow-indigo-100 dark:shadow-none text-white'
                                                    : isRelapse
                                                    ? 'bg-rose-500 text-white shadow-sm'
                                                    : isRest
                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-400'
                                            }`}
                                            style={isDone ? { backgroundColor: habit.color } : {}}
                                        >
                                            {isDone && <Check size={18} strokeWidth={3.5} />}
                                            {isRelapse && <span className="text-xs font-black">⚠️</span>}
                                            {isRest && <Coffee size={16} />}
                                            {!isDone && !isRelapse && !isRest && <Plus size={16} strokeWidth={2.5} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card Bottom Row: Micro-Note Display (if exists) */}
                            {dayInfo.notes && dayInfo.notes.trim().length > 0 && (
                                <div 
                                    onClick={() => onOpenNoteModal && onOpenNoteModal({
                                        habit,
                                        dateStr: selectedMobileDate,
                                        notes: dayInfo.notes || ''
                                    })}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-50/70 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-900/30 text-[11px] text-yellow-800 dark:text-yellow-200 cursor-pointer hover:opacity-90 transition"
                                >
                                    <span className="text-xs">📝</span>
                                    <span className="truncate italic">"{dayInfo.notes}"</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
