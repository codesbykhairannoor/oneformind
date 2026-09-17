'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle2, 
    Droplets, 
    Inbox, 
    Maximize2, 
    Sparkles, 
    Calendar as CalendarIcon, 
    Grid, 
    Activity, 
    Filter, 
    Flame, 
    Briefcase, 
    Coffee,
    Plus,
    ArrowRight
} from 'lucide-react';
import DayPreviewModal from './DayPreviewModal';
import PlannerDashboardStats from './PlannerDashboardStats';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface TaskItem {
    id: string | number;
    title: string;
    date: string;
    isCompleted: boolean;
    type?: number;
    startTime?: string | null;
    endTime?: string | null;
    notes?: string | null;
}

interface DailyItem {
    date: string;
    waterGlasses?: number;
    meals?: any;
    inbox?: any[];
    notes?: string | null;
}

interface PlannerDashboardClientProps {
    initialDateStr: string;
    realTasks: TaskItem[];
    realDailies?: DailyItem[];
}

export default function PlannerDashboardClient({ 
    initialDateStr, 
    realTasks: initialTasks = [], 
    realDailies: initialDailies = [] 
}: PlannerDashboardClientProps) {
    const router = useRouter();
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Parse the initial date from string
    const [currentDate, setCurrentDate] = useState(() => {
        const parts = initialDateStr.split('-');
        if (parts.length === 2) {
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
        }
        return new Date();
    });

    const currentYear = currentDate.getFullYear();
    const currentMonthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${currentYear}-${currentMonthNum}`;

    // Live SWR Data Fetching for real-time reactivity
    const { data: rawTasks } = useSWR(`/api/planner/tasks?month=${monthKey}`, fetcher, {
        revalidateOnFocus: false
    });
    const { data: rawDailies } = useSWR(`/api/planner/daily?month=${monthKey}`, fetcher, {
        revalidateOnFocus: false
    });

    const tasks: TaskItem[] = useMemo(() => {
        const source = (rawTasks && Array.isArray(rawTasks)) ? rawTasks : initialTasks;
        return source.map((t: any) => ({
            id: t.id,
            title: t.title,
            date: t.date?.split('T')[0] || t.date,
            isCompleted: t.isCompleted ?? t.is_completed ?? false,
            type: t.type,
            startTime: t.startTime || t.start_time || null,
            endTime: t.endTime || t.end_time || null,
            notes: t.notes || null,
        }));
    }, [rawTasks, initialTasks]);

    const dailies: DailyItem[] = useMemo(() => {
        const source = (rawDailies && Array.isArray(rawDailies)) ? rawDailies : initialDailies;
        return source.map((d: any) => ({
            date: d.date?.split('T')[0] || d.date,
            waterGlasses: d.waterGlasses ?? d.water_glasses ?? 0,
            meals: d.meals || null,
            inbox: d.inbox || null,
            notes: d.notes || null,
        }));
    }, [rawDailies, initialDailies]);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState<any>(null);
    const [filterCategory, setFilterCategory] = useState<'all' | 'urgent' | 'work' | 'normal' | 'water' | 'inbox'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'heatmap'>('grid');

    const currentMonthLabel = useMemo(() => {
        try {
            return currentDate.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                month: 'long',
                year: 'numeric'
            }).toUpperCase();
        } catch (e) {
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`.toUpperCase();
        }
    }, [currentDate, locale]);

    const previousMonth = () => {
        const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prev);
        const y = prev.getFullYear();
        const m = String(prev.getMonth() + 1).padStart(2, '0');
        router.push(`/planner/dashboard?month=${y}-${m}`);
    };

    const nextMonth = () => {
        const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(next);
        const y = next.getFullYear();
        const m = String(next.getMonth() + 1).padStart(2, '0');
        router.push(`/planner/dashboard?month=${y}-${m}`);
    };

    const resetToToday = () => {
        const today = new Date();
        const firstOfTodayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setCurrentDate(firstOfTodayMonth);
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        router.push(`/planner/dashboard?month=${y}-${m}`);
    };

    // Format time helper
    const formatTime = (timeStr?: string | null) => {
        if (!timeStr) return '';
        if (timeStr.includes('T')) {
            try { return new Date(timeStr).toISOString().substring(11, 16); } catch {}
        }
        return timeStr.substring(0, 5);
    };

    // Get Real Data for a Day
    const getDayData = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const isToday = date.toDateString() === new Date().toDateString();
        
        const dayTasks = tasks.filter((t: any) => t.date && t.date.startsWith(dateStr));
        const totalTasks = dayTasks.length;
        const completedTasks = dayTasks.filter((t: any) => t.isCompleted).length;

        const urgentTasksCount = dayTasks.filter((t: any) => Number(t.type) === 1).length;
        const workTasksCount = dayTasks.filter((t: any) => Number(t.type) === 2).length;
        const normalTasksCount = dayTasks.filter((t: any) => Number(t.type) === 3 || !t.type).length;

        const tasksItems = dayTasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            is_completed: t.isCompleted,
            type: t.type,
            start_time: formatTime(t.startTime),
            end_time: formatTime(t.endTime),
            notes: t.notes
        }));

        const dailyData = dailies.find((d: any) => d.date && d.date.startsWith(dateStr));
        const water = dailyData?.waterGlasses || 0;
        const meals = dailyData?.meals || null;
        const inboxItems = dailyData?.inbox || [];
        const notes = dailyData?.notes || '';

        const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
            date,
            dateStr,
            dayNumber: date.getDate(),
            isToday,
            tasks: { 
                completed: completedTasks, 
                total: totalTasks, 
                items: tasksItems,
                urgent: urgentTasksCount,
                work: workTasksCount,
                normal: normalTasksCount
            },
            water,
            inbox: { items: inboxItems },
            meals,
            notes,
            completionPercent
        };
    };

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        let startDay = firstDayOfMonth.getDay();
        const adjustedStartDay = startDay === 0 ? 6 : startDay - 1; // Make Monday = 0
        
        const days = [];
        
        // Previous Month padding
        for (let i = 0; i < adjustedStartDay; i++) {
            const d = new Date(year, month, 1 - (adjustedStartDay - i));
            days.push({ ...getDayData(d), isCurrentMonth: false });
        }
        
        // Current Month days
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const d = new Date(year, month, i);
            days.push({ ...getDayData(d), isCurrentMonth: true });
        }
        
        // Next Month padding
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            days.push({ ...getDayData(d), isCurrentMonth: false });
        }
        
        return days;
    }, [currentDate, tasks, dailies]);

    // Compute Monthly Aggregate Stats
    const monthlyStats = useMemo(() => {
        const currentMonthDays = calendarDays.filter(d => d.isCurrentMonth);
        const daysInMonthCount = currentMonthDays.length;

        let totalTasks = 0;
        let completedTasks = 0;
        let totalWater = 0;
        let totalInboxItems = 0;
        let activeDaysCount = 0;

        currentMonthDays.forEach(day => {
            totalTasks += day.tasks.total;
            completedTasks += day.tasks.completed;
            totalWater += day.water;
            totalInboxItems += (day.inbox?.items?.length || 0);

            if (day.tasks.completed > 0 || day.water > 0 || day.notes || (day.inbox?.items?.length || 0) > 0) {
                activeDaysCount++;
            }
        });

        return {
            totalTasks,
            completedTasks,
            totalWater,
            totalInboxItems,
            activeDaysCount,
            daysInMonthCount
        };
    }, [calendarDays]);

    const weekDays = isIndo 
        ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const openPreview = (day: any) => {
        setSelectedDayData(day);
        setIsPreviewOpen(true);
    };

    const goToDailyPlanner = (e: React.MouseEvent, dateStr: string) => {
        e.stopPropagation();
        router.push(`/planner?date=${dateStr}`);
    };

    // Helper for Heatmap Color Intensity
    const getHeatmapBg = (percent: number, totalTasks: number) => {
        if (totalTasks === 0) return 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400';
        if (percent === 0) return 'bg-rose-100/70 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/50';
        if (percent < 50) return 'bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/50';
        if (percent < 100) return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50';
        return 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-black';
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-6 lg:p-10 relative overflow-hidden pb-24">
                
                {/* Background Ambient Gradients */}
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent pointer-events-none z-0"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
                
                <div className="w-full max-w-[1800px] mx-auto space-y-8 relative z-10">
                    
                    {/* Premium Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform shrink-0">
                                <Sparkles size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {isIndo ? 'Planner Dashboard' : 'Planner Dashboard'}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm md:text-base">
                                    {isIndo ? 'Gambaran besar produktivitas, tugas & hidrasi bulan ini.' : 'Overview of monthly productivity, tasks & hydration.'}
                                </p>
                            </div>
                        </div>

                        {/* Top Controls Toolbar */}
                        <div className="flex flex-wrap items-center gap-3">
                            
                            {/* View Switcher: Grid vs Heatmap */}
                            <div className="flex bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-300/40 dark:border-slate-700/50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                        viewMode === 'grid' 
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    <Grid size={14} />
                                    <span>{isIndo ? 'Kalender' : 'Calendar'}</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('heatmap')}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                        viewMode === 'heatmap' 
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    <Activity size={14} />
                                    <span>{isIndo ? 'Heatmap' : 'Heatmap'}</span>
                                </button>
                            </div>

                            {/* Month Navigator */}
                            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                                <button
                                    onClick={previousMonth}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                    title="Bulan Sebelumnya"
                                >
                                    <ChevronLeft size={18} strokeWidth={2.5} />
                                </button>

                                <button 
                                    onClick={resetToToday}
                                    className="px-3 py-1.5 font-black text-xs md:text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition font-mono uppercase tracking-wider cursor-pointer"
                                    title="Kembali ke Bulan Sekarang"
                                >
                                    {currentMonthLabel}
                                </button>

                                <button
                                    onClick={nextMonth}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                                    title="Bulan Berikutnya"
                                >
                                    <ChevronRight size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Open Daily Planner Button */}
                            <Link
                                href="/planner"
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
                            >
                                <span>{isIndo ? 'Planner Harian' : 'Daily Planner'}</span>
                                <ArrowRight size={15} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>

                    {/* Executive Monthly Stats Strip */}
                    <PlannerDashboardStats
                        totalTasks={monthlyStats.totalTasks}
                        completedTasks={monthlyStats.completedTasks}
                        activeDaysCount={monthlyStats.activeDaysCount}
                        daysInMonthCount={monthlyStats.daysInMonthCount}
                        totalWater={monthlyStats.totalWater}
                        totalInboxItems={monthlyStats.totalInboxItems}
                        locale={locale}
                    />

                    {/* Category Filter Pills (For Grid View) */}
                    {viewMode === 'grid' && (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                                <Filter size={13} /> {isIndo ? 'Filter:' : 'Filter:'}
                            </span>
                            {[
                                { id: 'all', label: isIndo ? 'Semua Fokus' : 'All Focus', icon: '🌟' },
                                { id: 'urgent', label: isIndo ? 'Mendesak / Prioritas' : 'Urgent / Priority', icon: '🚨' },
                                { id: 'work', label: isIndo ? 'Pekerjaan' : 'Work & Projects', icon: '💼' },
                                { id: 'normal', label: isIndo ? 'Rutin & Santai' : 'Routine & Life', icon: '☕' },
                                { id: 'water', label: isIndo ? 'Hidrasi Air' : 'Water Hydration', icon: '💧' },
                                { id: 'inbox', label: isIndo ? 'Ide Inbox' : 'Inbox Ideas', icon: '📥' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setFilterCategory(filter.id as any)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                                        filterCategory === filter.id
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                            : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-300'
                                    }`}
                                >
                                    <span>{filter.icon}</span>
                                    <span>{filter.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Calendar View Container */}
                    {viewMode === 'grid' ? (
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-4 sm:p-6 lg:p-8 border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/5">
                            
                            {/* Days Header */}
                            <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-3 text-center">
                                {weekDays.map((day, idx) => (
                                    <div 
                                        key={day} 
                                        className={`py-2 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl ${
                                            idx >= 5 
                                                ? 'text-rose-500 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20' 
                                                : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* 42-Days Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 sm:gap-3">
                                {calendarDays.map((day, idx) => {
                                    const isDimmed = !day.isCurrentMonth;
                                    const hasItems = day.tasks.total > 0 || day.water > 0 || (day.inbox?.items?.length || 0) > 0;

                                    return (
                                        <div
                                            key={`${day.dateStr}-${idx}`}
                                            onClick={() => openPreview(day)}
                                            className={`min-h-[105px] sm:min-h-[135px] rounded-2xl p-2.5 sm:p-3 border transition-all duration-200 flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                                                isDimmed 
                                                    ? 'opacity-35 bg-slate-50/30 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800/60 hover:opacity-75' 
                                                    : day.isToday 
                                                        ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10' 
                                                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-lg'
                                            }`}
                                        >
                                            {/* Card Top: Day Number & Mini Status */}
                                            <div className="flex items-center justify-between">
                                                <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono ${
                                                    day.isToday 
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                                                        : 'text-slate-800 dark:text-slate-200'
                                                }`}>
                                                    {day.dayNumber}
                                                </span>

                                                {/* Mini Completion Ring / Dot */}
                                                {day.tasks.total > 0 && (
                                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md font-mono ${
                                                        day.completionPercent === 100 
                                                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                                                            : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                                    }`}>
                                                        {day.tasks.completed}/{day.tasks.total}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Middle Content: Task Highlights */}
                                            <div className="space-y-1 my-1.5 min-h-0 flex-1">
                                                {day.tasks.items.slice(0, 2).map((t: any) => (
                                                    <div 
                                                        key={t.id}
                                                        className={`text-[10px] font-bold truncate px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                                                            t.is_completed 
                                                                ? 'line-through text-slate-400 bg-slate-100 dark:bg-slate-800/60' 
                                                                : Number(t.type) === 1
                                                                    ? 'bg-rose-100/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                                                                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                                        }`}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-70"></span>
                                                        <span className="truncate">{t.title}</span>
                                                    </div>
                                                ))}

                                                {day.tasks.total > 2 && (
                                                    <div className="text-[9px] font-black text-slate-400 pl-1">
                                                        +{day.tasks.total - 2} {isIndo ? 'lainnya' : 'more'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Indicators: Water & Inbox */}
                                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    {day.water > 0 && (
                                                        <span className="flex items-center gap-0.5 text-cyan-600 dark:text-cyan-400 font-black">
                                                            <Droplets size={11} /> {day.water}
                                                        </span>
                                                    )}
                                                    {(day.inbox?.items?.length || 0) > 0 && (
                                                        <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold">
                                                            <Inbox size={11} /> {day.inbox.items.length}
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => goToDailyPlanner(e, day.dateStr)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                                                    title="Buka Planner Hari Ini"
                                                >
                                                    <ArrowRight size={12} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Heatmap Productivity Matrix */
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {isIndo ? 'Heatmap Konsistensi & Ritme Harian' : 'Productivity & Completion Heatmap'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {isIndo ? 'Warna hijau pekat merefleksikan penyelesaian tugas 100% pada hari tersebut.' : 'Vibrant green highlights 100% completed task execution days.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-7 gap-3">
                                {calendarDays.filter(d => d.isCurrentMonth).map((day) => (
                                    <div
                                        key={day.dateStr}
                                        onClick={() => openPreview(day)}
                                        className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 ${getHeatmapBg(day.completionPercent, day.tasks.total)}`}
                                    >
                                        <span className="text-sm font-black font-mono">{day.dayNumber}</span>
                                        <span className="text-[10px] font-bold mt-1">
                                            {day.tasks.total === 0 ? '-' : `${day.completionPercent}%`}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap Legend */}
                            <div className="flex items-center justify-end gap-3 text-xs font-bold text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span>{isIndo ? 'Sedikit' : 'Low'}</span>
                                <div className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 border"></div>
                                <div className="w-5 h-5 rounded-lg bg-rose-100 text-rose-700 border border-rose-200"></div>
                                <div className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 border border-amber-200"></div>
                                <div className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200"></div>
                                <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white"></div>
                                <span>{isIndo ? 'Maksimal (100%)' : 'High (100%)'}</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Day Preview Modal */}
            <DayPreviewModal
                show={isPreviewOpen}
                day={selectedDayData}
                onClose={() => setIsPreviewOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
