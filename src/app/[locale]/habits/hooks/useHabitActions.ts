'use client';

import React, { useState } from 'react';
import { mutate as globalMutate } from 'swr';
import { HabitItem, LifeOSTab } from '../types';
import { playCheckSound, playUncheckSound } from '@/lib/habitAudio';

interface UseHabitActionsParams {
    habits: HabitItem[];
    setHabits: React.Dispatch<React.SetStateAction<HabitItem[]>>;
    currentMonthKey: string;
    daysInCurrentMonth: number;
    isIndo: boolean;
    mutateHabits?: () => void;
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
    formStartTime?: string;
    formEndTime?: string;
    formStartDate?: string;
    formEndDate?: string;
    formGoalId?: string | number;
    formGoalTitle?: string;
    formAnchorCue?: string;
    formElasticMini?: string;
    formDailyFinancialImpact?: number;
    formIsKeystone?: boolean;
    formSyncedTabs?: LifeOSTab[];
    setShowCreateModal: (v: boolean) => void;
    habitToDelete: HabitItem | null;
    setShowDeleteModal: (v: boolean) => void;
    setHabitToDelete: (h: HabitItem | null) => void;
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
    formStartTime,
    formEndTime,
    formStartDate,
    formEndDate,
    formGoalId,
    formGoalTitle,
    formAnchorCue,
    formElasticMini,
    formDailyFinancialImpact,
    formIsKeystone,
    formSyncedTabs,
    setShowCreateModal,
    habitToDelete,
    setShowDeleteModal,
    setHabitToDelete,
    setNumericPopover
}: UseHabitActionsParams) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toggle Habit Status (Complete / Uncheck / Skip / Relapse)
    const toggleStatus = async (habitId: number, dateString: string, forceStatus?: 'completed' | 'skipped' | 'relapse') => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const currentLog = habit.logs?.[dateString];
        const currentStatus = currentLog?.status;

        let nextStatus: 'completed' | 'skipped' | 'relapse' | 'empty';

        if (forceStatus) {
            nextStatus = forceStatus;
        } else if (habit.measurementType === 'numeric') {
            const currentVal = currentLog?.value || 0;
            const targetVal = habit.targetValue || 10;
            if (currentVal >= targetVal) {
                nextStatus = 'empty';
            } else {
                nextStatus = 'completed';
            }
        } else {
            if (!currentStatus || currentStatus === 'empty') {
                nextStatus = habit.habitType === 'negative' ? 'relapse' : 'completed';
            } else {
                nextStatus = 'empty';
            }
        }

        if (nextStatus === 'completed') {
            playCheckSound();
        } else if (nextStatus === 'empty') {
            playUncheckSound();
        }

        // Optimistic UI update
        setHabits(prevHabits => prevHabits.map(h => {
            if (h.id === habitId) {
                const updatedLogs = { ...h.logs };
                if (nextStatus === 'empty') {
                    delete updatedLogs[dateString];
                } else {
                    const targetVal = h.targetValue || 10;
                    updatedLogs[dateString] = {
                        status: nextStatus,
                        value: h.measurementType === 'numeric' 
                            ? (nextStatus === 'completed' ? targetVal : 0)
                            : (nextStatus === 'completed' ? 1 : 0),
                        notes: currentLog?.notes || ''
                    };
                }
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateString,
                    status: nextStatus,
                    value: habit.measurementType === 'numeric'
                        ? (nextStatus === 'completed' ? habit.targetValue : 0)
                        : (nextStatus === 'completed' ? 1 : 0),
                    notes: currentLog?.notes || ''
                })
            });
            if (mutateHabits) {
                mutateHabits();
            }
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (error) {
            console.error('Failed to sync habit log', error);
        }
    };

    // Save Note to Habit Log
    const handleSaveNote = async (habitId: number, dateStr: string, noteText: string) => {
        setHabits(prevHabits => prevHabits.map(h => {
            if (h.id === habitId) {
                const updatedLogs = { ...h.logs };
                const current = updatedLogs[dateStr];
                updatedLogs[dateStr] = {
                    status: current?.status || 'empty',
                    value: current?.value,
                    notes: noteText
                };
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        try {
            const habit = habits.find(h => h.id === habitId);
            const currentLog = habit?.logs?.[dateStr];

            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    status: currentLog?.status || 'empty',
                    value: currentLog?.value,
                    notes: noteText
                })
            });
            if (mutateHabits) {
                mutateHabits();
            }
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (error) {
            console.error('Failed to save habit note', error);
        }
    };

    // Update Numeric Value (for quantitative habits)
    const handleUpdateNumericValue = async (habitId: number, dateStr: string, val: number, notes?: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const targetVal = habit.targetValue || 10;
        const currentLog = habit.logs?.[dateStr];
        const nextStatus = val >= targetVal ? 'completed' : (val > 0 ? 'in_progress' : 'empty');

        if (nextStatus === 'completed' && currentLog?.status !== 'completed') {
            playCheckSound();
        }

        // Optimistic UI update
        setHabits(prevHabits => prevHabits.map(h => {
            if (h.id === habitId) {
                const updatedLogs = { ...h.logs };
                if (nextStatus === 'empty' && !notes) {
                    delete updatedLogs[dateStr];
                } else {
                    updatedLogs[dateStr] = {
                        status: nextStatus,
                        value: val,
                        notes: notes !== undefined ? notes : (currentLog?.notes || '')
                    };
                }
                return { ...h, logs: updatedLogs };
            }
            return h;
        }));

        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    status: nextStatus,
                    value: val,
                    notes: notes !== undefined ? notes : (currentLog?.notes || '')
                })
            });
            if (mutateHabits) {
                mutateHabits();
            }
            globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
        } catch (error) {
            console.error('Failed to update numeric habit log', error);
        }

        setNumericPopover(null);
    };

    // Submit Single Habit (Create or Edit)
    const submitSingleHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim() || isSubmitting) return;

        const metadata = {
            habitType: formType,
            measurementType: formMeasure,
            unit: formUnit,
            targetValue: formTargetValue,
            frequencyType: formFreqType,
            frequencyDays: formFreqDays,
            timeOfDay: formTimeOfDay,
            startTime: formStartTime || undefined,
            endTime: formEndTime || undefined,
            startDate: formStartDate || undefined,
            endDate: formEndDate || undefined,
            goalId: formGoalId,
            goalTitle: formGoalTitle,
            anchorCue: formAnchorCue,
            elasticMini: formElasticMini,
            dailyFinancialImpact: formDailyFinancialImpact,
            isKeystone: formIsKeystone,
            syncedTabs: formSyncedTabs
        };

        const statusPayload = JSON.stringify(metadata);

        setIsSubmitting(true);
        try {
            if (editingHabitId) {
                // Optimistically update
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
                    startTime: formStartTime || undefined,
                    endTime: formEndTime || undefined,
                    startDate: formStartDate || undefined,
                    endDate: formEndDate || undefined,
                    goalId: formGoalId,
                    goalTitle: formGoalTitle,
                    anchorCue: formAnchorCue,
                    elasticMini: formElasticMini,
                    dailyFinancialImpact: formDailyFinancialImpact,
                    isKeystone: formIsKeystone,
                    syncedTabs: formSyncedTabs,
                    status: statusPayload
                } : h));

                const res = await fetch(`/api/habits/${editingHabitId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formName,
                        icon: formIcon,
                        color: formColor,
                        monthlyTarget: formTarget,
                        status: statusPayload
                    })
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || 'Failed to update habit');
                }

                if (mutateHabits) {
                    await mutateHabits();
                }
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
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
                    startTime: formStartTime || undefined,
                    endTime: formEndTime || undefined,
                    startDate: formStartDate || undefined,
                    endDate: formEndDate || undefined,
                    goalId: formGoalId,
                    goalTitle: formGoalTitle,
                    anchorCue: formAnchorCue,
                    elasticMini: formElasticMini,
                    dailyFinancialImpact: formDailyFinancialImpact,
                    isKeystone: formIsKeystone,
                    syncedTabs: formSyncedTabs,
                    status: statusPayload,
                    logs: {}
                };
                setHabits(prev => [...prev, newHabit]);

                const res = await fetch('/api/habits', {
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
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    setHabits(prev => prev.filter(h => h.id !== tempId));
                    throw new Error(errData.error || 'Failed to create habit');
                }

                const realHabit = await res.json();
                setHabits(prev => prev.map(h => h.id === tempId ? { ...newHabit, id: realHabit.id } : h));

                if (mutateHabits) {
                    await mutateHabits();
                }
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
            }
            setShowCreateModal(false);
        } catch (error: any) {
            console.error('Failed to submit habit', error);
            alert(isIndo ? 'Gagal menyimpan habit ke database.' : 'Failed to save habit to database.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Confirm & Execute Delete
    const executeDelete = async () => {
        if (habitToDelete) {
            const targetId = habitToDelete.id;
            setHabits(prev => prev.filter(h => h.id !== targetId));
            setShowDeleteModal(false);
            setHabitToDelete(null);

            try {
                const res = await fetch(`/api/habits/${targetId}`, { method: 'DELETE' });
                if (!res.ok) {
                    console.error('Failed to delete habit on server');
                }
                if (mutateHabits) {
                    await mutateHabits();
                }
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
            } catch (error) {
                console.error('Failed to delete habit', error);
            }
        }
    };

    // Copy Habits from Previous Month
    const handleCopyPreviousHabits = async () => {
        if (!confirm(isIndo ? 'Salin semua habit dari bulan sebelumnya ke bulan ini?' : 'Copy all habits from previous month to this month?')) {
            return;
        }

        try {
            const res = await fetch(`/api/habits?action=copy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetPeriod: currentMonthKey })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                if (mutateHabits) {
                    await mutateHabits();
                }
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'));
                alert(isIndo ? `Berhasil menyalin ${data.copied_count} habit dari bulan lalu!` : `Successfully copied ${data.copied_count} habits from last month!`);
            } else {
                alert(data.error || (isIndo ? 'Gagal menyalin habit dari bulan lalu' : 'Failed to copy habits'));
            }
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    return {
        isSubmitting,
        toggleStatus,
        handleSaveNote,
        handleUpdateNumericValue,
        submitSingleHabit,
        executeDelete,
        handleCopyPreviousHabits
    };
}
