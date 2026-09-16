'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Clock, Settings2 } from 'lucide-react';

export interface GlobalPlannerDefaults {
    type: number;
    durationMinutes: number;
}

export interface BatchTaskRow {
    title: string;
    startTime: string;
    endTime: string;
    type?: number;
    notes: string;
    // Overrides
    typeOverride?: number;
}

// SAME as PlannerTaskModal — 1=Urgent🔥, 2=Work💼, 3=Normal🌱, 4=Task📝
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
    onSubmit: (rows: BatchTaskRow[], defaults: GlobalPlannerDefaults) => Promise<void> | void;
    onSwitchToSingle?: () => void;
}

function calcEndTime(start: string, dur: number): string {
    if (!start) return '';
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + dur;
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export default function PlannerBatchModal({
    isOpen,
    isIndo,
    selectedDate,
    onClose,
    onSubmit
}: PlannerBatchModalProps) {
    const [rows, setRows] = useState<BatchTaskRow[]>([
        { title: '', startTime: '09:00', endTime: '09:30', notes: '' },
        { title: '', startTime: '09:30', endTime: '10:00', notes: '' },
        { title: '', startTime: '10:00', endTime: '10:30', notes: '' },
    ]);
    const [globalDefaults, setGlobalDefaults] = useState<GlobalPlannerDefaults>({
        type: 2,
        durationMinutes: 30
    });
    const [openSettingsRow, setOpenSettingsRow] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const addRow = () => {
        const lastRow = rows[rows.length - 1];
        const nextStart = lastRow?.endTime || '09:00';
        const nextEnd = calcEndTime(nextStart, globalDefaults.durationMinutes);
        setRows([...rows, { title: '', startTime: nextStart, endTime: nextEnd, notes: '' }]);
    };

    const removeRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof BatchTaskRow, value: any) => {
        setRows(prev => {
            const next = [...prev];
            const row = { ...next[index] };
            if (field === 'startTime') {
                row.startTime = value;
                row.endTime = calcEndTime(value, globalDefaults.durationMinutes);
            } else {
                (row as any)[field] = value;
            }
            next[index] = row;
            return next;
        });
    };

    const handleSubmit = async () => {
        const valid = rows.filter(r => r.title.trim().length > 0);
        if (valid.length === 0 || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit(valid, globalDefaults);
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

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
                
                <div className="bg-white dark:bg-[#0f1117] rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-200/80 dark:border-white/[0.06] max-h-[95vh] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/25">
                                📅
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                    {isIndo ? 'Tambah Tugas Sekaligus' : 'Batch Add Tasks'}
                                </h3>
                                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                    {dateLabel}
                                </p>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={onClose} 
                            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                        >
                            <X size={15} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-slate-50/60 dark:bg-[#080b12]/60">
                        
                        {/* Global Defaults */}
                        <div className="bg-white dark:bg-[#0f1117] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.07] shadow-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <Settings2 size={13} className="text-indigo-500" />
                                <span className="font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Default Global' : 'Global Defaults'}
                                </span>
                            </div>

                            {/* Default Type — same grid as single modal */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    {isIndo ? 'Kategori Tugas Default' : 'Default Task Category'}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {TASK_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setGlobalDefaults({ ...globalDefaults, type: type.id })}
                                            className={`py-2.5 px-1 rounded-2xl border flex flex-col items-center gap-1 transition-all ${globalDefaults.type === type.id
                                                ? type.activeClass + ' ring-2 ring-indigo-500/40 shadow-md scale-105'
                                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <span className="text-lg leading-none">{type.icon}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Default Duration */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                                    <Clock size={9} /> {isIndo ? 'Durasi Default' : 'Default Duration'}
                                </label>
                                <div className="flex gap-1.5">
                                    {[15, 30, 45, 60, 90].map(dur => (
                                        <button
                                            key={dur}
                                            type="button"
                                            onClick={() => setGlobalDefaults({ ...globalDefaults, durationMinutes: dur })}
                                            className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition ${globalDefaults.durationMinutes === dur 
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                                                : 'bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/[0.07] hover:bg-slate-100 dark:hover:bg-white/[0.06]'}`}
                                        >
                                            {dur}m
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Task Rows */}
                        <div className="space-y-3">
                            {rows.map((row, index) => {
                                const effectiveType = row.typeOverride ?? globalDefaults.type;
                                const typeInfo = TASK_TYPES.find(t => t.id === effectiveType) ?? TASK_TYPES[3];

                                return (
                                    <div key={index} className="bg-white dark:bg-[#0f1117] rounded-2xl border-2 border-slate-200 dark:border-white/[0.07] overflow-hidden">
                                        {/* Main row */}
                                        <div className="p-3 flex gap-2 items-center">
                                            {/* Type badge */}
                                            <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm border ${typeInfo.activeClass}`}>
                                                {typeInfo.icon}
                                            </div>

                                            {/* Title */}
                                            <input
                                                type="text"
                                                value={row.title}
                                                onChange={(e) => updateRow(index, 'title', e.target.value)}
                                                placeholder={isIndo ? 'Judul tugas...' : 'Task title...'}
                                                className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition"
                                            />

                                            {/* Settings toggle */}
                                            <button
                                                type="button"
                                                onClick={() => setOpenSettingsRow(openSettingsRow === index ? null : index)}
                                                className={`shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center transition ${openSettingsRow === index 
                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-white/[0.03] dark:border-white/[0.07] hover:bg-slate-100'}`}
                                            >
                                                <Settings2 size={13} />
                                            </button>

                                            {rows.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(index)}
                                                    className="shrink-0 w-9 h-9 rounded-xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Time bar */}
                                        <div className="px-3 pb-3 flex gap-2">
                                            <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03]">
                                                <span className="text-[9px] font-bold text-slate-400">{isIndo ? 'Mulai' : 'Start'}</span>
                                                <input
                                                    type="time"
                                                    value={row.startTime}
                                                    onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                                                    className="w-full bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03]">
                                                <span className="text-[9px] font-bold text-slate-400">{isIndo ? 'Selesai' : 'End'}</span>
                                                <input
                                                    type="time"
                                                    value={row.endTime}
                                                    onChange={(e) => updateRow(index, 'endTime', e.target.value)}
                                                    className="w-full bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Expanded settings */}
                                        {openSettingsRow === index && (
                                            <div className="mx-3 mb-3 p-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isIndo ? 'Override Tugas Ini' : 'Override This Task'}</span>

                                                {/* Type override — same 4 buttons */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-bold text-slate-500">{isIndo ? 'Kategori Spesifik' : 'Specific Category'}</label>
                                                    <div className="grid grid-cols-4 gap-1.5">
                                                        {[{ id: -1, label: isIndo ? 'Global' : 'Global', icon: '↩' }, ...TASK_TYPES].map(type => {
                                                            const isSelected = type.id === -1 
                                                                ? row.typeOverride === undefined 
                                                                : row.typeOverride === type.id;
                                                            return (
                                                                <button
                                                                    key={type.id}
                                                                    type="button"
                                                                    onClick={() => updateRow(index, 'typeOverride', type.id === -1 ? undefined : type.id)}
                                                                    className={`py-2 rounded-xl border flex flex-col items-center gap-0.5 transition-all text-center ${isSelected
                                                                        ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-400/30'
                                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}
                                                                >
                                                                    <span className="text-sm">{type.icon}</span>
                                                                    <span className="text-[8px] font-black uppercase tracking-wider">{type.label}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-500">{isIndo ? 'Catatan (Opsional)' : 'Notes (Optional)'}</label>
                                                    <input 
                                                        type="text"
                                                        placeholder={isIndo ? 'Catatan singkat...' : 'Quick note...'}
                                                        value={row.notes || ''}
                                                        onChange={(e) => updateRow(index, 'notes', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-400"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] text-slate-400 font-black text-xs hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={14} />
                            <span>{isIndo ? 'Tambah Tugas Lainnya' : 'Add Another Task'}</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#0f1117] flex items-center justify-between shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center gap-2 disabled:opacity-60"
                        >
                            <Check size={14} strokeWidth={3} />
                            <span>{isSubmitting ? (isIndo ? 'Menyimpan...' : 'Saving...') : (isIndo ? 'Simpan Semua Tugas' : 'Save All Tasks')}</span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
