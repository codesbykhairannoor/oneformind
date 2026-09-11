'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
    Sparkles, Trash2, Edit3, MapPin, 
    Calendar, DollarSign, ExternalLink, Video,
    CheckCircle2, Clock, AlertCircle, Building2,
    Plus, Check, X, Search, ArrowUpDown, ChevronRight
} from 'lucide-react';
import { JobRowItem, formatSalaryDisplay } from '../lib/jobAnalytics';
import JobStatusDropdown from './JobStatusDropdown';

interface JobTableProps {
    jobs: JobRowItem[];
    onEdit: (job: JobRowItem) => void;
    onDelete: (id: number | string) => void;
    onScan: (job: JobRowItem) => void;
    onStatusChange: (job: JobRowItem, newStatus: string) => void;
    onQuickAddJob?: (company: string, title: string, status: string, workModel: string) => void;
}

export default function JobTable({ 
    jobs, 
    onEdit, 
    onDelete, 
    onScan, 
    onStatusChange,
    onQuickAddJob
}: JobTableProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    // State for Inline Table Row Quick Add
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [newCompany, setNewCompany] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newStatus, setNewStatus] = useState('applied');
    const [newWorkModel, setNewWorkModel] = useState('remote');

    const handleSaveNewRow = () => {
        if (!newCompany.trim() && !newTitle.trim()) return;

        let comp = newCompany.trim();
        let tit = newTitle.trim();

        if (!comp && tit.includes('-')) {
            const parts = tit.split('-');
            comp = parts[0].trim();
            tit = parts.slice(1).join('-').trim();
        } else if (!comp) {
            comp = isIndo ? 'Perusahaan Target' : 'Target Company';
        }

        if (!tit) {
            tit = isIndo ? 'Posisi Lamaran' : 'Job Role';
        }

        if (onQuickAddJob) {
            onQuickAddJob(comp, tit, newStatus, newWorkModel);
        }

        setNewCompany('');
        setNewTitle('');
        setIsAddingRow(false);
    };

    const getWorkModelBadge = (wm?: string) => {
        switch (wm) {
            case 'remote': return { text: 'Remote 🌐', color: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
            case 'hybrid': return { text: 'Hybrid 🏢', color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800' };
            case 'onsite': return { text: 'On-site 📍', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            
            {/* Quick Add Row Button on Top of Table */}
            <div className="flex items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isIndo ? 'Daftar Semua Lamaran Kerja' : 'Job Application Register'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-black border border-indigo-100 dark:border-indigo-900/40">
                        {jobs.length}
                    </span>
                </div>

                {!isAddingRow && (
                    <button
                        type="button"
                        onClick={() => setIsAddingRow(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5 active:scale-95"
                    >
                        <Plus size={14} strokeWidth={3} />
                        <span>{isIndo ? '+ Tambah Baris Baru' : '+ Quick Add Row'}</span>
                    </button>
                )}
            </div>

            {/* ==================== MOBILE CARDS LAYOUT (<lg) ==================== */}
            <div className="lg:hidden space-y-3">
                {jobs.map((job) => {
                    const wmBadge = getWorkModelBadge(job.work_model);
                    const salaryFormatted = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);

                    return (
                        <div 
                            key={job.id}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5 transition-all"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                        {job.company ? job.company.charAt(0).toUpperCase() : '💼'}
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">
                                            {job.company}
                                        </span>
                                        <h4 
                                            onClick={() => onEdit(job)}
                                            className="text-sm font-black text-slate-800 dark:text-white truncate cursor-pointer hover:text-indigo-600"
                                        >
                                            {job.title}
                                        </h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(job)}
                                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                                        title="Inspect"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(job.id)}
                                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                                        title="Delete"
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
                <div className="overflow-x-auto custom-scrollbar min-h-[450px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/90 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="py-3.5 px-6 min-w-[240px]">
                                    {isIndo ? 'Perusahaan & Posisi' : 'Company & Title'}
                                </th>
                                <th className="py-3.5 px-4 min-w-[150px]">
                                    {isIndo ? 'Lokasi & Model' : 'Location & Model'}
                                </th>
                                <th className="py-3.5 px-4 min-w-[180px]">
                                    {isIndo ? 'Kompensasi Gaji' : 'Salary Range'}
                                </th>
                                <th className="py-3.5 px-4 min-w-[130px]">
                                    {isIndo ? 'Tgl Melamar' : 'Applied Date'}
                                </th>
                                <th className="py-3.5 px-4 min-w-[160px]">
                                    {isIndo ? 'Tahapan Status' : 'Status'}
                                </th>
                                <th className="py-3.5 px-4 min-w-[120px] text-center">
                                    {isIndo ? 'Interview' : 'Interviews'}
                                </th>
                                <th className="py-3.5 px-4 text-center w-28">
                                    {isIndo ? 'Aksi' : 'Actions'}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                            
                            {/* INLINE QUICK ADD ROW IN TABLE */}
                            {isAddingRow && (
                                <tr className="bg-indigo-50/50 dark:bg-indigo-950/30 border-b-2 border-indigo-500 animate-in fade-in duration-200">
                                    {/* Company & Title Inputs */}
                                    <td className="py-3 px-6">
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder={isIndo ? 'Nama Perusahaan' : 'Company Name'}
                                                value={newCompany}
                                                onChange={(e) => setNewCompany(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveNewRow();
                                                    if (e.key === 'Escape') setIsAddingRow(false);
                                                }}
                                                className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder={isIndo ? 'Posisi / Role' : 'Job Title'}
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveNewRow();
                                                    if (e.key === 'Escape') setIsAddingRow(false);
                                                }}
                                                className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </td>

                                    {/* Model Selector */}
                                    <td className="py-3 px-4">
                                        <select
                                            value={newWorkModel}
                                            onChange={(e) => setNewWorkModel(e.target.value)}
                                            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                                        >
                                            <option value="remote">Remote 🌐</option>
                                            <option value="hybrid">Hybrid 🏢</option>
                                            <option value="onsite">Onsite 📍</option>
                                        </select>
                                    </td>

                                    {/* Salary Placeholder */}
                                    <td className="py-3 px-4 text-slate-400 italic text-[11px]">
                                        {isIndo ? 'Edit setelah simpan' : 'Set in details'}
                                    </td>

                                    {/* Date */}
                                    <td className="py-3 px-4 font-mono text-slate-500">
                                        {new Date().toISOString().split('T')[0]}
                                    </td>

                                    {/* Status Selector */}
                                    <td className="py-3 px-4">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                                        >
                                            <option value="wishlist">💭 Wishlist</option>
                                            <option value="applied">📤 Applied</option>
                                            <option value="interview">🎯 Interview</option>
                                        </select>
                                    </td>

                                    <td className="py-3 px-4 text-center text-slate-400">-</td>

                                    {/* Save / Cancel buttons */}
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                onClick={handleSaveNewRow}
                                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                                                title="Save"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingRow(false)}
                                                className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition"
                                                title="Cancel"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {jobs.map((job) => {
                                const wmBadge = getWorkModelBadge(job.work_model);
                                const salaryFormatted = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);
                                const roundCount = job.interview_rounds?.length || 0;

                                return (
                                    <tr 
                                        key={job.id}
                                        onClick={() => onEdit(job)}
                                        className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                    >
                                        {/* Company & Title with Avatar Initial */}
                                        <td className="py-3.5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                                    {job.company ? job.company.charAt(0).toUpperCase() : '💼'}
                                                </div>
                                                <div className="space-y-0.5 min-w-0">
                                                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">
                                                        {job.company}
                                                    </span>
                                                    <h4 className="font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition truncate">
                                                        {job.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location & Model */}
                                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
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
                                        <td className="py-3.5 px-4">
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
                                        <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-400">
                                            {job.applied_date || '-'}
                                        </td>

                                        {/* Status Dropdown */}
                                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                            <JobStatusDropdown
                                                value={job.status}
                                                onChange={(val) => onStatusChange(job, val)}
                                            />
                                        </td>

                                        {/* Interview Rounds */}
                                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
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
                                                    className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition"
                                                >
                                                    + {isIndo ? 'Tambah' : 'Add'}
                                                </button>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onScan(job)}
                                                    className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition"
                                                    title="ATS Match Scan"
                                                >
                                                    <Sparkles size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition"
                                                    title="Inspect in Drawer"
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

                            {jobs.length === 0 && !isAddingRow && (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-slate-400">
                                        <span className="text-4xl block mb-2">💼</span>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                            {isIndo ? 'Belum ada data lamaran kerja.' : 'No job applications found.'}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {isIndo ? 'Gunakan bar input di atas atau klik tombol Tambah Baris Baru.' : 'Use the quick add bar above or click Add Row.'}
                                        </p>
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
