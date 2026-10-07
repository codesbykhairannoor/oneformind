'use client';

import { useState, useEffect, useMemo } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { 
    X, 
    Trash2, 
    Check, 
    Calendar, 
    Coffee, 
    Pause, 
    RotateCcw,
    CalendarRange,
    Sparkles,
    Flame
} from 'lucide-react';
import { HabitItem } from '../types';

interface HabitNoteModalProps {
    habit: HabitItem | null;
    dateStr: string;
    initialNotes?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        habitId: number, 
        dateStr: string, 
        notes: string, 
        newStatus?: 'completed' | 'skipped' | 'empty' | 'rest' | 'relapse' | 'in_progress',
        applyWholeWeekRest?: boolean,
        customRestDates?: string[]
    ) => void;
    locale: string;
}

function getDateRangeArray(start: string, end: string): string[] {
    if (!start || !end) return [start || end];
    const dates: string[] = [];
    let cur = new Date(start + 'T00:00:00');
    const stop = new Date(end + 'T00:00:00');
    if (isNaN(cur.getTime()) || isNaN(stop.getTime())) return [start];
    if (cur > stop) return [start];
    while (cur <= stop && dates.length < 90) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        dates.push(`${y}-${m}-${d}`);
        cur.setDate(cur.getDate() + 1);
    }
    return dates;
}

function getWeekRangeArray(baseDate: string): string[] {
    const [y, m, d] = baseDate.split('-').map(Number);
    const targetDateObj = new Date(y, m - 1, d);
    if (isNaN(targetDateObj.getTime())) return [baseDate];
    const dayOfWeek = targetDateObj.getDay();
    const distToMon = (dayOfWeek + 6) % 7;
    const mondayObj = new Date(targetDateObj);
    mondayObj.setDate(targetDateObj.getDate() - distToMon);

    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
        const dayCur = new Date(mondayObj);
        dayCur.setDate(mondayObj.getDate() + i);
        const curY = dayCur.getFullYear();
        const curM = String(dayCur.getMonth() + 1).padStart(2, '0');
        const curD = String(dayCur.getDate()).padStart(2, '0');
        dates.push(`${curY}-${curM}-${curD}`);
    }
    return dates;
}

