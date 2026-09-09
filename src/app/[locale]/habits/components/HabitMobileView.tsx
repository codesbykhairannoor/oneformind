'use client';

import React from 'react';
import { Check, Plus, Play, Coffee } from 'lucide-react';
import { HabitItem, ProcessedHabitItem, MonthDateItem } from '../types';
import { getHabitDayInfo } from '../utils/habitMath';

interface HabitMobileViewProps {
    monthDates: MonthDateItem[];
    selectedMobileDate: string;
    setSelectedMobileDate: (d: string) => void;
    filteredHabits: ProcessedHabitItem[];
    numericViewMode: 'value' | 'percent';
    onSelectHabitDetail: (habit: HabitItem) => void;
    onSelectHabitTimer: (habit: HabitItem) => void;
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
}

export default function HabitMobileView({
    monthDates,
    selectedMobileDate,
    setSelectedMobileDate,
    filteredHabits,
    numericViewMode,
    onSelectHabitDetail,
    onSelectHabitTimer,
    onOpenNumericPopover,
    onToggleStatus
}: HabitMobileViewProps) {
    return (
        <div className="md:hidden space-y-4">
            
            {/* Date Strip */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
                {monthDates.map(day => (
                    <button
                        key={day.dateString}
                        type="button"
                        onClick={() => setSelectedMobileDate(day.dateString)}
                        className={`flex-shrink-0 w-12 py-2.5 rounded-2xl flex flex-col items-center gap-0.5 transition-all ${
                            selectedMobileDate === day.dateString
                                ? 'bg-indigo-600 text-white shadow-md scale-105'
                                : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'
                        }`}
                    >
                        <span className="text-[9px] font-bold opacity-80">{day.dayName}</span>
                        <span className="text-sm font-black">{day.dayNumber}</span>
                    </button>
                ))}
            </div>

            {/* Mobile Habit Cards */}
            <div className="space-y-3 px-4">
                {filteredHabits.map(habit => {
                    const selectedDayObj = monthDates.find(d => d.dateString === selectedMobileDate) || monthDates[0];
                    const dayInfo = getHabitDayInfo(habit, selectedDayObj);
                    const isDone = dayInfo.status === 'completed';
                    const isRelapse = dayInfo.status === 'relapse';
                    const isRest = dayInfo.status === 'rest';

                    return (
                        <div
                            key={habit.id}
                            className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all"
                        >
                            {/* Icon */}
                            <div
                                onClick={() => onSelectHabitDetail(habit)}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 cursor-pointer"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                            >
                                {habit.icon}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0" onClick={() => onSelectHabitDetail(habit)}>
                                <div className="flex items-center justify-between gap-1">
                                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                                        {habit.name}
                                    </h4>
                                    {habit.streak > 1 && (
                                        <span className="text-[9px] font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                            {habit.streak} 🔥
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2 mt-2">
                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${habit.progress_percent}%`, backgroundColor: habit.color }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500">
                                        {habit.progress_count}/{habit.monthlyTarget}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex items-center gap-1 shrink-0">
                                {/* Timer Trigger */}
                                {(habit.unit === 'min' || habit.unit === 'menit' || habit.name.toLowerCase().includes('meditasi') || habit.name.toLowerCase().includes('baca')) && (
                                    <button
                                        type="button"
                                        onClick={() => onSelectHabitTimer(habit)}
                                        className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
                                    >
                                        <Play size={14} fill="currentColor" />
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
                                            className={`px-3.5 h-11 rounded-2xl font-black text-xs flex items-center gap-1 transition-all ${
                                                isDone
                                                    ? 'bg-emerald-500 text-white shadow-md'
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
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                                            isDone
                                                ? 'shadow-md text-white'
                                                : isRelapse
                                                ? 'bg-rose-500 text-white'
                                                : isRest
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-400'
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
                    );
                })}
            </div>
        </div>
    );
}
