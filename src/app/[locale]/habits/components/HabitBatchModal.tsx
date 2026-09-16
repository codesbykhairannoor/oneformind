'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Settings2, Target, CalendarDays, Sparkles, Activity } from 'lucide-react';
import { LifeOSTab } from '../types';

export interface GlobalHabitDefaults {
    habitType: 'positive' | 'negative';
    measurementType: 'boolean' | 'numeric';
    target: number;
    plannerIntegration: boolean;
}

export interface BatchRow {
    name: string;
    icon: string;
    color: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
    // Overrides
    target?: number; 
    habitTypeOverride?: 'positive' | 'negative';
    measurementTypeOverride?: 'boolean' | 'numeric';
    plannerIntegrationOverride?: boolean;
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
    onSubmit: (defaults: GlobalHabitDefaults) => void;
    onSwitchToSingle?: () => void;
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
    onSubmit,
    onSwitchToSingle
}: HabitBatchModalProps) {
    const [openBatchIconDropdown, setOpenBatchIconDropdown] = useState<number | null>(null);
    const [openSettingsRow, setOpenSettingsRow] = useState<number | null>(null);

    const [globalDefaults, setGlobalDefaults] = useState<GlobalHabitDefaults>({
        habitType: 'positive',
        measurementType: 'boolean',
        target: daysInCurrentMonth,
        plannerIntegration: false
    });

    if (!isOpen) return null;

    const loadBatchTemplate = (templateType: 'morning' | 'productivity') => {
        if (templateType === 'morning') {
            setBatchRows([
                { name: isIndo ? 'Minum Air Putih 500ml' : 'Drink 500ml Water', icon: '💧', color: '#06b6d4', timeOfDay: 'morning' },
                { name: isIndo ? 'Meditasi Pagi 10 Menit' : 'Morning Meditation 10m', icon: '🧘', color: '#6366f1', timeOfDay: 'morning' },
                { name: isIndo ? 'Olahraga Pagi 20 Menit' : 'Morning Workout 20m', icon: '🏃', color: '#10b981', timeOfDay: 'morning' }
            ]);
        } else if (templateType === 'productivity') {
            setBatchRows([
                { name: isIndo ? 'Deep Work 90 Menit' : '90-min Deep Work', icon: '💻', color: '#6366f1', timeOfDay: 'afternoon' },
                { name: isIndo ? 'Membaca Buku 20 Halaman' : 'Read 20 Pages', icon: '📚', color: '#f59e0b', timeOfDay: 'evening' },
                { name: isIndo ? 'No Screen 30 Mnt Sebelum Tidur' : 'No Screen Before Bed', icon: '💤', color: '#8b5cf6', timeOfDay: 'evening' }
            ]);
        }
    };

    const addBatchRow = () => {
        setBatchRows([
            ...batchRows,
            { name: '', icon: '🎯', color: '#6366f1', timeOfDay: 'morning' }
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
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[95vh] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-md">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                                    Smart Batch Habit
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? 'Atur default global lalu ketik daftar habit dengan cepat' : 'Set global defaults then type habit list quickly'}
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
                                    {isIndo ? 'Pengaturan Bawaan Global' : 'Global Default Settings'}
                                </h4>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {/* Type */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Sparkles size={10} /> Tipe Habit</label>
                                    <select 
                                        value={globalDefaults.habitType}
                                        onChange={(e) => setGlobalDefaults({...globalDefaults, habitType: e.target.value as any})}
                                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                    >
                                        <option value="positive">✨ Build (+)</option>
                                        <option value="negative">🛡️ Quit (-)</option>
                                    </select>
                                </div>
                                {/* Measure */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Activity size={10} /> Mode Ukur</label>
                                    <select 
                                        value={globalDefaults.measurementType}
                                        onChange={(e) => setGlobalDefaults({...globalDefaults, measurementType: e.target.value as any})}
                                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                    >
                                        <option value="boolean">✓ Centang</option>
                                        <option value="numeric">🔢 Kuantitatif</option>
                                    </select>
                                </div>
                                {/* Target */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Target size={10} /> Target Hari</label>
                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <input 
                                            type="number" 
                                            value={globalDefaults.target}
                                            onChange={(e) => setGlobalDefaults({...globalDefaults, target: parseInt(e.target.value) || 1})}
                                            className="w-8 bg-transparent text-[10px] font-black text-slate-700 dark:text-slate-300 outline-none text-center"
                                        />
                                        <span className="text-[10px] font-bold text-slate-500">hari/bln</span>
                                    </div>
                                </div>
                                {/* Planner Integration */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><CalendarDays size={10} /> Planner</label>
                                    <button
                                        onClick={() => setGlobalDefaults({...globalDefaults, plannerIntegration: !globalDefaults.plannerIntegration})}
                                        className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition ${globalDefaults.plannerIntegration ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400'}`}
                                    >
                                        <div className={`w-3 h-3 rounded-md flex items-center justify-center border ${globalDefaults.plannerIntegration ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                            {globalDefaults.plannerIntegration && <Check size={8} strokeWidth={4} />}
                                        </div>
                                        <span>Aktifkan</span>
                                    </button>
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
                            <div key={index} className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 transition-all">
                                <div className="flex gap-2">
                                    {/* Icon dropdown button */}
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpenBatchIconDropdown(openBatchIconDropdown === index ? null : index)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition hover:scale-105"
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
                                        placeholder={isIndo ? 'Nama Habit (e.g. Minum Air 2L)...' : 'Habit Name...'}
                                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition"
                                    />
                                    
                                    <button
                                        type="button"
                                        onClick={() => setOpenSettingsRow(openSettingsRow === index ? null : index)}
                                        className={`shrink-0 w-10 sm:w-12 rounded-2xl border-2 flex items-center justify-center transition ${openSettingsRow === index ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    >
                                        <Settings2 size={16} />
                                    </button>
                                    
                                    {batchRows.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBatchRow(index)}
                                            className="shrink-0 w-10 sm:w-12 rounded-2xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>

                                {/* Base Options row */}
                                <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center pl-12 sm:pl-14">
                                    {/* Routine picker */}
                                    <select
                                        value={row.timeOfDay}
                                        onChange={(e) => updateBatchRow(index, 'timeOfDay', e.target.value)}
                                        className="flex-1 min-w-[100px] px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-[10px] outline-none cursor-pointer"
                                    >
                                        <option value="morning">🌅 Pagi</option>
                                        <option value="afternoon">☀️ Siang</option>
                                        <option value="evening">🌙 Malam</option>
                                        <option value="anytime">🔄 Fleksibel</option>
                                    </select>

                                    {/* Color picker */}
                                    <div className="flex items-center bg-slate-50 dark:bg-slate-950 px-1.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                            {colorPalette.slice(0, 6).map(c => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => updateBatchRow(index, 'color', c)}
                                                    className={`w-4 h-4 rounded-full transition ${row.color === c ? 'ring-2 ring-indigo-500 scale-110' : ''}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Advanced Row Settings (Overrides) */}
                                {openSettingsRow === index && (
                                    <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Overrides (Opsional)</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-500">Tipe Habit</label>
                                                <select 
                                                    value={row.habitTypeOverride || ''}
                                                    onChange={(e) => updateBatchRow(index, 'habitTypeOverride', e.target.value === '' ? undefined : e.target.value)}
                                                    className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                >
                                                    <option value="">Ikuti Global Default</option>
                                                    <option value="positive">✨ Build (+)</option>
                                                    <option value="negative">🛡️ Quit (-)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-500">Mode Ukur</label>
                                                <select 
                                                    value={row.measurementTypeOverride || ''}
                                                    onChange={(e) => updateBatchRow(index, 'measurementTypeOverride', e.target.value === '' ? undefined : e.target.value)}
                                                    className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                >
                                                    <option value="">Ikuti Global Default</option>
                                                    <option value="boolean">✓ Centang</option>
                                                    <option value="numeric">🔢 Kuantitatif</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-500">Target Hari</label>
                                                <input 
                                                    type="number"
                                                    placeholder="Ikuti Global"
                                                    value={row.target || ''}
                                                    onChange={(e) => updateBatchRow(index, 'target', e.target.value ? parseInt(e.target.value) : undefined)}
                                                    className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-slate-500">Planner Integration</label>
                                                <select 
                                                    value={row.plannerIntegrationOverride === undefined ? '' : (row.plannerIntegrationOverride ? 'true' : 'false')}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        updateBatchRow(index, 'plannerIntegrationOverride', val === '' ? undefined : val === 'true');
                                                    }}
                                                    className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                >
                                                    <option value="">Ikuti Global Default</option>
                                                    <option value="true">Aktif</option>
                                                    <option value="false">Mati</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addBatchRow}
                            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition flex items-center justify-center gap-1.5"
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
                            onClick={() => onSubmit(globalDefaults)}
                            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition active:scale-95 flex items-center gap-2"
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
