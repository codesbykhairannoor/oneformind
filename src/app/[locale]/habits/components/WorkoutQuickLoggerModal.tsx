'use client';

import React, { useState } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Flame, Check, Dumbbell, Timer, Sparkles } from 'lucide-react';

interface WorkoutQuickLoggerModalProps {
    isOpen: boolean;
    isIndo: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const WORKOUT_TYPES = [
    { id: 'Push', labelId: 'Push (Dada, Bahu, Trisep)', labelEn: 'Push (Chest, Shoulders, Triceps)', icon: '💥' },
    { id: 'Pull', labelId: 'Pull (Punggung, Bisep)', labelEn: 'Pull (Back, Biceps)', icon: '🏋️' },
    { id: 'Legs', labelId: 'Legs (Paha, Betis, Core)', labelEn: 'Legs & Core', icon: '🦵' },
    { id: 'Cardio', labelId: 'Cardio / Lari / Sepeda', labelEn: 'Cardio / Run / Cycling', icon: '🏃' },
    { id: 'FullBody', labelId: 'Full Body Compound', labelEn: 'Full Body Compound', icon: '⚡' },
    { id: 'Yoga', labelId: 'Yoga & Mobilitas', labelEn: 'Yoga & Mobility', icon: '🧘' }
];

export default function WorkoutQuickLoggerModal({
    isOpen,
    isIndo,
    onClose,
    onSuccess
}: WorkoutQuickLoggerModalProps) {
    const todayStr = new Date().toISOString().split('T')[0];

    const [workoutType, setWorkoutType] = useState('Push');
    const [durationMinutes, setDurationMinutes] = useState(45);
    const [intensity, setIntensity] = useState<'moderate' | 'high' | 'light'>('high');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const currentPeriod = todayStr.substring(0, 7);
            const habitsRes = await fetch(`/api/habits?period=${currentPeriod}`);
            let habitsList = habitsRes.ok ? await habitsRes.json() : [];
            if (!Array.isArray(habitsList)) habitsList = [];

            // 1. Find or auto-create matching Gym/Workout habit
            let gymHabit = habitsList.find((h: any) => {
                let meta: any = {};
                if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
                    try { meta = JSON.parse(h.status); } catch {}
                } else if (h.status && typeof h.status === 'object') {
                    meta = h.status;
                }

                if (meta.syncedTabs && Array.isArray(meta.syncedTabs)) {
                    return meta.syncedTabs.includes('gym');
                }

                const name = (h.name || '').toLowerCase();
                return name.includes('gym') || name.includes('workout') || name.includes('olahraga') || 
                       name.includes('fitness') || name.includes('angkat beban') || name.includes('lari');
            });

