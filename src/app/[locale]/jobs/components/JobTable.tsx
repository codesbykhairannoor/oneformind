'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { 
    Sparkles, Trash2, Edit3, MapPin, 
    Calendar, DollarSign, ExternalLink, Video,
    CheckCircle2, Clock, AlertCircle, Building2,
    Plus, Check, X, Search, ArrowUpDown, ChevronRight,
    PanelRightOpen
} from 'lucide-react';
import { JobRowItem, formatSalaryDisplay } from '../lib/jobAnalytics';
import JobStatusDropdown from './JobStatusDropdown';

interface JobTableProps {
    jobs: JobRowItem[];
    onEdit: (job: JobRowItem) => void;
    onDelete: (jobOrId: JobRowItem | number | string) => void;
    onScan: (job: JobRowItem) => void;
    onStatusChange: (job: JobRowItem, newStatus: string) => void;
    onCellChange?: (job: JobRowItem, field: keyof JobRowItem, value: any) => void;
    onQuickAddJob?: (company: string, title: string, status: string, workModel: string) => void;
    isAddingRowActive?: boolean;
    onCloseAddingRow?: () => void;
}

/**
 * Clean Spreadsheet-Style Inline Editable Text Cell
 */
function InlineSpreadsheetCell({
    value,
    placeholder,
    onSave,
    textClassName = "",
    icon,
}: {
    value?: string | null;
    placeholder?: string;
    onSave?: (val: string) => void;
    textClassName?: string;
    icon?: React.ReactNode;
}) {
    const [currentVal, setCurrentVal] = useState(value || '');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setCurrentVal(value || '');
    }, [value]);

    const handleCommit = () => {
        setIsFocused(false);
        const trimmed = currentVal.trim();
        if (onSave && trimmed !== (value || '')) {
            onSave(trimmed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        } else if (e.key === 'Escape') {
            setCurrentVal(value || '');
            e.currentTarget.blur();
        }
    };

    return (
        <div 
            className="flex items-center gap-2 min-w-0 w-full"
            onClick={(e) => e.stopPropagation()}
        >
            {icon}
            <input
                type="text"
                value={currentVal}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={handleCommit}
                onChange={(e) => setCurrentVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full bg-transparent px-2.5 py-1.5 rounded-xl transition-all truncate outline-none ${
                    isFocused 
                        ? 'bg-white dark:bg-slate-950 border border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs' 
                        : 'border border-transparent hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                } ${textClassName}`}
                title={currentVal || placeholder}
            />
        </div>
    );
}

/**
 * Clean Spreadsheet-Style Inline Salary Cell
 */
function InlineSalaryCell({
    min,
    max,
    currency = 'IDR',
    period = 'monthly',
    isIndo,
    onSave
}: {
    min?: number | null;
    max?: number | null;
    currency?: string;
    period?: string;
    isIndo: boolean;
    onSave?: (minVal: number | null) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(min ? String(min) : '');

    useEffect(() => {
        setVal(min ? String(min) : '');
    }, [min]);

    const formatted = formatSalaryDisplay(min, max, currency, period, isIndo);

    const handleCommit = () => {
        setIsEditing(false);
        const cleaned = val.trim().replace(/\D/g, '');
        const parsed = cleaned ? Number(cleaned) : null;
        if (onSave && parsed !== min) {
            onSave(parsed);
        }
    };

    if (isEditing) {
        return (
            <div className="w-full" onClick={(e) => e.stopPropagation()}>
                <input
                    type="text"
                    autoFocus
                    value={val}
                    placeholder="15000000"
                    onChange={(e) => setVal(e.target.value)}
                    onBlur={handleCommit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur();
                        if (e.key === 'Escape') {
                            setVal(min ? String(min) : '');
                            setIsEditing(false);
                        }
                    }}
                    className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-950 border border-indigo-500 font-mono font-bold text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
            </div>
        );
    }

    return (
        <div 
            onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
            }}
            className="cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition group/salary w-full truncate"
            title={isIndo ? 'Klik untuk ubah kompensasi' : 'Click to edit compensation'}
        >
            {formatted ? (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-200 dark:border-emerald-800/80 inline-block truncate max-w-full">
                    {formatted}
                </span>
            ) : (
                <span className="text-slate-400 group-hover/salary:text-indigo-500 italic text-[11px]">
                    {isIndo ? '+ Atur Gaji' : '+ Set Salary'}
                </span>
            )}
        </div>
    );
}

