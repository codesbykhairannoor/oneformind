'use client';

import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { ChevronLeft, ChevronRight, CheckCircle2, Droplets, Inbox, Maximize2, Sparkles } from 'lucide-react';
import DayPreviewModal from './DayPreviewModal';
import { useRouter } from '@/i18n/routing';

export default function PlannerDashboardClient({ initialDateStr, realTasks, realDailies = [] }: { initialDateStr: string, realTasks: any[], realDailies?: any[] }) {
    const router = useRouter();
    // Parse the initial date from string to prevent hydration mismatches
    const [currentDate, setCurrentDate] = useState(new Date(`${initialDateStr}-01T00:00:00`));
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedDayData, setSelectedDayData] = useState<any>(null);
    
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const currentMonthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

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

        return {
            date,
            dateStr,
            dayNumber: date.getDate(),
            isToday,
            tasks: { completed: completedTasks, total: totalTasks, items: tasksItems },
            water,
            inbox: { items: inboxItems },
            meals,
            notes
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
    }, [currentDate, realTasks]);

    const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const openPreview = (day: any) => {
        setSelectedDayData(day);
        setIsPreviewOpen(true);
    };

    const goToDailyPlanner = (e: React.MouseEvent, dateStr: string) => {
        e.stopPropagation();
        router.push(`/planner?date=${dateStr}`);
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-6 lg:p-10 relative overflow-hidden">
                
                {/* Background Ambient Gradients */}
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent pointer-events-none z-0"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
                
                <div className="w-full max-w-[1800px] mx-auto space-y-10 relative z-10">
                    
                    {/* Premium Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform shrink-0">
                                <Sparkles size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Planner Dashboard</h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium text-sm md:text-lg">Gambaran besar produktivitasmu bulan ini.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-[1.5rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50 w-full md:w-auto justify-between md:justify-start">
                            <button onClick={previousMonth} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:shadow-sm">
                                <ChevronLeft size={20} strokeWidth={2.5} />
                            </button>
                            <span className="font-black text-slate-800 dark:text-white min-w-[160px] text-center text-base md:text-lg uppercase tracking-wider">{currentMonthLabel}</span>
                            <button onClick={nextMonth} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:shadow-sm">
                                <ChevronRight size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    {/* Premium Calendar Grid */}
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
                            {calendarDays.map((day, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => openPreview(day)}
                                    className={`min-h-[120px] md:min-h-[160px] p-2 md:p-4 border-b border-r border-slate-100/80 dark:border-slate-800/80 relative group cursor-pointer transition-all duration-300
                                        ${!day.isCurrentMonth ? 'bg-slate-50/30 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-800/30' : 'bg-transparent hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-lg hover:shadow-indigo-500/5 hover:z-10'}
                                        ${day.isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10 ring-2 ring-inset ring-indigo-500 z-10' : ''}
                                    `}
                                >
                                    {/* Date Number & Quick Actions */}
                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-2 md:mb-4 relative z-10 gap-2">
                                        <span 
                                            className={`w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full font-black text-xs md:text-sm transition-all duration-300
                                                ${day.isToday ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 transform scale-110' : 'text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}
                                                ${!day.isCurrentMonth && !day.isToday ? 'opacity-30' : ''}
                                            `}
                                        >
                                            {day.dayNumber}
                                        </span>

                                        {/* Quick Open Daily Planner Button */}
                                        <button 
                                            onClick={(e) => goToDailyPlanner(e, day.dateStr)}
                                            className="w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-slate-800 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 shadow-md border border-slate-100 dark:border-slate-700 transform translate-y-2 xl:translate-y-0 xl:translate-x-2 group-hover:translate-x-0 group-hover:translate-y-0"
                                            title="Buka Daily Planner"
                                        >
                                            <Maximize2 size={14} className="md:w-4 md:h-4" />
                                        </button>
                                    </div>

                                    {/* Data Summaries */}
                                    <div className={`space-y-1.5 md:space-y-2 relative z-10 ${!day.isCurrentMonth ? 'opacity-40' : ''}`}>
                                        
                                        {/* Tasks */}
                                        {day.tasks.total > 0 && (
                                            <div className="flex flex-col xl:flex-row xl:items-center justify-between px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] md:text-xs font-bold transition-all hover:scale-[1.02] gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" />
                                                    <span className="hidden xl:inline">Tasks</span>
                                                </div>
                                                <span>{day.tasks.completed}/{day.tasks.total}</span>
                                            </div>
                                        )}
                                        
                                        {/* Water */}
                                        {day.water > 0 && (
                                            <div className="flex flex-col xl:flex-row xl:items-center justify-between px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-cyan-50/80 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-[10px] md:text-xs font-bold transition-all hover:scale-[1.02] gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Droplets size={12} className="md:w-3.5 md:h-3.5" />
                                                    <span className="hidden xl:inline">Air</span>
                                                </div>
                                                <span>{day.water}/8</span>
                                            </div>
                                        )}
                                        
                                        {/* Inbox */}
                                        {day.inbox?.items?.length > 0 && (
                                            <div className="flex flex-col xl:flex-row xl:items-center justify-between px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-orange-50/80 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-[10px] md:text-xs font-bold transition-all hover:scale-[1.02] gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Inbox size={12} className="md:w-3.5 md:h-3.5" />
                                                    <span className="hidden xl:inline">Inbox</span>
                                                </div>
                                                <span>{day.inbox.items.length}</span>
                                            </div>
                                        )}
                                        
                                        {/* Meals Indicator */}
                                        {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                                            <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-rose-50/80 dark:bg-rose-500/10 transition-all hover:scale-[1.02]">
                                                {day.meals.breakfast && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-400"></div>}
                                                {day.meals.lunch && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400"></div>}
                                                {day.meals.dinner && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-400"></div>}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Hover Highlight Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
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