            if (!gymHabit) {
                const createRes = await fetch('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: isIndo ? 'Gym & Workout Rutin' : 'Gym & Workout Routine',
                        icon: '🏋️',
                        color: '#f59e0b',
                        period: currentPeriod,
                        monthlyTarget: 16,
                        status: JSON.stringify({
                            frequencyType: 'weekly_days',
                            frequencyDays: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
                            timeOfDay: 'evening',
                            anchorCue: isIndo ? 'Setelah Selesai Kerja' : 'After Work Hours',
                            isKeystone: true,
                            syncedTabs: ['calendar', 'planner', 'gym']
                        })
                    })
                });
                if (createRes.ok) {
                    gymHabit = await createRes.json();
                }
            }

            // 2. Mark habit completed in habit_logs (Single Source of Truth)
            if (gymHabit && gymHabit.id) {
                await fetch(`/api/habits/${gymHabit.id}/logs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: todayStr,
                        status: 'completed',
                        notes: JSON.stringify({
                            type: workoutType,
                            duration: durationMinutes,
                            intensity,
                            exercises: notes.trim()
                        })
                    })
                });
            }

            // 3. Project occurrence into Calendar & Planner (Single event projection)
            try {
                await fetch('/api/calendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: `🏋️ Workout: ${workoutType} (${durationMinutes}m)`,
                        description: notes.trim() ? `Latihan: ${notes.trim()}\n<!--META:{"category":"health"}-->` : `Sesi latihan gym.\n<!--META:{"category":"health"}-->`,
                        type: 'health',
                        color: '#f59e0b',
                        startDate: todayStr,
                        endDate: todayStr,
                        isAllDay: false,
                        startTime: '1970-01-01T17:30:00.000Z',
                        endTime: '1970-01-01T18:30:00.000Z'
                    })
                });
            } catch (calErr) {
                console.error('Calendar projection notice:', calErr);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to log workout session:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                <div 
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20">
                                🏋️
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                    {isIndo ? 'Eksekusi Pilar Life OS' : 'Life OS Execution Pillar'}
                                </span>
                                <h3 className="text-base font-black text-slate-800 dark:text-white">
                                    {isIndo ? 'Catat Sesi Gym & Workout' : 'Log Workout Session'}
                                </h3>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                        
                        {/* Info Banner: Unified System Law */}
                        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                            <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="font-medium leading-relaxed">
                                {isIndo
                                    ? 'Satu data, dua tampilan. Sesi ini otomatis menuntaskan habit latihan hari ini, memajukan Goal terhubung, & masuk ke Calendar tanpa entri ganda.'
                                    : 'One data, multiple views. This session auto-completes today\'s workout habit, advances linked Goals, and projects onto Calendar.'}
                            </p>
                        </div>

                        {/* Workout Type Selector */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                {isIndo ? 'Pilih Fokus Sesi Latihan' : 'Select Session Focus'}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {WORKOUT_TYPES.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setWorkoutType(t.id)}
                                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                                            workoutType === t.id
                                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        <span className="text-xl">{t.icon}</span>
                                        <span className="text-xs font-black truncate">
                                            {isIndo ? t.labelId : t.labelEn}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration Presets */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                    <Timer size={13} />
                                    <span>{isIndo ? 'Durasi Latihan' : 'Duration'}</span>
                                </label>
                                <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">
                                    {durationMinutes} {isIndo ? 'Menit' : 'Mins'}
                                </span>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                                {[30, 45, 60, 75, 90].map(mins => (
                                    <button
                                        key={mins}
                                        type="button"
                                        onClick={() => setDurationMinutes(mins)}
                                        className={`py-2 rounded-xl text-xs font-black font-mono transition-all border ${
                                            durationMinutes === mins
                                                ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        {mins}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intensity Selector */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                <Flame size={13} />
                                <span>{isIndo ? 'Intensitas Sesi' : 'Session Intensity'}</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'light', labelId: 'Ringan (RPE 6)', labelEn: 'Light', color: 'emerald' },
                                    { id: 'moderate', labelId: 'Sedang (RPE 7-8)', labelEn: 'Moderate', color: 'indigo' },
                                    { id: 'high', labelId: 'Maksimal (RPE 9-10)', labelEn: 'Max High', color: 'rose' }
                                ].map(int => (
                                    <button
                                        key={int.id}
                                        type="button"
                                        onClick={() => setIntensity(int.id as any)}
                                        className={`py-2 px-2.5 rounded-xl border text-[11px] font-black transition-all ${
                                            intensity === int.id
                                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        {isIndo ? int.labelId : int.labelEn}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Exercises Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                                {isIndo ? 'Catatan Gerakan & Beban (Opsional)' : 'Exercise Notes & Weights (Optional)'}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder={isIndo ? 'Contoh: Bench press 70kg 4x8, Incline DB 24kg 3x10, Cable tricep...' : 'E.g.: Bench press 70kg 4x8, Incline dumbbell 24kg 3x10...'}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 transition"
                            >
                                {isIndo ? 'Batal' : 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Check size={14} strokeWidth={3} />
                                <span>{isSaving ? (isIndo ? 'Menyimpan...' : 'Saving...') : (isIndo ? 'Simpan & Tuntaskan Habit' : 'Save & Complete Habit')}</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
