'use client';

import { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useTranslations, useLocale } from 'next-intl';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import { usePageTitle } from '@/hooks/usePageTitle';

import { HabitItem } from './types';
import { calculateMonthDates } from './utils/habitMath';
import { parseRawHabitsData } from './utils/parseHabitsData';
import { useHabitActions } from './hooks/useHabitActions';
import { useHabitPeriod } from './hooks/useHabitPeriod';
import { useHabitFormState } from './hooks/useHabitFormState';
import { useHabitsCalculation } from './hooks/useHabitsCalculation';

import HabitStatsHeader from './components/HabitStatsHeader';
import HabitMatrixTable from './components/HabitMatrixTable';
import HabitMobileView from './components/HabitMobileView';
import HabitNumericPopover from './components/HabitNumericPopover';
import HabitBottomMetrics from './components/HabitBottomMetrics';
import HabitsModalsContainer from './components/HabitsModalsContainer';
import HabitEmptyState from './components/HabitEmptyState';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HabitsClient({ initialDateStr, initialHabits }: { initialDateStr: string; initialHabits: any[] }) {
    usePageTitle('Habits Tracker');
    const t = useTranslations();
    const locale = useLocale();
    const isIndo = locale === 'id';

    const period = useHabitPeriod();

    const iconList = ['🧘', '🏋️', '📚', '💧', '🏃', '🎨', '🍳', '💻', '💤', '🧠', '🌱', '🎯', '🔥', '✨', '📝', '🎸', '🍎', '🚴', '💊', '🚭', '☕', '🚶'];
    const colorPalette = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#06b6d4'];
    const monthNames = isIndo
        ? ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Compute month dates
    const [mkYear, mkMonth] = period.currentMonthKey.split('-').map(Number);
    const daysInCurrentMonth = new Date(mkYear, mkMonth, 0).getDate();
    const monthDates = useMemo(() => calculateMonthDates(period.currentMonthKey, period.todayStr, isIndo), [period.currentMonthKey, period.todayStr, isIndo]);

    const form = useHabitFormState(daysInCurrentMonth);

    // Habits Main State (Fetching & Parsing)
    const { data: fetchedHabits, mutate: mutateHabits } = useSWR(`/api/habits?period=${period.currentMonthKey}`, fetcher, {
        keepPreviousData: true,
    });

    const parsedHabits = useMemo(() => {
        if (!fetchedHabits || !Array.isArray(fetchedHabits)) return null;
        return parseRawHabitsData(fetchedHabits);
    }, [fetchedHabits]);

    const [habits, setHabits] = useState<HabitItem[]>(parsedHabits ?? []);
    const [isLoaded, setIsLoaded] = useState(parsedHabits !== null);

    useEffect(() => {
        if (parsedHabits !== null) {
            setHabits(parsedHabits);
            setIsLoaded(true);
        }
    }, [parsedHabits]);

    // Actions hook
    const actions = useHabitActions({
        habits,
        setHabits,
        currentMonthKey: period.currentMonthKey,
        daysInCurrentMonth,
        isIndo,
        mutateHabits,
        editingHabitId: form.editingHabitId,
        formName: form.formName,
        formIcon: form.formIcon,
        formColor: form.formColor,
        formTarget: form.formTarget,
        formType: form.formType,
        formMeasure: form.formMeasure,
        formUnit: form.formUnit,
        formTargetValue: form.formTargetValue,
        formFreqType: form.formFreqType,
        formFreqDays: form.formFreqDays,
        formTimeOfDay: form.formTimeOfDay,
        setShowCreateModal: form.setShowCreateModal,
        habitToDelete: form.habitToDelete,
        setShowDeleteModal: form.setShowDeleteModal,
        setHabitToDelete: form.setHabitToDelete,
        batchRows: form.batchRows,
        setBatchRows: form.setBatchRows,
        setShowBatchModal: form.setShowBatchModal,
        setNumericPopover: form.setNumericPopover
    });

    const calc = useHabitsCalculation({
        habits,
        monthDates,
        currentMonthKey: period.currentMonthKey,
        activeFilter: period.activeFilter,
        todayStr: period.todayStr,
        daysInCurrentMonth,
        mkYear,
        mkMonth,
        todayYear: period.todayYear,
        todayMonth: period.todayMonth,
        todayDay: period.todayDay,
        isLoaded
    });

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-500">
                
                {/* HABIT HEADER & FILTERS */}
                <HabitStatsHeader
                    isIndo={isIndo}
                    t={t}
                    todayStr={period.todayStr}
                    currentMonthKey={period.currentMonthKey}
                    selectedYear={period.selectedYear}
                    setSelectedYear={period.setSelectedYear}
                    selectedMonthIndex={period.selectedMonthIndex}
                    setSelectedMonthIndex={period.setSelectedMonthIndex}
                    isPeriodDropdownOpen={period.isPeriodDropdownOpen}
                    setIsPeriodDropdownOpen={period.setIsPeriodDropdownOpen}
                    monthNames={monthNames}
                    soundActive={period.soundActive}
                    toggleSound={period.toggleSound}
                    activeFilter={period.activeFilter}
                    setActiveFilter={period.setActiveFilter}
                    overallPercentage={calc.overallPercentage}
                    todayProgress={calc.todayProgress}
                    currentStreak={calc.currentStreak}
                    perfectDaysCount={calc.perfectDaysCount}
                    openCreateModal={form.openCreateModal}
                    setShowBatchModal={form.setShowBatchModal}
                    showHint={period.showHint}
                    setShowHint={period.setShowHint}
                />

                <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
                    {/* HABITS MATRIX (DESKTOP) */}
                    {calc.filteredHabits.length > 0 ? (
                        <>
                            <HabitMatrixTable
                                isIndo={isIndo}
                                t={t}
                                monthDates={monthDates}
                                filteredHabits={calc.filteredHabits}
                                todayStr={period.todayStr}
                                currentMonthKey={period.currentMonthKey}
                                toggleStatus={actions.toggleStatus}
                                setNumericPopover={form.setNumericPopover}
                                setNoteModalData={form.setNoteModalData}
                                setDetailModalHabit={form.setDetailModalHabit}
                                setTimerModalHabit={form.setTimerModalHabit}
                                editHabit={form.editHabit}
                                confirmDelete={form.confirmDelete}
                            />

                            {/* MOBILE VIEW (CARD-BASED + QUICK DATE SELECTOR) */}
                            <HabitMobileView
                                isIndo={isIndo}
                                t={t}
                                monthDates={monthDates}
                                filteredHabits={calc.filteredHabits}
                                selectedMobileDate={period.selectedMobileDate}
                                setSelectedMobileDate={period.setSelectedMobileDate}
                                todayStr={period.todayStr}
                                toggleStatus={actions.toggleStatus}
                                setNumericPopover={form.setNumericPopover}
                                setNoteModalData={form.setNoteModalData}
                                setDetailModalHabit={form.setDetailModalHabit}
                                editHabit={form.editHabit}
                                confirmDelete={form.confirmDelete}
                            />
                        </>
                    ) : (
                        <HabitEmptyState
                            t={t}
                            openCreateModal={form.openCreateModal}
                            setShowBatchModal={form.setShowBatchModal}
                            handleCopyPreviousHabits={actions.handleCopyPreviousHabits}
                        />
                    )}

                    {/* BOTTOM SUMMARY STATS & CORRELATION INSIGHTS */}
                    <HabitBottomMetrics
                        t={t}
                        isIndo={isIndo}
                        processedHabits={calc.processedHabits}
                        totalCompletions={calc.totalCompletions}
                        topHabit={calc.topHabit}
                    />
                </main>

                {/* NUMERIC QUICK-ADJUST POPOVER */}
                {form.numericPopover && (
                    <HabitNumericPopover
                        popover={form.numericPopover}
                        onClose={() => form.setNumericPopover(null)}
                        onSave={actions.handleUpdateNumericValue}
                    />
                )}

                {/* ALL MODALS CONTAINER */}
                <HabitsModalsContainer
                    isIndo={isIndo}
                    t={t}
                    todayStr={period.todayStr}
                    currentMonthKey={period.currentMonthKey}
                    showCreateModal={form.showCreateModal}
                    setShowCreateModal={form.setShowCreateModal}
                    editingHabitId={form.editingHabitId}
                    formName={form.formName}
                    setFormName={form.setFormName}
                    formIcon={form.formIcon}
                    setFormIcon={form.setFormIcon}
                    formColor={form.formColor}
                    setFormColor={form.setFormColor}
                    formTarget={form.formTarget}
                    setFormTarget={form.setFormTarget}
                    formType={form.formType}
                    setFormType={form.setFormType}
                    formMeasure={form.formMeasure}
                    setFormMeasure={form.setFormMeasure}
                    formUnit={form.formUnit}
                    setFormUnit={form.setFormUnit}
                    formTargetValue={form.formTargetValue}
                    setFormTargetValue={form.setFormTargetValue}
                    formFreqType={form.formFreqType}
                    setFormFreqType={form.setFormFreqType}
                    formFreqDays={form.formFreqDays}
                    setFormFreqDays={form.setFormFreqDays}
                    formTimeOfDay={form.formTimeOfDay}
                    setFormTimeOfDay={form.setFormTimeOfDay}
                    iconList={iconList}
                    colorPalette={colorPalette}
                    daysInCurrentMonth={daysInCurrentMonth}
                    submitSingleHabit={actions.submitSingleHabit}
                    showBatchModal={form.showBatchModal}
                    setShowBatchModal={form.setShowBatchModal}
                    batchRows={form.batchRows}
                    setBatchRows={form.setBatchRows}
                    submitBatchHabits={actions.submitBatchHabits}
                    showDeleteModal={form.showDeleteModal}
                    setShowDeleteModal={form.setShowDeleteModal}
                    habitToDelete={form.habitToDelete}
                    executeDelete={actions.executeDelete}
                    detailModalHabit={form.detailModalHabit}
                    setDetailModalHabit={form.setDetailModalHabit}
                    monthDates={monthDates}
                    noteModalData={form.noteModalData}
                    setNoteModalData={form.setNoteModalData}
                    handleSaveNote={actions.handleSaveNote}
                    timerModalHabit={form.timerModalHabit}
                    setTimerModalHabit={form.setTimerModalHabit}
                    toggleStatus={actions.toggleStatus}
                />
            </div>
        </AuthenticatedLayout>
    );
}
