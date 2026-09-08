export interface HabitItem {
    id: number;
    name: string;
    icon: string;
    color: string;
    period: string;
    monthlyTarget: number;
    position: number;
    status?: string;
    habitType?: 'positive' | 'negative';
    measurementType?: 'boolean' | 'numeric';
    unit?: string;
    targetValue?: number;
    frequencyType?: 'daily' | 'weekly_days';
    frequencyDays?: number[]; // [0, 1, 2, 3, 4, 5, 6] where 0=Sun, 1=Mon, ...
    frequencyCount?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
    logs: Record<string, {
        status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest';
        value?: number;
        notes?: string;
    }>;
}

export interface ProcessedHabitItem extends HabitItem {
    progress_count: number;
    progress_percent: number;
    streak: number;
    best_streak: number;
    habit_strength: number;
    is_stagnant: boolean;
}

export interface MonthDateItem {
    dayNum: number;
    dayNumber: number;
    dayName: string;
    dayIndex: number;
    dateString: string;
    isToday: boolean;
    isFuture: boolean;
}

export interface DayInfo {
    status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest';
    isScheduled: boolean;
    value?: number;
    notes?: string;
    hasNote: boolean;
}
