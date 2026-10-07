'use client';

import React, { useState, useMemo } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import ModalPortal from '@/components/ModalPortal';
import { 
    Trophy, 
    X, 
    Search, 
    RotateCcw, 
    Trash2, 
    Flame, 
    CheckCircle2, 
    Calendar, 
    Target,
    Sparkles,
    Loader2
} from 'lucide-react';
import { parseRawHabitsData } from '../utils/parseHabitsData';
import { HabitItem } from '../types';

interface HabitHallOfFameModalProps {
    isOpen: boolean;
    onClose: () => void;
    isIndo: boolean;
    currentMonthKey: string;
    onReactivated?: () => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HabitHallOfFameModal({
    isOpen,
    onClose,
    isIndo,
    currentMonthKey,
    onReactivated
}: HabitHallOfFameModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);

    const { data: rawArchived, mutate, isLoading } = useSWR(
        isOpen ? '/api/habits?archived=true&period=all' : null,
        fetcher
    );

    const archivedHabits: HabitItem[] = useMemo(() => {
        if (!rawArchived || !Array.isArray(rawArchived)) return [];
        return parseRawHabitsData(rawArchived);
    }, [rawArchived]);

    const filteredHabits = useMemo(() => {
        if (!searchQuery.trim()) return archivedHabits;
        const q = searchQuery.toLowerCase();
        return archivedHabits.filter(h => 
            h.name.toLowerCase().includes(q) || 
            (h.goalTitle && h.goalTitle.toLowerCase().includes(q))
        );
    }, [archivedHabits, searchQuery]);

