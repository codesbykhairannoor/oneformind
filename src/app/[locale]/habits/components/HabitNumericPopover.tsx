'use client';

import React from 'react';
import ModalPortal from '@/components/ModalPortal';
import { Plus, Minus } from 'lucide-react';

interface HabitNumericPopoverProps {
    data: {
        habitId: number;
        dateStr: string;
        currentVal: number;
        targetVal: number;
        unit: string;
    } | null;
    isIndo: boolean;
    onClose: () => void;
    onUpdate: (habitId: number, dateStr: string, newVal: number) => void;
    onChangeVal: (newVal: number) => void;
}

export default function HabitNumericPopover({
    data,
    isIndo,
    onClose,
    onUpdate,
    onChangeVal
}: HabitNumericPopoverProps) {
    if (!data) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 w-full max-w-xs relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
                        {isIndo ? 'Input Progres Harian' : 'Update Daily Progress'}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 mb-4">
                        {data.dateStr} • Target: {data.targetVal} {data.unit}
                    </p>

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => onChangeVal(Math.max(0, data.currentVal - 100))}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            <Minus size={16} />
                        </button>
                        <input
                            type="number"
                            value={data.currentVal}
                            onChange={(e) => onChangeVal(Number(e.target.value))}
                            className="w-24 text-center font-black text-xl py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => onChangeVal(data.currentVal + 100)}
                            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                        >
                            {isIndo ? 'Batal' : 'Cancel'}
                        </button>
                        <button
                            type="button"
                            onClick={() => onUpdate(data.habitId, data.dateStr, data.currentVal)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none transition"
                        >
                            {isIndo ? 'Simpan' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
