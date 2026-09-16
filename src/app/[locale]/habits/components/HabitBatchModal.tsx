'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Settings2, Target, CalendarDays, Sparkles, Activity, Clock } from 'lucide-react';

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
    freqDays: number[]; // 0=Sun,1=Mon,...,6=Sat; empty = everyday
    plannerStartTime: string; // e.g. "07:00"
    plannerEndTime: string;   // e.g. "07:30"
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

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const DAY_LABELS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const DAY_LABELS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        target: daysInCurrentMonth,
        plannerIntegration: false
    });

    if (!isOpen) return null;

    const addBatchRow = () => {
        setBatchRows([
            ...batchRows,
            { name: '', icon: '🎯', color: '#6366f1', timeOfDay: 'morning', freqDays: [], plannerStartTime: '07:00', plannerEndTime: '07:30' }
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

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
                
                <div className="bg-white dark:bg-[#0f1117] rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-200/80 dark:border-white/[0.06] max-h-[95vh] flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg shadow-lg shadow-indigo-500/25">
                                ⚡
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                    {isIndo ? 'Tambah Habit Sekaligus' : 'Batch Add Habits'}
                                </h3>
                                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                    {isIndo ? 'Isi daftar habit, atur jadwal tiap habit' : 'Fill habit list, set schedule per habit'}
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
                        
                        {/* GLOBAL DEFAULTS PANEL */}
                        <div className="bg-white dark:bg-[#0f1117] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.07] shadow-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <Settings2 size={13} className="text-indigo-500" />
                                <span className="font-black text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    {isIndo ? 'Default Global' : 'Global Defaults'}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {/* Type */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Sparkles size={9} /> {isIndo ? 'Tipe' : 'Type'}</label>
                                    <select 
                                        value={globalDefaults.habitType}
                                        onChange={(e) => setGlobalDefaults({...globalDefaults, habitType: e.target.value as any})}
                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="positive">✨ Build (+)</option>
                                        <option value="negative">🛡️ Quit (-)</option>
                                    </select>
                                </div>
                                {/* Measure */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Activity size={9} /> {isIndo ? 'Ukur' : 'Measure'}</label>
                                    <select 
                                        value={globalDefaults.measurementType}
                                        onChange={(e) => setGlobalDefaults({...globalDefaults, measurementType: e.target.value as any})}
                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="boolean">✓ {isIndo ? 'Centang' : 'Checkbox'}</option>
                                        <option value="numeric">🔢 {isIndo ? 'Angka' : 'Numeric'}</option>
                                    </select>
                                </div>
                                {/* Target */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><Target size={9} /> {isIndo ? 'Target' : 'Target'}</label>
                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/[0.03] px-2.5 py-2 rounded-xl border border-slate-200 dark:border-white/[0.07]">
                                        <input 
                                            type="number" 
                                            value={globalDefaults.target}
                                            onChange={(e) => setGlobalDefaults({...globalDefaults, target: parseInt(e.target.value) || 1})}
                                            className="w-8 bg-transparent text-[10px] font-black text-slate-700 dark:text-slate-300 outline-none text-center"
                                        />
                                        <span className="text-[10px] font-bold text-slate-400">{isIndo ? 'hr/bln' : 'd/mo'}</span>
                                    </div>
                                </div>
                                {/* Planner Integration */}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><CalendarDays size={9} /> Planner</label>
                                    <button
                                        type="button"
                                        onClick={() => setGlobalDefaults({...globalDefaults, plannerIntegration: !globalDefaults.plannerIntegration})}
                                        className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border text-[10px] font-bold transition ${globalDefaults.plannerIntegration 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300' 
                                            : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/[0.03] dark:border-white/[0.07] dark:text-slate-400'}`}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${globalDefaults.plannerIntegration ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                            {globalDefaults.plannerIntegration && <Check size={9} strokeWidth={4} />}
                                        </div>
                                        <span>{isIndo ? 'Aktifkan' : 'Enable'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Batch Rows */}
                        <div className="space-y-3">
                            {batchRows.map((row, index) => {
                                const dayLabels = isIndo ? DAY_LABELS_ID : DAY_LABELS_EN;
                                const activeDays = row.freqDays.length === 0 ? ALL_DAYS : row.freqDays;
                                const showPlanner = row.plannerIntegrationOverride !== undefined 
                                    ? row.plannerIntegrationOverride 
                                    : globalDefaults.plannerIntegration;

                                return (
                                    <div key={index} className="bg-white dark:bg-[#0f1117] rounded-2xl border-2 border-slate-200 dark:border-white/[0.07] overflow-hidden transition-all">
                                        {/* Row main line */}
                                        <div className="p-3 flex gap-2">
                                            {/* Icon */}
                                            <div className="relative shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenBatchIconDropdown(openBatchIconDropdown === index ? null : index)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-slate-200 dark:border-white/[0.08] transition hover:scale-105 active:scale-95"
                                                    style={{ backgroundColor: `${row.color}20` }}
                                                >
                                                    {row.icon}
                                                </button>

                                                {openBatchIconDropdown === index && (
                                                    <div className="absolute left-0 top-12 p-2 bg-white dark:bg-[#1a1d27] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08] grid grid-cols-5 gap-1 z-50 w-52">
                                                        {iconList.map(icon => (
                                                            <button
                                                                key={icon}
                                                                type="button"
                                                                onClick={() => { updateBatchRow(index, 'icon', icon); setOpenBatchIconDropdown(null); }}
                                                                className="p-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-lg text-base transition"
                                                            >
                                                                {icon}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name input */}
                                            <input
                                                type="text"
                                                value={row.name}
                                                onChange={(e) => updateBatchRow(index, 'name', e.target.value)}
                                                placeholder={isIndo ? 'Nama habit...' : 'Habit name...'}
                                                className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] font-bold text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition"
                                            />
                                            
                                            {/* Settings toggle */}
                                            <button
                                                type="button"
                                                onClick={() => setOpenSettingsRow(openSettingsRow === index ? null : index)}
                                                className={`shrink-0 w-10 h-10 rounded-xl border-2 flex items-center justify-center transition ${openSettingsRow === index 
                                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-white/[0.03] dark:border-white/[0.07] hover:bg-slate-100'}`}
                                            >
                                                <Settings2 size={14} />
                                            </button>
                                            
                                            {batchRows.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeBatchRow(index)}
                                                    className="shrink-0 w-10 h-10 rounded-xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Bottom bar: routine + time-of-day + color */}
                                        <div className="px-3 pb-3 flex flex-wrap gap-2 items-center">
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

                                            {/* Color picker */}
                                            <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/[0.03] px-2 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.07]">
                                                {colorPalette.slice(0, 6).map(c => (
                                                    <button
                                                        key={c}
                                                        type="button"
                                                        onClick={() => updateBatchRow(index, 'color', c)}
                                                        className={`w-4 h-4 rounded-full transition ${row.color === c ? 'ring-2 ring-white dark:ring-slate-900 ring-offset-1 ring-offset-indigo-500 scale-110' : 'hover:scale-110'}`}
                                                        style={{ backgroundColor: c }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expanded Settings */}
                                        {openSettingsRow === index && (
                                            <div className="mx-3 mb-3 p-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isIndo ? 'Pengaturan Per-Habit' : 'Per-Habit Settings'}</span>
                                                
                                                {/* Hari aktif */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-bold text-slate-500">{isIndo ? 'Hari Aktif' : 'Active Days'}</label>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {ALL_DAYS.map(day => {
                                                            const isActive = row.freqDays.length === 0 || row.freqDays.includes(day);
                                                            return (
                                                                <button
                                                                    key={day}
                                                                    type="button"
                                                                    onClick={() => toggleDay(index, day)}
                                                                    className={`w-8 h-8 rounded-lg text-[10px] font-black border transition ${isActive 
                                                                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-sm' 
                                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-300'}`}
                                                                >
                                                                    {dayLabels[day]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {row.freqDays.length === 0 && (
                                                        <p className="text-[9px] text-slate-400 font-medium">{isIndo ? '✓ Setiap hari (default)' : '✓ Every day (default)'}</p>
                                                    )}
                                                </div>

                                                {/* Planner jam (kondisional) */}
                                                {showPlanner && (
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                                            <Clock size={9} /> {isIndo ? 'Jam di Planner' : 'Planner Time'}
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                <span className="text-[9px] font-bold text-slate-400">{isIndo ? 'Mulai:' : 'Start:'}</span>
                                                                <input
                                                                    type="time"
                                                                    value={row.plannerStartTime}
                                                                    onChange={(e) => {
                                                                        const start = e.target.value;
                                                                        const end = calcEndTime(start, 30);
                                                                        updateBatchRow(index, 'plannerStartTime', start);
                                                                        updateBatchRow(index, 'plannerEndTime', end);
                                                                    }}
                                                                    className="bg-transparent font-black text-[10px] text-slate-900 dark:text-white outline-none cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                <span className="text-[9px] font-bold text-slate-400">{isIndo ? 'Selesai:' : 'End:'}</span>
                                                                <input
                                                                    type="time"
                                                                    value={row.plannerEndTime}
                                                                    onChange={(e) => updateBatchRow(index, 'plannerEndTime', e.target.value)}
                                                                    className="bg-transparent font-black text-[10px] text-slate-900 dark:text-white outline-none cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Per-row overrides */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-slate-500">{isIndo ? 'Override Tipe' : 'Type Override'}</label>
                                                        <select 
                                                            value={row.habitTypeOverride || ''}
                                                            onChange={(e) => updateBatchRow(index, 'habitTypeOverride', e.target.value === '' ? undefined : e.target.value)}
                                                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                        >
                                                            <option value="">{isIndo ? 'Ikuti Global' : 'Follow Global'}</option>
                                                            <option value="positive">✨ Build (+)</option>
                                                            <option value="negative">🛡️ Quit (-)</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-slate-500">{isIndo ? 'Override Planner' : 'Planner Override'}</label>
                                                        <select 
                                                            value={row.plannerIntegrationOverride === undefined ? '' : (row.plannerIntegrationOverride ? 'true' : 'false')}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                updateBatchRow(index, 'plannerIntegrationOverride', val === '' ? undefined : val === 'true');
                                                            }}
                                                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-700 dark:text-slate-300 outline-none"
                                                        >
                                                            <option value="">{isIndo ? 'Ikuti Global' : 'Follow Global'}</option>
                                                            <option value="true">{isIndo ? 'Aktif' : 'On'}</option>
                                                            <option value="false">{isIndo ? 'Mati' : 'Off'}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={addBatchRow}
                            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] text-slate-400 font-black text-xs hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition flex items-center justify-center gap-2"
                        >
                            <Plus size={14} />
                            <span>{isIndo ? 'Tambah Habit Lainnya' : 'Add Another Habit'}</span>
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
                            onClick={() => onSubmit(globalDefaults)}
                            className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center gap-2"
                        >
                            <Check size={14} strokeWidth={3} />
                            <span>{isIndo ? 'Simpan Semua Habit' : 'Save All Habits'}</span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
