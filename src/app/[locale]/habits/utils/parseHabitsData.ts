import { HabitItem } from '../types';

export const parseRawHabitsData = (fetchedHabits: any[]): HabitItem[] => {
    if (!fetchedHabits || !Array.isArray(fetchedHabits)) return [];
    
    return fetchedHabits.map((h: any): HabitItem => {
        let extraMeta: any = {};
        if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
            try {
                extraMeta = JSON.parse(h.status);
            } catch {}
        }

        const habitType = extraMeta.habitType === 'negative'
            ? 'negative'
            : extraMeta.habitType === 'positive'
            ? 'positive'
            : (h.name && (h.name.toLowerCase().startsWith('berhenti ') || h.name.toLowerCase().startsWith('stop ') || h.name.toLowerCase().startsWith('quit ')) ? 'negative' : 'positive');

        const measurementType = extraMeta.measurementType === 'numeric' || extraMeta.targetValue ? 'numeric' : 'boolean';
        const unit = extraMeta.unit || (measurementType === 'numeric' ? 'ml' : 'x');
        const targetValue = extraMeta.targetValue || (measurementType === 'numeric' ? 10 : 1);
        const frequencyType = extraMeta.frequencyType || 'daily';
        const frequencyDays = Array.isArray(extraMeta.frequencyDays) ? extraMeta.frequencyDays : [0, 1, 2, 3, 4, 5, 6];
        const frequencyCount = extraMeta.frequencyCount || frequencyDays.length;
        const timeOfDay = extraMeta.timeOfDay || 'anytime';

        const logsMap: HabitItem['logs'] = {};

        if (h.logs && Array.isArray(h.logs)) {
            h.logs.forEach((log: any) => {
                if (!log || !log.date) return;
                const dateStr = typeof log.date === 'string'
                    ? log.date.split('T')[0]
                    : new Date(log.date).toISOString().split('T')[0];

                let logNotes = log.notes || '';
                let logVal: number | undefined = undefined;

                if (logNotes && typeof logNotes === 'string' && logNotes.startsWith('{')) {
                    try {
                        const parsedNote = JSON.parse(logNotes);
                        logVal = parsedNote.val;
                        logNotes = parsedNote.note || '';
                    } catch {}
                }

                logsMap[dateStr] = {
                    status: (log.status as any) || 'completed',
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
