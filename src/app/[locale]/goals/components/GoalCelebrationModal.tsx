'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Award, CheckCircle2, Sparkles, X, HeartHandshake, Share2, GraduationCap, RefreshCw, Flame, ArrowRight, Check } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { GoalItem, LinkedHabitEngine } from '../lib/goalPaceCalculator';

interface GoalCelebrationModalProps {
    goal: GoalItem | null;
    isOpen: boolean;
    onClose: () => void;
    allGoals?: GoalItem[];
    onGraduateHabit?: (habitId: number | string) => Promise<void>;
    onRelinkHabit?: (habitId: number | string, newGoalId: number | string) => Promise<void>;
    onPromoteHabit?: (habitId: number | string) => Promise<void>;
}

export default function GoalCelebrationModal({
    goal,
    isOpen,
    onClose,
    allGoals = [],
    onGraduateHabit,
    onRelinkHabit,
    onPromoteHabit
}: GoalCelebrationModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [resolutions, setResolutions] = useState<Record<string, 'graduated' | 'relinked' | 'promoted'>>({});
    const [selectedRelinkGoalId, setSelectedRelinkGoalId] = useState<Record<string, string>>({});
    const [loadingHabitId, setLoadingHabitId] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setResolutions({});
        setSelectedRelinkGoalId({});
        // Simple canvas confetti trigger if available or playful vibration
        if (typeof window !== 'undefined' && (window as any).navigator?.vibrate) {
            (window as any).navigator.vibrate([100, 50, 100, 50, 200]);
        }
    }, [isOpen, goal]);

    if (!isOpen || !goal) return null;

    const linkedHabits: LinkedHabitEngine[] = goal.linked_habits || [];
    const otherActiveGoals = allGoals.filter(g => String(g.id) !== String(goal.id) && g.status !== 'completed');

    const handleGraduate = async (habitId: number | string) => {
        const key = String(habitId);
        setLoadingHabitId(key);
        try {
            if (onGraduateHabit) await onGraduateHabit(habitId);
            setResolutions(prev => ({ ...prev, [key]: 'graduated' }));
        } finally {
            setLoadingHabitId(null);
        }
    };

    const handlePromote = async (habitId: number | string) => {
        const key = String(habitId);
        setLoadingHabitId(key);
        try {
            if (onPromoteHabit) await onPromoteHabit(habitId);
            setResolutions(prev => ({ ...prev, [key]: 'promoted' }));
        } finally {
            setLoadingHabitId(null);
        }
    };

    const handleRelink = async (habitId: number | string, targetGoalId: string) => {
        if (!targetGoalId) return;
        const key = String(habitId);
        setLoadingHabitId(key);
        try {
            if (onRelinkHabit) await onRelinkHabit(habitId, targetGoalId);
            setResolutions(prev => ({ ...prev, [key]: 'relinked' }));
        } finally {
            setLoadingHabitId(null);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-amber-200/60 dark:border-amber-500/30 p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    
                    {/* Top Glow & Badge */}
                    <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-400 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center relative animate-bounce">
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-4xl">
                            🏆
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                            <Sparkles size={12} />
                            <span>{isIndo ? 'Misi Berhasil Dituntaskan!' : 'Mission Accomplished!'}</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {goal.title}
                        </h2>

                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                            {isIndo 
                                ? 'Selamat! Anda telah membuktikan konsistensi dan disiplin diri yang luar biasa untuk mewujudkan target ini.' 
                                : 'Congratulations! You proved extraordinary discipline and grit to turn this vision into reality.'}
                        </p>
                    </div>

                    {/* Claimed Reward Box */}
                    {goal.reward && (
                        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-left space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                <Award size={14} className="text-amber-500" />
                                <span>{isIndo ? 'Waktunya Hadiah Kemenangan:' : 'Victory Self-Reward Unlocked:'}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">
                                "{goal.reward}"
                            </p>
                        </div>
                    )}

                    {/* Core Why Reminder */}
                    {goal.core_why && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-left text-xs font-medium text-slate-600 dark:text-slate-300 italic">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 not-italic block text-[10px] uppercase tracking-wider mb-0.5">
                                {isIndo ? 'Alasan Mengapa Target Ini Berhasil:' : 'Why You Did This:'}
                            </span>
                            "{goal.core_why}"
                        </div>
                    )}

                    {/* LINKED HABITS RESOLUTION SECTION (Graduation, Re-link, Lifestyle) */}
                    {linkedHabits.length > 0 && (
                        <div className="pt-2 text-left space-y-3 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <GraduationCap size={16} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                                        {isIndo ? 'Siklus Kebiasaan Terkait (Habit Graduation):' : 'Linked Habits Resolution:'}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    {linkedHabits.length} {isIndo ? 'Kebiasaan' : 'Habits'}
                                </span>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                                {isIndo
                                    ? 'Target ini selesai! Tentukan kelanjutan habit di bawah agar checklist harian Anda tetap bersih dan streak kemenangan tidak hilang.'
                                    : 'Goal reached! Choose how to resolve linked habits to keep your daily checklist clean and preserve streak victory.'}
                            </p>

                            <div className="space-y-3">
                                {linkedHabits.map((habit) => {
                                    const key = String(habit.id);
                                    const currentResolution = resolutions[key];
                                    const isLoading = loadingHabitId === key;

                                    return (
                                        <div 
                                            key={habit.id}
                                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-lg shrink-0">{habit.icon || '🌱'}</span>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                                                            {habit.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-0.5">
                                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                                <Flame size={11} />
                                                                {habit.streak || 0}d streak
                                                            </span>
                                                            <span>•</span>
                                                            <span>{habit.consistencyPercent || 0}% konsistensi</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Resolved Badge */}
                                                {currentResolution && (
                                                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                                        currentResolution === 'graduated'
                                                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                                            : currentResolution === 'promoted'
                                                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                                            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                                    }`}>
                                                        <Check size={11} strokeWidth={3} />
                                                        {currentResolution === 'graduated'
                                                            ? (isIndo ? 'Lulus ke Hall of Fame' : 'Graduated')
                                                            : currentResolution === 'promoted'
                                                            ? (isIndo ? 'Lifestyle Habit' : 'Lifestyle')
                                                            : (isIndo ? 'Dialihkan ke Target Baru' : 'Re-linked')}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons if not yet resolved */}
                                            {!currentResolution && (
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                                                    {/* 1. Graduate */}
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => handleGraduate(habit.id)}
                                                        className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                                                    >
                                                        <GraduationCap size={13} />
                                                        <span>{isIndo ? 'Luluskan (Pensiun)' : 'Graduate'}</span>
                                                    </button>

                                                    {/* 2. Promote to Lifestyle */}
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => handlePromote(habit.id)}
                                                        className="py-2 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
                                                    >
                                                        <Sparkles size={13} />
                                                        <span>{isIndo ? 'Jadikan Gaya Hidup' : 'Lifestyle'}</span>
                                                    </button>

                                                    {/* 3. Re-link to another goal */}
                                                    {otherActiveGoals.length > 0 ? (
                                                        <select
                                                            disabled={isLoading}
                                                            value={selectedRelinkGoalId[key] || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val) {
                                                                    setSelectedRelinkGoalId(prev => ({ ...prev, [key]: val }));
                                                                    handleRelink(habit.id, val);
                                                                }
                                                            }}
                                                            className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-black outline-none shadow-2xs cursor-pointer"
                                                        >
                                                            <option value="">{isIndo ? '🔄 Alihkan Target...' : '🔄 Re-link Goal...'}</option>
                                                            {otherActiveGoals.map(ag => (
                                                                <option key={ag.id} value={String(ag.id)}>
                                                                    {ag.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() => handleGraduate(habit.id)}
                                                            className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold"
                                                        >
                                                            {isIndo ? 'Selesai' : 'Complete'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/25 active:scale-95 transition-all"
                        >
                            {isIndo ? 'Simpan Kemenangan & Lanjutkan' : 'Claim Victory & Continue'}
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
