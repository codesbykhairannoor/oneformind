'use client';

import { useMemo, useEffect } from 'react';
import { HabitItem, MonthDateItem } from '../types';
import { getHabitDayInfo, processHabitsMetrics } from '../utils/habitMath';
import { playTriumphSound, triggerConfetti } from '@/lib/habitAudio';

interface UseHabitsCalculationProps {
    habits: HabitItem[];
    monthDates: MonthDateItem[];
    currentMonthKey: string;
    activeFilter: 'all' | 'morning' | 'afternoon' | 'evening' | 'quit';
    todayStr: string;
    daysInCurrentMonth: number;
    mkYear: number;
    mkMonth: number;
    todayYear: number;
    todayMonth: string;
    todayDay: string;
    isLoaded: boolean;
}

export function useHabitsCalculation({
    habits,
    monthDates,
    currentMonthKey,
    activeFilter,
    todayStr,
    daysInCurrentMonth,
    mkYear,
    mkMonth,
    todayYear,
    todayMonth,
    todayDay,
    isLoaded
}: UseHabitsCalculationProps) {
    const processedHabits = useMemo(() => {
        return processHabitsMetrics(habits, monthDates, currentMonthKey);
    }, [habits, monthDates, currentMonthKey]);

    const filteredHabits = useMemo(() => {
        if (activeFilter === 'all') return processedHabits;
        if (activeFilter === 'quit') return processedHabits.filter(h => h.habitType === 'negative');
        return processedHabits.filter(h => h.timeOfDay === activeFilter);
    }, [processedHabits, activeFilter]);

    const overallPercentage = Math.round(
        processedHabits.reduce((acc, h) => acc + (h.progress_percent || 0), 0) / (processedHabits.length || 1)
    );

    const topHabit = [...processedHabits].sort((a, b) => (b.progress_count || 0) - (a.progress_count || 0))[0];
    const totalCompletions = processedHabits.reduce((acc, h) => acc + (h.progress_count || 0), 0);

    // Active Streak calculation across all habits
    let currentStreak = 0;
    const isCurrentMonth = mkYear === todayYear && mkMonth === parseInt(todayMonth);
    const todayDayNumForStreak = isCurrentMonth ? parseInt(todayDay) : daysInCurrentMonth;
    
    // If today has completed habits, start from today; if not, check from yesterday so ongoing streak doesn't reset in the morning
    const todayDayObj = monthDates[todayDayNumForStreak - 1];
    const todayHasDone = todayDayObj ? processedHabits.some(h => getHabitDayInfo(h, todayDayObj).status === 'completed') : false;
    const startStreakDay = isCurrentMonth && !todayHasDone ? todayDayNumForStreak - 1 : todayDayNumForStreak;

    for (let d = startStreakDay; d >= 1; d--) {
        const dayObj = monthDates[d - 1];
        if (!dayObj) continue;
        const anyDone = processedHabits.some(h => getHabitDayInfo(h, dayObj).status === 'completed');
        if (anyDone) currentStreak++;
        else break;
    }

    // Perfect Days Count (Day where all scheduled habits were completed, and at least 1 habit was completed)
    let perfectDaysCount = 0;
    for (let d = 1; d <= todayDayNumForStreak; d++) {
        const dayObj = monthDates[d - 1];
        if (!dayObj) continue;
        const hasAtLeastOneDone = processedHabits.some(h => getHabitDayInfo(h, dayObj).status === 'completed');
        const allScheduledDone = processedHabits.length > 0 && processedHabits.every(h => {
            const info = getHabitDayInfo(h, dayObj);
            return !info.isScheduled || info.status === 'completed' || info.status === 'rest';
        });
        if (hasAtLeastOneDone && allScheduledDone) perfectDaysCount++;
    }

    // Today Progress
    const todayObjInfo = monthDates.find(d => d.dateString === todayStr);
    const todayScheduledHabits = todayObjInfo ? processedHabits.filter(h => getHabitDayInfo(h, todayObjInfo).isScheduled) : processedHabits;
    const todayCompletedCount = todayObjInfo
        ? todayScheduledHabits.filter(h => getHabitDayInfo(h, todayObjInfo).status === 'completed').length
        : 0;
    const todayProgress = Math.round((todayCompletedCount / (todayScheduledHabits.length || 1)) * 100);

    // Celebration on 100% daily completion
    useEffect(() => {
        if (todayProgress === 100 && todayScheduledHabits.length > 0 && isLoaded) {
            playTriumphSound();
            triggerConfetti();
        }
    }, [todayProgress, todayScheduledHabits.length, isLoaded]);

    return {
        processedHabits,
        filteredHabits,
        overallPercentage,
        topHabit,
        totalCompletions,
        currentStreak,
        perfectDaysCount,
        todayProgress,
        todayCompletedCount,
        todayScheduledHabits
    };
}
