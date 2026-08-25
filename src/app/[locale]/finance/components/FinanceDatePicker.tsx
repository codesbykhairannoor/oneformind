'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';

interface TransactionItem {
    date: string;
    amount: number;
    type: 'income' | 'expense';
}

interface FinanceDatePickerProps {
    modelValue: string;
    onUpdateModelValue: (val: string) => void;
    onClose: () => void;
    show?: boolean;
    transactions?: TransactionItem[];
    className?: string;
    activeCurrency?: string;
    currencyLocale?: string;
}

export default function FinanceDatePicker({
    modelValue,
    onUpdateModelValue,
    onClose,
    show = true,
    transactions = [],
    className = '',
    activeCurrency = 'IDR',
    currencyLocale = 'id-ID'
}: FinanceDatePickerProps) {
    const locale = useLocale();
    const loc = locale === 'id' ? 'id-ID' : 'en-US';

    const initialDate = modelValue ? new Date(modelValue) : new Date();
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

    if (!show) return null;

    const needsDecimal = ['USD', 'GBP', 'EUR'].includes(activeCurrency);
    const formatMoney = (val: number) => {
        return new Intl.NumberFormat(currencyLocale, {
            style: 'currency',
            currency: activeCurrency,
            minimumFractionDigits: needsDecimal ? 2 : 0,
            maximumFractionDigits: needsDecimal ? 2 : 0
        }).format(val);
    };

    // Daily Map — 1:1 from FinanceDatePicker.vue line 33-58
    const dailyMap = useMemo(() => {
        const map: Record<string, { income: number; expense: number; net: number; count: number }> = {};
        transactions.forEach(trx => {
            const dateKey = trx.date;
            if (!map[dateKey]) map[dateKey] = { income: 0, expense: 0, net: 0, count: 0 };
            const amt = Number(trx.amount);
            if (trx.type === 'income') {
                map[dateKey].income += amt;
                map[dateKey].net += amt;
            } else {
                map[dateKey].expense += amt;
                map[dateKey].net -= amt;
            }
            map[dateKey].count++;
        });
        return map;
    }, [transactions]);

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthHeader = new Date(currentYear, currentMonth, 1).toLocaleDateString(loc, {
        month: 'long',
        year: 'numeric'
    });

    const weekDays = locale === 'id' 
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const selectDate = (day: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onUpdateModelValue(dateStr);
        onClose();
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className={`w-[300px] sm:w-[320px] max-w-[95vw] ${className}`}>
            {/* Backdrop for desktop click outside — 1:1 from FinanceDatePicker.vue line 116 */}
            <div className="fixed inset-0 z-40 hidden sm:block" onClick={onClose}></div>

            <div className="relative z-50 bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 p-5 animate-in fade-in zoom-in-95 duration-200 transition-colors duration-500">
                
                {/* Header Month Switcher — 1:1 from FinanceDatePicker.vue line 120-124 */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} type="button" className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 font-bold">
                        ◀
                    </button>
                    <h4 className="font-bold text-slate-700 dark:text-white capitalize transition-colors duration-500">{monthHeader}</h4>
                    <button onClick={nextMonth} type="button" className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 font-bold">
                        ▶
                    </button>
                </div>

                {/* Weekday Names — 1:1 from FinanceDatePicker.vue line 126-130 */}
                <div className="grid grid-cols-7 mb-2 text-center">
                    {weekDays.map(dayName => (
                        <span key={dayName} className="text-[10px] font-bold text-slate-400 dark:text-slate-600 transition-colors duration-500">
                            {dayName}
                        </span>
                    ))}
                </div>

                {/* Days Grid — 1:1 from FinanceDatePicker.vue line 132-161 */}
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                        <div key={`blank-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = modelValue === dateStr;
                        const isTodayDate = todayStr === dateStr;
                        const stats = dailyMap[dateStr];

                        const tooltipTitle = stats 
                            ? `${formatMoney(stats.net)} (${stats.count} Trx)` 
                            : 'Tidak ada transaksi';

                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => selectDate(day)}
                                title={tooltipTitle}
                                className={`h-9 w-9 rounded-xl flex flex-col items-center justify-center transition-all relative group duration-300 ${
                                    isSelected 
                                        ? 'bg-indigo-600 text-white shadow-lg dark:shadow-none shadow-indigo-200 dark:shadow-indigo-900/40 font-bold' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                                } ${isTodayDate && !isSelected ? 'ring-1 ring-indigo-200 dark:ring-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                            >
                                <span className="text-sm font-bold leading-none">{day}</span>
                                
                                {stats && (
                                    <div className="mt-1 flex gap-0.5">
                                        {stats.net > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />}
                                        {stats.net < 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-sm" />}
                                        {stats.net === 0 && <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                    </div>
                                )}

                                {isTodayDate && !isSelected && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
