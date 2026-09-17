'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Plus, Trash2, Check, Settings2, Target, CalendarDays, Sparkles, Activity, Clock, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import { BatchRow } from '../types';

export { type BatchRow };

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

import { useGating } from '@/hooks/useGating';
import { useRouter } from '@/i18n/routing';
import { Lock, Zap } from 'lucide-react';

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
    const { isArchitect } = useGating();
    const router = useRouter();
    const [openBatchIconDropdown, setOpenBatchIconDropdown] = useState<number | null>(null);
    const [openExpandedRow, setOpenExpandedRow] = useState<number | null>(0); // First row expanded by default

    if (!isOpen) return null;

    if (!isArchitect) {
        return (
            <ModalPortal>
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
                    <div 
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Top Radiant Accent */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600" />

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-all z-10"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        <div className="p-8 sm:p-10 text-center">
                            {/* Glowing Icon Container */}
                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                <div className="relative w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xl">
                                    <Zap className="w-8 h-8 text-amber-500" />
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                                        <Lock size={12} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>

                            {/* Tier Badge */}
                            <div className="mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-xs">
                                    <Sparkles size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
                                    {isIndo ? 'Fitur Eksklusif Architect Pro' : 'Architect Pro Feature'}
                                </span>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-3">
                                {isIndo ? 'Mode Habit Batch (Kolektif)' : 'Habit Batch Mode Engine'}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto mb-6">
                                {isIndo 
                                    ? 'Membuat dan mengatur banyak kebiasaan hidup baru sekaligus dalam 1 formulir cepat adalah keunggulan eksklusif paket Architect.' 
                                    : 'Designing and launching multiple life rituals at once is a high-velocity feature exclusive to Architect tier.'}
                            </p>

                            {/* Feature Perks Box */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left space-y-2.5 mb-8">
                                {[
                                    isIndo ? 'Bangun & luncurkan banyak ritual kebiasaan sekaligus tanpa bolak-balik' : 'Design & deploy multiple life habits instantly without repetitive forms',
                                    isIndo ? 'Atur target bulanan, kuantitas, dan frekuensi per baris' : 'Configure monthly targets, units, and custom frequencies per row',
                                    isIndo ? 'Sinkronisasi instan ke tracker grid & matriks konsistensi' : 'Instant sync to habit tracker grid & streak analytics'
                                ].map((perk, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-black text-[9px]">
                                            ✓
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug">
                                            {perk}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        router.push('/billing');
                                    }}
                                    className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>{isIndo ? 'Upgrade ke Architect Sekarang' : 'Upgrade to Architect Now'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onSwitchToSingle) {
                                            onSwitchToSingle();
                                        } else {
                                            onClose();
                                        }
                                    }}
                                    className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {isIndo ? 'Kembali ke Input Kebiasaan Biasa' : 'Back to Single Habit Entry'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalPortal>
        );
    }

    const addBatchRow = () => {
        const nextIndex = batchRows.length;
        setBatchRows([
            ...batchRows,
            { 
                name: '', 
                icon: '🎯', 
                color: colorPalette[nextIndex % colorPalette.length] || '#6366f1', 
                habitType: 'positive',
                measurementType: 'boolean',
                targetValue: 1,
                unit: 'x',
                monthlyTarget: daysInCurrentMonth,
                timeOfDay: 'morning', 
                freqType: 'daily',
                freqDays: [], 
                plannerIntegration: false,
                plannerStartTime: '07:00', 
                plannerEndTime: '07:30'
            }
        ]);
        setOpenExpandedRow(nextIndex);
    };

    const removeBatchRow = (index: number) => {
        if (batchRows.length <= 1) return;
        setBatchRows(batchRows.filter((_, i) => i !== index));
        if (openExpandedRow === index) {
            setOpenExpandedRow(null);
        } else if (openExpandedRow !== null && openExpandedRow > index) {
            setOpenExpandedRow(openExpandedRow - 1);
        }
    };

    const updateBatchRow = (index: number, field: keyof BatchRow, value: any) => {
        setBatchRows(prev => prev.map((r, i) => {
            if (i !== index) return r;
            const updated = { ...r, [field]: value };
            
            // Automatic adjustment for measurement type
            if (field === 'measurementType') {
                if (value === 'numeric') {
                    if (!updated.unit || updated.unit === 'x') updated.unit = 'ml';
                    if (!updated.targetValue || updated.targetValue <= 1) updated.targetValue = 10;
                } else {
                    updated.unit = 'x';
                    updated.targetValue = 1;
                }
            }
            return updated;
        }));
    };

    const toggleDay = (rowIndex: number, day: number) => {
        const row = batchRows[rowIndex];
        const current = row.freqDays.length === 0 ? [...ALL_DAYS] : [...row.freqDays];
        const next = current.includes(day) ? current.filter(d => d !== day) : [...current, day].sort();
        const isAll = next.length === 7 || next.length === 0;
        updateBatchRow(rowIndex, 'freqDays', isAll ? [] : next);
        updateBatchRow(rowIndex, 'freqType', isAll ? 'daily' : 'weekly_days');
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
                                        {batchRows.length} {isIndo ? 'Habit' : 'Habits'}
                                    </span>
                                </h3>
                                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                    {isIndo ? 'Setiap habit memiliki konfigurasi mandiri (tipe, angka, target, jadwal & planner).' : 'Each habit has its own independent settings (type, metric, schedule & planner).'}
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

                    {/* Body: List of Independent Habit Cards */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-3.5 bg-slate-50/60 dark:bg-[#080b12]/60">
                        {batchRows.map((row, index) => {
                            const isExpanded = openExpandedRow === index;
                            const isNumeric = row.measurementType === 'numeric';
                            const dayLabels = isIndo ? DAY_LABELS_ID : DAY_LABELS_EN;

                            return (
                                <div 
                                    key={index} 
                                    className={`bg-white dark:bg-[#0f1117] rounded-2xl border-2 transition-all shadow-xs overflow-hidden ${
                                        isExpanded 
                                            ? 'border-indigo-500/50 dark:border-indigo-500/40 ring-2 ring-indigo-500/10' 
                                            : 'border-slate-200/90 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.12]'
                                    }`}
                                >
                                    {/* Card Header Line */}
                                    <div className="p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 bg-white dark:bg-[#0f1117]">
                                        {/* Number Badge */}
                                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 w-5 shrink-0 text-center">
                                            #{index + 1}
                                        </span>

                                        {/* Icon Picker */}
                                        <div className="relative shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setOpenBatchIconDropdown(openBatchIconDropdown === index ? null : index)}
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 border-slate-200 dark:border-white/[0.08] transition hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
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
                                                            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl text-lg transition flex items-center justify-center cursor-pointer"
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
                                                placeholder={isIndo ? 'Nama habit (cth: Minum 2L Air / Baca Buku)...' : 'Habit name (e.g. Read 20 pages)...'}
                                                className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03] font-bold text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 transition"
                                            />
                                        </div>

                                        {/* Summary Pill on collapsed state */}
                                        <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[10px] font-bold">
                                            <span className={`px-2 py-1 rounded-lg ${row.habitType === 'negative' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                                {row.habitType === 'negative' ? '🛡️ Quit' : '✨ Build'}
                                            </span>
                                            {isNumeric ? (
                                                <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                                                    🔢 {row.targetValue} {row.unit}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    ✓ Checkbox
                                                </span>
                                            )}
                                        </div>

                                        {/* Expand/Collapse Accordion Button */}
                                        <button
                                            type="button"
                                            onClick={() => setOpenExpandedRow(isExpanded ? null : index)}
                                            title={isExpanded ? (isIndo ? 'Tutup Pengaturan' : 'Collapse Settings') : (isIndo ? 'Buka Pengaturan Lengkap' : 'Expand Full Settings')}
                                            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition cursor-pointer ${
                                                isExpanded 
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-white/[0.03] dark:border-white/[0.07] hover:bg-slate-100 hover:text-slate-700'
                                            }`}
                                        >
                                            {isExpanded ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
                                        </button>

                                        {/* Delete Button */}
                                        {batchRows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBatchRow(index)}
                                                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 dark:border-rose-900/30 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 flex items-center justify-center transition cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Expanded Settings Panel (Full single habit configuration) */}
                                    {isExpanded && (
                                        <div className="p-4 bg-slate-50/80 dark:bg-[#12151f] border-t border-slate-200/80 dark:border-white/[0.06] space-y-3.5 animate-in slide-in-from-top-2 fade-in duration-150">
                                            
                                            {/* Row 1: Type, Measurement, Time of Day */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                {/* Habit Type */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Sparkles size={10} /> {isIndo ? 'Tipe Habit' : 'Habit Type'}
                                                    </label>
                                                    <select
                                                        value={row.habitType}
                                                        onChange={(e) => updateBatchRow(index, 'habitType', e.target.value as any)}
                                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                                    >
                                                        <option value="positive">✨ {isIndo ? 'Bangun Kebiasaan (+)' : 'Build Habit (+)'}</option>
                                                        <option value="negative">🛡️ {isIndo ? 'Hentikan Kebiasaan (-)' : 'Quit Habit (-)'}</option>
                                                    </select>
                                                </div>

                                                {/* Measurement Type */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Activity size={10} /> {isIndo ? 'Metode Pengukuran' : 'Measurement'}
                                                    </label>
                                                    <select
                                                        value={row.measurementType}
                                                        onChange={(e) => updateBatchRow(index, 'measurementType', e.target.value as any)}
                                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                                    >
                                                        <option value="boolean">✓ {isIndo ? 'Centang (Ya/Tidak)' : 'Checkbox'}</option>
                                                        <option value="numeric">🔢 {isIndo ? 'Kuantitatif (Angka)' : 'Quantitative (Numeric)'}</option>
                                                    </select>
                                                </div>

                                                {/* Time of Day */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Clock size={10} /> {isIndo ? 'Waktu Rutinitas' : 'Time of Day'}
                                                    </label>
                                                    <select
                                                        value={row.timeOfDay}
                                                        onChange={(e) => updateBatchRow(index, 'timeOfDay', e.target.value as any)}
                                                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                                    >
                                                        <option value="morning">🌅 {isIndo ? 'Pagi Hari' : 'Morning'}</option>
                                                        <option value="afternoon">☀️ {isIndo ? 'Siang Hari' : 'Afternoon'}</option>
                                                        <option value="evening">🌙 {isIndo ? 'Malam Hari' : 'Evening'}</option>
                                                        <option value="anytime">🔄 {isIndo ? 'Kapan Saja (Fleksibel)' : 'Anytime'}</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Row 2: Quantitative inputs (Target Angka Harian & Unit) if numeric */}
                                            {isNumeric && (
                                                <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-200/70 dark:border-indigo-500/20 space-y-2 animate-in fade-in duration-150">
                                                    <div className="flex items-center gap-1 text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                                                        <Hash size={11} />
                                                        <span>{isIndo ? 'Konfigurasi Target Kuantitatif' : 'Quantitative Target Configuration'}</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{isIndo ? 'Target Harian (Nilai/Angka)' : 'Daily Target Value'}</label>
                                                            <input
                                                                type="number"
                                                                value={row.targetValue || 10}
                                                                onChange={(e) => updateBatchRow(index, 'targetValue', Math.max(1, parseInt(e.target.value) || 1))}
                                                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-black text-slate-800 dark:text-slate-200 outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{isIndo ? 'Satuan / Unit' : 'Unit Label'}</label>
                                                            <input
                                                                type="text"
                                                                value={row.unit || 'ml'}
                                                                onChange={(e) => updateBatchRow(index, 'unit', e.target.value)}
                                                                placeholder="cth: gelas, menit, halaman, ml, km"
                                                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {POPULAR_UNITS.map(u => (
                                                            <button
                                                                key={u}
                                                                type="button"
                                                                onClick={() => updateBatchRow(index, 'unit', u)}
                                                                className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                                                                    row.unit === u 
                                                                        ? 'bg-indigo-600 text-white' 
                                                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                                                                }`}
                                                            >
                                                                {u}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Row 3: Monthly Target & Active Days */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                                                {/* Monthly Target */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <Target size={10} /> {isIndo ? 'Target Bulanan (Hari Aktif)' : 'Monthly Target (Days)'}
                                                    </label>
                                                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                                        <input 
                                                            type="number"
                                                            value={row.monthlyTarget}
                                                            onChange={(e) => updateBatchRow(index, 'monthlyTarget', Math.max(1, parseInt(e.target.value) || 1))}
                                                            className="w-12 bg-transparent text-xs font-black text-slate-900 dark:text-white outline-none"
                                                        />
                                                        <span className="text-[10px] font-bold text-slate-400">{isIndo ? 'hari / bulan' : 'days / month'}</span>
                                                    </div>
                                                </div>

                                                {/* Active Days Selection */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <CalendarDays size={10} /> {isIndo ? 'Jadwal Hari Aktif' : 'Active Days'}
                                                    </label>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {ALL_DAYS.map(day => {
                                                            const isActive = row.freqDays.length === 0 || row.freqDays.includes(day);
                                                            return (
                                                                <button
                                                                    key={day}
                                                                    type="button"
                                                                    onClick={() => toggleDay(index, day)}
                                                                    className={`w-7 h-7 rounded-lg text-[9px] font-black border transition cursor-pointer ${
                                                                        isActive 
                                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                                                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-indigo-300'
                                                                    }`}
                                                                >
                                                                    {dayLabels[day]}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 4: Planner Integration & Color Picker */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
                                                {/* Planner Integration */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                        <CalendarDays size={10} /> {isIndo ? 'Sinkron Daily Planner' : 'Planner Integration'}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateBatchRow(index, 'plannerIntegration', !row.plannerIntegration)}
                                                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                                            row.plannerIntegration 
                                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-300' 
                                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${row.plannerIntegration ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                            {row.plannerIntegration && <Check size={9} strokeWidth={4} />}
                                                        </div>
                                                        <span>{row.plannerIntegration ? (isIndo ? 'Aktif di Planner' : 'Active in Planner') : (isIndo ? 'Tidak Disinkron' : 'Disabled')}</span>
                                                    </button>

                                                    {/* Planner Times */}
                                                    {row.plannerIntegration && (
                                                        <div className="flex gap-2 pt-1 animate-in fade-in duration-150">
                                                            <div className="flex-1 flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
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
                                                                    className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                                                <span className="text-[9px] font-bold text-slate-400">{isIndo ? 'Selesai:' : 'End:'}</span>
                                                                <input
                                                                    type="time"
                                                                    value={row.plannerEndTime}
                                                                    onChange={(e) => updateBatchRow(index, 'plannerEndTime', e.target.value)}
                                                                    className="bg-transparent font-black text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Color Palette */}
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                        {isIndo ? 'Warna Tema Habit' : 'Theme Color'}
                                                    </label>
                                                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                                        {colorPalette.map(c => (
                                                            <button
                                                                key={c}
                                                                type="button"
                                                                onClick={() => updateBatchRow(index, 'color', c)}
                                                                className={`w-5 h-5 rounded-full transition cursor-pointer ${
                                                                    row.color === c 
                                                                        ? 'ring-2 ring-white dark:ring-slate-900 ring-offset-2 ring-offset-indigo-500 scale-110 shadow-sm' 
                                                                        : 'hover:scale-110 opacity-70 hover:opacity-100'
                                                                }`}
                                                                style={{ backgroundColor: c }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add Another Habit Row */}
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
                            onClick={onSubmit}
                            disabled={validRowsCount === 0}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            <Check size={15} strokeWidth={3} />
                            <span>
                                {isIndo 
                                    ? `Simpan Semua (${validRowsCount} Habit)` 
                                    : `Save All (${validRowsCount} Habits)`}
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
