'use client';

import { useState, useEffect, useRef } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Play, Pause, RotateCcw, Check, Sparkles, Plus } from 'lucide-react';
import { playTriumphSound, triggerConfetti } from '@/lib/habitAudio';
import { HabitItem } from '../types';

interface HabitTimerModalProps {
    habit: HabitItem | null;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (habitId: number, durationMinutes: number) => void;
    locale: string;
}

export default function HabitTimerModal({ habit, isOpen, onClose, onComplete, locale }: HabitTimerModalProps) {
    if (!isOpen || !habit) return null;

    const isIndo = locale === 'id';
    
    // Default duration: if targetValue exists and unit is min/menit, use targetValue, else default to 15 minutes
    const defaultMinutes = habit.unit === 'min' || habit.unit === 'menit' 
        ? (habit.targetValue || 15) 
        : 15;

    const [targetDuration, setTargetDuration] = useState(defaultMinutes * 60); // seconds
    const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const initialSecs = defaultMinutes * 60;
        setTargetDuration(initialSecs);
        setSecondsLeft(initialSecs);
        setIsActive(false);
        setIsFinished(false);
    }, [habit, defaultMinutes]);

    // Timer Interval
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && secondsLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
            playTriumphSound();
            triggerConfetti();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, secondsLeft]);

    const togglePlay = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setSecondsLeft(targetDuration);
        setIsFinished(false);
    };

    const addMinutes = (mins: number) => {
        const extraSecs = mins * 60;
        setTargetDuration(prev => prev + extraSecs);
        setSecondsLeft(prev => prev + extraSecs);
    };

    const handleClaimComplete = () => {
        const completedMinutes = Math.round((targetDuration - secondsLeft) / 60) || defaultMinutes;
        onComplete(habit.id, completedMinutes);
        onClose();
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const progressPct = targetDuration > 0 ? Math.round(((targetDuration - secondsLeft) / targetDuration) * 100) : 0;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col items-center text-center overflow-hidden">
                    
                    {/* Header */}
                    <div className="w-full flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{habit.icon}</span>
                            <div className="text-left">
                                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                                    {habit.name}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? 'Sesi Fokus Berwaktu' : 'Timed Focus Session'}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={onClose} 
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Circular Timer Ring */}
                    <div className="relative w-56 h-56 my-6 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="44"
                                fill="none"
                                className="stroke-slate-100 dark:stroke-slate-800"
                                strokeWidth="6"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="44"
                                fill="none"
                                stroke={habit.color || '#6366f1'}
                                strokeWidth="6"
                                strokeLinecap="round"
                                style={{
                                    strokeDasharray: '276.46',
                                    strokeDashoffset: `${276.46 * (1 - progressPct / 100)}`,
                                    transition: 'stroke-dashoffset 0.5s ease'
                                }}
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                                {formatTime(secondsLeft)}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                {isFinished ? (isIndo ? '🎉 Selesai!' : '🎉 Done!') : isActive ? (isIndo ? 'Fokus Berjalan' : 'In Progress') : (isIndo ? 'Siap Mulai' : 'Ready')}
                            </span>
                        </div>
                    </div>

                    {/* Quick Add Minutes Pills */}
                    {!isFinished && (
                        <div className="flex items-center gap-2 mb-6">
                            <button
                                onClick={() => addMinutes(1)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
                            >
                                <Plus size={12} /> 1 {isIndo ? 'mnt' : 'min'}
                            </button>
                            <button
                                onClick={() => addMinutes(5)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
                            >
                                <Plus size={12} /> 5 {isIndo ? 'mnt' : 'min'}
                            </button>
                            <button
                                onClick={() => addMinutes(15)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
                            >
                                <Plus size={12} /> 15 {isIndo ? 'mnt' : 'min'}
                            </button>
                        </div>
                    )}

                    {/* Main Action Buttons */}
                    <div className="w-full flex items-center gap-3">
                        <button
                            onClick={resetTimer}
                            className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition shrink-0"
                            title={isIndo ? 'Reset Waktu' : 'Reset Timer'}
                        >
                            <RotateCcw size={18} />
                        </button>

                        {isFinished ? (
                            <button
                                onClick={handleClaimComplete}
                                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 animate-bounce"
                            >
                                <Check size={18} strokeWidth={3} />
                                <span>{isIndo ? 'Catat Habit Selesai' : 'Log Habit Completed'}</span>
                            </button>
                        ) : (
                            <button
                                onClick={togglePlay}
                                className="flex-1 py-4 text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
                                style={{ backgroundColor: habit.color || '#6366f1' }}
                            >
                                {isActive ? (
                                    <>
                                        <Pause size={18} />
                                        <span>{isIndo ? 'Jeda' : 'Pause'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={18} fill="currentColor" />
                                        <span>{isIndo ? 'Mulai Fokus' : 'Start Focus'}</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
