import { HabitItem, ProcessedHabitItem, MonthDateItem, DayInfo } from '../types';

export function getHabitDayInfo(habit: HabitItem, day: MonthDateItem): DayInfo {
    const isScheduled = Boolean(habit.frequencyType !== 'weekly_days' || (habit.frequencyDays && habit.frequencyDays.includes(day.dayIndex)));
    const log = habit.logs[day.dateString];
    const rawStatus = log?.status || 'empty';
    const value = log?.value;
    const notes = log?.notes;

    let status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest' = rawStatus;

    if (habit.habitType === 'negative') {
        // For quit habit, if not relapse, past and today are clean by default
        if (rawStatus === 'relapse') {
            status = 'relapse';
        } else if (!day.isFuture) {
            status = 'completed'; // Clean
        }
    } else {
        if (!isScheduled && rawStatus === 'empty') {
            status = 'rest';
        }
    }

    return { status, isScheduled, value, notes, hasNote: Boolean(notes && notes.length > 0) };
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
    const todayDayNum = mkYear === todayYear && mkMonth === todayMonth ? todayDay : daysInCurrentMonth;

    return habits.map(h => {
        let completedCount = 0;
        let scheduledDaysCount = 0;

        monthDates.forEach(day => {
            const info = getHabitDayInfo(h, day);
            if (info.isScheduled) {
                scheduledDaysCount++;
                if (info.status === 'completed') {
                    completedCount++;
                }
            }
        });

        const effectiveTarget = h.frequencyType === 'weekly_days'
            ? scheduledDaysCount
            : h.monthlyTarget;
        const progressPercent = Math.min(100, Math.round((completedCount / (effectiveTarget || 1)) * 100));

        // 1. Calculate Active Streak (Rest Day Resilient)
        let streak = 0;
        let bestStreak = 0;
        let tempStreak = 0;

        for (let d = 1; d <= todayDayNum; d++) {
            const dayObj = monthDates[d - 1];
            if (!dayObj) continue;
            const info = getHabitDayInfo(h, dayObj);

            if (h.habitType === 'negative') {
                if (info.status !== 'relapse') {
                    tempStreak++;
                    if (tempStreak > bestStreak) bestStreak = tempStreak;
                } else {
                    tempStreak = 0;
                }
            } else {
                if (info.status === 'completed') {
                    tempStreak++;
                    if (tempStreak > bestStreak) bestStreak = tempStreak;
                } else if (info.status === 'rest') {
                    // Rest day does NOT break streak!
                    continue;
                } else {
                    tempStreak = 0;
                }
            }
        }

        // Streak counting backwards from today
        for (let d = todayDayNum; d >= 1; d--) {
            const dayObj = monthDates[d - 1];
            if (!dayObj) continue;
            const info = getHabitDayInfo(h, dayObj);

            if (h.habitType === 'negative') {
                if (info.status !== 'relapse') streak++;
                else break;
            } else {
                if (info.status === 'completed') {
                    streak++;
                } else if (info.status === 'rest') {
                    // Keep walking past rest days
                    continue;
                } else {
                    break;
                }
            }
        }

        // 2. Calculate Loop Habit Strength Index (Exponential Smoothing)
        let strength = 0.5; // Starts at 50%
        for (let d = 1; d <= todayDayNum; d++) {
            const dayObj = monthDates[d - 1];
            if (!dayObj) continue;
            const info = getHabitDayInfo(h, dayObj);

            if (info.status === 'rest') {
                // Carry over previous strength without penalty
                continue;
            } else if (info.status === 'completed') {
                strength = strength * 0.95 + 1.0 * 0.05;
            } else if (info.status === 'relapse' || info.status === 'empty' || info.status === 'skipped') {
                strength = strength * 0.95 + 0.0 * 0.05;
            }
        }
        const habitStrength = Math.round(strength * 100);

        return {
            ...h,
            progress_count: completedCount,
            progress_percent: progressPercent,
            streak,
            best_streak: Math.max(bestStreak, streak),
            habit_strength: habitStrength,
            is_stagnant: completedCount === 0 && todayDayNum > 7
        };
    });
}
