'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HabitItem, BatchRow } from '../types';
import HabitFormModal from './HabitFormModal';
import HabitBatchModal from './HabitBatchModal';
import HabitDeleteModal from './HabitDeleteModal';

const HabitDetailModal = dynamic(() => import('./HabitDetailModal'), { ssr: false });
const HabitTimerModal = dynamic(() => import('./HabitTimerModal'), { ssr: false });
const HabitNoteModal = dynamic(() => import('./HabitNoteModal'), { ssr: false });

interface HabitsModalsContainerProps {
    detailModalHabit: HabitItem | null;
    setDetailModalHabit: (h: HabitItem | null) => void;
    timerModalHabit: HabitItem | null;
    setTimerModalHabit: (h: HabitItem | null) => void;
    noteModalData: { habit: HabitItem; dateStr: string; notes: string } | null;
    setNoteModalData: (d: { habit: HabitItem; dateStr: string; notes: string } | null) => void;
    showCreateModal: boolean;
    setShowCreateModal: (v: boolean) => void;
    editingHabitId: number | null;
    showBatchModal: boolean;
    setShowBatchModal: (v: boolean) => void;
    batchRows: BatchRow[];
    setBatchRows: (rows: BatchRow[]) => void;
    showDeleteModal: boolean;
    setShowDeleteModal: (v: boolean) => void;
    habitToDelete: HabitItem | null;
    isIndo: boolean;
    locale: string;
    todayStr: string;
    monthNames: string[];
    selectedMonthIndex: number;
    selectedYear: number;
    currentMonthKey: string;
    daysInCurrentMonth: number;
    iconList: string[];
    colorPalette: string[];
    formName: string;
    setFormName: (v: string) => void;
    formIcon: string;
    setFormIcon: (v: string) => void;
    formColor: string;
    setFormColor: (v: string) => void;
    formTarget: number;
    setFormTarget: (v: number) => void;
    formType: 'positive' | 'negative';
    setFormType: (v: 'positive' | 'negative') => void;
    formMeasure: 'boolean' | 'numeric';
    setFormMeasure: (v: 'boolean' | 'numeric') => void;
    formUnit: string;
    setFormUnit: (v: string) => void;
    formTargetValue: number;
    setFormTargetValue: (v: number) => void;
    formFreqType: 'daily' | 'weekly_days';
    setFormFreqType: (v: 'daily' | 'weekly_days') => void;
    formFreqDays: number[];
    setFormFreqDays: (v: number[]) => void;
    formTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
    setFormTimeOfDay: (v: 'morning' | 'afternoon' | 'evening' | 'anytime') => void;
    onToggleStatus: (habitId: number, dateString: string, forceStatus?: 'completed' | 'skipped' | 'relapse') => void;
    onSaveNote: (habitId: number, dateStr: string, noteText: string) => void;
    onSubmitSingleHabit: (e: React.FormEvent) => void;
    onSubmitBatchHabits: () => void;
    onExecuteDelete: () => void;
}

export default function HabitsModalsContainer({
    detailModalHabit,
    setDetailModalHabit,
    timerModalHabit,
    setTimerModalHabit,
    noteModalData,
    setNoteModalData,
    showCreateModal,
    setShowCreateModal,
    editingHabitId,
    showBatchModal,
    setShowBatchModal,
    batchRows,
    setBatchRows,
    showDeleteModal,
    setShowDeleteModal,
    habitToDelete,
    isIndo,
    locale,
    todayStr,
    monthNames,
    selectedMonthIndex,
    selectedYear,
    currentMonthKey,
    daysInCurrentMonth,
    iconList,
    colorPalette,
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
    onToggleStatus,
    onSaveNote,
    onSubmitSingleHabit,
    onSubmitBatchHabits,
    onExecuteDelete
}: HabitsModalsContainerProps) {
    return (
        <>
            {/* MODAL: DETAIL */}
            <HabitDetailModal
                habit={detailModalHabit}
                isOpen={Boolean(detailModalHabit)}
                onClose={() => setDetailModalHabit(null)}
                locale={locale}
            />

            {/* MODAL: TIMER */}
            <HabitTimerModal
                habit={timerModalHabit}
                isOpen={Boolean(timerModalHabit)}
                onClose={() => setTimerModalHabit(null)}
                onComplete={(habitId) => {
                    onToggleStatus(habitId, todayStr, 'completed');
                }}
                locale={locale}
            />

            {/* MODAL: NOTE */}
            <HabitNoteModal
                habit={noteModalData?.habit || null}
                dateStr={noteModalData?.dateStr || todayStr}
                initialNotes={noteModalData?.notes || ''}
                isOpen={Boolean(noteModalData)}
                onClose={() => setNoteModalData(null)}
                onSave={onSaveNote}
                locale={locale}
            />

            {/* MODAL: CREATE / EDIT HABIT */}
            <HabitFormModal
                isOpen={showCreateModal}
                editingHabitId={editingHabitId}
                isIndo={isIndo}
                monthNames={monthNames}
                selectedMonthIndex={selectedMonthIndex}
                selectedYear={selectedYear}
                currentMonthKey={currentMonthKey}
                daysInCurrentMonth={daysInCurrentMonth}
                iconList={iconList}
                colorPalette={colorPalette}
                formName={formName}
                setFormName={setFormName}
                formIcon={formIcon}
                setFormIcon={setFormIcon}
                formColor={formColor}
                setFormColor={setFormColor}
                formTarget={formTarget}
                setFormTarget={setFormTarget}
                formType={formType}
                setFormType={setFormType}
                formMeasure={formMeasure}
                setFormMeasure={setFormMeasure}
                formUnit={formUnit}
                setFormUnit={setFormUnit}
                formTargetValue={formTargetValue}
                setFormTargetValue={setFormTargetValue}
                formFreqType={formFreqType}
                setFormFreqType={setFormFreqType}
                formFreqDays={formFreqDays}
                setFormFreqDays={setFormFreqDays}
                formTimeOfDay={formTimeOfDay}
                setFormTimeOfDay={setFormTimeOfDay}
                onClose={() => setShowCreateModal(false)}
                onOpenBatch={() => setShowBatchModal(true)}
                onDelete={onExecuteDelete}
                onSubmit={onSubmitSingleHabit}
            />

            {/* MODAL: BATCH HABIT CREATION */}
            <HabitBatchModal
                isOpen={showBatchModal}
                isIndo={isIndo}
                daysInCurrentMonth={daysInCurrentMonth}
                iconList={iconList}
                colorPalette={colorPalette}
                batchRows={batchRows}
                setBatchRows={setBatchRows}
                onClose={() => setShowBatchModal(false)}
                onSubmit={onSubmitBatchHabits}
            />

            {/* MODAL: DELETE CONFIRMATION */}
            <HabitDeleteModal
                isOpen={showDeleteModal}
                habit={habitToDelete}
                isIndo={isIndo}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onExecuteDelete}
            />
        </>
    );
}
