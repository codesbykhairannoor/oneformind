'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowRight, Plus, Zap, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { playCheckSound, playUncheckSound } from '@/lib/habitAudio';

interface DashboardTodayTasksProps {
    plannerData: any;
    synergy: any;
    t: any;
}

export default function DashboardTodayTasks({ plannerData, synergy, t }: DashboardTodayTasksProps) {
    const [tasks, setTasks] = useState<any[]>(plannerData.upcoming || []);
    const [habitsList, setHabitsList] = useState<any[]>(synergy.habits.todayList || []);
    const [completedHabitCount, setCompletedHabitCount] = useState<number>(synergy.habits.completed || 0);

    const totalHabits = habitsList.length;
    const habitPercent = totalHabits > 0 ? Math.round((completedHabitCount / totalHabits) * 100) : 0;

    // Toggle Planner Task completion
    const togglePlannerTask = async (taskId: number) => {
        const target = tasks.find(t => t.id === taskId);
        if (!target) return;
        const nextState = !target.isCompleted;

        if (nextState) playCheckSound();
        else playUncheckSound();

        // Optimistic UI
        setTasks(prev => prev.map(item => item.id === taskId ? { ...item, isCompleted: nextState } : item));

        try {
            await fetch(`/api/planner/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isCompleted: nextState })
            });
            window.dispatchEvent(new Event('planner_updated'));
        } catch (e) {
            console.error('Failed to toggle task status', e);
            // Revert on error
            setTasks(prev => prev.map(item => item.id === taskId ? { ...item, isCompleted: !nextState } : item));
        }
    };

    // Toggle Habit completion
    const toggleHabitQuick = async (habitId: number) => {
        const target = habitsList.find(h => h.id === habitId);
        if (!target) return;
        const nextDone = !target.isCompleted;

        if (nextDone) playCheckSound();
        else playUncheckSound();

        // Optimistic UI
        setHabitsList(prev => prev.map(h => h.id === habitId ? { ...h, isCompleted: nextDone } : h));
        setCompletedHabitCount(prev => nextDone ? prev + 1 : Math.max(0, prev - 1));

        const todayStr = new Date().toISOString().split('T')[0];
        try {
            await fetch(`/api/habits/${habitId}/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: todayStr,
                    status: nextDone ? 'completed' : 'empty'
                })
            });
            window.dispatchEvent(new Event('habits_updated'));
        } catch (e) {
            console.error('Failed to toggle habit', e);
            setHabitsList(prev => prev.map(h => h.id === habitId ? { ...h, isCompleted: !nextDone } : h));
            setCompletedHabitCount(prev => nextDone ? Math.max(0, prev - 1) : prev + 1);
        }
    };

    const pendingTasks = tasks.filter(t => !t.isCompleted);
    const completedTasks = tasks.filter(t => t.isCompleted);

    return (
        <section className="bento-card bento-card-hover rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6 space-y-6">
            
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {t('dash_today') || 'Fokus & Agenda Hari Ini'}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {pendingTasks.length > 0
                            ? `${pendingTasks.length} tugas menunggu perhatian Anda`
                            : 'Semua agenda hari ini telah diselesaikan'}
                    </p>
                </div>
                <Link
                    href="/planner"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    {t('dash_schedule') || 'Jadwal Lengkap'}
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Task List */}
            {tasks.length > 0 ? (
                <div className="space-y-2">
                    {tasks.map((task: any) => (
                        <div
                            key={task.id}
                            onClick={() => togglePlannerTask(task.id)}
                            className={`group flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer select-none transition-all duration-200 ${
                                task.isCompleted
                                    ? 'border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/[0.01] opacity-75'
                                    : 'border-slate-200/80 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.03] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    className={`shrink-0 transition-transform active:scale-90 ${
                                        task.isCompleted ? 'text-emerald-500' : 'text-slate-300 group-hover:text-indigo-500 dark:text-slate-600'
                                    }`}
                                >
                                    {task.isCompleted ? (
                                        <CheckCircle2 size={20} className="fill-emerald-500/15" />
                                    ) : (
                                        <Circle size={20} />
                                    )}
                                </button>
                                
                                {task.start_time && (
                                    <span className="shrink-0 rounded-lg bg-white dark:bg-slate-800 px-2 py-1 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 shadow-xs">
                                        {task.start_time}
                                    </span>
                                )}

                                <p className={`truncate text-sm font-semibold transition-all ${
                                    task.isCompleted
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-800 dark:text-slate-100'
                                }`}>
                                    {task.title}
                                </p>
                            </div>

                            <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                task.isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                            }`}>
                                {task.isCompleted ? (t('dash_task_completed') || 'Selesai') : (t('dash_task_scheduled') || 'Terjadwal')}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center dark:border-white/10 dark:bg-white/[0.02]">
                    <Sparkles className="mx-auto text-indigo-500 mb-2" size={24} />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {t('dash_all_tasks_done') || 'Semua tugas hari ini selesai! Bagus sekali.'}
                    </p>
                    <Link
                        href="/planner"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                    >
                        <Plus size={14} />
                        {t('btn_add_task') || 'Tambah Tugas Baru'}
                    </Link>
                </div>
            )}

            {/* Quick Habits Strip */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                        <Zap className="text-indigo-500" size={15} />
                        {t('dash_habit_quick_log') || 'Ceklist Habit Cepat'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                        {completedHabitCount}/{totalHabits} ({habitPercent}%)
                    </span>
                </div>

                {/* Habit Progress Bar */}
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${habitPercent}%` }}
                    />
                </div>

                {/* Habit Quick Badges */}
                {habitsList.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {habitsList.map((habit: any) => (
                            <button
                                key={habit.id}
                                type="button"
                                onClick={() => toggleHabitQuick(habit.id)}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all select-none active:scale-95 ${
                                    habit.isCompleted
                                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10'
                                }`}
                            >
                                <span>{habit.icon || '🌱'}</span>
                                <span className="truncate max-w-[140px]">{habit.name}</span>
                                {habit.isCompleted && <CheckCircle2 size={13} className="ml-0.5" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
