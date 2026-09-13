'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import useSWR, { mutate as globalMutate } from 'swr';
import { normalizeTime, normalizeDate } from '../utils/plannerMath';
import { usePlannerTimer } from './usePlannerTimer';
import { usePlannerDailyData } from './usePlannerDailyData';
import { usePlannerTaskCrud } from './usePlannerTaskCrud';
import { TaskItem, InboxTask, ScheduledHabitItem } from '../types';
import { playCheckSound, playUncheckSound } from '@/lib/habitAudio';

const habitsFetcher = (url: string) => fetch(url).then(res => res.json());

export function usePlannerState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const [selectedDate, setSelectedDate] = useState(dateParam || todayStr);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        const params = new URLSearchParams(searchParams.toString());
        params.set('date', date);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const timer = usePlannerTimer();
    const daily = usePlannerDailyData(selectedDate);
    const taskCrud = usePlannerTaskCrud(selectedDate);

    // Habits SWR sync
    const { data: rawHabits, mutate: mutateHabits } = useSWR('/api/habits', habitsFetcher);
    const [scheduledHabits, setScheduledHabits] = useState<ScheduledHabitItem[]>([]);
    const [selectedHabitForModal, setSelectedHabitForModal] = useState<ScheduledHabitItem | null>(null);

    const [startHour, setStartHour] = useState(6);
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Rollover state
    const [unfinishedYesterdayTasks, setUnfinishedYesterdayTasks] = useState<TaskItem[]>([]);
    const [showRolloverBanner, setShowRolloverBanner] = useState(false);

    // Reset confirmation modal state
    const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

    useEffect(() => {
        if (dateParam && dateParam !== selectedDate) {
            setSelectedDate(dateParam);
        }
    }, [dateParam]);

    // Load initial data
    useEffect(() => {
        const savedStart = localStorage.getItem('planner_start_time');
        if (savedStart) setStartHour(parseInt(savedStart));
        
        setIsLoaded(false);

        // Compute yesterday's date string
        const [y, m, d] = selectedDate.split('-').map(Number);
        const yesterdayObj = new Date(y, m - 1, d - 1);
        const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;

        const loadAll = async () => {
            try {
                const [tasksRes, dailyRes, yesterdayRes] = await Promise.all([
                    fetch(`/api/planner/tasks?date=${selectedDate}`, { cache: 'no-store' }),
                    fetch(`/api/planner/daily?date=${selectedDate}`, { cache: 'no-store' }),
                    fetch(`/api/planner/tasks?date=${yesterdayStr}`, { cache: 'no-store' }),
                ]);

                if (tasksRes.ok) {
                    const data = await tasksRes.json();
                    taskCrud.setTasks(Array.isArray(data) ? data.map((t: any) => ({
                        id: t.id,
                        date: normalizeDate(t.date),
                        title: t.title,
                        start_time: normalizeTime(t.startTime || t.start_time),
                        end_time: normalizeTime(t.endTime || t.end_time),
                        type: t.type,
                        notes: t.notes || '',
                        completed: t.isCompleted || t.completed || false
                    })) : []);
                }

                if (dailyRes.ok) {
                    const dailyData = await dailyRes.json();
                    daily.setAllDaily(dailyData);
                }

                // Check for unfinished tasks from yesterday
                if (yesterdayRes.ok) {
                    const yData = await yesterdayRes.json();
                    if (Array.isArray(yData)) {
                        const unfinished = yData.filter((t: any) => !(t.isCompleted || t.completed));
                        if (unfinished.length > 0) {
                            setUnfinishedYesterdayTasks(unfinished.map((t: any) => ({
                                id: t.id,
                                date: normalizeDate(t.date),
                                title: t.title,
                                start_time: normalizeTime(t.startTime || t.start_time),
                                end_time: normalizeTime(t.endTime || t.end_time),
                                type: t.type,
                                notes: t.notes || '',
                                completed: false
                            })));
                            setShowRolloverBanner(true);
                        } else {
                            setUnfinishedYesterdayTasks([]);
                            setShowRolloverBanner(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load planner data:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadAll();

        const clockInterval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(clockInterval);
    }, [selectedDate]);

    // Reactively compute scheduled habits from rawHabits (SWR-powered)
    useEffect(() => {
        if (!rawHabits || !Array.isArray(rawHabits)) {
            setScheduledHabits([]);
            return;
        }

        const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
        const currentDayOfWeek = new Date(sYear, sMonth - 1, sDay).getDay(); // 0: Sun, 1: Mon...

        const matched: ScheduledHabitItem[] = [];

        rawHabits.forEach((h: any) => {
            // Must not be archived
            if (h.isArchived || h.is_archived) return;

            let meta: any = {};
            if (typeof h.status === 'string' && h.status.startsWith('{')) {
                try { meta = JSON.parse(h.status); } catch {}
            } else if (typeof h.status === 'object' && h.status !== null) {
                meta = h.status;
            }

            const startTime = meta.startTime;
            if (!startTime) return; // Only time-scheduled habits appear on timeline

            // Explicit check: Must be synced to planner!
            const isPlannerSynced = Array.isArray(meta.syncedTabs) ? meta.syncedTabs.includes('planner') : true;
            if (!isPlannerSynced) return;

            // Date bounds check
            if (meta.startDate && selectedDate < meta.startDate) return;
            if (meta.endDate && selectedDate > meta.endDate) return;

            // Frequency check
            const freqType = meta.frequencyType || 'daily';
            if (freqType === 'weekly_days' && Array.isArray(meta.frequencyDays)) {
                if (!meta.frequencyDays.includes(currentDayOfWeek)) {
                    return;
                }
            }

            // Compute end time (+30 mins default)
            let endTime = meta.endTime;
            if (!endTime) {
                const [sH, sM] = startTime.split(':').map(Number);
                const total = (isNaN(sH) ? 8 : sH) * 60 + (isNaN(sM) ? 0 : sM) + 30;
                const endH = String(Math.floor(total / 60) % 24).padStart(2, '0');
                const endM = String(total % 60).padStart(2, '0');
                endTime = `${endH}:${endM}`;
            }

            // Status on selectedDate
            let isDone = false;
            let streakCount = 0;
            if (Array.isArray(h.logs)) {
                const logToday = h.logs.find((l: any) => {
                    const lDate = typeof l.date === 'string' ? l.date.split('T')[0] : '';
                    return lDate === selectedDate;
                });
                if (logToday && (logToday.status === 'completed' || Number(logToday.value) > 0)) {
                    isDone = true;
                }
                streakCount = h.logs.filter((l: any) => l.status === 'completed' || Number(l.value) > 0).length;
            }

            matched.push({
                id: h.id,
                name: h.name,
                icon: h.icon || '🌱',
                color: h.color || '#10b981',
                startTime,
                endTime,
                completed: isDone,
                streak: streakCount,
                notes: meta.notes || ''
            });
        });

        setScheduledHabits(matched);
    }, [rawHabits, selectedDate]);

    // Combined Tasks + Scheduled Habits metrics
    const activeTasks = taskCrud.tasks.filter(t => normalizeDate(t.date) === normalizeDate(selectedDate));
    const totalItems = activeTasks.length + scheduledHabits.length;
    const completedTasksCount = activeTasks.filter(t => t.completed).length;
    const completedHabitsCount = scheduledHabits.filter(h => h.completed).length;
    const completedCount = completedTasksCount + completedHabitsCount;
    const pendingCount = Math.max(0, totalItems - completedCount);
    const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Toggle Habit completion directly from Planner
    const toggleHabitStatus = async (habitId: number) => {
        const target = scheduledHabits.find(h => h.id === habitId);
        if (!target) return;

        const nextCompleted = !target.completed;
        const nextStatus = nextCompleted ? 'completed' : 'empty';

        // Optimistic UI update
        setScheduledHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                return {
                    ...h,
                    completed: nextCompleted,
                    streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
                };
            }
            return h;
        }));

        if (nextCompleted) {
            playCheckSound();
        } else {
            playUncheckSound();
        }

        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: selectedDate,
                    status: nextStatus,
                    value: nextCompleted ? 1 : 0
                })
            });
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (err) {
            console.error('Failed to sync habit log from planner:', err);
        }
    };

    // Unlink habit from Planner schedule
    const unlinkHabitFromPlanner = async (habitId: number) => {
        if (!rawHabits || !Array.isArray(rawHabits)) return;
        const habit = rawHabits.find((h: any) => h.id === habitId);
        if (!habit) return;

        let meta: any = {};
        if (typeof habit.status === 'string' && habit.status.startsWith('{')) {
            try { meta = JSON.parse(habit.status); } catch {}
        } else if (typeof habit.status === 'object' && habit.status !== null) {
            meta = { ...habit.status };
        }

        const updatedSyncedTabs = Array.isArray(meta.syncedTabs)
            ? meta.syncedTabs.filter((tab: string) => tab !== 'planner')
            : [];

        meta.syncedTabs = updatedSyncedTabs;

        // Optimistic update
        setScheduledHabits(prev => prev.filter(h => h.id !== habitId));
        setSelectedHabitForModal(null);

        try {
            await fetch(`/api/habits/${habitId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: habit.name,
                    icon: habit.icon,
                    color: habit.color,
                    monthlyTarget: habit.monthlyTarget || habit.monthly_target || 30,
                    status: JSON.stringify(meta)
                })
            });
            await mutateHabits();
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (err) {
            console.error('Failed to unlink habit from planner:', err);
        }
    };

    // Permanently delete habit from database
    const deleteHabitPermanently = async (habitId: number) => {
        // Optimistic update
        setScheduledHabits(prev => prev.filter(h => h.id !== habitId));
        setSelectedHabitForModal(null);

        try {
            await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });
            await mutateHabits();
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (err) {
            console.error('Failed to delete habit permanently:', err);
        }
    };

    // Trigger reset confirmation modal
    const requestResetBoard = () => {
        setShowResetConfirmModal(true);
    };

    // Confirm and execute atomic reset in database
    const confirmResetBoard = async () => {
        setShowResetConfirmModal(false);
        await taskCrud.resetBoardForDate(selectedDate);
    };

    // Execute rollover
    const handleAcceptRollover = async () => {
        setShowRolloverBanner(false);
        if (unfinishedYesterdayTasks.length > 0) {
            await taskCrud.rolloverTasks(unfinishedYesterdayTasks, selectedDate);
            setUnfinishedYesterdayTasks([]);
        }
    };

    const handleDismissRollover = () => {
        setShowRolloverBanner(false);
    };

    // Handle scheduling an inbox item to timeline
    const handleScheduleInboxTask = async (inboxTaskId: number, startTime: string) => {
        const found = daily.taskInbox.find(i => i.id === inboxTaskId);
        if (!found) return;

        // Schedule on timeline
        await taskCrud.scheduleInboxTask(found, startTime, 60);

        // Remove from inbox
        daily.handleSetTaskInbox(daily.taskInbox.filter(i => i.id !== inboxTaskId));
    };

    const handleSetStartHour = (h: number) => {
        setStartHour(h);
        localStorage.setItem('planner_start_time', h.toString());
    };

    return {
        selectedDate,
        handleDateChange,
        tasks: taskCrud.tasks,
        setTasks: taskCrud.setTasks,
        requestResetBoard,
        confirmResetBoard,
        showResetConfirmModal,
        setShowResetConfirmModal,
        notes: daily.notes,
        handleSetNotes: daily.handleSetNotes,
        meals: daily.meals,
        handleSetMeals: daily.handleSetMeals,
        waterGlasses: daily.waterGlasses,
        handleSetWaterGlasses: daily.handleSetWaterGlasses,
        taskInbox: daily.taskInbox,
        handleSetTaskInbox: daily.handleSetTaskInbox,
        saveStatus: daily.saveStatus,
        durationMinutes: timer.durationMinutes,
        pomodoroTime: timer.pomodoroTime,
        isTimerRunning: timer.isTimerRunning,
        focusedTaskTitle: timer.focusedTaskTitle,
        setTimerPreset: timer.setPreset,
        toggleTimer: timer.toggleTimer,
        resetTimer: timer.resetTimer,
        formatTimer: timer.formatTimer,
        focusOnTask: timer.focusOnTask,
        clearFocusedTask: timer.clearFocusedTask,
        startHour,
        handleSetStartHour,
        now,
        isLoaded,
        showTaskModal: taskCrud.showTaskModal,
        setShowTaskModal: taskCrud.setShowTaskModal,
        editingTaskId: taskCrud.editingTaskId,
        taskTitle: taskCrud.taskTitle,
        setTaskTitle: taskCrud.setTaskTitle,
        taskStartTime: taskCrud.taskStartTime,
        setTaskStartTime: taskCrud.setTaskStartTime,
        taskEndTime: taskCrud.taskEndTime,
        setTaskEndTime: taskCrud.setTaskEndTime,
        taskType: taskCrud.taskType,
        setTaskType: taskCrud.setTaskType,
        taskNotes: taskCrud.taskNotes,
        setTaskNotes: taskCrud.setTaskNotes,
        progressPercent,
        completedCount,
        pendingCount,
        toggleTask: taskCrud.toggleTask,
        openNewTaskModal: taskCrud.openNewTaskModal,
        editTask: taskCrud.editTask,
        submitSingleTask: taskCrud.submitSingleTask,
        handleMoveTask: taskCrud.handleMoveTask,
        handleScheduleInboxTask,
        deleteTask: taskCrud.deleteTask,
        unfinishedYesterdayTasks,
        showRolloverBanner,
        handleAcceptRollover,
        handleDismissRollover,
        scheduledHabits,
        toggleHabitStatus,
        selectedHabitForModal,
        setSelectedHabitForModal,
        unlinkHabitFromPlanner,
        deleteHabitPermanently
    };
}
