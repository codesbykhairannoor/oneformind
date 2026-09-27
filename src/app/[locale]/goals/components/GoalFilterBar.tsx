'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Search, LayoutGrid, Kanban, CalendarRange, 
    PieChart, X, SlidersHorizontal, ArrowUpDown, 
    Star, Flame, Tag, Download, Trash2
} from 'lucide-react';

import { getCategoryBundles } from '../lib/goalCategories';

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
    onOpenExportModal?: () => void;
    onDeleteCategory?: (category: string) => void;
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
    categoryCounts,
    onOpenExportModal,
    onDeleteCategory
}: GoalFilterBarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const timeHorizons = [
        { id: 'weekly', label: isIndo ? '📅 Mingguan' : '📅 Weekly' },
        { id: 'monthly', label: isIndo ? '🗓️ Bulanan' : '🗓️ Monthly' },
        { id: 'quarterly', label: isIndo ? '📊 Kuartal' : '📊 Quarterly' },
        { id: 'yearly', label: isIndo ? '🎯 Tahunan' : '🎯 Yearly' },
        { id: 'all', label: isIndo ? 'Semua' : 'All' },
    ];

    const sortOptions = [
        { id: 'deadline', label: isIndo ? 'Tenggat Terdekat' : 'Nearest Deadline' },
        { id: 'progress_desc', label: isIndo ? 'Progres Tertinggi' : 'Highest Progress' },
        { id: 'progress_asc', label: isIndo ? 'Progres Terendah' : 'Lowest Progress' },
        { id: 'priority', label: isIndo ? 'Prioritas Vital' : 'Vital Priority' },
        { id: 'newest', label: isIndo ? 'Paling Baru' : 'Recently Created' },
    ];

    const hasActiveFilters = selectedCategory !== 'all' || selectedPriority !== 'all' || selectedTimeHorizon !== 'weekly' || searchQuery.trim().length > 0;

    const displayCategories = React.useMemo(() => {
        const list: { id: string; label: string; icon?: string; color?: string; count: number }[] = [];

        // Always include 'other' if it has goals or is selected
        const otherCount = categoryCounts['other'] || 0;
        if (otherCount > 0 || selectedCategory === 'other') {
            list.push({
                id: 'other',
                label: isIndo ? 'Lainnya' : 'Other',
                icon: '🎯',
                count: otherCount
            });
        }

        // Include any custom categories from categoryCounts using category bundles
        const bundles = getCategoryBundles();
        Object.entries(categoryCounts).forEach(([catId, count]) => {
            if (catId === 'other' || catId === 'all') return;
            if (count > 0 || selectedCategory === catId) {
                const bundle = bundles[catId.toLowerCase().trim()];
                const catName = bundle?.name || catId.charAt(0).toUpperCase() + catId.slice(1);
                const catIcon = bundle?.icon || '🏷️';
                const catColor = bundle?.color;
                list.push({
                    id: catId,
                    label: catName,
                    icon: catIcon,
                    color: catColor,
                    count
                });
            }
        });

        return list;
    }, [categoryCounts, selectedCategory, isIndo]);

    return (
        <div className="space-y-3.5 w-full max-w-full min-w-0">
            
            {/* 1. TOP ROW: Search & View Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full min-w-0">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md w-full min-w-0">
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

                {/* View Switcher Tabs & Export */}
                <div className="flex items-center gap-2 max-w-full min-w-0 overflow-x-auto no-scrollbar py-0.5 self-start lg:self-auto">
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
                        <button
                            type="button"
                            onClick={() => setViewMode('gallery')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
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

                    {onOpenExportModal && (
                        <button
                            type="button"
                            onClick={onOpenExportModal}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition shrink-0"
                            title={isIndo ? 'Ekspor Target & Sasaran (CSV / JSON)' : 'Export Goals (CSV / JSON)'}
                        >
                            <Download className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="hidden sm:inline">{isIndo ? 'Ekspor' : 'Export'}</span>
                        </button>
                    )}
                </div>

            </div>

            {/* 2. TIME HORIZONS & SLEEK COMPACT CONTROLS ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5 w-full min-w-0">
                
                {/* Clean Time Horizon Segmented Pills (5 simple options) */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto max-w-full min-w-0">
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

                {/* Compact Dropdown Controls: Priority + Sort */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    
                    {/* Priority Dropdown Select */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <Flame size={13} className={selectedPriority === 'vital' ? 'text-rose-500' : 'text-slate-400'} />
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            aria-label={isIndo ? "Filter prioritas" : "Filter priority"}
                            className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 dark:text-slate-200 p-0 outline-none cursor-pointer"
                        >
                            <option value="all" className="dark:bg-slate-900">{isIndo ? 'Semua Prioritas' : 'All Priority'}</option>
                            <option value="vital" className="dark:bg-slate-900">Vital 🔥</option>
                            <option value="important" className="dark:bg-slate-900">{isIndo ? 'Penting' : 'Important'}</option>
                            <option value="optional" className="dark:bg-slate-900">{isIndo ? 'Opsional' : 'Optional'}</option>
                        </select>
                    </div>

                    {/* Sort Dropdown Select */}
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
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full max-w-full min-w-0">
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedCategory('all');
                            setSelectedPriority('all');
                            setSelectedTimeHorizon('weekly');
                            setSearchQuery('');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shrink-0 shadow-xs"
                        title={isIndo ? 'Hapus semua filter aktif' : 'Clear all active filters'}
                    >
                        <X size={12} strokeWidth={2.5} />
                        <span>{isIndo ? 'Reset Filter' : 'Reset Filters'}</span>
                    </button>
                )}

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

                {displayCategories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;

                    return (
                        <div
                            key={cat.id}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                                isSelected
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-2 ring-indigo-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                                className="flex items-center gap-1.5"
                            >
                                {cat.color && (
                                    <span className="w-2 h-2 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                                )}
                                <span>{cat.icon || '🏷️'}</span>
                                <span>{cat.label}</span>
                                {cat.count > 0 && (
                                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                        ({cat.count})
                                    </span>
                                )}
                            </button>

                            {cat.id !== 'other' && onDeleteCategory && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteCategory(cat.id);
                                    }}
                                    className="p-0.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-500 transition ml-0.5"
                                    title={isIndo ? `Hapus kategori "${cat.id}"` : `Delete category "${cat.id}"`}
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
