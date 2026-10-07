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
    Loader2,
    GraduationCap,
    Crown,
    Award,
    Check
} from 'lucide-react';
import { parseRawHabitsData } from '../utils/parseHabitsData';
import { HabitItem } from '../types';

interface HabitHallOfFameModalProps {
    isOpen: boolean;
    onClose: () => void;
    isIndo: boolean;
    currentMonthKey: string;
    onReactivated?: () => void;
    activeHabits?: HabitItem[];
    onGraduateHabit?: (habitId: number) => void;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HabitHallOfFameModal({
    isOpen,
    onClose,
    isIndo,
    currentMonthKey,
    onReactivated,
    activeHabits = [],
    onGraduateHabit
}: HabitHallOfFameModalProps) {
    const [activeTab, setActiveTab] = useState<'trophies' | 'graduate'>('trophies');
    const [searchQuery, setSearchQuery] = useState('');
    const [tierFilter, setTierFilter] = useState<'all' | 'diamond' | 'gold' | 'silver' | 'bronze'>('all');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);
    const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

    const { data: rawArchived, mutate, isLoading } = useSWR(
        isOpen ? '/api/habits?archived=true&period=all' : null,
        fetcher
    );

    const archivedHabits: HabitItem[] = useMemo(() => {
        if (!rawArchived || !Array.isArray(rawArchived)) return [];
        return parseRawHabitsData(rawArchived);
    }, [rawArchived]);

    // Calculate aggregated check-ins & rank across all graduated habits
    const totalLifetimeCompletions = useMemo(() => {
        return archivedHabits.reduce((acc, h) => {
            const logs = h.logs ? Object.values(h.logs) : [];
            return acc + logs.filter(l => l.status === 'completed').length;
        }, 0);
    }, [archivedHabits]);

    const prestigeRank = useMemo(() => {
        if (totalLifetimeCompletions >= 150) return { title: isIndo ? '👑 Mythic Habit Titan' : '👑 Mythic Habit Titan', color: 'from-amber-400 via-orange-500 to-rose-500' };
        if (totalLifetimeCompletions >= 75) return { title: isIndo ? '💎 Diamond Master' : '💎 Diamond Master', color: 'from-cyan-400 to-blue-500' };
        if (totalLifetimeCompletions >= 30) return { title: isIndo ? '🥇 Gold Achiever' : '🥇 Gold Achiever', color: 'from-amber-400 to-amber-600' };
        if (totalLifetimeCompletions > 0) return { title: isIndo ? '🥈 Silver Veteran' : '🥈 Silver Veteran', color: 'from-slate-300 to-slate-500' };
        return { title: isIndo ? '🥉 Bronze Aspirant' : '🥉 Bronze Aspirant', color: 'from-amber-600 to-amber-800' };
    }, [totalLifetimeCompletions, isIndo]);

