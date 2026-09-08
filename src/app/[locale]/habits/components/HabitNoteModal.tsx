'use client';

import { useState, useEffect } from 'react';
import ModalPortal from '@/components/ModalPortal';
import { X, MessageSquare, Trash2, Check, Calendar } from 'lucide-react';
import { HabitItem } from './HabitDetailModal';

interface HabitNoteModalProps {
    habit: HabitItem | null;
    dateStr: string;
    initialNotes?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (habitId: number, dateStr: string, notes: string) => void;
    locale: string;
}

export default function HabitNoteModal({
    habit,
    dateStr,
    initialNotes = '',
    isOpen,
    onClose,
    onSave,
    locale
}: HabitNoteModalProps) {
    if (!isOpen || !habit) return null;

    const isIndo = locale === 'id';
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes, isOpen]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(habit.id, dateStr, notes.trim());
        onClose();
    };

    const handleDelete = () => {
        onSave(habit.id, dateStr, '');
        onClose();
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                                style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                            >
                                {habit.icon}
                            </div>
                            <div>
                                <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-slate-100 truncate max-w-[240px]">
                                    {habit.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mt-0.5">
                                    <Calendar size={13} className="text-indigo-500" />
                                    <span>{dateStr}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={onClose} 
                            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                                {isIndo ? 'Catatan Refleksi Harian' : 'Daily Reflection Note'}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={isIndo 
                                    ? 'Contoh: Lari 5km pagi hari di taman, udara sangat segar dan tempo stabil...' 
                                    : 'Example: Morning 5km run in the park, crisp weather and steady pace...'}
                                rows={4}
                                maxLength={300}
                                className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-medium text-xs text-slate-800 dark:text-slate-100 focus:border-indigo-500 outline-none resize-none"
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-[10px] font-bold text-slate-400">
                                    {notes.length}/300
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                            {initialNotes && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition flex items-center justify-center border border-rose-100 dark:border-rose-500/20"
                                    title={isIndo ? 'Hapus Catatan' : 'Delete Note'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition flex items-center justify-center gap-2"
                            >
                                <Check size={16} strokeWidth={3} />
                                <span>{isIndo ? 'Simpan Catatan' : 'Save Note'}</span>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </ModalPortal>
    );
}
