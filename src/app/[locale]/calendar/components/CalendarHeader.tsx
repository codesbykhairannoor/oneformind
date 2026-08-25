'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarHeaderProps {
    currentMonth: string; // YYYY-MM
    onChangeMonth: (newMonth: string) => void;
    onAddEvent: () => void;
}

export default function CalendarHeader({ currentMonth, onChangeMonth, onAddEvent }: CalendarHeaderProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    const date = new Date(currentMonth + '-01');
    const activeYear = date.getFullYear();
    const activeMonthNum = date.getMonth();

    const monthsList = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const displayMonthStr = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

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

    return (
        // 1:1 from CalendarHeader.vue line 48-121
        <div className="relative z-50 transition-all bg-white dark:bg-slate-900 border-b shadow-sm dark:shadow-none border-slate-100 dark:border-slate-800 duration-500">
            <div className="w-full min-w-0 px-4 py-2 sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-stretch justify-between w-full min-w-0 gap-3 md:flex-row md:items-center">
                    
                    <div className="flex items-center gap-2 w-full min-w-0 md:w-auto md:max-w-[min(100%,28rem)]">
                        <p className="shrink-0 text-[13px] font-black capitalize tracking-wide text-slate-700 dark:text-slate-300 mr-2 pr-4">
                            {t('calendar_page_title') || 'Kalender'}
                        </p>
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center w-full gap-3 md:w-auto md:flex-nowrap md:justify-end">
                        
                        {/* Month Selector Dropdown */}
                        <div className="relative min-w-0 flex-1 md:flex-none md:max-w-xs">
                            <button 
                                type="button"
                                onClick={() => setIsOpen(!isOpen)} 
                                className="w-full min-w-0 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-4 pr-3 py-2 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all active:scale-95 duration-500"
                            >
                                <div className="flex min-w-0 flex-1 flex-col items-start leading-none text-left">
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-widest leading-none">
                                        {t('label_period') || 'Period'}
                                    </span>
                                    <span className="w-full truncate text-[11px] font-black leading-none mt-1 capitalize">
                                        {displayMonthStr}
                                    </span>
                                </div>
                                <div className="p-1 bg-white dark:bg-slate-800 border shadow-sm dark:shadow-none rounded-lg border-slate-100 dark:border-slate-700 flex items-center justify-center transition-colors duration-500">
                                    <ChevronDown className={`w-3 h-3 text-indigo-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 z-[60] origin-top-right transition-colors duration-500">
                                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between px-3 mb-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-100/50 dark:border-slate-800 rounded-[1.5rem] py-2 transition-colors duration-500">
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); changeYear(-1); }} 
                                                className="p-2.5 transition rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm dark:shadow-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                                            >
                                                <ChevronLeft className="w-4 h-4 stroke-[3]" />
                                            </button>
                                            <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-500">
                                                {activeYear}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); changeYear(1); }} 
                                                className="p-2.5 transition rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm dark:shadow-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                                            >
                                                <ChevronRight className="w-4 h-4 stroke-[3]" />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-3">
                                            {monthsList.map((monthName, idx) => (
                                                <button 
                                                    key={monthName}
                                                    type="button"
                                                    onClick={() => selectMonth(idx)}
                                                    className={`py-4 rounded-2xl text-[11px] font-black transition-all duration-500 ${
                                                        activeMonthNum === idx 
                                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none scale-105' 
                                                            : 'hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900'
                                                    }`}
                                                >
                                                    {monthName.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            type="button"
                            onClick={onAddEvent} 
                            className="h-11 px-6 flex items-center gap-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 transition-all duration-500 shrink-0"
                        >
                            <Plus className="w-4 h-4 stroke-[4] text-white" />
                            <span className="hidden md:inline text-[11px] tracking-wide font-black">
                                {t('btn_add_event') || 'Add event'}
                            </span>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
