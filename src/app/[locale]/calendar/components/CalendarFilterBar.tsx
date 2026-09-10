'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
    Calendar as CalendarIcon, Clock, Sun, List, 
    Sparkles, Filter, Briefcase, Target, CheckSquare, 
    Leaf, DollarSign, Send, Download
} from 'lucide-react';
import { parseNaturalLanguageEvent } from '../lib/naturalLanguageAdd';
import { UnifiedCalendarEvent } from '../lib/calendarAnalytics';

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

export interface CalendarLayerFilters {
    events: boolean;
    meetings?: boolean;
    jobs: boolean;
    goals: boolean;
    planner: boolean;
    habits: boolean;
    finance: boolean;
    journal?: boolean;
}

export type CalendarFilters = CalendarLayerFilters;

export interface CalendarFilterBarProps {
    viewMode?: CalendarViewMode;
    activeView?: CalendarViewMode;
    onViewModeChange?: (mode: CalendarViewMode) => void;
    onViewChange?: (mode: CalendarViewMode) => void;
    layers?: CalendarLayerFilters;
    filters?: CalendarLayerFilters;
    onToggleLayer?: (layer: keyof CalendarLayerFilters) => void;
    toggleFilter?: (layer: keyof CalendarLayerFilters) => void;
    layerCounts?: {
        events?: number;
        meetings?: number;
        jobs?: number;
        goals?: number;
        habits?: number;
        finance?: number;
        planner?: number;
    };
    onQuickAddEvent?: (event: Partial<UnifiedCalendarEvent>) => void;
    onExportIcs?: () => void;
    t?: any;
}

