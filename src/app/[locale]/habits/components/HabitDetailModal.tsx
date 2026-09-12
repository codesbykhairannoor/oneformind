'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import ModalPortal from '@/components/ModalPortal';
import {
    X,
    Flame,
    Trophy,
    Calendar,
    Sparkles,
    TrendingUp,
    ShieldCheck,
    Clock,
    CheckCircle2,
    BarChart3,
    Award,
    Zap,
    Brain,
    Layers,
    Coffee,
    Check,
    AlertCircle,
    BookOpen,
    Edit3
} from 'lucide-react';
import { HabitItem } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface HabitDetailModalProps {
    habit: HabitItem | null;
    isOpen: boolean;
    onClose: () => void;
    locale: string;
    onEditHabit?: (habit: HabitItem) => void;
}

export default function HabitDetailModal({ habit, isOpen, onClose, locale, onEditHabit }: HabitDetailModalProps) {
    if (!isOpen || !habit) return null;

    const isIndo = locale === 'id';
    const habitType = habit.habitType || 'positive';
    const isNegative = habitType === 'negative';

    const [activeTab, setActiveTab] = useState<'heatmap' | 'monthly' | 'milestones' | 'notes'>('heatmap');
    const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<{
        dateStr: string;
        dayName: string;
        status: string;
        value?: number;
        notes?: string;
    } | null>(null);

    // Fetch all-time habits and historical logs across all periods
    const { data: allHabitsRaw } = useSWR(isOpen ? '/api/habits' : null, fetcher, {
        revalidateOnFocus: false,
        keepPreviousData: true
    });

    // Aggregate logs across all months/periods for this habit
    const aggregatedLogs = useMemo(() => {
        const logsMap: HabitItem['logs'] = { ...habit.logs };

        if (allHabitsRaw && Array.isArray(allHabitsRaw)) {
            const matchingHabits = allHabitsRaw.filter((h: any) =>
                h.id === habit.id || (h.name && h.name.trim().toLowerCase() === habit.name.trim().toLowerCase())
            );

            matchingHabits.forEach((mh: any) => {
                if (mh.logs && Array.isArray(mh.logs)) {
                    mh.logs.forEach((log: any) => {
                        if (!log || !log.date) return;
                        const dateStr = typeof log.date === 'string'
                            ? log.date.split('T')[0]
                            : new Date(log.date).toISOString().split('T')[0];

                        let logNotesRaw = log.notes;
                        let logNotes = '';
                        let logVal: number | undefined = undefined;

                        if (logNotesRaw !== null && logNotesRaw !== undefined) {
                            if (typeof logNotesRaw === 'number') {
                                logVal = logNotesRaw;
                            } else if (typeof logNotesRaw === 'object') {
                                if (typeof logNotesRaw.val === 'number') logVal = logNotesRaw.val;
                                else if (typeof logNotesRaw.val === 'string' && !isNaN(Number(logNotesRaw.val))) logVal = Number(logNotesRaw.val);
                                logNotes = typeof logNotesRaw.note === 'string' ? logNotesRaw.note : '';
                            } else if (typeof logNotesRaw === 'string') {
                                let trimmed = logNotesRaw.trim();
                                if (trimmed.startsWith('{') || (trimmed.startsWith('"') && trimmed.includes('{'))) {
                                    try {
                                        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                                            trimmed = JSON.parse(trimmed);
                                        }
                                        const parsed = typeof trimmed === 'string' ? JSON.parse(trimmed) : trimmed;
                                        if (parsed && typeof parsed === 'object') {
                                            if (typeof parsed.val === 'number') logVal = parsed.val;
                                            else if (typeof parsed.val === 'string' && !isNaN(Number(parsed.val))) logVal = Number(parsed.val);
                                            logNotes = typeof parsed.note === 'string' ? parsed.note : '';
                                        }
                                    } catch {
                                        logNotes = trimmed;
                                    }
                                } else if (!isNaN(Number(trimmed)) && trimmed !== '') {
                                    logVal = Number(trimmed);
                                } else {
                                    logNotes = trimmed;
                                }
                            }
                        }

                        const rawStatus = (log.status as any) || 'completed';

                        if (habit.measurementType === 'numeric' && logVal === undefined) {
                            if (rawStatus === 'completed') {
                                logVal = habit.targetValue;
                            } else if (rawStatus === 'in_progress' && typeof logNotesRaw === 'string') {
                                const match = logNotesRaw.match(/"val"\s*:\s*(\d+(\.\d+)?)/);
                                if (match && match[1]) {
                                    logVal = parseFloat(match[1]);
                                }
                            }
                        }

                        logsMap[dateStr] = {
                            status: rawStatus,
                            value: logVal,
                            notes: logNotes
                        };
                    });
                }
            });
        }

        return logsMap;
    }, [habit, allHabitsRaw]);

    // Day of week names
    const daysOfWeek = isIndo 
        ? ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = isIndo
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthNames = isIndo
        ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // 1. Calculate Day-of-Week Stats from All-Time Logs
    const dayStats = useMemo(() => {
        const counts = Array(7).fill(0);
        const totals = Array(7).fill(0);

        Object.entries(aggregatedLogs).forEach(([dateStr, log]) => {
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
    }, [aggregatedLogs, daysOfWeek, shortDays]);

    // 2. Generate 52-week Heatmap Data (364 days leading to today) with Month Headers
    const { heatmapWeeks, monthLabels } = useMemo(() => {
        const today = new Date();
        const weeks: Array<Array<{ dateStr: string; dayIndex: number; status: string; value?: number; notes?: string; isToday: boolean; isFuture: boolean }>> = [];
        const labels: Array<{ monthName: string; colIndex: number }> = [];

        // End on current Saturday to make a full 7-row grid
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + (6 - today.getDay()));

        // Start 51 weeks before that (total 52 weeks = 364 days)
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - (52 * 7 - 1));

        let currentDay = new Date(startDate);
        let currentWeek: Array<{ dateStr: string; dayIndex: number; status: string; value?: number; notes?: string; isToday: boolean; isFuture: boolean }> = [];
        let weekIndex = 0;
        let lastLabeledMonth = -1;

        while (currentDay <= endDate) {
            const dateStr = currentDay.toISOString().split('T')[0];
            const log = aggregatedLogs[dateStr];
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isFuture = currentDay > today;
            const currentMonthNum = currentDay.getMonth();

            // Track month label on first occurrence in column
            if (currentDay.getDate() <= 7 && currentMonthNum !== lastLabeledMonth) {
                labels.push({
                    monthName: monthNames[currentMonthNum].slice(0, 3),
                    colIndex: weekIndex
                });
                lastLabeledMonth = currentMonthNum;
            }

            currentWeek.push({
                dateStr,
                dayIndex: currentDay.getDay(),
                status: log?.status || 'empty',
                value: log?.value,
                notes: log?.notes,
                isToday,
                isFuture
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
                weekIndex++;
            }

            currentDay.setDate(currentDay.getDate() + 1);
        }

        return { heatmapWeeks: weeks, monthLabels: labels };
    }, [aggregatedLogs, monthNames]);

    // 3. Extract 12-Month Performance Comparison
    const monthlyPerformance = useMemo(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const result: Array<{
            key: string;
            name: string;
            year: number;
            completedCount: number;
            totalDays: number;
            percentage: number;
            isCurrent: boolean;
        }> = [];

        for (let m = 0; m < 12; m++) {
            const year = currentYear;
            const monthNum = m + 1;
            const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
            const daysInMonth = new Date(year, monthNum, 0).getDate();
            let completed = 0;

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${monthKey}-${String(d).padStart(2, '0')}`;
                const log = aggregatedLogs[dateStr];
                if (log && log.status === 'completed') {
                    completed++;
                }
            }

            const isCurrent = (today.getMonth() === m && today.getFullYear() === year);
            const daysToCheck = isCurrent ? today.getDate() : daysInMonth;
            const pct = Math.min(100, Math.round((completed / (daysToCheck || 1)) * 100));

            result.push({
                key: monthKey,
                name: monthNames[m].slice(0, 3),
                year,
                completedCount: completed,
                totalDays: daysToCheck,
                percentage: pct,
                isCurrent
            });
        }

        return result;
    }, [aggregatedLogs, monthNames]);

    // 4. Calculate All-Time Best Streak and Total All-Time Completions
    const { allTimeBestStreak, totalAllTimeCompletions, automaticityPct } = useMemo(() => {
        const dateEntries = Object.entries(aggregatedLogs)
            .map(([d, log]) => ({ date: d, status: log.status }))
            .sort((a, b) => a.date.localeCompare(b.date));

        let maxStreak = 0;
        let runningStreak = 0;
        let totalCompleted = 0;

        dateEntries.forEach(entry => {
            if (entry.status === 'completed') {
                totalCompleted++;
                runningStreak++;
                if (runningStreak > maxStreak) maxStreak = runningStreak;
            } else if (entry.status === 'rest') {
                // Rest day carries over
            } else {
                runningStreak = 0;
            }
        });

        const activeStreak = habit.streak || 0;
        const best = Math.max(maxStreak, habit.best_streak || 0, activeStreak);
        const autoPct = Math.min(100, Math.round((best / 66) * 100));

        return {
            allTimeBestStreak: best,
            totalAllTimeCompletions: totalCompleted || habit.progress_count || 0,
            automaticityPct: autoPct
        };
    }, [aggregatedLogs, habit]);

    // 5. Extract Notes List
    const notesList = useMemo(() => {
        return Object.entries(aggregatedLogs)
            .filter(([_, log]) => log.notes && log.notes.trim().length > 0)
            .map(([dateStr, log]) => ({ dateStr, notes: log.notes!, status: log.status, value: log.value }))
            .sort((a, b) => b.dateStr.localeCompare(a.dateStr));
    }, [aggregatedLogs]);

    // Atomic Habit Milestones Definition
    const milestones = [
        {
            level: 1,
            target: 3,
            icon: '🌱',
            title: isIndo ? 'Spark (3 Hari)' : 'Spark (3 Days)',
            desc: isIndo ? 'Menyalakan niat & memecah inersia awal' : 'Igniting initial intention & breaking inertia',
            reached: (habit.streak || 0) >= 3 || allTimeBestStreak >= 3
        },
        {
            level: 2,
            target: 7,
            icon: '⚡',
            title: isIndo ? 'Momentum (7 Hari)' : 'Momentum (7 Days)',
            desc: isIndo ? 'Melewati friksi minggu pertama dengan sukses' : 'Overcoming first-week friction resistance',
            reached: (habit.streak || 0) >= 7 || allTimeBestStreak >= 7
        },
        {
            level: 3,
            target: 21,
            icon: '🧠',
            title: isIndo ? 'Neural Loop (21 Hari)' : 'Neural Loop (21 Days)',
            desc: isIndo ? 'Jalur sinapsis kebiasaan mulai terbentuk di otak' : 'Synaptic habit loop wiring in the brain',
            reached: (habit.streak || 0) >= 21 || allTimeBestStreak >= 21
        },
        {
            level: 4,
            target: 66,
            icon: '💎',
            title: isIndo ? 'Automaticity (66 Hari)' : 'Automaticity (66 Days)',
            desc: isIndo ? 'Standar sains psikologi UCL: kebiasaan menjadi otomatis' : 'UCL psychological standard: behavior becomes automatic',
            reached: (habit.streak || 0) >= 66 || allTimeBestStreak >= 66
        },
        {
            level: 5,
            target: 100,
            icon: '👑',
            title: isIndo ? 'Master Century (100 Hari)' : 'Master Century (100 Days)',
            desc: isIndo ? 'Identitas gaya hidup permanen yang mendarah daging' : 'Permanent identity transformation & lifestyle',
            reached: (habit.streak || 0) >= 100 || allTimeBestStreak >= 100
        }
    ];

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
                
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-4xl relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
                    
                    {/* Header */}
                    <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
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

                        <div className="flex items-center gap-2">
                            {onEditHabit && (
                                <button 
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onEditHabit(habit);
                                    }} 
                                    className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition shadow-sm border border-slate-200 dark:border-slate-700"
                                    title={isIndo ? 'Ubah Kebiasaan' : 'Edit Habit'}
                                >
                                    <Edit3 size={17} strokeWidth={2.5} />
                                </button>
                            )}
                            <button 
                                onClick={onClose} 
                                className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition shadow-sm border border-slate-200 dark:border-slate-700"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
                        <button
                            type="button"
                            onClick={() => setActiveTab('heatmap')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                                activeTab === 'heatmap'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <Calendar size={14} />
                            <span>{isIndo ? 'Peta 365 Hari' : '365-Day Heatmap'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('monthly')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                                activeTab === 'monthly'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <BarChart3 size={14} />
                            <span>{isIndo ? 'Tren 12 Bulan' : '12-Month Trends'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('milestones')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                                activeTab === 'milestones'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <Brain size={14} />
                            <span>{isIndo ? 'Formasi 66 Hari' : '66-Day Milestones'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('notes')}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                                activeTab === 'notes'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <BookOpen size={14} />
                            <span>{isIndo ? 'Catatan Refleksi' : 'Micro-Notes'} ({notesList.length})</span>
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

                            {/* Total All-Time Checkins */}
                            <div className="bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-emerald-500">
                                    <span className="text-[10px] font-black uppercase tracking-wider">{isIndo ? 'Total Sepanjang Masa' : 'All-Time Logs'}</span>
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                    {totalAllTimeCompletions} <span className="text-xs font-bold">x</span>
                                </div>
                            </div>

                            {/* Best Streak */}
                            <div className="bg-purple-50/70 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-2xl p-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-purple-500">
                                    <span className="text-[10px] font-black uppercase tracking-wider">{isIndo ? 'Rekor Terbaik' : 'Best Streak'}</span>
                                    <Trophy size={16} />
                                </div>
                                <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
                                    {allTimeBestStreak} <span className="text-xs font-bold">{isIndo ? 'Hari' : 'Days'}</span>
                                </div>
                            </div>

                        </div>

                        {/* TAB 1: HEATMAP & DAY INSPECTOR */}
                        {activeTab === 'heatmap' && (
                            <div className="space-y-6">
                                {/* GitHub-Style 365-Day Connected Heatmap */}
                                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-indigo-500" />
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                {isIndo ? 'Peta Konsistensi 365 Hari (Terkoneksi Sepanjang Tahun)' : '365-Day Consistency Heatmap (All-Time Connected)'}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            52 {isIndo ? 'Minggu Terakhir' : 'Weeks'}
                                        </span>
                                    </div>

                                    {/* Month Labels Bar */}
                                    <div className="overflow-x-auto custom-scrollbar pb-2">
                                        <div className="min-w-[760px]">
                                            {/* Month Headers */}
                                            <div className="flex text-[9px] font-black text-slate-400 mb-1.5 pl-5">
                                                {monthLabels.map((lbl, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{ width: `${(52 / monthLabels.length) * 14}px` }}
                                                        className="text-left shrink-0"
                                                    >
                                                        {lbl.monthName}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Heatmap Grid with Day Labels */}
                                            <div className="flex gap-1.5">
                                                {/* Weekday indicators (M, W, F) */}
                                                <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pr-1 py-0.5">
                                                    <span>Min</span>
                                                    <span>Sen</span>
                                                    <span>Sel</span>
                                                    <span>Rab</span>
                                                    <span>Kam</span>
                                                    <span>Jum</span>
                                                    <span>Sab</span>
                                                </div>

                                                {/* 52-Week Grid */}
                                                <div className="flex gap-1 flex-1">
                                                    {heatmapWeeks.map((week, wIdx) => (
                                                        <div key={wIdx} className="flex flex-col gap-1">
                                                            {week.map((day, dIdx) => {
                                                                const isCompleted = day.status === 'completed';
                                                                const isRelapse = day.status === 'relapse';
                                                                const isSkipped = day.status === 'skipped';
                                                                const isRest = day.status === 'rest';
                                                                const isSelected = selectedHeatmapDay?.dateStr === day.dateStr;

                                                                return (
                                                                    <button
                                                                        key={dIdx}
                                                                        type="button"
                                                                        onClick={() => setSelectedHeatmapDay({
                                                                            dateStr: day.dateStr,
                                                                            dayName: daysOfWeek[day.dayIndex],
                                                                            status: day.status,
                                                                            value: day.value,
                                                                            notes: day.notes
                                                                        })}
                                                                        title={`${day.dateStr} (${daysOfWeek[day.dayIndex]}): ${day.status}${day.notes ? ` - "${day.notes}"` : ''}`}
                                                                        className={`w-3 h-3 rounded-xs transition-all hover:scale-130 active:scale-95 ${
                                                                            day.isFuture
                                                                                ? 'bg-slate-100 dark:bg-slate-900 opacity-30 cursor-not-allowed'
                                                                                : isCompleted
                                                                                ? 'shadow-xs cursor-pointer'
                                                                                : isRelapse
                                                                                ? 'bg-rose-500 shadow-xs cursor-pointer'
                                                                                : isSkipped
                                                                                ? 'bg-slate-300 dark:bg-slate-700 cursor-pointer'
                                                                                : isRest
                                                                                ? 'bg-slate-200 dark:bg-slate-800 cursor-pointer'
                                                                                : 'bg-slate-200/60 dark:bg-slate-800/60 cursor-pointer hover:border-indigo-400'
                                                                        } ${day.isToday ? 'ring-1 ring-indigo-500 ring-offset-1' : ''} ${
                                                                            isSelected ? 'ring-2 ring-amber-400 scale-125 z-10' : ''
                                                                        }`}
                                                                        style={isCompleted ? { backgroundColor: habit.color } : {}}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-slate-400 flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: habit.color }} /> {isIndo ? 'Selesai' : 'Completed'}</span>
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-800" /> {isIndo ? 'Rest Day' : 'Rest'}</span>
                                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> {isIndo ? 'Kambuh' : 'Relapse'}</span>
                                        </div>
                                        <span className="text-[9px] text-slate-400">💡 {isIndo ? 'Klik kotak mana saja untuk inspeksi log & catatan' : 'Click any square to inspect log & note'}</span>
                                    </div>
                                </div>

                                {/* DAY INSPECTOR CARD */}
                                {selectedHeatmapDay && (
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900/50 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs shrink-0">
                                                🗓️
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-xs text-slate-800 dark:text-slate-100">
                                                        {selectedHeatmapDay.dayName}, {selectedHeatmapDay.dateStr}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${
                                                        selectedHeatmapDay.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                                                            : selectedHeatmapDay.status === 'relapse'
                                                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
                                                            : selectedHeatmapDay.status === 'rest'
                                                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                                                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                                                    }`}>
                                                        {selectedHeatmapDay.status === 'completed' ? '✓ Selesai' : selectedHeatmapDay.status === 'rest' ? '☕ Rest Day' : selectedHeatmapDay.status === 'relapse' ? '⚠️ Kambuh' : '○ Kosong'}
                                                    </span>
                                                </div>
                                                {selectedHeatmapDay.notes ? (
                                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1 italic truncate">
                                                        "{selectedHeatmapDay.notes}"
                                                    </p>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{isIndo ? 'Tidak ada catatan pada tanggal ini' : 'No notes on this date'}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedHeatmapDay(null)}
                                            className="text-slate-400 hover:text-slate-600 p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                {/* Day-of-Week Breakdown Bar Chart */}
                                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={16} className="text-emerald-500" />
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                {isIndo ? 'Performa Berdasarkan Hari (Minggu - Sabtu)' : 'Day-of-Week Consistency'}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {isIndo ? 'Tingkat Keberhasilan Sepanjang Masa' : 'All-Time Success Rate'}
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
                            </div>
                        )}

                        {/* TAB 2: 12-MONTH HISTORICAL TRENDS */}
                        {activeTab === 'monthly' && (
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <BarChart3 size={16} className="text-indigo-500" />
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                {isIndo ? 'Performa Konsistensi 12 Bulan' : '12-Month Performance Trajectory'}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                            {new Date().getFullYear()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                        {monthlyPerformance.map((m, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                                                    m.isCurrent
                                                        ? 'bg-indigo-50/70 dark:bg-indigo-500/10 border-indigo-400 ring-2 ring-indigo-500/30'
                                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-black text-xs text-slate-800 dark:text-slate-200">{m.name}</span>
                                                    {m.isCurrent && (
                                                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-indigo-600 text-white rounded-md">
                                                            {isIndo ? 'Aktif' : 'Now'}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex items-baseline justify-between text-[10px]">
                                                        <span className="font-bold text-slate-400">{m.completedCount}/{m.totalDays} {isIndo ? 'hari' : 'd'}</span>
                                                        <span className="font-black text-indigo-600 dark:text-indigo-400">{m.percentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${m.percentage}%`, backgroundColor: habit.color }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: ATOMIC MILESTONES & HABIT FORMATION */}
                        {activeTab === 'milestones' && (
                            <div className="space-y-6">
                                {/* 66-Day Automaticity Header Card */}
                                <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-200 dark:shadow-none">
                                    <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1 text-indigo-200 text-xs font-bold">
                                                <Brain size={16} />
                                                <span>{isIndo ? 'Sains Pembentukan Kebiasaan (UCL Phillippa Lally)' : 'Habit Automaticity Research'}</span>
                                            </div>
                                            <h4 className="text-xl md:text-2xl font-black">
                                                {isIndo ? 'Perjalanan 66 Hari Menuju Otomatis' : '66-Day Journey to Automaticity'}
                                            </h4>
                                            <p className="text-xs text-indigo-100 mt-1 max-w-md">
                                                {isIndo
                                                    ? 'Riset sains membuktikan butuh rata-rata 66 hari pengulangan konsisten agar sebuah aktivitas berubah dari beban kognitif menjadi rutinitas alami bawah sadar.'
                                                    : 'Science proves it takes an average of 66 consistent repetitions for an action to transition into effortless automaticity.'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl shrink-0 border border-white/20">
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-indigo-200 block">{isIndo ? 'Progres Otomatis' : 'Automaticity'}</span>
                                                <span className="text-2xl font-black">{automaticityPct}%</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-black text-sm shadow-md">
                                                💎
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-white/20 rounded-full h-2.5 mt-4 overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-700"
                                            style={{ width: `${automaticityPct}%` }}
                                        />
                                    </div>
                                </div>

                                {/* 5 Milestones List */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                                        {isIndo ? 'Tahapan Neurobiologis Kebiasaan:' : 'Neurobiological Habit Stages:'}
                                    </h4>

                                    {milestones.map(m => (
                                        <div
                                            key={m.level}
                                            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                                                m.reached
                                                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-500/40 shadow-xs'
                                                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800 opacity-70'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                                                    m.reached ? 'bg-emerald-50 dark:bg-emerald-500/10 ring-2 ring-emerald-500/30' : 'bg-slate-200 dark:bg-slate-800'
                                                }`}>
                                                    {m.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-black text-sm text-slate-900 dark:text-slate-100 truncate">
                                                            {m.title}
                                                        </h5>
                                                        {m.reached && (
                                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center gap-0.5">
                                                                <Check size={10} strokeWidth={3} /> {isIndo ? 'Tercapai' : 'Unlocked'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        {m.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className={`text-xs font-black shrink-0 px-3 py-1.5 rounded-xl ${
                                                m.reached
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                                {m.target} {isIndo ? 'Hari' : 'Days'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: REFLECTION MICRO-NOTES */}
                        {activeTab === 'notes' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                                        {isIndo ? 'Jurnal Refleksi Harian' : 'Daily Reflection Logs'} ({notesList.length})
                                    </h4>
                                </div>

                                {notesList.length > 0 ? (
                                    <div className="space-y-3">
                                        {notesList.map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-3.5 transition hover:border-indigo-300"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                                    💬
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300">
                                                            {item.dateStr}
                                                        </span>
                                                        <span className={`text-[9px] font-bold ${item.status === 'completed' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                            {item.status === 'completed' ? '✓ Completed' : item.status}
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                                                        "{item.notes}"
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                                        <span className="text-3xl block mb-2">📝</span>
                                        <p className="text-xs font-bold text-slate-500">
                                            {isIndo ? 'Belum ada catatan refleksi untuk habit ini.' : 'No reflection notes yet for this habit.'}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            {isIndo ? 'Klik kanan pada kotak kalender di tabel habit untuk menambahkan refleksi harian.' : 'Right-click any date cell in the habit matrix table to add a reflection micro-note.'}
                                        </p>
                                    </div>
                                )}
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
