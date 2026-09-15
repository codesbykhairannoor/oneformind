'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Clock, Flame, Briefcase, Sparkles, AlertCircle } from 'lucide-react';

export interface BatchTaskRow {
    title: string;
    startTime: string;
    endTime: string;
    type: number;
    notes: string;
}

interface PlannerBatchModalProps {
    isOpen: boolean;
    isIndo: boolean;
    selectedDate: string;
    onClose: () => void;
    onSubmit: (rows: BatchTaskRow[]) => Promise<void> | void;
}

export default function PlannerBatchModal({
    isOpen,
    isIndo,
    selectedDate,
    onClose,
    onSubmit
}: PlannerBatchModalProps) {
    const [rows, setRows] = useState<BatchTaskRow[]>([
        { title: isIndo ? 'Fokus Deep Work Sprint 1' : 'Deep Work Sprint 1', startTime: '09:00', endTime: '10:30', type: 2, notes: '' },
        { title: isIndo ? 'Eksekusi Task Utama' : 'Core Task Execution', startTime: '10:30', endTime: '12:00', type: 1, notes: '' },
        { title: isIndo ? 'Review Admin & Email' : 'Admin & Email Processing', startTime: '13:00', endTime: '14:00', type: 3, notes: '' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const taskTypeOptions = [
        { id: 1, label: isIndo ? 'Prioritas Tinggi' : 'High Priority', color: 'rose', icon: '🔥' },
        { id: 2, label: isIndo ? 'Deep Work' : 'Deep Work', color: 'indigo', icon: '💻' },
        { id: 3, label: isIndo ? 'Admin / Komunikasi' : 'Admin / Communication', color: 'amber', icon: '📁' },
        { id: 4, label: isIndo ? 'Belajar / Pertumbuhan' : 'Learning / Growth', color: 'emerald', icon: '📚' }
    ];

    const loadTemplate = (templateType: 'deepwork' | 'executive') => {
        if (templateType === 'deepwork') {
            setRows([
                { title: isIndo ? 'Riset & Perencanaan Proyek' : 'Research & Project Planning', startTime: '09:00', endTime: '10:30', type: 2, notes: '' },
                { title: isIndo ? 'Eksekusi Kode / Penulisan Utama' : 'Core Coding / Writing', startTime: '10:30', endTime: '12:00', type: 1, notes: '' },
                { title: isIndo ? 'Evaluasi Hasil & Catatan' : 'Results Review & Notes', startTime: '13:00', endTime: '14:00', type: 4, notes: '' }
            ]);
        } else if (templateType === 'executive') {
            setRows([
                { title: isIndo ? 'Standup & Koordinasi Tim' : 'Team Standup & Sync', startTime: '09:00', endTime: '09:30', type: 3, notes: '' },
                { title: isIndo ? 'Pengambilan Keputusan Strategis' : 'Strategic Decision Making', startTime: '09:30', endTime: '11:30', type: 1, notes: '' },
                { title: isIndo ? 'Review KPI & Finansial' : 'KPI & Financial Review', startTime: '13:30', endTime: '15:00', type: 2, notes: '' }
            ]);
        }
    };

    const addRow = () => {
        const lastRow = rows[rows.length - 1];
        let nextStart = '14:00';
        let nextEnd = '15:00';
        if (lastRow && lastRow.endTime) {
            nextStart = lastRow.endTime;
            const [h, m] = nextStart.split(':').map(Number);
            const endH = String((h + 1) % 24).padStart(2, '0');
            const endM = String(m).padStart(2, '0');
            nextEnd = `${endH}:${endM}`;
        }
        setRows([
            ...rows,
            { title: '', startTime: nextStart, endTime: nextEnd, type: 2, notes: '' }
        ]);
    };

    const removeRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof BatchTaskRow, value: any) => {
        setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    };

    const handleSubmit = async () => {
        const validRows = rows.filter(r => r.title.trim().length > 0);
        if (validRows.length === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(validRows);
            onClose();
        } catch (err) {
            console.error('Batch task submit failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[88vh] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl text-white shadow-md">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">
                                    Batch Task Entry
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? `Menambah beberapa tugas sekaligus untuk tanggal ${selectedDate}` : `Add multiple tasks at once for ${selectedDate}`}
                                </p>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={onClose} 
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
                        
                        {/* Quick Templates */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            <span className="text-[10px] font-black text-slate-400 shrink-0">
                                {isIndo ? '💡 Template Kilat:' : '💡 Quick Templates:'}
                            </span>
                            <button
                                type="button"
                                onClick={() => loadTemplate('deepwork')}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 font-black text-[10px] hover:bg-indigo-100 transition shrink-0 border border-indigo-200/50"
                            >
                                🚀 {isIndo ? 'Sprint Deep Work' : 'Deep Work Sprint'}
                            </button>
                            <button
                                type="button"
                                onClick={() => loadTemplate('executive')}
                                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 font-black text-[10px] hover:bg-amber-100 transition shrink-0 border border-amber-200/50"
                            >
                                💼 {isIndo ? 'Rutinitas Eksekutif' : 'Executive Routine'}
                            </button>
                        </div>

                        {/* Task Rows */}
                        {rows.map((row, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                                        <span>Tugas #{index + 1}</span>
                                    </span>
                                    {rows.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="text-slate-400 hover:text-rose-500 p-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Title Input */}
                                <input
                                    type="text"
                                    value={row.title}
                                    onChange={(e) => updateRow(index, 'title', e.target.value)}
                                    placeholder={isIndo ? 'Judul tugas harian...' : 'Task title...'}
                                    className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-600 transition"
                                />

                                {/* Controls Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                    {/* Start Time */}
                                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                        <span className="text-[10px] font-bold text-slate-400">Mulai:</span>
                                        <input
                                            type="time"
                                            value={row.startTime}
                                            onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                                            className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    {/* End Time */}
                                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                        <span className="text-[10px] font-bold text-slate-400">Selesai:</span>
                                        <input
                                            type="time"
                                            value={row.endTime}
                                            onChange={(e) => updateRow(index, 'endTime', e.target.value)}
                                            className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    {/* Category Select */}
                                    <select
                                        value={row.type}
                                        onChange={(e) => updateRow(index, 'type', Number(e.target.value))}
                                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-[10px] outline-none cursor-pointer"
                                    >
                                        {taskTypeOptions.map(opt => (
                                            <option key={opt.id} value={opt.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                                {opt.icon} {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:border-indigo-500 hover:text-indigo-500 transition flex items-center justify-center gap-1.5"
                        >
                            <Plus size={15} />
                            <span>{isIndo ? 'Tambah Baris Tugas Lain' : 'Add Another Task Row'}</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="px-6 md:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition active:scale-95 flex items-center gap-2"
                        >
                            <Check size={16} strokeWidth={3} />
                            <span>{isSubmitting ? (isIndo ? 'Menyimpan...' : 'Saving...') : (isIndo ? 'Simpan Semua Tugas' : 'Save All Tasks')}</span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
