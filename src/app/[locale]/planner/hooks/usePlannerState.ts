'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { normalizeTime, normalizeDate } from '../utils/plannerMath';
import { usePlannerTimer } from './usePlannerTimer';
import { usePlannerDailyData } from './usePlannerDailyData';
import { usePlannerTaskCrud } from './usePlannerTaskCrud';
import { TaskItem, InboxTask } from '../types';

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

    const activeTasks = taskCrud.tasks.filter(t => normalizeDate(t.date) === normalizeDate(selectedDate));
    const completedCount = activeTasks.filter(t => t.completed).length;
    const pendingCount = activeTasks.length - completedCount;
    const progressPercent = activeTasks.length > 0 ? Math.round((completedCount / activeTasks.length) * 100) : 0;

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
        handleDismissRollover
    };
}
