'use client';

import React from 'react';
import ModalPortal from '@/components/ModalPortal';
import { Trash2 } from 'lucide-react';
import { HabitItem } from '../types';

interface HabitDeleteModalProps {
    isOpen: boolean;
    habit: HabitItem | null;
    isIndo: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function HabitDeleteModal({
    isOpen,
    habit,
    isIndo,
    onClose,
    onConfirm
}: HabitDeleteModalProps) {
    if (!isOpen || !habit) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose} />
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl border border-rose-100 dark:border-rose-500/20">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
                        {isIndo ? 'Hapus Habit Ini?' : 'Delete This Habit?'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        {isIndo
                            ? `Apakah Anda yakin ingin menghapus "${habit.name}"? Semua histori progres dan catatan habit ini akan dihapus permanen.`
                            : `Are you sure you want to delete "${habit.name}"? All logs and notes will be permanently removed.`}
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex-1 py-3 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 dark:shadow-none transition"
                        >
                            {isIndo ? 'Ya, Hapus' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
