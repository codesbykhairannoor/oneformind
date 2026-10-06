'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    Plus, 
    Download, 
    Zap 
} from 'lucide-react';
import ModuleHeader from '@/components/layout/ModuleHeader';

interface CalendarHeaderProps {
    currentMonth?: string; // YYYY-MM
    activeMonth?: string; // YYYY-MM
    onChangeMonth: (val: string) => void;
    onAddEvent: () => void;
    onGoToToday?: () => void;
    onOpenTaskDrawer?: () => void;
    onOpenExportModal?: () => void;
}

export default function CalendarHeader({
    currentMonth,
    activeMonth,
    onChangeMonth,
    onAddEvent,
    onGoToToday,
    onOpenTaskDrawer,
    onOpenExportModal
}: CalendarHeaderProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const [isOpen, setIsOpen] = useState(false);

    const targetMonth = currentMonth || activeMonth || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const [activeYear, activeMonthNum] = targetMonth.split('-').map(Number);
    const dateObj = new Date(activeYear, activeMonthNum - 1, 1);
    const displayMonthStr = dateObj.toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });

    const monthsList = isIndo ? [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ] : [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const changeYear = (delta: number) => {
        const newY = activeYear + delta;
        const m = String(activeMonthNum).padStart(2, '0');
        onChangeMonth(`${newY}-${m}`);
    };

    const selectMonth = (monthIndex: number) => {
        const m = String(monthIndex + 1).padStart(2, '0');
        onChangeMonth(`${activeYear}-${m}`);
        setIsOpen(false);
    };

    const stepMonth = (offset: number) => {
        const d = new Date(activeYear, activeMonthNum - 1 + offset, 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        onChangeMonth(`${y}-${m}`);
    };

    return (
        <ModuleHeader
            icon={<CalendarIcon size={18} strokeWidth={2.5} />}
            title={isIndo ? 'Kalender & Jadwal Life OS' : 'Life OS Calendar & Schedule'}
            subtitle={isIndo ? 'Sinkronisasi agenda, meeting, target & tugas' : 'Unified schedule, meetings, targets & habits'}
            centerContent={
                <div className="flex items-center gap-2">
                    {onGoToToday && (
                        <button
                            type="button"
                            onClick={onGoToToday}
                            className="px-3 h-10 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black transition active:scale-95 shadow-xs"
                        >
                            {isIndo ? 'Hari Ini' : 'Today'}
                        </button>
                    )}

                    {/* Month Nav Buttons + Dropdown */}
                    <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-0.5 rounded-xl h-10">
                        <button
                            type="button"
                            onClick={() => stepMonth(-1)}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                            title={isIndo ? 'Bulan Sebelumnya' : 'Previous Month'}
                        >
                            <ChevronLeft size={15} />
                        </button>

                        <div className="relative">
                            <button 
                                type="button"
                                onClick={() => setIsOpen(!isOpen)} 
                                className="px-2.5 py-1 rounded-lg text-xs font-black text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-700 transition flex items-center gap-1.5 capitalize"
                            >
                                <span>{displayMonthStr}</span>
                                <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[70] origin-top">
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                                    
                                    <div className="flex items-center justify-between mb-3 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl">
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); changeYear(-1); }} 
                                            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <span className="text-sm font-black text-slate-800 dark:text-white font-mono">
                                            {activeYear}
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={(e) => { e.stopPropagation(); changeYear(1); }} 
                                            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {monthsList.map((monthName, idx) => (
                                            <button 
                                                key={monthName}
                                                type="button"
                                                onClick={() => selectMonth(idx)}
                                                className={`py-2 rounded-xl text-xs font-black transition-all ${
                                                    activeMonthNum === idx + 1
                                                        ? 'bg-indigo-600 text-white shadow-md' 
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
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                            title={isIndo ? 'Bulan Selanjutnya' : 'Next Month'}
                        >
                            <ChevronRight size={15} />
                        </button>
                    </div>
                </div>
            }
            actions={
                <div className="flex items-center gap-2">
                    {/* Task Time-Blocking Drawer Trigger */}
                    {onOpenTaskDrawer && (
                        <button
                            type="button"
                            onClick={onOpenTaskDrawer}
                            className="h-10 px-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                            title={isIndo ? 'Buka laci time-blocking tugas planner' : 'Open task time-blocking drawer'}
                        >
                            <Zap size={14} />
                            <span className="hidden sm:inline">{isIndo ? 'Time-Block Tugas' : 'Time-Block Tasks'}</span>
                        </button>
                    )}

                    {/* Export Button */}
                    {onOpenExportModal && (
                        <button
                            type="button"
                            onClick={onOpenExportModal}
                            title={isIndo ? 'Ekspor Kalender (CSV/JSON)' : 'Export Calendar (CSV/JSON)'}
                            className="h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs shrink-0"
                        >
                            <Download size={14} className="text-slate-500 dark:text-slate-400" />
                            <span className="hidden sm:inline">{isIndo ? 'Ekspor' : 'Export'}</span>
                        </button>
                    )}

                    {/* Add Event Button */}
                    <button 
                        type="button"
                        onClick={onAddEvent} 
                        className="h-10 px-4 sm:px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all active:scale-95 shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>{isIndo ? 'Buat Agenda' : 'Add Event'}</span>
                    </button>
                </div>
            }
        />
    );
}
