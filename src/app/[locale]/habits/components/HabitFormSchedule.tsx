'use client';

import React from 'react';
import { calculateScheduledDays } from '../utils/habitMath';

interface HabitFormScheduleProps {
    isIndo: boolean;
    daysInCurrentMonth: number;
    monthNames: string[];
    selectedMonthIndex: number;
    selectedYear: number;
    currentMonthKey: string;
    formTarget: number;
    setFormTarget: (v: number) => void;
    formFreqType: 'daily' | 'weekly_days';
    setFormFreqType: (v: 'daily' | 'weekly_days') => void;
    formFreqDays: number[];
    setFormFreqDays: (v: number[]) => void;
    formTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
    setFormTimeOfDay: (v: 'morning' | 'afternoon' | 'evening' | 'anytime') => void;
}

export default function HabitFormSchedule({
    isIndo,
    daysInCurrentMonth,
    monthNames,
    selectedMonthIndex,
    selectedYear,
    currentMonthKey,
    formTarget,
    setFormTarget,
    formFreqType,
    setFormFreqType,
    formFreqDays,
    setFormFreqDays,
    formTimeOfDay,
    setFormTimeOfDay
}: HabitFormScheduleProps) {
    return (
        <div className="space-y-6">
            {/* SECTION 5: JADWAL & KOMITMEN BULANAN */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        6. {isIndo ? 'Jadwal & Komitmen Bulanan' : 'Schedule & Frequency'}
                    </label>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {formTarget} {isIndo ? 'Hari / Bulan' : 'Days / Month'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => {
                            setFormFreqType('daily');
                            setFormTarget(daysInCurrentMonth);
                        }}
                        className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                            formFreqType === 'daily'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        <span>📅</span> {isIndo ? 'Setiap Hari (30/31 Hari)' : 'Every Day (Full Month)'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFormFreqType('weekly_days');
                            setFormTarget(calculateScheduledDays(formFreqDays, currentMonthKey));
                        }}
                        className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                            formFreqType === 'weekly_days'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        <span>🗓️</span> {isIndo ? 'Hari Tertentu (Rest Day)' : 'Specific Days (With Rest Days)'}
                    </button>
                </div>

                {/* Weekday Selection with Auto Calculation */}
                {formFreqType === 'weekly_days' && (
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>{isIndo ? 'Pilih hari aktif pelaksanaan:' : 'Select scheduled weekdays:'}</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-black">
                                {formFreqDays.length} {isIndo ? 'hari per minggu' : 'days per week'}
                            </span>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                            {[
                                { day: 1, label: isIndo ? 'Sen' : 'Mon' },
                                { day: 2, label: isIndo ? 'Sel' : 'Tue' },
                                { day: 3, label: isIndo ? 'Rab' : 'Wed' },
                                { day: 4, label: isIndo ? 'Kam' : 'Thu' },
                                { day: 5, label: isIndo ? 'Jum' : 'Fri' },
                                { day: 6, label: isIndo ? 'Sab' : 'Sat' },
                                { day: 0, label: isIndo ? 'Min' : 'Sun' }
                            ].map(item => {
                                const isSelected = formFreqDays.includes(item.day);
                                return (
                                    <button
                                        key={item.day}
                                        type="button"
                                        onClick={() => {
                                            let nextDays: number[];
                                            if (isSelected) {
                                                nextDays = formFreqDays.filter(d => d !== item.day);
                                            } else {
                                                nextDays = [...formFreqDays, item.day];
                                            }
                                            setFormFreqDays(nextDays);
                                            setFormTarget(calculateScheduledDays(nextDays, currentMonthKey));
                                        }}
                                        className={`h-11 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 border-2 ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                                                : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {isSelected && <span className="w-1 h-1 bg-white rounded-full" />}
                                    </button>
                                );
                            })}
                        </div>

                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            💡 {isIndo 
                                ? `Otomatis dihitung: Ada ${formTarget} hari jadwal aktif di bulan ${monthNames[selectedMonthIndex]} ${selectedYear}. Hari di luar jadwal otomatis menjadi Rest Day (☕) tanpa merusak streak.` 
                                : `Auto-calculated: ${formTarget} scheduled days in ${monthNames[selectedMonthIndex]} ${selectedYear}. Unscheduled days become Rest Days (☕) without breaking streaks.`}
                        </p>
                    </div>
                )}

                {/* Slider Target Manual */}
                <div className="mt-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        {isIndo ? 'Atur Target Manual:' : 'Adjust Target:'}
                    </span>
                    <input
                        type="range"
                        min="1"
                        max={daysInCurrentMonth}
                        value={formTarget}
                        onChange={(e) => setFormTarget(Number(e.target.value))}
                        className="flex-1 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 shrink-0 w-12 text-right">
                        {formTarget} {isIndo ? 'Hari' : 'Days'}
                    </span>
                </div>
            </div>

            {/* SECTION 6: WAKTU PELAKSANAAN */}
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    7. {isIndo ? 'Waktu Pelaksanaan' : 'Time of Day'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { code: 'morning', label: '🌅 Pagi', desc: '05:00 - 11:00' },
                        { code: 'afternoon', label: '☀️ Siang', desc: '11:00 - 17:00' },
                        { code: 'evening', label: '🌙 Malam', desc: '17:00 - 23:00' },
                        { code: 'anytime', label: '🔄 Kapan Saja', desc: 'Fleksibel' }
                    ].map(t => (
                        <button
                            key={t.code}
                            type="button"
                            onClick={() => setFormTimeOfDay(t.code as any)}
                            className={`py-2.5 px-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                                formTimeOfDay === t.code
                                    ? 'bg-indigo-50/70 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                            }`}
                        >
                            <span className="text-xs font-black text-slate-900 dark:text-white">{t.label}</span>
                            <span className="text-[9px] font-medium text-slate-400">{t.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
