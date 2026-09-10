'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Calendar, Clock, Sparkles, CheckCircle2, ChevronRight, Target } from 'lucide-react';
import { GoalItem, calculateGoalProgress, calculateGoalPace } from '../lib/goalPaceCalculator';

interface GoalTimelineViewProps {
    goals: GoalItem[];
    onEdit: (goal: GoalItem) => void;
}

export default function GoalTimelineView({
    goals,
    onEdit
}: GoalTimelineViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const months = isIndo 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentYear = new Date().getFullYear();

    // Helper to calculate left % and width % on a 12-month calendar grid
    const calculateBarPosition = (startStr?: string | null, endStr?: string | null) => {
        const start = startStr ? new Date(startStr) : new Date(currentYear, 0, 1);
        const end = endStr ? new Date(endStr) : new Date(currentYear, 11, 31);

        const yearStart = new Date(currentYear, 0, 1).getTime();
        const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59).getTime();
        const totalYearMs = yearEnd - yearStart;

        const startMs = Math.max(yearStart, start.getTime());
        const endMs = Math.min(yearEnd, end.getTime());

        const leftPercent = Math.max(0, Math.min(100, ((startMs - yearStart) / totalYearMs) * 100));
        const widthPercent = Math.max(4, Math.min(100 - leftPercent, ((endMs - startMs) / totalYearMs) * 100));

        return { leftPercent, widthPercent };
    };

    const formatDateShort = (dStr?: string | null) => {
        if (!dStr) return '-';
        try {
            return new Date(dStr).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' });
        } catch {
            return dStr;
        }
    };

    return (
        <div className="p-5 sm:p-7 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <span>{isIndo ? `Roadmap Target ${currentYear}` : `${currentYear} Goals Roadmap`}</span>
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {isIndo 
                            ? 'Visualisasi rentang waktu eksekusi dari tanggal mulai hingga tenggat akhir.' 
                            : 'Chronological timeline spans from launch date to target deadline.'}
                    </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> {isIndo ? 'Tepat Waktu' : 'On Track'}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> {isIndo ? 'Perlu Akselerasi' : 'Behind Pace'}
                    </span>
                </div>
            </div>

            {/* Timeline Table / Gantt Container */}
            <div className="overflow-x-auto custom-scrollbar pb-2">
                <div className="min-w-[850px] space-y-4">
                    
                    {/* Month Columns Header */}
                    <div className="grid grid-cols-12 gap-1 pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
                        {months.map((m, idx) => {
                            const isCurrentMonth = new Date().getMonth() === idx;
                            return (
                                <div 
                                    key={m} 
                                    className={`text-[11px] font-black uppercase py-1 rounded-lg ${
                                        isCurrentMonth 
                                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                                            : 'text-slate-400'
                                    }`}
                                >
                                    {m}
                                </div>
                            );
                        })}
                    </div>

                    {/* Goal Rows */}
                    <div className="space-y-3 pt-2">
                        {goals.map((goal) => {
                            const progress = calculateGoalProgress(goal);
                            const pace = calculateGoalPace(goal);
                            const { leftPercent, widthPercent } = calculateBarPosition(goal.start_date, goal.end_date);
                            const themeColor = goal.color || '#6366f1';

                            return (
                                <div 
                                    key={goal.id} 
                                    onClick={() => onEdit(goal)}
                                    className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer space-y-2 group"
                                >
                                    {/* Row Info */}
                                    <div className="flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {goal.is_north_star && <span>⭐</span>}
                                            <h4 className="font-black text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                {goal.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                                                ({formatDateShort(goal.start_date)} - {formatDateShort(goal.end_date)})
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${pace.paceColor}`}>
                                                {isIndo ? pace.paceLabel.id : pace.paceLabel.en}
                                            </span>
                                            <span className="font-mono font-black text-slate-700 dark:text-slate-200">
                                                {progress}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timeline Horizontal Bar */}
                                    <div className="relative h-4 w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-lg overflow-hidden">
                                        
                                        {/* Goal Duration Span */}
                                        <div 
                                            className="absolute top-0 bottom-0 rounded-lg opacity-30"
                                            style={{ 
                                                left: `${leftPercent}%`, 
                                                width: `${widthPercent}%`,
                                                backgroundColor: themeColor
                                            }}
                                        />

                                        {/* Goal Progress Filled Span */}
                                        <div 
                                            className="absolute top-0 bottom-0 rounded-lg shadow-sm transition-all duration-500 flex items-center justify-end pr-1 text-[9px] font-black text-white"
                                            style={{ 
                                                left: `${leftPercent}%`, 
                                                width: `${(widthPercent * progress) / 100}%`,
                                                backgroundColor: themeColor
                                            }}
                                        >
                                            {progress >= 20 && `${progress}%`}
                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                        {goals.length === 0 && (
                            <div className="py-12 text-center text-xs font-bold text-slate-400">
                                {isIndo ? 'Belum ada target untuk ditampilkan di roadmap.' : 'No goals available to display on roadmap.'}
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}
