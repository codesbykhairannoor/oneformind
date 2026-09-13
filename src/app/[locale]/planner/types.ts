export interface TaskItem {
    id: number;
    date: string;
    title: string;
    start_time: string;
    end_time: string;
    type: number;
    notes?: string;
    completed: boolean;
}

export interface InboxTask {
    id: number;
    title: string;
    completed: boolean;
    type: number;
}

export interface BatchTaskInput {
    title: string;
    start_time: string;
    end_time: string;
    type: number;
}

export interface ScheduledHabitItem {
    id: number;
    name: string;
    icon: string;
    color: string;
    startTime: string;
    endTime: string;
    completed: boolean;
    streak: number;
    notes?: string;
}
