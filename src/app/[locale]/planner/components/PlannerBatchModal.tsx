'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Clock, Settings2, Settings, Briefcase, Zap } from 'lucide-react';

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

interface PlannerBatchModalProps {
    isOpen: boolean;
    isIndo: boolean;
    selectedDate: string;
    onClose: () => void;
    onSubmit: (rows: BatchTaskRow[], defaults: GlobalPlannerDefaults) => Promise<void> | void;
    onSwitchToSingle?: () => void;
}

export default function PlannerBatchModal({
    isOpen,
    isIndo,
    selectedDate,
    onClose,
    onSubmit
}: PlannerBatchModalProps) {
    const [rows, setRows] = useState<BatchTaskRow[]>([
        { title: isIndo ? 'Fokus Deep Work Sprint 1' : 'Deep Work Sprint 1', startTime: '09:00', endTime: '09:30', notes: '' },
        { title: isIndo ? 'Eksekusi Task Utama' : 'Core Task Execution', startTime: '09:30', endTime: '10:00', notes: '' },
        { title: isIndo ? 'Review Admin & Email' : 'Admin & Email Processing', startTime: '10:00', endTime: '10:30', notes: '' }
    ]);
    const [globalDefaults, setGlobalDefaults] = useState<GlobalPlannerDefaults>({
        type: 2, // Deep Work by default
        durationMinutes: 30
    });
    const [openSettingsRow, setOpenSettingsRow] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const taskTypeOptions = [
        { id: 1, label: isIndo ? 'Prioritas Tinggi' : 'High Priority', color: 'rose', icon: '🔥' },
        { id: 2, label: isIndo ? 'Deep Work' : 'Deep Work', color: 'indigo', icon: '💻' },
        { id: 3, label: isIndo ? 'Admin / Komunikasi' : 'Admin / Communication', color: 'amber', icon: '📁' },
        { id: 4, label: isIndo ? 'Belajar / Pertumbuhan' : 'Learning / Growth', color: 'emerald', icon: '📚' },
        { id: 5, label: 'Normal', color: 'slate', icon: '📝' }
    ];

    const calculateEndTime = (startTime: string, durationMinutes: number) => {
        if (!startTime) return '';
        const [h, m] = startTime.split(':').map(Number);
        const totalMinutes = h * 60 + m + durationMinutes;
        const newH = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0');
        const newM = String(totalMinutes % 60).padStart(2, '0');
        return `${newH}:${newM}`;
    };

    const loadTemplate = (templateType: 'deepwork' | 'executive') => {
        if (templateType === 'deepwork') {
            setGlobalDefaults({ type: 2, durationMinutes: 60 });
            setRows([
                { title: isIndo ? 'Riset & Perencanaan Proyek' : 'Research & Project Planning', startTime: '09:00', endTime: '10:00', notes: '' },
                { title: isIndo ? 'Eksekusi Kode / Penulisan Utama' : 'Core Coding / Writing', startTime: '10:00', endTime: '11:00', notes: '' },
                { title: isIndo ? 'Evaluasi Hasil & Catatan' : 'Results Review & Notes', startTime: '11:00', endTime: '12:00', notes: '' }
            ]);
        } else if (templateType === 'executive') {
            setGlobalDefaults({ type: 3, durationMinutes: 30 });
            setRows([
                { title: isIndo ? 'Standup & Koordinasi Tim' : 'Team Standup & Sync', startTime: '09:00', endTime: '09:30', notes: '' },
                { title: isIndo ? 'Pengambilan Keputusan Strategis' : 'Strategic Decision Making', startTime: '09:30', endTime: '11:30', typeOverride: 1, notes: '' },
                { title: isIndo ? 'Review KPI & Finansial' : 'KPI & Financial Review', startTime: '11:30', endTime: '12:30', typeOverride: 2, notes: '' }
            ]);
        }
    };

    const addRow = () => {
        const lastRow = rows[rows.length - 1];
        let nextStart = '09:00';
        if (lastRow && lastRow.endTime) {
            nextStart = lastRow.endTime;
        }
        const nextEnd = calculateEndTime(nextStart, globalDefaults.durationMinutes);
        
        setRows([
            ...rows,
            { title: '', startTime: nextStart, endTime: nextEnd, notes: '' }
        ]);
    };

    const removeRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof BatchTaskRow, value: any) => {
        setRows(prev => {
            const newRows = [...prev];
            const row = { ...newRows[index] };
            
            // Auto update end time if start time changes and we assume default duration
            if (field === 'startTime') {
                row.startTime = value;
                row.endTime = calculateEndTime(value, globalDefaults.durationMinutes);
            } else {
                (row as any)[field] = value;
            }
            
            newRows[index] = row;
            return newRows;
        });
    };

    const handleSubmit = async () => {
        const validRows = rows.filter(r => r.title.trim().length > 0);
        if (validRows.length === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(validRows, globalDefaults);
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
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[95vh] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl text-white shadow-md">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                                    Smart Batch Task Entry
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? `Atur default lalu tambahkan banyak tugas sekaligus untuk ${selectedDate}` : `Set defaults and add multiple tasks for ${selectedDate}`}
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
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/40">
                        
                        {/* GLOBAL DEFAULTS PANEL */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm shadow-indigo-100/50 dark:shadow-none space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Settings2 size={16} className="text-indigo-500" />
                                <h4 className="font-black text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                                    {isIndo ? 'Pengaturan Bawaan Tugas' : 'Global Task Defaults'}
                                </h4>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Default Type */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Briefcase size={10} /> Tipe Tugas Utama</label>
                                    <select 
                                        value={globalDefaults.type}
                                        onChange={(e) => setGlobalDefaults({...globalDefaults, type: Number(e.target.value)})}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                                    >
                                        {taskTypeOptions.map(opt => (
                                            <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Default Duration */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> Durasi Standar</label>
                                    <div className="flex gap-2">
                                        {[15, 30, 45, 60, 90].map(dur => (
                                            <button
                                                key={dur}
                                                type="button"
                                                onClick={() => setGlobalDefaults({...globalDefaults, durationMinutes: dur})}
                                                className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition ${globalDefaults.durationMinutes === dur ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                            >
                                                {dur}m
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

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
                        {rows.map((row, index) => {
                            const effectiveType = row.typeOverride || globalDefaults.type;
                            const typeOption = taskTypeOptions.find(o => o.id === effectiveType) || taskTypeOptions[4];
                            
                            return (
                                <div key={index} className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 transition-all">
                                    <div className="flex gap-2 items-center">
                                        <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm" style={{ backgroundColor: `var(--color-${typeOption.color}-100)`, color: `var(--color-${typeOption.color}-700)` }}>
                                            <span className="dark:hidden">{typeOption.icon}</span>
                                            <span className="hidden dark:inline opacity-80 mix-blend-luminosity">{typeOption.icon}</span>
                                        </div>

                                        {/* Title Input */}
                                        <input
                                            type="text"
                                            value={row.title}
                                            onChange={(e) => updateRow(index, 'title', e.target.value)}
                                            placeholder={isIndo ? 'Judul tugas (e.g. Balas email klien)...' : 'Task title...'}
                                            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-600 transition"
                                        />
                                        
                                        <button
                                            type="button"
                                            onClick={() => setOpenSettingsRow(openSettingsRow === index ? null : index)}
                                            className={`shrink-0 w-10 sm:w-12 h-10 sm:h-11 rounded-2xl border-2 flex items-center justify-center transition ${openSettingsRow === index ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            <Settings2 size={16} />
                                        </button>
                                        
                                        {rows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="shrink-0 w-10 sm:w-12 h-10 sm:h-11 rounded-2xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Time Row */}
                                    <div className="flex gap-2 pl-10 sm:pl-10">
                                        <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                            <span className="text-[9px] font-bold text-slate-400">Mulai:</span>
                                            <input
                                                type="time"
                                                value={row.startTime}
                                                onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                                                className="w-full bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                            <span className="text-[9px] font-bold text-slate-400">Selesai:</span>
                                            <input
                                                type="time"
                                                value={row.endTime}
                                                onChange={(e) => updateRow(index, 'endTime', e.target.value)}
                                                className="w-full bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Advanced Row Settings (Overrides) */}
                                    {openSettingsRow === index && (
                                        <div className="mt-2 ml-10 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl animate-in slide-in-from-top-2 fade-in duration-200">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Overrides & Detail (Opsional)</div>
                                            <div className="space-y-2">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-500">Tipe Tugas Spesifik</label>
                                                    <select 
                                                        value={row.typeOverride || ''}
                                                        onChange={(e) => updateRow(index, 'typeOverride', e.target.value === '' ? undefined : Number(e.target.value))}
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                    >
                                                        <option value="">Ikuti Global Default</option>
                                                        {taskTypeOptions.map(opt => (
                                                            <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-slate-500">Catatan Tugas</label>
                                                    <input 
                                                        type="text"
                                                        placeholder="Tambahkan catatan singkat (opsional)..."
                                                        value={row.notes || ''}
                                                        onChange={(e) => updateRow(index, 'notes', e.target.value)}
                                                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-700 dark:text-slate-300 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition flex items-center justify-center gap-1.5"
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
                            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition active:scale-95 flex items-center gap-2"
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
