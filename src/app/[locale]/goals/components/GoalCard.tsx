'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
    Target, Calendar, Award, Trash2, Edit3, 
    ChevronRight, Zap, CheckCircle2, Sparkles,
    Heart, DollarSign, Briefcase, GraduationCap, Users, Plane, Palette, Dumbbell, Music, Code, Camera, BookOpen, Gamepad2
} from 'lucide-react';
import MilestoneItem, { Milestone } from './MilestoneItem';

export interface GoalItem {
    id: number | string;
    _key?: string;
    title: string;
    color?: string;
    type?: string;
    status?: 'active' | 'completed' | string;
    priority?: 'vital' | 'important' | 'optional' | string;
    reward?: string;
    start_date?: string | null;
    end_date?: string | null;
    cover_image_url?: string;
    category?: string;
    milestones?: Milestone[];
    is_saving?: boolean;
}

interface GoalCardProps {
    goal: GoalItem;
    onEdit?: (goal: GoalItem) => void;
    onDelete?: (id: number | string) => void;
    onToggleMilestone?: (goal: GoalItem, m: Milestone) => void;
    onAddMilestone?: (goal: GoalItem) => void;
    onSaveMilestone?: (goal: GoalItem, data: Milestone) => void;
    onDeleteMilestone?: (goal: GoalItem, mId: number | string | null | undefined) => void;
    onCompleteGoal?: (goal: GoalItem) => void;
    onMarkAsActive?: (goal: GoalItem) => void;
    isExplorer?: boolean;
    onOpenPreview?: () => void;
}

