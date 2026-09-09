import { HabitItem } from '../types';

export const parseRawHabitsData = (fetchedHabits: any[]): HabitItem[] => {
    if (!fetchedHabits || !Array.isArray(fetchedHabits)) return [];
    
    return fetchedHabits.map((h: any): HabitItem => {
        let extraMeta: any = {};
        if (h.status && typeof h.status === 'string' && h.status.startsWith('{')) {
            try {
                extraMeta = JSON.parse(h.status);
            } catch {}
        } else if (h.status && typeof h.status === 'object') {
            extraMeta = h.status;
        }

        const habitType = extraMeta.habitType === 'negative'
            ? 'negative'
            : extraMeta.habitType === 'positive'
            ? 'positive'
            : (h.name && (h.name.toLowerCase().startsWith('berhenti ') || h.name.toLowerCase().startsWith('stop ') || h.name.toLowerCase().startsWith('quit ')) ? 'negative' : 'positive');

        const measurementType = extraMeta.measurementType === 'numeric' || extraMeta.targetValue ? 'numeric' : 'boolean';
        const unit = extraMeta.unit || (measurementType === 'numeric' ? 'ml' : 'x');
        const targetValue = typeof extraMeta.targetValue === 'number'
            ? extraMeta.targetValue
            : (extraMeta.targetValue && !isNaN(Number(extraMeta.targetValue)) ? Number(extraMeta.targetValue) : (measurementType === 'numeric' ? 10 : 1));
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

                let logNotesRaw = log.notes;
                let logNotes = '';
                let logVal: number | undefined = undefined;

                if (logNotesRaw !== null && logNotesRaw !== undefined) {
                    if (typeof logNotesRaw === 'number') {
                        logVal = logNotesRaw;
                    } else if (typeof logNotesRaw === 'object') {
                        if (typeof logNotesRaw.val === 'number') logVal = logNotesRaw.val;
                        else if (typeof logNotesRaw.val === 'string' && !isNaN(Number(logNotesRaw.val))) logVal = Number(logNotesRaw.val);
                        logNotes = typeof logNotesRaw.note === 'string' ? logNotesRaw.note : '';
                    } else if (typeof logNotesRaw === 'string') {
                        let trimmed = logNotesRaw.trim();
                        if (trimmed.startsWith('{') || (trimmed.startsWith('"') && trimmed.includes('{'))) {
                            try {
                                if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                                    trimmed = JSON.parse(trimmed);
                                }
                                const parsed = typeof trimmed === 'string' ? JSON.parse(trimmed) : trimmed;
                                if (parsed && typeof parsed === 'object') {
                                    if (typeof parsed.val === 'number') logVal = parsed.val;
                                    else if (typeof parsed.val === 'string' && !isNaN(Number(parsed.val))) logVal = Number(parsed.val);
                                    logNotes = typeof parsed.note === 'string' ? parsed.note : '';
                                }
                            } catch {
                                logNotes = trimmed;
                            }
                        } else if (!isNaN(Number(trimmed)) && trimmed !== '') {
                            logVal = Number(trimmed);
                        } else {
                            logNotes = trimmed;
                        }
                    }
                }

                // If log had direct value property
                if (logVal === undefined && log.value !== undefined && log.value !== null) {
                    const parsedDirect = Number(log.value);
                    if (!isNaN(parsedDirect)) logVal = parsedDirect;
                }

                const rawStatus = (log.status as any) || 'completed';

                // Robust fallbacks for numeric habits
                if (measurementType === 'numeric' && logVal === undefined) {
                    if (rawStatus === 'completed') {
                        logVal = targetValue;
                    } else if (rawStatus === 'in_progress') {
                        if (typeof logNotesRaw === 'string') {
                            const match = logNotesRaw.match(/"val"\s*:\s*(\d+(\.\d+)?)/);
                            if (match && match[1]) {
                                logVal = parseFloat(match[1]);
                            }
                        }
                    }
                }

                logsMap[dateStr] = {
                    status: rawStatus,
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
