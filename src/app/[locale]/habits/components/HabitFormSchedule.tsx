'use client';

import React from 'react';
import { calculateScheduledDays } from '../utils/habitMath';
import { Calendar, Clock, Check, ChevronRight } from 'lucide-react';
import { LifeOSTab } from '../types';

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
    formStartTime?: string;
    setFormStartTime?: (v: string) => void;
    formEndTime?: string;
    setFormEndTime?: (v: string) => void;
    formStartDate?: string;
    setFormStartDate?: (v: string) => void;
    formEndDate?: string;
    setFormEndDate?: (v: string) => void;
    formGoalId?: string | number;
    setFormGoalId?: (v: string | number | undefined) => void;
    formGoalTitle?: string;
    setFormGoalTitle?: (v: string) => void;
    formAnchorCue?: string;
    setFormAnchorCue?: (v: string) => void;
    formElasticMini?: string;
    setFormElasticMini?: (v: string) => void;
    formDailyFinancialImpact?: number;
    setFormDailyFinancialImpact?: (v: number | undefined) => void;
    formIsKeystone?: boolean;
    setFormIsKeystone?: (v: boolean) => void;
    formSyncedTabs?: LifeOSTab[];
    setFormSyncedTabs?: (v: LifeOSTab[]) => void;
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
    setFormTimeOfDay,
    formStartTime = '',
    setFormStartTime,
    formEndTime = '',
    setFormEndTime,
    formStartDate = '',
    setFormStartDate,
    formEndDate = '',
    setFormEndDate,
    formSyncedTabs = [],
    setFormSyncedTabs
}: HabitFormScheduleProps) {
    const isPlannerActive = formSyncedTabs.includes('planner');

    const togglePlannerSync = () => {
        if (!setFormSyncedTabs) return;
        if (isPlannerActive) {
            setFormSyncedTabs(formSyncedTabs.filter(t => t !== 'planner'));
            if (setFormStartTime) setFormStartTime('');
            if (setFormEndTime) setFormEndTime('');
            if (setFormEndDate) setFormEndDate('');
        } else {
            setFormSyncedTabs([...formSyncedTabs.filter(t => t !== 'planner'), 'planner']);
            if (!formStartTime && setFormStartTime) setFormStartTime('08:00');
            if (!formEndTime && setFormEndTime) setFormEndTime('08:30');
        }
    };

    return (
        <div className="space-y-6">
            {/* SECTION 5: KOMITMEN TARGET BULANAN */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        5. {isIndo ? 'Target Komitmen Bulanan' : 'Monthly Target Commitment'}
                    </label>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                        {formTarget} {isIndo ? 'Hari / Bulan' : 'Days / Month'}
                    </span>
                </div>

                {/* Slider Target Manual */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                        {isIndo ? 'Target Hari:' : 'Target Days:'}
                    </span>
                    <input
                        type="range"
                        min="1"
                        max={daysInCurrentMonth}
                        value={formTarget}
                        onChange={(e) => setFormTarget(Number(e.target.value))}
                        className="flex-1 accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 shrink-0 w-16 text-right">
                        {formTarget} {isIndo ? 'Hari' : 'Days'}
                    </span>
                </div>

                {/* Waktu Umum Hari (Pagi, Siang, Malam, Kapan Saja) */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                            className={`py-2 px-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
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

            {/* SECTION 6: INTEGRASI KE TAB PLANNER (HANYA MUNCUL OPSI KETIKA AKTIF) */}
            <div className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                isPlannerActive 
                    ? 'bg-gradient-to-b from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/5' 
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
            }`}>
                {/* Header Switcher Integrasi */}
                <div className="p-4 md:p-5 flex items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition ${
                            isPlannerActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                            📝
                        </div>
                        <div>
                            <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span>{isIndo ? 'Integrasi ke Tab Planner' : 'Sync to Planner Tab'}</span>
                                {isPlannerActive && (
                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                                        AKTIF
                                    </span>
                                )}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {isIndo 
                                    ? 'Aktifkan untuk mengatur jadwal jam, hari, dan masa aktif rutinitas ini di Timeline Planner.' 
                                    : 'Enable to schedule hours, days, and active range directly on Planner Timeline.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={togglePlannerSync}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 active:scale-95 shadow-xs ${
                            isPlannerActive
                                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {isPlannerActive ? (
                            <span>{isIndo ? 'Batalkan' : 'Disable'}</span>
                        ) : (
                            <>
                                <span>+</span>
                                <span>{isIndo ? 'Aktifkan Tab Planner' : 'Enable Planner'}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* KETIKA TAB PLANNER DIAKTIFKAN: MUNCUL OPSI WAKTU, HARI KAPAN AJA, & SAMPAI KAPAN */}
                {isPlannerActive ? (
                    <div className="p-4 md:p-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* 1. WAKTU YANG AKAN MUNCUL DI PLANNER */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
                                    <span>{isIndo ? 'Waktu (Jam Mulai & Jam Selesai di Timeline Planner):' : 'Time (Start & End Hour on Planner Timeline):'}</span>
                                </span>
                                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {formStartTime} - {formEndTime || '??'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 block mb-1">
                                        {isIndo ? 'Jam Mulai' : 'Start Time'}
                                    </label>
                                    <input
                                        type="time"
                                        value={formStartTime || ''}
                                        onChange={(e) => {
                                            const startVal = e.target.value;
                                            if (setFormStartTime) setFormStartTime(startVal);
                                            if (startVal && !formEndTime && setFormEndTime) {
                                                const [h, m] = startVal.split(':').map(Number);
                                                const endTotal = h * 60 + m + 30;
                                                const endH = String(Math.floor(endTotal / 60) % 24).padStart(2, '0');
                                                const endM = String(endTotal % 60).padStart(2, '0');
                                                setFormEndTime(`${endH}:${endM}`);
                                            }
                                        }}
                                        className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-xs"
                                    />
                                </div>

                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 block mb-1">
                                        {isIndo ? 'Jam Selesai' : 'End Time'}
                                    </label>
                                    <input
                                        type="time"
                                        value={formEndTime || ''}
                                        onChange={(e) => setFormEndTime && setFormEndTime(e.target.value)}
                                        className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-xs"
                                    />
                                </div>
                            </div>

                            {/* Tombol Durasi Cepat */}
                            <div className="flex items-center gap-1.5 pt-1">
                                <span className="text-[9px] font-bold text-slate-400 shrink-0">{isIndo ? 'Durasi Cepat:' : 'Quick Duration:'}</span>
                                {[15, 30, 45, 60].map(mins => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => {
                                            if (!setFormEndTime) return;
                                            const baseTime = formStartTime || '08:00';
                                            const [h, m] = baseTime.split(':').map(Number);
                                            const total = h * 60 + m + mins;
                                            const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
                                            const endM = String(total % 60).padStart(2, '0');
                                            setFormEndTime(`${endH}:${endM}`);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-black hover:bg-indigo-100 transition"
                                    >
                                        +{mins}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. HARI KAPAN AJA YANG AKAN MUNCUL DI PLANNER */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">
                                    {isIndo ? 'Hari Kapan Aja Muncul di Planner:' : 'Scheduled Days in Planner:'}
                                </span>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    {formFreqType === 'daily' 
                                        ? (isIndo ? 'Setiap Hari' : 'Every Day') 
                                        : `${formFreqDays.length} ${isIndo ? 'Hari/Minggu' : 'Days/Week'}`}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormFreqType('daily');
                                        setFormTarget(daysInCurrentMonth);
                                    }}
                                    className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
                                        formFreqType === 'daily'
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <span>📅</span> {isIndo ? 'Setiap Hari' : 'Every Day'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormFreqType('weekly_days');
                                        setFormTarget(calculateScheduledDays(formFreqDays, currentMonthKey));
                                    }}
                                    className={`py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
                                        formFreqType === 'weekly_days'
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <span>🗓️</span> {isIndo ? 'Hari Tertentu' : 'Specific Days'}
                                </button>
                            </div>

                            {formFreqType === 'weekly_days' && (
                                <div className="grid grid-cols-7 gap-1.5 pt-1">
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
                                                className={`h-10 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 border-2 ${
                                                    isSelected
                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-102'
                                                        : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                                                }`}
                                            >
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* 3. SAMPAI KAPAN (RENTANG TANGGAL DI PLANNER) */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <Calendar size={14} className="text-emerald-500" />
                                    <span>{isIndo ? 'Sampai Kapan (Masa Aktif Jadwal di Planner):' : 'Schedule Horizon (Active Date Range):'}</span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    {formEndDate ? (isIndo ? `Sampai ${formEndDate}` : `Until ${formEndDate}`) : (isIndo ? 'Seterusnya' : 'Forever')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                    { key: 'forever', label: isIndo ? 'Seterusnya' : 'Forever', desc: isIndo ? 'Tanpa Batas' : 'No end date', getEndDate: () => '' },
                                    { 
                                        key: 'month_end', 
                                        label: isIndo ? 'Akhir Bulan' : 'End of Month', 
                                        desc: `${monthNames[selectedMonthIndex]} ${selectedYear}`, 
                                        getEndDate: () => {
                                            const lastDay = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
                                            return `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
                                        }
                                    },
                                    { 
                                        key: '3_months', 
                                        label: isIndo ? '3 Bulan' : '3 Months', 
                                        desc: '+90 hari', 
                                        getEndDate: () => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + 90);
                                            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                        }
                                    },
                                    { 
                                        key: 'custom', 
                                        label: isIndo ? 'Pilih Tanggal' : 'Pick Date', 
                                        desc: formEndDate || (isIndo ? 'Kalender' : 'Calendar'), 
                                        getEndDate: () => formEndDate || new Date().toISOString().split('T')[0]
                                    }
                                ].map(opt => {
                                    const isSelected = opt.key === 'forever' ? !formEndDate : (opt.key === 'custom' ? !!formEndDate : formEndDate === opt.getEndDate());
                                    return (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() => {
                                                if (setFormEndDate) setFormEndDate(opt.getEndDate());
                                            }}
                                            className={`p-2.5 rounded-2xl border-2 text-left transition-all ${
                                                isSelected
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                                            }`}
                                        >
                                            <div className="text-xs font-black">{opt.label}</div>
                                            <div className="text-[9px] opacity-75 truncate mt-0.5">{opt.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            {formEndDate && (
                                <div className="pt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{isIndo ? 'Tanggal Berakhir:' : 'End Date:'}</span>
                                    <input
                                        type="date"
                                        value={formEndDate}
                                        onChange={(e) => setFormEndDate && setFormEndDate(e.target.value)}
                                        className="text-xs font-mono font-bold py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            {isIndo 
                                ? 'Rutinitas ini belum disambungkan ke Planner. Klik tombol di atas jika ingin menjadwalkannya di Timeline Planner.' 
                                : 'Not connected to Planner. Click button above to schedule on Planner Timeline.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
