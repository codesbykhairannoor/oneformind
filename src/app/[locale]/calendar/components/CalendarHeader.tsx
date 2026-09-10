'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { 
    ChevronDown, ChevronLeft, ChevronRight, 
    Plus, Zap, Calendar as CalendarIcon, Sparkles 
} from 'lucide-react';

interface CalendarHeaderProps {
    currentMonth: string; // YYYY-MM
    onChangeMonth: (newMonth: string) => void;
    onAddEvent: () => void;
    onOpenTaskDrawer?: () => void;
    onGoToToday?: () => void;
}

export default function CalendarHeader({ 
    currentMonth, 
    onChangeMonth, 
    onAddEvent,
    onOpenTaskDrawer,
    onGoToToday
}: CalendarHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    const date = new Date(currentMonth + '-01');
    const activeYear = date.getFullYear();
    const activeMonthNum = date.getMonth();

    const monthsList = isIndo ? [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ] : [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const displayMonthStr = date.toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });

    const selectMonth = (monthIndex: number) => {
        const m = String(monthIndex + 1).padStart(2, '0');
        const payload = `${activeYear}-${m}`;
        setIsOpen(false);
        onChangeMonth(payload);
    };

    const changeYear = (offset: number) => {
        const m = String(activeMonthNum + 1).padStart(2, '0');
        const payload = `${activeYear + offset}-${m}`;
        onChangeMonth(payload);
    };

    const stepMonth = (offset: number) => {
        const d = new Date(activeYear, activeMonthNum + offset, 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        onChangeMonth(`${y}-${m}`);
    };

    return (
        <div className="relative z-40 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
            <div className="w-full px-4 py-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    
                    {/* Title & Today Shortcut */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                            <CalendarIcon size={20} />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-tight">
                                {isIndo ? 'Kalender 360° Life OS' : '360° Life OS Calendar'}
                            </h1>
                            <p className="text-[11px] font-bold text-slate-400">
                                {isIndo ? 'Sinkronisasi agenda, meeting, target & tugas' : 'Unified schedule, meetings, targets & habits'}
                            </p>
                        </div>

                        {onGoToToday && (
                            <button
                                type="button"
                                onClick={onGoToToday}
                                className="ml-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black transition active:scale-95 shadow-xs"
                            >
                                {isIndo ? 'Hari Ini' : 'Today'}
                            </button>
                        )}
                    </div>

                    {/* Month Picker & Quick Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        
                        {/* Month Nav Buttons + Dropdown */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => stepMonth(-1)}
                                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                                title={isIndo ? 'Bulan Sebelumnya' : 'Previous Month'}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="relative">
                                <button 
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)} 
                                    className="px-3 py-1 rounded-xl text-xs font-black text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-700 transition flex items-center gap-1.5 capitalize"
                                >
                                    <span>{displayMonthStr}</span>
                                    <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 z-[70] origin-top-right">
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                                        
                                        <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); changeYear(-1); }} 
                                                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition shadow-xs"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <span className="text-sm font-black text-slate-800 dark:text-white font-mono">
                                                {activeYear}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); changeYear(1); }} 
                                                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition shadow-xs"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2">
                                            {monthsList.map((monthName, idx) => (
                                                <button 
                                                    key={monthName}
                                                    type="button"
                                                    onClick={() => selectMonth(idx)}
                                                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                                                        activeMonthNum === idx 
                                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                                                            : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-400'
                                                    }`}
                                                >
                                                    {monthName.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => stepMonth(1)}
                                className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                                title={isIndo ? 'Bulan Selanjutnya' : 'Next Month'}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Task Time-Blocking Drawer Trigger */}
                        {onOpenTaskDrawer && (
                            <button
                                type="button"
                                onClick={onOpenTaskDrawer}
                                className="px-3.5 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-black flex items-center gap-2 transition active:scale-95 shadow-xs"
                                title={isIndo ? 'Buka laci time-blocking tugas planner' : 'Open task time-blocking drawer'}
                            >
                                <Zap size={14} />
                                <span className="hidden sm:inline">{isIndo ? 'Time-Block Tugas' : 'Time-Block Tasks'}</span>
                            </button>
                        )}

                        {/* Add Event Button */}
                        <button 
                            type="button"
                            onClick={onAddEvent} 
                            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all active:scale-95 shrink-0"
                        >
                            <Plus size={15} strokeWidth={3} />
                            <span>{isIndo ? 'Buat Agenda' : 'Add Event'}</span>
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}
