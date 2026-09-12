'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, Clock, Calendar, Sparkles, Check, ChevronRight } from 'lucide-react';

interface PlannerRoutineModalProps {
    show: boolean;
    onClose: () => void;
    selectedDate: string;
    onSuccess: () => void;
}

const ROUTINE_ICONS = ['🧘', '📚', '💻', '🏃', '💧', '🥗', '✍️', '🎯', '🌿', '🏋️', '🧠', '🎧'];
const ROUTINE_COLORS = ['#10b981', '#6366f1', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#14b8a6', '#f43f5e'];

export default function PlannerRoutineModal({
    show,
    onClose,
    selectedDate,
    onSuccess
}: PlannerRoutineModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🧘');
    const [color, setColor] = useState('#10b981');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('08:30');
    const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly_days'>('daily');
    const [frequencyDays, setFrequencyDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon - Fri default
    const [endDate, setEndDate] = useState<string>('');
    const [horizonPreset, setHorizonPreset] = useState<'forever' | 'month_end' | '3_months' | 'custom'>('forever');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!show) return null;

    const applyDuration = (mins: number) => {
        const [h, m] = startTime.split(':').map(Number);
        const total = h * 60 + m + mins;
        const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
        const endM = String(total % 60).padStart(2, '0');
        setEndTime(`${endH}:${endM}`);
    };

    const handleHorizonChange = (preset: 'forever' | 'month_end' | '3_months' | 'custom') => {
        setHorizonPreset(preset);
        const now = new Date(selectedDate || new Date());
        if (preset === 'forever') {
            setEndDate('');
        } else if (preset === 'month_end') {
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            setEndDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
        } else if (preset === '3_months') {
            const d = new Date(now);
            d.setDate(d.getDate() + 90);
            setEndDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError(isIndo ? 'Nama rutinitas wajib diisi' : 'Routine name is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const currentMonthKey = selectedDate.substring(0, 7);
        const meta = {
            habitType: 'positive',
            measurementType: 'boolean',
            unit: 'x',
            targetValue: 1,
            frequencyType,
            frequencyDays: frequencyType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : frequencyDays,
            timeOfDay: 'anytime',
            startTime: startTime.trim() || undefined,
            endTime: endTime.trim() || undefined,
            startDate: selectedDate,
            endDate: endDate.trim() || undefined,
            syncedTabs: ['planner', 'calendar']
        };

        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    icon,
                    color,
                    period: currentMonthKey,
                    monthlyTarget: frequencyType === 'daily' ? 30 : frequencyDays.length * 4,
                    status: JSON.stringify(meta)
                })
            });

            if (!res.ok) {
                throw new Error('Gagal menyimpan rutinitas');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || (isIndo ? 'Terjadi kesalahan saat menyimpan' : 'Failed to save routine'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 animate-in fade-in duration-200 backdrop-blur-sm overflow-y-auto">
                <div className="absolute inset-0" onClick={onClose} />

                <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[92vh]">
                    {/* Header */}
                    <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-slate-900 shrink-0">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-black/5 shrink-0"
                                style={{ backgroundColor: `${color}20`, color }}
                            >
                                {icon}
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 leading-snug">
                                    <span>{isIndo ? 'Jadwal Rutinitas & Habit' : 'Schedule Routine & Habit'}</span>
                                    <Sparkles size={14} className="text-emerald-500 fill-current" />
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold">
                                    {isIndo ? 'Otomatis di-plot ke timeline Planner & tersinkronisasi' : 'Auto-plotted on Planner Timeline & synced'}
                                </p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition active:scale-90"
                        >
                            <X size={15} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Body Form */}
                    <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
                        {error && (
                            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold">
                                {error}
                            </div>
                        )}

                        {/* 1. Nama Rutinitas */}
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                                {isIndo ? 'Nama Rutinitas / Habit' : 'Routine / Habit Name'}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={isIndo ? 'Contoh: Belajar Coding, Membaca Buku, Olahraga Pagi' : 'e.g. Learn Coding, Read Book, Morning Workout'}
                                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                                autoFocus
                            />
                        </div>

                        {/* Ikon & Warna Quick Selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                                    {isIndo ? 'Pilih Ikon' : 'Select Icon'}
                                </label>
                                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                                    {ROUTINE_ICONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setIcon(emoji)}
                                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition shrink-0 ${icon === emoji ? 'bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 scale-105' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                                    {isIndo ? 'Warna Aksen' : 'Accent Color'}
                                </label>
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                                    {ROUTINE_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            className={`w-6 h-6 rounded-full transition-transform shrink-0 ${color === c ? 'scale-125 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. WAKTU PELAKSANAAN (JAM MULAI & SELESAI) */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                                    <Clock size={13} className="text-emerald-500" />
                                    <span>{isIndo ? 'Waktu & Durasi di Timeline' : 'Time & Duration on Timeline'}</span>
                                </label>
                                <span className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                                    {startTime} - {endTime}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                    <span className="text-[9px] font-bold text-slate-400 block mb-1">{isIndo ? 'Jam Mulai' : 'Start Time'}</span>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => {
                                            setStartTime(e.target.value);
                                            if (e.target.value && !endTime) {
                                                const [h, m] = e.target.value.split(':').map(Number);
                                                const total = h * 60 + m + 30;
                                                const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
                                                const endM = String(total % 60).padStart(2, '0');
                                                setEndTime(`${endH}:${endM}`);
                                            }
                                        }}
                                        className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-slate-400 block mb-1">{isIndo ? 'Jam Selesai' : 'End Time'}</span>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Quick Duration Buttons */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="text-[9px] font-bold text-slate-400 shrink-0">{isIndo ? 'Durasi Cepat:' : 'Quick Duration:'}</span>
                                {[15, 30, 45, 60].map(mins => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => applyDuration(mins)}
                                        className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black hover:border-emerald-500 hover:text-emerald-600 transition"
                                    >
                                        +{mins}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. DI HARI APA SAJA (FREKUENSI PELAKSANAAN) */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                                    <Calendar size={13} className="text-indigo-500" />
                                    <span>{isIndo ? 'Di Hari Apa Saja' : 'Scheduled Days'}</span>
                                </label>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    {frequencyType === 'daily' ? (isIndo ? 'Setiap Hari (7 Hari)' : 'Every Day (7 Days)') : `${frequencyDays.length} ${isIndo ? 'Hari / Minggu' : 'Days / Wk'}`}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setFrequencyType('daily')}
                                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition border ${frequencyType === 'daily' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                                >
                                    {isIndo ? 'Setiap Hari' : 'Every Day'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFrequencyType('weekly_days');
                                        setFrequencyDays([1, 2, 3, 4, 5]);
                                    }}
                                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition border ${frequencyType === 'weekly_days' && JSON.stringify(frequencyDays) === JSON.stringify([1, 2, 3, 4, 5]) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                                >
                                    {isIndo ? 'Hari Kerja (Sen-Jum)' : 'Weekdays'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFrequencyType('weekly_days');
                                        setFrequencyDays([6, 0]);
                                    }}
                                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition border ${frequencyType === 'weekly_days' && JSON.stringify(frequencyDays) === JSON.stringify([6, 0]) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                                >
                                    {isIndo ? 'Akhir Pekan (Sab-Min)' : 'Weekends'}
                                </button>
                            </div>

                            {/* Specific Weekday Selector */}
                            <div className="grid grid-cols-7 gap-1 pt-1">
                                {[
                                    { day: 1, label: isIndo ? 'Sen' : 'Mon' },
                                    { day: 2, label: isIndo ? 'Sel' : 'Tue' },
                                    { day: 3, label: isIndo ? 'Rab' : 'Wed' },
                                    { day: 4, label: isIndo ? 'Kam' : 'Thu' },
                                    { day: 5, label: isIndo ? 'Jum' : 'Fri' },
                                    { day: 6, label: isIndo ? 'Sab' : 'Sat' },
                                    { day: 0, label: isIndo ? 'Min' : 'Sun' }
                                ].map(item => {
                                    const isSelected = frequencyType === 'daily' || frequencyDays.includes(item.day);
                                    return (
                                        <button
                                            key={item.day}
                                            type="button"
                                            onClick={() => {
                                                setFrequencyType('weekly_days');
                                                if (frequencyDays.includes(item.day)) {
                                                    setFrequencyDays(frequencyDays.filter(d => d !== item.day));
                                                } else {
                                                    setFrequencyDays([...frequencyDays, item.day]);
                                                }
                                            }}
                                            className={`h-9 rounded-xl text-xs font-black transition flex flex-col items-center justify-center border ${
                                                isSelected 
                                                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-xs' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                                            }`}
                                        >
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. SAMPAI KAPAN (RENTANG TANGGAL) */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                                    <Calendar size={13} className="text-teal-500" />
                                    <span>{isIndo ? 'Sampai Kapan (Rentang Tanggal)' : 'Schedule Horizon'}</span>
                                </label>
                                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                                    {endDate ? (isIndo ? `Sampai ${endDate}` : `Until ${endDate}`) : (isIndo ? 'Seterusnya' : 'Indefinitely')}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {[
                                    { key: 'forever' as const, label: isIndo ? 'Seterusnya' : 'Forever', desc: isIndo ? 'Tanpa batas' : 'No end' },
                                    { key: 'month_end' as const, label: isIndo ? 'Akhir Bulan' : 'End of Month', desc: isIndo ? 'Bulan ini' : 'This month' },
                                    { key: '3_months' as const, label: isIndo ? '3 Bulan' : '3 Months', desc: '+90 hari' },
                                    { key: 'custom' as const, label: isIndo ? 'Pilih Tanggal' : 'Pick Date', desc: endDate || (isIndo ? 'Pilih' : 'Choose') }
                                ].map(opt => (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        onClick={() => handleHorizonChange(opt.key)}
                                        className={`p-2 rounded-xl border text-left transition ${
                                            horizonPreset === opt.key 
                                                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs' 
                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
                                        }`}
                                    >
                                        <div className="text-[10px] font-black">{opt.label}</div>
                                        <div className="text-[8px] opacity-75 truncate">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>

                            {horizonPreset === 'custom' && (
                                <div className="pt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{isIndo ? 'Tanggal Selesai:' : 'End Date:'}</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="text-xs font-mono font-bold py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/20 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check size={16} strokeWidth={3} />
                                        <span>{isIndo ? 'Tambahkan ke Planner' : 'Add to Planner'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
