'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Calendar } from 'lucide-react';

interface JobDatePickerProps {
    value?: string;
    onChange: (dateStr: string) => void;
    onSave?: () => void;
}

export default function JobDatePicker({ value, onChange, onSave }: JobDatePickerProps) {
    const locale = useLocale();
    const loc = locale === 'id' ? 'id-ID' : 'en-US';

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const initialDate = value ? new Date(value) : new Date();
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setCurrentYear(d.getFullYear());
                setCurrentMonth(d.getMonth());
            }
        }
    }, [value]);

    const displayDate = value ? new Date(value).toLocaleDateString(loc, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '-';

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const formattedHeader = new Date(currentYear, currentMonth, 1).toLocaleDateString(loc, {
        month: 'long',
        year: 'numeric'
    });

    const weekDays = locale === 'id' 
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const todayStr = new Date().toISOString().split('T')[0];

    const prevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const nextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const selectDate = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(dateStr);
        if (onSave) onSave();
        setIsOpen(false);
    };

    return (
        // 1:1 from JobDatePicker.vue line 49-82
        <div 
            className="relative w-full h-full flex items-center px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none" 
            ref={containerRef} 
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className="text-slate-600 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                {displayDate}
            </span>

            {isOpen && (
                <div 
                    className="fixed sm:absolute top-1/2 sm:top-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-0 mt-0 sm:mt-2 w-[280px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-5 z-[100] animate-in fade-in zoom-in-95 duration-150" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sm:hidden fixed inset-0 bg-slate-900/40 -z-10" onClick={() => setIsOpen(false)}></div>
                    
                    <div className="flex items-center justify-between mb-4">
                        <button type="button" onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition font-bold">
                            ◀
                        </button>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200 capitalize text-sm">{formattedHeader}</h4>
                        <button type="button" onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition font-bold">
                            ▶
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-2 text-center">
                        {weekDays.map(dayName => (
                            <span key={dayName} className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase">
                                {dayName}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startDayOfWeek }).map((_, i) => (
                            <div key={`blank-${i}`} />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = value === dateStr;
                            const isTodayDate = todayStr === dateStr;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => selectDate(day)}
                                    className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all text-sm font-bold relative ${
                                        isSelected 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                                    }`}
                                >
                                    {day}
                                    {isTodayDate && !isSelected && (
                                        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