export default function JobTable({ 
    jobs, 
    onEdit, 
    onDelete, 
    onScan, 
    onStatusChange,
    onCellChange,
    onQuickAddJob,
    isAddingRowActive,
    onCloseAddingRow
}: JobTableProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    // State for Inline Table Row Quick Add (Continuous Spreadsheet Entry)
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [newCompany, setNewCompany] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newLocation, setNewLocation] = useState('Remote');
    const [newStatus, setNewStatus] = useState('applied');
    const [newWorkModel, setNewWorkModel] = useState('remote');

    const companyInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Sync external active trigger
    useEffect(() => {
        if (isAddingRowActive) {
            setIsAddingRow(true);
            setTimeout(() => {
                companyInputRef.current?.focus();
            }, 60);
        }
    }, [isAddingRowActive]);

    const handleSaveNewRow = () => {
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

        // Reset inputs and keep row open for continuous spreadsheet-style data entry!
        setNewCompany('');
        setNewTitle('');
        setTimeout(() => {
            companyInputRef.current?.focus();
        }, 50);
    };

    const handleCloseAddRow = () => {
        setIsAddingRow(false);
        if (onCloseAddingRow) onCloseAddingRow();
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
            
            {/* Clean Table Top Header */}
            <div className="flex items-center justify-between gap-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {isIndo ? 'Daftar Spreadsheet Lamaran' : 'Application Spreadsheet Register'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-black border border-indigo-100 dark:border-indigo-900/40">
                        {jobs.length}
                    </span>
                </div>

                {!isAddingRow ? (
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingRow(true);
                            setTimeout(() => companyInputRef.current?.focus(), 50);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5 active:scale-95"
                    >
                        <Plus size={14} strokeWidth={3} />
                        <span>{isIndo ? '+ Baris Cepat (Spreadsheet)' : '+ Add Row (Spreadsheet)'}</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleCloseAddRow}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1"
                    >
                        <X size={13} />
                        <span>{isIndo ? 'Selesai / Tutup Baris' : 'Done / Close Row'}</span>
                    </button>
                )}
            </div>

            {/* ==================== MOBILE CARDS LAYOUT (<lg) ==================== */}
            <div className="lg:hidden space-y-3">

                {/* MOBILE QUICK ADD APPLICATION FORM (<lg) */}
                {isAddingRow && (
                    <div className="bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/40 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/10 space-y-3.5 animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                                <Sparkles size={14} className="text-indigo-500" />
                                <span>{isIndo ? 'Tambah Cepat Lamaran (Ketik Terus-Menerus)' : 'Continuous Application Entry'}</span>
                            </span>
                            <button
                                type="button"
                                onClick={handleCloseAddRow}
                                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                                title={isIndo ? 'Tutup' : 'Close'}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <input
                                type="text"
                                autoFocus
                                placeholder={isIndo ? 'Nama Perusahaan (cth: Google, Tokopedia)' : 'Company Name (e.g. Google)'}
                                value={newCompany}
                                onChange={(e) => setNewCompany(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveNewRow();
                                    if (e.key === 'Escape') handleCloseAddRow();
                                }}
                                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                            />
                            <input
                                type="text"
                                placeholder={isIndo ? 'Posisi / Role (cth: Frontend Engineer)' : 'Job Title / Role (e.g. Frontend Dev)'}
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveNewRow();
                                    if (e.key === 'Escape') handleCloseAddRow();
                                }}
                                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                                    {isIndo ? 'Model Kerja' : 'Work Model'}
                                </label>
                                <select
                                    value={newWorkModel}
                                    onChange={(e) => setNewWorkModel(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shadow-xs"
                                >
                                    <option value="remote">Remote 🌐</option>
                                    <option value="hybrid">Hybrid 🏢</option>
                                    <option value="onsite">Onsite 📍</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                                    {isIndo ? 'Status Awal' : 'Initial Status'}
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none shadow-xs"
                                >
                                    <option value="wishlist">💭 Wishlist</option>
                                    <option value="applied">📤 Applied</option>
                                    <option value="interview">🎯 Interview</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleSaveNewRow}
                                className="flex-1 py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-1.5"
                            >
                                <Check size={15} strokeWidth={3} />
                                <span>{isIndo ? 'Simpan & Tambah Lagi' : 'Save & Add Another'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCloseAddRow}
                                className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition"
                            >
                                {isIndo ? 'Tutup' : 'Close'}
                            </button>
                        </div>
                    </div>
                )}

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
                                        title={isIndo ? 'Buka Panel Samping' : 'Open Side Panel'}
                                    >
                                        <PanelRightOpen size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(job);
                                        }}
                                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition shadow-sm"
                                        title={isIndo ? 'Hapus Lamaran' : 'Delete Application'}
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
                    <table className="w-full text-left border-collapse min-w-[980px]">
                        <thead className="bg-slate-50/90 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="py-3 px-4 min-w-[160px]">
                                    {isIndo ? 'Perusahaan' : 'Company'}
                                </th>
                                <th className="py-3 px-4 min-w-[170px]">
                                    {isIndo ? 'Posisi / Role' : 'Job Title'}
                                </th>
                                <th className="py-3 px-3 min-w-[130px]">
                                    {isIndo ? 'Lokasi & Model' : 'Location & Model'}
                                </th>
                                <th className="py-3 px-3 min-w-[130px]">
                                    {isIndo ? 'Kompensasi Gaji' : 'Salary Range'}
                                </th>
                                <th className="py-3 px-3 min-w-[110px]">
                                    {isIndo ? 'Tgl Melamar' : 'Applied Date'}
                                </th>
                                <th className="py-3 px-3 min-w-[130px]">
                                    {isIndo ? 'Tahapan Status' : 'Status'}
                                </th>
                                <th className="py-3 px-2 min-w-[80px] text-center">
                                    {isIndo ? 'Interview' : 'Interviews'}
                                </th>
                                <th className="py-3 px-3 text-center min-w-[110px] w-[120px] shrink-0">
                                    {isIndo ? 'Aksi' : 'Actions'}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                            
                            {/* INLINE QUICK ADD ROW IN TABLE (SPREADSHEET RAPID ENTRY) */}
                            {isAddingRow && (
                                <tr className="bg-indigo-50/60 dark:bg-indigo-950/40 border-b-2 border-indigo-500 animate-in fade-in duration-200">
                                    {/* Company Input */}
                                    <td className="py-2.5 px-3 sm:px-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs shrink-0 border border-indigo-200 dark:border-indigo-800">
                                                    {newCompany ? newCompany.charAt(0).toUpperCase() : '💼'}
                                                </div>
                                                <input
                                                    ref={companyInputRef}
                                                    type="text"
                                                    autoFocus
                                                    placeholder={isIndo ? 'Nama Perusahaan (cth: Google)' : 'Company Name'}
                                                    value={newCompany}
                                                    onChange={(e) => setNewCompany(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveNewRow();
                                                        if (e.key === 'Escape') handleCloseAddRow();
                                                    }}
                                                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
                                                />
                                            </div>
                                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block pl-9">
                                                ↵ Enter: Simpan & Lanjut Baris Baru
                                            </span>
                                        </div>
                                    </td>

                                    {/* Title Input */}
                                    <td className="py-2.5 px-3 sm:px-4">
                                        <input
                                            ref={titleInputRef}
                                            type="text"
                                            placeholder={isIndo ? 'Posisi / Role (cth: Frontend)' : 'Job Title'}
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveNewRow();
                                                if (e.key === 'Escape') handleCloseAddRow();
                                            }}
                                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
                                        />
                                    </td>

                                    {/* Model & Location Selector */}
                                    <td className="py-2.5 px-3">
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
                                    <td className="py-2.5 px-3 text-slate-400 italic text-[11px]">
                                        {isIndo ? 'Atur di sel tabel' : 'Set in cell'}
                                    </td>

                                    {/* Date */}
                                    <td className="py-2.5 px-3 font-mono text-slate-500">
                                        {new Date().toISOString().split('T')[0]}
                                    </td>

                                    {/* Status Selector */}
                                    <td className="py-2.5 px-3">
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

                                    <td className="py-2.5 px-2 text-center text-slate-400">-</td>

                                    {/* Save / Cancel buttons */}
                                    <td className="py-2.5 px-3 text-center min-w-[100px] w-[110px] shrink-0">
                                        <div className="flex items-center justify-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                onClick={handleSaveNewRow}
                                                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-md transition shrink-0"
                                                title={isIndo ? 'Simpan & Tambah Baris Berikutnya' : 'Save & Add Next Row'}
                                            >
                                                <Check size={16} strokeWidth={3} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCloseAddRow}
                                                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition shrink-0"
                                                title={isIndo ? 'Selesai / Tutup' : 'Done / Close'}
                                            >
                                                <X size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {jobs.map((job) => {
                                const roundCount = job.interview_rounds?.length || 0;

                                return (
                                    <tr 
                                        key={job.id}
                                        className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors group"
                                    >
                                        {/* Company with Avatar Initial (Spreadsheet Cell) */}
                                        <td className="py-2 px-3 sm:px-4">
                                            <InlineSpreadsheetCell
                                                value={job.company}
                                                placeholder={isIndo ? 'Perusahaan' : 'Company'}
                                                onSave={(val) => onCellChange && onCellChange(job, 'company', val)}
                                                textClassName="font-bold text-slate-800 dark:text-slate-100 text-xs"
                                                icon={
                                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                                        {job.company ? job.company.charAt(0).toUpperCase() : '💼'}
                                                    </div>
                                                }
                                            />
                                        </td>

                                        {/* Job Title / Role (Spreadsheet Cell) */}
                                        <td className="py-2 px-3 sm:px-4">
                                            <InlineSpreadsheetCell
                                                value={job.title}
                                                placeholder={isIndo ? 'Posisi / Role' : 'Job Title'}
                                                onSave={(val) => onCellChange && onCellChange(job, 'title', val)}
                                                textClassName="font-black text-slate-800 dark:text-white text-xs group-hover:text-indigo-600"
                                            />
                                        </td>

                                        {/* Location & Model (Inline Spreadsheet Cells) */}
                                        <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="space-y-1 min-w-[120px]">
                                                <InlineSpreadsheetCell
                                                    value={job.location || ''}
                                                    placeholder={isIndo ? 'Lokasi' : 'Location'}
                                                    onSave={(val) => onCellChange && onCellChange(job, 'location', val)}
                                                    textClassName="font-bold text-slate-700 dark:text-slate-200 text-xs"
                                                />
                                                <select
                                                    value={job.work_model || 'remote'}
                                                    onChange={(e) => onCellChange && onCellChange(job, 'work_model', e.target.value)}
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:border-indigo-400 transition"
                                                >
                                                    <option value="remote">Remote 🌐</option>
                                                    <option value="hybrid">Hybrid 🏢</option>
                                                    <option value="onsite">On-site 📍</option>
                                                </select>
                                            </div>
                                        </td>

                                        {/* Salary Range (Spreadsheet Inline Editable Cell) */}
                                        <td className="py-2 px-3 min-w-[130px]">
                                            <InlineSalaryCell
                                                min={job.salary_min}
                                                max={job.salary_max}
                                                currency={job.salary_currency}
                                                period={job.salary_period}
                                                isIndo={isIndo}
                                                onSave={(val) => onCellChange && onCellChange(job, 'salary_min', val)}
                                            />
                                        </td>

                                        {/* Applied Date (Inline Editable Date Cell) */}
                                        <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="date"
                                                value={job.applied_date || ''}
                                                onChange={(e) => onCellChange && onCellChange(job, 'applied_date', e.target.value)}
                                                className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 px-1.5 py-1 rounded-lg text-xs font-mono font-bold text-slate-600 dark:text-slate-300 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 outline-none cursor-pointer transition"
                                                title={isIndo ? 'Klik untuk ubah tanggal lamar' : 'Click to change applied date'}
                                            />
                                        </td>

                                        {/* Status Dropdown */}
                                        <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                                            <JobStatusDropdown
                                                value={job.status}
                                                onChange={(val) => onStatusChange(job, val)}
                                            />
                                        </td>

                                        {/* Interview Rounds */}
                                        <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                                            {roundCount > 0 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 transition inline-flex items-center gap-1"
                                                    title={isIndo ? 'Buka jadwal wawancara di panel' : 'Open interview rounds in side panel'}
                                                >
                                                    <Calendar size={11} />
                                                    <span>{roundCount} {isIndo ? 'Ronde' : 'Rounds'}</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition"
                                                    title={isIndo ? 'Tambah jadwal interview' : 'Add interview schedule'}
                                                >
                                                    + {isIndo ? 'Tambah' : 'Add'}
                                                </button>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-2 px-3 text-center min-w-[110px] w-[120px] shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onScan(job)}
                                                    className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 transition"
                                                    title={isIndo ? 'Cek Keselarasan ATS' : 'ATS Match Scan'}
                                                >
                                                    <Sparkles size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(job)}
                                                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                                                    title={isIndo ? 'Buka Panel Samping (Detail & STAR)' : 'Open Side Panel (Details & STAR)'}
                                                >
                                                    <PanelRightOpen size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(job);
                                                    }}
                                                    className="p-1.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                                                    title={isIndo ? 'Hapus Lamaran' : 'Delete Application'}
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
                                    <td colSpan={8} className="py-20 text-center text-slate-400">
                                        <div className="max-w-xs mx-auto space-y-3">
                                            <span className="text-3xl block">📑</span>
                                            <p className="text-xs font-bold">
                                                {isIndo ? 'Belum ada data lamaran di spreadsheet.' : 'No applications in spreadsheet yet.'}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsAddingRow(true);
                                                    setTimeout(() => companyInputRef.current?.focus(), 50);
                                                }}
                                                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                                            >
                                                {isIndo ? '+ Tambah Baris Pertama' : '+ Add First Row'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* BOTTOM ROW SPREADSHEET RAPID TRIGGER */}
                            {jobs.length > 0 && !isAddingRow && (
                                <tr>
                                    <td colSpan={8} className="py-2.5 px-6 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingRow(true);
                                                setTimeout(() => companyInputRef.current?.focus(), 80);
                                            }}
                                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 transition py-1 px-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                            <span>{isIndo ? '+ Tambah Baris Baru (Mode Spreadsheet)' : '+ Add Row (Spreadsheet Mode)'}</span>
                                        </button>
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
