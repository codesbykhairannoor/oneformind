'use client';

import React from 'react';
import {
    Check,
    GripVertical,
    Edit3,
    Trash2,
    BarChart2,
    Play,
    Coffee
} from 'lucide-react';
import { HabitItem, ProcessedHabitItem, MonthDateItem } from '../types';
import { getHabitDayInfo } from '../utils/habitMath';

interface HabitMatrixTableProps {
    filteredHabits: ProcessedHabitItem[];
    monthDates: MonthDateItem[];
    isIndo: boolean;
    t: any;
    onSelectHabitDetail: (habit: HabitItem) => void;
    onSelectHabitTimer: (habit: HabitItem) => void;
    onEditHabit: (habit: HabitItem) => void;
    onConfirmDelete: (habit: HabitItem) => void;
    onOpenNumericPopover: (data: { habitId: number; dateStr: string; currentVal: number; targetVal: number; unit: string }) => void;
    onOpenNoteModal: (data: { habit: HabitItem; dateStr: string; notes: string }) => void;
    onToggleStatus: (habitId: number, dateStr: string) => void;
}

export default function HabitMatrixTable({
    filteredHabits,
    monthDates,
    isIndo,
    t,
    onSelectHabitDetail,
    onSelectHabitTimer,
    onEditHabit,
    onConfirmDelete,
    onOpenNumericPopover,
    onOpenNoteModal,
    onToggleStatus
}: HabitMatrixTableProps) {
    return (
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
            <div className="overflow-x-auto custom-scrollbar select-none relative">
                
                {/* Sticky Table Header */}
                <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex shadow-xs">
                    
                    {/* Left Sticky Header */}
                    <div className="sticky left-0 z-40 bg-slate-50 dark:bg-slate-950 w-72 shrink-0 border-r border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between font-bold text-slate-400 text-xs shadow-md">
                        <span>{isIndo ? 'Nama Habit' : 'Habit Name'}</span>
                        <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            {filteredHabits.length} {isIndo ? 'Habit' : 'Habits'}
                        </span>
                    </div>

                    {/* Dates Columns */}
                    <div className="flex items-center px-4 py-3 gap-1.5">
                        {monthDates.map(day => (
                            <div key={day.dateString} className="w-8 shrink-0 flex flex-col items-center gap-0.5">
                                <span className="text-[9px] font-bold text-slate-400">{day.dayName}</span>
                                <span className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                                    day.isToday 
                                        ? 'bg-indigo-600 text-white shadow-xs' 
                                        : 'text-slate-600 dark:text-slate-300'
                                }`}>
                                    {day.dayNumber}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right Sticky Header */}
                    <div className="sticky right-0 z-40 bg-slate-50 dark:bg-slate-950 w-36 shrink-0 border-l border-slate-100 dark:border-slate-800 p-4 flex items-center justify-end font-bold text-slate-400 text-xs shadow-md">
                        <span>{isIndo ? 'Progres & Skor' : 'Progress & Score'}</span>
                    </div>
                </div>

                {/* Habit Rows */}
                <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filteredHabits.map(habit => (
                        <div key={habit.id} className="flex transition-colors duration-150 group relative hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            
                            {/* Left Sticky Info Column */}
                            <div className="sticky left-0 z-30 w-72 shrink-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 border-r border-slate-100 dark:border-slate-800 p-3.5 flex items-center gap-3 shadow-md">
                                <div className="cursor-grab text-slate-300 dark:text-slate-700 hover:text-indigo-500 opacity-30 group-hover:opacity-100 transition-opacity p-0.5">
                                    <GripVertical size={15} />
                                </div>

                                <div 
                                    onClick={() => onSelectHabitDetail(habit)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 cursor-pointer shadow-xs transition-transform hover:scale-105"
                                    style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                                >
                                    {habit.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <h4 
                                            onClick={() => onSelectHabitDetail(habit)}
                                            className="font-bold text-xs truncate text-slate-800 dark:text-slate-200 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                        >
                                            {habit.name}
                                        </h4>
                                        {habit.streak > 1 && (
                                            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-md text-[9px] font-black animate-pulse">
                                                {habit.streak}🔥
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400 mt-1">
                                        <span>🎯 {habit.monthlyTarget} {isIndo ? 'hari' : 'days'}</span>
                                        {habit.measurementType === 'numeric' && (
                                            <span>• {habit.targetValue}{habit.unit}</span>
                                        )}
                                        {habit.frequencyType === 'weekly_days' && (
                                            <span className="text-indigo-500 font-bold">• {habit.frequencyDays?.length}x/mgg</span>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Action Floating Hover Bubble */}
                                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-full absolute right-2 shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 z-50">
                                    {(habit.unit === 'min' || habit.unit === 'menit' || habit.name.toLowerCase().includes('meditasi') || habit.name.toLowerCase().includes('baca')) && (
                                        <button 
                                            type="button"
                                            onClick={() => onSelectHabitTimer(habit)} 
                                            className="p-1 text-slate-400 hover:text-indigo-600" 
                                            title={t('habits_timer_tooltip') || 'Timer'}
                                        >
                                            <Play size={12} fill="currentColor" />
                                        </button>
                                    )}
                                    <button 
                                        type="button"
                                        onClick={() => onSelectHabitDetail(habit)} 
                                        className="p-1 text-slate-400 hover:text-indigo-600" 
                                        title={t('habits_detail_tooltip') || 'Detail'}
                                    >
                                        <BarChart2 size={12} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => onEditHabit(habit)} 
                                        className="p-1 text-slate-400 hover:text-indigo-600" 
                                        title="Edit"
                                    >
                                        <Edit3 size={12} />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => onConfirmDelete(habit)} 
                                        className="p-1 text-slate-400 hover:text-rose-500" 
                                        title="Delete"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Date Grid Cells */}
                            <div className="flex items-center px-4 py-2.5 gap-1.5 pointer-events-auto">
                                {monthDates.map(day => {
                                    const info = getHabitDayInfo(habit, day);
                                    const isDone = info.status === 'completed';
                                    const isRelapse = info.status === 'relapse';
                                    const isRest = info.status === 'rest';
                                    const isSkipped = info.status === 'skipped';

                                    return (
                                        <div key={day.dateString} className="w-8 shrink-0 flex justify-center relative">
                                            
                                            {/* Quantitative Cell */}
                                            {habit.measurementType === 'numeric' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onOpenNumericPopover({
                                                        habitId: habit.id,
                                                        dateStr: day.dateString,
                                                        currentVal: info.value || 0,
                                                        targetVal: habit.targetValue || 10,
                                                        unit: habit.unit || ''
                                                    })}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        if (day.isFuture) return;
                                                        onOpenNoteModal({
                                                            habit,
                                                            dateStr: day.dateString,
                                                            notes: info.notes || ''
                                                        });
                                                    }}
                                                    disabled={day.isFuture}
                                                    className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 text-[9px] font-black ${
                                                        isDone
                                                            ? 'shadow-xs text-white'
                                                            : (info.value || 0) > 0
                                                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                                                            : isRest
                                                            ? 'bg-slate-100/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 hover:border-indigo-400 border border-transparent'
                                                            : day.isFuture
                                                            ? 'bg-slate-50 dark:bg-slate-950 opacity-30 cursor-not-allowed'
                                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-400'
                                                    }`}
                                                    style={isDone ? { backgroundColor: habit.color } : {}}
                                                >
                                                    {isRest && (info.value === undefined || info.value === 0) && !isDone ? (
                                                        <Coffee size={12} className="opacity-60" />
                                                    ) : (
                                                        <span>{info.value || 0}</span>
                                                    )}
                                                </button>
                                            ) : (
                                                /* Standard Boolean / Quit / Rest Cell */
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onToggleStatus(habit.id, day.dateString);
                                                    }}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        if (day.isFuture) return;
                                                        onOpenNoteModal({
                                                            habit,
                                                            dateStr: day.dateString,
                                                            notes: info.notes || ''
                                                        });
                                                    }}
                                                    disabled={day.isFuture}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${
                                                        isDone
                                                            ? 'shadow-xs text-white'
                                                            : isRelapse
                                                            ? 'bg-rose-500 text-white shadow-xs'
                                                            : isRest
                                                            ? 'bg-slate-100/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 hover:border-indigo-400 border border-transparent'
                                                            : isSkipped
                                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                                            : day.isFuture
                                                            ? 'bg-slate-50 dark:bg-slate-950 opacity-30 cursor-not-allowed'
                                                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                                                    } ${day.isToday && !isDone && !isRest ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}
                                                    style={isDone ? { backgroundColor: habit.color, boxShadow: `0 3px 10px ${habit.color}30` } : {}}
                                                >
                                                    {isDone && <Check size={13} strokeWidth={3.5} className="animate-in zoom-in duration-200" />}
                                                    {isRelapse && <span className="text-[10px] font-black">⚠️</span>}
                                                    {isRest && <Coffee size={12} className="opacity-60" />}
                                                    {isSkipped && <span className="text-xs font-black">-</span>}
                                                </button>
                                            )}

                                            {/* Micro-Note Dot Badge Indicator */}
                                            {info.hasNote && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpenNoteModal({ habit, dateStr: day.dateString, notes: info.notes || '' });
                                                    }}
                                                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 dark:bg-amber-300 rounded-full ring-2 ring-white dark:ring-slate-900"
                                                    title={info.notes}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right Sticky Progress Column */}
                            <div className="sticky right-0 z-30 w-36 shrink-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/60 border-l border-slate-100 dark:border-slate-800 p-3.5 flex flex-col justify-center shadow-md">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                                        {habit.progress_count}
                                        <span className="text-[10px] text-slate-400 font-medium">/{habit.monthlyTarget}</span>
                                    </span>
                                    <span className="text-[10px] font-black text-indigo-500">
                                        {habit.habit_strength || habit.progress_percent}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${habit.progress_percent}%`, backgroundColor: habit.color }}
                                    />
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
