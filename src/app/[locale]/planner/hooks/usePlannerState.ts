'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { normalizeTime, normalizeDate } from '../utils/plannerMath';
import { usePlannerTimer } from './usePlannerTimer';
import { usePlannerDailyData } from './usePlannerDailyData';
import { usePlannerTaskCrud } from './usePlannerTaskCrud';

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

        const loadAll = async () => {
            try {
                const [tasksRes, dailyRes] = await Promise.all([
                    fetch(`/api/planner/tasks?date=${selectedDate}`, { cache: 'no-store' }),
                    fetch(`/api/planner/daily?date=${selectedDate}`, { cache: 'no-store' }),
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

    const activeTasks = taskCrud.tasks.filter(t => t.date === selectedDate);
    const completedCount = activeTasks.filter(t => t.completed).length;
    const pendingCount = activeTasks.length - completedCount;
    const progressPercent = activeTasks.length > 0 ? Math.round((completedCount / activeTasks.length) * 100) : 0;

    const resetBoard = () => {
        taskCrud.setTasks(taskCrud.tasks.filter(t => t.date !== selectedDate));
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
        resetBoard,
        notes: daily.notes,
        handleSetNotes: daily.handleSetNotes,
        meals: daily.meals,
        handleSetMeals: daily.handleSetMeals,
        waterGlasses: daily.waterGlasses,
        handleSetWaterGlasses: daily.handleSetWaterGlasses,
        taskInbox: daily.taskInbox,
        handleSetTaskInbox: daily.handleSetTaskInbox,
        pomodoroTime: timer.pomodoroTime,
        isTimerRunning: timer.isTimerRunning,
        toggleTimer: timer.toggleTimer,
        resetTimer: timer.resetTimer,
        formatTimer: timer.formatTimer,
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
        showBatchModal: taskCrud.showBatchModal,
        setShowBatchModal: taskCrud.setShowBatchModal,
        batchTasks: taskCrud.batchTasks,
        setBatchTasks: taskCrud.setBatchTasks,
        progressPercent,
        completedCount,
        pendingCount,
        toggleTask: taskCrud.toggleTask,
        openNewTaskModal: taskCrud.openNewTaskModal,
        editTask: taskCrud.editTask,
        submitSingleTask: taskCrud.submitSingleTask,
        handleMoveTask: taskCrud.handleMoveTask,
        deleteTask: taskCrud.deleteTask,
        submitBatchTasks: taskCrud.submitBatchTasks
    };
}
