'use client';

import React from 'react';
import { CheckCircle2, Flame, Droplets, Inbox, TrendingUp, CalendarCheck2 } from 'lucide-react';

interface PlannerDashboardStatsProps {
    totalTasks: number;
    completedTasks: number;
    activeDaysCount: number;
    daysInMonthCount: number;
    totalWater: number;
    totalInboxItems: number;
    locale?: string;
}

export default function PlannerDashboardStats({
    totalTasks,
    completedTasks,
    activeDaysCount,
    daysInMonthCount,
    totalWater,
    totalInboxItems,
    locale = 'id'
}: PlannerDashboardStatsProps) {
    const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const consistencyPercent = daysInMonthCount > 0 ? Math.round((activeDaysCount / daysInMonthCount) * 100) : 0;
    const avgWaterPerDay = activeDaysCount > 0 ? (totalWater / activeDaysCount).toFixed(1) : '0';

    const isIndo = locale === 'id';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            
            {/* Card 1: Monthly Completion Rate */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Penyelesaian Tugas' : 'Completion Rate'}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={20} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {completionPercent}%
                    </span>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">
                        ({completedTasks}/{totalTasks} {isIndo ? 'selesai' : 'done'})
                    </span>
                </div>
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
            </div>

            {/* Card 2: Productive Days Consistency */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-amber-500/5 hover:border-amber-300 dark:hover:border-amber-700/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Hari Aktif' : 'Active Days'}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Flame size={20} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {activeDaysCount} <span className="text-lg font-bold text-slate-400">{isIndo ? 'Hari' : 'Days'}</span>
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {consistencyPercent}% {isIndo ? 'konsisten' : 'consistent'}
                    </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <CalendarCheck2 size={13} className="text-amber-500" />
                    <span>{isIndo ? `Dari ${daysInMonthCount} hari bulan ini` : `Out of ${daysInMonthCount} days this month`}</span>
                </div>
            </div>

            {/* Card 3: Monthly Water Hydration Log */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-cyan-500/5 hover:border-cyan-300 dark:hover:border-cyan-700/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Total Hidrasi Air' : 'Water Hydration'}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Droplets size={20} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {totalWater} <span className="text-lg font-bold text-slate-400">{isIndo ? 'Gelas' : 'Glasses'}</span>
                    </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>{isIndo ? 'Rata-rata Harian' : 'Daily Average'}</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{avgWaterPerDay} {isIndo ? 'gelas/hari' : 'gl/day'}</span>
                </div>
            </div>

            {/* Card 4: Inbox & Ideas Captured */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-orange-500/5 hover:border-orange-300 dark:hover:border-orange-700/50 transition-all group">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Kotak Masuk (Inbox)' : 'Inbox & Ideas'}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Inbox size={20} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {totalInboxItems} <span className="text-lg font-bold text-slate-400">{isIndo ? 'Catatan' : 'Notes'}</span>
                    </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <TrendingUp size={13} className="text-orange-500" />
                    <span>{isIndo ? 'Ide & tangkapan liar terdaftar' : 'Ideas captured in inbox'}</span>
                </div>
            </div>

        </div>
    );
}
