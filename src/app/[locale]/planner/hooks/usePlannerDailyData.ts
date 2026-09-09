'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { InboxTask } from '../types';

const INBOX_STORAGE_KEY = 'planner_global_inbox_v1';

export function usePlannerDailyData(selectedDate: string) {
    const [notes, setNotes] = useState('');
    const [meals, setMeals] = useState({ breakfast: '', lunch: '', dinner: '' });
    const [waterGlasses, setWaterGlasses] = useState(0);
    const [taskInbox, setTaskInbox] = useState<InboxTask[]>([]);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const savedIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load persistent backlog inbox from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(INBOX_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setTaskInbox(prev => {
                        if (prev.length === 0) return parsed;
                        return prev;
                    });
                }
            }
        } catch (e) {
            console.warn('Failed to load local inbox cache:', e);
        }
    }, []);

    // Perform actual debounced network sync
    const executeSync = useCallback((payload: {
        date: string;
        notes: string;
        meals: { breakfast: string; lunch: string; dinner: string };
        waterGlasses: number;
        inbox: InboxTask[];
    }) => {
        setSaveStatus('saving');
        fetch('/api/planner/daily', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.ok) {
                setSaveStatus('saved');
                if (savedIndicatorTimeoutRef.current) clearTimeout(savedIndicatorTimeoutRef.current);
                savedIndicatorTimeoutRef.current = setTimeout(() => {
                    setSaveStatus('idle');
                }, 2000);
            } else {
                setSaveStatus('idle');
            }
        })
        .catch(e => {
            console.error("Sync daily network error:", e);
            setSaveStatus('idle');
        });
    }, []);

    const scheduleSync = (payload: Partial<{
        notes: string;
        meals: { breakfast: string; lunch: string; dinner: string };
        waterGlasses: number;
        inbox: InboxTask[];
    }>, immediate: boolean = false) => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }

        const body = {
            date: selectedDate,
            notes: payload.notes !== undefined ? payload.notes : notes,
            meals: payload.meals !== undefined ? payload.meals : meals,
            waterGlasses: payload.waterGlasses !== undefined ? payload.waterGlasses : waterGlasses,
            inbox: payload.inbox !== undefined ? payload.inbox : taskInbox,
        };

        if (immediate) {
            executeSync(body);
        } else {
            setSaveStatus('saving');
            syncTimeoutRef.current = setTimeout(() => {
                executeSync(body);
            }, 500); // 500ms debounce
        }
    };

    const handleSetNotes = (val: string) => {
        setNotes(val);
        scheduleSync({ notes: val }, false);
    };

    const handleSetMeals = (val: { breakfast: string, lunch: string, dinner: string }) => {
        setMeals(val);
        scheduleSync({ meals: val }, false);
    };

    const handleSetWaterGlasses = (val: number) => {
        setWaterGlasses(val);
        scheduleSync({ waterGlasses: val }, true); // instant for water clicks
    };

    const handleSetTaskInbox = (val: InboxTask[]) => {
        setTaskInbox(val);
        try {
            // Keep persistent inbox updated
            localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(val));
        } catch (e) {
            console.warn('Failed to cache inbox:', e);
        }
        scheduleSync({ inbox: val }, true);
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

        if (Array.isArray(daily.inbox) && daily.inbox.length > 0) {
            setTaskInbox(daily.inbox);
            try {
                localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(daily.inbox));
            } catch (e) {}
        } else {
            // If this date has no inbox saved yet, carry over from global storage
            try {
                const stored = localStorage.getItem(INBOX_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setTaskInbox(parsed);
                        // Silently sync to current day so it's linked
                        scheduleSync({ inbox: parsed }, true);
                    } else {
                        setTaskInbox([]);
                    }
                } else {
                    setTaskInbox([]);
                }
            } catch (e) {
                setTaskInbox([]);
            }
        }
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
            if (savedIndicatorTimeoutRef.current) clearTimeout(savedIndicatorTimeoutRef.current);
        };
    }, []);

    return {
        notes,
        meals,
        waterGlasses,
        taskInbox,
        saveStatus,
        handleSetNotes,
        handleSetMeals,
        handleSetWaterGlasses,
        handleSetTaskInbox,
        setAllDaily
    };
}
