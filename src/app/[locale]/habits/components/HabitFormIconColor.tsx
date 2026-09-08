'use client';

import React from 'react';

interface HabitFormIconColorProps {
    isIndo: boolean;
    formName: string;
    setFormName: (v: string) => void;
    formIcon: string;
    setFormIcon: (v: string) => void;
    formColor: string;
    setFormColor: (v: string) => void;
    iconList: string[];
    colorPalette: string[];
}

export default function HabitFormIconColor({
    isIndo,
    formName,
    setFormName,
    formIcon,
    setFormIcon,
    formColor,
    setFormColor,
    iconList,
    colorPalette
}: HabitFormIconColorProps) {
    return (
        <div className="space-y-4">
            {/* Habit Name Input */}
            <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    {isIndo ? 'Nama Habit' : 'Habit Name'}
                </label>
                <div className="relative flex items-center">
                    <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={isIndo ? 'cth: Meditasi 15 Menit, Minum 2L Air...' : 'e.g., 15 Min Meditation, Drink 2L Water...'}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Icon Picker */}
            <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    {isIndo ? 'Pilih Ikon' : 'Choose Icon'}
                </label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 max-h-24 overflow-y-auto no-scrollbar">
                    {iconList.map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => setFormIcon(icon)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                                formIcon === icon
                                    ? 'bg-white dark:bg-slate-700 shadow-md scale-110 ring-2 ring-indigo-500'
                                    : 'hover:bg-slate-200 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Picker */}
            <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    {isIndo ? 'Pilih Warna Aksen' : 'Choose Accent Color'}
                </label>
                <div className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
                    {colorPalette.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setFormColor(color)}
                            className={`w-7 h-7 rounded-full shrink-0 transition-transform ${
                                formColor === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
                            }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
