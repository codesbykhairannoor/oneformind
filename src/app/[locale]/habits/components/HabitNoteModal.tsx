'use client';

import { useState, useEffect } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, MessageSquare, Trash2, Check, Calendar, Coffee, Pause, RotateCcw } from 'lucide-react';
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
        applyWholeWeekRest?: boolean
    ) => void;
    locale: string;
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
    const [applyWholeWeekRest, setApplyWholeWeekRest] = useState(false);

    useEffect(() => {
        setNotes(initialNotes);
        const logStatus = habit?.logs?.[dateStr]?.status || 'empty';
        setSelectedStatus(logStatus);
        setApplyWholeWeekRest(false);
    }, [initialNotes, isOpen, habit, dateStr]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(habit.id, dateStr, notes.trim(), selectedStatus, applyWholeWeekRest);
        onClose();
    };

    const handleDelete = () => {
        onSave(habit.id, dateStr, '', 'empty', false);
        onClose();
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
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
                        
                        {/* 1. Status Selector (Complete, Planned Rest, Skip, Empty) */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                {isIndo ? 'Status Hari Ini (Termasuk Istirahat / Deload)' : 'Day Status (Including Planned Rest / Deload)'}
                            </label>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {/* Option A: Selesai */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('completed')}
                                    className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs font-black ${
                                        selectedStatus === 'completed'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
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
                                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 shadow-xs ring-2 ring-amber-400/30'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-amber-300'
                                    }`}
                                >
                                    <Coffee size={16} className={selectedStatus === 'rest' ? 'text-amber-500' : 'text-slate-400'} />
                                    <span>{isIndo ? 'Istirahat' : 'Rest'}</span>
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

                            {/* Rest Mode Information Banner */}
                            {selectedStatus === 'rest' && (
                                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2 text-left animate-in fade-in duration-200">
                                    <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-800 dark:text-amber-300">
                                        <Coffee size={13} className="text-amber-600" />
                                        <span>{isIndo ? 'Mode Istirahat Terencana (Planned Rest):' : 'Planned Rest & Recovery Mode:'}</span>
                                    </div>
                                    <p className="text-[10px] text-amber-700 dark:text-amber-400/90 font-medium leading-relaxed">
                                        {isIndo 
                                            ? 'Hari istirahat ini TIDAK AKAN merusak atau mereset streak Anda. Rekor streak akan dibekukan dan dilanjutkan kembali saat Anda aktif berikutnya.' 
                                            : 'This planned rest day will NOT break or reset your streak. Your record is protected and resumes automatically on your next active day.'}
                                    </p>

                                    {/* Whole Week Toggle */}
                                    <label className="flex items-center gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-900/40 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={applyWholeWeekRest}
                                            onChange={(e) => setApplyWholeWeekRest(e.target.checked)}
                                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                                        />
                                        <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                                            {isIndo 
                                                ? 'Terapkan Istirahat untuk Seluruh Minggu Ini (Deload Week 7 Hari)' 
                                                : 'Apply Rest for the Entire Week (7-Day Deload Week)'}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* 2. Catatan Refleksi */}
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                                {isIndo ? 'Catatan Refleksi Harian (Opsional)' : 'Daily Reflection Note (Optional)'}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={isIndo 
                                    ? 'Contoh: Hari ini istirahat pemulihan otot / selang-seling sprint minggu depan...' 
                                    : 'Example: Active muscle recovery day / alternating focus for next sprint...'}
                                rows={3}
                                maxLength={300}
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-xs text-slate-800 dark:text-slate-100 focus:border-indigo-500 outline-none resize-none"
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
                                <span>{isIndo ? 'Simpan Perubahan' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
