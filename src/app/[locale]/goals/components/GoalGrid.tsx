'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import GoalCard, { GoalItem } from './GoalCard';
import { Milestone } from './MilestoneItem';

interface GoalGridProps {
    goals: GoalItem[];
    onEdit?: (goal: GoalItem) => void;
    onDelete?: (id: number | string) => void;
    onToggleMilestone?: (goal: GoalItem, m: Milestone) => void;
    onAddMilestone?: (goal: GoalItem) => void;
    onSaveMilestone?: (goal: GoalItem, data: Milestone) => void;
    onDeleteMilestone?: (goal: GoalItem, mId: number | string | null | undefined) => void;
    onCompleteGoal?: (goal: GoalItem) => void;
    onMarkAsActive?: (goal: GoalItem) => void;
}

export default function GoalGrid({
    goals, onEdit, onDelete, onToggleMilestone,
    onAddMilestone, onSaveMilestone, onDeleteMilestone,
    onCompleteGoal, onMarkAsActive
}: GoalGridProps) {
    const t = useTranslations();

    return (
        // 1:1 from GoalGrid.vue line 16-37
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {goals.map((goal) => (
                <GoalCard 
                    key={goal._key || goal.id}
                    goal={goal}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleMilestone={onToggleMilestone}
                    onAddMilestone={onAddMilestone}
                    onSaveMilestone={onSaveMilestone}
                    onDeleteMilestone={onDeleteMilestone}
                    onCompleteGoal={onCompleteGoal}
                    onMarkAsActive={onMarkAsActive}
                />
            ))}

            {/* Empty State in Grid */}
            {goals.length === 0 && (
                <div className="col-span-full py-20 bg-white/50 dark:bg-slate-900/50 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="text-6xl">🚀</div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white">
                            {t('goal_empty_title') || 'Belum ada target!'}
                        </h3>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                            {t('goal_empty_desc') || 'Mulai buat proyek perubahan lu sekarang.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
