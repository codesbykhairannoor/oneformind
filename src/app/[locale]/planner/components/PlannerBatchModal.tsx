'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Clock, Sparkles, FileText } from 'lucide-react';

export interface BatchTaskRow {
    title: string;
    startTime: string;
    endTime: string;
    type: number; // 1=Urgent🔥, 2=Work💼, 3=Normal🌱, 4=Task📝
    notes: string;
}

// 1=Urgent🔥, 2=Work💼, 3=Normal🌱, 4=Task📝
const TASK_TYPES = [
    { id: 1, label: 'Urgent', icon: '🔥', activeClass: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' },
    { id: 2, label: 'Work', icon: '💼', activeClass: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30' },
    { id: 3, label: 'Normal', icon: '🌱', activeClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' },
    { id: 4, label: 'Task', icon: '📝', activeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
];

interface PlannerBatchModalProps {
    isOpen: boolean;
    isIndo: boolean;
    selectedDate: string;
    onClose: () => void;
    onSubmit: (rows: BatchTaskRow[]) => Promise<void> | void;
    onSwitchToSingle?: () => void;
}

function calcEndTime(start: string, durationMinutes: number): string {
    if (!start) return '';
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + durationMinutes;
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default function PlannerBatchModal({
    isOpen,
    isIndo,
    selectedDate,
    onClose,
    onSubmit,
    onSwitchToSingle
}: PlannerBatchModalProps) {
    const [rows, setRows] = useState<BatchTaskRow[]>([
        { title: '', startTime: '09:00', endTime: '09:30', type: 2, notes: '' },
        { title: '', startTime: '09:30', endTime: '10:00', type: 2, notes: '' },
        { title: '', startTime: '10:00', endTime: '10:30', type: 2, notes: '' },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const addRow = () => {
        const lastRow = rows[rows.length - 1];
        const nextStart = lastRow?.endTime || '09:00';
        const nextEnd = calcEndTime(nextStart, 30);
        setRows([
            ...rows, 
            { title: '', startTime: nextStart, endTime: nextEnd, type: lastRow?.type || 2, notes: '' }
        ]);
    };

    const removeRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof BatchTaskRow, value: any) => {
        setRows(prev => prev.map((r, i) => {
            if (i !== index) return r;
            const updated = { ...r, [field]: value };
            if (field === 'startTime') {
                updated.endTime = calcEndTime(value, 30);
            }
            return updated;
        }));
    };

    const setDuration = (index: number, durationMinutes: number) => {
        const row = rows[index];
        const newEnd = calcEndTime(row.startTime, durationMinutes);
        updateRow(index, 'endTime', newEnd);
    };

    const handleSubmit = async () => {
        const valid = rows.filter(r => r.title.trim().length > 0);
        if (valid.length === 0 || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit(valid);
            onClose();
        } catch (err) {
            console.error('Batch submit failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const dateLabel = (() => {
        try {
            return new Date(selectedDate + 'T00:00:00').toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        } catch {
            return selectedDate;
        }
    })();

    const validRowsCount = rows.filter(r => r.title.trim().length > 0).length;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
                
                <div className="bg-white dark:bg-[#0f1117] rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-200/80 dark:border-white/[0.06] max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    {/* Header */}
                    <div className="px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/25 text-white font-black">
                                📅
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                                    <span>{isIndo ? 'Tambah Tugas Sekaligus' : 'Batch Add Tasks'}</span>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                                        {rows.length} {isIndo ? 'Tugas' : 'Tasks'}
                                    </span>
                                </h3>
                                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                    {dateLabel}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {onSwitchToSingle && (
                                <button
                                    type="button"
                                    onClick={onSwitchToSingle}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
                                >
                                    {isIndo ? 'Mode Satuan' : 'Single Mode'}
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <X size={15} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Body: List of Task Cards */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-3.5 bg-slate-50/60 dark:bg-[#080b12]/60">
                        {rows.map((row, index) => {
                            const typeInfo = TASK_TYPES.find(t => t.id === row.type) ?? TASK_TYPES[1];

                            return (
                                <div 
                                    key={index} 
                                    className="bg-white dark:bg-[#0f1117] rounded-2xl border-2 border-slate-200/90 dark:border-white/[0.07] p-3.5 sm:p-4 space-y-3 shadow-xs transition hover:border-indigo-300 dark:hover:border-indigo-500/30"
                                >
                                    {/* Line 1: Badge, Title, Delete */}
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 w-5 shrink-0 text-center">
                                            #{index + 1}
                                        </span>

                                        <input
                                            type="text"
                                            value={row.title}
                                            onChange={(e) => updateRow(index, 'title', e.target.value)}
                                            placeholder={isIndo ? 'Nama / judul tugas...' : 'Task title...'}
                                            className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] font-bold text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition"
                                        />

                                        {rows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="shrink-0 w-9 h-9 rounded-xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Line 2: Category Selector */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                                            {isIndo ? 'Kategori:' : 'Type:'}
                                        </span>
                                        {TASK_TYPES.map(t => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => updateRow(index, 'type', t.id)}
                                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                                                    row.type === t.id 
                                                        ? t.activeClass + ' ring-1 ring-offset-1 font-black shadow-xs' 
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                                                }`}
                                            >
                                                <span>{t.icon}</span>
                                                <span>{t.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Line 3: Time Range + Quick Durations */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                                <Clock size={11} className="text-slate-400" />
                                                <input
                                                    type="time"
                                                    value={row.startTime}
                                                    onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                                                    className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">→</span>
                                            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                                <input
                                                    type="time"
                                                    value={row.endTime}
                                                    onChange={(e) => updateRow(index, 'endTime', e.target.value)}
                                                    className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Quick Duration Buttons */}
                                        <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-bold text-slate-400 mr-0.5">Durasi:</span>
                                            {[15, 30, 45, 60].map(dur => (
                                                <button
                                                    key={dur}
                                                    type="button"
                                                    onClick={() => setDuration(index, dur)}
                                                    className="px-2 py-1 rounded-lg text-[9px] font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                                                >
                                                    +{dur}m
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Another Task Row */}
                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition font-black text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                            <Plus size={15} />
                            <span>{isIndo ? '+ Tambah Baris Tugas' : '+ Add Task Row'}</span>
                        </button>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#0f1117] flex items-center justify-between shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={validRowsCount === 0 || isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <Check size={15} strokeWidth={3} />
                            <span>
                                {isIndo 
                                    ? `Simpan Semua (${validRowsCount} Tugas)` 
                                    : `Save All (${validRowsCount} Tasks)`}
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
