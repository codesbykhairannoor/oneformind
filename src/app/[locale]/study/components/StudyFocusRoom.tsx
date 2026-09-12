'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { 
    Play, Pause, RotateCcw, Volume2, VolumeX, 
    Sparkles, Flame, CheckCircle2, Coffee, BookOpen,
    CloudRain, Waves, Wind, Radio, Award
} from 'lucide-react';
import { CourseRecord } from './CourseCard';

interface StudyFocusRoomProps {
    courses: CourseRecord[];
    terms: Record<string, string>;
    focusStats?: { completedSessions: number; totalFocusMinutes: number };
    onSaveFocusStats?: (stats: { completedSessions: number; totalFocusMinutes: number }) => void;
}

type TimerMode = 'focus' | 'short_break' | 'long_break';
type SoundscapeType = 'rain' | 'waves' | 'cafe' | 'whitenoise' | 'none';

export default function StudyFocusRoom({ 
    courses, 
    terms,
    focusStats = { completedSessions: 0, totalFocusMinutes: 0 },
    onSaveFocusStats
}: StudyFocusRoomProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Timer settings (in seconds)
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.course_name || (isIndo ? 'Mata Kuliah' : 'Course'));

    // Stats
    const completedSessions = focusStats.completedSessions || 0;
    const totalFocusMinutes = focusStats.totalFocusMinutes || 0;

    // Ambient sound synthesizer state
    const [activeSound, setActiveSound] = useState<SoundscapeType>('none');
    const [soundVolume, setSoundVolume] = useState(0.5);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const soundNodesRef = useRef<{ source?: AudioNode; gain?: GainNode; filter?: BiquadFilterNode } | null>(null);

    // Mode durations
    const durations: Record<TimerMode, number> = {
        focus: 25 * 60,
        short_break: 5 * 60,
        long_break: 15 * 60
    };

    // Switch mode
    const handleSwitchMode = (newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(durations[newMode]);
        setIsRunning(false);
    };

    // Auto-completed habit feedback notice
    const [completedHabitNotice, setCompletedHabitNotice] = useState<string | null>(null);

    const triggerHabitAutoCompletion = async () => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const periodStr = todayStr.substring(0, 7);
            const res = await fetch(`/api/habits?period=${periodStr}`);
            if (!res.ok) return;
            const habits = await res.json();
            if (!Array.isArray(habits)) return;

            const studyHabit = habits.find((h: any) => {
                let meta: any = {};
                if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
                    try { meta = JSON.parse(h.status); } catch {}
                } else if (h.status && typeof h.status === 'object') {
                    meta = h.status;
                }

                if (meta.syncedTabs && Array.isArray(meta.syncedTabs)) {
                    return meta.syncedTabs.includes('study');
                }

                const name = (h.name || '').toLowerCase();
                return name.includes('belajar') || name.includes('study') || name.includes('baca') || 
                       name.includes('read') || name.includes('kuliah') || name.includes('fokus') || 
                       name.includes('coding') || name.includes('matkul');
            });

            if (studyHabit) {
                await fetch(`/api/habits/${studyHabit.id}/logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: todayStr,
                        status: 'completed'
                    })
                });
                setCompletedHabitNotice(studyHabit.name);
                setTimeout(() => setCompletedHabitNotice(null), 7000);
            }
        } catch (e) {
            console.error('Failed to auto-complete study habit:', e);
        }
    };

    // Timer Countdown logic
    useEffect(() => {
        let interval: any = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            // Timer completed
            setIsRunning(false);
            playBeep();
            if (mode === 'focus') {
                const updated = {
                    completedSessions: completedSessions + 1,
                    totalFocusMinutes: totalFocusMinutes + 25
                };
                onSaveFocusStats?.(updated);
                triggerHabitAutoCompletion();
                setMode('short_break');
                setTimeLeft(durations.short_break);
            } else {
                setMode('focus');
                setTimeLeft(durations.focus);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode, completedSessions, totalFocusMinutes, onSaveFocusStats]);

    // Web Audio Synthesizer Beep
    const playBeep = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch (e) {
            console.error(e);
        }
    };

    // Ambient Noise Synthesizer (Zero external file dependencies)
    const stopSound = () => {
        if (soundNodesRef.current?.source) {
            try {
                (soundNodesRef.current.source as any).stop?.();
                soundNodesRef.current.source.disconnect();
            } catch (e) {}
            soundNodesRef.current = null;
        }
        setActiveSound('none');
    };

    const startSound = (type: SoundscapeType) => {
        stopSound();
        if (type === 'none') return;

        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            // Generate 5-second buffer of noise
            const bufferSize = ctx.sampleRate * 4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);

            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                if (type === 'rain' || type === 'waves') {
                    // Pinkish / brown noise
                    lastOut = (lastOut + (0.02 * white)) / 1.02;
                    data[i] = lastOut * 3.5;
                } else if (type === 'cafe') {
                    // Soft murmur noise
                    lastOut = (lastOut + (0.05 * white)) / 1.05;
                    data[i] = lastOut * 2.0;
                } else {
                    // White noise
                    data[i] = white * 0.3;
                }
            }

            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = buffer;
            noiseSource.loop = true;

            const filter = ctx.createBiquadFilter();
            if (type === 'rain') {
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, ctx.currentTime);
            } else if (type === 'waves') {
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(450, ctx.currentTime);
            } else if (type === 'cafe') {
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(500, ctx.currentTime);
            } else {
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, ctx.currentTime);
            }

            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(soundVolume * 0.3, ctx.currentTime);

            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            noiseSource.start();
            soundNodesRef.current = { source: noiseSource, gain: gainNode, filter };
            setActiveSound(type);
        } catch (err) {
            console.error('Audio synthesizer error:', err);
        }
    };

    // Adjust volume
    const handleVolumeChange = (vol: number) => {
        setSoundVolume(vol);
        if (soundNodesRef.current?.gain && audioCtxRef.current) {
            soundNodesRef.current.gain.gain.setValueAtTime(vol * 0.3, audioCtxRef.current.currentTime);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            stopSound();
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const progressPct = ((durations[mode] - timeLeft) / durations[mode]) * 100;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Main Pomodoro Room */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Main Glassmorphic Timer Card */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center">
                    
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    {/* Mode Selector Tabs */}
                    <div className="relative z-10 flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-3xl mb-8">
                        <button
                            type="button"
                            onClick={() => handleSwitchMode('focus')}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                                mode === 'focus'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {isIndo ? '🎯 Fokus (25m)' : '🎯 Focus (25m)'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSwitchMode('short_break')}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                                mode === 'short_break'
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {isIndo ? '☕ Istirahat (5m)' : '☕ Short Break (5m)'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSwitchMode('long_break')}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                                mode === 'long_break'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {isIndo ? '🌿 Rehat (15m)' : '🌿 Long Break (15m)'}
                        </button>
                    </div>

                    {/* Cross-Module Life OS: Habit Auto-Completion Celebration */}
                    {completedHabitNotice && (
                        <div className="relative z-10 mb-4 px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-700 dark:text-emerald-300 animate-in fade-in slide-in-from-top-2 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <span className="text-base">🎉</span>
                                <p className="text-xs font-bold text-left">
                                    {isIndo 
                                        ? `Sesi fokus tuntas! Kebiasaan "${completedHabitNotice}" otomatis tercatat selesai hari ini.` 
                                        : `Focus session finished! Habit "${completedHabitNotice}" marked completed today.`}
                                </p>
                            </div>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white shrink-0">
                                {isIndo ? 'Satu Data OS' : 'Unified OS'}
                            </span>
                        </div>
                    )}

                    {/* Active Subject Pill */}
                    <div className="relative z-10 mb-6 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        <BookOpen size={13} className="text-indigo-500" />
                        <span>{isIndo ? 'Fokus Matakuliah:' : 'Focusing on:'}</span>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="bg-transparent font-black underline decoration-indigo-400 outline-none cursor-pointer"
                        >
                            {courses.map(c => (
                                <option key={c.id} value={c.course_name} className="text-slate-900 dark:text-slate-900">
                                    {c.course_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Digital Countdown Timer Display */}
                    <div className="relative z-10 my-4">
                        <h1 className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-slate-900 dark:text-white tabular-nums drop-shadow-sm">
                            {formatTime(timeLeft)}
                        </h1>
                    </div>

                    {/* Progress Line */}
                    <div className="relative z-10 w-full max-w-md h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-8">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progressPct}%` }}
                        ></div>
                    </div>

                    {/* Control Buttons */}
                    <div className="relative z-10 flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                setTimeLeft(durations[mode]);
                                setIsRunning(false);
                            }}
                            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition active:scale-90"
                            title={isIndo ? 'Reset Timer' : 'Reset'}
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsRunning(!isRunning)}
                            className={`px-8 sm:px-10 py-4 rounded-[2rem] font-black text-sm tracking-widest uppercase transition-all shadow-xl active:scale-95 flex items-center gap-3 ${
                                isRunning
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
                            }`}
                        >
                            {isRunning ? (
                                <>
                                    <Pause size={18} />
                                    <span>{isIndo ? 'Jeda' : 'Pause'}</span>
                                </>
                            ) : (
                                <>
                                    <Play size={18} className="fill-current" />
                                    <span>{isIndo ? 'Mulai Belajar' : 'Start Focus'}</span>
                                </>
                            )}
                        </button>

                        {mode === 'focus' && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRunning(false);
                                    playBeep();
                                    const updated = {
                                        completedSessions: completedSessions + 1,
                                        totalFocusMinutes: totalFocusMinutes + 25
                                    };
                                    onSaveFocusStats?.(updated);
                                    triggerHabitAutoCompletion();
                                    setMode('short_break');
                                    setTimeLeft(durations.short_break);
                                }}
                                className="px-4 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-black text-xs transition active:scale-95 flex items-center gap-1.5"
                                title={isIndo ? 'Tuntaskan Sesi & Simpan Habit' : 'Finish Session & Mark Habit'}
                            >
                                <CheckCircle2 size={16} />
                                <span className="hidden sm:inline">{isIndo ? 'Tuntas & Sync' : 'Finish & Sync'}</span>
                            </button>
                        )}
                    </div>

                </div>

            </div>

            {/* Right 1 Col: Ambient Soundscapes & Study Session Log */}
            <div className="space-y-6">
                
                {/* Lo-Fi Ambient Sound Synthesizer */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Radio size={16} className="text-indigo-500 animate-pulse" />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Suasana Fokus Lo-Fi' : 'Lo-Fi Ambient Noise'}
                            </h4>
                        </div>
                        {activeSound !== 'none' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                                {isIndo ? 'Memutar' : 'Playing'}
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {isIndo 
                            ? 'Audio sintetis browser tanpa buffering untuk memblokir distraksi ruangan.' 
                            : 'Real-time noise generator to mask ambient room distractions.'}
                    </p>

                    {/* Soundscape Buttons */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => startSound(activeSound === 'rain' ? 'none' : 'rain')}
                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition ${
                                activeSound === 'rain'
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            <CloudRain size={16} className="text-indigo-500" />
                            <span className="text-xs font-black">{isIndo ? 'Hujan Tenang' : 'Gentle Rain'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => startSound(activeSound === 'waves' ? 'none' : 'waves')}
                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition ${
                                activeSound === 'waves'
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            <Waves size={16} className="text-cyan-500" />
                            <span className="text-xs font-black">{isIndo ? 'Ombak Dalam' : 'Deep Ocean'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => startSound(activeSound === 'cafe' ? 'none' : 'cafe')}
                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition ${
                                activeSound === 'cafe'
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            <Coffee size={16} className="text-amber-500" />
                            <span className="text-xs font-black">{isIndo ? 'Cafe Cozy' : 'Cozy Cafe'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => startSound(activeSound === 'whitenoise' ? 'none' : 'whitenoise')}
                            className={`p-3 rounded-2xl border text-left flex flex-col gap-1.5 transition ${
                                activeSound === 'whitenoise'
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            <Wind size={16} className="text-purple-500" />
                            <span className="text-xs font-black">{isIndo ? 'White Noise' : 'White Noise'}</span>
                        </button>
                    </div>

                    {/* Volume Slider */}
                    {activeSound !== 'none' && (
                        <div className="pt-2 flex items-center gap-3">
                            <Volume2 size={16} className="text-slate-400 shrink-0" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={soundVolume}
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                {/* Session Tracker Summary */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-[2.5rem] p-6 sm:p-7 shadow-xl shadow-indigo-500/20 space-y-4">
                    <div className="flex items-center gap-2">
                        <Flame size={18} className="text-amber-300" />
                        <h4 className="text-sm font-black tracking-wide uppercase">
                            {isIndo ? 'Pencapaian Hari Ini' : 'Today\'s Momentum'}
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                            <span className="text-[10px] font-black uppercase text-indigo-200 block">
                                {isIndo ? 'Sesi Selesai' : 'Sessions Done'}
                            </span>
                            <span className="text-2xl font-black font-mono mt-0.5 block">
                                {completedSessions}
                            </span>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                            <span className="text-[10px] font-black uppercase text-indigo-200 block">
                                {isIndo ? 'Total Menit' : 'Deep Work'}
                            </span>
                            <span className="text-2xl font-black font-mono mt-0.5 block">
                                {totalFocusMinutes}m
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-indigo-100/80 leading-relaxed italic pt-1">
                        &ldquo;{isIndo 
                            ? 'Fokus konsisten 25 menit per sesi melatih pemahaman mendalam lebih efektif daripada belajar kebut semalam.' 
                            : 'Consistent 25-minute sprints produce deeper neuroplastic retention than all-night cramming.'}&rdquo;
                    </p>
                </div>

            </div>

        </div>
    );
}
