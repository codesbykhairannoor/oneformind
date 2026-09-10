'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Search, LayoutGrid, Kanban, CalendarRange, 
    PieChart, X, SlidersHorizontal, ArrowUpDown, 
    Star, Flame, Tag
} from 'lucide-react';
import { archetypes } from './GoalArchetypesGrid';

export type GoalViewMode = 'gallery' | 'kanban' | 'timeline' | 'wheel_of_life';
export type GoalSortOption = 'deadline' | 'progress_desc' | 'progress_asc' | 'priority' | 'newest';

interface GoalFilterBarProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedCategory: string;
    setSelectedCategory: (c: string) => void;
    selectedPriority: string;
    setSelectedPriority: (p: string) => void;
    selectedTimeHorizon: string;
    setSelectedTimeHorizon: (th: string) => void;
    viewMode: GoalViewMode;
    setViewMode: (v: GoalViewMode) => void;
    sortBy: GoalSortOption;
    setSortBy: (s: GoalSortOption) => void;
    totalCount: number;
    filteredCount: number;
    categoryCounts: Record<string, number>;
}

export default function GoalFilterBar({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedTimeHorizon,
    setSelectedTimeHorizon,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    totalCount,
    filteredCount,
    categoryCounts
}: GoalFilterBarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const timeHorizons = [
        { id: 'all', label: isIndo ? 'Semua Waktu' : 'All Horizons' },
        { id: 'sprint', label: isIndo ? '⚡ Sprint (30-90 Hari)' : '⚡ Sprint (30-90 Days)' },
        { id: 'quarterly', label: isIndo ? '📊 Kuartal (Q1-Q4)' : '📊 Quarterly (Q1-Q4)' },
        { id: 'yearly', label: isIndo ? '🎯 Target 2026' : '🎯 2026 Goals' },
        { id: 'lifetime', label: isIndo ? '🌌 Seumur Hidup / Vision' : '🌌 Lifetime Vision' },
    ];

    const sortOptions = [
        { id: 'deadline', label: isIndo ? 'Tenggat Terdekat' : 'Nearest Deadline' },
        { id: 'progress_desc', label: isIndo ? 'Progres Tertinggi' : 'Highest Progress' },
        { id: 'progress_asc', label: isIndo ? 'Progres Terendah' : 'Lowest Progress' },
        { id: 'priority', label: isIndo ? 'Prioritas Tertinggi (Vital)' : 'Highest Priority (Vital)' },
        { id: 'newest', label: isIndo ? 'Paling Baru Dibuat' : 'Recently Created' },
    ];

    const priorities = [
        { id: 'all', label: isIndo ? 'Semua' : 'All' },
        { id: 'vital', label: 'Vital 🔥', color: 'text-rose-500' },
        { id: 'important', label: isIndo ? 'Penting' : 'Important', color: 'text-indigo-500' },
        { id: 'optional', label: 'Optional', color: 'text-slate-400' },
    ];

    return (
        <div className="space-y-4">
            
            {/* 1. TOP ROW: Search, Time Horizon Switcher & View Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isIndo ? "Cari target, visi, milestone..." : "Search goals, vision, milestones..."}
                        className="w-full pl-11 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                    />
                    {searchQuery && (
                        <button 
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0 self-start lg:self-auto overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setViewMode('gallery')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'gallery'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        title={isIndo ? 'Galeri Kartu' : 'Gallery Cards'}
                    >
                        <LayoutGrid size={14} />
                        <span>{isIndo ? 'Galeri' : 'Gallery'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('kanban')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'kanban'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        title={isIndo ? 'Papan Alur Kerja' : 'Kanban Pipeline'}
                    >
                        <Kanban size={14} />
                        <span>Kanban</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('timeline')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'timeline'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        title={isIndo ? 'Garis Waktu Roadmap' : 'Timeline Roadmap'}
                    >
                        <CalendarRange size={14} />
                        <span>{isIndo ? 'Roadmap' : 'Roadmap'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('wheel_of_life')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                            viewMode === 'wheel_of_life'
                                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                        title={isIndo ? 'Keseimbangan Hidup' : 'Wheel of Life Balance'}
                    >
                        <PieChart size={14} />
                        <span>{isIndo ? 'Roda Hidup' : 'Balance'}</span>
                    </button>
                </div>

            </div>

            {/* 2. TIME HORIZON & SORT ROW */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                
                {/* Time Horizon Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {timeHorizons.map((th) => {
                        const isSelected = selectedTimeHorizon === th.id;
                        return (
                            <button
                                key={th.id}
                                type="button"
                                onClick={() => setSelectedTimeHorizon(th.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-none'
                                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                }`}
                            >
                                {th.label}
                            </button>
                        );
                    })}
                </div>

                {/* Sort Dropdown & Priority Pills */}
                <div className="flex items-center gap-2">
                    
                    {/* Priority Filter */}
                    <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        {priorities.map((p) => {
                            const isSelected = selectedPriority === p.id;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setSelectedPriority(p.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                                        isSelected
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort Select */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <ArrowUpDown size={12} className="text-slate-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as GoalSortOption)}
                            aria-label={isIndo ? "Urutkan target" : "Sort goals"}
                            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 dark:text-slate-200 p-0 outline-none cursor-pointer"
                        >
                            {sortOptions.map((s) => (
                                <option key={s.id} value={s.id} className="dark:bg-slate-900">
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>

            </div>

            {/* 3. CATEGORY PILLS ROW */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                        selectedCategory === 'all'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    <span>{isIndo ? 'Semua Kategori' : 'All Categories'}</span>
                    <span className="text-[10px] font-mono opacity-60">({totalCount})</span>
                </button>

                {archetypes.map((arch) => {
                    const count = categoryCounts[arch.id] || 0;
                    if (count === 0 && selectedCategory !== arch.id) return null;
                    const ArchIcon = arch.icon;
                    const isSelected = selectedCategory === arch.id;

                    return (
                        <button
                            key={arch.id}
                            type="button"
                            onClick={() => setSelectedCategory(isSelected ? 'all' : arch.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                                isSelected
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                        >
                            <ArchIcon size={12} style={{ color: arch.color }} />
                            <span>{arch.label}</span>
                            {count > 0 && (
                                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                    ({count})
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

        </div>
    );
}
