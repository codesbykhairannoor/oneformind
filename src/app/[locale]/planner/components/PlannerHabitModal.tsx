'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, CheckCircle2, Circle, CalendarX2, Trash2, ExternalLink, Flame, Clock } from 'lucide-react';
import { ScheduledHabitItem } from '../types';
import { Link } from '@/i18n/routing';

interface PlannerHabitModalProps {
    isOpen: boolean;
    habit: ScheduledHabitItem | null;
    selectedDate: string;
    isIndo: boolean;
    locale: string;
    onClose: () => void;
    onToggleCompleted: (habitId: number) => void;
    onUnlinkFromPlanner: (habitId: number) => Promise<void>;
    onDeletePermanently: (habitId: number) => Promise<void>;
}

export default function PlannerHabitModal({
    isOpen,
    habit,
    selectedDate,
    isIndo,
    locale,
    onClose,
    onToggleCompleted,
    onUnlinkFromPlanner,
    onDeletePermanently
}: PlannerHabitModalProps) {
    const [isUnlinking, setIsUnlinking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !habit) return null;

    const handleUnlink = async () => {
        const confirmMsg = isIndo
            ? `Hapus "${habit.name}" dari jadwal Planner?\n(Kebiasaan ini tetap aktif di modul Habits, hanya dihapus dari timeline Planner)`
            : `Remove "${habit.name}" from Planner timeline?\n(This habit will remain active in Habits, only unlinked from Planner)`;
        
        if (!window.confirm(confirmMsg)) return;

        try {
            setIsUnlinking(true);
            await onUnlinkFromPlanner(habit.id);
            onClose();
        } catch (err) {
            console.error('Failed to unlink habit:', err);
        } finally {
            setIsUnlinking(false);
        }
    };

    const handleDelete = async () => {
        const confirmMsg = isIndo
            ? `PERINGATAN: Hapus kebiasaan "${habit.name}" secara permanen?\nData kebiasaan dan riwayatnya akan dihapus sepenuhnya dari database.`
            : `WARNING: Permanently delete habit "${habit.name}"?\nAll habit logs and data will be completely deleted from the database.`;
        
        if (!window.confirm(confirmMsg)) return;

        try {
            setIsDeleting(true);
            await onDeletePermanently(habit.id);
            onClose();
        } catch (err) {
            console.error('Failed to delete habit permanently:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                <div 
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                                {habit.icon || '🌱'}
                            </span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-snug">
                                        {habit.name}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50">
                                        HABIT
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {isIndo ? 'Rutinitas dari Modul Kebiasaan' : 'Routine from Habit Tracker'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4 overflow-y-auto">
                        {/* Info Badges */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                                <Clock size={18} className="text-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {isIndo ? 'Waktu Terjadwal' : 'Scheduled Time'}
                                    </p>
                                    <p className="font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                                        {habit.startTime} - {habit.endTime}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                                <Flame size={18} className="text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {isIndo ? 'Konsistensi' : 'Streak'}
                                    </p>
                                    <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                                        {habit.streak} {isIndo ? 'Hari' : 'Days'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Completion Toggle Card */}
                        <button
                            type="button"
                            onClick={() => onToggleCompleted(habit.id)}
                            className={`w-full p-4 rounded-2xl border transition text-left flex items-center justify-between gap-3 ${
                                habit.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {habit.completed ? (
                                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle size={24} className="text-slate-400 shrink-0" />
                                )}
                                <div>
                                    <p className="font-bold text-sm">
                                        {habit.completed
                                            ? (isIndo ? 'Sudah Dikerjakan Hari Ini' : 'Completed Today')
                                            : (isIndo ? 'Belum Dikerjakan' : 'Not Completed Yet')}
                                    </p>
                                    <p className="text-[11px] opacity-75">
                                        {isIndo ? 'Klik untuk mengubah status checklist' : 'Click to toggle checklist status'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-current shadow-xs">
                                {habit.completed ? (isIndo ? 'Selesai' : 'Done') : (isIndo ? 'Tandai' : 'Mark')}
                            </span>
                        </button>

                        {/* Notes if present */}
                        {habit.notes && (
                            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
                                <span className="font-bold">{isIndo ? 'Catatan: ' : 'Note: '}</span>
                                {habit.notes}
                            </div>
                        )}

                        {/* Action List Section */}
                        <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                            {/* Action 1: Remove from Planner Timeline */}
                            <button
                                type="button"
                                disabled={isUnlinking || isDeleting}
                                onClick={handleUnlink}
                                className="w-full p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200/80 dark:border-slate-700/60 hover:border-amber-300 dark:hover:border-amber-700/60 text-slate-800 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-300 transition text-left flex items-start gap-3 disabled:opacity-50"
                            >
                                <CalendarX2 size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-xs sm:text-sm leading-snug">
                                        {isUnlinking 
                                            ? (isIndo ? 'Menghapus dari Planner...' : 'Removing from Planner...') 
                                            : (isIndo ? 'Hapus dari Jadwal Planner' : 'Remove from Planner Timeline')}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                        {isIndo
                                            ? 'Hapus tampilan kebiasaan ini dari timeline Planner. Kebiasaan tetap tersimpan di modul Habits.'
                                            : 'Remove this habit from the Planner timeline. It remains active in Habit Tracker.'}
                                    </p>
                                </div>
                            </button>

                            {/* Action 2: Delete Habit Permanently */}
                            <button
                                type="button"
                                disabled={isUnlinking || isDeleting}
                                onClick={handleDelete}
                                className="w-full p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-100/80 dark:hover:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 transition text-left flex items-start gap-3 disabled:opacity-50"
                            >
                                <Trash2 size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-xs sm:text-sm leading-snug">
                                        {isDeleting
                                            ? (isIndo ? 'Menghapus permanen...' : 'Deleting permanently...')
                                            : (isIndo ? 'Hapus Habit Permanen' : 'Delete Habit Permanently')}
                                    </p>
                                    <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5 leading-normal">
                                        {isIndo
                                            ? 'Hapus habit sepenuhnya dari database (hilang dari Planner dan Habit Tracker).'
                                            : 'Completely delete this habit and all history from the database.'}
                                    </p>
                                </div>
                            </button>

                            {/* Action 3: Open in Habit Tracker */}
                            <Link
                                href={`/${locale}/habits`}
                                onClick={onClose}
                                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center justify-between text-xs font-bold"
                            >
                                <div className="flex items-center gap-2">
                                    <ExternalLink size={15} className="text-slate-400" />
                                    <span>{isIndo ? 'Buka di Modul Habit Tracker' : 'Open in Habit Tracker'}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                        >
                            {isIndo ? 'Tutup' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
