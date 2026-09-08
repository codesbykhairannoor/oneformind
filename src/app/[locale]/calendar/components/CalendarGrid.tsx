'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import CalendarFilterBar, { CalendarFilters } from './CalendarFilterBar';
import CalendarMobileView from './CalendarMobileView';
import CalendarDesktopGrid from './CalendarDesktopGrid';

export interface CalendarEvent {
    id: number | string;
    title: string;
    start_date?: string;
    end_date?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    is_all_day?: boolean;
    color?: string;
    description?: string | null;
}

export interface CalendarMilestone {
    id: number | string;
    title: string;
    goal_title?: string;
    goal_color?: string;
    completed?: boolean;
    is_completed?: boolean;
}

export interface CalendarDayItem {
    date: string; // YYYY-MM-DD
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events?: CalendarEvent[];
    milestones?: CalendarMilestone[];
    hasJournal?: boolean;
    habitDone?: number;
    planner?: {
        total: number;
        done: number;
    } | null;
    expense?: number;
}

interface CalendarGridProps {
    calendarDays: CalendarDayItem[];
    selectedDate: string;
    onOpenDetail: (date: string) => void;
    onOpenEventModal: (date?: string) => void;
}

export default function CalendarGrid({
    calendarDays, selectedDate, onOpenDetail
}: CalendarGridProps) {
    const t = useTranslations();

    const [filters, setFilters] = useState<CalendarFilters>({
        events: true,
        journal: true,
        habits: true,
        planner: true,
        finance: true,
        goals: true
    });

    const toggleFilter = (key: keyof CalendarFilters) => {
        setFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const selectedDay = calendarDays.find(d => d.date === selectedDate);

    const activeMetricsCount = (day: CalendarDayItem) => {
        let count = 0;
        if (filters.journal && day.hasJournal) count++;
        if (filters.habits && (day.habitDone || 0) > 0) count++;
        if (filters.planner && day.planner && day.planner.total > 0) count++;
        if (filters.finance && (day.expense || 0) > 0) count++;
        if (filters.goals && (day.milestones?.length || 0) > 0) count++;
        return count;
    };

    const hasAnyMetric = (day: CalendarDayItem) => {
        return activeMetricsCount(day) > 0 || (filters.events && (day.events?.length || 0) > 0);
    };

    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const compactCurrency = (value?: number) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID', { 
            notation: 'compact', 
            maximumFractionDigits: 1 
        }).format(value);
    };

    const formatDateDisplay = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <CalendarFilterBar
                filters={filters}
                toggleFilter={toggleFilter}
                t={t}
            />

            <CalendarMobileView
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                selectedDay={selectedDay}
                filters={filters}
                weekDays={weekDays}
                onOpenDetail={onOpenDetail}
                hasAnyMetric={hasAnyMetric}
                formatDateDisplay={formatDateDisplay}
                compactCurrency={compactCurrency}
            />

            <CalendarDesktopGrid
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                filters={filters}
                weekDays={weekDays}
                onOpenDetail={onOpenDetail}
                hasAnyMetric={hasAnyMetric}
                compactCurrency={compactCurrency}
                t={t}
            />
        </div>
    );
}
