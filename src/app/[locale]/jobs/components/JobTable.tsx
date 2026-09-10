'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Sparkles, Trash2, Edit3, MapPin, 
    Calendar, DollarSign, ExternalLink, Video,
    CheckCircle2, Clock, AlertCircle, Building2
} from 'lucide-react';
import { JobRowItem, formatSalaryDisplay } from '../lib/jobAnalytics';
import JobStatusDropdown from './JobStatusDropdown';

interface JobTableProps {
    jobs: JobRowItem[];
    onEdit: (job: JobRowItem) => void;
    onDelete: (id: number | string) => void;
    onScan: (job: JobRowItem) => void;
    onStatusChange: (job: JobRowItem, newStatus: string) => void;
}

export default function JobTable({ 
    jobs, 
    onEdit, 
    onDelete, 
    onScan, 
    onStatusChange 
}: JobTableProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const getWorkModelBadge = (wm?: string) => {
        switch (wm) {
            case 'remote': return { text: 'Remote', color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
            case 'hybrid': return { text: 'Hybrid', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800' };
            case 'onsite': return { text: 'On-site', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
            default: return null;
        }
    };

    return (
        <div className="relative">
            
            {/* ==================== MOBILE CARDS LAYOUT (<lg) ==================== */}
            <div className="lg:hidden space-y-4">
                {jobs.map((job) => {
                    const wmBadge = getWorkModelBadge(job.work_model);
                    const salaryFormatted = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);

                    return (
                        <div 
                            key={job.id}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1 min-w-0">
                                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">
                                        {job.company}
                                    </span>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white">
                                        {job.title}
                                    </h4>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(job)}
                                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(job.id)}
                                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1.5 items-center text-[10px] font-bold">
                                {job.location && (
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        <MapPin size={10} />
                                        <span>{job.location}</span>
                                    </span>
                                )}

                                {wmBadge && (
                                    <span className={`px-2 py-0.5 rounded-md border ${wmBadge.color}`}>
                                        {wmBadge.text}
                                    </span>
                                )}

                                {(job.salary_min || job.salary_max) && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                                        💰 {salaryFormatted}
                                    </span>
                                )}
                            </div>

                            {/* Status & Date */}
                            <div className="flex items-center gap-2 pt-1">
                                <div className="flex-1">
                                    <JobStatusDropdown
                                        value={job.status}
                                        onChange={(val) => onStatusChange(job, val)}
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 shrink-0">
                                    📅 {job.applied_date || '-'}
                                </span>
                            </div>

                            {/* ATS Scan Footer */}
                            <button
                                type="button"
                                onClick={() => onScan(job)}
                                className="w-full py-2.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                            >
                                <Sparkles size={14} />
                                <span>{isIndo ? 'Cek Keselarasan ATS' : 'ATS Resume Match Scan'}</span>
                            </button>
                        </div>
                    );
                })}

                {jobs.length === 0 && (
                    <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-4xl">💼</span>
                        <p className="text-xs font-bold text-slate-400">
                            {isIndo ? 'Tidak ada data lamaran kerja.' : 'No job applications found.'}
                        </p>
                    </div>
                )}
            </div>

            {/* ==================== DESKTOP TABLE LAYOUT (>=lg) ==================== */}
            <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="py-4 px-6 min-w-[200px]">
                                    {isIndo ? 'Perusahaan & Posisi' : 'Company & Title'}
                                </th>
                                <th className="py-4 px-4 min-w-[140px]">
                                    {isIndo ? 'Lokasi & Model' : 'Location & Model'}
                                </th>
                                <th className="py-4 px-4 min-w-[180px]">
                                    {isIndo ? 'Kompensasi Gaji' : 'Salary Range'}
                                </th>
                                <th className="py-4 px-4 min-w-[130px]">
                                    {isIndo ? 'Tgl Melamar' : 'Applied Date'}
                                </th>
                                <th className="py-4 px-4 min-w-[160px]">
                                    {isIndo ? 'Tahapan Status' : 'Status'}
                                </th>
                                <th className="py-4 px-4 min-w-[120px] text-center">
                                    {isIndo ? 'Tahapan Interview' : 'Interviews'}
                                </th>
                                <th className="py-4 px-4 text-center w-28">
                                    {isIndo ? 'Aksi' : 'Actions'}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                            {jobs.map((job) => {
                                const wmBadge = getWorkModelBadge(job.work_model);
                                const salaryFormatted = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);
                                const roundCount = job.interview_rounds?.length || 0;

                                return (
                                    <tr 
                                        key={job.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group"
                                    >
                                        {/* Company & Title */}
                                        <td className="py-4 px-6">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block">
                                                    {job.company}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="font-black text-slate-800 dark:text-white hover:text-indigo-600 text-left transition"
                                                >
                                                    {job.title}
                                                </button>
                                            </div>
                                        </td>

                                        {/* Location & Model */}
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <span className="text-slate-600 dark:text-slate-300 font-bold block truncate max-w-[130px]">
                                                    {job.location || '-'}
                                                </span>
                                                {wmBadge && (
                                                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${wmBadge.color}`}>
                                                        {wmBadge.text}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Salary Range */}
                                        <td className="py-4 px-4">
                                            {(job.salary_min || job.salary_max) ? (
                                                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800/80 inline-block">
                                                    {salaryFormatted}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic text-[11px]">
                                                    {isIndo ? 'Dirahasiakan' : 'Undisclosed'}
                                                </span>
                                            )}
                                        </td>

                                        {/* Applied Date */}
                                        <td className="py-4 px-4 font-bold text-slate-600 dark:text-slate-400">
                                            {job.applied_date || '-'}
                                        </td>

                                        {/* Status Dropdown */}
                                        <td className="py-4 px-4">
                                            <JobStatusDropdown
                                                value={job.status}
                                                onChange={(val) => onStatusChange(job, val)}
                                            />
                                        </td>

                                        {/* Interview Rounds */}
                                        <td className="py-4 px-4 text-center">
                                            {roundCount > 0 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 transition inline-flex items-center gap-1"
                                                >
                                                    <Calendar size={11} />
                                                    <span>{roundCount} {isIndo ? 'Ronde' : 'Rounds'}</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="text-[11px] text-slate-400 hover:text-indigo-600 transition"
                                                >
                                                    + {isIndo ? 'Tambah' : 'Add'}
                                                </button>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onScan(job)}
                                                    className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition"
                                                    title="ATS Scan"
                                                >
                                                    <Sparkles size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(job.id)}
                                                    className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-slate-400">
                                        <span className="text-4xl block mb-2">💼</span>
                                        {isIndo ? 'Tidak ada data lamaran kerja.' : 'No job applications found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
