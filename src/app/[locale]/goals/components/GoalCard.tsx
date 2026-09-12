'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { useLocale } from 'next-intl';
import { 
    Target, Calendar, Award, Trash2, Edit3, 
    ChevronRight, Zap, CheckCircle2, Sparkles, Star,
    Heart, DollarSign, Briefcase, GraduationCap, Users, 
    Plane, Palette, Dumbbell, Music, Code, Camera, BookOpen, 
    Gamepad2, ShieldAlert, Compass, Plus, Minus
} from 'lucide-react';
import MilestoneItem, { Milestone } from './MilestoneItem';
import { 
    GoalItem, 
    calculateGoalProgress, 
    calculateGoalPace 
} from '../lib/goalPaceCalculator';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export type { GoalItem };

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
    onToggleNorthStar?: (goal: GoalItem) => void;
    onQuickIncrement?: (goal: GoalItem, delta: number) => void;
    isExplorer?: boolean;
    onOpenPreview?: () => void;
}

export default function GoalCard({
    goal,
    onEdit,
    onDelete,
    onToggleMilestone,
    onAddMilestone,
    onSaveMilestone,
    onDeleteMilestone,
    onCompleteGoal,
    onMarkAsActive,
    onToggleNorthStar,
    onQuickIncrement,
    isExplorer,
    onOpenPreview
}: GoalCardProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [showDetails, setShowDetails] = useState(false);

    const progress = calculateGoalProgress(goal);
    const pace = calculateGoalPace(goal);
    const milestones = goal.milestones || [];
    const themeColor = goal.color || '#6366f1';

    const formatDateDisplay = (dateStr?: string | null) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                day: 'numeric',
                month: 'short'
            });
        } catch {
            return dateStr;
        }
    };

    const formatCurrency = (val?: number, currency = 'IDR') => {
        const num = Number(val) || 0;
        if (currency === 'IDR') {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
    };

    const getPriorityLabel = () => {
        const p = goal.priority || 'important';
        switch (p) {
            case 'vital': return { text: 'Vital 🔥', class: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' };
            case 'optional': return { text: 'Optional', class: 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700' };
            default: return { text: isIndo ? 'Penting' : 'Important', class: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20' };
        }
    };

    const getTimeHorizonLabel = (th?: string) => {
        switch (th) {
            case 'sprint': return isIndo ? '⚡ Sprint' : '⚡ Sprint';
            case 'quarterly': return isIndo ? '📊 Kuartal' : '📊 Quarterly';
            case 'lifetime': return isIndo ? '🌌 Seumur Hidup' : '🌌 Lifetime';
            default: return isIndo ? '🎯 Tahunan' : '🎯 Yearly';
        }
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

    const priorityLabel = getPriorityLabel();
    const IconComp = getCategoryIcon(goal.category);
    const isSavingOrTemp = goal.is_saving || String(goal.id).startsWith('temp_');

    const meshGradientStyle: React.CSSProperties = {
        background: `radial-gradient(at 0% 0%, ${themeColor}33 0px, transparent 50%),
                    radial-gradient(at 100% 0%, ${themeColor}66 0px, transparent 50%),
                    radial-gradient(at 100% 100%, ${themeColor}33 0px, transparent 50%),
                    radial-gradient(at 0% 100%, ${themeColor}1a 0px, transparent 50%),
                    ${themeColor}05`
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col overflow-hidden h-full">
            
            {/* Vision Banner / Header */}
            <div className="relative h-36 md:h-44 shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
                {goal.cover_image_url ? (
                    <>
                        <img src={goal.cover_image_url} alt={goal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    </>
                ) : (
                    <div style={meshGradientStyle} className="w-full h-full flex items-center justify-center transition-transform duration-700 relative group-hover:scale-105">
                        <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/10 flex items-center justify-center text-white shadow-xl">
                            <IconComp className="w-8 h-8 stroke-[2.5]" style={{ color: themeColor }} />
                        </div>
                    </div>
                )}

                {/* North Star Toggle Star in Top Left */}
                <div className="absolute top-4 left-4 z-20">
                    <button
                        type="button"
                        onClick={() => onToggleNorthStar?.(goal)}
                        className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                            goal.is_north_star 
                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-105' 
                                : 'bg-black/30 text-white/70 border-white/20 hover:text-amber-300 hover:bg-black/50'
                        }`}
                        title={goal.is_north_star ? (isIndo ? 'Visi Utama (North Star)' : 'North Star Goal') : (isIndo ? 'Jadikan Visi Utama' : 'Set as North Star')}
                    >
                        <Star className={`w-3.5 h-3.5 ${goal.is_north_star ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Edit & Delete Actions in Top Right */}
                <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                    <button 
                        type="button"
                        onClick={() => !isSavingOrTemp && onEdit?.(goal)} 
                        className={`w-8 h-8 rounded-full border text-white flex items-center justify-center transition-all shadow-md ${
                            isSavingOrTemp 
                                ? 'bg-white/10 cursor-not-allowed opacity-50' 
                                : 'bg-black/40 border-white/20 hover:bg-white hover:text-indigo-600'
                        }`}
                        title={isIndo ? "Edit Target" : "Edit Goal"}
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        type="button"
                        onClick={() => !isSavingOrTemp && onDelete?.(goal.id)} 
                        className={`w-8 h-8 rounded-full border text-white flex items-center justify-center transition-all shadow-md ${
                            isSavingOrTemp 
                                ? 'bg-white/10 cursor-not-allowed opacity-50' 
                                : 'bg-black/40 border-white/20 hover:bg-rose-500 hover:text-white'
                        }`}
                        title={isIndo ? "Hapus Target" : "Delete Goal"}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Header Content Overlay */}
                <div className="absolute inset-x-5 bottom-3 flex flex-col z-10">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${
                            goal.cover_image_url ? 'bg-white/10 text-white border-white/20' : priorityLabel.class
                        }`}>
                            {priorityLabel.text}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/30 text-white border border-white/10">
                            {getTimeHorizonLabel(goal.time_horizon)}
                        </span>

                        {goal.end_date && (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/30 text-white border border-white/10 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {formatDateDisplay(goal.end_date)}
                            </span>
                        )}
                    </div>

                    <h3 className={`text-lg sm:text-xl font-black truncate drop-shadow-sm transition-colors ${
                        goal.cover_image_url ? 'text-white' : 'text-slate-800 dark:text-white'
                    }`}>
                        {goal.title}
                    </h3>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                
                {/* 1. Progress Header & Mark Done */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                            {isIndo ? 'Tingkat Capaian' : 'Manifestation'}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-black font-mono text-slate-800 dark:text-white">
                                {progress}%
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${pace.paceColor}`}>
                                {isIndo ? pace.paceLabel.id : pace.paceLabel.en}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {goal.status !== 'completed' ? (
                            <button 
                                type="button"
                                onClick={() => !isSavingOrTemp && onCompleteGoal?.(goal)}
                                disabled={isSavingOrTemp}
                                className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                                <span>{isIndo ? 'Selesai' : 'Complete'}</span>
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={() => !isSavingOrTemp && onMarkAsActive?.(goal)}
                                disabled={isSavingOrTemp}
                                className="px-3 py-1.5 rounded-xl border border-slate-500/20 bg-slate-100 dark:bg-slate-800 hover:bg-slate-500 hover:text-white text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                                <Zap className="w-3 h-3 stroke-[3]" />
                                <span>{isIndo ? 'Aktifkan' : 'Active'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. Progress Bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                        style={{ width: `${progress}%`, backgroundColor: themeColor }}
                    />
                </div>

                {/* 3. Run-Rate Notice (Pace Velocity Guidance) */}
                {pace.runRateNotice && goal.status !== 'completed' && (
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-snug">
                        💡 {isIndo ? pace.runRateNotice.id : pace.runRateNotice.en}
                    </p>
                )}

                {/* 3b. Habit Engine Velocity & Leading Measures */}
                {pace.habitEngineNotice && goal.status !== 'completed' && (
                    <div className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-start gap-2 ${
                        pace.habitEngineNotice.type === 'boost'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                            : pace.habitEngineNotice.type === 'warning'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                            : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                    }`}>
                        <span className="text-sm shrink-0">
                            {pace.habitEngineNotice.type === 'boost' ? '🚀' : pace.habitEngineNotice.type === 'warning' ? '⚠️' : '⚡'}
                        </span>
                        <div className="flex-1">
                            <span className="font-black block text-[10px] uppercase tracking-wider mb-0.5 opacity-80">
                                {isIndo ? 'Mesin Penggerak Kebiasaan' : 'Habit Velocity Engine'}
                            </span>
                            <span className="leading-tight">
                                {isIndo ? pace.habitEngineNotice.id : pace.habitEngineNotice.en}
                            </span>
                        </div>
                    </div>
                )}

                {/* Linked Habit Chips */}
                {goal.linked_habits && goal.linked_habits.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {isIndo ? 'Rutinitas:' : 'Engine:'}
                        </span>
                        {goal.linked_habits.map(h => (
                            <span 
                                key={h.id}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                            >
                                <span>{h.icon}</span>
                                <span>{h.name}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{h.consistencyPercent}%</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* 4. DYNAMIC TARGET TYPES */}
                
                {/* A. Numeric Target Type */}
                {goal.type === 'numeric' && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-400">
                                {isIndo ? 'Kemajuan Angka' : 'Metric Progress'}:
                            </span>
                            <span className="font-black font-mono text-slate-800 dark:text-slate-100 text-sm">
                                {goal.current_value || 0} / {goal.target_value || 0} {goal.unit || ''}
                            </span>
                        </div>

                        {onQuickIncrement && goal.status !== 'completed' && (
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => onQuickIncrement(goal, -1)}
                                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition active:scale-95 text-xs font-bold"
                                    title="-1"
                                >
                                    <Minus size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onQuickIncrement(goal, 1)}
                                    className="flex-1 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition active:scale-95 text-xs font-black flex items-center justify-center gap-1"
                                >
                                    <Plus size={13} />
                                    <span>+1 {goal.unit || ''}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onQuickIncrement(goal, 5)}
                                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition active:scale-95 text-xs font-black"
                                >
                                    +5
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* B. Currency Target Type */}
                {goal.type === 'currency' && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-400">
                                {isIndo ? 'Terkumpul' : 'Saved / Raised'}:
                            </span>
                            <span className="font-black font-mono text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                                {formatCurrency(goal.current_value, goal.currency)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>{isIndo ? 'Target Akhir' : 'Target Goal'}:</span>
                            <span>{formatCurrency(goal.target_value, goal.currency)}</span>
                        </div>

                        {onQuickIncrement && goal.status !== 'completed' && (
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => onQuickIncrement(goal, 100000)}
                                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition active:scale-95 text-[11px] font-black"
                                >
                                    +100k
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onQuickIncrement(goal, 500000)}
                                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition active:scale-95 text-[11px] font-black"
                                >
                                    +500k
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onQuickIncrement(goal, 1000000)}
                                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition active:scale-95 text-[11px] font-black"
                                >
                                    +1 Juta
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* C. Milestones Target Type (Checklist OKR) */}
                {(goal.type === 'milestones' || !goal.type) && (
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {isIndo ? 'Langkah Pencapaian' : 'Mastery Steps'}
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
                                {isIndo ? '+ Tambah Langkah' : '+ New Step'}
                            </button>
                        </div>

                        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
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
                                <div className="py-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center">
                                    <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                        {isIndo ? 'Belum ada langkah terdaftar' : 'No active steps'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 5. PSYCHOLOGICAL "THE WHY" & WOOP ACCORDION */}
                {(goal.core_why || goal.obstacle || goal.reward) && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <button
                            type="button"
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        >
                            <span className="flex items-center gap-1">
                                <Compass size={12} className="text-indigo-500" />
                                {isIndo ? 'Motivasi & Rencana WOOP' : 'Core Why & WOOP Plan'}
                            </span>
                            <ChevronRight size={12} className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                        </button>

                        {showDetails && (
                            <div className="space-y-2 p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-700 dark:text-slate-300 animate-in fade-in duration-200">
                                {goal.core_why && (
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 block">
                                            {isIndo ? 'Alasan Utama (The Why):' : 'Core Motivation:'}
                                        </span>
                                        <p className="italic font-medium text-[11px]">"{goal.core_why}"</p>
                                    </div>
                                )}

                                {goal.obstacle && (
                                    <div className="pt-1 border-t border-indigo-100/60 dark:border-indigo-900/30">
                                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                            <ShieldAlert size={10} />
                                            {isIndo ? 'Hambatan & Antisipasi:' : 'Obstacle & Plan:'}
                                        </span>
                                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                            {goal.obstacle}
                                            {goal.obstacle_plan && (
                                                <span className="block text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                                                    ➔ {goal.obstacle_plan}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 6. Footer Victory Reward */}
                {goal.reward && (
                    <div className="pt-2 flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-200/50 text-amber-500">
                            <Award className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate italic">
                            "{goal.reward}"
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}
