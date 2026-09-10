'use client';

import React, { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Award, CheckCircle2, Sparkles, X, HeartHandshake, Share2 } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { GoalItem } from '../lib/goalPaceCalculator';

interface GoalCelebrationModalProps {
    goal: GoalItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function GoalCelebrationModal({
    goal,
    isOpen,
    onClose
}: GoalCelebrationModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    useEffect(() => {
        if (!isOpen) return;
        // Simple canvas confetti trigger if available or playful vibration
        if (typeof window !== 'undefined' && (window as any).navigator?.vibrate) {
            (window as any).navigator.vibrate([100, 50, 100, 50, 200]);
        }
    }, [isOpen]);

    if (!isOpen || !goal) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-amber-200/60 dark:border-amber-500/30 overflow-hidden animate-in fade-in zoom-in-95 duration-300 p-6 sm:p-8 text-center space-y-6">
                    
                    {/* Top Glow & Badge */}
                    <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-400 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center relative animate-bounce">
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-4xl">
                            🏆
                        </div>
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
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
