'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import JobDatePicker from './JobDatePicker';
import JobStatusDropdown from './JobStatusDropdown';
import { Sparkles, Trash2 } from 'lucide-react';

export interface JobRowItem {
    id: number | string;
    _key?: string;
    is_new?: boolean;
    company: string;
    title: string;
    location: string;
    applied_date: string;
    status: string;
    notes?: string;
    salary?: number | string | null;
    is_saving?: boolean;
}

interface JobTableProps {
    jobs: JobRowItem[];
    onAutoSave: (job: JobRowItem) => void;
    onDelete: (id: number | string, isNew?: boolean) => void;
    onScan: (job: JobRowItem) => void;
    onJobChange?: (index: number, field: keyof JobRowItem, val: any) => void;
}

export default function JobTable({ jobs, onAutoSave, onDelete, onScan, onJobChange }: JobTableProps) {
    const t = useTranslations();
    const tableRef = useRef<HTMLDivElement>(null);

    const autoGrow = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const el = e.currentTarget;
        el.style.height = '56px';
        el.style.height = Math.max(56, el.scrollHeight) + 'px';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, rowIndex: number, colIndex: number) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

        const input = e.currentTarget;
        if (e.key === 'ArrowLeft' && input.selectionStart && input.selectionStart > 0) return;
        if (e.key === 'ArrowRight' && input.selectionEnd && input.selectionEnd < input.value.length) return;

        e.preventDefault();

        let nextRow = rowIndex;
        let nextCol = colIndex;

        const totalCols = 4;
        const totalRows = jobs.length;

        if (e.key === 'ArrowUp') nextRow = Math.max(0, rowIndex - 1);
        else if (e.key === 'ArrowDown') nextRow = Math.min(totalRows - 1, rowIndex + 1);
        else if (e.key === 'ArrowLeft') nextCol = Math.max(0, colIndex - 1);
        else if (e.key === 'ArrowRight') nextCol = Math.min(totalCols - 1, colIndex + 1);

        const nextInput = tableRef.current?.querySelector<HTMLElement>(`[data-nav-row="${nextRow}"][data-nav-col="${nextCol}"]`);
        if (nextInput) {
            nextInput.focus();
            if (nextInput.tagName === 'INPUT' || nextInput.tagName === 'TEXTAREA') {
                setTimeout(() => (nextInput as HTMLTextAreaElement).select(), 10);
            }
        }
    };

    const handleFieldChange = (index: number, field: keyof JobRowItem, val: any) => {
        if (onJobChange) {
            onJobChange(index, field, val);
        } else {
            jobs[index][field] = val as never;
        }
    };

    return (
        // 1:1 from JobTable.vue line 50-217
        <div className="relative">
            
            {/* ==================== MOBILE LAYOUT (<sm) ==================== */}
            <div className="sm:hidden space-y-4">
                {jobs.map((job, index) => (
                    <div 
                        key={job._key || job.id}
                        className="group relative transition-all duration-300 active:scale-[0.99] z-10 hover:z-20 focus-within:z-30"
                    >
                        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 rounded-[2.5rem] -z-10 border border-white/60 dark:border-slate-800 transition-colors duration-500"></div>
                        
                        <div className="bg-white/70 dark:bg-slate-900/70 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 p-5 shadow-sm transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0 space-y-4">
                                    
                                    {/* Company & Title */}
                                    <div className="space-y-1">
                                        <input 
                                            type="text" 
                                            value={job.company} 
                                            onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                                            onBlur={() => onAutoSave(job)} 
                                            onKeyUp={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                            className="w-full p-0 bg-transparent border-none outline-none focus:ring-0 font-bold text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 transition-colors duration-500"
                                            placeholder={t('job_ph_company') || 'Perusahaan'} 
                                        />
                                        <input 
                                            type="text" 
                                            value={job.title} 
                                            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                            onBlur={() => onAutoSave(job)} 
                                            onKeyUp={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                            className="w-full p-0 bg-transparent border-none outline-none focus:ring-0 font-bold text-sm text-slate-600 dark:text-slate-400 placeholder-slate-300 dark:placeholder-slate-700 transition-colors duration-500"
                                            placeholder={t('job_ph_title') || 'Posisi Pekerjaan'} 
                                        />
                                    </div>

                                    <div className="h-px bg-slate-100 dark:bg-slate-800 -mx-4 transition-colors duration-500"></div>

                                    {/* Location */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1 transition-colors duration-500">
                                                📍 {t('job_col_location') || 'Lokasi'}
                                            </label>
                                            <input 
                                                type="text" 
                                                value={job.location} 
                                                onChange={(e) => handleFieldChange(index, 'location', e.target.value)}
                                                onBlur={() => onAutoSave(job)} 
                                                onKeyUp={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                                className="w-full p-0 bg-transparent border-none outline-none focus:ring-0 font-bold text-sm text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-700 transition-colors duration-500"
                                                placeholder={t('job_ph_location') || 'Remote / ID'} 
                                            />
                                        </div>
                                    </div>

                                    {/* Status & Date Pickers */}
                                    <div className="flex items-center gap-2 pt-1 overflow-visible">
                                        <div className="flex-1 min-w-0">
                                            <JobStatusDropdown 
                                                value={job.status} 
                                                onChange={(val) => handleFieldChange(index, 'status', val)}
                                                onSave={() => onAutoSave(job)}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <JobDatePicker 
                                                value={job.applied_date} 
                                                onChange={(val) => handleFieldChange(index, 'applied_date', val)}
                                                onSave={() => onAutoSave(job)}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* AI Scan Button */}
                                    <button 
                                        type="button"
                                        onClick={() => onScan(job)}
                                        className="w-full py-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Sparkles size={14} strokeWidth={3} />
                                        AI Resume Match Scan
                                    </button>
                                </div>

                                {/* Delete Button */}
                                <button 
                                    type="button"
                                    onClick={() => onDelete(job.id, job.is_new)}
                                    className="p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-500">
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-5xl text-slate-300 dark:text-slate-700 animate-bounce">📥</span>
                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 px-8 transition-colors duration-500">
                                {t('job_empty_table') || 'Belum ada data. Tambahkan baris baru di pojok kanan atas.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ==================== DESKTOP LAYOUT (>=sm) ==================== */}
            <div className="hidden sm:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative transition-colors duration-500">
                <div className="overflow-x-auto custom-scrollbar min-h-[500px]" ref={tableRef}>
                    <table className="w-full text-sm border-collapse text-left relative select-none sm:select-text">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm transition-colors duration-500">
                            <tr>
                                <th className="border-r border-slate-200 dark:border-slate-700 px-5 py-3.5 font-extrabold text-slate-600 dark:text-slate-300 min-w-[140px] w-1/4">
                                    {t('job_col_company') || 'Perusahaan'} <span className="text-rose-500">*</span>
                                </th>
                                <th className="border-r border-slate-200 dark:border-slate-700 px-5 py-3.5 font-extrabold text-slate-600 dark:text-slate-300 min-w-[140px] w-1/4">
                                    {t('job_col_title') || 'Pekerjaan'} <span className="text-rose-500">*</span>
                                </th>
                                <th className="border-r border-slate-200 dark:border-slate-700 px-5 py-3.5 font-extrabold text-slate-600 dark:text-slate-300 min-w-[120px] w-1/6">
                                    {t('job_col_location') || 'Lokasi'}
                                </th>
                                <th className="border-r border-slate-200 dark:border-slate-700 px-5 py-3.5 font-extrabold text-slate-600 dark:text-slate-300 min-w-[130px]">
                                    {t('job_col_applied') || 'Tgl Melamar'}
                                </th>
                                <th className="border-r border-slate-200 dark:border-slate-700 px-5 py-3.5 font-extrabold text-slate-600 dark:text-slate-300 min-w-[140px]">
                                    {t('job_col_status') || 'Status'}
                                </th>
                                <th className="border-r border-slate-200 dark:border-slate-700 px-5 py-3.5 font-extrabold text-indigo-600 dark:text-indigo-400 min-w-[70px] text-center">
                                    Neural
                                </th>
                                <th className="px-4 py-3.5 text-center font-extrabold text-slate-400 dark:text-slate-500 w-12">
                                    🗑️
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job, index) => (
                                <tr 
                                    key={job._key || job.id}
                                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-indigo-50/10 dark:hover:bg-indigo-500/5 focus-within:bg-indigo-50/30 dark:focus-within:bg-indigo-500/10 transition-colors group relative"
                                >
                                    {/* Company */}
                                    <td className="border-r border-slate-100 dark:border-slate-800 p-0 relative align-top">
                                        <textarea 
                                            value={job.company} 
                                            onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                                            onBlur={() => onAutoSave(job)}
                                            onInput={autoGrow}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                                                handleKeyDown(e, index, 0);
                                            }}
                                            data-nav-row={index}
                                            data-nav-col="0"
                                            rows={1}
                                            className="w-full min-h-[56px] px-5 py-4 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 font-bold text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 transition-all font-sans resize-none overflow-hidden break-words"
                                            placeholder={t('job_ph_company') || 'Ketik perusahaan...'}
                                        />
                                    </td>

                                    {/* Title */}
                                    <td className="border-r border-slate-100 dark:border-slate-800 p-0 relative align-top">
                                        <textarea 
                                            value={job.title} 
                                            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                            onBlur={() => onAutoSave(job)}
                                            onInput={autoGrow}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                                                handleKeyDown(e, index, 1);
                                            }}
                                            data-nav-row={index}
                                            data-nav-col="1"
                                            rows={1}
                                            className="w-full min-h-[56px] px-5 py-4 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 font-bold text-sm text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 transition-all font-sans resize-none overflow-hidden break-words"
                                            placeholder={t('job_ph_title') || 'Cth: Frontend Dev'}
                                        />
                                    </td>

                                    {/* Location */}
                                    <td className="border-r border-slate-100 dark:border-slate-800 p-0 relative align-top">
                                        <textarea 
                                            value={job.location} 
                                            onChange={(e) => handleFieldChange(index, 'location', e.target.value)}
                                            onBlur={() => onAutoSave(job)}
                                            onInput={autoGrow}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
                                                handleKeyDown(e, index, 2);
                                            }}
                                            data-nav-row={index}
                                            data-nav-col="2"
                                            rows={1}
                                            className="w-full min-h-[56px] px-5 py-4 bg-transparent border-none outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 font-medium text-sm text-slate-600 dark:text-slate-400 placeholder-slate-300 dark:placeholder-slate-700 transition-all font-sans resize-none overflow-hidden break-words"
                                            placeholder={t('job_ph_location') || 'Remote / ID'}
                                        />
                                    </td>

                                    {/* Date */}
                                    <td className="border-r border-slate-100 dark:border-slate-800 p-0 relative">
                                        <JobDatePicker 
                                            value={job.applied_date} 
                                            onChange={(val) => handleFieldChange(index, 'applied_date', val)}
                                            onSave={() => onAutoSave(job)}
                                        />
                                    </td>

                                    {/* Status */}
                                    <td className="border-r border-slate-100 dark:border-slate-800 p-0 relative">
                                        <JobStatusDropdown 
                                            value={job.status} 
                                            onChange={(val) => handleFieldChange(index, 'status', val)}
                                            onSave={() => onAutoSave(job)}
                                        />
                                    </td>

                                    {/* AI Scan Button */}
                                    <td className="border-r border-slate-100 dark:border-slate-800 p-0 relative text-center align-middle">
                                        <button 
                                            type="button"
                                            onClick={() => onScan(job)}
                                            className="w-full h-full min-h-[56px] flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                                        >
                                            <Sparkles size={18} strokeWidth={2.5} />
                                        </button>
                                    </td>

                                    {/* Delete Button */}
                                    <td className="p-0 text-center align-middle">
                                        <button 
                                            type="button"
                                            onClick={() => onDelete(job.id, job.is_new)}
                                            tabIndex={-1}
                                            className="w-full h-full min-h-[56px] flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-200"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-20 text-center text-slate-400 dark:text-slate-500 bg-slate-50/30 dark:bg-slate-800/20 font-medium transition-colors duration-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-4xl text-slate-300 dark:text-slate-700 animate-bounce mt-2">📥</span>
                                            {t('job_empty_table') || 'Belum ada data. Tambahkan baris baru di pojok kanan atas.'}
                                        </div>
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
