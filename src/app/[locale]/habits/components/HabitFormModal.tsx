'use client';

import React from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Check, Trash2 } from 'lucide-react';
import HabitFormTypeMeasure from './HabitFormTypeMeasure';
import HabitFormSchedule from './HabitFormSchedule';

interface HabitFormModalProps {
    isOpen: boolean;
    editingHabitId: number | null;
    isIndo: boolean;
    monthNames: string[];
    selectedMonthIndex: number;
    selectedYear: number;
    currentMonthKey: string;
    daysInCurrentMonth: number;
    iconList: string[];
    colorPalette: string[];
    formName: string;
    setFormName: (v: string) => void;
    formIcon: string;
    setFormIcon: (v: string) => void;
    formColor: string;
    setFormColor: (v: string) => void;
    formTarget: number;
    setFormTarget: (v: number) => void;
    formType: 'positive' | 'negative';
    setFormType: (v: 'positive' | 'negative') => void;
    formMeasure: 'boolean' | 'numeric';
    setFormMeasure: (v: 'boolean' | 'numeric') => void;
    formUnit: string;
    setFormUnit: (v: string) => void;
    formTargetValue: number;
    setFormTargetValue: (v: number) => void;
    formFreqType: 'daily' | 'weekly_days';
    setFormFreqType: (v: 'daily' | 'weekly_days') => void;
    formFreqDays: number[];
    setFormFreqDays: (v: number[]) => void;
    formTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
    setFormTimeOfDay: (v: 'morning' | 'afternoon' | 'evening' | 'anytime') => void;
    onClose: () => void;
    onOpenBatch: () => void;
    onDelete: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function HabitFormModal({
    isOpen,
    editingHabitId,
    isIndo,
    monthNames,
    selectedMonthIndex,
    selectedYear,
    currentMonthKey,
    daysInCurrentMonth,
    iconList,
    colorPalette,
    formName,
    setFormName,
    formIcon,
    setFormIcon,
    formColor,
    setFormColor,
    formTarget,
    setFormTarget,
    formType,
    setFormType,
    formMeasure,
    setFormMeasure,
    formUnit,
    setFormUnit,
    formTargetValue,
    setFormTargetValue,
    formFreqType,
    setFormFreqType,
    formFreqDays,
    setFormFreqDays,
    formTimeOfDay,
    setFormTimeOfDay,
    onClose,
    onOpenBatch,
    onDelete,
    onSubmit
}: HabitFormModalProps) {
    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
                    
                    {/* Modal Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                                style={{ backgroundColor: `${formColor}15`, color: formColor }}
                            >
                                {formIcon}
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                                    {editingHabitId ? (isIndo ? 'Edit Habit' : 'Edit Habit') : (isIndo ? 'Tambah Habit Baru' : 'Create New Habit')}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? 'Atur target harian dan komitmen bulanan Anda' : 'Set your daily target and monthly commitment'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!editingHabitId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onOpenBatch();
                                    }}
                                    className="hidden sm:flex text-[10px] font-black px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition items-center gap-1 border border-indigo-100 dark:border-indigo-500/30"
                                >
                                    <span>⚡</span> Batch Mode
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
                        
                        {/* LIVE PREVIEW SUMMARY CARD */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/40 shadow-xs flex items-center gap-4">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                                style={{ backgroundColor: `${formColor}20`, color: formColor }}
                            >
                                {formIcon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                                        {formName.trim() ? formName : (isIndo ? 'Nama Habit Belum Diisi' : 'Habit Name Preview')}
                                    </h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                        formType === 'positive'
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border border-emerald-200/50'
                                            : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 border border-rose-200/50'
                                    }`}>
                                        {formType === 'positive' ? (isIndo ? '✨ Membangun' : '✨ Build') : (isIndo ? '🛡️ Bebas dari' : '🛡️ Quit')}
                                    </span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                    {formMeasure === 'numeric'
                                        ? `🎯 ${formTargetValue} ${formUnit} / ${isIndo ? 'hari' : 'day'} • `
                                        : `✓ ${isIndo ? 'Centang Harian' : 'Daily Check'} • `
                                    }
                                    {formFreqType === 'daily'
                                        ? `${isIndo ? 'Setiap Hari' : 'Every Day'} (${formTarget} ${isIndo ? 'hari/bulan' : 'days/mo'})`
                                        : `${formFreqDays.length}x / ${isIndo ? 'minggu' : 'week'} (${formTarget} ${isIndo ? 'hari aktif' : 'scheduled days'})`
                                    }
                                    {' • '}
                                    {formTimeOfDay === 'morning' ? '🌅 Pagi' : formTimeOfDay === 'afternoon' ? '☀️ Siang' : formTimeOfDay === 'evening' ? '🌙 Malam' : '🔄 Kapan Saja'}
                                </p>
                            </div>
                        </div>

                        {/* SECTION 1 & 4: TIPE KEBIASAAN & METODE PENGUKURAN */}
                        <HabitFormTypeMeasure
                            isIndo={isIndo}
                            formType={formType}
                            setFormType={setFormType}
                            formMeasure={formMeasure}
                            setFormMeasure={setFormMeasure}
                            formTargetValue={formTargetValue}
                            setFormTargetValue={setFormTargetValue}
                            formUnit={formUnit}
                            setFormUnit={setFormUnit}
                        />

                        {/* SECTION 2: NAMA HABIT */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                2. {isIndo ? 'Nama Kebiasaan' : 'Habit Name'}
                            </label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder={formType === 'positive' 
                                    ? (isIndo ? 'Misal: Minum Air 2000 ml, Meditasi Pagi 15 Menit...' : 'E.g., Drink 2000 ml water, Morning Meditation...') 
                                    : (isIndo ? 'Misal: Berhenti Merokok, No Sugar, Bebas Doomscrolling...' : 'E.g., No Smoking, Zero Sugar, No Doomscrolling...')}
                                className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition"
                                required
                            />
                        </div>

                        {/* SECTION 3: IKON & WARNA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    3. {isIndo ? 'Pilih Ikon' : 'Select Icon'}
                                </label>
                                <div className="grid grid-cols-6 gap-1.5 bg-white dark:bg-slate-950 p-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 max-h-28 overflow-y-auto custom-scrollbar">
                                    {iconList.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormIcon(icon)}
                                            className={`h-9 rounded-xl text-lg flex items-center justify-center transition ${
                                                formIcon === icon ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500 scale-105 shadow-xs' : 'opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    4. {isIndo ? 'Warna Label' : 'Label Color'}
                                </label>
                                <div className="flex flex-wrap gap-2.5 bg-white dark:bg-slate-950 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 items-center min-h-[58px]">
                                    {colorPalette.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setFormColor(c)}
                                            className={`w-7 h-7 rounded-full border-2 transition hover:scale-115 ${
                                                formColor === c ? 'ring-2 ring-indigo-500 border-white dark:border-slate-900 scale-110 shadow-sm' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5 & 6: JADWAL & WAKTU */}
                        <HabitFormSchedule
                            isIndo={isIndo}
                            daysInCurrentMonth={daysInCurrentMonth}
                            monthNames={monthNames}
                            selectedMonthIndex={selectedMonthIndex}
                            selectedYear={selectedYear}
                            currentMonthKey={currentMonthKey}
                            formTarget={formTarget}
                            setFormTarget={setFormTarget}
                            formFreqType={formFreqType}
                            setFormFreqType={setFormFreqType}
                            formFreqDays={formFreqDays}
                            setFormFreqDays={setFormFreqDays}
                            formTimeOfDay={formTimeOfDay}
                            setFormTimeOfDay={setFormTimeOfDay}
                        />

                    </form>

                    {/* Modal Footer */}
                    <div className="px-6 md:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
                        {editingHabitId ? (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition font-black text-xs flex items-center gap-1.5 border border-rose-100 dark:border-rose-500/20"
                            >
                                <Trash2 size={14} />
                                <span>{isIndo ? 'Hapus' : 'Delete'}</span>
                            </button>
                        ) : <div />}

                        <div className="flex items-center gap-2">
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
                                <span>{editingHabitId ? (isIndo ? 'Update Habit' : 'Update Habit') : (isIndo ? 'Simpan Habit' : 'Save Habit')}</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
