'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Search, 
    LayoutGrid, 
    Calendar as CalendarIcon, 
    ListFilter, 
    History, 
    Sparkles, 
    Tag,
    X
} from 'lucide-react';

export type JournalViewMode = 'grid' | 'calendar' | 'timeline' | 'memories';

interface JournalFilterBarProps {
    searchQuery: string;
    setSearchQuery?: (q: string) => void;
    onSearchChange?: (q: string) => void;
    selectedMood: string;
    setSelectedMood?: (m: string) => void;
    onMoodChange?: (m: string) => void;
    selectedTag: string | null;
    setSelectedTag?: (t: string | null) => void;
    onTagChange?: (t: string | null) => void;
    viewMode: JournalViewMode;
    setViewMode?: (v: JournalViewMode) => void;
    onViewModeChange?: (v: JournalViewMode) => void;
    availableTags?: string[];
    allTags?: string[];
    moodCounts?: Record<string, number>;
    totalEntries?: number;
    totalCount?: number;
    filteredCount?: number;
}

export default function JournalFilterBar({
    searchQuery,
    setSearchQuery,
    onSearchChange,
    selectedMood,
    setSelectedMood,
    onMoodChange,
    selectedTag,
    setSelectedTag,
    onTagChange,
    viewMode,
    setViewMode,
    onViewModeChange,
    availableTags,
    allTags = [],
    moodCounts = {},
    totalEntries,
    totalCount,
    filteredCount
}: JournalFilterBarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const handleSearch = (val: string) => {
        if (setSearchQuery) setSearchQuery(val);
        if (onSearchChange) onSearchChange(val);
    };

    const handleMood = (val: string) => {
        if (setSelectedMood) setSelectedMood(val);
        if (onMoodChange) onMoodChange(val);
    };

    const handleTag = (val: string | null) => {
        if (setSelectedTag) setSelectedTag(val);
        if (onTagChange) onTagChange(val);
    };

    const handleViewMode = (val: JournalViewMode) => {
        if (setViewMode) setViewMode(val);
        if (onViewModeChange) onViewModeChange(val);
    };

    const tagsList = availableTags || allTags;
    const countTotal = totalCount ?? totalEntries ?? 0;


    const moods = [
        { slug: 'all', emoji: '🌟', label: isIndo ? 'Semua' : 'All' },
        { slug: 'awesome', emoji: '🤩', label: isIndo ? 'Luar Biasa' : 'Awesome' },
        { slug: 'good', emoji: '😊', label: isIndo ? 'Senang' : 'Good' },
        { slug: 'okay', emoji: '😐', label: isIndo ? 'Biasa' : 'Okay' },
        { slug: 'sad', emoji: '😢', label: isIndo ? 'Sedih' : 'Sad' },
        { slug: 'angry', emoji: '😡', label: isIndo ? 'Stres' : 'Stressed' }
    ];

    return (
        <div className="space-y-4">
            
            {/* Top Toolbar: Search + View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={isIndo ? "Cari cerita, kata kunci, refleksi..." : "Search stories, keywords, insights..."}
                        className="w-full pl-11 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm"
                    />
                    {searchQuery && (
                        <button 
                            type="button"
                            onClick={() => handleSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* View Mode Switcher Tabs */}
                <div className="grid grid-cols-4 w-full sm:w-auto sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 shrink-0">
                    <button
                        type="button"
                        onClick={() => handleViewMode('grid')}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all ${
                            viewMode === 'grid'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <LayoutGrid size={13} />
                        <span>{isIndo ? 'Galeri' : 'Grid'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleViewMode('calendar')}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all ${
                            viewMode === 'calendar'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <CalendarIcon size={13} />
                        <span>{isIndo ? 'Kalender' : 'Calendar'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleViewMode('timeline')}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all ${
                            viewMode === 'timeline'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <ListFilter size={13} />
                        <span>{isIndo ? 'Timeline' : 'Timeline'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleViewMode('memories')}
                        className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all ${
                            viewMode === 'memories'
                                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <History size={13} />
                        <span>{isIndo ? 'Memori' : 'Memories'}</span>
                    </button>
                </div>

            </div>

            {/* Mood Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {moods.map((m) => {
                    const count = m.slug === 'all' ? countTotal : (moodCounts[m.slug] || 0);
                    const isSelected = selectedMood === m.slug;
                    return (
                        <button
                            key={m.slug}
                            type="button"
                            onClick={() => handleMood(m.slug)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                                isSelected
                                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                        >
                            <span>{m.emoji}</span>
                            <span>{m.label}</span>
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                ({count})
                            </span>
                        </button>
                    );
                })}

                {/* Tag Pills Filter */}
                {tagsList.length > 0 && (
                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
                        {tagsList.slice(0, 6).map((tg) => {
                            const isSelected = selectedTag === tg;
                            return (
                                <button
                                    key={tg}
                                    type="button"
                                    onClick={() => handleTag(isSelected ? null : tg)}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 ${
                                        isSelected
                                            ? 'bg-purple-600 text-white shadow-sm'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                    }`}
                                >
                                    <Tag size={10} />
                                    <span>#{tg}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
}

