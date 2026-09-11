'use client';

import React, { useState } from 'react';
import { Flame, Target, Check } from 'lucide-react';
import { ReadingGoal } from '../../types/books';

interface BookGoalBannerProps {
    readingGoal: ReadingGoal;
    completedCount: number;
    readingNowCount: number;
    wantToReadCount: number;
    totalPagesRead: number;
    isIndo: boolean;
    onSaveGoal: (goal: ReadingGoal) => void;
}

export default function BookGoalBanner({
    readingGoal,
    completedCount,
    readingNowCount,
    wantToReadCount,
    totalPagesRead,
    isIndo,
    onSaveGoal
}: BookGoalBannerProps) {
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [tempTarget, setTempTarget] = useState(readingGoal.target_books);

    const goalPercentage = readingGoal.target_books > 0 
        ? Math.min(100, Math.round((completedCount / readingGoal.target_books) * 100)) 
        : 0;

    const handleSave = () => {
        onSaveGoal({ ...readingGoal, target_books: tempTarget });
        setIsEditingGoal(false);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-[2.5rem] p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none"></div>

            {/* Left: Target & Progress */}
            <div className="relative z-10 space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-black tracking-wider">
                    <Flame size={13} className="text-amber-400" />
                    <span>{isIndo ? 'TARGET LITERASI TAHUNAN' : 'ANNUAL READING GOAL'}</span>
                </div>

                <div className="flex items-baseline gap-3">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {completedCount} <span className="text-lg text-indigo-300 font-bold">/ {readingGoal.target_books} {isIndo ? 'Buku Selesai' : 'Books Finished'}</span>
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
                        {goalPercentage}% {isIndo ? 'Tercapai' : 'Done'}
                    </span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${goalPercentage}%` }}
                    ></div>
                </div>

                <p className="text-xs text-indigo-200/80">
                    {isIndo 
                        ? `Total ${totalPagesRead.toLocaleString()} halaman telah dibaca. Terus pertahankan momentum belajar dan literasi!` 
                        : `Total ${totalPagesRead.toLocaleString()} pages consumed. Maintain reading velocity and intellectual momentum!`}
                </p>
            </div>

            {/* Right: Quick Stats & Adjuster */}
            <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
                <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 min-w-[100px]">
                    <span className="text-[10px] font-black uppercase text-indigo-200 block">
                        {isIndo ? 'Sedang Dibaca' : 'Reading Now'}
                    </span>
                    <span className="text-xl font-black font-mono mt-0.5 block">{readingNowCount}</span>
                </div>

                <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 min-w-[100px]">
                    <span className="text-[10px] font-black uppercase text-indigo-200 block">
                        {isIndo ? 'Ingin Dibaca' : 'Queue'}
                    </span>
                    <span className="text-xl font-black font-mono mt-0.5 block">{wantToReadCount}</span>
                </div>

                {isEditingGoal ? (
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/15 border border-white/20">
                        <input
                            type="number"
                            min="1"
                            max="200"
                            value={tempTarget}
                            onChange={(e) => setTempTarget(parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1.5 rounded-xl bg-white/20 text-white font-mono font-bold text-xs outline-none text-center"
                        />
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black"
                        >
                            <Check size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => { setTempTarget(readingGoal.target_books); setIsEditingGoal(true); }}
                        className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-xs font-black text-indigo-200 transition active:scale-95 flex items-center gap-1.5"
                    >
                        <Target size={14} />
                        <span>{isIndo ? 'Atur Target' : 'Edit Goal'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
