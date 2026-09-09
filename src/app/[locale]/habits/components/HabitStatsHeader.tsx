'use client';

import React from 'react';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Volume2,
    VolumeX,
    X
} from 'lucide-react';
import { ProcessedHabitItem } from '../types';

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
    openCreateModal
}: HabitStatsHeaderProps) {
    return (
        <div className="relative z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-all duration-500">
            <div className="w-full px-4 md:px-8 py-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    
                    {/* Page Title & Time of Day Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 pr-4 border-r border-slate-100 dark:border-slate-800">
                            <p className="text-[13px] font-black tracking-wide text-slate-800 dark:text-slate-200">
                                Habit Tracker
                            </p>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 border border-indigo-100/50">
                                Pro OS
                            </span>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                            <button
                                type="button"
                                onClick={() => setActiveFilter('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                    activeFilter === 'all'
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {t('habits_filter_all') || 'Semua'} ({processedHabits.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('morning')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                    activeFilter === 'morning'
                                        ? 'bg-amber-500 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                }`}
                            >
                                🌅 {isIndo ? 'Pagi' : 'Morning'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('afternoon')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                    activeFilter === 'afternoon'
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                                }`}
                            >
                                ☀️ {isIndo ? 'Siang' : 'Afternoon'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('evening')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                    activeFilter === 'evening'
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                                }`}
                            >
                                🌙 {isIndo ? 'Malam' : 'Evening'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('quit')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                    activeFilter === 'quit'
                                        ? 'bg-rose-500 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                                }`}
                            >
                                🛡️ {isIndo ? 'Bebas Kebiasaan' : 'Quit Habits'}
                            </button>
                        </div>
                    </div>

                    {/* Right Controls: Mode Switcher, Period, Sound, Today Meter, Add Button */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        
                        {/* Numeric Mode Switcher (Angka vs Persentase) */}
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-black shadow-xs">
                            <button
                                type="button"
                                onClick={() => onToggleNumericViewMode('value')}
                                title={isIndo ? 'Tampilkan Nilai / Angka' : 'Show Numeric Values'}
                                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                    numericViewMode === 'value'
                                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>🔢</span>
                                <span>{isIndo ? 'Angka' : 'Values'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onToggleNumericViewMode('percent')}
                                title={isIndo ? 'Tampilkan Persentase (%)' : 'Show Percentages (%)'}
                                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                    numericViewMode === 'percent'
                                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                }`}
                            >
                                <span>📊</span>
                                <span>%</span>
                            </button>
                        </div>

                        {/* Sound Toggle */}
                        <button
                            type="button"
                            onClick={toggleSound}
                            className={`p-2.5 rounded-xl border transition-all ${
                                soundActive
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                            }`}
                            title={soundActive ? (isIndo ? 'Suara Dopamine Aktif' : 'Sound Effects ON') : (isIndo ? 'Suara Hening' : 'Sound Effects Muted')}
                        >
                            {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>

                        {/* Period Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-3 pr-2.5 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-300 transition-all text-xs"
                            >
                                <div className="flex flex-col text-left leading-none">
                                    <span className="text-[9px] text-slate-400">{isIndo ? 'Periode' : 'Period'}</span>
                                    <span className="font-black">{monthNames[selectedMonthIndex]} {selectedYear}</span>
                                </div>
                                <ChevronDown size={12} className={`text-indigo-500 transition-transform ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isPeriodDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[60]">
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

                        {/* Daily Progress Meter */}
                        <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 leading-none mb-0.5">{isIndo ? 'Hari Ini' : 'Today'}</p>
                                <p className="text-base font-black text-slate-700 dark:text-slate-200 leading-none">{todayProgress}%</p>
                            </div>
                            <div className="relative w-9 h-9">
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

                        {/* Add Habit Button */}
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="px-4 py-2.5 flex items-center gap-2 text-white rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95 text-xs"
                        >
                            <Plus size={15} strokeWidth={3} />
                            <span className="font-black">{t('habits_add_btn') || 'Tambah Habit'}</span>
                        </button>
                    </div>

                </div>

                {/* Hint Banner */}
                {showHint && (
                    <div className="flex items-center justify-between mt-3 p-2 bg-indigo-50/60 dark:bg-indigo-500/10 rounded-xl border border-indigo-100/60 dark:border-indigo-500/20">
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
            </div>
        </div>
    );
}
