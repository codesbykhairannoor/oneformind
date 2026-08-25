'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid, { CalendarDayItem, CalendarEvent } from './components/CalendarGrid';
import CalendarEventModal from './components/CalendarEventModal';
import CalendarDayDetail from './components/CalendarDayDetail';
import NeuralBridge from '@/components/NeuralBridge';

export default function CalendarPage() {
    const t = useTranslations();

    const todayStr = new Date().toISOString().split('T')[0];
    const currentYearMonth = todayStr.slice(0, 7);

    const [currentMonthKey, setCurrentMonthKey] = useState(currentYearMonth);
    const [selectedDate, setSelectedDate] = useState(todayStr);

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Initial Events State
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: 1,
            title: 'Full-Stack Life OS Launch Strategy',
            start_date: todayStr,
            end_date: todayStr,
            start_time: '10:00',
            end_time: '11:30',
            is_all_day: false,
            color: '#4f46e5',
            description: 'Comprehensive review of all Next.js 16 modular features & 1:1 UI migrations.'
        },
        {
            id: 2,
            title: 'Deep Work Sprint: Goal & Calendar Suite',
            start_date: todayStr,
            end_date: todayStr,
            start_time: '14:00',
            end_time: '17:00',
            is_all_day: false,
            color: '#10b981',
            description: 'Finalize pixel-perfect 1:1 Vue component translations to Next.js Client Components.'
        }
    ]);

    // Build Calendar Grid Days Generator
    const generateCalendarDays = (yearMonth: string): CalendarDayItem[] => {
        const [year, month] = yearMonth.split('-').map(Number);
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Day of week index for 1st of month (Monday = 0 ... Sunday = 6)
        let startDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (startDayOfWeek === -1) startDayOfWeek = 6; // Adjust for Sunday

        const days: CalendarDayItem[] = [];

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
                milestones: [],
                hasJournal: false,
                habitDone: 0,
                planner: null,
                expense: 0
            });
        }

        // Current Month Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.start_date === dateStr);
            const isToday = dateStr === todayStr;

            days.push({
                date: dateStr,
                dayNumber: day,
                isCurrentMonth: true,
                isToday,
                events: dayEvents,
                milestones: isToday ? [
                    { id: 101, title: 'Implementasi 1:1 Calendar Suite', goal_title: 'Membangun Arsitektur Full-Stack Life OS', goal_color: '#6366f1', completed: true }
                ] : [],
                hasJournal: isToday,
                habitDone: isToday ? 4 : 0,
                planner: isToday ? { total: 5, done: 4 } : null,
                expense: isToday ? 150000 : 0
            });
        }

        // Next Month Padding to complete 35 or 42 grid cells
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
                milestones: [],
                hasJournal: false,
                habitDone: 0,
                planner: null,
                expense: 0
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays(currentMonthKey);

    // Handlers
    const handleChangeMonth = (newMonth: string) => {
        setCurrentMonthKey(newMonth);
    };

    const handleOpenEventModal = (date?: string) => {
        if (date) setSelectedDate(date);
        setEditingEvent(null);
        setIsDetailModalOpen(false);
        setIsEventModalOpen(true);
    };

    const handleOpenEditEvent = (date: string, ev: CalendarEvent) => {
        setSelectedDate(date);
        setEditingEvent(ev);
        setIsDetailModalOpen(false);
        setIsEventModalOpen(true);
    };

    const handleOpenDayDetail = (date: string) => {
        setSelectedDate(date);
        setIsEventModalOpen(false);
        setIsDetailModalOpen(true);
    };

    const handleSubmitEvent = (form: CalendarEvent) => {
        if (form.id) {
            setEvents(prev => prev.map(e => e.id === form.id ? { ...e, ...form } : e));
        } else {
            const newEv: CalendarEvent = {
                ...form,
                id: Date.now()
            };
            setEvents(prev => [...prev, newEv]);
        }
        setIsEventModalOpen(false);
    };

    const handleDeleteEvent = (id: number | string) => {
        if (typeof window !== 'undefined' && window.confirm('Hapus event ini dari kalender?')) {
            setEvents(prev => prev.filter(e => e.id !== id));
            setIsDetailModalOpen(false);
        }
    };

    return (
        <AuthenticatedLayout>
            {/* 1:1 from Calendar/Index.vue line 124-158 */}
            <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-12 relative overflow-x-hidden transition-colors duration-500">
                
                <CalendarHeader 
                    currentMonth={currentMonthKey}
                    onChangeMonth={handleChangeMonth}
                    onAddEvent={() => handleOpenEventModal(selectedDate)}
                />

                <div className="w-full max-w-[1600px] mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 min-w-0">
                    <NeuralBridge module="Calendar" />
                    
                    <CalendarGrid 
                        calendarDays={calendarDays}
                        selectedDate={selectedDate}
                        onOpenDetail={handleOpenDayDetail}
                        onOpenEventModal={handleOpenEventModal}
                    />
                </div>

                <CalendarEventModal 
                    show={isEventModalOpen}
                    event={editingEvent}
                    initialDate={selectedDate}
                    onClose={() => setIsEventModalOpen(false)}
                    onSubmit={handleSubmitEvent}
                />

                <CalendarDayDetail 
                    show={isDetailModalOpen}
                    date={selectedDate}
                    calendarDays={calendarDays}
                    onClose={() => setIsDetailModalOpen(false)}
                    onEditEvent={handleOpenEditEvent}
                    onDeleteEvent={handleDeleteEvent}
                />

            </div>
        </AuthenticatedLayout>
    );
}
