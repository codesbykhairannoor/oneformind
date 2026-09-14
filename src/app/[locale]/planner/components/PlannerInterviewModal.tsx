'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Briefcase, Video, ExternalLink, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { ScheduledInterviewItem } from '../types';
import { Link } from '@/i18n/routing';

interface PlannerInterviewModalProps {
    isOpen: boolean;
    interview: ScheduledInterviewItem | null;
    isIndo: boolean;
    locale: string;
    onClose: () => void;
    onToggleInterviewCompleted?: (jobId: string | number, roundId: string | number) => Promise<void>;
}

export default function PlannerInterviewModal({
    isOpen,
    interview,
    isIndo,
    locale,
    onClose,
    onToggleInterviewCompleted
}: PlannerInterviewModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen || !interview) return null;

    const isCompleted = interview.status === 'completed' || interview.status === 'passed';

    const handleToggleComplete = async () => {
        if (!onToggleInterviewCompleted) return;
        try {
            setIsUpdating(true);
            await onToggleInterviewCompleted(interview.jobId, interview.id);
            onClose();
        } catch (err) {
            console.error('Failed to toggle interview status:', err);
        } finally {
            setIsUpdating(false);
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
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
                        <div className="flex items-center gap-3">
                            <span className="text-xl p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                                <Briefcase size={22} />
                            </span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-black text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-snug">
                                        {interview.company}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-700/50">
                                        INTERVIEW
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {interview.jobTitle} • {interview.roundTitle}
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
                        {/* Time & Interviewer Info Badges */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                                <Clock size={18} className="text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {isIndo ? 'Jadwal Interview' : 'Scheduled Time'}
                                    </p>
                                    <p className="font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                                        {interview.startTime} - {interview.endTime}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5">
                                <User size={18} className="text-indigo-500 shrink-0" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {isIndo ? 'Pewawancara' : 'Interviewer'}
                                    </p>
                                    <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                                        {interview.interviewerName || (isIndo ? 'Belum ditentukan' : 'Unspecified')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Meeting Link Banner / Button */}
                        {interview.meetingLink ? (
                            <a
                                href={interview.meetingLink.startsWith('http') ? interview.meetingLink : `https://${interview.meetingLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full p-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-between shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="p-2 rounded-xl bg-white/20 shrink-0">
                                        <Video size={20} />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="font-black text-sm leading-tight">
                                            {isIndo ? 'Masuk ke Ruang Meeting' : 'Join Video Meeting'}
                                        </p>
                                        <p className="text-[11px] text-white/80 truncate max-w-[280px] mt-0.5">
                                            {interview.meetingLink}
                                        </p>
                                    </div>
                                </div>
                                <ExternalLink size={18} className="shrink-0 text-white/90" />
                            </a>
                        ) : (
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                                <Video size={16} className="text-slate-400 shrink-0" />
                                <span>{isIndo ? 'Link Google Meet / Zoom belum dicantumkan di Job Tracker' : 'Meeting link not yet specified in Job Tracker'}</span>
                            </div>
                        )}

                        {/* Notes if available */}
                        {interview.notes && (
                            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
                                <span className="font-bold">{isIndo ? 'Catatan Interview: ' : 'Interview Notes: '}</span>
                                {interview.notes}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                            {/* Toggle completed button */}
                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={handleToggleComplete}
                                className={`w-full p-3 rounded-2xl border transition text-left flex items-center justify-between gap-3 ${
                                    isCompleted
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-700 dark:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 size={18} className={isCompleted ? 'text-emerald-500' : 'text-slate-400'} />
                                    <span className="font-bold text-xs sm:text-sm">
                                        {isCompleted
                                            ? (isIndo ? 'Interview Telah Selesai' : 'Interview Completed')
                                            : (isIndo ? 'Tandai Selesai Dijalankan' : 'Mark as Completed')}
                                    </span>
                                </div>
                                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-lg border border-current">
                                    {isCompleted ? (isIndo ? 'Selesai' : 'Done') : (isIndo ? 'Update' : 'Toggle')}
                                </span>
                            </button>

                            {/* Direct link to Jobs module */}
                            <Link
                                href={`/${locale}/jobs`}
                                onClick={onClose}
                                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center justify-between text-xs font-bold"
                            >
                                <div className="flex items-center gap-2">
                                    <Briefcase size={15} className="text-blue-500" />
                                    <span>{isIndo ? 'Buka Detail di Modul Job Tracker' : 'Open in Job Tracker'}</span>
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
