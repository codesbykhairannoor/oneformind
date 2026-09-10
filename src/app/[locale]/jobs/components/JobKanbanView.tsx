'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Plus, Sparkles, Calendar, DollarSign, MapPin, 
    Clock, Building2, ChevronRight, ChevronLeft, 
    Trash2, Edit3, CheckCircle2, AlertCircle, Link as LinkIcon
} from 'lucide-react';
import { JobRowItem, formatSalaryDisplay } from '../lib/jobAnalytics';

interface JobKanbanViewProps {
    jobs: JobRowItem[];
    onEdit: (job: JobRowItem) => void;
    onDelete: (id: number | string) => void;
    onStatusChange: (job: JobRowItem, newStatus: string) => void;
    onScan: (job: JobRowItem) => void;
    onAddInColumn: (status: string) => void;
}

export default function JobKanbanView({
    jobs,
    onEdit,
    onDelete,
    onStatusChange,
    onScan,
    onAddInColumn
}: JobKanbanViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const columns = [
        {
            id: 'wishlist',
            title: isIndo ? 'Daftar Incaran' : 'Wishlist',
            icon: '💭',
            color: 'border-t-blue-500',
            bgBadge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        },
        {
            id: 'applied',
            title: isIndo ? 'Telah Dilamar' : 'Applied',
            icon: '📤',
            color: 'border-t-amber-500',
            bgBadge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        },
        {
            id: 'interview',
            title: isIndo ? 'Proses Interview' : 'Interviewing',
            icon: '🎯',
            color: 'border-t-purple-500',
            bgBadge: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        },
        {
            id: 'offer',
            title: isIndo ? 'Tawaran Kerja' : 'Job Offer',
            icon: '🎉',
            color: 'border-t-emerald-500',
            bgBadge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        },
        {
            id: 'accepted',
            title: isIndo ? 'Diterima 🏆' : 'Accepted 🏆',
            icon: '✅',
            color: 'border-t-green-600',
            bgBadge: 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
        },
        {
            id: 'rejected',
            title: isIndo ? 'Belum Berjodoh' : 'Archived / Rejected',
            icon: '❌',
            color: 'border-t-slate-400',
            bgBadge: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
        }
    ];

    const getWorkModelBadge = (wm?: string) => {
        switch (wm) {
            case 'remote': return { text: 'Remote', color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
            case 'hybrid': return { text: 'Hybrid', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800' };
            case 'onsite': return { text: 'On-site', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
            default: return null;
        }
    };

    const getNextStatus = (curr: string) => {
        const order = ['wishlist', 'applied', 'interview', 'offer', 'accepted'];
        const idx = order.indexOf(curr);
        if (idx >= 0 && idx < order.length - 1) return order[idx + 1];
        return null;
    };

    const getPrevStatus = (curr: string) => {
        const order = ['wishlist', 'applied', 'interview', 'offer', 'accepted'];
        const idx = order.indexOf(curr);
        if (idx > 0) return order[idx - 1];
        return null;
    };

    return (
        <div className="overflow-x-auto custom-scrollbar pb-6">
            <div className="flex gap-5 min-w-[1300px] items-start">
                
                {columns.map((col) => {
                    const colJobs = jobs.filter(j => (j.status || 'wishlist') === col.id);

                    return (
                        <div 
                            key={col.id} 
                            className={`flex-1 min-w-[280px] max-w-[340px] bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl p-4 border border-slate-200/60 dark:border-slate-800/80 border-t-4 ${col.color} space-y-3 flex flex-col justify-between`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{col.icon}</span>
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                        {col.title}
                                    </h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black border ${col.bgBadge}`}>
                                    {colJobs.length}
                                </span>
                            </div>

                            {/* Cards Stack */}
                            <div className="space-y-3 flex-1 min-h-[150px]">
                                {colJobs.map((job) => {
                                    const wmBadge = getWorkModelBadge(job.work_model);
                                    const nextSt = getNextStatus(job.status);
                                    const prevSt = getPrevStatus(job.status);
                                    const salaryStr = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);

                                    return (
                                        <div
                                            key={job.id}
                                            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 group relative cursor-pointer"
                                            onClick={() => onEdit(job)}
                                        >
                                            {/* Company & Title Header */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="space-y-0.5 min-w-0">
                                                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">
                                                        {job.company || (isIndo ? 'Perusahaan' : 'Company')}
                                                    </span>
                                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 transition">
                                                        {job.title || (isIndo ? 'Posisi Pekerjaan' : 'Job Title')}
                                                    </h4>
                                                </div>

                                                {/* Edit & Delete Quick Icons */}
                                                <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(job)}
                                                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(job.id)}
                                                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Badges Row */}
                                            <div className="flex flex-wrap gap-1.5 items-center text-[10px] font-bold">
                                                {job.location && (
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/60 flex items-center gap-1">
                                                        <MapPin size={10} />
                                                        <span className="truncate max-w-[120px]">{job.location}</span>
                                                    </span>
                                                )}

                                                {wmBadge && (
                                                    <span className={`px-2 py-0.5 rounded-md border ${wmBadge.color}`}>
                                                        {wmBadge.text}
                                                    </span>
                                                )}

                                                {(job.salary_min || job.salary_max) && (
                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                                                        💰 {salaryStr}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Interview / Follow-up Note */}
                                            {job.interview_rounds && job.interview_rounds.length > 0 && (
                                                <div className="p-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-[11px] font-bold text-purple-700 dark:text-purple-300 flex items-center justify-between">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        <span>{job.interview_rounds.length} {isIndo ? 'Tahapan' : 'Rounds'}</span>
                                                    </span>
                                                    <span className="text-[10px] opacity-80 uppercase">
                                                        {job.interview_rounds[job.interview_rounds.length - 1].status}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Action Footer: ATS Scan & Move Status */}
                                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 text-xs" onClick={(e) => e.stopPropagation()}>
                                                
                                                {/* ATS Scan Trigger */}
                                                <button
                                                    type="button"
                                                    onClick={() => onScan(job)}
                                                    className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition"
                                                >
                                                    <Sparkles size={12} />
                                                    <span>ATS Scan</span>
                                                </button>

                                                {/* Move Previous / Next Stage */}
                                                <div className="flex items-center gap-1">
                                                    {prevSt && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onStatusChange(job, prevSt)}
                                                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition"
                                                            title={isIndo ? 'Kembalikan tahap' : 'Move back'}
                                                        >
                                                            <ChevronLeft size={14} />
                                                        </button>
                                                    )}
                                                    {nextSt && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onStatusChange(job, nextSt)}
                                                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-0.5 transition"
                                                            title={isIndo ? 'Lanjut ke tahap berikutnya' : 'Move forward'}
                                                        >
                                                            <span>{isIndo ? 'Lanjut' : 'Next'}</span>
                                                            <ChevronRight size={12} />
                                                        </button>
                                                    )}
                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                                {colJobs.length === 0 && (
                                    <div className="py-8 text-center border-2 border-dashed border-slate-200/60 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs font-bold">
                                        <span>{isIndo ? 'Kosong' : 'Empty Column'}</span>
                                    </div>
                                )}
                            </div>

                            {/* Add Card in Column Button */}
                            <button
                                type="button"
                                onClick={() => onAddInColumn(col.id)}
                                className="w-full py-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-500 hover:text-indigo-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
                            >
                                <Plus size={14} />
                                <span>{isIndo ? 'Tambah di sini' : 'Add in column'}</span>
                            </button>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}
