'use client';

import React from 'react';
import { HabitItem, BatchRow } from '../types';
import { playCheckSound, playUncheckSound } from '@/lib/habitAudio';

interface UseHabitActionsParams {
    habits: HabitItem[];
    setHabits: React.Dispatch<React.SetStateAction<HabitItem[]>>;
    currentMonthKey: string;
    daysInCurrentMonth: number;
    isIndo: boolean;
    mutateHabits: () => void;
    editingHabitId: number | null;
    formName: string;
    formIcon: string;
    formColor: string;
    formTarget: number;
    formType: 'positive' | 'negative';
    formMeasure: 'boolean' | 'numeric';
    formUnit: string;
    formTargetValue: number;
    formFreqType: 'daily' | 'weekly_days';
    formFreqDays: number[];
    formTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
    setShowCreateModal: (v: boolean) => void;
    habitToDelete: HabitItem | null;
    setShowDeleteModal: (v: boolean) => void;
    setHabitToDelete: (h: HabitItem | null) => void;
    batchRows: BatchRow[];
    setBatchRows: React.Dispatch<React.SetStateAction<BatchRow[]>>;
    setShowBatchModal: (v: boolean) => void;
    setNumericPopover: (v: any) => void;
}

export function useHabitActions({
    habits,
    setHabits,
    currentMonthKey,
    daysInCurrentMonth,
    isIndo,
    mutateHabits,
    editingHabitId,
    formName,
    formIcon,
    formColor,
    formTarget,
    formType,
    formMeasure,
    formUnit,
    formTargetValue,
    formFreqType,
    formFreqDays,
    formTimeOfDay,
    setShowCreateModal,
    habitToDelete,
    setShowDeleteModal,
    setHabitToDelete,
    batchRows,
    setBatchRows,
    setShowBatchModal,
    setNumericPopover
}: UseHabitActionsParams) {

    // Toggle Habit Log Status
    const toggleStatus = async (habitId: number, dateString: string, forceStatus?: 'completed' | 'skipped' | 'relapse') => {
        const targetHabit = habits.find(h => h.id === habitId);
        if (!targetHabit) return;

        const currentLog = targetHabit.logs[dateString];
        const currentStatus = currentLog?.status || 'empty';
        let nextStatus: 'completed' | 'skipped' | 'empty' | 'relapse' = 'completed';

        if (forceStatus) {
            nextStatus = currentStatus === forceStatus ? 'empty' : forceStatus;
            if (nextStatus === 'completed') playCheckSound();
            else playUncheckSound();
        } else if (targetHabit.habitType === 'negative') {
            if (currentStatus === 'empty' || currentStatus === 'skipped' || currentStatus === 'rest') {
                nextStatus = 'completed';
                playCheckSound();
            } else if (currentStatus === 'completed') {
                nextStatus = 'relapse';
                playUncheckSound();
            } else {
                nextStatus = 'empty';
                playUncheckSound();
            }
        } else {
            if (currentStatus === 'empty' || currentStatus === 'skipped' || currentStatus === 'rest') {
                nextStatus = 'completed';
                playCheckSound();
            } else {
                nextStatus = 'empty';
                playUncheckSound();
            }
        }

        // For numeric habits, calculate proper next value: completed -> targetValue, empty -> 0
        const targetVal = targetHabit.targetValue || 10;
        const nextVal = targetHabit.measurementType === 'numeric'
            ? (nextStatus === 'completed' ? (currentLog?.value && currentLog.value >= targetVal ? currentLog.value : targetVal) : (nextStatus === 'empty' ? 0 : currentLog?.value))
            : currentLog?.value;

        // Optimistic UI update
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const updatedLogs = { ...h.logs };
                if (nextStatus === 'empty') {
                    delete updatedLogs[dateString];
                } else {
                    updatedLogs[dateString] = {
                        status: nextStatus,
                        value: nextVal,
                        notes: currentLog?.notes
                    };
                }
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        try {
            const notePayload = targetHabit.measurementType === 'numeric' && nextVal !== undefined
                ? JSON.stringify({ val: nextVal, note: currentLog?.notes || '' })
                : (currentLog?.notes ? currentLog.notes : undefined);

            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateString, status: nextStatus, notes: nextStatus === 'empty' ? '' : notePayload })
            });
            if (mutateHabits) {
                mutateHabits();
            }
        } catch (e) {
            console.error('Failed to toggle habit log', e);
        }
    };

    // Save Contextual Micro-Note
    const handleSaveNote = async (habitId: number, dateStr: string, noteText: string) => {
        const targetHabit = habits.find(h => h.id === habitId);
        if (!targetHabit) return;

        const currentLog = targetHabit.logs[dateStr];
        const currentStatus = currentLog?.status || 'empty';

        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                return {
                    ...h,
                    logs: {
                        ...h.logs,
                        [dateStr]: {
                            status: currentStatus,
                            value: currentLog?.value,
                            notes: noteText
                        }
                    }
                };
            }
            return h;
        }));

        try {
            const notePayload = currentLog?.value !== undefined ? JSON.stringify({ val: currentLog.value, note: noteText }) : noteText;
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    status: currentStatus,
                    notes: notePayload
                })
            });
            if (mutateHabits) {
                mutateHabits();
            }
        } catch (e) {
            console.error('Failed to save habit note', e);
        }
    };

    // Adjust Numeric Value
    const handleUpdateNumericValue = async (habitId: number, dateStr: string, newValue: number, updatedNote?: string) => {
        const targetHabit = habits.find(h => h.id === habitId);
        if (!targetHabit) return;

        const targetVal = targetHabit.targetValue || 10;
        const currentLog = targetHabit.logs[dateStr];
        const finalNote = updatedNote !== undefined ? updatedNote : (currentLog?.notes || '');
        const isDone = newValue >= targetVal;

        // Determine correct status: 0 = delete from DB, >= target = completed, > 0 = in_progress
        let nextStatus: 'completed' | 'in_progress' | 'empty' = 'empty';
        if (newValue === 0 && !finalNote.trim()) {
            nextStatus = 'empty';
        } else if (isDone) {
            nextStatus = 'completed';
        } else {
            nextStatus = 'in_progress';
        }

        if (isDone && currentLog?.status !== 'completed') {
            playCheckSound();
        }

        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const updatedLogs = { ...h.logs };
                if (nextStatus === 'empty') {
                    delete updatedLogs[dateStr];
                } else {
                    updatedLogs[dateStr] = {
                        status: nextStatus,
                        value: newValue,
                        notes: finalNote
                    };
                }
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        try {
            const noteObj = { val: newValue, note: finalNote };
            // Send 'completed' to database for any positive quantitative entry so PostgreSQL table CHECK constraints (e.g. status IN ('completed','skipped','relapse')) never reject partial progress.
            const dbStatus = nextStatus === 'empty' ? 'empty' : 'completed';
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    status: dbStatus,
                    notes: nextStatus === 'empty' ? '' : JSON.stringify(noteObj)
                })
            });
            if (mutateHabits) {
                mutateHabits();
            }
        } catch (e) {
            console.error('Failed to update numeric habit log', e);
        }

        setNumericPopover(null);
    };

    // Submit Single Habit
    const submitSingleHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;

        const metadata = {
            habitType: formType,
            measurementType: formMeasure,
            unit: formUnit,
            targetValue: formTargetValue,
            frequencyType: formFreqType,
            frequencyDays: formFreqDays,
            timeOfDay: formTimeOfDay
        };

        const statusPayload = JSON.stringify(metadata);

        try {
            if (editingHabitId) {
                setHabits(prev => prev.map(h => h.id === editingHabitId ? {
                    ...h,
                    name: formName,
                    icon: formIcon,
                    color: formColor,
                    monthlyTarget: formTarget,
                    habitType: formType,
                    measurementType: formMeasure,
                    unit: formUnit,
                    targetValue: formTargetValue,
                    frequencyType: formFreqType,
                    frequencyDays: formFreqDays,
                    timeOfDay: formTimeOfDay,
                    status: statusPayload
                } : h));

                fetch(`/api/habits/${editingHabitId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formName,
                        icon: formIcon,
                        color: formColor,
                        monthlyTarget: formTarget,
                        status: statusPayload
                    })
                }).catch(err => console.error('Failed to update habit', err));
            } else {
                const tempId = Date.now();
                const newHabit: HabitItem = {
                    id: tempId,
                    name: formName,
                    icon: formIcon,
                    color: formColor,
                    period: currentMonthKey,
                    monthlyTarget: formTarget,
                    position: habits.length > 0 ? Math.max(...habits.map(h => h.position)) + 1 : 1,
                    habitType: formType,
                    measurementType: formMeasure,
                    unit: formUnit,
                    targetValue: formTargetValue,
                    frequencyType: formFreqType,
                    frequencyDays: formFreqDays,
                    timeOfDay: formTimeOfDay,
                    status: statusPayload,
                    logs: {}
                };
                setHabits(prev => [...prev, newHabit]);

                fetch('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formName,
                        icon: formIcon,
                        color: formColor,
                        period: currentMonthKey,
                        monthlyTarget: formTarget,
                        status: statusPayload
                    })
                })
                .then(res => res.json())
                .then(realHabit => {
                    setHabits(prev => prev.map(h => h.id === tempId ? { ...newHabit, id: realHabit.id } : h));
                })
                .catch(err => {
                    console.error('Failed to create habit', err);
                    setHabits(prev => prev.filter(h => h.id !== tempId));
                });
            }
        } catch (error) {
            console.error('Failed to submit habit', error);
        }
        setShowCreateModal(false);
    };

    // Confirm & Execute Delete
    const executeDelete = async () => {
        if (habitToDelete) {
            const targetId = habitToDelete.id;
            setHabits(prev => prev.filter(h => h.id !== targetId));
            fetch(`/api/habits/${targetId}`, { method: 'DELETE' }).catch(error => {
                console.error('Failed to delete habit', error);
            });
        }
        setShowDeleteModal(false);
        setHabitToDelete(null);
    };

    // Batch Habits Submission
    const submitBatchHabits = async () => {
        const validRows = batchRows.filter(r => r.name.trim() !== '');
        if (validRows.length === 0) return;

        const tempHabits: HabitItem[] = validRows.map((r, i) => {
            const meta = { habitType: 'positive', measurementType: 'boolean', timeOfDay: r.timeOfDay, frequencyType: 'daily' };
            return {
                id: Date.now() + i,
                name: r.name,
                icon: r.icon,
                color: r.color,
                period: currentMonthKey,
                monthlyTarget: r.target,
                position: (habits.length > 0 ? Math.max(...habits.map(h => h.position)) : 0) + i + 1,
                timeOfDay: r.timeOfDay,
                status: JSON.stringify(meta),
                logs: {}
            };
        });

        setHabits(prev => [...prev, ...tempHabits]);

        validRows.forEach(async (r, i) => {
            try {
                const meta = { habitType: 'positive', measurementType: 'boolean', timeOfDay: r.timeOfDay, frequencyType: 'daily' };
                const res = await fetch('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: r.name,
                        icon: r.icon,
                        color: r.color,
                        period: currentMonthKey,
                        monthlyTarget: r.target,
                        status: JSON.stringify(meta)
                    })
                });
                if (res.ok) {
                    const realHabit = await res.json();
                    setHabits(prev => prev.map(h => h.id === tempHabits[i].id ? { ...tempHabits[i], id: realHabit.id } : h));
                }
            } catch (e) {
                console.error('Failed to submit batch habit', e);
            }
        });

        setShowBatchModal(false);
        setBatchRows([
            { name: '', icon: '⚡', color: '#6366f1', target: daysInCurrentMonth, timeOfDay: 'morning' },
            { name: '', icon: '💧', color: '#10b981', target: daysInCurrentMonth, timeOfDay: 'morning' }
        ]);
    };

    // Copy Habits from Last Month
    const handleCopyPreviousHabits = async () => {
        try {
            const res = await fetch(`/api/habits?action=copy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetPeriod: currentMonthKey })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                mutateHabits();
                alert(isIndo ? `Berhasil menyalin ${data.copied_count} habit dari bulan lalu!` : `Successfully copied ${data.copied_count} habits from last month!`);
            } else {
                alert(data.error || (isIndo ? 'Gagal menyalin habit dari bulan lalu' : 'Failed to copy habits'));
            }
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    return {
        toggleStatus,
        handleSaveNote,
        handleUpdateNumericValue,
        submitSingleHabit,
        executeDelete,
        submitBatchHabits,
        handleCopyPreviousHabits
    };
}
