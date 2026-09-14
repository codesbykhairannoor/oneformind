'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, BookOpen, ExternalLink, Calendar, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { ScheduledStudyItem } from '../types';
import { Link } from '@/i18n/routing';

interface PlannerStudyModalProps {
    isOpen: boolean;
    assignment: ScheduledStudyItem | null;
    isIndo: boolean;
    locale: string;
    onClose: () => void;
    onToggleAssignmentCompleted?: (assignmentId: string) => Promise<void>;
}

export default function PlannerStudyModal({
    isOpen,
    assignment,
    isIndo,
    locale,
    onClose,
    onToggleAssignmentCompleted
}: PlannerStudyModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen || !assignment) return null;

    const handleToggleComplete = async () => {
        if (!onToggleAssignmentCompleted) return;
        try {
            setIsUpdating(true);
            await onToggleAssignmentCompleted(assignment.id);
            onClose();
        } catch (err) {
            console.error('Failed to toggle study assignment:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const getPriorityBadge = (p: string) => {
        switch (p) {
            case 'urgent':
                return { text: isIndo ? 'Mendesak' : 'Urgent', style: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-300 dark:border-rose-800' };
            case 'medium':
                return { text: isIndo ? 'Sedang' : 'Medium', style: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-300 dark:border-amber-800' };
            default:
                return { text: isIndo ? 'Biasa' : 'Normal', style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' };
        }
    };

    const pBadge = getPriorityBadge(assignment.priority);

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                <div 
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/20">
                        <div className="flex items-center gap-3">
                            <span className="text-xl p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
                                <BookOpen size={22} />
                            </span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-snug">
                                        {assignment.title}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-300/50 dark:border-purple-700/50">
                                        STUDY
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {assignment.courseName} • <span className="uppercase">{assignment.type}</span>
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
                        {/* Deadline & Priority Info Badges */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                                <Calendar size={18} className="text-purple-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {isIndo ? 'Deadline Tugas' : 'Due Date'}
                                    </p>
                                    <p className="font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                                        {assignment.dueDate}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {isIndo ? 'Tingkat Prioritas' : 'Priority'}
                                    </p>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${pBadge.style}`}>
                                        {pBadge.text}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Completed Card */}
                        <button
                            type="button"
                            disabled={isUpdating}
                            onClick={handleToggleComplete}
                            className={`w-full p-4 rounded-2xl border transition text-left flex items-center justify-between gap-3 ${
                                assignment.completed
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-400'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {assignment.completed ? (
                                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle size={24} className="text-slate-400 shrink-0" />
                                )}
                                <div>
                                    <p className="font-bold text-sm">
                                        {assignment.completed
                                            ? (isIndo ? 'Tugas Selesai Dikerjakan' : 'Assignment Completed')
                                            : (isIndo ? 'Belum Selesai' : 'Pending Submission')}
                                    </p>
                                    <p className="text-[11px] opacity-75">
                                        {isIndo ? 'Klik untuk update status ke tab Study' : 'Click to sync status to Study module'}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-current shadow-xs">
                                {assignment.completed ? (isIndo ? 'Selesai' : 'Done') : (isIndo ? 'Tandai' : 'Mark')}
                            </span>
                        </button>

                        {/* Description / Notes if available */}
                        {assignment.description && (
                            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-xs leading-relaxed text-purple-900 dark:text-purple-300">
                                <span className="font-bold">{isIndo ? 'Instruksi / Catatan: ' : 'Instructions: '}</span>
                                {assignment.description}
                            </div>
                        )}

                        {/* Link to Study module */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                href={`/${locale}/study`}
                                onClick={onClose}
                                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center justify-between text-xs font-bold"
                            >
                                <div className="flex items-center gap-2">
                                    <BookOpen size={15} className="text-purple-500" />
                                    <span>{isIndo ? 'Buka di Modul Akademik & Study' : 'Open in Study Module'}</span>
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
