'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface PlannerDatePickerProps {
    selectedDate: string; // YYYY-MM-DD
    onDateChange: (val: string) => void;
    tasks: any[];
    onClose?: () => void;
}

export default function PlannerDatePicker({ selectedDate, onDateChange, tasks, onClose }: PlannerDatePickerProps) {
    const t = useTranslations();
    const locale = useLocale();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentMonthDate, setCurrentMonthDate] = useState(() => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        return new Date(y, m - 1, d);
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                if (onClose) onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Update internal calendar view if external selected date changes significantly
    useEffect(() => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        setCurrentMonthDate(new Date(y, m - 1, d));
    }, [selectedDate]);

    const currentYear = currentMonthDate.getFullYear();
    const currentMonth = currentMonthDate.getMonth();

    const formattedHeader = currentMonthDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' });
    const weekDays = locale === 'id' 
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getStartDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const startDayOfWeek = getStartDayOfWeek(currentYear, currentMonth);

    const prevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const selectDate = (day: number) => {
        const m = String(currentMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        onDateChange(`${currentYear}-${m}-${d}`);
        if (onClose) onClose();
    };

    const selectToday = () => {
        const today = new Date();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        onDateChange(`${today.getFullYear()}-${m}-${d}`);
        if (onClose) onClose();
    };

    const todayDateStr = (() => {
        const today = new Date();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        return `${today.getFullYear()}-${m}-${d}`;
    })();

    const isSelected = (day: number) => {
        const m = String(currentMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return selectedDate === `${currentYear}-${m}-${d}`;
    };

    const isToday = (day: number) => {
        const m = String(currentMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return todayDateStr === `${currentYear}-${m}-${d}`;
    };

    const isDisabled = (day: number) => {
        const targetDate = new Date(currentYear, currentMonth, day);
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 10);
        return targetDate.getTime() > maxDate.getTime();
    };

    // Activity Map
    const activityMap = useMemo(() => {
        const map: Record<string, { total: number; completed: number }> = {};
        tasks.forEach(task => {
            if (!task.date) return;
            if (!map[task.date]) map[task.date] = { total: 0, completed: 0 };
            map[task.date].total++;
            if (task.completed) map[task.date].completed++;
        });
        return map;
    }, [tasks]);

    const getDayActivity = (day: number) => {
        const m = String(currentMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return activityMap[`${currentYear}-${m}-${d}`];
    };

    return (
        <div className="w-[280px] sm:w-[320px] relative z-50 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-700 p-5 transition-colors duration-500" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <h4 className="font-bold text-slate-700 dark:text-slate-200 capitalize text-sm">{formattedHeader}</h4>
                <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    <ChevronRight size={16} strokeWidth={3} />
                </button>
            </div>

            <div className="grid grid-cols-7 mb-2 text-center">
                {weekDays.map(dayName => (
                    <span key={dayName} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        {dayName}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`blank-${i}`}></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isDisabled(day);
                    const selected = isSelected(day);
                    const today = isToday(day) && !selected;
                    const activity = getDayActivity(day);

                    return (
                        <button 
                            key={day}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled) selectDate(day);
                            }}
                            disabled={disabled}
                            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex flex-col items-center justify-center transition-all relative group 
                                ${selected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'}
                                ${today ? 'ring-1 ring-indigo-200 dark:ring-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-500/10' : ''}
                                ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}
                            `}
                        >
                            <span className="text-xs sm:text-sm font-bold leading-none">{day}</span>
                            
                            {activity && (
                                <div className="mt-1 flex gap-0.5">
                                    {activity.completed < activity.total ? (
                                        <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${selected ? 'bg-indigo-200' : 'bg-indigo-400'}`}></span>
                                    ) : (
                                        <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${selected ? 'bg-emerald-200' : 'bg-emerald-400'}`}></span>
                                    )}
                                </div>
                            )}

                            {today && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
                <button onClick={(e) => { e.stopPropagation(); selectToday(); }} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest transition">{t('select_today') || t('label_today') || 'Ke Hari Ini'}</button>
            </div>
        </div>
    );
}
