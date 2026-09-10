'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Calendar, Video, Clock, CheckCircle2, 
    XCircle, User, Briefcase, ExternalLink, 
    Sparkles, Plus, AlertCircle, FileText
} from 'lucide-react';
import { JobRowItem } from '../lib/jobAnalytics';

interface JobInterviewsCalendarViewProps {
    jobs: JobRowItem[];
    onEditJob: (job: JobRowItem) => void;
    onAddInterview: (job: JobRowItem) => void;
}

export default function JobInterviewsCalendarView({
    jobs,
    onEditJob,
    onAddInterview
}: JobInterviewsCalendarViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Flatten all interview rounds with company reference
    const allRounds: Array<{
        job: JobRowItem;
        id: string | number;
        round_type: string;
        round_title?: string;
        scheduled_at?: string | null;
        interviewer_name?: string;
        meeting_link?: string;
        status: string;
        notes?: string;
    }> = [];

    jobs.forEach(job => {
        if (job.interview_rounds && Array.isArray(job.interview_rounds)) {
            job.interview_rounds.forEach(r => {
                allRounds.push({
                    job,
                    ...r
                });
            });
        }
    });

    // Sort by scheduled date
    allRounds.sort((a, b) => {
        if (!a.scheduled_at) return 1;
        if (!b.scheduled_at) return -1;
        return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
    });

    const formatDateTime = (dateStr?: string | null) => {
        if (!dateStr) return isIndo ? 'Jadwal belum ditentukan' : 'Time TBD';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    const getRoundLabel = (t?: string) => {
        switch (t) {
            case 'hr_screening': return isIndo ? '📞 HR Screening Call' : '📞 HR Screening Call';
            case 'technical_test': return isIndo ? '💻 Ujian / Live Coding' : '💻 Technical / Live Code';
            case 'user_interview': return isIndo ? '👥 Wawancara User / Manager' : '👥 User / Manager Round';
            case 'case_study': return isIndo ? '📊 Presentasi Case Study' : '📊 Case Study Presentation';
            case 'culture_fit': return isIndo ? '✨ Culture Fit / Team Match' : '✨ Culture Fit / Team Match';
            case 'final_executive': return isIndo ? '👔 Wawancara Final C-Level' : '👔 Executive / Final Round';
            default: return isIndo ? '🎙️ Wawancara Kerja' : '🎙️ Job Interview';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming': return { text: isIndo ? 'Mendatang' : 'Upcoming', class: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
            case 'completed': return { text: isIndo ? 'Selesai' : 'Completed', class: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
            case 'passed': return { text: isIndo ? 'Lolos 🎉' : 'Passed 🎉', class: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
            case 'failed': return { text: isIndo ? 'Belum Beruntung' : 'Failed', class: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
            default: return { text: status, class: 'bg-slate-100 text-slate-600' };
        }
    };

    return (
        <div className="space-y-6">
            
            {/* Header info */}
            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <span>{isIndo ? 'Pusat Jadwal & Persiapan Interview' : 'Interview Command & Prep Hub'}</span>
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                        {isIndo 
                            ? 'Pantau semua tahapan wawancara aktif (HR, User, Live Coding, Final), tautan meeting (Zoom/Meet), dan contekan metode STAR Anda.'
                            : 'Track all interview stages (HR, User, Technical, Final), direct video links, and STAR prep notes in one place.'}
                    </p>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-center shrink-0">
                    <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block">
                        {isIndo ? 'Total Tahapan' : 'Total Rounds'}
                    </span>
                    <span className="text-xl font-black font-mono text-purple-700 dark:text-purple-300">
                        {allRounds.length}
                    </span>
                </div>
            </div>

            {/* Rounds Timeline List */}
            {allRounds.length > 0 ? (
                <div className="space-y-4">
                    {allRounds.map((round, idx) => {
                        const sBadge = getStatusBadge(round.status);
                        return (
                            <div
                                key={round.id || idx}
                                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                            >
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                                            {round.job.company}
                                        </span>
                                        <span>•</span>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {round.job.title}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sBadge.class}`}>
                                            {sBadge.text}
                                        </span>
                                    </div>

                                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                                        {round.round_title || getRoundLabel(round.round_type)}
                                    </h4>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                                            <Clock size={13} />
                                            <span>{formatDateTime(round.scheduled_at)}</span>
                                        </span>

                                        {round.interviewer_name && (
                                            <span className="flex items-center gap-1.5">
                                                <User size={13} />
                                                <span>Pewawancara: {round.interviewer_name}</span>
                                            </span>
                                        )}
                                    </div>

                                    {round.notes && (
                                        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            "{round.notes}"
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                                    {round.meeting_link && (
                                        <a
                                            href={round.meeting_link.startsWith('http') ? round.meeting_link : `https://${round.meeting_link}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition"
                                        >
                                            <Video size={14} />
                                            <span>{isIndo ? 'Buka Video Call' : 'Join Call'}</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => onEditJob(round.job)}
                                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-black transition flex items-center gap-1.5"
                                    >
                                        <FileText size={14} />
                                        <span>{isIndo ? 'Contekan STAR' : 'STAR Notes'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-4xl">🎙️</span>
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                        {isIndo ? 'Belum Ada Jadwal Interview' : 'No Scheduled Interviews Yet'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        {isIndo 
                            ? 'Buka salah satu lamaran dan tambahkan tahapan wawancara (HR, Technical, User, Final) untuk mulai melacaknya di sini.'
                            : 'Open any job application and add interview rounds to track them here.'}
                    </p>
                </div>
            )}

        </div>
    );
}
