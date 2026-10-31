'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';

interface FinanceMonthPickerProps {
    selectedMonthKey: string;
    onMonthChange: (val: number | string) => void;
}

export default function FinanceMonthPicker({ selectedMonthKey, onMonthChange }: FinanceMonthPickerProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const loc = isIndo ? 'id-ID' : 'en-US';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [activeYear, setActiveYear] = useState(() => {
        const parts = selectedMonthKey.split('-');
        return parseInt(parts[0], 10) || new Date().getFullYear();
    });

    // Sync active year when selectedMonthKey changes externally
    useEffect(() => {
        const parts = selectedMonthKey.split('-');
        const y = parseInt(parts[0], 10);
        if (y) setActiveYear(y);
    }, [selectedMonthKey]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const getMonthName = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
    };

    const getShortMonthName = (monthKey: string) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString(loc, { month: 'short', year: 'numeric' });
    };

    const months = isIndo
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const activeMonthIndex = parseInt(selectedMonthKey.split('-')[1], 10) - 1;

    const selectMonth = (index: number) => {
        const mm = String(index + 1).padStart(2, '0');
        onMonthChange(`${activeYear}-${mm}`);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-lg sm:rounded-xl p-0.5 h-8 sm:h-10 shrink-0">
            {/* Quick Previous Month */}
            <button
                type="button"
                onClick={() => onMonthChange(-1)}
                className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md sm:rounded-lg text-slate-500 dark:text-slate-400 transition"
                title={isIndo ? 'Bulan sebelumnya' : 'Previous month'}
            >
                <ChevronLeft size={13} className="sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Month Picker Button & Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center px-2 sm:px-2.5 h-7 sm:h-8 transition rounded-md sm:rounded-lg gap-1 sm:gap-1.5 group transition-colors duration-200 ${isOpen ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                    <span className="text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                        <span className="md:hidden">{getShortMonthName(selectedMonthKey)}</span>
                        <span className="hidden md:inline">{getMonthName(selectedMonthKey)}</span>
                    </span>
                    <ChevronDown size={11} strokeWidth={3} className={`text-slate-400 group-hover:text-indigo-500 transition-transform shrink-0 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[270px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-4 z-[100] origin-top transition-colors animate-in fade-in zoom-in-95 duration-150">
                        {/* Year Selector */}
                        <div className="relative z-10 flex items-center justify-between px-1 mb-3">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setActiveYear(activeYear - 1); }}
                                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
                            >
                                <ChevronLeft size={15} strokeWidth={2.5} />
                            </button>
                            <span className="font-black text-slate-800 dark:text-white transition-colors duration-500 text-sm">{activeYear}</span>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setActiveYear(activeYear + 1); }}
                                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
                            >
                                <ChevronRight size={15} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Months Grid */}
                        <div className="relative z-10 grid grid-cols-3 gap-1.5">
                            {months.map((m, i) => {
                                const isCurrentSelected = activeMonthIndex === i && selectedMonthKey.startsWith(String(activeYear));
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => selectMonth(i)}
                                        className={`text-[11px] font-bold py-2 rounded-xl transition-all tracking-tight ${isCurrentSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors'}`}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Next Month */}
            <button
                type="button"
                onClick={() => onMonthChange(1)}
                className="p-1 sm:p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md sm:rounded-lg text-slate-500 dark:text-slate-400 transition"
                title={isIndo ? 'Bulan berikutnya' : 'Next month'}
            >
                <ChevronRight size={13} className="sm:w-3.5 sm:h-3.5" />
            </button>
        </div>
    );
}
