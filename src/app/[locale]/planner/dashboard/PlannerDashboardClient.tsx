'use client';

import React, { useState, useMemo } from 'react';
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
    Plus
} from 'lucide-react';
import DayPreviewModal from './DayPreviewModal';
import PlannerDashboardStats from './PlannerDashboardStats';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function PlannerDashboardClient({ 
    initialDateStr, 
    realTasks, 
    realDailies = [] 
}: { 
    initialDateStr: string; 
    realTasks: any[]; 
    realDailies?: any[]; 
}) {
    const router = useRouter();
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Parse the initial date from string
    const [currentDate, setCurrentDate] = useState(new Date(`${initialDateStr}-01T00:00:00`));
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

    // Get Real Data for a Day
    const getDayData = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const isToday = date.toDateString() === new Date().toDateString();
        
        const dayTasks = realTasks.filter((t: any) => t.date && t.date.startsWith(dateStr));
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
            start_time: t.startTime ? new Date(t.startTime).toISOString().substring(11, 16) : '',
            end_time: t.endTime ? new Date(t.endTime).toISOString().substring(11, 16) : '',
            notes: t.notes
        }));

        const dailyData = realDailies.find((d: any) => d.date && d.date.startsWith(dateStr));
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
    }, [currentDate, realTasks, realDailies]);

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
                        
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                            {/* Today Quick Reset Button */}
                            <button
                                onClick={resetToToday}
                                className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-xs md:text-sm shadow-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
                                title="Reset ke Bulan Ini"
                            >
                                <CalendarIcon size={16} className="text-indigo-500" />
                                <span>{isIndo ? 'Hari Ini' : 'Today'}</span>
                            </button>

                            {/* Month Navigation */}
                            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50">
                                <button 
                                    onClick={previousMonth} 
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:shadow-sm"
                                    title="Bulan Sebelumnya"
                                >
                                    <ChevronLeft size={18} strokeWidth={2.5} />
                                </button>
                                <span className="font-black text-slate-800 dark:text-white min-w-[150px] text-center text-sm md:text-base tracking-wider px-2">
                                    {currentMonthLabel}
                                </span>
                                <button 
                                    onClick={nextMonth} 
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:shadow-sm"
                                    title="Bulan Berikutnya"
                                >
                                    <ChevronRight size={18} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Create Task Shortcut Button */}
                            <button
                                onClick={() => router.push('/planner')}
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs md:text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Plus size={18} strokeWidth={3} />
                                <span>{isIndo ? 'Kelola Daily' : 'Open Daily'}</span>
                            </button>
                        </div>
                    </div>

                    {/* KPI Stats Bar */}
                    <PlannerDashboardStats
                        totalTasks={monthlyStats.totalTasks}
                        completedTasks={monthlyStats.completedTasks}
                        activeDaysCount={monthlyStats.activeDaysCount}
                        daysInMonthCount={monthlyStats.daysInMonthCount}
                        totalWater={monthlyStats.totalWater}
                        totalInboxItems={monthlyStats.totalInboxItems}
                        locale={locale}
                    />

                    {/* Controls & Filter Toolbar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                        
                        {/* Category Filters */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                            <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1 shrink-0">
                                <Filter size={14} />
                                <span>Filter:</span>
                            </span>

                            <button
                                onClick={() => setFilterCategory('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                                    filterCategory === 'all'
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                {isIndo ? 'Semua' : 'All'}
                            </button>
                            <button
                                onClick={() => setFilterCategory('urgent')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                                    filterCategory === 'urgent'
                                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <Flame size={12} className="text-rose-400" />
                                <span>Urgent</span>
                            </button>
                            <button
                                onClick={() => setFilterCategory('work')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                                    filterCategory === 'work'
                                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <Briefcase size={12} className="text-indigo-300" />
                                <span>Work</span>
                            </button>
                            <button
                                onClick={() => setFilterCategory('normal')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                                    filterCategory === 'normal'
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <Coffee size={12} className="text-emerald-300" />
                                <span>Normal</span>
                            </button>
                            <button
                                onClick={() => setFilterCategory('water')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                                    filterCategory === 'water'
                                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <Droplets size={12} className="text-cyan-300" />
                                <span>{isIndo ? 'Hidrasi' : 'Water'}</span>
                            </button>
                            <button
                                onClick={() => setFilterCategory('inbox')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1 ${
                                    filterCategory === 'inbox'
                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <Inbox size={12} className="text-orange-300" />
                                <span>Inbox</span>
                            </button>
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0 self-end sm:self-auto">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                                    viewMode === 'grid'
                                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <Grid size={14} />
                                <span>Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode('heatmap')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                                    viewMode === 'heatmap'
                                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <Activity size={14} />
                                <span>Heatmap</span>
                            </button>
                        </div>

                    </div>

                    {/* Premium Calendar Grid Container */}
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                        
                        {/* Weekdays Header */}
                        <div className="grid grid-cols-7 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-950/50">
                            {weekDays.map(day => (
                                <div key={day} className="p-3 md:p-5 text-center font-black text-[10px] md:text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Body */}
                        <div className="grid grid-cols-7">
                            {calendarDays.map((day, idx) => {
                                // Determine visibility based on active filter
                                const matchesUrgent = filterCategory === 'urgent' && day.tasks.urgent > 0;
                                const matchesWork = filterCategory === 'work' && day.tasks.work > 0;
                                const matchesNormal = filterCategory === 'normal' && day.tasks.normal > 0;
                                const matchesWater = filterCategory === 'water' && day.water > 0;
                                const matchesInbox = filterCategory === 'inbox' && (day.inbox?.items?.length || 0) > 0;
                                const isFilteredActive = filterCategory === 'all' || matchesUrgent || matchesWork || matchesNormal || matchesWater || matchesInbox;

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => openPreview(day)}
                                        className={`min-h-[120px] md:min-h-[155px] p-2 md:p-3.5 border-b border-r border-slate-100/80 dark:border-slate-800/80 relative group cursor-pointer transition-all duration-300
                                            ${!day.isCurrentMonth ? 'bg-slate-50/30 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30' : 'bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:z-10'}
                                            ${day.isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10 ring-2 ring-inset ring-indigo-500 z-10' : ''}
                                            ${!isFilteredActive ? 'opacity-30 grayscale filter' : ''}
                                        `}
                                    >
                                        {/* Date Number & Quick Actions */}
                                        <div className="flex items-center justify-between mb-2 relative z-10">
                                            <span 
                                                className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full font-black text-xs md:text-sm transition-all duration-300
                                                    ${day.isToday ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 transform scale-105' : 'text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
                                                    ${!day.isCurrentMonth && !day.isToday ? 'opacity-30' : ''}
                                                `}
                                            >
                                                {day.dayNumber}
                                            </span>

                                            {/* Quick Open Daily Planner Button */}
                                            <button 
                                                onClick={(e) => goToDailyPlanner(e, day.dateStr)}
                                                className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-slate-800 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 shadow-md border border-slate-100 dark:border-slate-700"
                                                title={isIndo ? "Buka Daily Planner" : "Open Daily Planner"}
                                            >
                                                <Maximize2 size={13} className="md:w-3.5 md:h-3.5" />
                                            </button>
                                        </div>

                                        {/* VIEW MODE: HEATMAP */}
                                        {viewMode === 'heatmap' ? (
                                            <div className="mt-2 flex flex-col justify-center items-center h-[65px] md:h-[80px]">
                                                <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${getHeatmapBg(day.completionPercent, day.tasks.total)}`}>
                                                    {day.tasks.total > 0 ? (
                                                        <>
                                                            <span className="text-xs md:text-sm font-black">{day.completionPercent}%</span>
                                                            <span className="text-[9px] md:text-[10px] font-mono opacity-80">
                                                                {day.tasks.completed}/{day.tasks.total}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] font-medium opacity-50">-</span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            /* VIEW MODE: GRID DETAILS */
                                            <div className={`space-y-1.5 relative z-10 ${!day.isCurrentMonth ? 'opacity-40' : ''}`}>
                                                
                                                {/* Tasks */}
                                                {day.tasks.total > 0 && (filterCategory === 'all' || filterCategory === 'urgent' || filterCategory === 'work' || filterCategory === 'normal') && (
                                                    <div className="flex items-center justify-between px-2 md:px-2.5 py-1 rounded-lg md:rounded-xl bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] md:text-xs font-bold transition-all hover:scale-[1.02] gap-1">
                                                        <div className="flex items-center gap-1 truncate">
                                                            <CheckCircle2 size={12} className="shrink-0" />
                                                            <span className="hidden xl:inline truncate">Tasks</span>
                                                        </div>
                                                        <span className="font-mono">{day.tasks.completed}/{day.tasks.total}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Water */}
                                                {day.water > 0 && (filterCategory === 'all' || filterCategory === 'water') && (
                                                    <div className="flex items-center justify-between px-2 md:px-2.5 py-1 rounded-lg md:rounded-xl bg-cyan-50/80 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-[10px] md:text-xs font-bold transition-all hover:scale-[1.02] gap-1">
                                                        <div className="flex items-center gap-1 truncate">
                                                            <Droplets size={12} className="shrink-0" />
                                                            <span className="hidden xl:inline truncate">{isIndo ? 'Air' : 'Water'}</span>
                                                        </div>
                                                        <span className="font-mono">{day.water}/8</span>
                                                    </div>
                                                )}
                                                
                                                {/* Inbox */}
                                                {day.inbox?.items?.length > 0 && (filterCategory === 'all' || filterCategory === 'inbox') && (
                                                    <div className="flex items-center justify-between px-2 md:px-2.5 py-1 rounded-lg md:rounded-xl bg-orange-50/80 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-[10px] md:text-xs font-bold transition-all hover:scale-[1.02] gap-1">
                                                        <div className="flex items-center gap-1 truncate">
                                                            <Inbox size={12} className="shrink-0" />
                                                            <span className="hidden xl:inline truncate">Inbox</span>
                                                        </div>
                                                        <span className="font-mono">{day.inbox.items.length}</span>
                                                    </div>
                                                )}
                                                
                                                {/* Meals Indicator */}
                                                {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && filterCategory === 'all' && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-50/60 dark:bg-rose-500/10 transition-all">
                                                        {day.meals.breakfast && <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>}
                                                        {day.meals.lunch && <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>}
                                                        {day.meals.dinner && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Hover Highlight Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DayPreviewModal 
                    show={isPreviewOpen} 
                    day={selectedDayData}
                    onClose={() => setIsPreviewOpen(false)}
                />
            </div>
        </AuthenticatedLayout>
    );
}
