'use client';

import { useState } from 'react';
import { HabitItem, LifeOSTab } from '../types';

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
    const [formStartTime, setFormStartTime] = useState<string>('');
    const [formEndTime, setFormEndTime] = useState<string>('');
    const [formStartDate, setFormStartDate] = useState<string>('');
    const [formEndDate, setFormEndDate] = useState<string>('');
    // Systemic Life OS Cross-Module Fields
    const [formGoalId, setFormGoalId] = useState<string | number | undefined>(undefined);
    const [formGoalTitle, setFormGoalTitle] = useState<string>('');
    const [formAnchorCue, setFormAnchorCue] = useState<string>('');
    const [formElasticMini, setFormElasticMini] = useState<string>('');
    const [formDailyFinancialImpact, setFormDailyFinancialImpact] = useState<number | undefined>(undefined);
    const [formIsKeystone, setFormIsKeystone] = useState<boolean>(false);
    const [formSyncedTabs, setFormSyncedTabs] = useState<LifeOSTab[]>(['calendar', 'planner']);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);

    // Other Modals State
    const [detailModalHabit, setDetailModalHabit] = useState<HabitItem | null>(null);
    const [noteModalData, setNoteModalData] = useState<{ habit: HabitItem; dateStr: string; notes: string } | null>(null);

    // Numeric Popover State
    const [numericPopover, setNumericPopover] = useState<{
        habitId: number;
        habitName?: string;
        habitIcon?: string;
        habitColor?: string;
        dateStr: string;
        currentVal: number;
        targetVal: number;
        unit: string;
        currentNotes?: string;
    } | null>(null);

    const handleSetFormMeasure = (measure: 'boolean' | 'numeric') => {
        setFormMeasure(measure);
        if (measure === 'boolean') {
            setFormUnit('x');
            setFormTargetValue(1);
        } else if (measure === 'numeric') {
            if (!formUnit || formUnit === 'x') {
                setFormUnit('ml');
            }
            if (!formTargetValue || formTargetValue <= 1) {
                setFormTargetValue(2000);
            }
        }
    };

    const openCreateModal = () => {
        setEditingHabitId(null);
        setFormName('');
        setFormIcon('🧘');
        setFormColor('#6366f1');
        setFormTarget(daysInCurrentMonth);
        setFormType('positive');
        setFormMeasure('boolean');
        setFormUnit('x');
        setFormTargetValue(1);
        setFormFreqType('daily');
        setFormFreqDays([1, 2, 3, 4, 5]);
        setFormTimeOfDay('morning');
        setFormStartTime('');
        setFormEndTime('');
        setFormStartDate('');
        setFormEndDate('');
        setFormGoalId(undefined);
        setFormGoalTitle('');
        setFormAnchorCue('');
        setFormElasticMini('');
        setFormDailyFinancialImpact(undefined);
        setFormIsKeystone(false);
        setFormSyncedTabs([]);
        setShowCreateModal(true);
    };

    const editHabit = (habit: HabitItem) => {
        const isBool = habit.measurementType === 'boolean';
        setEditingHabitId(habit.id);
        setFormName(habit.name);
        setFormIcon(habit.icon);
        setFormColor(habit.color);
        setFormTarget(habit.monthlyTarget);
        setFormType(habit.habitType || 'positive');
        setFormMeasure(habit.measurementType || 'boolean');
        setFormUnit(isBool ? 'x' : (habit.unit && habit.unit !== 'x' ? habit.unit : 'ml'));
        setFormTargetValue(isBool ? 1 : (habit.targetValue && habit.targetValue > 1 ? habit.targetValue : 2000));
        setFormFreqType((habit.frequencyType as any) || 'daily');
        setFormFreqDays(habit.frequencyDays || [1, 2, 3, 4, 5]);
        setFormTimeOfDay(habit.timeOfDay || 'morning');
        setFormStartTime(habit.startTime || '');
        setFormEndTime(habit.endTime || '');
        setFormStartDate(habit.startDate || '');
        setFormEndDate(habit.endDate || '');
        setFormGoalId(habit.goalId);
        setFormGoalTitle(habit.goalTitle || '');
        setFormAnchorCue(habit.anchorCue || '');
        setFormElasticMini(habit.elasticMini || '');
        setFormDailyFinancialImpact(habit.dailyFinancialImpact);
        setFormIsKeystone(!!habit.isKeystone);
        setFormSyncedTabs(habit.syncedTabs || (habit.startTime ? ['planner'] : []));
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
        setFormMeasure: handleSetFormMeasure,
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
        formStartTime,
        setFormStartTime,
        formEndTime,
        setFormEndTime,
        formStartDate,
        setFormStartDate,
        formEndDate,
        setFormEndDate,
        formGoalId,
        setFormGoalId,
        formGoalTitle,
        setFormGoalTitle,
        formAnchorCue,
        setFormAnchorCue,
        formElasticMini,
        setFormElasticMini,
        formDailyFinancialImpact,
        setFormDailyFinancialImpact,
        formIsKeystone,
        setFormIsKeystone,
        formSyncedTabs,
        setFormSyncedTabs,
        showDeleteModal,
        setShowDeleteModal,
        habitToDelete,
        setHabitToDelete,
        detailModalHabit,
        setDetailModalHabit,
        noteModalData,
        setNoteModalData,
        numericPopover,
        setNumericPopover,
        openCreateModal,
        editHabit,
        confirmDelete
    };
}
