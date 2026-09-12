'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import GatedPage from '@/components/GatedPage';
import NeuralBridge from '@/components/NeuralBridge';

import CalendarHeader from './components/CalendarHeader';
import CalendarFilterBar, { CalendarViewMode, CalendarLayerFilters } from './components/CalendarFilterBar';
import CalendarMonthView, { MonthGridDayItem } from './components/CalendarMonthView';
import CalendarWeekView from './components/CalendarWeekView';
import CalendarDayView from './components/CalendarDayView';
import CalendarAgendaView from './components/CalendarAgendaView';
import CalendarEventModal from './components/CalendarEventModal';
import CalendarDayDetail from './components/CalendarDayDetail';
import CalendarTaskDrawer from './components/CalendarTaskDrawer';

import { 
    UnifiedCalendarEvent, 
    parseEventMetadata, 
    exportCalendarToIcs 
} from './lib/calendarAnalytics';
import ExportModal from '@/components/export/ExportModal';

export default function CalendarPage() {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const t = useTranslations();

    const todayStr = new Date().toISOString().split('T')[0];
    const currentYearMonth = todayStr.slice(0, 7);

    // Navigation & View State
    const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
    const [currentMonthKey, setCurrentMonthKey] = useState<string>(currentYearMonth);
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);

    // Layer Filters State
    const [layers, setLayers] = useState<CalendarLayerFilters>({
        events: true,
        meetings: true,
        jobs: true,
        goals: true,
        habits: true,
        finance: true,
        planner: true
    });

    // Modals and Drawers
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<UnifiedCalendarEvent | null>(null);
    const [initialModalStartTime, setInitialModalStartTime] = useState<string>('09:00');
    const [isExportOpen, setIsExportOpen] = useState(false);

    // Data State
    const [events, setEvents] = useState<UnifiedCalendarEvent[]>([]);
    const [journals, setJournals] = useState<any[]>([]);
    const [plannerTasks, setPlannerTasks] = useState<any[]>([]);
    const [financeTransactions, setFinanceTransactions] = useState<any[]>([]);
    const [habitLogs, setHabitLogs] = useState<any[]>([]);
    const [jobInterviews, setJobInterviews] = useState<any[]>([]);
    const [milestones, setMilestones] = useState<any[]>([]);

    // Fetch primary calendar and integrated data
    const fetchCalendarData = async () => {
        try {
            const res = await fetch(`/api/calendar?period=${currentMonthKey}`);
            if (res.ok) {
                const data = await res.json();
                const mapped: UnifiedCalendarEvent[] = (data.events || []).map((e: any) => {
                    const meta = parseEventMetadata(e.description || '');
                    return {
                        id: e.id,
                        title: e.title || '',
                        description: meta.cleanDescription,
                        category: (e.category || meta.category || 'personal') as any,
                        color: e.color || meta.color || '#4f46e5',
                        start_date: e.startDate ? e.startDate.split('T')[0] : (e.start_date || todayStr),
                        end_date: e.endDate ? e.endDate.split('T')[0] : (e.end_date || e.startDate?.split('T')[0] || todayStr),
                        start_time: e.startTime ? new Date(e.startTime).toISOString().substr(11, 5) : (e.start_time || '09:00'),
                        end_time: e.endTime ? new Date(e.endTime).toISOString().substr(11, 5) : (e.end_time || '10:00'),
                        is_all_day: !!e.isAllDay || !!e.is_all_day,
                        meeting_url: e.meetingUrl || meta.meetingUrl || '',
                        location: e.location || meta.location || '',
                        recurrence: e.recurrence || meta.recurrence || 'none'
                    };
                });

                setEvents(mapped);
                setJournals(data.journals || []);
                setPlannerTasks(data.plannerTasks || []);
                setFinanceTransactions(data.financeTransactions || []);
                setHabitLogs(data.habitLogs || []);
            }
        } catch (error) {
            console.error('Failed to fetch calendar data:', error);
        }
    };

    // Fetch Job interviews & Goal Milestones for 360° Life OS
    const fetchExtraLifeOsData = async () => {
        try {
            // Fetch Jobs
            const jobsRes = await fetch('/api/jobs');
            if (jobsRes.ok) {
                const jobsData = await jobsRes.json();
                const interviews = (Array.isArray(jobsData) ? jobsData : jobsData.jobs || [])
                    .filter((j: any) => j.interviewDate || j.interview_date)
                    .map((j: any) => ({
                        id: j.id,
                        company: j.company,
                        position: j.position,
                        date: (j.interviewDate || j.interview_date).split('T')[0],
                        time: j.interviewTime || j.interview_time || ''
                    }));
                setJobInterviews(interviews);
            }

            // Fetch Goals
            const goalsRes = await fetch('/api/goals');
            if (goalsRes.ok) {
                const goalsData = await goalsRes.json();
                const msList: any[] = [];
                const goalItems = Array.isArray(goalsData) ? goalsData : goalsData.goals || [];
                goalItems.forEach((g: any) => {
                    if (Array.isArray(g.milestones)) {
                        g.milestones.forEach((m: any) => {
                            if (m.targetDate || m.target_date || m.dueDate || m.due_date) {
                                msList.push({
                                    id: m.id,
                                    goalTitle: g.title,
                                    title: m.title,
                                    date: (m.targetDate || m.target_date || m.dueDate || m.due_date).split('T')[0]
                                });
                            }
                        });
                    }
                });
                setMilestones(msList);
            }
        } catch (err) {
            console.error('Failed to fetch extra life OS data:', err);
        }
    };

    useEffect(() => {
        fetchCalendarData();
        fetchExtraLifeOsData();
    }, [currentMonthKey]);

    // Layer Counts for Filter Bar Badges
    const layerCounts = useMemo(() => {
        const meetingCount = events.filter(e => !!e.meeting_url).length;
        return {
            events: events.length,
            meetings: meetingCount,
            jobs: jobInterviews.length,
            goals: milestones.length,
            habits: habitLogs.length,
            finance: financeTransactions.filter(f => f.type === 'expense').length,
            planner: plannerTasks.length
        };
    }, [events, jobInterviews, milestones, habitLogs, financeTransactions, plannerTasks]);

    // Build Monthly Grid Days Array
    const calendarDays = useMemo<MonthGridDayItem[]>(() => {
        const [year, month] = currentMonthKey.split('-').map(Number);
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        let startDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (startDayOfWeek === -1) startDayOfWeek = 6; // Monday is 0

        const days: MonthGridDayItem[] = [];

        // Previous Month Padding
        const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            const prevMonthNum = month - 1 === 0 ? 12 : month - 1;
            const prevYearNum = month - 1 === 0 ? year - 1 : year;
            const dateStr = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            days.push({
                date: dateStr,
                dayNumber: dayNum,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                events: events.filter(e => e.start_date === dateStr),
                jobInterviews: jobInterviews.filter(j => j.date === dateStr),
                milestones: milestones.filter(m => m.date === dateStr),
                plannerTasks: plannerTasks.filter(p => p.date?.startsWith(dateStr)),
                habitCount: habitLogs.filter(h => h.date?.startsWith(dateStr)).length,
                financeExpense: financeTransactions
                    .filter(f => f.date?.startsWith(dateStr) && f.type === 'expense')
                    .reduce((sum, f) => sum + Number(f.amount || 0), 0)
            });
        }

        // Current Month Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            days.push({
                date: dateStr,
                dayNumber: day,
                isCurrentMonth: true,
                isToday: dateStr === todayStr,
                events: events.filter(e => e.start_date === dateStr),
                jobInterviews: jobInterviews.filter(j => j.date === dateStr),
                milestones: milestones.filter(m => m.date === dateStr),
                plannerTasks: plannerTasks.filter(p => p.date?.startsWith(dateStr)),
                habitCount: habitLogs.filter(h => h.date?.startsWith(dateStr)).length,
                financeExpense: financeTransactions
                    .filter(f => f.date?.startsWith(dateStr) && f.type === 'expense')
                    .reduce((sum, f) => sum + Number(f.amount || 0), 0)
            });
        }

        // Next Month Padding (35 or 42 grid cells)
        const totalCellsNeeded = days.length <= 35 ? 35 : 42;
        const nextPaddingCount = totalCellsNeeded - days.length;
        for (let day = 1; day <= nextPaddingCount; day++) {
            const nextMonthNum = month + 1 > 12 ? 1 : month + 1;
            const nextYearNum = month + 1 > 12 ? year + 1 : year;
            const dateStr = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            days.push({
                date: dateStr,
                dayNumber: day,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                events: events.filter(e => e.start_date === dateStr),
                jobInterviews: jobInterviews.filter(j => j.date === dateStr),
                milestones: milestones.filter(m => m.date === dateStr),
                plannerTasks: plannerTasks.filter(p => p.date?.startsWith(dateStr)),
                habitCount: habitLogs.filter(h => h.date?.startsWith(dateStr)).length,
                financeExpense: financeTransactions
                    .filter(f => f.date?.startsWith(dateStr) && f.type === 'expense')
                    .reduce((sum, f) => sum + Number(f.amount || 0), 0)
            });
        }

        return days;
    }, [currentMonthKey, todayStr, events, jobInterviews, milestones, plannerTasks, habitLogs, financeTransactions]);

    // Modal & Action Handlers
    const handleOpenEventModal = (date?: string, startTime?: string) => {
        if (date) setSelectedDate(date);
        if (startTime) setInitialModalStartTime(startTime);
        else setInitialModalStartTime('09:00');
        setEditingEvent(null);
        setIsDetailModalOpen(false);
        setIsEventModalOpen(true);
    };

    const handleOpenEditEvent = (ev: UnifiedCalendarEvent) => {
        setSelectedDate(ev.start_date);
        setEditingEvent(ev);
        setIsDetailModalOpen(false);
        setIsEventModalOpen(true);
    };

    const handleOpenDayDetail = (date: string) => {
        setSelectedDate(date);
        setIsEventModalOpen(false);
        setIsDetailModalOpen(true);
    };

    const handleToggleLayer = (layerKey: keyof CalendarLayerFilters) => {
        setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
    };

    const handleGoToToday = () => {
        setCurrentMonthKey(currentYearMonth);
        setSelectedDate(todayStr);
    };

    // Save Event Handler
    const handleSubmitEvent = async (form: UnifiedCalendarEvent) => {
        try {
            // Encode rich metadata seamlessly
            const metaTag = `<!--META:${JSON.stringify({
                category: form.category,
                meeting_url: form.meeting_url,
                location: form.location,
                recurrence: form.recurrence
            })}-->`;
            const fullDescription = `${form.description || ''}\n${metaTag}`.trim();

            const payload = {
                title: form.title,
                description: fullDescription,
                type: form.category || 'event',
                color: form.color,
                startDate: form.start_date,
                endDate: form.end_date || form.start_date,
                isAllDay: form.is_all_day,
                startTime: form.start_time ? `1970-01-01T${form.start_time}:00.000Z` : null,
                endTime: form.end_time ? `1970-01-01T${form.end_time}:00.000Z` : null,
            };

            if (form.id) {
                const res = await fetch(`/api/calendar/${form.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    setEvents(prev => prev.map(e => e.id === form.id ? { ...e, ...form } : e));
                }
            } else {
                const res = await fetch('/api/calendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    const newEv: UnifiedCalendarEvent = { ...form, id: data.id || `ev_${Date.now()}` };
                    setEvents(prev => [...prev, newEv]);
                }
            }
        } catch (error) {
            console.error('Failed to save event:', error);
        }
        setIsEventModalOpen(false);
    };

    // Delete Event Handler
    const handleDeleteEvent = async (id: number | string) => {
        const confirmMsg = isIndo 
            ? 'Hapus agenda ini dari kalender?' 
            : 'Delete this event from the calendar?';
            
        if (typeof window !== 'undefined' && window.confirm(confirmMsg)) {
            try {
                await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
                setEvents(prev => prev.filter(e => e.id !== id));
                setIsDetailModalOpen(false);
            } catch (error) {
                console.error('Failed to delete event:', error);
            }
        }
    };

    // 1-Click Schedule Planner Task into Calendar
    const handleScheduleTaskToCalendar = (task: any) => {
        setEditingEvent({
            id: '',
            title: `[Focus] ${task.title}`,
            start_date: selectedDate,
            end_date: selectedDate,
            start_time: '10:00',
            end_time: '11:00',
            is_all_day: false,
            color: '#0ea5e9',
            category: 'deepwork',
            meeting_url: '',
            location: '',
            recurrence: 'none',
            description: task.description || (isIndo ? 'Sesi fokus deep work untuk menyelesaikan tugas planner.' : 'Dedicated deep work focus block for planner task.')
        });
        setIsTaskDrawerOpen(false);
        setIsEventModalOpen(true);
    };

    // Export .ICS
    const handleExportIcs = () => {
        exportCalendarToIcs(events, `Tranvas_Calendar_${currentMonthKey}.ics`);
    };

    // Day detail selected items
    const selectedDayEvents = events.filter(e => e.start_date === selectedDate);
    const selectedDayInterviews = jobInterviews.filter(j => j.date === selectedDate);
    const selectedDayMilestones = milestones.filter(m => m.date === selectedDate);
    const selectedDayPlanner = plannerTasks.filter(p => p.date?.startsWith(selectedDate));
    const selectedDayHabitLogs = habitLogs.filter(h => h.date?.startsWith(selectedDate));
    const selectedDayHabits = selectedDayHabitLogs.length;
    const selectedDayFinance = financeTransactions
        .filter(f => f.date?.startsWith(selectedDate) && f.type === 'expense')
        .reduce((sum, f) => sum + Number(f.amount || 0), 0);

    return (
        <AuthenticatedLayout>
            <GatedPage feature="calendar">
                <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16 relative overflow-x-hidden transition-colors duration-500">
                    
                    {/* Header */}
                    <CalendarHeader
                        currentMonth={currentMonthKey}
                        onChangeMonth={setCurrentMonthKey}
                        onAddEvent={() => handleOpenEventModal(selectedDate)}
                        onOpenTaskDrawer={() => setIsTaskDrawerOpen(true)}
                        onGoToToday={handleGoToToday}
                        onOpenExportModal={() => setIsExportOpen(true)}
                    />

                    {/* Main Container */}
                    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 min-w-0">
                        <NeuralBridge module="Calendar" />

                        {/* Filter Bar & View Switcher */}
                        <CalendarFilterBar
                            activeView={viewMode}
                            onViewChange={setViewMode}
                            layers={layers}
                            onToggleLayer={handleToggleLayer}
                            layerCounts={layerCounts}
                            onExportIcs={handleExportIcs}
                        />

                        {/* View Mode 1: Month Grid */}
                        {viewMode === 'month' && (
                            <CalendarMonthView
                                days={calendarDays}
                                selectedDate={selectedDate}
                                layers={layers}
                                onSelectDate={setSelectedDate}
                                onOpenDayDetail={handleOpenDayDetail}
                                onAddEventOnDate={(d) => handleOpenEventModal(d)}
                            />
                        )}

                        {/* View Mode 2: Week 24h Time Grid */}
                        {viewMode === 'week' && (
                            <CalendarWeekView
                                currentDate={selectedDate}
                                events={events}
                                layers={layers}
                                onSelectDate={setSelectedDate}
                                onOpenDayDetail={handleOpenDayDetail}
                                onOpenEventModal={handleOpenEventModal}
                                onEditEvent={handleOpenEditEvent}
                            />
                        )}

                        {/* View Mode 3: Day Focused Schedule */}
                        {viewMode === 'day' && (
                            <CalendarDayView
                                date={selectedDate}
                                events={events}
                                plannerTasks={plannerTasks}
                                habitLogs={habitLogs}
                                milestones={milestones}
                                financeTransactions={financeTransactions}
                                onDateChange={setSelectedDate}
                                onOpenEventModal={handleOpenEventModal}
                                onEditEvent={handleOpenEditEvent}
                                onScheduleTaskToCalendar={handleScheduleTaskToCalendar}
                            />
                        )}

                        {/* View Mode 4: Agenda List Stream */}
                        {viewMode === 'agenda' && (
                            <CalendarAgendaView
                                events={events}
                                onOpenEventModal={handleOpenEventModal}
                                onEditEvent={handleOpenEditEvent}
                                onDeleteEvent={handleDeleteEvent}
                            />
                        )}

                    </div>

                    {/* Event Modal (Create / Edit) */}
                    <CalendarEventModal
                        show={isEventModalOpen}
                        event={editingEvent}
                        initialDate={selectedDate}
                        initialStartTime={initialModalStartTime}
                        onClose={() => setIsEventModalOpen(false)}
                        onSubmit={handleSubmitEvent}
                    />

                    {/* 360° Day Detail Modal */}
                    {isDetailModalOpen && (
                        <CalendarDayDetail
                            date={selectedDate}
                            events={selectedDayEvents}
                            jobInterviews={selectedDayInterviews}
                            milestones={selectedDayMilestones}
                            plannerTasks={selectedDayPlanner}
                            habitCount={selectedDayHabits}
                            completedHabits={selectedDayHabitLogs}
                            financeExpense={selectedDayFinance}
                            onClose={() => setIsDetailModalOpen(false)}
                            onAddEvent={() => handleOpenEventModal(selectedDate)}
                            onEditEvent={handleOpenEditEvent}
                            onDeleteEvent={handleDeleteEvent}
                        />
                    )}

                    {/* Task Time-Blocking Drawer */}
                    <CalendarTaskDrawer
                        isOpen={isTaskDrawerOpen}
                        onClose={() => setIsTaskDrawerOpen(false)}
                        plannerTasks={plannerTasks}
                        onScheduleTask={handleScheduleTaskToCalendar}
                    />

                    {/* Universal Export Modal (CSV & JSON) */}
                    <ExportModal
                        isOpen={isExportOpen}
                        onClose={() => setIsExportOpen(false)}
                        moduleType="calendar"
                        currentData={events}
                    />

                </div>
            </GatedPage>
        </AuthenticatedLayout>
    );
}
