'use client';

import React, { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Trash2, AlertTriangle, X, Loader2, Calendar, Target } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { GoalItem } from '../lib/goalPaceCalculator';

export interface GoalDeleteModalProps {
    isOpen: boolean;
    goal: GoalItem | null;
    isDeleting?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function GoalDeleteModal({
    isOpen,
    goal,
    isDeleting = false,
    onClose,
    onConfirm
}: GoalDeleteModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Keyboard support: ESC to close
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isDeleting) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isDeleting, onClose]);

    if (!isOpen || !goal) return null;

    const milestonesCount = goal.milestones?.length || 0;

    const getTimeHorizonLabel = (th?: string) => {
        switch (th) {
            case 'weekly': return isIndo ? '📅 Mingguan' : '📅 Weekly';
            case 'monthly': return isIndo ? '🗓️ Bulanan' : '🗓️ Monthly';
            case 'sprint': return isIndo ? '⚡ Sprint' : '⚡ Sprint';
            case 'quarterly': return isIndo ? '📊 Kuartal' : '📊 Quarterly';
            case 'lifetime': return isIndo ? '🌌 Visi' : '🌌 Vision';
            default: return isIndo ? '🎯 Tahunan' : '🎯 Yearly';
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 select-none">
                {/* Backdrop with Blur */}
                <div 
                    className="absolute inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
                    onClick={() => !isDeleting && onClose()}
                />

                {/* Modal Container */}
                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-7 shadow-2xl border border-rose-200/80 dark:border-rose-900/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 space-y-5 text-center">
                    
                    {/* Ambient Glow in Top Corner */}
                    <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition disabled:opacity-50"
                        aria-label={isIndo ? "Tutup" : "Close"}
                    >
                        <X size={15} />
                    </button>

                    {/* Warning Icon with Glow */}
                    <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-500/10">
                        <Trash2 className="w-8 h-8" />
                    </div>

                    {/* Header Badge & Title */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                            <AlertTriangle size={12} />
                            <span>{isIndo ? 'Konfirmasi Hapus Target' : 'Delete Goal Confirmation'}</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isIndo ? 'Hapus Target Ini?' : 'Delete This Goal?'}
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            {isIndo 
                                ? 'Target ini beserta semua milestone dan riwayat progresnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.' 
                                : 'This goal along with all milestone checkpoints and tracking history will be permanently deleted. This cannot be undone.'}
                        </p>
                    </div>

                    {/* Goal Card Preview */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-left space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                                {getTimeHorizonLabel(goal.time_horizon)}
                            </span>
                            {goal.end_date && (
                                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                    <Calendar size={11} />
                                    <span>{String(goal.end_date).split('T')[0]}</span>
                                </span>
                            )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2">
                            {goal.title}
                        </h4>

                        {milestonesCount > 0 && (
                            <p className="text-[11px] text-slate-400 font-medium">
                                📌 {milestonesCount} {isIndo ? 'checkpoint milestone akan ikut terhapus' : 'milestone checkpoints will be removed'}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition active:scale-95 disabled:opacity-50"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>{isIndo ? 'Menghapus...' : 'Deleting...'}</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} />
                                    <span>{isIndo ? 'Hapus Target' : 'Delete Goal'}</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
