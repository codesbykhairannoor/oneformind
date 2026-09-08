'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ProcessedHabitItem } from '../types';

const HabitTrendChart = dynamic(() => import('./HabitTrendChart'), { ssr: false });

interface HabitBottomMetricsProps {
    isIndo: boolean;
    overallPercentage: number;
    topHabit: ProcessedHabitItem | undefined;
    currentStreak: number;
    perfectDaysCount: number;
    totalCompletions: number;
}

export default function HabitBottomMetrics({
    isIndo,
    overallPercentage,
    topHabit,
    currentStreak,
    perfectDaysCount,
    totalCompletions
}: HabitBottomMetricsProps) {
    return (
        <div className="pb-16 w-full">
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
                    {topHabit && (
                        <>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block mb-2">
                                    🏆 {isIndo ? 'Habit Terbaik' : 'MVP Habit'}
                                </span>
                                <div className="text-3xl mb-1">{topHabit.icon}</div>
                                <div className="text-base font-black truncate">{topHabit.name}</div>
                            </div>
                            <div className="mt-4 flex justify-between items-baseline">
                                <span className="text-[10px] font-bold text-indigo-200">{isIndo ? 'Total Selesai' : 'Completed'}</span>
                                <span className="text-2xl font-black">{topHabit.progress_count}x</span>
                            </div>
                        </>
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
        </div>
    );
}
