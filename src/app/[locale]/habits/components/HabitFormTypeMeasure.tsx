'use client';

import React from 'react';

interface HabitFormTypeMeasureProps {
    isIndo: boolean;
    formType: 'positive' | 'negative';
    setFormType: (v: 'positive' | 'negative') => void;
    formMeasure: 'boolean' | 'numeric';
    setFormMeasure: (v: 'boolean' | 'numeric') => void;
    formTargetValue: number;
    setFormTargetValue: (v: number) => void;
    formUnit: string;
    setFormUnit: (v: string) => void;
}

export default function HabitFormTypeMeasure({
    isIndo,
    formType,
    setFormType,
    formMeasure,
    setFormMeasure,
    formTargetValue,
    setFormTargetValue,
    formUnit,
    setFormUnit
}: HabitFormTypeMeasureProps) {
    return (
        <div className="space-y-6">
            {/* SECTION 1: TIPE KEBIASAAN */}
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    1. {isIndo ? 'Tipe Kebiasaan' : 'Habit Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormType('positive')}
                        className={`p-3.5 rounded-2xl text-left transition-all border-2 flex flex-col justify-between ${
                            formType === 'positive'
                                ? 'bg-indigo-50/70 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">✨</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Membangun Kebiasaan (+)' : 'Build Positive (+)'}
                            </span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">
                            {isIndo ? 'Aktivitas rutin positif (Olahraga, Minum Air, Belajar)' : 'Positive habits you want to accomplish'}
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setFormType('negative')}
                        className={`p-3.5 rounded-2xl text-left transition-all border-2 flex flex-col justify-between ${
                            formType === 'negative'
                                ? 'bg-rose-50/70 dark:bg-rose-500/10 border-rose-600 dark:border-rose-500 shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🛡️</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Hentikan Kebiasaan (Quit)' : 'Quit Bad Habit (Avoid)'}
                            </span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">
                            {isIndo ? 'Hindari hal negatif (Stop Merokok, No Sugar)' : 'Negative habits you want to eliminate'}
                        </p>
                    </button>
                </div>
            </div>

            {/* SECTION 4: METODE PENGUKURAN */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {isIndo ? 'Metode Pengukuran Harian' : 'Daily Measurement'}
                    </label>
                    <span className="text-[10px] font-bold text-indigo-500">
                        {formMeasure === 'boolean' ? (isIndo ? 'Mode Centang' : 'Checkmark Mode') : (isIndo ? 'Mode Angka & Satuan' : 'Quantity Mode')}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => setFormMeasure('boolean')}
                        className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                            formMeasure === 'boolean'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        <span>✓</span> {isIndo ? 'Centang (Ya / Tidak)' : 'Checkmark (Yes / No)'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormMeasure('numeric')}
                        className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                            formMeasure === 'numeric'
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                        <span>🔢</span> {isIndo ? 'Kuantitatif (Angka & Satuan)' : 'Quantitative (Number & Unit)'}
                    </button>
                </div>

                {/* Numeric Inputs with 100% High Contrast */}
                {formMeasure === 'numeric' && (
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                                {isIndo ? 'Target Jumlah per Hari' : 'Target Value per Day'}
                            </label>
                            <input
                                type="number"
                                value={formTargetValue}
                                onChange={(e) => setFormTargetValue(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-base outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition"
                                placeholder="2000"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
                                {isIndo ? 'Satuan Pengukuran' : 'Measurement Unit'}
                            </label>
                            <select
                                value={formUnit}
                                onChange={(e) => setFormUnit(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition cursor-pointer"
                            >
                                <option value="ml" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">ml (Air / Minuman)</option>
                                <option value="halaman" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Halaman (Buku)</option>
                                <option value="menit" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Menit (Durasi / Meditasi)</option>
                                <option value="km" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">km (Lari / Bersepeda)</option>
                                <option value="reps" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Reps (Push Up / Gym)</option>
                                <option value="gelas" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Gelas (Air)</option>
                                <option value="langkah" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Langkah (Walking)</option>
                                <option value="x" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">Kali (Frekuensi)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