    const handleReactivate = async (habit: HabitItem) => {
        setProcessingId(habit.id);
        try {
            const res = await fetch(`/api/habits/${habit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_archived: false,
                    status: 'active'
                })
            });

            if (res.ok) {
                await mutate();
                // Invalidate active habits list
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'), undefined, { revalidate: true });
                if (onReactivated) onReactivated();
            }
        } catch (err) {
            console.error('Failed to reactivate habit:', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handlePermanentDelete = async () => {
        if (!habitToDelete) return;
        setProcessingId(habitToDelete.id);
        try {
            const res = await fetch(`/api/habits/${habitToDelete.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await mutate();
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'), undefined, { revalidate: true });
                setHabitToDelete(null);
            }
        } catch (err) {
            console.error('Failed to delete habit permanently:', err);
        } finally {
            setProcessingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
                <div 
                    className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity" 
                    onClick={onClose} 
                />

                <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-amber-200/50 dark:border-amber-500/20 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Header with Golden Accent */}
                    <div className="relative p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-amber-50/60 to-transparent dark:from-amber-950/20">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 dark:from-amber-600 dark:to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
                                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center text-2xl">
                                        🏆
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                                            {isIndo ? 'Hall of Fame Kebiasaan' : 'Habit Hall of Fame'}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40">
                                            {archivedHabits.length} {isIndo ? 'Lulus' : 'Graduated'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {isIndo
                                            ? 'Kebiasaan yang telah menuntaskan targetnya & dipensiunkan dengan rekor kehormatan'
                                            : 'Habits that completed their goals and retired with honored records'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        {archivedHabits.length > 0 && (
                            <div className="mt-4 relative">
                                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={isIndo ? 'Cari kebiasaan lulus atau nama goal...' : 'Search graduated habits or goal title...'}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content List */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                        {isLoading ? (
                            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
                                <Loader2 size={24} className="animate-spin text-amber-500" />
                                <p className="text-xs font-bold">{isIndo ? 'Memuat Hall of Fame...' : 'Loading Hall of Fame...'}</p>
                            </div>
                        ) : filteredHabits.length === 0 ? (
                            <div className="py-14 px-4 text-center max-w-md mx-auto">
                                <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🎓
                                </div>
                                <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-1">
                                    {searchQuery 
                                        ? (isIndo ? 'Tidak ada kebiasaan yang cocok' : 'No matching habits found')
                                        : (isIndo ? 'Belum Ada Kebiasaan Lulus' : 'No Graduated Habits Yet')}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {searchQuery 
                                        ? (isIndo ? 'Coba gunakan kata kunci pencarian yang lain.' : 'Try a different search keyword.')
                                        : (isIndo 
                                            ? 'Ketika Anda menyelesaikan Goal di tab Goals (100%), modal kemenangan akan memberi Anda opsi untuk Meluluskan (Pensiunkan) kebiasaan ke Hall of Fame ini.'
                                            : 'When you complete a Goal in the Goals tab (100%), the victory modal will let you Graduate your linked habits into this Hall of Fame.')}
                                </p>
                            </div>
                        ) : (
                            filteredHabits.map((habit) => {
                                // Calculate total completions and stats from logs
                                const logEntries = habit.logs ? Object.values(habit.logs) : [];
                                const totalDone = logEntries.filter(l => l.status === 'completed').length;

                                return (
                                    <div
                                        key={habit.id}
                                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 transition-all shadow-xs group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            
                                            {/* Habit Identity */}
                                            <div className="flex items-start gap-3">
                                                <div 
                                                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/40 dark:border-slate-800 shadow-xs"
                                                    style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                                                >
                                                    {habit.icon || '🌱'}
                                                </div>

                                                <div className="text-left min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                                                            {habit.name}
                                                        </h4>
                                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                                                            <CheckCircle2 size={10} />
                                                            {isIndo ? 'Lulus Target' : 'Graduated'}
                                                        </span>
                                                    </div>

                                                    {/* Linked Goal */}
                                                    {habit.goalTitle && (
                                                        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold mt-1">
                                                            <Target size={12} className="shrink-0" />
                                                            <span className="truncate">
                                                                {isIndo ? 'Mencapai Goal:' : 'Achieved Goal:'} {habit.goalTitle}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Meta Pills */}
                                                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mt-2 flex-wrap">
                                                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                                            {totalDone} {isIndo ? 'kali selesai' : 'completions'}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {isIndo ? 'Periode:' : 'Period:'} {habit.period}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60 w-full sm:w-auto justify-end">
                                                {/* Reactivate Button */}
                                                <button
                                                    type="button"
                                                    disabled={processingId === habit.id}
                                                    onClick={() => handleReactivate(habit)}
                                                    className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center gap-1.5 transition active:scale-95"
                                                    title={isIndo ? 'Kembalikan habit ke pelacak aktif' : 'Restore habit to active tracking'}
                                                >
                                                    {processingId === habit.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <RotateCcw size={12} />
                                                    )}
                                                    <span>{isIndo ? 'Aktifkan Lagi' : 'Reactivate'}</span>
                                                </button>

                                                {/* Delete Permanently Button */}
                                                <button
                                                    type="button"
                                                    disabled={processingId === habit.id}
                                                    onClick={() => setHabitToDelete(habit)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                                    title={isIndo ? 'Hapus permanen' : 'Delete permanently'}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer Note */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                            <Sparkles size={12} className="text-amber-500" />
                            <span>
                                {isIndo 
                                    ? 'Kebiasaan di Hall of Fame tidak akan memutus streak atau mengotori jadwal harian Anda.' 
                                    : 'Habits in the Hall of Fame will not break your streak or clutter your daily tracking.'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Confirm Delete Submodal */}
                {habitToDelete && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setHabitToDelete(null)} />
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-150">
                            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl border border-rose-100 dark:border-rose-500/20">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
                                {isIndo ? 'Hapus Permanen?' : 'Delete Permanently?'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                {isIndo
                                    ? `Apakah Anda yakin ingin menghapus "${habitToDelete.name}" dari Hall of Fame secara permanen? Data rekor ini tidak dapat dikembalikan.`
                                    : `Are you sure you want to permanently delete "${habitToDelete.name}" from the Hall of Fame?`}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setHabitToDelete(null)}
                                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                                >
                                    {isIndo ? 'Batal' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePermanentDelete}
                                    className="flex-1 py-3 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 dark:shadow-none transition"
                                >
                                    {isIndo ? 'Ya, Hapus' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ModalPortal>
    );
}
