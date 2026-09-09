'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ProcessedHabitItem } from '../types';
import { Sparkles, Sun, Sunset, Moon, Shuffle, ShieldCheck, Flame, Trophy } from 'lucide-react';

const HabitTrendChart = dynamic(() => import('./HabitTrendChart'), { ssr: false });

interface HabitBottomMetricsProps {
    isIndo: boolean;
    overallPercentage: number;
    topHabit: ProcessedHabitItem | undefined;
    currentStreak: number;
    perfectDaysCount: number;
    totalCompletions: number;
    processedHabits?: ProcessedHabitItem[];
}

export default function HabitBottomMetrics({
    isIndo,
    overallPercentage,
    topHabit,
    currentStreak,
    perfectDaysCount,
    totalCompletions,
    processedHabits = []
}: HabitBottomMetricsProps) {
    // Routine breakdown calculations
    const morningHabits = processedHabits.filter(h => h.timeOfDay === 'morning');
    const afternoonHabits = processedHabits.filter(h => h.timeOfDay === 'afternoon');
    const eveningHabits = processedHabits.filter(h => h.timeOfDay === 'evening');
    const anytimeHabits = processedHabits.filter(h => !h.timeOfDay || h.timeOfDay === 'anytime');

    const getAvgPct = (items: ProcessedHabitItem[]) => {
        if (items.length === 0) return 0;
        return Math.round(items.reduce((acc, h) => acc + (h.progress_percent || 0), 0) / items.length);
    };

    // Strength tier calculations
    const strongCount = processedHabits.filter(h => (h.habit_strength || 0) >= 70).length;
    const formingCount = processedHabits.filter(h => (h.habit_strength || 0) >= 30 && (h.habit_strength || 0) < 70).length;
    const startingCount = processedHabits.filter(h => (h.habit_strength || 0) < 30).length;

    return (
        <div className="pb-16 w-full space-y-4">
            {/* TOP 3 HERO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0 md:max-w-[96%] mx-auto">
                
                {/* Consistency Score Card */}
                <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                            {isIndo ? 'Konsistensi Bulan Ini' : 'Monthly Consistency'}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{overallPercentage}</span>
                            <span className="text-base font-black text-indigo-500">%</span>
                        </div>
                    </div>
                    <div className="h-16 mt-4">
                        <HabitTrendChart overallPercentage={overallPercentage} />
                    </div>
                </div>

                {/* MVP Habit Card */}
                <div className="md:col-span-4 bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                    {topHabit ? (
                        <>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block mb-2">
                                    🏆 {isIndo ? 'Habit Terbaik Bulan Ini' : 'MVP Habit'}
                                </span>
                                <div className="text-3xl mb-1">{topHabit.icon}</div>
                                <div className="text-base font-black truncate">{topHabit.name}</div>
                            </div>
                            <div className="mt-4 flex justify-between items-baseline">
                                <span className="text-[10px] font-bold text-indigo-200">{isIndo ? 'Total Selesai' : 'Completed'}</span>
                                <span className="text-2xl font-black">{topHabit.progress_count}x</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center h-full">
                            <span className="text-xs font-bold text-indigo-200">{isIndo ? 'Mulai ceklis habit Anda untuk melihat MVP Habit!' : 'Check off habits to reveal MVP!'}</span>
                        </div>
                    )}
                </div>

                {/* 3 Mini Stat Cards (Streak, Perfect Days, Total Logs) */}
                <div className="md:col-span-4 grid grid-cols-3 gap-3">
                    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-3xl p-4 flex flex-col justify-between">
                        <span className="text-xl">🔥</span>
                        <div>
                            <div className="text-[9px] font-black text-orange-500 uppercase">{isIndo ? 'Streak' : 'Streak'}</div>
                            <div className="text-xl font-black text-orange-600 dark:text-orange-400">{currentStreak}d</div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-4 flex flex-col justify-between">
                        <span className="text-xl">🌟</span>
                        <div>
                            <div className="text-[9px] font-black text-emerald-500 uppercase">{isIndo ? 'Perfect' : 'Perfect'}</div>
                            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{perfectDaysCount}d</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl p-4 flex flex-col justify-between">
                        <span className="text-xl">📝</span>
                        <div>
                            <div className="text-[9px] font-black text-blue-500 uppercase">{isIndo ? 'Total' : 'Logs'}</div>
                            <div className="text-xl font-black text-blue-600 dark:text-blue-400">{totalCompletions}x</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ROUTINE INSIGHTS & HABIT STRENGTH RADAR */}
            {processedHabits.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0 md:max-w-[96%] mx-auto">
                    
                    {/* Routine Completion Rates */}
                    <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {isIndo ? 'Performa Berdasarkan Waktu Rutinitas' : 'Routine Performance Breakdown'}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-500">
                                {processedHabits.length} {isIndo ? 'Total Habit Aktif' : 'Active Habits'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-amber-50/60 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-3.5 rounded-2xl flex flex-col justify-between">
                                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                                    <span className="text-[11px] font-black">🌅 {isIndo ? 'Pagi' : 'Morning'}</span>
                                    <span className="text-[10px] font-bold">{morningHabits.length}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-lg font-black text-amber-700 dark:text-amber-300">{getAvgPct(morningHabits)}%</span>
                                    <div className="w-full bg-amber-200/50 dark:bg-amber-900/40 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${getAvgPct(morningHabits)}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50/60 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 p-3.5 rounded-2xl flex flex-col justify-between">
                                <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 mb-2">
                                    <span className="text-[11px] font-black">☀️ {isIndo ? 'Siang' : 'Afternoon'}</span>
                                    <span className="text-[10px] font-bold">{afternoonHabits.length}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-lg font-black text-orange-700 dark:text-orange-300">{getAvgPct(afternoonHabits)}%</span>
                                    <div className="w-full bg-orange-200/50 dark:bg-orange-900/40 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${getAvgPct(afternoonHabits)}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-3.5 rounded-2xl flex flex-col justify-between">
                                <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
                                    <span className="text-[11px] font-black">🌙 {isIndo ? 'Malam' : 'Evening'}</span>
                                    <span className="text-[10px] font-bold">{eveningHabits.length}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">{getAvgPct(eveningHabits)}%</span>
                                    <div className="w-full bg-indigo-200/50 dark:bg-indigo-900/40 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${getAvgPct(eveningHabits)}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-2">
                                    <span className="text-[11px] font-black">🔄 {isIndo ? 'Fleksibel' : 'Anytime'}</span>
                                    <span className="text-[10px] font-bold">{anytimeHabits.length}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-lg font-black text-slate-700 dark:text-slate-200">{getAvgPct(anytimeHabits)}%</span>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-slate-500 h-full rounded-full" style={{ width: `${getAvgPct(anytimeHabits)}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Habit Formation Pipeline */}
                    <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {isIndo ? 'Status Pembentukan Saraf' : 'Neural Habit Pipeline'}
                            </span>
                            <Sparkles size={14} className="text-indigo-500" />
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    {isIndo ? 'Mendarah Daging (≥70%)' : 'Established (≥70%)'}
                                </span>
                                <span className="font-black text-slate-800 dark:text-slate-200">{strongCount}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    {isIndo ? 'Sedang Terbentuk (30-69%)' : 'Forming (30-69%)'}
                                </span>
                                <span className="font-black text-slate-800 dark:text-slate-200">{formingCount}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    {isIndo ? 'Tahap Awal (<30%)' : 'Starting (<30%)'}
                                </span>
                                <span className="font-black text-slate-800 dark:text-slate-200">{startingCount}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-medium">
                            💡 {isIndo ? 'Konsistensi harian mempercepat habit mencapai tahap otomatis.' : 'Daily repetition accelerates habit automaticity.'}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
