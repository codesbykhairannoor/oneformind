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

                                {/* Option D: Kosongkan */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('empty')}
                                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs font-black ${
                                        selectedStatus === 'empty'
                                            ? 'bg-slate-100 dark:bg-slate-800 border-indigo-400 text-slate-700 dark:text-slate-200 shadow-xs'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <RotateCcw size={16} className={selectedStatus === 'empty' ? 'text-indigo-500' : 'text-slate-400'} />
                                    <span>{isIndo ? 'Kosongkan' : 'Reset'}</span>
                                </button>
                            </div>

                            {/* FLEXIBLE REST PERIOD SECTION */}
                            {(selectedStatus === 'rest' || selectedStatus === 'empty') && (
                                <div className="mt-3 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-3.5 text-left animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-200">
                                            <Coffee size={14} className="text-amber-600" />
                                            <span>
                                                {selectedStatus === 'rest'
                                                    ? (isIndo ? 'Durasi Istirahat Terencana' : 'Rest Duration Mode')
                                                    : (isIndo ? 'Terapkan Reset ke Rentang Tanggal' : 'Apply Reset to Range')}
                                            </span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                                            {calculatedTargetDates.length} {isIndo ? 'Hari' : 'Days'}
                                        </span>
                                    </div>

                                    {/* Scope Switcher Tabs */}
                                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-black">
                                        <button
                                            type="button"
                                            onClick={() => setRestScope('single')}
                                            className={`py-1.5 px-2 rounded-lg transition-all ${
                                                restScope === 'single'
                                                    ? 'bg-amber-500 text-white shadow-xs'
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
                                                    ? 'bg-amber-500 text-white shadow-xs'
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
                                                    ? 'bg-amber-500 text-white shadow-xs'
                                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            {isIndo ? 'Pilih Rentang' : 'Custom Range'}
                                        </button>
                                    </div>

                                    {/* Quick Presets */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] font-black text-amber-700 dark:text-amber-400">
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
                                                className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white dark:bg-slate-900 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/60 transition"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Date Range Inputs when in range mode */}
                                    {restScope === 'range' && (
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-800/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                                                    {isIndo ? 'Mulai Istirahat:' : 'Start Date:'}
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

                                    {/* Streak Protection Explanation */}
                                    <p className="text-[10px] text-amber-800 dark:text-amber-300/90 font-medium leading-relaxed flex items-center gap-1.5 pt-1 border-t border-amber-200/60 dark:border-amber-900/40">
                                        <Flame size={12} className="text-amber-600 shrink-0" />
                                        <span>
                                            {isIndo 
                                                ? `Seluruh ${calculatedTargetDates.length} hari yang dipilih akan diberi status Istirahat (☕) tanpa merusak atau mereset streak Anda!` 
                                                : `All ${calculatedTargetDates.length} selected days will be marked as Rest (☕) without resetting your streak!`}
                                        </span>
                                    </p>
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
                            {initialNotes && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition flex items-center justify-center border border-rose-100 dark:border-rose-500/20"
                                    title={isIndo ? 'Hapus Catatan' : 'Delete Note'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition flex items-center justify-center gap-2 active:scale-98"
                            >
                                <Check size={16} strokeWidth={3} />
                                <span>
                                    {isIndo 
                                        ? `Simpan (${calculatedTargetDates.length} Hari)` 
                                        : `Save (${calculatedTargetDates.length} Days)`}
                                </span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
