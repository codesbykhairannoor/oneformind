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
    return String(d).split('T')[0].split(' ')[0];
};

export const timeToMin = (tStr: string): number => {
    if (!tStr) return 0;
    const clean = normalizeTime(tStr);
    const [h, m] = clean.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

export interface TimeConflictResult {
    hasConflict: boolean;
    errorMsg: string | null;
    conflictingTask?: TaskItem;
}

export const checkTimeConflictDetails = (
    start: string,
    end: string,
    tasks: TaskItem[],
    selectedDate: string,
    excludeId?: number | null,
    isIndo: boolean = true
): TimeConflictResult => {
    if (!start || !end) return { hasConflict: false, errorMsg: null };

    const cleanSelectedDate = normalizeDate(selectedDate);
    const newStart = timeToMin(start);
    let newEnd = timeToMin(end);
    if (newEnd < newStart) newEnd += 1440;

    const duration = newEnd - newStart;
    if (duration < 5) {
        return {
            hasConflict: true,
            errorMsg: isIndo ? 'Minimal durasi kegiatan adalah 5 menit!' : 'Minimum activity duration is 5 minutes!'
        };
    }

    const conflictingTask = (tasks || []).find(task => {
        if (!task) return false;
        if (excludeId && Number(task.id) === Number(excludeId)) return false;
        
        // Strict date normalization match
        const taskCleanDate = normalizeDate(task.date);
        if (taskCleanDate !== cleanSelectedDate) return false;
        if (!task.start_time || !task.end_time) return false;

        const taskStart = timeToMin(task.start_time);
        let taskEnd = timeToMin(task.end_time);
        if (taskEnd < taskStart) taskEnd += 1440;

        return (newStart < taskEnd && newEnd > taskStart);
    });

    if (conflictingTask) {
        const title = conflictingTask.title || (isIndo ? 'Jadwal Lain' : 'Another Task');
        const timeRange = `${normalizeTime(conflictingTask.start_time)} - ${normalizeTime(conflictingTask.end_time)}`;
        const msg = isIndo
            ? `Bentrok dengan jadwal "${title}" (${timeRange})`
            : `Time conflict with "${title}" (${timeRange})`;
        return {
            hasConflict: true,
            errorMsg: msg,
            conflictingTask
        };
    }

    return { hasConflict: false, errorMsg: null };
};

// Legacy compatibility wrapper
export const checkTimeConflict = (
    start: string,
    end: string,
    tasks: TaskItem[],
    selectedDate: string,
    excludeId?: number | null,
    minDurationMsg?: string,
    conflictMsg?: string
): string | null => {
    const result = checkTimeConflictDetails(start, end, tasks, selectedDate, excludeId, true);
    if (!result.hasConflict) return null;
    return result.errorMsg || conflictMsg || 'Jadwal bentrok!';
};
