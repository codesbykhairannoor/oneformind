'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { TaskItem, InboxTask } from '../types';
import { normalizeDate, timeToMin, checkTimeConflict } from '../utils/plannerMath';

export function usePlannerTaskCrud(selectedDate: string) {
    const t = useTranslations();
    const [tasks, setTasks] = useState<TaskItem[]>([]);

    // Modal state
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskStartTime, setTaskStartTime] = useState('09:00');
    const [taskEndTime, setTaskEndTime] = useState('10:00');
    const [taskType, setTaskType] = useState(2);
    const [taskNotes, setTaskNotes] = useState('');

    const updateTasksState = (updater: TaskItem[] | ((prev: TaskItem[]) => TaskItem[])) => {
        setTasks(prev => {
            const newTasks = typeof updater === 'function' ? updater(prev) : updater;
            window.dispatchEvent(new Event('planner_updated'));
            return newTasks;
        });
    };

    const toggleTask = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        
        updateTasksState(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        
        try {
            await fetch(`/api/planner/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: !task.completed })
            });
        } catch (error) {
            console.error('Failed to toggle task:', error);
            updateTasksState(prev => prev.map(t => t.id === id ? { ...t, completed: task.completed } : t));
        }
    };

    const openNewTaskModal = (defaultTime?: string) => {
        setEditingTaskId(null);
        setTaskTitle('');
        
        let start = defaultTime || '09:00';
        if (!defaultTime) {
            const occupied = (timeStr: string) => {
                const startM = timeToMin(timeStr);
                const endM = startM + 60;
                return tasks.some(t => {
                    if (t.date !== selectedDate || !t.start_time || !t.end_time) return false;
                    const tS = timeToMin(t.start_time);
                    let tE = timeToMin(t.end_time);
                    if (tE < tS) tE += 1440;
                    return (startM < tE && endM > tS);
                });
            };

            for (let h = 8; h <= 20; h++) {
                const candidate = `${String(h).padStart(2, '0')}:00`;
                if (!occupied(candidate)) {
                    start = candidate;
                    break;
                }
            }
        }

        setTaskStartTime(start);
        
        const [h, m] = start.split(':').map(Number);
        const endH = String((h + 1) % 24).padStart(2, '0');
        const endM = String(m).padStart(2, '0');
        setTaskEndTime(`${endH}:${endM}`);
        
        setTaskType(2);
        setTaskNotes('');
        setShowTaskModal(true);
    };

    const editTask = (task: TaskItem) => {
        setEditingTaskId(task.id); 
        setTaskTitle(task.title); 
        setTaskStartTime(task.start_time); 
        setTaskEndTime(task.end_time);
        setTaskType(task.type); 
        setTaskNotes(task.notes || ''); 
        setShowTaskModal(true);
    };

    const submitSingleTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) return;
        
        const err = checkTimeConflict(
            taskStartTime, 
            taskEndTime, 
            tasks, 
            selectedDate, 
            editingTaskId,
            t('error_duration_min') || 'Minimal 5 menit!',
            t('error_conflict') || 'Jadwal bentrok!'
        );
        if (err) return;

        try {
            const cleanDate = normalizeDate(selectedDate);
            if (editingTaskId) {
                updateTasksState(prev => prev.map(t => t.id === editingTaskId ? { 
                    ...t, 
                    title: taskTitle, 
                    start_time: taskStartTime, 
                    end_time: taskEndTime, 
                    type: taskType, 
                    notes: taskNotes 
                } : t));

                await fetch(`/api/planner/tasks/${editingTaskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: taskTitle, startTime: taskStartTime, endTime: taskEndTime, type: taskType, notes: taskNotes
                    })
                });
            } else {
                const tempId = Date.now();
                const newTaskItem: TaskItem = { 
                    id: tempId, 
                    date: cleanDate, 
                    title: taskTitle, 
                    start_time: taskStartTime, 
                    end_time: taskEndTime, 
                    type: taskType, 
                    notes: taskNotes, 
                    completed: false 
                };

                updateTasksState(prev => [...prev, newTaskItem]);

                const res = await fetch('/api/planner/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: cleanDate, title: taskTitle, startTime: taskStartTime, endTime: taskEndTime, type: taskType, notes: taskNotes
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data?.id) {
                        updateTasksState(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to save task:', error);
        }
        setShowTaskModal(false);
    };

    const handleMoveTask = async (taskId: number, newStartTime: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const [startH, startM] = task.start_time.split(':').map(Number);
        let [endH, endM] = task.end_time ? task.end_time.split(':').map(Number) : [startH + 1, startM];
        let duration = (endH * 60 + endM) - (startH * 60 + startM);
        if (duration < 0) duration += 1440;
        
        const [newStartH, newStartM] = newStartTime.split(':').map(Number);
        const newEndMinutes = (newStartH * 60 + newStartM) + duration;
        const finalEndH = String(Math.floor(newEndMinutes / 60) % 24).padStart(2, '0');
        const finalEndM = String(newEndMinutes % 60).padStart(2, '0');
        const newEndTime = `${finalEndH}:${finalEndM}`;

        const err = checkTimeConflict(
            newStartTime, 
            newEndTime, 
            tasks, 
            selectedDate, 
            taskId,
            t('error_duration_min') || 'Minimal 5 menit!',
            t('error_conflict') || 'Jadwal bentrok!'
        );
        if (err) {
            alert(`Gagal memindahkan jadwal: ${err}`);
            return;
        }

        updateTasksState(prev => prev.map(t => t.id === taskId ? { ...t, start_time: newStartTime, end_time: newEndTime } : t));

        try {
            await fetch(`/api/planner/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ startTime: newStartTime, endTime: newEndTime })
            });
        } catch (error) {
            console.error('Failed to move task:', error);
            updateTasksState(prev => prev.map(t => t.id === taskId ? { ...t, start_time: task.start_time, end_time: task.end_time } : t));
        }
    };

    // Schedule an inbox task directly onto the timeline
    const scheduleInboxTask = async (inboxTask: { id: number; title: string; type: number }, startTime: string, durationMinutes: number = 60) => {
        const cleanDate = normalizeDate(selectedDate);
        const [sH, sM] = startTime.split(':').map(Number);
        const endMinutes = (sH * 60 + sM) + durationMinutes;
        const eH = String(Math.floor(endMinutes / 60) % 24).padStart(2, '0');
        const eM = String(endMinutes % 60).padStart(2, '0');
        const endTime = `${eH}:${eM}`;

        const tempId = Date.now();
        const newTask: TaskItem = {
            id: tempId,
            date: cleanDate,
            title: inboxTask.title,
            start_time: startTime,
            end_time: endTime,
            type: inboxTask.type || 2,
            notes: '',
            completed: false
        };

        updateTasksState(prev => [...prev, newTask]);

        try {
            const res = await fetch('/api/planner/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: cleanDate,
                    title: inboxTask.title,
                    startTime: startTime,
                    endTime: endTime,
                    type: inboxTask.type || 2,
                    notes: ''
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data?.id) {
                    updateTasksState(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
                }
            }
        } catch (e) {
            console.error('Failed to schedule inbox task:', e);
        }
    };

    const deleteTask = async () => {
        if (editingTaskId) {
            updateTasksState(prev => prev.filter(t => t.id !== editingTaskId));
            try {
                await fetch(`/api/planner/tasks/${editingTaskId}`, { method: 'DELETE' });
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
        setShowTaskModal(false);
    };

    // Atomic reset board for date
    const resetBoardForDate = async (dateStr: string) => {
        updateTasksState(prev => prev.filter(t => normalizeDate(t.date) !== normalizeDate(dateStr)));
        try {
            await fetch(`/api/planner/tasks?date=${dateStr}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Failed to reset tasks for date:', error);
        }
    };

    // Rollover unfinished tasks to current date
    const rolloverTasks = async (unfinishedTasks: TaskItem[], targetDate: string) => {
        const cleanTarget = normalizeDate(targetDate);
        for (const task of unfinishedTasks) {
            try {
                // Clone task into target date
                const tempId = Date.now() + Math.floor(Math.random() * 1000);
                const rolledTask: TaskItem = {
                    ...task,
                    id: tempId,
                    date: cleanTarget,
                    completed: false
                };
                updateTasksState(prev => [...prev, rolledTask]);

                const res = await fetch('/api/planner/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: cleanTarget,
                        title: task.title,
                        startTime: task.start_time,
                        endTime: task.end_time,
                        type: task.type,
                        notes: task.notes || ''
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data?.id) {
                        updateTasksState(prev => prev.map(t => t.id === tempId ? { ...t, id: data.id } : t));
                    }
                }
            } catch (e) {
                console.error('Failed to rollover task:', task.title, e);
            }
        }
    };

    return {
        tasks,
        setTasks,
        updateTasksState,
        showTaskModal,
        setShowTaskModal,
        editingTaskId,
        taskTitle,
        setTaskTitle,
        taskStartTime,
        setTaskStartTime,
        taskEndTime,
        setTaskEndTime,
        taskType,
        setTaskType,
        taskNotes,
        setTaskNotes,
        toggleTask,
        openNewTaskModal,
        editTask,
        submitSingleTask,
        handleMoveTask,
        scheduleInboxTask,
        deleteTask,
        resetBoardForDate,
        rolloverTasks
    };
}
