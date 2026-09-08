'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import MilestoneItem, { Milestone } from './MilestoneItem';
import { GoalItem } from './GoalCard';

interface GoalMilestonesSectionProps {
    form: GoalItem;
    setForm: React.Dispatch<React.SetStateAction<GoalItem>>;
    t: any;
}

export default function GoalMilestonesSection({
    form,
    setForm,
    t
}: GoalMilestonesSectionProps) {
    return (
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
            <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-600 tracking-tight">
                    {t('goal_milestones_title') || 'Mastery steps'}
                </label>
                <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                    {form.milestones?.length || 0} Steps
                </span>
            </div>

            <div className="space-y-3">
                {form.milestones?.map((m, idx) => (
                    <MilestoneItem 
                        key={m.id || idx} 
                        milestone={m}
                        onSave={(data) => {
                            setForm(prev => {
                                const updated = [...(prev.milestones || [])];
                                updated[idx] = { ...updated[idx], ...data };
                                return { ...prev, milestones: updated };
                            });
                        }}
                        onUpdateTitle={(newTitle) => {
                            setForm(prev => {
                                const updated = [...(prev.milestones || [])];
                                updated[idx] = { ...updated[idx], title: newTitle };
                                return { ...prev, milestones: updated };
                            });
                        }}
                        onToggle={() => {
                            setForm(prev => {
                                const updated = [...(prev.milestones || [])];
                                const nextVal = !updated[idx].is_completed;
                                updated[idx] = { ...updated[idx], is_completed: nextVal, completed: nextVal };
                                return { ...prev, milestones: updated };
                            });
                        }}
                        onDelete={() => {
                            setForm(prev => ({
                                ...prev,
                                milestones: (prev.milestones || []).filter((_, i) => i !== idx)
                            }));
                        }}
                    />
                ))}
                
                <button 
                    type="button" 
                    onClick={() => {
                        setForm(prev => ({
                            ...prev,
                            milestones: [
                                ...(prev.milestones || []),
                                {
                                    id: null,
                                    title: t('goal_untitled_step') || 'Untitled Step',
                                    is_completed: false,
                                    completed: false,
                                    target_date: null
                                }
                            ]
                        }));
                    }} 
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 group/add shadow-sm"
                >
                    <Plus className="w-4 h-4 group-hover/add:rotate-90 transition-transform" />
                    <span className="text-[11px] font-black tracking-tight">{t('goal_btn_add_milestone') || 'Add Step'}</span>
                </button>
            </div>
        </div>
    );
}
