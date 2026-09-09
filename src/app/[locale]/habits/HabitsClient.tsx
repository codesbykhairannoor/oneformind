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

    // Pre-parse initial SSR habits if available
    const initialParsedHabits = useMemo(() => {
        if (initialHabits && Array.isArray(initialHabits) && initialHabits.length > 0) {
            return parseRawHabitsData(initialHabits);
        }
        return [];
    }, [initialHabits]);

    const parsedHabits = useMemo(() => {
        if (!fetchedHabits || !Array.isArray(fetchedHabits)) return null;
        return parseRawHabitsData(fetchedHabits);
    }, [fetchedHabits]);

    const [habits, setHabits] = useState<HabitItem[]>(initialParsedHabits);
    const [isLoaded, setIsLoaded] = useState(initialParsedHabits.length > 0 || parsedHabits !== null);

    // Persistent display mode for quantitative habits (Angka vs Persentase)
    const [numericViewMode, setNumericViewMode] = useState<'value' | 'percent'>('value');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('tranvas_habit_numeric_mode');
            if (saved === 'percent' || saved === 'value') {
                setNumericViewMode(saved);
            }
        }
    }, []);

    const handleToggleNumericViewMode = (mode: 'value' | 'percent') => {
        setNumericViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('tranvas_habit_numeric_mode', mode);
        }
    };

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
                    processedHabits={calc.processedHabits}
                    activeFilter={period.activeFilter}
                    setActiveFilter={period.setActiveFilter}
                    soundActive={period.soundActive}
                    toggleSound={period.toggleSound}
                    numericViewMode={numericViewMode}
                    onToggleNumericViewMode={handleToggleNumericViewMode}
                    isPeriodDropdownOpen={period.isPeriodDropdownOpen}
                    setIsPeriodDropdownOpen={period.setIsPeriodDropdownOpen}
                    selectedYear={period.selectedYear}
                    setSelectedYear={period.setSelectedYear}
                    selectedMonthIndex={period.selectedMonthIndex}
                    setSelectedMonthIndex={period.setSelectedMonthIndex}
                    monthNames={monthNames}
                    todayProgress={calc.todayProgress}
                    showHint={period.showHint}
                    setShowHint={period.setShowHint}
                    openCreateModal={form.openCreateModal}
                />

                <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
                    {/* HABITS MATRIX (DESKTOP) */}
                    {calc.filteredHabits.length > 0 ? (
                        <>
                            <HabitMatrixTable
                                filteredHabits={calc.filteredHabits}
                                monthDates={monthDates}
                                isIndo={isIndo}
                                t={t}
                                numericViewMode={numericViewMode}
                                onToggleNumericViewMode={handleToggleNumericViewMode}
                                onSelectHabitDetail={form.setDetailModalHabit}
                                onSelectHabitTimer={form.setTimerModalHabit}
                                onEditHabit={form.editHabit}
                                onConfirmDelete={form.confirmDelete}
                                onOpenNumericPopover={form.setNumericPopover}
                                onOpenNoteModal={form.setNoteModalData}
                                onToggleStatus={actions.toggleStatus}
                            />

                            {/* MOBILE VIEW (CARD-BASED + QUICK DATE SELECTOR) */}
                            <HabitMobileView
                                monthDates={monthDates}
                                selectedMobileDate={period.selectedMobileDate}
                                setSelectedMobileDate={period.setSelectedMobileDate}
                                filteredHabits={calc.filteredHabits}
                                numericViewMode={numericViewMode}
                                onSelectHabitDetail={form.setDetailModalHabit}
                                onSelectHabitTimer={form.setTimerModalHabit}
                                onOpenNumericPopover={form.setNumericPopover}
                                onToggleStatus={actions.toggleStatus}
                            />
                        </>
                    ) : (
                        <HabitEmptyState
                            activeFilter={period.activeFilter}
                            isIndo={isIndo}
                            t={t}
                            openCreateModal={form.openCreateModal}
                            handleCopyPreviousHabits={actions.handleCopyPreviousHabits}
                        />
                    )}

                    {/* BOTTOM SUMMARY STATS & CORRELATION INSIGHTS */}
                    <HabitBottomMetrics
                        isIndo={isIndo}
                        overallPercentage={calc.overallPercentage}
                        topHabit={calc.topHabit}
                        currentStreak={calc.currentStreak}
                        perfectDaysCount={calc.perfectDaysCount}
                        totalCompletions={calc.totalCompletions}
                        processedHabits={calc.processedHabits}
                    />
                </main>

                {/* NUMERIC QUICK-ADJUST POPOVER */}
                {form.numericPopover && (
                    <HabitNumericPopover
                        data={form.numericPopover}
                        isIndo={isIndo}
                        onClose={() => form.setNumericPopover(null)}
                        onUpdate={actions.handleUpdateNumericValue}
                        onChangeVal={(newVal) => form.setNumericPopover(prev => prev ? { ...prev, currentVal: newVal } : null)}
                    />
                )}

                {/* ALL MODALS CONTAINER */}
                <HabitsModalsContainer
                    detailModalHabit={form.detailModalHabit}
                    setDetailModalHabit={form.setDetailModalHabit}
                    timerModalHabit={form.timerModalHabit}
                    setTimerModalHabit={form.setTimerModalHabit}
                    noteModalData={form.noteModalData}
                    setNoteModalData={form.setNoteModalData}
                    showCreateModal={form.showCreateModal}
                    setShowCreateModal={form.setShowCreateModal}
                    editingHabitId={form.editingHabitId}
                    showBatchModal={form.showBatchModal}
                    setShowBatchModal={form.setShowBatchModal}
                    batchRows={form.batchRows}
                    setBatchRows={form.setBatchRows}
                    showDeleteModal={form.showDeleteModal}
                    setShowDeleteModal={form.setShowDeleteModal}
                    habitToDelete={form.habitToDelete}
                    isIndo={isIndo}
                    locale={locale}
                    todayStr={period.todayStr}
                    monthNames={monthNames}
                    selectedMonthIndex={period.selectedMonthIndex}
                    selectedYear={period.selectedYear}
                    currentMonthKey={period.currentMonthKey}
                    daysInCurrentMonth={daysInCurrentMonth}
                    iconList={iconList}
                    colorPalette={colorPalette}
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
                    onToggleStatus={actions.toggleStatus}
                    onSaveNote={actions.handleSaveNote}
                    onSubmitSingleHabit={actions.submitSingleHabit}
                    onSubmitBatchHabits={actions.submitBatchHabits}
                    onExecuteDelete={actions.executeDelete}
                />
            </div>
        </AuthenticatedLayout>
    );
}
