'use client';

import { useState } from 'react';
import { InboxTask } from '../types';

export function usePlannerDailyData(selectedDate: string) {
    const [notes, setNotes] = useState('');
    const [meals, setMeals] = useState({ breakfast: '', lunch: '', dinner: '' });
    const [waterGlasses, setWaterGlasses] = useState(0);
    const [taskInbox, setTaskInbox] = useState<InboxTask[]>([]);

    const syncDaily = (payload: Partial<{
        notes: string;
        meals: { breakfast: string; lunch: string; dinner: string };
        waterGlasses: number;
        inbox: InboxTask[];
    }>) => {
        const body = {
            date: selectedDate,
            notes: payload.notes !== undefined ? payload.notes : notes,
            meals: payload.meals !== undefined ? payload.meals : meals,
            waterGlasses: payload.waterGlasses !== undefined ? payload.waterGlasses : waterGlasses,
            inbox: payload.inbox !== undefined ? payload.inbox : taskInbox,
        };

        fetch('/api/planner/daily', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).catch(e => console.error("Sync daily network error:", e));
    };

    const handleSetNotes = (val: string) => {
        setNotes(val);
        syncDaily({ notes: val });
    };

    const handleSetMeals = (val: { breakfast: string, lunch: string, dinner: string }) => {
        setMeals(val);
        syncDaily({ meals: val });
    };

    const handleSetWaterGlasses = (val: number) => {
        setWaterGlasses(val);
        syncDaily({ waterGlasses: val });
    };

    const handleSetTaskInbox = (val: InboxTask[]) => {
        setTaskInbox(val);
        syncDaily({ inbox: val });
    };

    const setAllDaily = (daily: {
        notes?: string;
        meals?: { breakfast: string; lunch: string; dinner: string };
        waterGlasses?: number;
        inbox?: InboxTask[];
    }) => {
        setNotes(daily.notes || '');
        setMeals(daily.meals || { breakfast: '', lunch: '', dinner: '' });
        setWaterGlasses(daily.waterGlasses ?? 0);
        setTaskInbox(Array.isArray(daily.inbox) ? daily.inbox : []);
    };

    return {
        notes,
        meals,
        waterGlasses,
        taskInbox,
        handleSetNotes,
        handleSetMeals,
        handleSetWaterGlasses,
        handleSetTaskInbox,
        setAllDaily
    };
}
