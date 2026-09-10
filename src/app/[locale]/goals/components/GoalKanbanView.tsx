'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Plus, CheckCircle2, AlertTriangle, PlayCircle, 
    Sparkles, Edit3, Trash2, ArrowRight, Zap, Target
} from 'lucide-react';
import { GoalItem, calculateGoalProgress, calculateGoalPace } from '../lib/goalPaceCalculator';

interface GoalKanbanViewProps {
    goals: GoalItem[];
    onEdit: (goal: GoalItem) => void;
    onDelete: (id: number | string) => void;
    onQuickIncrement?: (goal: GoalItem, delta: number) => void;
    onCompleteGoal: (goal: GoalItem) => void;
    onMarkAsActive: (goal: GoalItem) => void;
    onAddClick: () => void;
}

export default function GoalKanbanView({
    goals,
    onEdit,
    onDelete,
    onQuickIncrement,
    onCompleteGoal,
    onMarkAsActive,
    onAddClick
}: GoalKanbanViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const columns = [
        {
            id: 'in_progress',
            title: isIndo ? 'Sedang Berjalan' : 'In Progress',
            icon: PlayCircle,
            color: 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5',
            filter: (g: GoalItem) => {
                if (g.status === 'completed') return false;
                const pace = calculateGoalPace(g);
                return pace.paceStatus === 'ahead' || pace.paceStatus === 'no_deadline';
            }
        },
        {
            id: 'on_track',
            title: isIndo ? 'Tepat Waktu' : 'On Track',
            icon: Sparkles,
            color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5',
            filter: (g: GoalItem) => {
                if (g.status === 'completed') return false;
                const pace = calculateGoalPace(g);
                return pace.paceStatus === 'on_track';
            }
        },
        {
            id: 'behind',
            title: isIndo ? 'Perlu Perhatian' : 'At Risk / Behind',
            icon: AlertTriangle,
            color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/5',
            filter: (g: GoalItem) => {
                if (g.status === 'completed') return false;
                const pace = calculateGoalPace(g);
                return pace.paceStatus === 'behind' || pace.paceStatus === 'overdue';
            }
        },
        {
            id: 'completed',
            title: isIndo ? 'Tercapai 🏆' : 'Achieved 🏆',
            icon: CheckCircle2,
            color: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/5',
            filter: (g: GoalItem) => g.status === 'completed' || calculateGoalProgress(g) >= 100
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
            {columns.map((col) => {
                const columnGoals = goals.filter(col.filter);
                const ColIcon = col.icon;

                return (
                    <div 
                        key={col.id} 
                        className={`rounded-3xl p-4 border ${col.color} bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col min-h-[500px] shadow-sm`}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <ColIcon size={16} />
                                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
                                    {col.title}
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {columnGoals.length}
                            </span>
                        </div>

                        {/* Column Items */}
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-0.5 custom-scrollbar">
                            {columnGoals.map((goal) => {
                                const progress = calculateGoalProgress(goal);
                                const pace = calculateGoalPace(goal);
                                const themeColor = goal.color || '#6366f1';

                                return (
                                    <div
                                        key={goal.id}
                                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 space-y-3 group"
                                    >
                                        {/* Header Title & Actions */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-0.5 flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {goal.is_north_star && (
                                                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                                                            ⭐ North Star
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                        {goal.category || 'Goal'}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                                                    {goal.title}
                                                </h4>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(goal)}
                                                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    title={isIndo ? 'Edit Target' : 'Edit Goal'}
                                                >
                                                    <Edit3 size={13} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(goal.id)}
                                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    title={isIndo ? 'Hapus Target' : 'Delete Goal'}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar & Value */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-[10px] font-bold">
                                                <span className="text-slate-400">
                                                    {goal.type === 'numeric' && goal.target_value ? (
                                                        `${goal.current_value || 0} / ${goal.target_value} ${goal.unit || ''}`
                                                    ) : goal.type === 'currency' && goal.target_value ? (
                                                        `${(goal.current_value || 0).toLocaleString()} / ${goal.target_value.toLocaleString()}`
                                                    ) : (
                                                        `${(goal.milestones || []).filter(m => m.is_completed || m.completed).length} / ${(goal.milestones || []).length} steps`
                                                    )}
                                                </span>
                                                <span className="font-mono font-black text-slate-700 dark:text-slate-200">
                                                    {progress}%
                                                </span>
                                            </div>

                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${progress}%`, backgroundColor: themeColor }}
                                                />
                                            </div>
                                        </div>

                                        {/* Quick Numeric / Currency Buttons */}
                                        {(goal.type === 'numeric' || goal.type === 'currency') && onQuickIncrement && goal.status !== 'completed' && (
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onQuickIncrement(goal, 1)}
                                                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[10px] font-black border border-slate-200/60 dark:border-slate-700 transition active:scale-95"
                                                >
                                                    +1
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onQuickIncrement(goal, 5)}
                                                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[10px] font-black border border-slate-200/60 dark:border-slate-700 transition active:scale-95"
                                                >
                                                    +5
                                                </button>
                                                {goal.type === 'currency' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onQuickIncrement(goal, 100000)}
                                                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-[10px] font-black border border-slate-200/60 dark:border-slate-700 transition active:scale-95"
                                                    >
                                                        +100k
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer Pace & Complete Button */}
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                                            <span className={`px-2 py-0.5 rounded-md font-bold border text-[9px] ${pace.paceColor}`}>
                                                {isIndo ? pace.paceLabel.id : pace.paceLabel.en}
                                            </span>

                                            {goal.status !== 'completed' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onCompleteGoal(goal)}
                                                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                                                >
                                                    <CheckCircle2 size={12} />
                                                    <span>{isIndo ? 'Selesai' : 'Done'}</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onMarkAsActive(goal)}
                                                    className="text-slate-400 hover:underline font-bold"
                                                >
                                                    {isIndo ? 'Re-aktifkan' : 'Reactivate'}
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                );
                            })}

                            {columnGoals.length === 0 && (
                                <div className="py-12 text-center text-[11px] font-bold text-slate-400 dark:text-slate-600">
                                    {isIndo ? 'Kosong di kolom ini' : 'No goals here'}
                                </div>
                            )}
                        </div>

                    </div>
                );
            })}
        </div>
    );
}
