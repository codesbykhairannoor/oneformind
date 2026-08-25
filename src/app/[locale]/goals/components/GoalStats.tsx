'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Target, Calendar, Award } from 'lucide-react';

export interface GoalStatsProps {
    stats?: {
        avg_progress?: number;
        top_goal_title?: string;
        top_goal_progress?: number;
        urgent_goal_title?: string;
        urgent_goal_days_left?: number | null;
        milestones_completed?: number;
        milestones_total?: number;
    };
    goals?: any[];
}

export default function GoalStats({ stats }: GoalStatsProps) {
    const t = useTranslations();

    const masterProgress = stats?.avg_progress || 0;
    const circumference = 2 * Math.PI * 34;
    const strokeDashoffset = circumference - (masterProgress / 100) * circumference;

    const topGoalTitle = stats?.top_goal_title || 'No Active Vision';
    const topGoalProgress = stats?.top_goal_progress || 0;
    const urgentGoalTitle = stats?.urgent_goal_title;
    const urgentDaysLeft = typeof stats?.urgent_goal_days_left === 'number' ? stats.urgent_goal_days_left : null;
    const milestonesCompleted = stats?.milestones_completed || 0;
    const milestonesTotal = stats?.milestones_total || 0;

    return (
        // 1:1 from GoalStats.vue line 52-132
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            {/* Master Stats: Circular Vision Momentum */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden relative">
                <div className="relative shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle className="text-slate-100 dark:text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="34" cx="48" cy="48" />
                        <circle 
                            className="text-indigo-600 transition-all duration-1000 ease-out" 
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
                        <span className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-500">{masterProgress}%</span>
                    </div>
                </div>
                
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">
                        {t('goal_stats_momentum') || 'Vision Momentum'}
                    </p>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight transition-colors duration-500">
                        Mastering<br/>Your Vision
                    </h3>
                </div>
                
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
            </div>

            {/* Command Center Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: North Star */}
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="text-indigo-600 dark:text-indigo-400 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <Target className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            {t('goal_stats_north_star') || 'North Star'}
                        </span>
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                        <h4 className="text-sm font-black text-slate-800 dark:text-white line-clamp-1 pr-2">
                            {topGoalTitle}
                        </h4>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${topGoalProgress}%` }}></div>
                        </div>
                    </div>
                    <div className="absolute -right-2 -top-2 w-12 h-12 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>

                {/* Card 2: Runway */}
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="text-amber-600 dark:text-amber-400 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <Calendar className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            {t('goal_stats_runway') || 'Runway'}
                        </span>
                    </div>
                    
                    <div className="relative z-10 space-y-1">
                        <h4 className="text-xs font-black text-slate-800 dark:text-white line-clamp-1 opacity-80">
                            {urgentGoalTitle || (t('goal_stats_calm') || 'Calm Seas')}
                        </h4>
                        <p className={`text-xl font-black ${(urgentDaysLeft !== null && urgentDaysLeft <= 3) || (urgentDaysLeft !== null && urgentDaysLeft < 0) ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
                            {urgentDaysLeft === null 
                                ? (t('goal_stats_calm') || 'No Urgency') 
                                : (urgentDaysLeft < 0 
                                    ? `${Math.abs(urgentDaysLeft)} days overdue` 
                                    : `${urgentDaysLeft} days left`)}
                        </p>
                    </div>
                    <div className="absolute -right-2 -top-2 w-12 h-12 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>

                {/* Card 3: Mastery */}
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group overflow-hidden relative">
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="text-emerald-600 dark:text-emerald-400 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <Award className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                            {t('goal_stats_mastery') || 'Mastery'}
                        </span>
                    </div>
                    
                    <div className="relative z-10">
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
                            {milestonesCompleted} / {milestonesTotal}
                        </h4>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">
                            Steps Navigated
                        </p>
                    </div>
                    <div className="absolute -right-2 -top-2 w-12 h-12 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
            </div>
        </div>
    );
}
