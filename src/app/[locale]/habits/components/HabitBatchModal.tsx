'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Settings2, Target, CalendarDays, Sparkles, Activity, Clock, Hash, Zap, Layers, RefreshCw } from 'lucide-react';
import { BatchRow, GlobalHabitDefaults } from '../types';

export { type BatchRow, type GlobalHabitDefaults };

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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const DAY_LABELS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_LABELS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const POPULAR_UNITS = ['ml', 'gelas', 'menit', 'halaman', 'km', 'langkah', 'jam', 'x'];

function calcEndTime(start: string, durationMins: number): string {
    if (!start) return '';
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + durationMins;
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
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
        dailyTargetValue: 10,
        unit: 'ml',
        target: daysInCurrentMonth,
        plannerIntegration: false,
        defaultStartTime: '07:00',
        defaultEndTime: '07:30'
    });

    if (!isOpen) return null;

    // Preset template packs
    const presetPacks = [
        {
            id: 'wellness',
            titleId: '🧘 Kesehatan & Kebugaran',
            titleEn: '🧘 Health & Wellness',
            color: '#10b981',
            rows: [
                { name: isIndo ? 'Minum Air Putih' : 'Drink Water', icon: '💧', color: '#06b6d4', timeOfDay: 'morning' as const, freqDays: [], plannerStartTime: '07:00', plannerEndTime: '07:15', measurementTypeOverride: 'numeric' as const, dailyTargetValue: 2000, unit: 'ml' },
                { name: isIndo ? 'Jogging / Jalan Pagi' : 'Morning Jog / Walk', icon: '🏃', color: '#10b981', timeOfDay: 'morning' as const, freqDays: [1, 2, 3, 4, 5, 6], plannerStartTime: '06:30', plannerEndTime: '07:00', measurementTypeOverride: 'numeric' as const, dailyTargetValue: 30, unit: 'menit' },
                { name: isIndo ? 'Meditasi & Pernapasan' : 'Mindfulness Meditation', icon: '🧘', color: '#8b5cf6', timeOfDay: 'morning' as const, freqDays: [], plannerStartTime: '07:15', plannerEndTime: '07:30', measurementTypeOverride: 'boolean' as const, dailyTargetValue: 1, unit: 'x' },
                { name: isIndo ? 'Tidur Berkualitas 8 Jam' : 'Sleep 8 Hours', icon: '💤', color: '#6366f1', timeOfDay: 'evening' as const, freqDays: [], plannerStartTime: '22:00', plannerEndTime: '22:30', measurementTypeOverride: 'numeric' as const, dailyTargetValue: 8, unit: 'jam' },
            ]
        },
        {
            id: 'study',
            titleId: '📚 Akademik & Belajar',
            titleEn: '📚 Study & Intellect',
            color: '#3b82f6',
            rows: [
                { name: isIndo ? 'Membaca Buku Non-Fiksi' : 'Read Non-Fiction Book', icon: '📖', color: '#3b82f6', timeOfDay: 'afternoon' as const, freqDays: [], plannerStartTime: '16:00', plannerEndTime: '16:30', measurementTypeOverride: 'numeric' as const, dailyTargetValue: 20, unit: 'halaman' },
                { name: isIndo ? 'Latihan Koding / Soal' : 'Practice Coding / Problems', icon: '💻', color: '#6366f1', timeOfDay: 'afternoon' as const, freqDays: [1, 2, 3, 4, 5], plannerStartTime: '14:00', plannerEndTime: '15:00', measurementTypeOverride: 'numeric' as const, dailyTargetValue: 60, unit: 'menit' },
                { name: isIndo ? 'Jurnal Refleksi Harian' : 'Daily Reflective Journal', icon: '📓', color: '#ec4899', timeOfDay: 'evening' as const, freqDays: [], plannerStartTime: '21:30', plannerEndTime: '21:45', measurementTypeOverride: 'boolean' as const, dailyTargetValue: 1, unit: 'x' },
            ]
        },
        {
            id: 'deep_work',
            titleId: '⚡ Produktivitas & Karier',
            titleEn: '⚡ Focus & Productivity',
            color: '#f59e0b',
            rows: [
                { name: isIndo ? 'Deep Work Sprint 90 Menit' : 'Deep Work 90min Sprint', icon: '⚡', color: '#f59e0b', timeOfDay: 'morning' as const, freqDays: [1, 2, 3, 4, 5], plannerStartTime: '09:00', plannerEndTime: '10:30', measurementTypeOverride: 'numeric' as const, dailyTargetValue: 90, unit: 'menit' },
                { name: isIndo ? 'Cek Pipeline & Lamaran Kerja' : 'Job Application Pipeline Review', icon: '💼', color: '#6366f1', timeOfDay: 'morning' as const, freqDays: [1, 2, 3, 4, 5], plannerStartTime: '08:30', plannerEndTime: '09:00', measurementTypeOverride: 'boolean' as const, dailyTargetValue: 1, unit: 'x' },
                { name: isIndo ? 'Hindari Media Sosial Pagi' : 'No Social Media in Morning', icon: '🛡️', color: '#ef4444', timeOfDay: 'morning' as const, freqDays: [], plannerStartTime: '07:00', plannerEndTime: '12:00', habitTypeOverride: 'negative' as const, measurementTypeOverride: 'boolean' as const, dailyTargetValue: 1, unit: 'x' },
            ]
        }
    ];

    const applyPresetPack = (pack: typeof presetPacks[0]) => {
        setBatchRows(pack.rows.map(r => ({ ...r })));
    };

    const addBatchRow = () => {
        setBatchRows([
            ...batchRows,
            { 
                name: '', 
                icon: '🎯', 
                color: '#6366f1', 
                timeOfDay: 'morning', 
                freqDays: [], 
                plannerStartTime: '07:00', 
                plannerEndTime: '07:30',
                measurementTypeOverride: globalDefaults.measurementType,
                dailyTargetValue: globalDefaults.dailyTargetValue || 10,
                unit: globalDefaults.unit || 'ml'
            }
        ]);
    };

    const removeBatchRow = (index: number) => {
        if (batchRows.length <= 1) return;
        setBatchRows(batchRows.filter((_, i) => i !== index));
    };

    const updateBatchRow = (index: number, field: keyof BatchRow, value: any) => {
        setBatchRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    };

    const toggleDay = (rowIndex: number, day: number) => {
        const row = batchRows[rowIndex];
        const current = row.freqDays.length === 0 ? [...ALL_DAYS] : [...row.freqDays];
        const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day].sort();
        // If all days selected, reset to empty (means everyday)
        updateBatchRow(rowIndex, 'freqDays', next.length === 7 ? [] : next);
    };

    const validRowsCount = batchRows.filter(r => r.name.trim().length > 0).length;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
                
                <div className="bg-white dark:bg-[#0f1117] rounded-[2rem] w-full max-w-3xl relative z-10 shadow-2xl border border-slate-200/80 dark:border-white/[0.06] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    {/* Header */}
                    <div className="px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/20 text-white font-black">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                                    <span>{isIndo ? 'Tambah Habit Sekaligus' : 'Batch Add Habits'}</span>
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                                        Architect
                                    </span>
                                </h3>
                                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                    {isIndo ? 'Buat beberapa habit sekaligus dengan target kuantitatif & jadwal presisi.' : 'Create multiple habits at once with quantitative targets & schedules.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {onSwitchToSingle && (
                                <button
                                    type="button"
                                    onClick={onSwitchToSingle}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition"
                                >
                                    {isIndo ? 'Mode Satuan' : 'Single Mode'}
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                            >
                                <X size={15} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-slate-50/60 dark:bg-[#080b12]/60">
                        
                        {/* 1. QUICK TEMPLATE PACKS */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles size={12} className="text-amber-500" />
                                {isIndo ? 'Paket Template Cepat (1-Klik):' : 'Quick Template Packs (1-Click):'}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {presetPacks.map(pack => (
                                    <button
                                        key={pack.id}
                                        type="button"
                                        onClick={() => applyPresetPack(pack)}
                                        className="p-2.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1117] hover:border-indigo-500/50 hover:shadow-md transition text-left group flex items-center justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                                                {isIndo ? pack.titleId : pack.titleEn}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                {pack.rows.length} {isIndo ? 'habit siap pakai' : 'ready habits'}
                                            </div>
                                        </div>
                                        <span className="text-xs text-indigo-500 group-hover:translate-x-0.5 transition-transform font-bold">
                                            +
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. GLOBAL DEFAULTS CONFIGURATION */}
                        <div className="bg-white dark:bg-[#0f1117] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/[0.07] shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Settings2 size={14} className="text-indigo-500" />
                                    <span className="font-black text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        {isIndo ? 'Pengaturan Default Global' : 'Global Default Configuration'}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {isIndo ? 'Diterapkan ke baris tanpa override' : 'Applied to rows without override'}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {/* Type */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Sparkles size={10} /> {isIndo ? 'Tipe' : 'Type'}
                                    </label>
                                    <select 
                                        value={globalDefaults.habitType}
                                        onChange={(e) => setGlobalDefaults({...globalDefaults, habitType: e.target.value as any})}
                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                                    >
                                        <option value="positive">✨ {isIndo ? 'Bangun (+)' : 'Build (+)'}</option>
                                        <option value="negative">🛡️ {isIndo ? 'Hentikan (-)' : 'Quit (-)'}</option>
                                    </select>
                                </div>

                                {/* Measure (Boolean vs Numeric) */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Activity size={10} /> {isIndo ? 'Pengukuran' : 'Measurement'}
                                    </label>
                                    <select 
                                        value={globalDefaults.measurementType}
                                        onChange={(e) => {
                                            const nextMeasure = e.target.value as 'boolean' | 'numeric';
                                            setGlobalDefaults({
                                                ...globalDefaults, 
                                                measurementType: nextMeasure,
                                                dailyTargetValue: nextMeasure === 'numeric' ? 10 : 1,
                                                unit: nextMeasure === 'numeric' ? 'ml' : 'x'
                                            });
                                        }}
                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                                    >
                                        <option value="boolean">✓ {isIndo ? 'Centang (Ya/Tidak)' : 'Checkbox'}</option>
                                        <option value="numeric">🔢 {isIndo ? 'Kuantitatif (Angka)' : 'Quantitative (Numeric)'}</option>
                                    </select>
                                </div>

                                {/* Monthly Target */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Target size={10} /> {isIndo ? 'Target Bulanan' : 'Monthly Target'}
                                    </label>
                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/[0.03] px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.07]">
                                        <input 
                                            type="number" 
                                            value={globalDefaults.target}
                                            onChange={(e) => setGlobalDefaults({...globalDefaults, target: Math.max(1, parseInt(e.target.value) || 1)})}
                                            className="w-10 bg-transparent text-xs font-black text-slate-800 dark:text-slate-200 outline-none text-center"
                                        />
                                        <span className="text-[10px] font-bold text-slate-400">{isIndo ? 'hari' : 'days'}</span>
                                    </div>
                                </div>

                                {/* Planner Integration */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <CalendarDays size={10} /> {isIndo ? 'Sinkron Planner' : 'Planner Sync'}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setGlobalDefaults({...globalDefaults, plannerIntegration: !globalDefaults.plannerIntegration})}
                                        className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-bold transition ${globalDefaults.plannerIntegration 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300' 
                                            : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/[0.03] dark:border-white/[0.07] dark:text-slate-400'}`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${globalDefaults.plannerIntegration ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                            {globalDefaults.plannerIntegration && <Check size={9} strokeWidth={4} />}
                                        </div>
                                        <span>{globalDefaults.plannerIntegration ? (isIndo ? 'Aktif' : 'Active') : (isIndo ? 'Nonaktif' : 'Disabled')}</span>
                                    </button>
                                </div>
                            </div>

                            {/* QUANTITATIVE DETAIL SUB-PANEL (If Global is Numeric) */}
                            {globalDefaults.measurementType === 'numeric' && (
                                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <Hash size={10} /> {isIndo ? 'Target Angka Harian (Default)' : 'Daily Numeric Target'}
                                        </label>
                                        <input 
                                            type="number"
                                            value={globalDefaults.dailyTargetValue || 10}
                                            onChange={(e) => setGlobalDefaults({...globalDefaults, dailyTargetValue: Math.max(1, parseInt(e.target.value) || 1)})}
                                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            {isIndo ? 'Satuan / Unit (Default)' : 'Unit Label'}
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="text"
                                                value={globalDefaults.unit || 'ml'}
                                                onChange={(e) => setGlobalDefaults({...globalDefaults, unit: e.target.value})}
                                                placeholder="cth: ml, gelas, halaman"
                                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {POPULAR_UNITS.slice(0, 6).map(u => (
                                                <button
                                                    key={u}
                                                    type="button"
                                                    onClick={() => setGlobalDefaults({...globalDefaults, unit: u})}
                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition ${globalDefaults.unit === u ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'}`}
                                                >
                                                    {u}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. BATCH HABIT ROWS */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Layers size={12} />
                                    {isIndo ? 'Daftar Habit Kolektif:' : 'Habits List:'} ({batchRows.length})
                                </span>
                                <span className="text-[10px] font-bold text-indigo-500">
                                    {validRowsCount} {isIndo ? 'valid' : 'valid'}
                                </span>
                            </div>

                            {batchRows.map((row, index) => {
                                const dayLabels = isIndo ? DAY_LABELS_ID : DAY_LABELS_EN;
                                const activeDays = row.freqDays.length === 0 ? ALL_DAYS : row.freqDays;
                                const showPlanner = row.plannerIntegrationOverride !== undefined 
                                    ? row.plannerIntegrationOverride 
                                    : globalDefaults.plannerIntegration;

                                const effectiveMeasure = row.measurementTypeOverride || globalDefaults.measurementType;
                                const isNumeric = effectiveMeasure === 'numeric';
                                const rowDailyVal = row.dailyTargetValue || globalDefaults.dailyTargetValue || 10;
                                const rowUnit = row.unit || globalDefaults.unit || 'ml';

                                return (
                                    <div key={index} className="bg-white dark:bg-[#0f1117] rounded-2xl border-2 border-slate-200 dark:border-white/[0.07] overflow-hidden transition-all shadow-xs">
                                        {/* Main Row Line */}
                                        <div className="p-3 sm:p-3.5 flex items-center gap-2 sm:gap-3">
                                            {/* Icon with Dropdown */}
                                            <div className="relative shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenBatchIconDropdown(openBatchIconDropdown === index ? null : index)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-slate-200 dark:border-white/[0.08] transition hover:scale-105 active:scale-95 shadow-xs"
                                                    style={{ backgroundColor: `${row.color}20` }}
                                                >
                                                    {row.icon}
                                                </button>

                                                {openBatchIconDropdown === index && (
                                                    <div className="absolute left-0 top-12 p-2 bg-white dark:bg-[#1a1d27] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] grid grid-cols-5 gap-1.5 z-50 w-56 animate-in zoom-in-95">
                                                        {iconList.map(icon => (
                                                            <button
                                                                key={icon}
                                                                type="button"
                                                                onClick={() => { updateBatchRow(index, 'icon', icon); setOpenBatchIconDropdown(null); }}
                                                                className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl text-lg transition flex items-center justify-center"
                                                            >
                                                                {icon}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Habit Name Input */}
                                            <div className="flex-1 min-w-0">
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onChange={(e) => updateBatchRow(index, 'name', e.target.value)}
                                                    placeholder={isIndo ? 'Nama habit (cth: Minum 2L Air)...' : 'Habit name (e.g. Read 20 pages)...'}
                                                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] font-bold text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition"
                                                />
                                            </div>

                                            {/* Numeric Tag Preview if Quantitative */}
                                            {isNumeric && (
                                                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/30 text-[10px] font-black shrink-0">
                                                    <span>{rowDailyVal} {rowUnit}</span>
                                                </div>
                                            )}
                                            
                                            {/* Settings Toggle Button */}
                                            <button
                                                type="button"
                                                onClick={() => setOpenSettingsRow(openSettingsRow === index ? null : index)}
                                                title={isIndo ? 'Kustomisasi Pengaturan Habit Ini' : 'Customize Habit Settings'}
                                                className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition ${openSettingsRow === index 
                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400 shadow-sm' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-white/[0.03] dark:border-white/[0.07] hover:bg-slate-100 hover:text-slate-600'}`}
                                            >
                                                <Settings2 size={14} />
                                            </button>
                                            
                                            {/* Delete Row Button */}
                                            {batchRows.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeBatchRow(index)}
                                                    className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Bottom Quick Bar: Time of Day + Colors */}
                                        <div className="px-3.5 pb-3 flex flex-wrap gap-2 items-center justify-between">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* Time of Day */}
                                                <select
                                                    value={row.timeOfDay}
                                                    onChange={(e) => updateBatchRow(index, 'timeOfDay', e.target.value)}
                                                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-slate-800 dark:text-white font-bold text-[10px] outline-none cursor-pointer"
                                                >
                                                    <option value="morning">🌅 {isIndo ? 'Pagi' : 'Morning'}</option>
                                                    <option value="afternoon">☀️ {isIndo ? 'Siang' : 'Afternoon'}</option>
                                                    <option value="evening">🌙 {isIndo ? 'Malam' : 'Evening'}</option>
                                                    <option value="anytime">🔄 {isIndo ? 'Fleksibel' : 'Anytime'}</option>
                                                </select>

                                                {/* Color Picker Palette */}
                                                <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/[0.03] px-2 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07]">
                                                    {colorPalette.slice(0, 7).map(c => (
                                                        <button
                                                            key={c}
                                                            type="button"
                                                            onClick={() => updateBatchRow(index, 'color', c)}
                                                            className={`w-3.5 h-3.5 rounded-full transition ${row.color === c ? 'ring-2 ring-white dark:ring-slate-900 ring-offset-1 ring-offset-indigo-500 scale-110' : 'hover:scale-110'}`}
                                                            style={{ backgroundColor: c }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Days summary pill */}
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {row.freqDays.length === 0 ? (isIndo ? 'Setiap Hari' : 'Daily') : `${row.freqDays.length} ${isIndo ? 'hari/minggu' : 'days/wk'}`}
                                            </span>
                                        </div>

                                        {/* Expanded Per-Habit Customization Drawer */}
                                        {openSettingsRow === index && (
                                            <div className="mx-3.5 mb-3.5 p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-2xl space-y-3.5 animate-in slide-in-from-top-2 fade-in duration-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Settings2 size={12} />
                                                        {isIndo ? 'Kustomisasi Khusus Habit Ini' : 'Per-Habit Custom Overrides'}
                                                    </span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setOpenSettingsRow(null)}
                                                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                                                    >
                                                        {isIndo ? 'Tutup' : 'Close'}
                                                    </button>
                                                </div>
                                                
                                                {/* 1. Custom Active Days */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                        <CalendarDays size={11} />
                                                        {isIndo ? 'Jadwal Hari Aktif' : 'Active Days Schedule'}
                                                    </label>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {ALL_DAYS.map(day => {
                                                            const isActive = row.freqDays.length === 0 || row.freqDays.includes(day);
                                                            return (
                                                                <button
                                                                    key={day}
                                                                    type="button"
                                                                    onClick={() => toggleDay(index, day)}
                                                                    className={`w-9 h-8 rounded-xl text-[10px] font-black border transition ${isActive 
                                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-300'}`}
                                                                >
                                                                    {dayLabels[day]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {row.freqDays.length === 0 ? (isIndo ? '✓ Berjalan setiap hari' : '✓ Runs everyday') : (isIndo ? `✓ Berjalan di ${row.freqDays.length} hari terpilih` : `✓ Runs on ${row.freqDays.length} selected days`)}
                                                    </p>
                                                </div>

                                                {/* 2. Numeric / Measurement Overrides */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-500">{isIndo ? 'Metode Pengukuran' : 'Measurement Type'}</label>
                                                        <select 
                                                            value={row.measurementTypeOverride || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                updateBatchRow(index, 'measurementTypeOverride', val === '' ? undefined : val);
                                                            }}
                                                            className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                        >
                                                            <option value="">{isIndo ? 'Ikuti Global' : 'Follow Global'}</option>
                                                            <option value="boolean">✓ {isIndo ? 'Centang' : 'Checkbox'}</option>
                                                            <option value="numeric">🔢 {isIndo ? 'Kuantitatif (Angka)' : 'Quantitative'}</option>
                                                        </select>
                                                    </div>

                                                    {isNumeric && (
                                                        <>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-slate-500">{isIndo ? 'Target Harian' : 'Daily Target'}</label>
                                                                <input 
                                                                    type="number"
                                                                    value={row.dailyTargetValue || globalDefaults.dailyTargetValue || 10}
                                                                    onChange={(e) => updateBatchRow(index, 'dailyTargetValue', Math.max(1, parseInt(e.target.value) || 1))}
                                                                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-slate-500">{isIndo ? 'Satuan / Unit' : 'Unit Label'}</label>
                                                                <input 
                                                                    type="text"
                                                                    value={row.unit || globalDefaults.unit || 'ml'}
                                                                    onChange={(e) => updateBatchRow(index, 'unit', e.target.value)}
                                                                    placeholder="cth: gelas, menit"
                                                                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* 3. Planner Time Scheduling */}
                                                {showPlanner && (
                                                    <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                                                        <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                            <Clock size={11} /> {isIndo ? 'Jadwal Jam di Daily Planner' : 'Daily Planner Time Slot'}
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                <span className="text-[10px] font-bold text-slate-400">{isIndo ? 'Mulai:' : 'Start:'}</span>
                                                                <input
                                                                    type="time"
                                                                    value={row.plannerStartTime}
                                                                    onChange={(e) => {
                                                                        const start = e.target.value;
                                                                        const end = calcEndTime(start, 30);
                                                                        updateBatchRow(index, 'plannerStartTime', start);
                                                                        updateBatchRow(index, 'plannerEndTime', end);
                                                                    }}
                                                                    className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                <span className="text-[10px] font-bold text-slate-400">{isIndo ? 'Selesai:' : 'End:'}</span>
                                                                <input
                                                                    type="time"
                                                                    value={row.plannerEndTime}
                                                                    onChange={(e) => updateBatchRow(index, 'plannerEndTime', e.target.value)}
                                                                    className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Another Row Button */}
                        <button
                            type="button"
                            onClick={addBatchRow}
                            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition font-black text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                            <Plus size={15} />
                            <span>{isIndo ? '+ Tambah Baris Habit Lain' : '+ Add Another Habit Row'}</span>
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
                            onClick={() => onSubmit(globalDefaults)}
                            disabled={validRowsCount === 0}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <Check size={15} strokeWidth={3} />
                            <span>
                                {isIndo 
                                    ? `Simpan ${validRowsCount} Habit Terpilih` 
                                    : `Save ${validRowsCount} Habits`}
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
