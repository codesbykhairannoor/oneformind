'use client';

import React from 'react';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Volume2,
    VolumeX,
    X,
    Download,
    Flame
} from 'lucide-react';
import { ProcessedHabitItem } from '../types';
import ModuleHeader from '@/components/layout/ModuleHeader';

interface HabitStatsHeaderProps {
    isIndo: boolean;
    t: any;
    processedHabits: ProcessedHabitItem[];
    activeFilter: 'all' | 'morning' | 'afternoon' | 'evening' | 'quit';
    setActiveFilter: (filter: 'all' | 'morning' | 'afternoon' | 'evening' | 'quit') => void;
    soundActive: boolean;
    toggleSound: () => void;
    numericViewMode: 'value' | 'percent';
    onToggleNumericViewMode: (mode: 'value' | 'percent') => void;
    isPeriodDropdownOpen: boolean;
    setIsPeriodDropdownOpen: (open: boolean) => void;
    selectedYear: number;
    setSelectedYear: (y: number) => void;
    selectedMonthIndex: number;
    setSelectedMonthIndex: (m: number) => void;
    monthNames: string[];
    todayProgress: number;
    showHint: boolean;
    setShowHint: (show: boolean) => void;
    openCreateModal: () => void;
    openExportModal?: () => void;
}

