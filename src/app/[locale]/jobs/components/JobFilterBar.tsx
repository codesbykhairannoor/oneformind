'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';

export interface JobFilterParams {
    search?: string;
    status?: string;
    days?: number | null;
}

interface JobFilterBarProps {
    filters: JobFilterParams;
    uniqueTitles: string[];
    localJobs: any[];
    totalCount: number;
    onFilterChange: (newFilters: JobFilterParams) => void;
}

export default function JobFilterBar({
    filters,
    uniqueTitles = [],
    localJobs = [],
    totalCount = 0,
    onFilterChange
}: JobFilterBarProps) {
    const t = useTranslations();
    const inputRef = useRef<HTMLInputElement>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [activeStatus, setActiveStatus] = useState(filters.status || 'all');
    const [activeDays, setActiveDays] = useState<number | null>(filters.days || null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Merge server titles + local job titles
    const allUniqueTitles = useMemo(() => {
        const localTitles = localJobs.map(j => j.title).filter(Boolean);
        const combined = Array.from(new Set([...uniqueTitles, ...localTitles]));
        return combined.sort();
    }, [uniqueTitles, localJobs]);

    // Suggestions based on search
    const suggestions = useMemo(() => {
        if (!search || search.length < 1) return [];
        const q = search.toLowerCase();
        return allUniqueTitles.filter(t => t.toLowerCase().includes(q)).slice(0, 8);
    }, [search, allUniqueTitles]);

    const statusPills = [
        { key: 'all', labelKey: 'job_status_all', icon: '📋', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700' },
        { key: 'wishlist', labelKey: 'job_status_wishlist', icon: '💭', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20' },
        { key: 'applied', labelKey: 'job_status_applied', icon: '📤', color: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20 hover:bg-yellow-100 dark:hover:bg-yellow-500/20' },
        { key: 'interview', labelKey: 'job_status_interview', icon: '🎤', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/20' },
        { key: 'offer', labelKey: 'job_status_offer', icon: '🎉', color: 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/20' },
        { key: 'rejected', labelKey: 'job_status_rejected', icon: '❌', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20' },
        { key: 'accepted', labelKey: 'job_status_accepted', icon: '✅', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' },
    ];

    const datePills = [
        { key: null, labelKey: 'job_filter_all_time', fallback: 'Semua Waktu' },
        { key: 3, labelKey: 'job_filter_3_days', fallback: '3 Hari Terakhir' },
        { key: 7, labelKey: 'job_filter_7_days', fallback: '7 Hari Terakhir' },
        { key: 30, labelKey: 'job_filter_30_days', fallback: '30 Hari Terakhir' },
        { key: 90, labelKey: 'job_filter_90_days', fallback: '90 Hari Terakhir' },
    ];

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (search) count++;
        if (activeStatus !== 'all') count++;
        if (activeDays) count++;
        return count;
    }, [search, activeStatus, activeDays]);

    const applyFilters = (newSearch = search, newStatus = activeStatus, newDays = activeDays) => {
        setShowDropdown(false);
        if (inputRef.current) inputRef.current.blur();
        onFilterChange({
            search: newSearch || undefined,
            status: newStatus !== 'all' ? newStatus : undefined,
            days: newDays || undefined
        });
    };

    const selectSuggestion = (titleStr: string) => {
        setSearch(titleStr);
        setShowDropdown(false);
        applyFilters(titleStr, activeStatus, activeDays);
    };

    const handleSetStatus = (key: string) => {
        setActiveStatus(key);
        applyFilters(search, key, activeDays);
    };

    const handleSetDays = (key: number | null) => {
        setActiveDays(key);
        applyFilters(search, activeStatus, key);
    };

    const clearAll = () => {
        setSearch('');
        setActiveStatus('all');
        setActiveDays(null);
        applyFilters('', 'all', null);
    };

    return (
        // 1:1 from JobFilterBar.vue line 102-209
        <div className="mb-5 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
            
            {/* Top Bar: Search + Date filter */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center overflow-visible transition-colors duration-500">
                
                {/* Smart Search */}
                <div className="relative flex-1 min-w-0 w-full">
                    <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                            ref={inputRef}
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
                            type="text"
                            placeholder={t('job_filter_search_placeholder') || 'Cari posisi, perusahaan, lokasi...'}
                            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-400 font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
                        />
                        {search && (
                            <button 
                                onClick={() => { setSearch(''); applyFilters('', activeStatus, activeDays); }}
                                className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-3 py-2 text-[11px] font-black capitalize tracking-wide text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                ✨ {t('job_filter_autocomplete_label') || 'Posisi yang kamu lamar'}
                            </div>
                            {suggestions.map((titleStr) => (
                                <button
                                    key={titleStr}
                                    type="button"
                                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(titleStr); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors flex items-center gap-2.5"
                                >
                                    <span className="text-indigo-400">💼</span>
                                    {titleStr}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Range Pills */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    <span className="text-xs font-bold text-slate-400 mr-1">{t('job_filter_applied_label') || 'Dilamar:'}</span>
                    {datePills.map((d) => (
                        <button
                            key={String(d.key)}
                            type="button"
                            onClick={() => handleSetDays(d.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                activeDays === d.key
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none'
                                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                        >
                            {t(d.labelKey) || d.fallback}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status filter pills row */}
            <div className="px-4 py-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">{t('job_filter_status_label') || 'Status:'}</span>
                {statusPills.map((pill) => (
                    <button
                        key={pill.key}
                        type="button"
                        onClick={() => handleSetStatus(pill.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                            activeStatus === pill.key
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none scale-105'
                                : `${pill.color} border`
                        }`}
                    >
                        <span>{pill.icon}</span>
                        {t(pill.labelKey) || pill.key}
                    </button>
                ))}

                {/* Active filter count + Clear button */}
                {activeFiltersCount > 0 && (
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">
                            {totalCount} {t('job_filter_results') || 'hasil'}
                        </span>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center gap-1"
                        >
                            <X size={12} />
                            {t('job_filter_clear') || 'Hapus Filter'} ({activeFiltersCount})
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
