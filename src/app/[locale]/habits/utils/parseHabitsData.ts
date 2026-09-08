import { HabitItem } from '../types';

export const parseRawHabitsData = (fetchedHabits: any[]): HabitItem[] => {
    if (!fetchedHabits || !Array.isArray(fetchedHabits)) return [];
    
    return fetchedHabits.map((h: any): HabitItem => {
        let extraMeta: any = {};
        if (h.status && h.status.startsWith('{')) {
            try {
                extraMeta = JSON.parse(h.status);
            } catch {}
        }

        const habitType = extraMeta.habitType || (h.name.toLowerCase().includes('berhenti') || h.name.toLowerCase().includes('quit') || h.name.toLowerCase().includes('stop') ? 'negative' : 'positive');
        const measurementType = extraMeta.measurementType || (extraMeta.targetValue ? 'numeric' : 'boolean');
        const unit = extraMeta.unit || 'x';
        const targetValue = extraMeta.targetValue || (measurementType === 'numeric' ? 10 : 1);
        const frequencyType = extraMeta.frequencyType || 'daily';
        const frequencyDays = extraMeta.frequencyDays || [0, 1, 2, 3, 4, 5, 6];
        const frequencyCount = extraMeta.frequencyCount || 7;
        const timeOfDay = extraMeta.timeOfDay || 'anytime';

        const logsMap: Record<string, { status: 'completed' | 'skipped' | 'empty' | 'relapse' | 'rest'; value?: number; notes?: string }> = {};

        if (h.logs) {
            h.logs.forEach((log: any) => {
                const dateStr = new Date(log.date).toISOString().split('T')[0];
                let logNotes = log.notes || '';
                let logVal: number | undefined = undefined;

                if (logNotes && logNotes.startsWith('{')) {
                    try {
                        const parsedNote = JSON.parse(logNotes);
                        logVal = parsedNote.val;
                        logNotes = parsedNote.note || '';
                    } catch {}
                }

                logsMap[dateStr] = {
                    status: log.status as any,
                    value: logVal,
                    notes: logNotes
                };
            });
        }

        return {
            id: h.id,
            name: h.name,
            icon: h.icon || '🌱',
            color: h.color || '#6366f1',
            period: h.period,
            monthlyTarget: h.monthlyTarget || 30,
            position: h.position || 1,
            habitType,
            measurementType,
            unit,
            targetValue,
            frequencyType,
            frequencyDays,
            frequencyCount,
            timeOfDay,
            status: h.status,
            logs: logsMap
        };
    });
};
