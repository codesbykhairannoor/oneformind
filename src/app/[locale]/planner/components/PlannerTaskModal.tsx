'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X, Clock, Flame, Briefcase, Sparkles, CheckSquare } from 'lucide-react';
import { TaskItem } from '../types';
import { checkTimeConflict } from '../utils/plannerMath';

interface PlannerTaskModalProps {
    show: boolean;
    onClose: () => void;
    editingTaskId: number | null;
    selectedDate: string;
    tasks: TaskItem[];
    taskTitle: string;
    setTaskTitle: (val: string) => void;
    taskStartTime: string;
    setTaskStartTime: (val: string) => void;
    taskEndTime: string;
    setTaskEndTime: (val: string) => void;
    taskType: number;
    setTaskType: (val: number) => void;
    taskNotes: string;
    setTaskNotes: (val: string) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: () => void;
}

export default function PlannerTaskModal({
    show,
    onClose,
    editingTaskId,
    selectedDate,
    tasks,
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
    onSave,
    onDelete,
}: PlannerTaskModalProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [conflictError, setConflictError] = useState<string | null>(null);

    useEffect(() => {
        if (show) {
            const err = checkTimeConflict(
                taskStartTime,
                taskEndTime,
                tasks,
                selectedDate,
                editingTaskId,
                t('error_duration_min') || 'Minimal 5 menit!',
                t('error_conflict') || 'Jadwal bentrok!'
            );
            setConflictError(err);
        } else {
            setConflictError(null);
        }
    }, [taskStartTime, taskEndTime, editingTaskId, tasks, show, selectedDate, t]);

    if (!show) return null;

    // Helper to compute duration label
    const getDurationText = () => {
        if (!taskStartTime || !taskEndTime) return '';
        const [sH, sM] = taskStartTime.split(':').map(Number);
        const [eH, eM] = taskEndTime.split(':').map(Number);
        let diff = (eH * 60 + eM) - (sH * 60 + sM);
        if (diff < 0) diff += 1440;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        if (hours === 0) return `${mins} menit`;
        if (mins === 0) return `${hours} jam`;
        return `${hours}j ${mins}m`;
    };

    // Quick duration applier
    const applyDuration = (durationMinutes: number) => {
        const start = taskStartTime || '09:00';
        const [sH, sM] = start.split(':').map(Number);
        const endMinutes = (sH * 60 + sM) + durationMinutes;
        const finalEndH = String(Math.floor(endMinutes / 60) % 24).padStart(2, '0');
        const finalEndM = String(endMinutes % 60).padStart(2, '0');
        setTaskEndTime(`${finalEndH}:${finalEndM}`);
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 animate-in fade-in duration-200 backdrop-blur-sm">
                <div className="absolute inset-0" onClick={onClose}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    {/* Modal Header */}
                    <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
                        <div>
                            <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">
                                {editingTaskId ? (t('modal_edit_title') || 'Edit Jadwal') : (t('modal_new_title') || 'Tambah Jadwal Baru')}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                                {new Date(selectedDate).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={onSave} className="p-6 md:p-8 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                        
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                {t('modal_label_task_name') || 'Nama Kegiatan / Tugas'}
                            </label>
                            <input 
                                type="text" 
                                required
                                autoFocus
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder={t('modal_placeholder_task_name') || 'Misal: Review sprint, Deep work, Baca buku'}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                            />
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                    {t('label_start_time') || 'Mulai'}
                                </label>
                                <input 
                                    type="time" 
                                    required
                                    value={taskStartTime}
                                    onChange={(e) => setTaskStartTime(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-black font-mono text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                    {t('label_end_time') || 'Selesai'}
                                </label>
                                <input 
                                    type="time" 
                                    required
                                    value={taskEndTime}
                                    onChange={(e) => setTaskEndTime(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-black font-mono text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Quick Duration Chips */}
                        <div className="space-y-1.5 -mt-1 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={11} className="text-indigo-500" /> Pilih Durasi
                                </span>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    {getDurationText()}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { mins: 15, label: '15m' },
                                    { mins: 30, label: '30m' },
                                    { mins: 45, label: '45m' },
                                    { mins: 60, label: '1 Jam' },
                                    { mins: 90, label: '1.5 Jam' },
                                    { mins: 120, label: '2 Jam' }
                                ].map(chip => (
                                    <button
                                        key={chip.mins}
                                        type="button"
                                        onClick={() => applyDuration(chip.mins)}
                                        className="px-3 py-1 rounded-xl text-[10px] font-black bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition active:scale-95 shadow-sm"
                                    >
                                        {chip.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority / Category */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                {t('label_priority') || 'Prioritas & Kategori'}
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { id: 1, label: t('label_urgent') || 'Urgent', icon: '🔥', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' },
                                    { id: 2, label: t('label_work') || 'Work', icon: '💼', color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' },
                                    { id: 3, label: t('prio_normal') || 'Normal', icon: '🌱', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
                                    { id: 4, label: t('label_todo') || 'Task', icon: '📝', color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
                                ].map(type => (
                                    <button 
                                        key={type.id}
                                        type="button"
                                        onClick={() => setTaskType(type.id)}
                                        className={`py-2.5 px-1 rounded-2xl border flex flex-col items-center gap-1 transition-all ${taskType === type.id ? type.color + ' ring-2 ring-indigo-500/50 shadow-md scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="text-lg leading-none">{type.icon}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                {t('label_notes') || 'Catatan Tambahan (Opsional)'}
                            </label>
                            <textarea 
                                value={taskNotes}
                                onChange={(e) => setTaskNotes(e.target.value)}
                                placeholder={t('placeholder_notes') || 'Link, konteks, atau instruksi singkat...'}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 min-h-[80px] resize-none"
                            />
                        </div>

                        {/* Conflict Warning */}
                        {conflictError && (
                            <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                                <span>⚠️ {conflictError}</span>
                            </div>
                        )}

                        {/* Form Buttons */}
                        <div className="pt-2 flex gap-3 shrink-0">
                            {editingTaskId && (
                                <button 
                                    type="button" 
                                    onClick={onDelete} 
                                    className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                                >
                                    {t('yes_delete') || 'Hapus'}
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all"
                            >
                                {editingTaskId ? (t('btn_save_all') || 'Simpan Perubahan') : (t('modal_new_title') || 'Tambahkan ke Jadwal')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
