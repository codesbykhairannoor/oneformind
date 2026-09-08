'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check } from 'lucide-react';

export interface BatchRow {
    name: string;
    icon: string;
    color: string;
    target: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

interface HabitBatchModalProps {
    isOpen: boolean;
    isIndo: boolean;
    daysInCurrentMonth: number;
    iconList: string[];
    colorPalette: string[];
    batchRows: BatchRow[];
    setBatchRows: React.Dispatch<React.SetStateAction<BatchRow[]>>;
    onClose: () => void;
    onSubmit: () => void;
}

export default function HabitBatchModal({
    isOpen,
    isIndo,
    daysInCurrentMonth,
    iconList,
    colorPalette,
    batchRows,
    setBatchRows,
    onClose,
    onSubmit
}: HabitBatchModalProps) {
    const [openBatchIconDropdown, setOpenBatchIconDropdown] = useState<number | null>(null);

    if (!isOpen) return null;

    const loadBatchTemplate = (templateType: 'morning' | 'productivity') => {
        if (templateType === 'morning') {
            setBatchRows([
                { name: isIndo ? 'Minum Air Putih 500ml' : 'Drink 500ml Water', icon: '💧', color: '#06b6d4', target: daysInCurrentMonth, timeOfDay: 'morning' },
                { name: isIndo ? 'Meditasi Pagi 10 Menit' : 'Morning Meditation 10m', icon: '🧘', color: '#6366f1', target: daysInCurrentMonth, timeOfDay: 'morning' },
                { name: isIndo ? 'Olahraga Pagi 20 Menit' : 'Morning Workout 20m', icon: '🏃', color: '#10b981', target: daysInCurrentMonth, timeOfDay: 'morning' }
            ]);
        } else if (templateType === 'productivity') {
            setBatchRows([
                { name: isIndo ? 'Deep Work 90 Menit' : '90-min Deep Work', icon: '💻', color: '#6366f1', target: 20, timeOfDay: 'afternoon' },
                { name: isIndo ? 'Membaca Buku 20 Halaman' : 'Read 20 Pages', icon: '📚', color: '#f59e0b', target: 25, timeOfDay: 'evening' },
                { name: isIndo ? 'No Screen 30 Mnt Sebelum Tidur' : 'No Screen Before Bed', icon: '💤', color: '#8b5cf6', target: daysInCurrentMonth, timeOfDay: 'evening' }
            ]);
        }
    };

    const addBatchRow = () => {
        setBatchRows([
            ...batchRows,
            { name: '', icon: '🎯', color: '#6366f1', target: daysInCurrentMonth, timeOfDay: 'morning' }
        ]);
    };

    const removeBatchRow = (index: number) => {
        if (batchRows.length <= 1) return;
        setBatchRows(batchRows.filter((_, i) => i !== index));
    };

    const updateBatchRow = (index: number, field: keyof BatchRow, value: any) => {
        setBatchRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[88vh] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-md">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100">
                                    Batch Habit Creation
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? 'Buat beberapa habit sekaligus dalam satu klik' : 'Create multiple habits at once'}
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
                                onClick={() => loadBatchTemplate('morning')}
                                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 font-black text-[10px] hover:bg-amber-100 transition shrink-0 border border-amber-200/50"
                            >
                                🌅 {isIndo ? 'Rutinitas Pagi Sehat' : 'Healthy Morning Routine'}
                            </button>
                            <button
                                type="button"
                                onClick={() => loadBatchTemplate('productivity')}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 font-black text-[10px] hover:bg-indigo-100 transition shrink-0 border border-indigo-200/50"
                            >
                                💻 {isIndo ? 'Produktivitas & Fokus' : 'Productivity & Focus'}
                            </button>
                        </div>

                        {/* Batch Rows */}
                        {batchRows.map((row, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">
                                        Habit #{index + 1}
                                    </span>
                                    {batchRows.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBatchRow(index)}
                                            className="text-slate-400 hover:text-rose-500 p-1"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {/* Icon dropdown button */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setOpenBatchIconDropdown(openBatchIconDropdown === index ? null : index)}
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                                            style={{ backgroundColor: `${row.color}15`, color: row.color }}
                                        >
                                            {row.icon}
                                        </button>

                                        {openBatchIconDropdown === index && (
                                            <div className="absolute left-0 mt-2 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 grid grid-cols-5 gap-1 z-50 w-48">
                                                {iconList.map(icon => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() => {
                                                            updateBatchRow(index, 'icon', icon);
                                                            setOpenBatchIconDropdown(null);
                                                        }}
                                                        className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-lg text-base"
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Name input with high contrast */}
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => updateBatchRow(index, 'name', e.target.value)}
                                        placeholder={isIndo ? 'Nama Habit...' : 'Habit Name...'}
                                        className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition"
                                    />
                                </div>

                                {/* Options row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                    {/* Color picker */}
                                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <span className="text-[9px] font-bold text-slate-400 shrink-0">Warna:</span>
                                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                            {colorPalette.slice(0, 5).map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => updateBatchRow(index, 'color', c)}
                                                    className={`w-4 h-4 rounded-full ${row.color === c ? 'ring-2 ring-indigo-500 scale-110' : ''}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Routine picker */}
                                    <select
                                        value={row.timeOfDay}
                                        onChange={(e) => updateBatchRow(index, 'timeOfDay', e.target.value)}
                                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-[10px] outline-none cursor-pointer"
                                    >
                                        <option value="morning" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🌅 Pagi</option>
                                        <option value="afternoon" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">☀️ Siang</option>
                                        <option value="evening" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🌙 Malam</option>
                                        <option value="anytime" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🔄 Fleksibel</option>
                                    </select>

                                    {/* Target Days */}
                                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                        <span>Target:</span>
                                        <span className="font-black text-indigo-600 dark:text-indigo-400">{row.target} hari</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addBatchRow}
                            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:border-indigo-500 hover:text-indigo-500 transition flex items-center justify-center gap-1.5"
                        >
                            <Plus size={15} />
                            <span>{isIndo ? 'Tambah Baris Habit Lainnya' : 'Add Another Habit Row'}</span>
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
                            onClick={onSubmit}
                            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition active:scale-95 flex items-center gap-2"
                        >
                            <Check size={16} strokeWidth={3} />
                            <span>{isIndo ? 'Simpan Semua Habit' : 'Save All Habits'}</span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
