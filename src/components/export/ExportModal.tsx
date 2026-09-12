'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Download, 
    FileSpreadsheet, 
    FileCode, 
    Calendar as CalendarIcon, 
    X, 
    Sparkles, 
    Check, 
    Loader2,
    Database,
    ShieldCheck,
    Layers
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import {
    ExportPeriodType,
    ExportFilterOptions,
    downloadFile,
    getExportFilename,
    getPeriodLabel,
    generateJson,
    serializeHabitsToCsv,
    serializePlannerToCsv,
    serializeFinanceToCsv,
    serializeStudyToCsv,
    serializeJournalToCsv,
    serializeCalendarToCsv,
    serializeJobsToCsv,
    serializeGoalsToCsv,
    serializeAllModulesToCsv
} from '@/utils/exportEngine';

export type ExportModuleType =
    | 'habits'
    | 'planner'
    | 'finance'
    | 'study'
    | 'journal'
    | 'calendar'
    | 'jobs'
    | 'goals'
    | 'all';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleType: ExportModuleType;
    defaultYear?: number;
    defaultMonth?: number;
    currentData?: any[]; // In-memory data shortcut if already loaded
}

const MODULE_TITLES: Record<ExportModuleType, { id: string; en: string }> = {
    habits: { id: 'Habits Tracker', en: 'Habits Tracker' },
    planner: { id: 'Daily Planner & Timeline', en: 'Daily Planner & Timeline' },
    finance: { id: 'Finance Transactions & Budget', en: 'Finance Transactions & Budget' },
    study: { id: 'Academic & Study Vault', en: 'Academic & Study Vault' },
    journal: { id: 'Reflective Journal', en: 'Reflective Journal' },
    calendar: { id: 'Unified Calendar Events', en: 'Unified Calendar Events' },
    jobs: { id: 'Career & Job Applications', en: 'Career & Job Applications' },
    goals: { id: 'Strategic Life Goals', en: 'Strategic Life Goals' },
    all: { id: 'Seluruh Database Tranvas (Complete Backup)', en: 'Complete Tranvas Database (Unified Backup)' }
};