function addDaysToIso(startDateStr: string, daysCount: number): string {
    const d = new Date(startDateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return startDateStr;
    d.setDate(d.getDate() + (daysCount - 1));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export default function HabitNoteModal({
    habit,
    dateStr,
    initialNotes = '',
    isOpen,
    onClose,
    onSave,
    locale
}: HabitNoteModalProps) {
    if (!isOpen || !habit) return null;

    const isIndo = locale === 'id';
    const [notes, setNotes] = useState(initialNotes);

    // Initial status derived from habit logs for this date
    const currentLogStatus = habit.logs?.[dateStr]?.status || 'empty';
    const [selectedStatus, setSelectedStatus] = useState<'completed' | 'skipped' | 'empty' | 'rest' | 'relapse' | 'in_progress'>(currentLogStatus);
    
    // Rest Period Scope: 'single' | 'range' | 'week'
    const [restScope, setRestScope] = useState<'single' | 'range' | 'week'>('single');
    const [restStartDate, setRestStartDate] = useState(dateStr);
    const [restEndDate, setRestEndDate] = useState(dateStr);

    useEffect(() => {
        setNotes(initialNotes);
        const logStatus = habit?.logs?.[dateStr]?.status || 'empty';
        setSelectedStatus(logStatus);
        setRestScope('single');
        setRestStartDate(dateStr);
        setRestEndDate(addDaysToIso(dateStr, 7));
    }, [initialNotes, isOpen, habit, dateStr]);

    // Computed target dates based on scope
    const calculatedTargetDates = useMemo(() => {
        if (selectedStatus !== 'rest' && selectedStatus !== 'empty') {
            return [dateStr];
        }

        if (restScope === 'single') {
            return [dateStr];
        } else if (restScope === 'week') {
            return getWeekRangeArray(dateStr);
        } else if (restScope === 'range') {
            return getDateRangeArray(restStartDate, restEndDate);
        }
        return [dateStr];
    }, [selectedStatus, restScope, dateStr, restStartDate, restEndDate]);

    const handleApplyPreset = (days: number) => {
        setRestScope('range');
        setRestStartDate(dateStr);
        setRestEndDate(addDaysToIso(dateStr, days));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(
            habit.id, 
            dateStr, 
            notes.trim(), 
            selectedStatus, 
            false, 
            calculatedTargetDates
        );
        onClose();
    };

    const handleDelete = () => {
        onSave(habit.id, dateStr, '', 'empty', false, [dateStr]);
        onClose();
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg max-h-[92vh] overflow-y-auto relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                            >
                                {habit.icon}
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-slate-100 truncate max-w-[240px]">
                                    {habit.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mt-0.5">
                                    <Calendar size={13} className="text-indigo-500" />
                                    <span>{dateStr}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={onClose} 
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Quick Active Status Banner & Cancel Trigger */}
                    {currentLogStatus === 'rest' && (
                        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5 text-xs font-black text-amber-900 dark:text-amber-200 text-left">
                                <Coffee size={18} className="text-amber-600 shrink-0" />
                                <div>
                                    <p className="leading-tight">{isIndo ? 'Hari ini sedang mode Istirahat (☕)' : 'This day is in Rest mode (☕)'}</p>
                                    <p className="text-[10px] text-amber-700/80 dark:text-amber-400 font-medium mt-0.5">
                                        {isIndo ? 'Streak Anda tetap terjaga.' : 'Streak is protected.'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    onSave(habit.id, dateStr, '', 'empty', false, calculatedTargetDates);
                                    onClose();
                                }}
                                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-xs transition active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                <span>
                                    {isIndo 
                                        ? (calculatedTargetDates.length > 1 ? `Batalkan (${calculatedTargetDates.length} Hari)` : 'Batalkan Istirahat') 
                                        : (calculatedTargetDates.length > 1 ? `Cancel (${calculatedTargetDates.length} Days)` : 'Cancel Rest')}
                                </span>
                            </button>
                        </div>
                    )}

                    {currentLogStatus === 'completed' && (
                        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5 text-xs font-black text-emerald-900 dark:text-emerald-200 text-left">
                                <Check size={18} className="text-emerald-600 shrink-0" strokeWidth={3} />
                                <div>
                                    <p className="leading-tight">{isIndo ? 'Hari ini sudah dicentang Selesai (✓)' : 'Completed today (✓)'}</p>
                                    <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400 font-medium mt-0.5">
                                        {isIndo ? 'Ingin membatalkan centang?' : 'Want to uncheck?'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    onSave(habit.id, dateStr, '', 'empty', false, calculatedTargetDates);
                                    onClose();
                                }}
                                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-xs transition active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                <span>{isIndo ? 'Batalkan Centang' : 'Uncheck'}</span>
                            </button>
                        </div>
                    )}

                    {currentLogStatus === 'skipped' && (
                        <div className="mb-4 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5 text-xs font-black text-slate-800 dark:text-slate-200 text-left">
                                <Pause size={18} className="text-slate-500 shrink-0" />
                                <div>
                                    <p className="leading-tight">{isIndo ? 'Hari ini dilewati (⏸️)' : 'Skipped today (⏸️)'}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                        {isIndo ? 'Ingin membatalkan status lewati?' : 'Want to cancel skipped status?'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    onSave(habit.id, dateStr, '', 'empty', false, calculatedTargetDates);
                                    onClose();
                                }}
                                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-xs transition active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                                <RotateCcw size={13} />
                                <span>{isIndo ? 'Batalkan Lewati' : 'Cancel Skip'}</span>
                            </button>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSave} className="space-y-5">
                        
                        {/* 1. Status Selector */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? '1. Pilih Status Hari' : '1. Select Day Status'}
                            </label>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {/* Option A: Selesai */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('completed')}
                                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs font-black ${
                                        selectedStatus === 'completed'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <Check size={16} className={selectedStatus === 'completed' ? 'text-emerald-500' : 'text-slate-400'} strokeWidth={3} />
                                    <span>{isIndo ? 'Selesai' : 'Completed'}</span>
                                </button>

                                {/* Option B: Istirahat Terencana (Planned Rest) */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('rest')}
                                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs font-black ${
                                        selectedStatus === 'rest'
                                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 shadow-xs ring-2 ring-amber-400/40'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-amber-300'
                                    }`}
                                >
                                    <Coffee size={16} className={selectedStatus === 'rest' ? 'text-amber-500' : 'text-slate-400'} />
                                    <span>{isIndo ? '☕ Istirahat' : '☕ Rest'}</span>
                                </button>

                                {/* Option C: Lewati */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('skipped')}
                                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs font-black ${
                                        selectedStatus === 'skipped'
                                            ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-700 dark:text-slate-200 shadow-xs'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <Pause size={16} className={selectedStatus === 'skipped' ? 'text-slate-600' : 'text-slate-400'} />
                                    <span>{isIndo ? 'Lewati' : 'Skipped'}</span>
                                </button>

                                {/* Option D: Kosongkan / Batal */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('empty')}
                                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs font-black ${
                                        selectedStatus === 'empty'
                                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 shadow-xs ring-2 ring-rose-400/30'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <RotateCcw size={16} className={selectedStatus === 'empty' ? 'text-rose-500' : 'text-slate-400'} />
                                    <span>{isIndo ? 'Kosongkan / Batal' : 'Reset / Clear'}</span>
                                </button>
                            </div>

                            {/* FLEXIBLE REST / RESET PERIOD SECTION */}
                            {(selectedStatus === 'rest' || selectedStatus === 'empty') && (
                                <div className={`mt-3 p-4 rounded-2xl border space-y-3.5 text-left animate-in fade-in duration-200 ${
                                    selectedStatus === 'empty'
                                        ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40'
                                        : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/50'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-1.5 text-xs font-black ${
                                            selectedStatus === 'empty'
                                                ? 'text-rose-900 dark:text-rose-200'
                                                : 'text-amber-900 dark:text-amber-200'
                                        }`}>
                                            {selectedStatus === 'empty' ? <RotateCcw size={14} className="text-rose-600" /> : <Coffee size={14} className="text-amber-600" />}
                                            <span>
                                                {selectedStatus === 'rest'
                                                    ? (isIndo ? 'Durasi Istirahat Terencana' : 'Rest Duration Mode')
                                                    : (isIndo ? 'Cakupan Reset / Pembatalan' : 'Reset / Cancellation Scope')}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                            selectedStatus === 'empty'
                                                ? 'bg-rose-200/70 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200'
                                                : 'bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                                        }`}>
                                            {calculatedTargetDates.length} {isIndo ? 'Hari' : 'Days'}
                                        </span>
                                    </div>

                                    {/* Scope Switcher Tabs */}
                                    <div className={`grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border text-[11px] font-black ${
                                        selectedStatus === 'empty'
                                            ? 'border-rose-200/60 dark:border-rose-900/40'
                                            : 'border-amber-200/60 dark:border-amber-900/40'
                                    }`}>
                                        <button
                                            type="button"
                                            onClick={() => setRestScope('single')}
                                            className={`py-1.5 px-2 rounded-lg transition-all ${
                                                restScope === 'single'
                                                    ? (selectedStatus === 'empty' ? 'bg-rose-500 text-white shadow-xs' : 'bg-amber-500 text-white shadow-xs')
                                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {isIndo ? '1 Hari Saja' : '1 Day Only'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRestScope('week')}
                                            className={`py-1.5 px-2 rounded-lg transition-all ${
                                                restScope === 'week'
                                                    ? (selectedStatus === 'empty' ? 'bg-rose-500 text-white shadow-xs' : 'bg-amber-500 text-white shadow-xs')
                                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {isIndo ? 'Minggu Ini (7 Hari)' : 'This Week'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRestScope('range')}
                                            className={`py-1.5 px-2 rounded-lg transition-all ${
                                                restScope === 'range'
                                                    ? (selectedStatus === 'empty' ? 'bg-rose-500 text-white shadow-xs' : 'bg-amber-500 text-white shadow-xs')
                                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {isIndo ? 'Pilih Rentang' : 'Custom Range'}
                                        </button>
                                    </div>

                                    {/* Quick Presets */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[10px] font-black ${
                                            selectedStatus === 'empty' ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
                                        }`}>
                                            {isIndo ? 'Preset Cepat:' : 'Quick Presets:'}
                                        </span>
                                        {[
                                            { days: 3, label: isIndo ? '+3 Hari' : '+3 Days' },
                                            { days: 7, label: isIndo ? '+7 Hari' : '+7 Days' },
                                            { days: 14, label: isIndo ? '+14 Hari' : '+14 Days' },
                                            { days: 21, label: isIndo ? '+3 Minggu' : '+3 Weeks' },
                                        ].map(preset => (
                                            <button
                                                key={preset.days}
                                                type="button"
                                                onClick={() => handleApplyPreset(preset.days)}
                                                className={`px-2 py-0.5 rounded-md text-[10px] font-black bg-white dark:bg-slate-900 border transition ${
                                                    selectedStatus === 'empty'
                                                        ? 'hover:bg-rose-100 text-rose-800 dark:text-rose-300 border-rose-300/80 dark:border-rose-800/60'
                                                        : 'hover:bg-amber-100 text-amber-800 dark:text-amber-300 border-amber-300/80 dark:border-amber-800/60'
                                                }`}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Date Range Inputs when in range mode */}
                                    {restScope === 'range' && (
                                        <div className={`p-3 bg-white dark:bg-slate-900 rounded-xl border grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ${
                                            selectedStatus === 'empty'
                                                ? 'border-rose-200/60 dark:border-rose-800/40'
                                                : 'border-amber-200/60 dark:border-amber-800/40'
                                        }`}>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                                                    {isIndo ? 'Mulai Tanggal:' : 'Start Date:'}
                                                </label>
                                                <input
                                                    type="date"
                                                    value={restStartDate}
                                                    onChange={(e) => setRestStartDate(e.target.value)}
                                                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                                                    {isIndo ? 'Sampai Tanggal:' : 'End Date:'}
                                                </label>
                                                <input
                                                    type="date"
                                                    value={restEndDate}
                                                    onChange={(e) => setRestEndDate(e.target.value)}
                                                    min={restStartDate}
                                                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    {selectedStatus === 'empty' ? (
                                        <p className="text-[10px] text-rose-800 dark:text-rose-300/90 font-medium leading-relaxed flex items-center gap-1.5 pt-1 border-t border-rose-200/60 dark:border-rose-900/40">
                                            <RotateCcw size={12} className="text-rose-600 shrink-0" />
                                            <span>
                                                {isIndo
                                                    ? `Seluruh status & catatan untuk ${calculatedTargetDates.length} hari yang dipilih akan dikosongkan/dibatalkan.`
                                                    : `All statuses & notes for the ${calculatedTargetDates.length} selected days will be cleared/cancelled.`}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="text-[10px] text-amber-800 dark:text-amber-300/90 font-medium leading-relaxed flex items-center gap-1.5 pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                                            <Flame size={12} className="text-amber-600 shrink-0" />
                                            <span>
                                                {isIndo 
                                                    ? `Seluruh ${calculatedTargetDates.length} hari yang dipilih akan diberi status Istirahat (☕) tanpa merusak atau mereset streak Anda!` 
                                                    : `All ${calculatedTargetDates.length} selected days will be marked as Rest (☕) without resetting your streak!`}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. Catatan Refleksi */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                                {isIndo ? '2. Catatan Refleksi Harian (Opsional)' : '2. Daily Reflection Note (Optional)'}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={isIndo 
                                    ? 'Contoh: Istirahat pemulihan otot / selang-seling sprint minggu depan...' 
                                    : 'Example: Muscle recovery rest / alternating sprint next week...'}
                                rows={2}
                                maxLength={300}
                                className="w-full p-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-xs text-slate-800 dark:text-slate-100 focus:border-indigo-500 outline-none resize-none"
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-[10px] font-bold text-slate-400">
                                    {notes.length}/300
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                            {(initialNotes || currentLogStatus !== 'empty') && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition flex items-center justify-center border border-rose-200 dark:border-rose-500/20 cursor-pointer"
                                    title={isIndo ? 'Kosongkan / Batalkan Hari Ini' : 'Reset / Clear This Day'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                type="submit"
                                className={`flex-1 py-3.5 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer ${
                                    selectedStatus === 'empty'
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-none'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 dark:shadow-none'
                                }`}
                            >
                                {selectedStatus === 'empty' ? (
                                    <>
                                        <RotateCcw size={16} />
                                        <span>
                                            {isIndo 
                                                ? `Kosongkan / Batalkan (${calculatedTargetDates.length} Hari)` 
                                                : `Reset / Cancel (${calculatedTargetDates.length} Days)`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} strokeWidth={3} />
                                        <span>
                                            {isIndo 
                                                ? `Simpan (${calculatedTargetDates.length} Hari)` 
                                                : `Save (${calculatedTargetDates.length} Days)`}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
