'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';

interface FinanceMonthPickerProps {
    selectedMonthKey: string;
    onMonthChange: (val: string) => void;
}

export default function FinanceMonthPicker({ selectedMonthKey, onMonthChange }: FinanceMonthPickerProps) {
    const locale = useLocale();
    const loc = locale === 'id' ? 'id-ID' : 'en-US';
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [activeYear, setActiveYear] = useState(() => {
        const parts = selectedMonthKey.split('-');
        return parseInt(parts[0], 10) || new Date().getFullYear();
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const months = locale === 'id'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const activeMonthIndex = parseInt(selectedMonthKey.split('-')[1], 10) - 1;

    const selectMonth = (index: number) => {
        const mm = String(index + 1).padStart(2, '0');
        onMonthChange(`${activeYear}-${mm}`);
        setIsOpen(false);
    };

    return (
        // 1:1 from FinanceHeader.vue line 127-169
        <div className="relative shrink-0 transition-colors duration-500" ref={dropdownRef}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)} 
                className={`flex items-center justify-center w-[90px] md:w-auto md:px-4 h-11 transition border rounded-xl gap-1.5 shadow-sm dark:shadow-none group transition-colors duration-300 ${isOpen ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/40'}`}
            >
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 tracking-tight whitespace-nowrap transition-colors duration-300">
                    <span className="md:hidden">{getShortMonthName(selectedMonthKey)}</span>
                    <span className="hidden md:inline">{getMonthName(selectedMonthKey)}</span>
                </span>
                <ChevronDown size={12} strokeWidth={3} className={`text-slate-400 group-hover:text-indigo-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-[260px] bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-700 p-4 z-[100] origin-top-left md:origin-top-right transition-colors duration-500 animate-in fade-in zoom-in-95 duration-150">
                    <div className="relative z-10 flex items-center justify-between px-1 mb-3">
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveYear(activeYear - 1); }} 
                            className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition-colors"
                        >
                            <ChevronLeft size={14} strokeWidth={3} />
                        </button>
                        <span className="font-black text-slate-800 dark:text-white transition-colors duration-500 text-sm">{activeYear}</span>
                        <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveYear(activeYear + 1); }} 
                            className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition-colors"
                        >
                            <ChevronRight size={14} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-1.5">
                        {months.map((m, i) => {
                            const isCurrentSelected = activeMonthIndex === i && selectedMonthKey.startsWith(String(activeYear));
                            return (
                                <button 
                                    key={m} 
                                    type="button"
                                    onClick={() => selectMonth(i)} 
                                    className={`text-[11px] font-bold py-2.5 rounded-lg transition-all tracking-tight ${isCurrentSelected ? 'bg-indigo-600 text-white shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors'}`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
