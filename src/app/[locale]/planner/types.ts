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
