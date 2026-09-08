'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ModalPortal from '@/components/ModalPortal';
import { X } from 'lucide-react';
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
    onOpenBatch: () => void;
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
    onOpenBatch,
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

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={onClose}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
                        <div>
                            <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">
                                {editingTaskId ? (t('modal_edit_title') || 'Edit Tugas') : (t('modal_new_title') || 'Tugas Baru')}
                            </h3>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">
                                {new Date(selectedDate).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {!editingTaskId && (
                                <button 
                                    onClick={onOpenBatch} 
                                    type="button" 
                                    className="text-[10px] font-black tracking-widest px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition flex items-center gap-1 active:scale-95"
                                >
                                    Batch
                                </button>
                            )}
                            <button 
                                onClick={onClose} 
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={onSave} className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                {t('modal_label_task_name') || 'Judul Tugas'}
                            </label>
                            <input 
                                type="text" 
                                required
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder={t('modal_placeholder_task_name') || 'Misal: Review Laporan Bulanan'}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                    {t('label_start_time') || 'Mulai'}
                                </label>
                                <input 
                                    type="time" 
                                    required
                                    value={taskStartTime}
                                    onChange={(e) => setTaskStartTime(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                    {t('label_end_time') || 'Selesai'}
                                </label>
                                <input 
                                    type="time" 
                                    required
                                    value={taskEndTime}
                                    onChange={(e) => setTaskEndTime(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                {t('label_priority') || 'Kategori / Prioritas'}
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
                                        className={`py-3 px-1 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${taskType === type.id ? type.color + ' ring-2 ring-indigo-500/50 shadow-md scale-105' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="text-xl leading-none">{type.icon}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                {t('label_notes') || 'Catatan Tambahan (Opsional)'}
                            </label>
                            <textarea 
                                value={taskNotes}
                                onChange={(e) => setTaskNotes(e.target.value)}
                                placeholder={t('placeholder_notes') || 'Konteks, link, atau detail lain...'}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 dark:placeholder-slate-500 min-h-[100px] resize-none"
                            />
                        </div>

                        {conflictError && (
                            <div className="px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
                                <span>{conflictError}</span>
                            </div>
                        )}

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
                                {editingTaskId ? (t('btn_save_all') || 'Simpan Perubahan') : (t('modal_new_title') || 'Tambahkan Tugas')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ModalPortal>
    );
}
