import { HabitItem, ProcessedHabitItem, MonthDateItem, DayInfo } from '../types';

export function getHabitDayInfo(habit: HabitItem, day: MonthDateItem): DayInfo {
    const isScheduled = Boolean(habit.frequencyType !== 'weekly_days' || (habit.frequencyDays && habit.frequencyDays.includes(day.dayIndex)));
    const log = habit.logs[day.dateString];
    const rawStatus = log?.status || 'empty';
    const value = log?.value;
    const notes = log?.notes;

    let status: DayInfo['status'] = rawStatus;

    if (habit.measurementType === 'numeric') {
        const target = habit.targetValue || 10;
        if (typeof value === 'number') {
            if (value >= target) {
                status = 'completed';
            } else if (value > 0) {
                status = 'in_progress';
            } else if (rawStatus === 'completed') {
                status = 'completed';
            } else if (rawStatus === 'in_progress') {
                status = 'in_progress';
            } else if (rawStatus === 'empty' && !isScheduled) {
                status = 'rest';
            } else {
                status = 'empty';
            }
        } else if (rawStatus === 'completed') {
            status = 'completed';
        } else if (rawStatus === 'in_progress') {
            status = 'in_progress';
        } else if (rawStatus === 'empty' && !isScheduled) {
            status = 'rest';
        }
    } else if (rawStatus === 'empty' && !isScheduled) {
        // Only unscheduled empty days become 'rest'
        status = 'rest';
    }

    const effectiveVal = habit.measurementType === 'numeric'
        ? (typeof value === 'number' 
            ? value 
            : (status === 'completed' 
                ? (habit.targetValue || 10) 
                : (status === 'in_progress' ? 1 : 0)))
        : value;

    return { 
        status, 
        isScheduled, 
        value: effectiveVal, 
        notes, 
        hasNote: Boolean(notes && notes.length > 0) 
    };
}

export function calculateMonthDates(currentMonthKey: string, todayStr: string, isIndo: boolean): MonthDateItem[] {
    const [mkYear, mkMonth] = currentMonthKey.split('-').map(Number);
    const daysInCurrentMonth = new Date(mkYear, mkMonth, 0).getDate();
    const todayObj = new Date();
    const todayYear = todayObj.getFullYear();
    const todayMonth = String(todayObj.getMonth() + 1).padStart(2, '0');
    const initialMonthKey = `${todayYear}-${todayMonth}`;
    const currentTodayDay = todayObj.getDate();
    const dayNames = isIndo ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Array.from({ length: daysInCurrentMonth }, (_, i) => {
        const dayNum = i + 1;
        const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
        const dateString = `${mkYear}-${String(mkMonth).padStart(2, '0')}-${formattedDay}`;
        const dateObj = new Date(mkYear, mkMonth - 1, dayNum);
        const dayIndex = dateObj.getDay();
        const dayName = dayNames[dayIndex];
        return {
            dayNum,
            dayNumber: dayNum,
            dayName,
            dayIndex,
            dateString,
            isToday: dateString === todayStr,
            isFuture: currentMonthKey === initialMonthKey ? dayNum > currentTodayDay : (currentMonthKey > initialMonthKey)
        };
    });
}

export function calculateScheduledDays(days: number[], currentMonthKey: string): number {
    const [mkYear, mkMonth] = currentMonthKey.split('-').map(Number);
    const daysInCurrentMonth = new Date(mkYear, mkMonth, 0).getDate();
    let count = 0;
    for (let d = 1; d <= daysInCurrentMonth; d++) {
        const dateObj = new Date(mkYear, mkMonth - 1, d);
        if (days.includes(dateObj.getDay())) count++;
    }
    return count;
}

export function processHabitsMetrics(
    habits: HabitItem[],
    monthDates: MonthDateItem[],
    currentMonthKey: string
): ProcessedHabitItem[] {
    const [mkYear, mkMonth] = currentMonthKey.split('-').map(Number);
    const todayObj = new Date();
    const todayYear = todayObj.getFullYear();
    const todayMonth = todayObj.getMonth() + 1;
    const todayDay = todayObj.getDate();
    const daysInCurrentMonth = monthDates.length;

    const isCurrentMonth = mkYear === todayYear && mkMonth === todayMonth;
    const isPastMonth = mkYear < todayYear || (mkYear === todayYear && mkMonth < todayMonth);
    const isFutureMonth = mkYear > todayYear || (mkYear === todayYear && mkMonth > todayMonth);

    const activeDayIndex = isCurrentMonth ? todayDay : (isPastMonth ? daysInCurrentMonth : 0);

    return habits.map(h => {
        let completedCount = 0;
        let scheduledDaysCount = 0;

        monthDates.forEach(day => {
            const info = getHabitDayInfo(h, day);
            if (info.isScheduled) {
                scheduledDaysCount++;
            }
            if (info.status === 'completed') {
                completedCount++;
            }
        });

        const effectiveTarget = h.frequencyType === 'weekly_days'
            ? scheduledDaysCount
            : (h.monthlyTarget || daysInCurrentMonth);
        const progressPercent = Math.min(100, Math.round((completedCount / (effectiveTarget || 1)) * 100));

        // 1. Calculate Best Streak & Running Streak
        let bestStreak = 0;
        let runningStreak = 0;

        for (let d = 1; d <= activeDayIndex; d++) {
            const dayObj = monthDates[d - 1];
            if (!dayObj) continue;
            const info = getHabitDayInfo(h, dayObj);

            if (info.status === 'completed') {
                runningStreak++;
                if (runningStreak > bestStreak) bestStreak = runningStreak;
            } else if (info.status === 'rest') {
                // Rest day carries over streak without breaking or incrementing
                continue;
            } else {
                runningStreak = 0;
            }
        }

        // Current Active Streak (walk backwards from today or yesterday if today is unlogged)
        let currentStreak = 0;
        if (activeDayIndex > 0) {
            const todayDayObj = monthDates[activeDayIndex - 1];
            const todayInfo = todayDayObj ? getHabitDayInfo(h, todayDayObj) : null;
            
            let startD = activeDayIndex;
            if (isCurrentMonth && todayInfo && (todayInfo.status === 'empty' || todayInfo.status === 'rest')) {
                startD = activeDayIndex - 1;
            }

            for (let d = startD; d >= 1; d--) {
                const dayObj = monthDates[d - 1];
                if (!dayObj) continue;
                const info = getHabitDayInfo(h, dayObj);

                if (info.status === 'completed') {
                    currentStreak++;
                } else if (info.status === 'rest') {
                    continue;
                } else {
                    break;
                }
            }
        }

        // 2. Calculate Loop Habit Strength Index (0 to 100%)
        let habitStrength = 0;
        if (completedCount > 0 && activeDayIndex > 0) {
            let strengthScore = 0;
            let totalWeight = 0;
            for (let d = 1; d <= activeDayIndex; d++) {
                const dayObj = monthDates[d - 1];
                if (!dayObj) continue;
                const info = getHabitDayInfo(h, dayObj);
                const weight = Math.pow(1.05, d);
                totalWeight += weight;

                if (info.status === 'completed') {
                    strengthScore += weight;
                } else if (info.status === 'rest') {
                    strengthScore += weight * 0.7;
                }
            }
            habitStrength = Math.min(100, Math.round((strengthScore / (totalWeight || 1)) * 100));
        }

        return {
            ...h,
            progress_count: completedCount,
            progress_percent: progressPercent,
            streak: currentStreak,
            best_streak: Math.max(bestStreak, currentStreak),
            habit_strength: habitStrength,
            is_stagnant: completedCount === 0 && activeDayIndex > 7
        };
    });
}