export default function CalendarFilterBar({
    viewMode,
    activeView,
    onViewModeChange,
    onViewChange,
    layers,
    filters,
    onToggleLayer,
    toggleFilter,
    layerCounts,
    onQuickAddEvent,
    onExportIcs
}: CalendarFilterBarProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const currentMode = activeView || viewMode || 'month';
    const handleModeChange = (mode: CalendarViewMode) => {
        if (onViewChange) onViewChange(mode);
        else if (onViewModeChange) onViewModeChange(mode);
    };

    const currentLayers: CalendarLayerFilters = layers || filters || {
        events: true,
        meetings: true,
        jobs: true,
        goals: true,
        planner: true,
        habits: true,
        finance: true
    };

    const handleToggle = (layer: keyof CalendarLayerFilters) => {
        if (onToggleLayer) onToggleLayer(layer);
        else if (toggleFilter) toggleFilter(layer);
    };

    const [quickAddInput, setQuickAddInput] = useState('');
    const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);

    const handleQuickAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickAddInput.trim()) return;

        if (onQuickAddEvent) {
            const parsed = parseNaturalLanguageEvent(quickAddInput);
            onQuickAddEvent(parsed);
        }
        setQuickAddInput('');
        setIsQuickAddExpanded(false);
    };

    return (
        <div className="space-y-3">
            
            {/* Top Bar: View Mode Switcher + NLP Quick Add + ICS Export */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                
                {/* 4-View Mode Segmented Control */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    
                    {/* 1. Month View */}
                    <button
                        type="button"
                        onClick={() => handleModeChange('month')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                            currentMode === 'month'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <CalendarIcon size={14} />
                        <span>{isIndo ? 'Bulan' : 'Month'}</span>
                    </button>

                    {/* 2. Week View */}
                    <button
                        type="button"
                        onClick={() => handleModeChange('week')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                            currentMode === 'week'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Clock size={14} />
                        <span>{isIndo ? 'Minggu 24h' : 'Week 24h'}</span>
                    </button>

                    {/* 3. Day View */}
                    <button
                        type="button"
                        onClick={() => handleModeChange('day')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                            currentMode === 'day'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Sun size={14} />
                        <span>{isIndo ? 'Hari' : 'Day'}</span>
                    </button>

                    {/* 4. Agenda View */}
                    <button
                        type="button"
                        onClick={() => handleModeChange('agenda')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                            currentMode === 'agenda'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <List size={14} />
                        <span>{isIndo ? 'Agenda' : 'Agenda'}</span>
                    </button>

                </div>

                {/* Right Action Group: NLP Quick Add & .ICS Export */}
                <div className="flex items-center gap-2">
                    {onExportIcs && (
                        <button
                            type="button"
                            onClick={onExportIcs}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                            title={isIndo ? 'Ekspor ke format universal iCalendar (.ICS)' : 'Export to universal iCalendar (.ICS)'}
                        >
                            <Download size={13} />
                            <span>{isIndo ? 'Ekspor .ICS' : 'Export .ICS'}</span>
                        </button>
                    )}

                    {onQuickAddEvent && (
                        <button
                            type="button"
                            onClick={() => setIsQuickAddExpanded(!isQuickAddExpanded)}
                            className={`px-3.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all ${
                                isQuickAddExpanded
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                                    : 'bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800 hover:bg-indigo-100'
                            }`}
                        >
                            <Sparkles size={14} />
                            <span>{isIndo ? 'Input Cepat AI' : 'AI Quick Add'}</span>
                        </button>
                    )}
                </div>

            </div>

            {/* Quick Add Natural Language Input Bar (Collapsible) */}
            {isQuickAddExpanded && (
                <form 
                    onSubmit={handleQuickAddSubmit}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-indigo-200 dark:border-indigo-800/80 shadow-md space-y-2 animate-in fade-in slide-in-from-top-2 duration-300"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Sparkles size={16} />
                        </div>
                        <input
                            type="text"
                            value={quickAddInput}
                            onChange={(e) => setQuickAddInput(e.target.value)}
                            placeholder={isIndo 
                                ? 'Contoh: "Meeting Tim Desain besok jam 14:00 - 15:30 via Zoom" atau "Belajar Next.js lusa 09:00"' 
                                : 'E.g. "Design Sync tomorrow at 2pm - 3:30pm via Zoom" or "Study Next.js on Friday at 9am"'}
                            className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!quickAddInput.trim()}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 transition active:scale-95"
                        >
                            <span>{isIndo ? 'Tambah' : 'Add'}</span>
                            <Send size={12} />
                        </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 px-1">
                        💡 {isIndo 
                            ? 'Ketik bahasa santai: sistem otomatis mendeteksi tanggal, jam, kategori, dan platform video call.' 
                            : 'Type naturally: the engine automatically extracts dates, time slots, category, and video platforms.'}
                    </p>
                </form>
            )}

            {/* 6-Layer Life OS Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 mr-1">
                    <Filter size={11} />
                    <span>{isIndo ? 'Lapisan Life OS:' : 'Life OS Layers:'}</span>
                </span>

                {/* 1. Events Layer */}
                <button
                    type="button"
                    onClick={() => handleToggle('events')}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                        currentLayers.events
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <CalendarIcon size={12} />
                    <span>{isIndo ? 'Events & Meeting' : 'Events & Meetings'}</span>
                    {typeof layerCounts?.events === 'number' && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                            {layerCounts.events}
                        </span>
                    )}
                </button>

                {/* 2. Job Interviews Layer */}
                <button
                    type="button"
                    onClick={() => handleToggle('jobs')}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                        currentLayers.jobs
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <Briefcase size={12} />
                    <span>{isIndo ? 'Wawancara Kerja' : 'Job Interviews'}</span>
                    {typeof layerCounts?.jobs === 'number' && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                            {layerCounts.jobs}
                        </span>
                    )}
                </button>

                {/* 3. Goal Milestones Layer */}
                <button
                    type="button"
                    onClick={() => handleToggle('goals')}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                        currentLayers.goals
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <Target size={12} />
                    <span>{isIndo ? 'Target Milestone' : 'Goal Milestones'}</span>
                    {typeof layerCounts?.goals === 'number' && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                            {layerCounts.goals}
                        </span>
                    )}
                </button>

                {/* 4. Planner Tasks Layer */}
                <button
                    type="button"
                    onClick={() => handleToggle('planner')}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                        currentLayers.planner
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <CheckSquare size={12} />
                    <span>{isIndo ? 'Tugas Planner' : 'Planner Tasks'}</span>
                    {typeof layerCounts?.planner === 'number' && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                            {layerCounts.planner}
                        </span>
                    )}
                </button>

                {/* 5. Habits Layer */}
                <button
                    type="button"
                    onClick={() => handleToggle('habits')}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                        currentLayers.habits
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <Leaf size={12} />
                    <span>{isIndo ? 'Kebiasaan' : 'Habits'}</span>
                    {typeof layerCounts?.habits === 'number' && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                            {layerCounts.habits}
                        </span>
                    )}
                </button>

                {/* 6. Finance Layer */}
                <button
                    type="button"
                    onClick={() => handleToggle('finance')}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                        currentLayers.finance
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <DollarSign size={12} />
                    <span>{isIndo ? 'Keuangan' : 'Finance'}</span>
                    {typeof layerCounts?.finance === 'number' && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                            {layerCounts.finance}
                        </span>
                    )}
                </button>
            </div>

        </div>
    );
}
