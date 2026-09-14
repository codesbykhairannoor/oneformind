'use client';

import React from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { useLocale } from 'next-intl';
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
    const locale = useLocale();
    const isIndo = locale === 'id';

    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1.5">
                    <ListTodo size={14} className="text-indigo-500" />
                    <span>{isIndo ? 'Daftar Tahapan Langkah (Milestones / OKR)' : 'Milestone Steps & Checkpoints'}</span>
                </label>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/50 font-mono">
                    {form.milestones?.length || 0} {isIndo ? 'Langkah' : 'Steps'}
                </span>
            </div>

            <div className="space-y-2">
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
                                    title: isIndo ? 'Langkah Baru' : (t('goal_untitled_step') || 'Untitled Step'),
                                    is_completed: false,
                                    completed: false,
                                    target_date: null
                                }
                            ]
                        }));
                    }} 
                    className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all flex items-center justify-center gap-2 group/add shadow-sm"
                >
                    <Plus className="w-4 h-4 group-hover/add:rotate-90 transition-transform" />
                    <span className="text-xs font-black tracking-tight">{isIndo ? '+ Tambah Langkah Target' : (t('goal_btn_add_milestone') || '+ Add Step')}</span>
                </button>
            </div>
        </div>
    );
}
