'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { calculateScheduledDays } from '../utils/habitMath';
import { Target, Coins, Sparkles, Calendar, CheckSquare, BookOpen, Briefcase, Dumbbell, BookMarked, Clock } from 'lucide-react';
import { LifeOSTab } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

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
    setFormGoalId: (v: string | number | undefined) => void;
    formGoalTitle?: string;
    setFormGoalTitle: (v: string) => void;
    formAnchorCue?: string;
    setFormAnchorCue: (v: string) => void;
    formElasticMini?: string;
    setFormElasticMini: (v: string) => void;
    formDailyFinancialImpact?: number;
    setFormDailyFinancialImpact: (v: number | undefined) => void;
    formIsKeystone?: boolean;
    setFormIsKeystone: (v: boolean) => void;
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
    formGoalId,
    setFormGoalId,
    formGoalTitle,
    setFormGoalTitle,
    formAnchorCue,
    setFormAnchorCue,
    formElasticMini,
    setFormElasticMini,
    formDailyFinancialImpact,
    setFormDailyFinancialImpact,
    formIsKeystone,
    setFormIsKeystone,
    formSyncedTabs = ['calendar', 'planner'],
    setFormSyncedTabs
}: HabitFormScheduleProps) {
    const { data: rawGoals } = useSWR('/api/goals', fetcher);
    const availableGoals = Array.isArray(rawGoals) ? rawGoals : [];

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

            {/* SECTION 6: WAKTU PELAKSANAAN & PLOT TIMELINE PLANNER */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        7. {isIndo ? 'Waktu Pelaksanaan & Jadwal Timeline' : 'Time & Timeline Schedule'}
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {formStartTime ? (formEndTime ? `${formStartTime} - ${formEndTime}` : formStartTime) : (isIndo ? 'Fleksibel' : 'Flexible')}
                    </span>
                </div>

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

                {/* EXACT TIME PICKER FOR PLANNER TIMELINE */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Clock size={13} className="text-indigo-600 dark:text-indigo-400" />
                            <span>{isIndo ? 'Jam Spesifik di Timeline Planner (Opsional):' : 'Specific Hour in Planner Timeline (Optional):'}</span>
                        </span>
                        {formStartTime && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (setFormStartTime) setFormStartTime('');
                                    if (setFormEndTime) setFormEndTime('');
                                }}
                                className="text-[10px] font-bold text-rose-500 hover:underline"
                            >
                                {isIndo ? 'Hapus Jam' : 'Clear Time'}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
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
                                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
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
                                className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Quick Duration Shortcuts */}
                    {formStartTime && (
                        <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[9px] font-bold text-slate-400 shrink-0">{isIndo ? 'Durasi Cepat:' : 'Quick Duration:'}</span>
                            {[15, 30, 45, 60].map(mins => (
                                <button
                                    key={mins}
                                    type="button"
                                    onClick={() => {
                                        if (!formStartTime || !setFormEndTime) return;
                                        const [h, m] = formStartTime.split(':').map(Number);
                                        const total = h * 60 + m + mins;
                                        const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
                                        const endM = String(total % 60).padStart(2, '0');
                                        setFormEndTime(`${endH}:${endM}`);
                                    }}
                                    className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[10px] font-black hover:bg-indigo-100 transition"
                                >
                                    +{mins}m
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 bg-indigo-50/50 dark:bg-indigo-950/20 p-2 rounded-xl border border-indigo-100/60 dark:border-indigo-900/30">
                        ⚡ {isIndo 
                            ? 'Jika diisi, rutinitas ini otomatis muncul langsung pada grid jam Planner Timeline sesuai jadwal harinya!' 
                            : 'If set, this routine will be plotted directly onto the Planner Timeline grid at these exact hours!'}
                    </p>
                </div>

                {/* HORIZON / SAMPAI KAPAN */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Calendar size={13} className="text-emerald-500" />
                            <span>{isIndo ? 'Sampai Kapan (Rentang Tanggal Pelaksanaan):' : 'Schedule Horizon (Active Date Range):'}</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {formEndDate ? (isIndo ? `Sampai ${formEndDate}` : `Until ${formEndDate}`) : (isIndo ? 'Seterusnya' : 'Indefinitely')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                            { key: 'forever', label: isIndo ? 'Seterusnya' : 'Forever', desc: isIndo ? 'Tanpa batas' : 'No end date', getEndDate: () => '' },
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
                                    className={`p-2 rounded-xl border text-left transition-all ${
                                        isSelected
                                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                                    }`}
                                >
                                    <div className="text-[11px] font-black">{opt.label}</div>
                                    <div className="text-[9px] opacity-75 truncate">{opt.desc}</div>
                                </button>
                            );
                        })}
                    </div>

                    {formEndDate && (
                        <div className="pt-1.5 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">{isIndo ? 'Tanggal Selesai:' : 'End Date:'}</span>
                            <input
                                type="date"
                                value={formEndDate}
                                onChange={(e) => setFormEndDate && setFormEndDate(e.target.value)}
                                className="text-xs font-mono font-bold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION 8: INTEGRASI LIFE OS & PILIH TAB */}
            <div className="p-4 md:p-5 rounded-3xl bg-slate-50/90 dark:bg-slate-950/70 border-2 border-indigo-100 dark:border-indigo-900/50 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-base">🧬</span>
                            <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                                {isIndo ? 'Pilih Tab yang Ingin Disambungkan' : 'Select Connected Tabs / Modules'}
                            </h4>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {isIndo 
                                ? 'Pilih modul yang aktif untuk habit ini. Kamu bebas memilih mau sambung ke tab mana saja!' 
                                : 'Choose which tabs sync with this habit. Full freedom of module connection!'}
                        </p>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-xs shrink-0">
                        {formSyncedTabs.length} / 7 {isIndo ? 'Tab Aktif' : 'Tabs'}
                    </span>
                </div>

                {/* Grid 7 Tab Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { id: 'calendar' as LifeOSTab, icon: '📅', label: isIndo ? 'Kalender' : 'Calendar', desc: isIndo ? 'Jadwal & centang di kalender' : 'Schedule on calendar' },
                        { id: 'planner' as LifeOSTab, icon: '📝', label: isIndo ? 'Planner' : 'Planner', desc: isIndo ? 'Checklist harian timeline' : 'Daily timeline item' },
                        { id: 'goal' as LifeOSTab, icon: '🎯', label: isIndo ? 'Goals' : 'Goals', desc: isIndo ? 'Tautkan ke target hidup' : 'Link to master goal' },
                        { id: 'study' as LifeOSTab, icon: '📚', label: isIndo ? 'Study' : 'Study', desc: isIndo ? 'Auto-centang sesi fokus 25m' : 'Auto-log 25m focus' },
                        { id: 'jobs' as LifeOSTab, icon: '💼', label: isIndo ? 'Jobs' : 'Jobs', desc: isIndo ? 'Auto-centang saat melamar' : 'Auto-log job apply' },
                        { id: 'finance' as LifeOSTab, icon: '💰', label: isIndo ? 'Keuangan' : 'Finance', desc: isIndo ? 'Dampak hemat & insight' : 'Compounding savings' },
                        { id: 'journal' as LifeOSTab, icon: '📔', label: isIndo ? 'Jurnal' : 'Journal', desc: isIndo ? 'Refleksi friksi saat bolos' : 'Friction audit on miss' },
                    ].map(tab => {
                        const isSelected = formSyncedTabs.includes(tab.id);
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    if (!setFormSyncedTabs) return;
                                    if (isSelected) {
                                        setFormSyncedTabs(formSyncedTabs.filter(t => t !== tab.id));
                                    } else {
                                        setFormSyncedTabs([...formSyncedTabs, tab.id]);
                                    }
                                }}
                                className={`p-2.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[76px] ${
                                    isSelected
                                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 shadow-xs scale-[1.02]'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 hover:opacity-90'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                                        isSelected 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'border border-slate-300 dark:border-slate-700 text-transparent'
                                    }`}>
                                        ✓
                                    </span>
                                </div>
                                <div className="mt-1">
                                    <div className={`text-xs font-black leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {tab.label}
                                    </div>
                                    <div className="text-[9px] font-medium text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                                        {tab.desc}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 1. Tautkan ke Target Hidup (Goals) - Ditampilkan jika Tab Goal Dipilih */}
                {formSyncedTabs.includes('goal') && (
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{isIndo ? 'Pilih Target Goal yang Didukung (Leading Measure):' : 'Select Supported Master Goal:'}</span>
                        </label>
                        <select
                            value={formGoalId || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (!val) {
                                    setFormGoalId(undefined);
                                    setFormGoalTitle('');
                                } else {
                                    setFormGoalId(val);
                                    const g = availableGoals.find((item: any) => String(item.id) === String(val));
                                    if (g) setFormGoalTitle(g.title || '');
                                }
                            }}
                            className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition"
                        >
                            <option value="">{isIndo ? '— Pilih Goal —' : '— Select Goal —'}</option>
                            {availableGoals.map((g: any) => (
                                <option key={g.id} value={g.id}>
                                    🎯 {g.title}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400">
                            {isIndo 
                                ? 'Habit ini akan muncul di kartu Goal tersebut dan menghitung kecepatan capaian targetmu.' 
                                : 'This habit will be rendered on the Goal card as supporting velocity.'}
                        </p>
                    </div>
                )}

                {/* Dampak Finansial Harian (Compounding Savings / Cost-of-Vice) */}
                {formSyncedTabs.includes('finance') && (
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{isIndo ? 'Dampak Finansial Harian (Cost-of-Vice / Hemat Harian)' : 'Daily Financial Impact (ROI / Savings)'}</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">Rp</span>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={formDailyFinancialImpact !== undefined ? formDailyFinancialImpact : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormDailyFinancialImpact(val === '' ? undefined : Number(val));
                                }}
                                placeholder="Contoh: 25000 (biaya rokok/kopi harian yang dihemat)"
                                className="w-full text-xs font-mono font-bold py-2.5 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">
                            {isIndo 
                                ? 'Tiap hari tuntas, nominal ini dikalikan dan diakumulasikan ke tab Keuangan sebagai tabungan nyata.' 
                                : 'Each completed day compounds into the Finance tab as tangible accumulated savings.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
