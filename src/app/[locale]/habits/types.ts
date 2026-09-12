export type LifeOSTab = 'calendar' | 'planner' | 'goal' | 'study' | 'jobs' | 'gym' | 'finance' | 'journal';

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
    // Systemic Life OS Cross-Domain Fields
    goalId?: number | string;
    goalTitle?: string;
    anchorCue?: string; // e.g. "Setelah Bangun Tidur", "Sebelum Mulai Kerja", "Setelah Makan Siang", "Sebelum Tidur"
    elasticMini?: string; // 2-Minute Rule fallback version when days are overloaded
    dailyFinancialImpact?: number; // Estimated IDR saved/earned per completed day
    isKeystone?: boolean; // Catalyst habit that triggers other positive behaviors
    syncedTabs?: LifeOSTab[]; // Explicitly selected connected tabs/modules
    logs: Record<string, {
        status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest' | 'in_progress';
        value?: number;
        notes?: string;
    }>;
    // Optional computed metrics
    progress_count?: number;
    progress_percent?: number;
    streak?: number;
    best_streak?: number;
    habit_strength?: number;
    is_stagnant?: boolean;
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
    status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest' | 'in_progress';
    isScheduled: boolean;
    value?: number;
    notes?: string;
    hasNote: boolean;
}

export interface BatchRow {
    name: string;
    icon: string;
    color: string;
    target: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