    const getHabitTier = (completions: number) => {
        if (completions >= 100) return { tier: 'diamond', label: isIndo ? '💎 Diamond Titan' : '💎 Diamond Titan', bg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60' };
        if (completions >= 50) return { tier: 'gold', label: isIndo ? '🥇 Gold Master' : '🥇 Gold Master', bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' };
        if (completions >= 25) return { tier: 'silver', label: isIndo ? '🥈 Silver Champion' : '🥈 Silver Champion', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' };
        return { tier: 'bronze', label: isIndo ? '🥉 Bronze Graduate' : '🥉 Bronze Graduate', bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60' };
    };

    const filteredHabits = useMemo(() => {
        return archivedHabits.filter(h => {
            const logEntries = h.logs ? Object.values(h.logs) : [];
            const doneCount = logEntries.filter(l => l.status === 'completed').length;
            const habitTier = getHabitTier(doneCount).tier;

            if (tierFilter !== 'all' && habitTier !== tierFilter) {
                return false;
            }

            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                h.name.toLowerCase().includes(q) || 
                (h.goalTitle && h.goalTitle.toLowerCase().includes(q))
            );
        });
    }, [archivedHabits, searchQuery, tierFilter]);

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
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'), undefined, { revalidate: true });
                if (onReactivated) onReactivated();
                setCelebrationMsg(isIndo ? `"${habit.name}" berhasil diaktifkan kembali ke pelacak utama!` : `"${habit.name}" restored to active tracker!`);
                setTimeout(() => setCelebrationMsg(null), 4000);
            }
        } catch (err) {
            console.error('Failed to reactivate habit:', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleGraduateActive = async (habit: HabitItem) => {
        setProcessingId(habit.id);
        try {
            if (onGraduateHabit) {
                await onGraduateHabit(habit.id);
            } else {
                await fetch(`/api/habits/${habit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        is_archived: true,
                        status: 'graduated'
                    })
                });
                globalMutate((key: any) => typeof key === 'string' && key.startsWith('/api/habits'), undefined, { revalidate: true });
            }
            await mutate();
            setActiveTab('trophies');
            setCelebrationMsg(isIndo ? `Selamat! "${habit.name}" resmi lulus & dipensiunkan ke Hall of Fame! 🎓🏆` : `Congratulations! "${habit.name}" graduated to the Hall of Fame! 🎓🏆`);
            setTimeout(() => setCelebrationMsg(null), 4500);
        } catch (err) {
            console.error('Failed to graduate active habit:', err);
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
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
                    onClick={onClose} 
                />

                <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-amber-300/40 dark:border-amber-500/20 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Prestigious Heroic Header */}
                    <div className="relative p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-xl shadow-amber-500/25 flex items-center justify-center shrink-0">
                                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[0.95rem] flex items-center justify-center text-2xl">
                                        🏆
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                            <span>{isIndo ? 'Hall of Flame & Fame' : 'Hall of Flame & Fame'}</span>
                                            <Flame size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
                                        </h3>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/50">
                                            {archivedHabits.length} {isIndo ? 'Lulus' : 'Graduated'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                        {isIndo
                                            ? 'Monumen kehormatan bagi kebiasaan yang telah tuntas, mencapai target, dan mengakar permanen dalam hidup Anda'
                                            : 'The honorable pantheon of habits that completed their targets and retired with distinction'}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Prestige 3-Pillars Summary */}
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5">
                            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-850/80 border border-amber-200/60 dark:border-amber-800/40 shadow-2xs text-left">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                                    <GraduationCap size={13} className="shrink-0" />
                                    <span>{isIndo ? 'Total Lulus' : 'Graduated'}</span>
                                </div>
                                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                                    {archivedHabits.length}
                                </p>
                            </div>

                            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-850/80 border border-amber-200/60 dark:border-amber-800/40 shadow-2xs text-left">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-0.5">
                                    <Flame size={13} className="shrink-0 fill-orange-500" />
                                    <span>{isIndo ? 'Total Ceklis' : 'Check-ins'}</span>
                                </div>
                                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                                    {totalLifetimeCompletions}
                                </p>
                            </div>

                            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-850/80 border border-amber-200/60 dark:border-amber-800/40 shadow-2xs text-left">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                                    <Crown size={13} className="shrink-0 text-amber-500" />
                                    <span>{isIndo ? 'Peringkat' : 'Rank'}</span>
                                </div>
                                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                                    {prestigeRank.title}
                                </p>
                            </div>
                        </div>

                        {/* Celebratory Alert Banner */}
                        {celebrationMsg && (
                            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                                <Sparkles size={16} className="shrink-0" />
                                <span>{celebrationMsg}</span>
                            </div>
                        )}

                        {/* Dual Tabs Navigation */}
                        <div className="flex items-center gap-2 mt-5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-black">
                            <button
                                type="button"
                                onClick={() => setActiveTab('trophies')}
                                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    activeTab === 'trophies'
                                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                }`}
                            >
                                <Trophy size={14} className="text-amber-500" />
                                <span>{isIndo ? `Monumen Kehormatan (${archivedHabits.length})` : `Honor Monuments (${archivedHabits.length})`}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('graduate')}
                                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    activeTab === 'graduate'
                                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                }`}
                            >
                                <GraduationCap size={15} className="text-indigo-500" />
                                <span>{isIndo ? `Luluskan Kebiasaan Aktif (${activeHabits.length})` : `Graduate Active (${activeHabits.length})`}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                        
                        {/* TAB 1: TROPHIES / MONUMENTS */}
                        {activeTab === 'trophies' && (
                            <>
                                {/* Search & Tier Filter Bar */}
                                {archivedHabits.length > 0 && (
                                    <div className="space-y-2.5 mb-3">
                                        <div className="relative">
                                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={isIndo ? 'Cari kebiasaan lulus atau nama goal...' : 'Search graduated habits or goal...'}
                                                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                            />
                                        </div>

                                        {/* Tier Filter Pills */}
                                        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-bold">
                                            {[
                                                { key: 'all', label: isIndo ? 'Semua' : 'All' },
                                                { key: 'diamond', label: '💎 Diamond (100+)' },
                                                { key: 'gold', label: '🥇 Gold (50+)' },
                                                { key: 'silver', label: '🥈 Silver (25+)' },
                                                { key: 'bronze', label: '🥉 Bronze' },
                                            ].map(t => (
                                                <button
                                                    key={t.key}
                                                    type="button"
                                                    onClick={() => setTierFilter(t.key as any)}
                                                    className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                                                        tierFilter === t.key
                                                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                                                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3">
                                        <Loader2 size={26} className="animate-spin text-amber-500" />
                                        <p className="text-xs font-bold">{isIndo ? 'Menyiapkan Hall of Fame...' : 'Loading Hall of Fame...'}</p>
                                    </div>
                                ) : filteredHabits.length === 0 ? (
                                    <div className="py-16 px-4 text-center max-w-md mx-auto">
                                        <div className="w-18 h-18 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                                            🎓
                                        </div>
                                        <h4 className="text-base font-black text-slate-800 dark:text-slate-200 mb-1.5">
                                            {searchQuery || tierFilter !== 'all'
                                                ? (isIndo ? 'Tidak ada kebiasaan yang cocok' : 'No matching habits found')
                                                : (isIndo ? 'Belum Ada Kebiasaan Lulus' : 'No Graduated Habits Yet')}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
                                            {searchQuery || tierFilter !== 'all'
                                                ? (isIndo ? 'Coba ganti filter tier atau kata kunci pencarian.' : 'Try changing the tier filter or search keyword.')
                                                : (isIndo 
                                                    ? 'Anda bisa meluluskan kebiasaan aktif Anda sekarang untuk dipensiunkan dengan rekor kehormatan, atau menyelesaikannya lewat Goal di tab Goals.'
                                                    : 'You can graduate any of your active habits right now to retire them with honorable records.')}
                                        </p>
                                        {activeHabits.length > 0 && !searchQuery && tierFilter === 'all' && (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('graduate')}
                                                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer flex items-center gap-2 mx-auto"
                                            >
                                                <GraduationCap size={15} />
                                                <span>{isIndo ? 'Luluskan Kebiasaan Sekarang' : 'Graduate a Habit Now'}</span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredHabits.map((habit) => {
                                        const logEntries = habit.logs ? Object.values(habit.logs) : [];
                                        const totalDone = logEntries.filter(l => l.status === 'completed').length;
                                        const tierInfo = getHabitTier(totalDone);

                                        return (
                                            <div
                                                key={habit.id}
                                                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600/80 transition-all shadow-xs hover:shadow-md group text-left"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    
                                                    {/* Identity */}
                                                    <div className="flex items-start gap-3.5 min-w-0">
                                                        <div 
                                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-white/50 dark:border-slate-800 shadow-xs"
                                                            style={{ backgroundColor: `${habit.color}25`, color: habit.color }}
                                                        >
                                                            {habit.icon || '🌱'}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 truncate">
                                                                    {habit.name}
                                                                </h4>
                                                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${tierInfo.bg}`}>
                                                                    <Award size={11} />
                                                                    <span>{tierInfo.label}</span>
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

                                                            {/* Stats Info */}
                                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-2 flex-wrap">
                                                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black">
                                                                    <CheckCircle2 size={13} />
                                                                    <span>{totalDone} {isIndo ? 'kali selesai' : 'completions'}</span>
                                                                </span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1 text-slate-500">
                                                                    <Calendar size={12} />
                                                                    <span>{isIndo ? 'Periode Lulus:' : 'Period:'} {habit.period}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                                                        <button
                                                            type="button"
                                                            disabled={processingId === habit.id}
                                                            onClick={() => handleReactivate(habit)}
                                                            className="px-3.5 py-2 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200/90 dark:border-indigo-800/60 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                                                            title={isIndo ? 'Kembalikan habit ke pelacak aktif harian' : 'Restore habit to active tracking'}
                                                        >
                                                            {processingId === habit.id ? (
                                                                <Loader2 size={13} className="animate-spin" />
                                                            ) : (
                                                                <RotateCcw size={13} />
                                                            )}
                                                            <span>{isIndo ? 'Aktifkan Lagi' : 'Reactivate'}</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={processingId === habit.id}
                                                            onClick={() => setHabitToDelete(habit)}
                                                            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                                            title={isIndo ? 'Hapus permanen dari Hall of Fame' : 'Delete permanently'}
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}

                        {/* TAB 2: GRADUATE ACTIVE HABITS */}
                        {activeTab === 'graduate' && (
                            <div className="space-y-3">
                                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40 text-left">
                                    <div className="flex items-center gap-2 text-xs font-black text-indigo-900 dark:text-indigo-200 mb-1">
                                        <GraduationCap size={16} className="text-indigo-600 shrink-0" />
                                        <span>{isIndo ? 'Luluskan Kebiasaan yang Sudah Terbiasa (Habit Mastery)' : 'Graduate Internalized Habits'}</span>
                                    </div>
                                    <p className="text-[11px] text-indigo-700/90 dark:text-indigo-300 font-medium leading-relaxed">
                                        {isIndo
                                            ? 'Punya kebiasaan yang sudah otomatis dan tidak perlu diceklis setiap hari lagi? Luluskan ke Hall of Fame untuk menyimpan rekor prestasinya secara abadi tanpa mengotori tabel harian Anda.'
                                            : 'Have a habit that has become second nature? Graduate it to the Hall of Fame to immortalize your streak record without cluttering your daily grid.'}
                                    </p>
                                </div>

                                {activeHabits.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400">
                                        <p className="text-xs font-bold">{isIndo ? 'Tidak ada kebiasaan aktif yang dapat diluluskan.' : 'No active habits to graduate.'}</p>
                                    </div>
                                ) : (
                                    activeHabits.map((h) => {
                                        const logEntries = h.logs ? Object.values(h.logs) : [];
                                        const doneCount = logEntries.filter(l => l.status === 'completed').length;

                                        return (
                                            <div
                                                key={h.id}
                                                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-left hover:border-amber-300 transition shadow-2xs"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div 
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                                                        style={{ backgroundColor: `${h.color}20`, color: h.color }}
                                                    >
                                                        {h.icon || '🌱'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                                                            {h.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold mt-0.5">
                                                            <span>{doneCount} {isIndo ? 'ceklis bulan ini' : 'checks this month'}</span>
                                                            {h.goalTitle && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="text-amber-600 truncate">{h.goalTitle}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={processingId === h.id}
                                                    onClick={() => handleGraduateActive(h)}
                                                    className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 transition active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    {processingId === h.id ? (
                                                        <Loader2 size={13} className="animate-spin" />
                                                    ) : (
                                                        <Trophy size={13} />
                                                    )}
                                                    <span>{isIndo ? 'Luluskan 🎓' : 'Graduate 🎓'}</span>
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                    </div>

                    {/* Footer Prestige Quote */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                            <Sparkles size={12} className="text-amber-500" />
                            <span>
                                {isIndo 
                                    ? '"Disiplin adalah jembatan antara cita-cita dan pencapaian nyata."' 
                                    : '"Discipline is the bridge between goals and accomplishment."'}
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
                                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                                >
                                    {isIndo ? 'Batal' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePermanentDelete}
                                    className="flex-1 py-3 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-100 dark:shadow-none transition cursor-pointer"
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