export default function ExportModal({
    isOpen,
    onClose,
    moduleType,
    defaultYear,
    defaultMonth,
    currentData
}: ExportModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const currentYear = new Date().getFullYear();
    const currentMonthNum = new Date().getMonth() + 1;

    // State
    const [format, setFormat] = useState<'csv' | 'json'>('csv');
    const [periodType, setPeriodType] = useState<ExportPeriodType>('all');
    const [selectedYear, setSelectedYear] = useState<number>(defaultYear || currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number>(defaultMonth || currentMonthNum);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // Month names
    const monthNames = isIndo
        ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Available years: 5 years back to current
    const availableYears = useMemo(() => {
        const years: number[] = [];
        for (let y = currentYear + 1; y >= currentYear - 5; y--) {
            years.push(y);
        }
        return years;
    }, [currentYear]);

    // Reset feedback on open
    useEffect(() => {
        if (isOpen) {
            setIsSuccess(false);
            setIsExporting(false);
            if (defaultYear) setSelectedYear(defaultYear);
            if (defaultMonth) setSelectedMonth(defaultMonth);
        }
    }, [isOpen, defaultYear, defaultMonth]);

    if (!isOpen) return null;

    const filterOptions: ExportFilterOptions = {
        periodType,
        year: selectedYear,
        month: selectedMonth
    };

    const handleExecuteExport = async () => {
        setIsExporting(true);
        setIsSuccess(false);

        try {
            const periodParam = periodType === 'all' 
                ? 'all' 
                : periodType === 'year' 
                    ? `${selectedYear}` 
                    : `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

            let fileContent = '';
            const filename = getExportFilename(moduleType, format, filterOptions);
            const mimeType = format === 'csv' ? 'text/csv' : 'application/json';

            // 1. ALL MODULES UNIFIED
            if (moduleType === 'all') {
                const [finRes, habRes, planRes, jrnRes, calRes, jobRes, goalRes, stdRes] = await Promise.all([
                    fetch('/api/finance/transactions?month=all').catch(() => null),
                    fetch('/api/habits?period=all').catch(() => null),
                    fetch('/api/planner/tasks?month=all').catch(() => null),
                    fetch('/api/journals?period=all').catch(() => null),
                    fetch('/api/calendar?period=all').catch(() => null),
                    fetch('/api/jobs').catch(() => null),
                    fetch('/api/goals').catch(() => null),
                    fetch('/api/study/courses').catch(() => null)
                ]);

                const bundle: Record<string, any[]> = {
                    finance: (finRes?.ok ? await finRes.json() : []) || [],
                    habits: (habRes?.ok ? await habRes.json() : []) || [],
                    planner: (planRes?.ok ? await planRes.json() : []) || [],
                    journal: (jrnRes?.ok ? await jrnRes.json() : []) || [],
                    calendar: (calRes?.ok ? await calRes.json() : []) || [],
                    jobs: (jobRes?.ok ? await jobRes.json() : []) || [],
                    goals: (goalRes?.ok ? await goalRes.json() : []) || [],
                    study: (stdRes?.ok ? await stdRes.json() : []) || []
                };

                if (format === 'json') {
                    fileContent = generateJson('all_modules_unified', filterOptions, bundle);
                } else {
                    fileContent = serializeAllModulesToCsv(bundle);
                }
            } 
            // 2. HABITS
            else if (moduleType === 'habits') {
                let data = currentData;
                if (!data || periodType !== 'month') {
                    const res = await fetch(`/api/habits?period=${periodParam}`);
                    if (res.ok) data = await res.json();
                }
                const habits = Array.isArray(data) ? data : [];
                fileContent = format === 'csv' 
                    ? serializeHabitsToCsv(habits, filterOptions) 
                    : generateJson('habits', filterOptions, habits);
            }
            // 3. PLANNER
            else if (moduleType === 'planner') {
                let data = currentData;
                if (!data || periodType !== 'month') {
                    const res = await fetch(`/api/planner/tasks?month=${periodParam}`);
                    if (res.ok) data = await res.json();
                }
                const tasks = Array.isArray(data) ? data : [];
                fileContent = format === 'csv'
                    ? serializePlannerToCsv(tasks, filterOptions)
                    : generateJson('planner', filterOptions, tasks);
            }
            // 4. FINANCE
            else if (moduleType === 'finance') {
                let data = currentData;
                if (!data || periodType !== 'month') {
                    const res = await fetch(`/api/finance/transactions?month=${periodParam}`);
                    if (res.ok) data = await res.json();
                }
                const txs = Array.isArray(data) ? data : [];
                fileContent = format === 'csv'
                    ? serializeFinanceToCsv(txs, filterOptions)
                    : generateJson('finance', filterOptions, txs);
            }
            // 5. STUDY
            else if (moduleType === 'study') {
                let data = currentData;
                if (!data) {
                    const res = await fetch('/api/study/courses');
                    if (res.ok) data = await res.json();
                }
                const courses = Array.isArray(data) ? data : [];
                fileContent = format === 'csv'
                    ? serializeStudyToCsv(courses, filterOptions)
                    : generateJson('study', filterOptions, courses);
            }
            // 6. JOURNAL
            else if (moduleType === 'journal') {
                let data = currentData;
                if (!data || periodType !== 'all') {
                    const res = await fetch(`/api/journals?period=${periodParam}`);
                    if (res.ok) data = await res.json();
                }
                const journals = Array.isArray(data) ? data : [];
                fileContent = format === 'csv'
                    ? serializeJournalToCsv(journals, filterOptions)
                    : generateJson('journal', filterOptions, journals);
            }
            // 7. CALENDAR
            else if (moduleType === 'calendar') {
                let data = currentData;
                if (!data || periodType !== 'month') {
                    const res = await fetch(`/api/calendar?period=${periodParam}`);
                    if (res.ok) {
                        const json = await res.json();
                        data = json.events || (Array.isArray(json) ? json : []);
                    }
                }
                const events = Array.isArray(data) ? data : [];
                fileContent = format === 'csv'
                    ? serializeCalendarToCsv(events, filterOptions)
                    : generateJson('calendar', filterOptions, events);
            }
            // 8. JOBS
            else if (moduleType === 'jobs') {
                let data = currentData;
                if (!data) {
                    const res = await fetch('/api/jobs');
                    if (res.ok) data = await res.json();
                }
                let jobs = Array.isArray(data) ? data : [];
                // Filter by year/month if applied
                if (periodType === 'year' && selectedYear) {
                    jobs = jobs.filter(j => {
                        const dateStr = j.applied_date || j.appliedDate;
                        return dateStr && dateStr.startsWith(`${selectedYear}`);
                    });
                } else if (periodType === 'month' && selectedYear && selectedMonth) {
                    const ym = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
                    jobs = jobs.filter(j => {
                        const dateStr = j.applied_date || j.appliedDate;
                        return dateStr && dateStr.startsWith(ym);
                    });
                }
                fileContent = format === 'csv'
                    ? serializeJobsToCsv(jobs, filterOptions)
                    : generateJson('jobs', filterOptions, jobs);
            }
            // 9. GOALS
            else if (moduleType === 'goals') {
                let data = currentData;
                if (!data) {
                    const res = await fetch('/api/goals');
                    if (res.ok) data = await res.json();
                }
                let goals = Array.isArray(data) ? data : [];
                if (periodType === 'year' && selectedYear) {
                    goals = goals.filter(g => {
                        const dateStr = g.deadline || g.created_at;
                        return dateStr && dateStr.startsWith(`${selectedYear}`);
                    });
                }
                fileContent = format === 'csv'
                    ? serializeGoalsToCsv(goals, filterOptions)
                    : generateJson('goals', filterOptions, goals);
            }

            // Trigger browser download
            downloadFile(fileContent, filename, mimeType);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 1500);

        } catch (error) {
            console.error('Export failed:', error);
            alert(isIndo ? 'Gagal mengekspor data. Silakan coba lagi.' : 'Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const moduleTitle = MODULE_TITLES[moduleType]?.[locale === 'id' ? 'id' : 'en'] || moduleType;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
                <div 
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Top Glow & Accent */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                                <Download size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                    {isIndo ? 'Ekspor Data' : 'Export Data'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {moduleTitle}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* 1. Format Selection */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5 block">
                                {isIndo ? '1. Pilih Format File' : '1. Choose File Format'}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* CSV Option */}
                                <button
                                    type="button"
                                    onClick={() => setFormat('csv')}
                                    className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                        format === 'csv'
                                            ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-950 dark:text-white ring-2 ring-indigo-500/20'
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                                            <FileSpreadsheet size={16} />
                                        </div>
                                        {format === 'csv' && (
                                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                <Check size={12} strokeWidth={3} />
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">CSV (.csv)</p>
                                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                            {isIndo ? 'Excel, Google Sheets, & tabel data' : 'Excel, Google Sheets, & tables'}
                                        </p>
                                    </div>
                                    <span className="mt-2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md w-fit">
                                        UTF-8 BOM Ready
                                    </span>
                                </button>

                                {/* JSON Option */}
                                <button
                                    type="button"
                                    onClick={() => setFormat('json')}
                                    className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                        format === 'json'
                                            ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-950 dark:text-white ring-2 ring-indigo-500/20'
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                                            <FileCode size={16} />
                                        </div>
                                        {format === 'json' && (
                                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                <Check size={12} strokeWidth={3} />
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">JSON (.json)</p>
                                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                            {isIndo ? 'Backup lengkap & portabilitas data' : 'Full backup & structured data'}
                                        </p>
                                    </div>
                                    <span className="mt-2 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md w-fit">
                                        Structured Tree
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* 2. Time Range Selection (Termasuk Semua Bulan / Per Tahun) */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5 block">
                                {isIndo ? '2. Rentang Waktu' : '2. Date Range Scope'}
                            </label>
                            
                            <div className="space-y-2">
                                {/* All Time */}
                                <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                                    periodType === 'all'
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-white'
                                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                }`}>
                                    <div className="flex items-center gap-2.5">
                                        <input 
                                            type="radio" 
                                            name="periodType" 
                                            value="all" 
                                            checked={periodType === 'all'} 
                                            onChange={() => setPeriodType('all')}
                                            className="accent-indigo-600"
                                        />
                                        <div>
                                            <p className="text-xs font-bold">
                                                {isIndo ? '🌐 Sepanjang Waktu (Semua Bulan & Tahun)' : '🌐 All Time (All Months & Years)'}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {isIndo ? 'Ekspor seluruh riwayat data tanpa batas' : 'Export full historical dataset'}
                                            </p>
                                        </div>
                                    </div>
                                </label>

                                {/* Per Tahun */}
                                <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                                    periodType === 'year'
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-white'
                                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                }`}>
                                    <div className="flex items-center gap-2.5 flex-1">
                                        <input 
                                            type="radio" 
                                            name="periodType" 
                                            value="year" 
                                            checked={periodType === 'year'} 
                                            onChange={() => setPeriodType('year')}
                                            className="accent-indigo-600"
                                        />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">
                                                {isIndo ? '📅 Per Tahun (Semua Bulan dalam 1 Tahun)' : '📅 By Year (All Months in Year)'}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {isIndo ? 'Mencakup 12 bulan penuh pada tahun yang dipilih' : 'Includes all 12 months of selected year'}
                                            </p>
                                        </div>
                                    </div>
                                    {periodType === 'year' && (
                                        <select
                                            value={selectedYear}
                                            onChange={e => setSelectedYear(Number(e.target.value))}
                                            className="px-2.5 py-1 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 focus:outline-none"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {availableYears.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    )}
                                </label>

                                {/* Per Bulan */}
                                <label className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                                    periodType === 'month'
                                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-white'
                                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                }`}>
                                    <div className="flex items-center gap-2.5 flex-1">
                                        <input 
                                            type="radio" 
                                            name="periodType" 
                                            value="month" 
                                            checked={periodType === 'month'} 
                                            onChange={() => setPeriodType('month')}
                                            className="accent-indigo-600"
                                        />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">
                                                {isIndo ? '🗓️ Per Bulan Spesifik' : '🗓️ By Specific Month'}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {isIndo ? 'Hanya data pada 1 bulan tertentu' : 'Only records in a single month'}
                                            </p>
                                        </div>
                                    </div>
                                    {periodType === 'month' && (
                                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                            <select
                                                value={selectedMonth}
                                                onChange={e => setSelectedMonth(Number(e.target.value))}
                                                className="px-2 py-1 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 focus:outline-none"
                                            >
                                                {monthNames.map((m, idx) => (
                                                    <option key={idx + 1} value={idx + 1}>{m}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={selectedYear}
                                                onChange={e => setSelectedYear(Number(e.target.value))}
                                                className="px-2 py-1 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-indigo-900 dark:text-indigo-200 focus:outline-none"
                                            >
                                                {availableYears.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Summary Pill */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                                <Database size={14} className="text-indigo-500" />
                                <span>{isIndo ? 'Cakupan File:' : 'Scope:'}</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {getPeriodLabel(filterOptions, isIndo)}
                                </span>
                            </div>
                            <span className="font-mono font-bold uppercase text-[10px] bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md">
                                .{format}
                            </span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isExporting}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            onClick={handleExecuteExport}
                            disabled={isExporting}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                                isSuccess
                                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                            }`}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>{isIndo ? 'Memproses Ekspor...' : 'Exporting...'}</span>
                                </>
                            ) : isSuccess ? (
                                <>
                                    <Check size={14} />
                                    <span>{isIndo ? 'File Terunduh!' : 'Downloaded!'}</span>
                                </>
                            ) : (
                                <>
                                    <Download size={14} />
                                    <span>{isIndo ? `Unduh File ${format.toUpperCase()}` : `Download ${format.toUpperCase()}`}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
