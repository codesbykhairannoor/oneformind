'use client';

import React, { useState, useEffect, useId } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { Plus, Minus, CheckCircle2, Sparkles, Percent, Hash, RotateCcw, FileText } from 'lucide-react';

interface HabitNumericPopoverProps {
    data: {
        habitId: number;
        habitName?: string;
        habitIcon?: string;
        habitColor?: string;
        dateStr: string;
        currentVal: number;
        targetVal: number;
        unit: string;
        currentNotes?: string;
    } | null;
    isIndo: boolean;
    onClose: () => void;
    onUpdate: (habitId: number, dateStr: string, newVal: number, note?: string) => void;
    onChangeVal?: (newVal: number) => void;
}

export default function HabitNumericPopover({
    data,
    isIndo,
    onClose,
    onUpdate,
    onChangeVal
}: HabitNumericPopoverProps) {
    if (!data) return null;

    const targetVal = Math.max(1, data.targetVal || 1);
    const unit = data.unit || 'x';
    const habitColor = data.habitColor || '#6366f1';
    const habitIcon = data.habitIcon || '🎯';
    const habitName = data.habitName || (isIndo ? 'Progres Kuantitatif' : 'Quantitative Habit');

    // Local states
    const [displayMode, setDisplayMode] = useState<'value' | 'percent'>('value');
    const [val, setVal] = useState<number>(Math.max(0, data.currentVal || 0));
    const [inputValue, setInputValue] = useState<string>(String(Math.max(0, data.currentVal || 0)));
    const [notes, setNotes] = useState<string>(data.currentNotes || '');
    const [showNotes, setShowNotes] = useState<boolean>(Boolean(data.currentNotes && data.currentNotes.trim().length > 0));

    // Calculate percentage from value with exact rounding
    const percent = Math.round((val / targetVal) * 100);
    const isCompleted = val >= targetVal;

    // Sync input string when mode or val changes
    useEffect(() => {
        if (displayMode === 'value') {
            setInputValue(String(val));
        } else {
            setInputValue(String(percent));
        }
    }, [displayMode]);

    // Adaptive step based on targetVal
    const step = targetVal <= 10 ? 1 : targetVal <= 50 ? 5 : targetVal <= 250 ? 10 : targetVal <= 1000 ? 50 : 100;
    const percentStep = 10;

    // Handle updating value
    const updateValue = (newVal: number) => {
        const clamped = Math.max(0, Math.round(newVal));
        setVal(clamped);
        if (displayMode === 'value') {
            setInputValue(String(clamped));
        } else {
            setInputValue(String(Math.round((clamped / targetVal) * 100)));
        }
        if (onChangeVal) {
            onChangeVal(clamped);
        }
    };

    // Handle direct input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
            if (displayMode === 'value') {
                const cleanVal = Math.max(0, Math.round(parsed));
                setVal(cleanVal);
                if (onChangeVal) onChangeVal(cleanVal);
            } else {
                // Percentage mode: calculate value from percentage
                const cleanPct = Math.max(0, parsed);
                const calculatedVal = Math.max(0, Math.round((cleanPct / 100) * targetVal));
                setVal(calculatedVal);
                if (onChangeVal) onChangeVal(calculatedVal);
            }
        }
    };

    // Quick percentage preset selector (25%, 50%, 75%, 100%, 125%)
    const applyPercentagePreset = (pct: number) => {
        const calculatedVal = Math.round((pct / 100) * targetVal);
        updateValue(calculatedVal);
    };

    // Increment / Decrement
    const handleIncrement = () => {
        if (displayMode === 'value') {
            updateValue(val + step);
        } else {
            const nextPct = percent + percentStep;
            updateValue(Math.round((nextPct / 100) * targetVal));
        }
    };

    const handleDecrement = () => {
        if (displayMode === 'value') {
            updateValue(Math.max(0, val - step));
        } else {
            const nextPct = Math.max(0, percent - percentStep);
            updateValue(Math.round((nextPct / 100) * targetVal));
        }
    };

    // Date formatting
    const formatDate = (dateString: string) => {
        try {
            const [y, m, d] = dateString.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            return date.toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        onUpdate(data.habitId, data.dateStr, val, notes);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
                    onClick={onClose} 
                />

                {/* Popover Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.2rem] p-6 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200">
                    
                    {/* Header: Habit Icon + Title + Date */}
                    <div className="flex items-center gap-3 text-left mb-4">
                        <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform"
                            style={{ 
                                backgroundColor: `${habitColor}18`, 
                                color: habitColor,
                                border: `1.5px solid ${habitColor}35`
                            }}
                        >
                            {habitIcon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                                {habitName}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-bold text-slate-400">
                                <span>{formatDate(data.dateStr)}</span>
                                <span>•</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                                    Target: {targetVal} {unit}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mode Segmented Toggle: [ Angka | Persentase ] */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl flex items-center gap-1 mb-4 border border-slate-200/50 dark:border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => setDisplayMode('value')}
                            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                                displayMode === 'value'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Hash size={13} className={displayMode === 'value' ? 'text-indigo-500' : ''} />
                            <span>{isIndo ? `Nilai (${unit})` : `Value (${unit})`}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setDisplayMode('percent')}
                            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                                displayMode === 'percent'
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Percent size={13} className={displayMode === 'percent' ? 'text-indigo-500' : ''} />
                            <span>{isIndo ? 'Persentase (%)' : 'Percentage (%)'}</span>
                        </button>
                    </div>

                    {/* Main Input Control */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80 mb-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            {/* Decrement Button */}
                            <button
                                type="button"
                                onClick={handleDecrement}
                                disabled={val <= 0}
                                aria-label="Decrease value"
                                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/80 dark:border-slate-800 font-black text-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition active:scale-90"
                            >
                                <Minus size={18} strokeWidth={3} />
                            </button>

                            {/* Center Input Box (No ugly browser spinners) */}
                            <div className="relative flex-1 flex flex-col items-center justify-center">
                                <div className="flex items-baseline justify-center gap-1">
                                    <input
                                        type="number"
                                        min="0"
                                        step={displayMode === 'value' ? step : percentStep}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit();
                                            if (e.key === 'Escape') onClose();
                                        }}
                                        className="w-28 text-center font-black text-4xl bg-transparent text-slate-900 dark:text-white outline-none focus:ring-0 tracking-tight [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        autoFocus
                                    />
                                    <span className="text-sm font-black text-slate-400 dark:text-slate-500">
                                        {displayMode === 'value' ? unit : '%'}
                                    </span>
                                </div>

                                {/* Live Synchronized Dual-Mode Subtitle */}
                                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                                    {displayMode === 'value' ? (
                                        <span>
                                            ≈ <strong className="text-indigo-600 dark:text-indigo-400">{percent}%</strong> {isIndo ? 'dari target' : 'of target'}
                                        </span>
                                    ) : (
                                        <span>
                                            ≈ <strong className="text-indigo-600 dark:text-indigo-400">{val} {unit}</strong> {isIndo ? 'dari' : 'of'} {targetVal} {unit}
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Increment Button */}
                            <button
                                type="button"
                                onClick={handleIncrement}
                                aria-label="Increase value"
                                className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/80 dark:border-slate-800 font-black text-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-90"
                            >
                                <Plus size={18} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Progress Bar & Visual Feedback */}
                        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 mb-1.5">
                                <span>{isIndo ? 'Progres' : 'Progress'}</span>
                                <span className={isCompleted ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-indigo-600 dark:text-indigo-400'}>
                                    {val} / {targetVal} {unit} ({percent}%)
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 rounded-full ${
                                        isCompleted 
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                                            : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                                    }`}
                                    style={{ width: `${Math.min(100, percent)}%` }}
                                />
                            </div>

                            {/* Celebratory Badge when Target Reached */}
                            {isCompleted && (
                                <div className="mt-2.5 py-1 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center justify-center gap-1 animate-in zoom-in-95">
                                    <Sparkles size={12} className="text-emerald-500 animate-pulse" />
                                    <span>{isIndo ? 'Target Tercapai!' : 'Target Achieved!'}</span>
                                    <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400 ml-0.5" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Percentage Chips (25%, 50%, 75%, 100%, 125%) */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5 px-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {isIndo ? 'Pintasan Cepat' : 'Quick Presets'}
                            </span>
                            <button
                                type="button"
                                onClick={() => updateValue(0)}
                                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-0.5 transition"
                            >
                                <RotateCcw size={10} />
                                <span>{isIndo ? 'Reset 0' : 'Clear 0'}</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[25, 50, 75, 100, 125].map(pct => {
                                const targetPresetVal = Math.round((pct / 100) * targetVal);
                                const isSelected = val === targetPresetVal;
                                return (
                                    <button
                                        key={pct}
                                        type="button"
                                        onClick={() => applyPercentagePreset(pct)}
                                        className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all flex flex-col items-center justify-center ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none scale-105'
                                                : pct === 100
                                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/30 hover:bg-indigo-100'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <span>{pct}%</span>
                                        <span className={`text-[8px] font-medium opacity-70 truncate max-w-full ${isSelected ? 'text-white' : ''}`}>
                                            {targetPresetVal}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Micro-Note Reflection Field (Expandable) */}
                    <div className="mb-5 text-left">
                        {!showNotes ? (
                            <button
                                type="button"
                                onClick={() => setShowNotes(true)}
                                className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
                            >
                                <FileText size={12} />
                                <span>{isIndo ? '+ Tambah Catatan Harian' : '+ Add Daily Micro-Note'}</span>
                            </button>
                        ) : (
                            <div className="space-y-1 animate-in fade-in duration-150">
                                <label className="text-[10px] font-black text-slate-400 flex items-center justify-between">
                                    <span>{isIndo ? 'Catatan Refleksi (Opsional)' : 'Reflection Note (Optional)'}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => { setNotes(''); setShowNotes(false); }}
                                        className="text-slate-400 hover:text-slate-600 text-[9px]"
                                    >
                                        {isIndo ? 'Tutup' : 'Close'}
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={isIndo ? 'cth: 2 botol dingin setelah gym' : 'e.g., 2 bottles after workout'}
                                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons: Cancel / Save */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            className="flex-1 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition active:scale-95 flex items-center justify-center gap-1.5"
                        >
                            <span>{isIndo ? 'Simpan Progres' : 'Save Progress'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
