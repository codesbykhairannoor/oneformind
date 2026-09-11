'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Search, X, Kanban, Table, Calendar, 
    BarChart3, SlidersHorizontal, ArrowUpDown, 
    Building2, MapPin, DollarSign, Filter
} from 'lucide-react';
import { JobRowItem } from '../lib/jobAnalytics';

export type JobViewMode = 'kanban' | 'table' | 'interviews' | 'compare';

export interface JobFilterParams {
    search?: string;
    status?: string;
    workModel?: string;
    days?: number | null;
    sortBy?: 'applied_date' | 'salary' | 'company' | 'status';
}

interface JobFilterBarProps {
    filters: JobFilterParams;
    onFilterChange: (newFilters: JobFilterParams) => void;
    viewMode: JobViewMode;
    setViewMode: (v: JobViewMode) => void;
    uniqueTitles: string[];
    jobs: JobRowItem[];
    totalCount: number;
    filteredCount: number;
}

export default function JobFilterBar({
    filters,
    onFilterChange,
    viewMode,
    setViewMode,
    uniqueTitles = [],
    jobs = [],
    totalCount = 0,
    filteredCount = 0
}: JobFilterBarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const inputRef = useRef<HTMLInputElement>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [activeStatus, setActiveStatus] = useState(filters.status || 'all');
    const [activeWorkModel, setActiveWorkModel] = useState(filters.workModel || 'all');
    const [activeDays, setActiveDays] = useState<number | null>(filters.days || null);
    const [sortBy, setSortBy] = useState<'applied_date' | 'salary' | 'company' | 'status'>(filters.sortBy || 'applied_date');
    const [showDropdown, setShowDropdown] = useState(false);

    // Merge server titles + local job titles
    const allUniqueTitles = useMemo(() => {
        const localTitles = jobs.map(j => j.title).filter(Boolean);
        const combined = Array.from(new Set([...uniqueTitles, ...localTitles]));
        return combined.sort();
    }, [uniqueTitles, jobs]);

    // Suggestions based on search
    const suggestions = useMemo(() => {
        if (!search || search.length < 1) return [];
        const q = search.toLowerCase();
        return allUniqueTitles.filter(t => t.toLowerCase().includes(q)).slice(0, 8);
    }, [search, allUniqueTitles]);

    // Status items with counts
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: jobs.length };
        jobs.forEach(j => {
            const s = j.status || 'wishlist';
            counts[s] = (counts[s] || 0) + 1;
        });
        return counts;
    }, [jobs]);

    const statusPills = [
        { key: 'all', label: isIndo ? 'Semua' : 'All', icon: '📋' },
        { key: 'wishlist', label: isIndo ? 'Incaran' : 'Wishlist', icon: '💭' },
        { key: 'applied', label: isIndo ? 'Dilamar' : 'Applied', icon: '📤' },
        { key: 'interview', label: isIndo ? 'Interview' : 'Interview', icon: '🎯' },
        { key: 'offer', label: isIndo ? 'Offering' : 'Offer', icon: '🎉' },
        { key: 'accepted', label: isIndo ? 'Diterima' : 'Accepted', icon: '🏆' },
        { key: 'rejected', label: isIndo ? 'Ditolak' : 'Rejected', icon: '❌' },
    ];

    const datePills = [
        { key: null, label: isIndo ? 'Semua Waktu' : 'All Time' },
        { key: 7, label: isIndo ? '7 Hari Terakhir' : 'Last 7 Days' },
        { key: 30, label: isIndo ? '30 Hari Terakhir' : 'Last 30 Days' },
        { key: 90, label: isIndo ? '90 Hari Terakhir' : 'Last 90 Days' },
    ];

    const workModels = [
        { key: 'all', label: isIndo ? 'Semua Model' : 'All Models' },
        { key: 'remote', label: 'Remote 🌐' },
        { key: 'hybrid', label: 'Hybrid 🏢' },
        { key: 'onsite', label: 'On-site 📍' },
    ];

    const applyFilters = (
        newSearch = search, 
        newStatus = activeStatus, 
        newWorkModel = activeWorkModel, 
        newDays = activeDays,
        newSort = sortBy
    ) => {
        setShowDropdown(false);
        onFilterChange({
            search: newSearch || undefined,
            status: newStatus !== 'all' ? newStatus : undefined,
            workModel: newWorkModel !== 'all' ? newWorkModel : undefined,
            days: newDays || undefined,
            sortBy: newSort
        });
    };

    const selectSuggestion = (titleStr: string) => {
        setSearch(titleStr);
        setShowDropdown(false);
        applyFilters(titleStr, activeStatus, activeWorkModel, activeDays, sortBy);
    };

    const handleSetStatus = (key: string) => {
        setActiveStatus(key);
        applyFilters(search, key, activeWorkModel, activeDays, sortBy);
    };

    const handleSetWorkModel = (key: string) => {
        setActiveWorkModel(key);
        applyFilters(search, activeStatus, key, activeDays, sortBy);
    };

    const handleSetDays = (key: number | null) => {
        setActiveDays(key);
        applyFilters(search, activeStatus, activeWorkModel, key, sortBy);
    };

    const handleSetSort = (s: 'applied_date' | 'salary' | 'company' | 'status') => {
        setSortBy(s);
        applyFilters(search, activeStatus, activeWorkModel, activeDays, s);
    };

    const clearAll = () => {
        setSearch('');
        setActiveStatus('all');
        setActiveWorkModel('all');
        setActiveDays(null);
        setSortBy('applied_date');
        applyFilters('', 'all', 'all', null, 'applied_date');
    };

    const activeFilterCount = (search ? 1 : 0) + (activeStatus !== 'all' ? 1 : 0) + (activeWorkModel !== 'all' ? 1 : 0) + (activeDays ? 1 : 0);

    return (
        <div className="space-y-2.5 mb-3">
            
            {/* ROW 1: Search & View Mode Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowDropdown(e.target.value.length > 0 && suggestions.length > 0);
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                setShowDropdown(false);
                                applyFilters();
                            }
                        }}
                        onFocus={() => setShowDropdown(suggestions.length > 0)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        placeholder={isIndo ? "Cari posisi, perusahaan, lokasi, recruiter..." : "Search job title, company, location, recruiter..."}
                        className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                    />
                    {search && (
                        <button 
                            type="button"
                            onClick={() => { setSearch(''); applyFilters('', activeStatus, activeWorkModel, activeDays, sortBy); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={14} />
                        </button>
                    )}

                    {/* Autocomplete Dropdown */}
                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                ✨ {isIndo ? 'Saran Posisi' : 'Suggested Titles'}
                            </div>
                            {suggestions.map((titleStr) => (
                                <button
                                    key={titleStr}
                                    type="button"
                                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(titleStr); }}
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition flex items-center gap-2"
                                >
                                    <span>💼</span>
                                    <span>{titleStr}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4-View Switcher Tabs */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0 self-start lg:self-auto overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setViewMode('kanban')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'kanban'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <Kanban size={14} />
                        <span>Kanban Pipeline</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'table'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <Table size={14} />
                        <span>{isIndo ? 'Tabel Detail' : 'Table View'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('interviews')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'interviews'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <Calendar size={14} />
                        <span>{isIndo ? 'Jadwal Interview' : 'Interviews'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('compare')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'compare'
                                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <BarChart3 size={14} />
                        <span>{isIndo ? 'Komparasi Offer' : 'Offer Matrix'}</span>
                    </button>
                </div>

            </div>

            {/* ROW 2: Status Pills, Work Models & Time Horizon */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                
                {/* Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {statusPills.map((pill) => {
                        const count = statusCounts[pill.key] || 0;
                        const isSelected = activeStatus === pill.key;
                        return (
                            <button
                                key={pill.key}
                                type="button"
                                onClick={() => handleSetStatus(pill.key)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                }`}
                            >
                                <span>{pill.icon}</span>
                                <span>{pill.label}</span>
                                <span className="text-[10px] font-mono opacity-70">({count})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Work Model & Sort Selector */}
                <div className="flex items-center gap-2">
                    
                    {/* Work Model Selector */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        {workModels.map((wm) => {
                            const isSelected = activeWorkModel === wm.key;
                            return (
                                <button
                                    key={wm.key}
                                    type="button"
                                    onClick={() => handleSetWorkModel(wm.key)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                                        isSelected
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {wm.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Date Range Selector */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <select
                            value={activeDays === null ? 'all' : String(activeDays)}
                            onChange={(e) => handleSetDays(e.target.value === 'all' ? null : Number(e.target.value))}
                            aria-label={isIndo ? "Pilih rentang tanggal lamaran" : "Select applied date range"}
                            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 dark:text-slate-200 p-0 outline-none cursor-pointer"
                        >
                            {datePills.map(d => (
                                <option key={String(d.key)} value={d.key === null ? 'all' : String(d.key)} className="dark:bg-slate-900">
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Button if active */}
                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1 shrink-0"
                        >
                            <X size={12} />
                            <span>{isIndo ? 'Reset' : 'Reset'} ({activeFilterCount})</span>
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}
