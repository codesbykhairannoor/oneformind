'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Target, Calendar, Award, Star, Flame, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { GoalItem, calculateGoalProgress } from '../lib/goalPaceCalculator';

export interface GoalStatsData {
    avgProgress: number;
    activeCount: number;
    completedCount: number;
    totalCount: number;
    northStarGoal: GoalItem | null;
    urgentGoal: GoalItem | null;
    urgentDaysLeft: number | null;
    totalMilestones: number;
    completedMilestones: number;
    onTrackCount: number;
    atRiskCount: number;
    vitalCount: number;
}

export interface GoalStatsProps {
    stats?: GoalStatsData | any;
    goals?: GoalItem[];
}

export default function GoalStats({ stats }: GoalStatsProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const masterProgress = stats?.avgProgress ?? stats?.avg_progress ?? 0;
    const circumference = 2 * Math.PI * 34;
    const strokeDashoffset = circumference - (masterProgress / 100) * circumference;

    const northStar = stats?.northStarGoal;
    const northStarTitle = northStar?.title || stats?.top_goal_title || (isIndo ? 'Belum Ada Visi Utama' : 'No North Star Goal');
    const northStarProgress = northStar ? calculateGoalProgress(northStar) : (stats?.top_goal_progress || 0);

    const urgentGoal = stats?.urgentGoal;
    const urgentGoalTitle = urgentGoal?.title || stats?.urgent_goal_title || (isIndo ? 'Lautan Tenang' : 'Calm Seas');
    const urgentDaysLeft = typeof stats?.urgentDaysLeft === 'number' 
        ? stats.urgentDaysLeft 
        : (typeof stats?.urgent_goal_days_left === 'number' ? stats.urgent_goal_days_left : null);

    const onTrackCount = stats?.onTrackCount || 0;
    const atRiskCount = stats?.atRiskCount || 0;
    const vitalCount = stats?.vitalCount || 0;
    const totalCount = stats?.totalCount || stats?.active || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            
            {/* 1. Master Momentum Circular Gauge */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden relative">
                <div className="relative shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle className="text-slate-100 dark:text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="34" cx="48" cy="48" />
                        <circle 
                            className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-out" 
                            strokeWidth="8" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="34" 
                            cx="48" 
                            cy="48" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-500 font-mono">
                            {masterProgress}%
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col min-w-0">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
                        {isIndo ? 'Momentum Visi' : 'Vision Momentum'}
                    </p>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                        {isIndo ? 'Eksekusi Impian' : 'Mastering Vision'}
                    </h3>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                        {stats?.completedCount || 0} {isIndo ? 'Tercapai' : 'Achieved'} • {stats?.activeCount || 0} {isIndo ? 'Aktif' : 'Active'}
                    </span>
                </div>
                
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-700 pointer-events-none" />
            </div>

            {/* 2. Command Center 3-Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Card 1: North Star Target */}
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="text-amber-500 p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 shadow-sm group-hover:scale-110 transition-transform">
                            <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {isIndo ? 'Bintang Utama' : 'North Star'}
                        </span>
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                        <h4 className="text-sm font-black text-slate-800 dark:text-white line-clamp-1 pr-1" title={northStarTitle}>
                            {northStarTitle}
                        </h4>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>{isIndo ? 'Capaian' : 'Progress'}</span>
                                <span className="font-mono text-slate-700 dark:text-slate-300">{northStarProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${northStarProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Runway / Urgency */}
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="text-indigo-600 dark:text-indigo-400 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                            <Calendar className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {isIndo ? 'Tenggat Terdekat' : 'Nearest Runway'}
                        </span>
                    </div>
                    
                    <div className="relative z-10 space-y-1">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white line-clamp-1 opacity-80" title={urgentGoalTitle}>
                            {urgentGoalTitle}
                        </h4>
                        <p className={`text-xl font-black font-mono ${(urgentDaysLeft !== null && urgentDaysLeft <= 7) || (urgentDaysLeft !== null && urgentDaysLeft < 0) ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
                            {urgentDaysLeft === null 
                                ? (isIndo ? 'Santai (Tanpa Deadline)' : 'No Urgency') 
                                : (urgentDaysLeft < 0 
                                    ? (isIndo ? `Lewat ${Math.abs(urgentDaysLeft)} Hari` : `${Math.abs(urgentDaysLeft)}d Overdue`) 
                                    : (isIndo ? `Sisa ${urgentDaysLeft} Hari` : `${urgentDaysLeft} Days Left`))}
                        </p>
                    </div>
                </div>

                {/* Card 3: Velocity & On-Track Ratio */}
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="text-emerald-600 dark:text-emerald-400 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {isIndo ? 'Status Kecepatan' : 'Pace Health'}
                        </span>
                    </div>
                    
                    <div className="relative z-10 space-y-1">
                        <h4 className="text-2xl font-black font-mono text-slate-800 dark:text-white">
                            {onTrackCount} <span className="text-xs font-normal text-slate-400">/ {totalCount}</span>
                        </h4>
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span>🟢 {onTrackCount} {isIndo ? 'Lancar' : 'On Track'}</span>
                            {atRiskCount > 0 && (
                                <span className="text-amber-500 ml-1">
                                    • ⚠️ {atRiskCount} {isIndo ? 'Tertinggal' : 'Behind'}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
}

