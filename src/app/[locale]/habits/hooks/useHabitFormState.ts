'use client';

import { useState } from 'react';
import { HabitItem, BatchRow } from '../types';

export function useHabitFormState(daysInCurrentMonth: number) {
    // Single Habit Form Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
    const [formName, setFormName] = useState('');
    const [formIcon, setFormIcon] = useState('🧘');
    const [formColor, setFormColor] = useState('#6366f1');
    const [formTarget, setFormTarget] = useState(25);
    const [formType, setFormType] = useState<'positive' | 'negative'>('positive');
    const [formMeasure, setFormMeasure] = useState<'boolean' | 'numeric'>('boolean');
    const [formUnit, setFormUnit] = useState('ml');
    const [formTargetValue, setFormTargetValue] = useState(2000);
    const [formFreqType, setFormFreqType] = useState<'daily' | 'weekly_days'>('daily');
    const [formFreqDays, setFormFreqDays] = useState<number[]>([1, 2, 3, 4, 5]);
    const [formTimeOfDay, setFormTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

    // Batch Habit Modal State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchRows, setBatchRows] = useState<BatchRow[]>([
        { name: '', icon: '⚡', color: '#6366f1', target: 25, timeOfDay: 'morning' },
        { name: '', icon: '💧', color: '#10b981', target: 25, timeOfDay: 'morning' }
    ]);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);

    // Other Modals State
    const [detailModalHabit, setDetailModalHabit] = useState<HabitItem | null>(null);
    const [timerModalHabit, setTimerModalHabit] = useState<HabitItem | null>(null);
    const [noteModalData, setNoteModalData] = useState<{ habit: HabitItem; dateStr: string; notes: string } | null>(null);

    // Numeric Popover State
    const [numericPopover, setNumericPopover] = useState<{
        habitId: number;
        dateStr: string;
        currentVal: number;
        targetVal: number;
        unit: string;
    } | null>(null);

    const openCreateModal = () => {
        setEditingHabitId(null);
        setFormName('');
        setFormIcon('🧘');
        setFormColor('#6366f1');
        setFormTarget(daysInCurrentMonth);
        setFormType('positive');
        setFormMeasure('boolean');
        setFormUnit('ml');
        setFormTargetValue(2000);
        setFormFreqType('daily');
        setFormFreqDays([1, 2, 3, 4, 5]);
        setFormTimeOfDay('morning');
        setShowCreateModal(true);
    };

    const editHabit = (habit: HabitItem) => {
        setEditingHabitId(habit.id);
        setFormName(habit.name);
        setFormIcon(habit.icon);
        setFormColor(habit.color);
        setFormTarget(habit.monthlyTarget);
        setFormType(habit.habitType || 'positive');
        setFormMeasure(habit.measurementType || 'boolean');
        setFormUnit(habit.unit || 'ml');
        setFormTargetValue(habit.targetValue || 2000);
        setFormFreqType((habit.frequencyType as any) || 'daily');
        setFormFreqDays(habit.frequencyDays || [1, 2, 3, 4, 5]);
        setFormTimeOfDay(habit.timeOfDay || 'morning');
        setShowCreateModal(true);
    };

    const confirmDelete = (habit: HabitItem) => {
        setHabitToDelete(habit);
        setShowDeleteModal(true);
    };

    return {
        showCreateModal,
        setShowCreateModal,
        editingHabitId,
        setEditingHabitId,
        formName,
        setFormName,
        formIcon,
        setFormIcon,
        formColor,
        setFormColor,
        formTarget,
        setFormTarget,
        formType,
        setFormType,
        formMeasure,
        setFormMeasure,
        formUnit,
        setFormUnit,
        formTargetValue,
        setFormTargetValue,
        formFreqType,
        setFormFreqType,
        formFreqDays,
        setFormFreqDays,
        formTimeOfDay,
        setFormTimeOfDay,
        showBatchModal,
        setShowBatchModal,
        batchRows,
        setBatchRows,
        showDeleteModal,
        setShowDeleteModal,
        habitToDelete,
        setHabitToDelete,
        detailModalHabit,
        setDetailModalHabit,
        timerModalHabit,
        setTimerModalHabit,
        noteModalData,
        setNoteModalData,
        numericPopover,
        setNumericPopover,
        openCreateModal,
        editHabit,
        confirmDelete
    };
}
