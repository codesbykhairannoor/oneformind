'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';

interface GoalDatePickerProps {
    show: boolean;
    modelValue?: string | null;
    teleport?: boolean;
    onUpdateModelValue?: (val: string) => void;
    onClose?: () => void;
}

export default function GoalDatePicker({ show, modelValue, teleport = false, onUpdateModelValue, onClose }: GoalDatePickerProps) {
    const t = useTranslations();
    const [currentDate, setCurrentDate] = useState(() => {
        return modelValue ? new Date(modelValue) : new Date();
    });

    if (!show) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = new Date(year, month, 1).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const selectedMonth = String(month + 1).padStart(2, '0');
        const selectedDay = String(day).padStart(2, '0');
        const dateStr = `${year}-${selectedMonth}-${selectedDay}`;
        onUpdateModelValue?.(dateStr);
        onClose?.();
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const isSelected = (day: number) => {
        if (!modelValue) return false;
        const selectedMonth = String(month + 1).padStart(2, '0');
        const selectedDay = String(day).padStart(2, '0');
        return modelValue === `${year}-${selectedMonth}-${selectedDay}`;
    };

    const isToday = (day: number) => {
        const selectedMonth = String(month + 1).padStart(2, '0');
        const selectedDay = String(day).padStart(2, '0');
        return todayStr === `${year}-${selectedMonth}-${selectedDay}`;
    };

    const pickerContent = (
        <div className={teleport ? "fixed inset-0 z-[1000] flex items-center justify-center p-4" : "absolute top-full left-0 mt-2 z-[100] shadow-2xl"}>
            {teleport && (
                <div className="absolute inset-0 bg-slate-900/40" onClick={() => onClose?.()}></div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-800 p-6 relative z-10 w-[300px]">
                <div className="flex items-center justify-between mb-5 px-1">
                    <button type="button" onClick={prevMonth} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
                        <ChevronLeft className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div className="text-center">
                        <h4 className="font-black text-slate-800 dark:text-white capitalize tracking-tight text-base leading-none">
                            {monthNames[month]} {year}
                        </h4>
                    </div>
                    <button type="button" onClick={nextMonth} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                </div>

                <div className="grid grid-cols-7 mb-2 text-center h-8 items-center">
                    {weekDays.map((dayName) => (
                        <span key={dayName} className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                            {dayName}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                        <div key={`blank-${idx}`} className="h-9 w-9"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const day = idx + 1;
                        const selected = isSelected(day);
                        const today = isToday(day);

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleSelectDate(day)}
                                className={`h-9 w-9 flex items-center justify-center rounded-2xl text-sm font-bold transition-all relative group ${
                                    selected 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none scale-105 z-10' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600'
                                } ${today && !selected ? 'text-indigo-600 ring-1 ring-indigo-100 dark:ring-indigo-900' : ''}`}
                            >
                                {day}
                                {today && (
                                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${selected ? 'bg-white' : 'bg-indigo-500'}`}></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-1">
                    <button type="button" onClick={() => setCurrentDate(new Date())} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-all">
                        {t('datepicker_today') || 'Today'}
                    </button>
                    <button type="button" onClick={() => onClose?.()} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all">
                        {t('btn_cancel') || 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );

    return teleport ? <ModalPortal>{pickerContent}</ModalPortal> : pickerContent;
}
