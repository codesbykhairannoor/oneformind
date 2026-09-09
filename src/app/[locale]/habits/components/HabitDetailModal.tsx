'use client';

import { useMemo } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, Flame, Trophy, Calendar, Sparkles, TrendingUp, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export interface HabitItem {
    id: number;
    name: string;
    icon: string;
    color: string;
    period: string;
    monthlyTarget: number;
    position: number;
    status?: string;
    // Enhanced fields
    habitType?: 'positive' | 'negative';
    measurementType?: 'boolean' | 'numeric';
    unit?: string;
    targetValue?: number;
    frequencyType?: 'daily' | 'weekly_days' | 'weekly_count';
    frequencyDays?: number[]; // [0=Sun, 1=Mon, ..., 6=Sat]
    frequencyCount?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
    logs: Record<string, { status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest'; value?: number; notes?: string }>;
    // Computed fields
    progress_count?: number;
    progress_percent?: number;
    streak?: number;
    best_streak?: number;
    habit_strength?: number;
    is_stagnant?: boolean;
}

interface HabitDetailModalProps {
    habit: HabitItem | null;
    isOpen: boolean;
    onClose: () => void;
    locale: string;
}

export default function HabitDetailModal({ habit, isOpen, onClose, locale }: HabitDetailModalProps) {
    if (!isOpen || !habit) return null;

    const isIndo = locale === 'id';
    const habitType = habit.habitType || 'positive';
    const isNegative = habitType === 'negative';

    // Day of week names
    const daysOfWeek = isIndo 
        ? ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = isIndo
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // 1. Calculate Day-of-Week Stats
    const dayStats = useMemo(() => {
        const counts = Array(7).fill(0);
        const totals = Array(7).fill(0);

        Object.entries(habit.logs).forEach(([dateStr, log]) => {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                const dayIndex = date.getDay();
                totals[dayIndex]++;
                if (log.status === 'completed') {
                    counts[dayIndex]++;
                }
            }
        });

        return daysOfWeek.map((name, i) => {
            const scheduled = totals[i] > 0 ? totals[i] : 1;
            const completed = counts[i];
            const pct = Math.min(100, Math.round((completed / scheduled) * 100));
            return { name, short: shortDays[i], completed, total: totals[i], pct };
        });
    }, [habit, isNegative]);

    // 2. Generate 52-week Heatmap Data (364 days leading to today)
    const heatmapWeeks = useMemo(() => {
        const today = new Date();
        const weeks: Array<Array<{ dateStr: string; status: string; isToday: boolean; isFuture: boolean }>> = [];

        // End on current Saturday to make a full grid
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + (6 - today.getDay()));

        // Start 51 weeks before that (total 52 weeks)
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - (52 * 7 - 1));

        let currentDay = new Date(startDate);
        let currentWeek: Array<{ dateStr: string; status: string; isToday: boolean; isFuture: boolean }> = [];

        while (currentDay <= endDate) {
            const dateStr = currentDay.toISOString().split('T')[0];
            const log = habit.logs[dateStr];
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isFuture = currentDay > today;

            currentWeek.push({
                dateStr,
                status: log?.status || 'empty',
                isToday,
                isFuture
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentDay.setDate(currentDay.getDate() + 1);
        }

        return weeks;
    }, [habit]);

    // 3. Extract Notes List
    const notesList = useMemo(() => {
        return Object.entries(habit.logs)
            .filter(([_, log]) => log.notes && log.notes.trim().length > 0)
            .map(([dateStr, log]) => ({ dateStr, notes: log.notes!, status: log.status }))
            .sort((a, b) => b.dateStr.localeCompare(a.dateStr));
    }, [habit]);

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div 
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0 border border-black/5"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                            >
                                {habit.icon}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 truncate">
                                        {habit.name}
                                    </h3>
                                    {isNegative && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 dark:bg-rose-500/10 border border-rose-200/50 flex items-center gap-1">
                                            <ShieldCheck size={12} /> {isIndo ? 'Bebas dari Kebiasaan' : 'Quit Habit'}
                                        </span>
                                    )}
                                    {habit.timeOfDay && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {habit.timeOfDay === 'morning' ? '🌅 Pagi' : habit.timeOfDay === 'afternoon' ? '☀️ Siang' : habit.timeOfDay === 'evening' ? '🌙 Malam' : '🔄 Fleksibel'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 font-medium mt-1">
                                    🎯 {isIndo ? 'Target' : 'Target'}: {habit.monthlyTarget} {isIndo ? 'Hari / Bulan' : 'Days / Month'}
                                    {habit.measurementType === 'numeric' && ` • ${habit.targetValue || 0} ${habit.unit || ''} / ${isIndo ? 'hari' : 'day'}`}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition shadow-sm border border-slate-200 dark:border-slate-700"
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
                        
                        {/* 4 Stat Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            
                            {/* Streak Card */}
                            <div className="bg-orange-50/70 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-orange-500">
                                    <span className="text-[10px] font-black uppercase tracking-wider">{isIndo ? 'Streak Aktif' : 'Current Streak'}</span>
                                    <Flame size={16} />
                                </div>
                                <div className="mt-2 text-2xl font-black text-orange-600 dark:text-orange-400">
                                    {habit.streak || 0} <span className="text-xs font-bold">{isIndo ? 'Hari' : 'Days'}</span>
                                </div>
                            </div>

                            {/* Habit Strength Score */}
                            <div className="bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-indigo-500">
                                    <span className="text-[10px] font-black uppercase tracking-wider">{isIndo ? 'Habit Strength' : 'Strength Index'}</span>
                                    <Sparkles size={16} />
                                </div>
                                <div className="mt-2 flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                        {habit.habit_strength ?? habit.progress_percent ?? 0}%
                                    </span>
                                    <span className="text-[10px] font-bold text-indigo-400">Loop Score</span>
                                </div>
                            </div>

                            {/* Total Checkins */}
                            <div className="bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-emerald-500">
                                    <span className="text-[10px] font-black uppercase tracking-wider">{isIndo ? 'Total Selesai' : 'Completed'}</span>
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    {habit.progress_count || 0} <span className="text-xs font-bold">x</span>
                                </div>
                            </div>

                            {/* Best Streak */}
                            <div className="bg-purple-50/70 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-purple-500">
                                    <span className="text-[10px] font-black uppercase tracking-wider">{isIndo ? 'Rekor Terbaik' : 'Best Streak'}</span>
                                    <Trophy size={16} />
                                </div>
                                <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
                                    {Math.max(habit.best_streak || 0, habit.streak || 0)} <span className="text-xs font-bold">{isIndo ? 'Hari' : 'Days'}</span>
                                </div>
                            </div>

                        </div>

                        {/* GitHub-Style 365-Day Heatmap */}
                        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-indigo-500" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        {isIndo ? 'Peta Konsistensi 365 Hari' : '365-Day Consistency Heatmap'}
                                    </h4>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? '52 Minggu Terakhir' : 'Last 52 Weeks'}
                                </span>
                            </div>

                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <div className="flex gap-1 min-w-[720px]">
                                    {heatmapWeeks.map((week, wIdx) => (
                                        <div key={wIdx} className="flex flex-col gap-1">
                                            {week.map((day, dIdx) => {
                                                const isCompleted = day.status === 'completed';
                                                const isRelapse = day.status === 'relapse';
                                                const isSkipped = day.status === 'skipped';
                                                const isRest = day.status === 'rest';

                                                return (
                                                    <div
                                                        key={dIdx}
                                                        title={`${day.dateStr}: ${day.status}`}
                                                        className={`w-3 h-3 rounded-xs transition-all ${
                                                            day.isFuture
                                                                ? 'bg-slate-100 dark:bg-slate-900 opacity-30'
                                                                : isCompleted
                                                                ? 'shadow-xs'
                                                                : isRelapse
                                                                ? 'bg-rose-500 shadow-xs'
                                                                : isSkipped
                                                                ? 'bg-slate-300 dark:bg-slate-700'
                                                                : isRest
                                                                ? 'bg-slate-200 dark:bg-slate-800'
                                                                : 'bg-slate-200/60 dark:bg-slate-800/60'
                                                        } ${day.isToday ? 'ring-1 ring-indigo-500 ring-offset-1' : ''}`}
                                                        style={isCompleted ? { backgroundColor: habit.color } : {}}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-3 text-[10px] font-bold text-slate-400">
                                <span>{isIndo ? 'Kurang' : 'Less'}</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-800" />
                                    <div className="w-2.5 h-2.5 rounded-xs opacity-60" style={{ backgroundColor: habit.color }} />
                                    <div className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: habit.color }} />
                                </div>
                                <span>{isIndo ? 'Sering' : 'More'}</span>
                            </div>
                        </div>

                        {/* Day-of-Week Breakdown Bar Chart */}
                        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={16} className="text-emerald-500" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        {isIndo ? 'Performa Berdasarkan Hari' : 'Day-of-Week Consistency'}
                                    </h4>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    {isIndo ? 'Tingkat Keberhasilan' : 'Success Rate'}
                                </span>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {dayStats.map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <div className="h-24 w-full bg-white dark:bg-slate-900 rounded-xl p-1 flex flex-col justify-end border border-slate-100 dark:border-slate-800">
                                            <div 
                                                className="w-full rounded-lg transition-all duration-700"
                                                style={{ 
                                                    height: `${Math.max(8, item.pct)}%`, 
                                                    backgroundColor: item.pct > 70 ? habit.color : `${habit.color}80` 
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{item.pct}%</span>
                                        <span className="text-[9px] font-bold text-slate-400">{item.short}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Micro-Notes History */}
                        {notesList.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={16} className="text-amber-500" />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        {isIndo ? 'Riwayat Catatan Harian' : 'Micro-Notes History'}
                                    </h4>
                                </div>

                                <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar">
                                    {notesList.map((item, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-3">
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-[10px] text-slate-500 shrink-0">
                                                {item.dateStr}
                                            </span>
                                            <p className="font-medium text-slate-700 dark:text-slate-300 flex-1 leading-relaxed">
                                                "{item.notes}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="px-6 md:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end shrink-0">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            {isIndo ? 'Tutup' : 'Close'}
                        </button>
                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