export default function GoalCard({
    goal, onEdit, onDelete, onToggleMilestone,
    onAddMilestone, onSaveMilestone, onDeleteMilestone,
    onCompleteGoal, onMarkAsActive, isExplorer, onOpenPreview
}: GoalCardProps) {
    const t = useTranslations();

    const milestones = goal.milestones || [];
    const completedCount = milestones.filter(m => m.is_completed || m.completed).length;
    const progress = milestones.length === 0 ? 0 : Math.round((completedCount / milestones.length) * 100);

    const formatDateDisplay = (dateStr?: string | null) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short'
            });
        } catch {
            return dateStr;
        }
    };

    const getPriorityLabel = () => {
        const p = goal.priority || 'important';
        switch (p) {
            case 'vital': return { text: 'Vital', class: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' };
            case 'optional': return { text: 'Optional', class: 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700' };
            default: return { text: 'Important', class: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' };
        }
    };

    const priorityLabel = getPriorityLabel();
    const themeColor = goal.color || '#6366f1';

    const meshGradientStyle: React.CSSProperties = {
        background: `radial-gradient(at 0% 0%, ${themeColor}33 0px, transparent 50%),
                    radial-gradient(at 100% 0%, ${themeColor}66 0px, transparent 50%),
                    radial-gradient(at 100% 100%, ${themeColor}33 0px, transparent 50%),
                    radial-gradient(at 0% 100%, ${themeColor}1a 0px, transparent 50%),
                    ${themeColor}05`
    };

    const getCategoryIcon = (cat?: string) => {
        switch (cat) {
            case 'fitness': return Dumbbell;
            case 'wealth': return DollarSign;
            case 'career': return Briefcase;
            case 'learning': return GraduationCap;
            case 'spiritual': return Sparkles;
            case 'social': return Users;
            case 'travel': return Plane;
            case 'creative': return Palette;
            case 'health': return Heart;
            case 'coding': return Code;
            case 'music': return Music;
            case 'reading': return BookOpen;
            case 'photography': return Camera;
            case 'gaming': return Gamepad2;
            default: return Target;
        }
    };

    const IconComp = getCategoryIcon(goal.category);
    const isSavingOrTemp = goal.is_saving || String(goal.id).startsWith('temp_');

    return (
        // 1:1 from GoalCard.vue line 104-247
        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col overflow-hidden h-full">
            
            {/* Vision Banner / Header */}
            <div className="relative h-32 md:h-44 shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
                {goal.cover_image_url ? (
                    <>
                        <img src={goal.cover_image_url} alt={goal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </>
                ) : (
                    <div style={meshGradientStyle} className="w-full h-full flex items-center justify-center transition-transform duration-700 relative group-hover:scale-105">
                        <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                        <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 flex items-center justify-center text-white shadow-xl">
                            <IconComp className="w-8 h-8 stroke-[2.5]" style={{ color: themeColor }} />
                        </div>
                    </div>
                )}

                {/* Header Content Overlay */}
                <div className="absolute inset-x-5 bottom-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${
                            goal.cover_image_url ? 'bg-white/10 text-white border-white/20' : priorityLabel.class
                        }`}>
                            {priorityLabel.text}
                        </span>
                        {goal.end_date && (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/20 text-white border border-white/10 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {formatDateDisplay(goal.end_date)}
                            </span>
                        )}
                    </div>
                    <h3 className={`text-xl font-black truncate drop-shadow-sm transition-colors duration-500 ${
                        goal.cover_image_url ? 'text-white' : 'text-slate-800 dark:text-white'
                    }`}>
                        {goal.title}
                    </h3>
                </div>

                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button 
                        type="button"
                        onClick={() => !isSavingOrTemp && onEdit?.(goal)} 
                        className={`w-8 h-8 rounded-full border text-white flex items-center justify-center transition-all shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-90 md:group-hover:scale-100 delay-75 ${
                            isSavingOrTemp 
                                ? 'bg-white/10 dark:bg-black/20 border-white/10 cursor-not-allowed opacity-50' 
                                : 'bg-white/20 dark:bg-black/40 border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-indigo-600 hover:text-indigo-600 dark:hover:text-white'
                        }`}
                        title="Edit Goal"
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        type="button"
                        onClick={() => !isSavingOrTemp && onDelete?.(goal.id)} 
                        className={`w-8 h-8 rounded-full border text-white flex items-center justify-center transition-all shadow-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-90 md:group-hover:scale-100 delay-150 ${
                            isSavingOrTemp 
                                ? 'bg-white/10 dark:bg-black/20 border-white/10 cursor-not-allowed opacity-50' 
                                : 'bg-white/20 dark:bg-black/40 border-white/30 dark:border-white/20 hover:bg-rose-500 hover:text-white'
                        }`}
                        title="Hapus Goal"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Progress Body */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">
                            {t('goal_manifestation') || 'Manifestation'}
                        </span>
                        <span className="text-xs font-black text-slate-800 dark:text-white tabular-nums">
                            {progress}% Completed
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {goal.status !== 'completed' ? (
                            <button 
                                type="button"
                                onClick={() => !isSavingOrTemp && onCompleteGoal?.(goal)}
                                disabled={isSavingOrTemp}
                                className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                                <span className="hidden sm:inline">{t('goal_mark_done') || 'Mark as Done'}</span>
                                <span className="sm:hidden">{t('goal_done') || 'Done'}</span>
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={() => !isSavingOrTemp && onMarkAsActive?.(goal)}
                                disabled={isSavingOrTemp}
                                className="px-3 py-1.5 rounded-xl border border-slate-500/20 bg-slate-50 dark:bg-slate-500/10 hover:bg-slate-500 hover:text-white text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                                <Zap className="w-3 h-3 stroke-[3]" />
                                <span className="hidden sm:inline">{t('goal_mark_active') || 'Mark as Active'}</span>
                                <span className="sm:hidden">{t('goal_status_active') || 'Active'}</span>
                            </button>
                        )}

                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center relative">
                            <Zap className={`w-3.5 h-3.5 ${progress === 100 ? 'text-amber-400 animate-pulse' : 'text-slate-300 dark:text-slate-600'}`} />
                            {goal.is_saving && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 border border-white dark:border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden p-0.5">
                    <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                        style={{ width: `${progress}%`, backgroundColor: themeColor }}
                    ></div>
                </div>

                {/* Milestones Section */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.1em]">
                            {t('goal_mastery_steps') || 'Mastery Steps'}
                        </h4>
                        <button 
                            type="button"
                            onClick={() => !isSavingOrTemp && onAddMilestone?.(goal)} 
                            disabled={isSavingOrTemp}
                            className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                                isSavingOrTemp 
                                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                                    : 'text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
                            }`}
                        >
                            {t('goal_new_step') || '+ New Step'}
                        </button>
                    </div>

                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {milestones.map((m, idx) => (
                            <MilestoneItem 
                                key={m._key || m.id || idx} 
                                milestone={m}
                                onToggle={() => onToggleMilestone?.(goal, m)}
                                onSave={(data) => onSaveMilestone?.(goal, data)}
                                onDelete={() => onDeleteMilestone?.(goal, m.id)}
                            />
                        ))}
                        
                        {milestones.length === 0 && (
                            <div className="py-10 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-[2rem] flex flex-col items-center">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                    {t('goal_no_steps') || 'No active steps'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer: Reward */}
                {goal.reward && (
                    <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-100/50 dark:border-amber-500/20">
                            <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[8px] font-black text-amber-500/80 dark:text-amber-400 uppercase tracking-widest">
                                {t('goal_victory_reward') || 'Victory Reward'}
                            </span>
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate italic">
                                "{goal.reward}"
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
