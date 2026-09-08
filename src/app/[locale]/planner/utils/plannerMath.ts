import { TaskItem } from '../types';

export const normalizeTime = (timeVal: any): string => {
    if (!timeVal) return '';
    const str = String(timeVal).trim();
    if (str.includes('T')) {
        const timePart = str.split('T')[1];
        return timePart.substring(0, 5);
    }
    const parts = str.split(':');
    if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return str.substring(0, 5);
};

export const normalizeDate = (d: any): string => {
    if (!d) return '';
    return String(d).split('T')[0];
};

export const timeToMin = (tStr: string): number => {
    if (!tStr) return 0;
    const [h, m] = tStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

export const checkTimeConflict = (
    start: string,
    end: string,
    tasks: TaskItem[],
    selectedDate: string,
    excludeId?: number | null,
    minDurationMsg?: string,
    conflictMsg?: string
): string | null => {
    if (!start || !end) return null;
    const newStart = timeToMin(start);
    let newEnd = timeToMin(end);
    if (newEnd < newStart) newEnd += 1440;

    const duration = newEnd - newStart;
    if (duration < 5) {
        return minDurationMsg || 'Minimal 5 menit!';
    }

    const hasConflict = tasks.some(task => {
        if (excludeId && task.id === excludeId) return false;
        if (task.date !== selectedDate) return false;
        if (!task.start_time || !task.end_time) return false;

        const taskStart = timeToMin(task.start_time);
        let taskEnd = timeToMin(task.end_time);
        if (taskEnd < taskStart) taskEnd += 1440;

        return (newStart < taskEnd && newEnd > taskStart);
    });

    if (hasConflict) return conflictMsg || 'Jadwal bentrok!';
    return null;
};