export default function HabitStatsHeader({
    isIndo,
    t,
    processedHabits,
    activeFilter,
    setActiveFilter,
    soundActive,
    toggleSound,
    numericViewMode,
    onToggleNumericViewMode,
    isPeriodDropdownOpen,
    setIsPeriodDropdownOpen,
    selectedYear,
    setSelectedYear,
    selectedMonthIndex,
    setSelectedMonthIndex,
    monthNames,
    todayProgress,
    showHint,
    setShowHint,
    openCreateModal,
    openExportModal
}: HabitStatsHeaderProps) {
    return (
        <ModuleHeader
            icon={<Flame size={18} strokeWidth={2.5} />}
            title={isIndo ? 'Pelacak Kebiasaan & Rutinitas' : 'Habit Tracker & Routines'}
            subtitle={isIndo ? 'Rutinitas harian, pelacak konsistensi & pembentukan kebiasaan' : 'Daily routines, consistency tracking & habit forming'}
            badge={
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-800/40">
                    Pro OS
                </span>
            }
            actions={
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* Numeric Mode Switcher */}
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-black">
                        <button
                            type="button"
                            onClick={() => onToggleNumericViewMode('value')}
                            title={isIndo ? 'Tampilkan Nilai / Angka' : 'Show Numeric Values'}
                            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                numericViewMode === 'value'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                        >
                            <span>🔢</span>
                            <span className="hidden sm:inline">{isIndo ? 'Angka' : 'Values'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleNumericViewMode('percent')}
                            title={isIndo ? 'Tampilkan Persentase (%)' : 'Show Percentages (%)'}
                            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                numericViewMode === 'percent'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                        >
                            <span>%</span>
                        </button>
                    </div>

                    {/* Sound Toggle */}
                    <button
                        type="button"
                        onClick={toggleSound}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${
                            soundActive
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-400'
                        }`}
                        title={soundActive ? (isIndo ? 'Suara Dopamine Aktif' : 'Sound Effects ON') : (isIndo ? 'Suara Hening' : 'Sound Effects Muted')}
                    >
                        {soundActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>

                    {/* Period Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 px-3 h-10 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-300 transition-all text-xs"
                        >
                            <div className="flex flex-col text-left leading-none">
                                <span className="text-[8px] text-slate-400">{isIndo ? 'Periode' : 'Period'}</span>
                                <span className="font-black text-xs">{monthNames[selectedMonthIndex]?.slice(0, 3)} {selectedYear}</span>
                            </div>
                            <ChevronDown size={11} className={`text-indigo-500 transition-transform ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isPeriodDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[60]">
                                <div className="flex items-center justify-between mb-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedYear(selectedYear - 1)} 
                                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-lg font-black text-slate-800 dark:text-slate-100">{selectedYear}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedYear(selectedYear + 1)} 
                                        className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {monthNames.map((month, index) => (
                                        <button
                                            key={month}
                                            type="button"
                                            onClick={() => {
                                                setSelectedMonthIndex(index);
                                                setIsPeriodDropdownOpen(false);
                                            }}
                                            className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                                                selectedMonthIndex === index
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500'
                                            }`}
                                        >
                                            {month.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Daily Progress Meter (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2 px-3 h-10 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-400 leading-none mb-0.5">{isIndo ? 'Hari Ini' : 'Today'}</p>
                            <p className="text-sm font-black text-slate-700 dark:text-slate-200 leading-none">{todayProgress}%</p>
                        </div>
                        <div className="relative w-7 h-7">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="3.5" />
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="15"
                                    fill="none"
                                    className="stroke-indigo-600 transition-all duration-700"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    style={{ strokeDasharray: `${todayProgress}, 100` }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Export Button */}
                    {openExportModal && (
                        <button
                            type="button"
                            onClick={openExportModal}
                            title={isIndo ? 'Ekspor Data Habits (CSV/JSON)' : 'Export Habits Data (CSV/JSON)'}
                            className="h-10 px-3.5 flex items-center gap-1.5 text-slate-700 dark:text-slate-200 rounded-xl font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all active:scale-95 text-xs"
                        >
                            <Download size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
                            <span>{isIndo ? 'Ekspor' : 'Export'}</span>
                        </button>
                    )}

                    {/* Add Habit Button */}
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="h-10 px-4 sm:px-5 flex items-center gap-1.5 sm:gap-2 text-white rounded-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95 text-xs shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{t('habits_add_btn') || (isIndo ? 'Tambah Habit' : 'Add Habit')}</span>
                    </button>
                </div>
            }
        >
            {/* Filter Pills row underneath header identity */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                        activeFilter === 'all'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    {t('habits_filter_all') || 'Semua'} ({processedHabits.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveFilter('morning')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                        activeFilter === 'morning'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                    }`}
                >
                    🌅 {isIndo ? 'Pagi' : 'Morning'}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveFilter('afternoon')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                        activeFilter === 'afternoon'
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-950/30'
                    }`}
                >
                    ☀️ {isIndo ? 'Siang' : 'Afternoon'}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveFilter('evening')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                        activeFilter === 'evening'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
                    }`}
                >
                    🌙 {isIndo ? 'Malam' : 'Evening'}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveFilter('quit')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all ${
                        activeFilter === 'quit'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    }`}
                >
                    🛡️ {isIndo ? 'Bebas' : 'Quit'}
                </button>
            </div>

            {/* Hint Banner as sub-row */}
            {showHint && (
                <div className="flex items-center justify-between p-2 bg-indigo-50/60 dark:bg-indigo-500/10 rounded-xl border border-indigo-100/60 dark:border-indigo-500/20">
                    <div className="flex items-center gap-6 px-2 overflow-x-auto no-scrollbar text-[10px] font-bold text-indigo-950/70 dark:text-indigo-300">
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-4 h-4 bg-indigo-600 text-white rounded-md flex items-center justify-center text-[8px] font-black">✓</span>
                            <span>{isIndo ? 'Klik kiri untuk centang' : 'Left click to complete'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 border-l border-indigo-200 dark:border-indigo-800 pl-6">
                            <span className="w-4 h-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md flex items-center justify-center text-[8px] font-black">☕</span>
                            <span>{isIndo ? 'Hari istirahat terjaga (Rest Day)' : 'Rest days protect streaks'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 border-l border-indigo-200 dark:border-indigo-800 pl-6">
                            <span className="w-4 h-4 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-md flex items-center justify-center text-[8px] font-black">•</span>
                            <span>{isIndo ? 'Klik titik untuk catatan harian' : 'Click dot for micro-notes'}</span>
                        </div>
                    </div>
                    <button type="button" onClick={() => setShowHint(false)} className="p-1 text-indigo-400 hover:text-indigo-600">
                        <X size={13} strokeWidth={3} />
                    </button>
                </div>
            )}
        </ModuleHeader>
    );
}
