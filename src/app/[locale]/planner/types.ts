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

export interface ScheduledInterviewItem {
    id: string | number;
    jobId: number | string;
    company: string;
    jobTitle: string;
    roundTitle: string;
    roundType: string;
    scheduledAt: string;
    startTime: string;
    endTime: string;
    interviewerName?: string;
    meetingLink?: string;
    status: string;
    notes?: string;
}

export interface ScheduledStudyItem {
    id: string;
    courseName: string;
    title: string;
    dueDate: string;
    startTime: string;
    endTime: string;
    type: string;
    priority: string;
    completed: boolean;
    description?: string;
}
