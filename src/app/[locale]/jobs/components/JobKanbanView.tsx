'use client';

import React, { useState, useRef } from 'react';
import { useLocale } from 'next-intl';
import { 
    Plus, Sparkles, Calendar, DollarSign, MapPin, 
    Clock, Building2, ChevronRight, ChevronLeft, 
    Trash2, Edit3, CheckCircle2, AlertCircle, Link as LinkIcon,
    X, Check, ArrowRight, ArrowLeft, MoreHorizontal, Minimize2, Maximize2
} from 'lucide-react';
import { JobRowItem, formatSalaryDisplay } from '../lib/jobAnalytics';

interface JobKanbanViewProps {
    jobs: JobRowItem[];
    onEdit: (job: JobRowItem) => void;
    onDelete: (id: number | string) => void;
    onStatusChange: (job: JobRowItem, newStatus: string) => void;
    onScan: (job: JobRowItem) => void;
    onAddInColumn?: (status: string) => void;
    onQuickAddJob?: (company: string, title: string, status: string, workModel?: string) => void;
}

export default function JobKanbanView({
    jobs,
    onEdit,
    onDelete,
    onStatusChange,
    onScan,
    onAddInColumn,
    onQuickAddJob
}: JobKanbanViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // State for Inline Quick Add in specific column
    const [inlineAddingColumn, setInlineAddingColumn] = useState<string | null>(null);
    const [inlineCompany, setInlineCompany] = useState('');
    const [inlineTitle, setInlineTitle] = useState('');
    const [inlineWorkModel, setInlineWorkModel] = useState<string>('remote');

    // Drag over column state for visual highlight
    const [dragOverColId, setDragOverColId] = useState<string | null>(null);

    // Collapsed columns set (for compact view)
    const [collapsedCols, setCollapsedCols] = useState<Record<string, boolean>>({});

    const columns = [
        {
            id: 'wishlist',
            title: isIndo ? 'Daftar Incaran' : 'Wishlist',
            icon: '💭',
            color: 'border-t-blue-500',
            glowColor: 'group-hover:border-blue-500/50',
            bgBadge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
        },
        {
            id: 'applied',
            title: isIndo ? 'Telah Dilamar' : 'Applied',
            icon: '📤',
            color: 'border-t-amber-500',
            glowColor: 'group-hover:border-amber-500/50',
            bgBadge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        },
        {
            id: 'interview',
            title: isIndo ? 'Proses Interview' : 'Interviewing',
            icon: '🎯',
            color: 'border-t-purple-500',
            glowColor: 'group-hover:border-purple-500/50',
            bgBadge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
        },
        {
            id: 'offer',
            title: isIndo ? 'Tawaran Kerja' : 'Job Offer',
            icon: '🎉',
            color: 'border-t-emerald-500',
            glowColor: 'group-hover:border-emerald-500/50',
            bgBadge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        },
        {
            id: 'accepted',
            title: isIndo ? 'Diterima 🏆' : 'Accepted 🏆',
            icon: '✅',
            color: 'border-t-green-600',
            glowColor: 'group-hover:border-green-500/50',
            bgBadge: 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
        },
        {
            id: 'rejected',
            title: isIndo ? 'Belum Berjodoh' : 'Archived / Rejected',
            icon: '❌',
            color: 'border-t-slate-400',
            glowColor: 'group-hover:border-slate-500/50',
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

    const toggleCollapse = (colId: string) => {
        setCollapsedCols(prev => ({ ...prev, [colId]: !prev[colId] }));
    };

    const scrollHorizontally = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = direction === 'left' ? -350 : 350;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const handleSubmitInlineAdd = (columnId: string) => {
        if (!inlineCompany.trim() && !inlineTitle.trim()) return;

        let comp = inlineCompany.trim();
        let tit = inlineTitle.trim();

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
            onQuickAddJob(comp, tit, columnId, inlineWorkModel);
        } else if (onAddInColumn) {
            onAddInColumn(columnId);
        }

        // Reset inline input
        setInlineCompany('');
        setInlineTitle('');
        setInlineAddingColumn(null);
    };

    // Drag & Drop Handlers
    const handleDragStart = (e: React.DragEvent, jobId: number | string) => {
        e.dataTransfer.setData('text/plain', String(jobId));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverColId !== columnId) {
            setDragOverColId(columnId);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverColId(null);
    };

    const handleDrop = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        setDragOverColId(null);
        const jobIdStr = e.dataTransfer.getData('text/plain');
        if (!jobIdStr) return;

        const targetJob = jobs.find(j => String(j.id) === jobIdStr);
        if (targetJob && targetJob.status !== columnId) {
            onStatusChange(targetJob, columnId);
        }
    };

    return (
        <div className="relative w-full space-y-2">
            
            {/* Top Lateral Navigation Buttons Bar */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-bold">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {isIndo ? 'Geser Pipeline Papan Lamaran:' : 'Pipeline Stage Columns:'}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => scrollHorizontally('left')}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition active:scale-95"
                        title={isIndo ? 'Geser Kiri' : 'Scroll Left'}
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollHorizontally('right')}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition active:scale-95"
                        title={isIndo ? 'Geser Kanan' : 'Scroll Right'}
                    >
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* FIXED-VIEWPORT KANBAN CONTAINER WITH PINNED HORIZONTAL SCROLLBAR */}
            <div 
                ref={scrollContainerRef}
                className="w-full h-[calc(100vh-270px)] min-h-[520px] max-h-[820px] overflow-x-auto overflow-y-hidden custom-scrollbar pb-3 select-none"
            >
                <div className="flex gap-4 h-full min-w-[1380px] items-stretch pr-4">
                    
                    {columns.map((col) => {
                        const colJobs = jobs.filter(j => (j.status || 'wishlist') === col.id);
                        const isInlineAdding = inlineAddingColumn === col.id;
                        const isDragOver = dragOverColId === col.id;
                        const isCollapsed = collapsedCols[col.id] || false;

                        if (isCollapsed) {
                            return (
                                <div
                                    key={col.id}
                                    onClick={() => toggleCollapse(col.id)}
                                    className="w-14 h-full bg-slate-100/70 dark:bg-slate-900/60 rounded-3xl p-3 border border-slate-200/70 dark:border-slate-800 flex flex-col items-center justify-between cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                                >
                                    <span className="text-lg">{col.icon}</span>
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 rotate-90 truncate whitespace-nowrap">
                                        {col.title} ({colJobs.length})
                                    </span>
                                    <Maximize2 size={14} className="text-slate-400" />
                                </div>
                            );
                        }

                        return (
                            <div 
                                key={col.id}
                                onDragOver={(e) => handleDragOver(e, col.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, col.id)}
                                className={`flex-1 min-w-[285px] max-w-[340px] flex flex-col h-full bg-slate-100/60 dark:bg-slate-900/50 rounded-3xl p-3.5 border border-t-4 ${col.color} transition-all duration-200 ${
                                    isDragOver 
                                        ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/50 scale-[1.01]' 
                                        : 'border-slate-200/70 dark:border-slate-800/80 shadow-sm'
                                }`}
                            >
                                {/* 1. STICKY COLUMN HEADER */}
                                <div className="flex items-center justify-between pb-3 px-1 shrink-0 border-b border-slate-200/50 dark:border-slate-800/50 mb-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-base">{col.icon}</span>
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
                                            {col.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black border ${col.bgBadge}`}>
                                            {colJobs.length}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInlineCompany('');
                                                setInlineTitle('');
                                                setInlineAddingColumn(col.id);
                                            }}
                                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 flex items-center justify-center transition"
                                            title={isIndo ? 'Tambah cepat di kolom ini' : 'Quick add in column'}
                                        >
                                            <Plus size={13} strokeWidth={3} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleCollapse(col.id)}
                                            className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center transition"
                                            title={isIndo ? 'Ciutkan kolom' : 'Collapse column'}
                                        >
                                            <Minimize2 size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* INLINE QUICK ADD BOX IN COLUMN */}
                                {isInlineAdding && (
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border-2 border-indigo-500 shadow-lg space-y-2.5 mb-3 shrink-0 animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                <Sparkles size={11} /> ⚡ Fast Add
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setInlineAddingColumn(null)}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                <X size={13} />
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder={isIndo ? 'Perusahaan (misal: Shopee)' : 'Company (e.g. Stripe)'}
                                            value={inlineCompany}
                                            onChange={(e) => setInlineCompany(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSubmitInlineAdd(col.id);
                                                if (e.key === 'Escape') setInlineAddingColumn(null);
                                            }}
                                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />

                                        <input
                                            type="text"
                                            placeholder={isIndo ? 'Posisi (misal: AI Engineer)' : 'Job Title (e.g. AI Engineer)'}
                                            value={inlineTitle}
                                            onChange={(e) => setInlineTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSubmitInlineAdd(col.id);
                                                if (e.key === 'Escape') setInlineAddingColumn(null);
                                            }}
                                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />

                                        <div className="flex items-center justify-between gap-2 pt-0.5">
                                            <select
                                                value={inlineWorkModel}
                                                onChange={(e) => setInlineWorkModel(e.target.value)}
                                                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer"
                                            >
                                                <option value="remote">Remote 🌐</option>
                                                <option value="hybrid">Hybrid 🏢🌐</option>
                                                <option value="onsite">Onsite 🏢</option>
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => handleSubmitInlineAdd(col.id)}
                                                className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm flex items-center gap-1 active:scale-95 transition"
                                            >
                                                <Check size={12} />
                                                <span>{isIndo ? 'Tambah' : 'Add'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* 2. INDEPENDENT SCROLLABLE CARDS CONTAINER */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1 min-h-0">
                                    {colJobs.map((job) => {
                                        const wmBadge = getWorkModelBadge(job.work_model);
                                        const nextSt = getNextStatus(job.status);
                                        const prevSt = getPrevStatus(job.status);
                                        const salaryStr = formatSalaryDisplay(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, isIndo);

                                        return (
                                            <div
                                                key={job.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, job.id)}
                                                onClick={() => onEdit(job)}
                                                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 space-y-2.5 group relative cursor-pointer active:cursor-grabbing hover:-translate-y-0.5"
                                            >
                                                {/* Company & Title Header */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                                            {job.company ? job.company.charAt(0).toUpperCase() : '💼'}
                                                        </div>
                                                        <div className="space-y-0.5 min-w-0">
                                                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">
                                                                {job.company || (isIndo ? 'Perusahaan' : 'Company')}
                                                            </span>
                                                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 transition leading-snug">
                                                                {job.title || (isIndo ? 'Posisi Pekerjaan' : 'Job Title')}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    {/* Quick Action Icons */}
                                                    <div className="flex items-center gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type="button"
                                                            onClick={() => onEdit(job)}
                                                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                                                            title="Inspect"
                                                        >
                                                            <Edit3 size={12} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onDelete(job.id)}
                                                            className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Badges Row */}
                                                <div className="flex flex-wrap gap-1 items-center text-[9px] font-bold">
                                                    {job.location && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/60 flex items-center gap-0.5">
                                                            <MapPin size={9} />
                                                            <span className="truncate max-w-[100px]">{job.location}</span>
                                                        </span>
                                                    )}

                                                    {wmBadge && (
                                                        <span className={`px-1.5 py-0.5 rounded-md border ${wmBadge.color}`}>
                                                            {wmBadge.text}
                                                        </span>
                                                    )}

                                                    {(job.salary_min || job.salary_max) && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                                                            💰 {salaryStr}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Interview schedule note if any */}
                                                {job.interview_rounds && job.interview_rounds.length > 0 && (
                                                    <div className="p-1.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-[10px] font-bold text-purple-700 dark:text-purple-300 flex items-center justify-between">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={11} />
                                                            <span>{job.interview_rounds.length} {isIndo ? 'Rounds' : 'Rounds'}</span>
                                                        </span>
                                                        <span className="text-[9px] opacity-80 uppercase">
                                                            {job.interview_rounds[job.interview_rounds.length - 1].status}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Card Footer: ATS Scan + Stage Shift */}
                                                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1 text-[10px]" onClick={(e) => e.stopPropagation()}>
                                                    
                                                    {/* ATS Scan Trigger */}
                                                    <button
                                                        type="button"
                                                        onClick={() => onScan(job)}
                                                        className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider flex items-center gap-1 transition"
                                                    >
                                                        <Sparkles size={11} />
                                                        <span>ATS</span>
                                                    </button>

                                                    {/* Move Previous / Next Stage */}
                                                    <div className="flex items-center gap-1">
                                                        {prevSt && (
                                                            <button
                                                                type="button"
                                                                onClick={() => onStatusChange(job, prevSt)}
                                                                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition"
                                                                title={isIndo ? 'Kembalikan tahap' : 'Move back'}
                                                            >
                                                                <ChevronLeft size={13} />
                                                            </button>
                                                        )}
                                                        {nextSt && (
                                                            <button
                                                                type="button"
                                                                onClick={() => onStatusChange(job, nextSt)}
                                                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300 font-bold flex items-center gap-0.5 transition"
                                                                title={isIndo ? 'Lanjut ke tahap berikutnya' : 'Move forward'}
                                                            >
                                                                <span>{isIndo ? 'Lanjut' : 'Next'}</span>
                                                                <ChevronRight size={11} />
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    })}

                                    {colJobs.length === 0 && !isInlineAdding && (
                                        <div className="py-12 text-center border-2 border-dashed border-slate-200/60 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs font-bold">
                                            <span>{isIndo ? 'Kosong' : 'Empty'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 3. COLUMN FOOTER: Quick Add Button */}
                                {!isInlineAdding && (
                                    <div className="pt-2 shrink-0 border-t border-slate-200/50 dark:border-slate-800/50 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInlineCompany('');
                                                setInlineTitle('');
                                                setInlineAddingColumn(col.id);
                                            }}
                                            className="w-full py-2 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold transition flex items-center justify-center gap-1"
                                        >
                                            <Plus size={13} strokeWidth={2.5} />
                                            <span>{isIndo ? '+ Tambah Kartu' : '+ Add Card'}</span>
                                        </button>
                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>
            </div>

        </div>
    );
}
