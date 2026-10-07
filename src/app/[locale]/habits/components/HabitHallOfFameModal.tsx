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
    Award
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
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [habitToDelete, setHabitToDelete] = useState<HabitItem | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const { data: rawArchived, mutate, isLoading } = useSWR(
        isOpen ? '/api/habits?archived=true&period=all' : null,
        fetcher
    );

    const archivedHabits: HabitItem[] = useMemo(() => {
        if (!rawArchived || !Array.isArray(rawArchived)) return [];
        return parseRawHabitsData(rawArchived);
    }, [rawArchived]);

    // Aggregate lifetime completions
    const totalLifetimeCompletions = useMemo(() => {
        return archivedHabits.reduce((acc, h) => {
            const logs = h.logs ? Object.values(h.logs) : [];
            return acc + logs.filter(l => l.status === 'completed').length;
        }, 0);
    }, [archivedHabits]);

    const prestigeRank = useMemo(() => {
        if (totalLifetimeCompletions >= 150) return { title: 'Mythic Titan', icon: '👑', color: 'text-amber-300' };
        if (totalLifetimeCompletions >= 75) return { title: 'Diamond Master', icon: '💎', color: 'text-cyan-300' };
        if (totalLifetimeCompletions >= 30) return { title: 'Gold Achiever', icon: '🥇', color: 'text-amber-400' };
        if (totalLifetimeCompletions > 0) return { title: 'Silver Veteran', icon: '🥈', color: 'text-slate-300' };
        return { title: 'Bronze Aspirant', icon: '🥉', color: 'text-orange-400' };
    }, [totalLifetimeCompletions]);

    const getHabitTier = (completions: number) => {
        if (completions >= 100) return { key: 'diamond', label: 'Diamond Titan', icon: '💎', badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
        if (completions >= 50) return { key: 'gold', label: 'Gold Master', icon: '🥇', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
        if (completions >= 25) return { key: 'silver', label: 'Silver Champion', icon: '🥈', badgeClass: 'bg-slate-400/15 text-slate-300 border-slate-400/30' };
        return { key: 'bronze', label: 'Bronze Graduate', icon: '🥉', badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
    };

    const tierCounts = useMemo(() => {
        const counts = { all: archivedHabits.length, diamond: 0, gold: 0, silver: 0, bronze: 0 };
        archivedHabits.forEach(h => {
            const logs = h.logs ? Object.values(h.logs) : [];
            const done = logs.filter(l => l.status === 'completed').length;
            if (done >= 100) counts.diamond++;
            else if (done >= 50) counts.gold++;
            else if (done >= 25) counts.silver++;
            else counts.bronze++;
        });
        return counts;
    }, [archivedHabits]);

    const filteredHabits = useMemo(() => {
        let list = archivedHabits;
        if (selectedTier !== 'all') {
            list = list.filter(h => {
                const logs = h.logs ? Object.values(h.logs) : [];
                const done = logs.filter(l => l.status === 'completed').length;
                const tier = getHabitTier(done);
                return tier.key === selectedTier;
            });
        }
        if (!searchQuery.trim()) return list;
        const q = searchQuery.toLowerCase();
        return list.filter(h => 
            h.name.toLowerCase().includes(q) || 
            (h.goalTitle && h.goalTitle.toLowerCase().includes(q))
        );
    }, [archivedHabits, searchQuery, selectedTier]);

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
                setToastMessage(isIndo ? `"${habit.name}" dikembalikan ke pelacak aktif` : `"${habit.name}" restored to active tracker`);
                setTimeout(() => setToastMessage(null), 3500);
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
            setToastMessage(isIndo ? `Selamat! "${habit.name}" resmi masuk Hall of Fame! 🎓🏆` : `"${habit.name}" honored into Hall of Fame! 🎓🏆`);
            setTimeout(() => setToastMessage(null), 4000);
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

    const tierOptions = [
        { key: 'all', label: isIndo ? 'Semua' : 'All', icon: '🏛️', count: tierCounts.all, activeClass: 'bg-slate-800 text-white border-slate-700 shadow-sm' },
        { key: 'diamond', label: 'Diamond (100+)', icon: '💎', count: tierCounts.diamond, activeClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]' },
        { key: 'gold', label: 'Gold (50+)', icon: '🥇', count: tierCounts.gold, activeClass: 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]' },
        { key: 'silver', label: 'Silver (25+)', icon: '🥈', count: tierCounts.silver, activeClass: 'bg-slate-500/20 text-slate-200 border-slate-400/40 shadow-[0_0_12px_rgba(148,163,184,0.15)]' },
        { key: 'bronze', label: isIndo ? 'Bronze (<25)' : 'Bronze (<25)', icon: '🥉', count: tierCounts.bronze, activeClass: 'bg-orange-500/20 text-orange-200 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.15)]' },
    ];

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity" 
                    onClick={onClose} 
                />

                {/* Modal Container */}
                <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0b0f19] text-slate-100 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-amber-500/25 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Golden Ambient Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-amber-500/20 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

                    {/* Header Section */}
                    <div className="relative px-6 pt-6 pb-4 border-b border-white/5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                {/* Medallion Icon with subtle gold halo */}
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/25 via-amber-500/10 to-transparent border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center text-2xl shrink-0">
                                    🏆
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg sm:text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100">
                                            {isIndo ? 'Hall of Fame' : 'Hall of Fame'}
                                        </h3>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                            {archivedHabits.length} {isIndo ? 'Tuntas' : 'Graduated'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                        {isIndo
                                            ? 'Monumen kehormatan bagi kebiasaan yang telah tuntas & mengakar kuat'
                                            : 'The honorable pantheon of habits that completed their targets and retired with distinction'}
                                    </p>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Luxury Dark Glass HUD Stats (Zero Blinding White Boxes!) */}
                        <div className="grid grid-cols-3 gap-2.5 mt-4 text-left">
                            {/* Card 1: Graduated */}
                            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md flex flex-col justify-between hover:border-amber-500/20 transition-all">
                                <div className="flex items-center justify-between text-slate-400 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        {isIndo ? 'Total Lulus' : 'Graduated'}
                                    </span>
                                    <span className="text-sm">🎓</span>
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                                    {archivedHabits.length}
                                </div>
                            </div>

                            {/* Card 2: Check-ins */}
                            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md flex flex-col justify-between hover:border-orange-500/20 transition-all">
                                <div className="flex items-center justify-between text-slate-400 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        {isIndo ? 'Rekor Ceklis' : 'Check-ins'}
                                    </span>
                                    <span className="text-sm">🔥</span>
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-orange-400 tracking-tight">
                                    {totalLifetimeCompletions}
                                </div>
                            </div>

                            {/* Card 3: Prestige Rank */}
                            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 backdrop-blur-md flex flex-col justify-between hover:border-amber-500/20 transition-all">
                                <div className="flex items-center justify-between text-slate-400 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        {isIndo ? 'Peringkat' : 'Rank'}
                                    </span>
                                    <span className="text-sm">{prestigeRank.icon}</span>
                                </div>
                                <div className="text-xs sm:text-sm font-black text-slate-200 truncate">
                                    {prestigeRank.title}
                                </div>
                            </div>
                        </div>

                        {/* Toast Feedback */}
                        {toastMessage && (
                            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <Sparkles size={14} className="shrink-0" />
                                <span>{toastMessage}</span>
                            </div>
                        )}

                        {/* Minimalist Segmented Tabs */}
                        <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-900/80 rounded-2xl border border-white/5 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setActiveTab('trophies')}
                                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    activeTab === 'trophies'
                                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <Trophy size={13} className={activeTab === 'trophies' ? 'text-amber-400' : 'text-slate-500'} />
                                <span>{isIndo ? `Monumen Kehormatan (${archivedHabits.length})` : `Honor Monuments (${archivedHabits.length})`}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('graduate')}
                                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                    activeTab === 'graduate'
                                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-xs'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <GraduationCap size={14} className={activeTab === 'graduate' ? 'text-indigo-400' : 'text-slate-500'} />
                                <span>{isIndo ? `Luluskan Kebiasaan (${activeHabits.length})` : `Graduate Active (${activeHabits.length})`}</span>
                            </button>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                        
                        {/* TAB 1: TROPHY MONUMENTS */}
                        {activeTab === 'trophies' && (
                            <>
                                {/* Search input & Filter Pills */}
                                {archivedHabits.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={isIndo ? 'Cari kebiasaan lulus atau nama goal...' : 'Search graduated habits or goal...'}
                                                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500/50"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                                                >
                                                    <X size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Tier Filter Chips */}
                                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-left">
                                            {tierOptions.map((tier) => {
                                                const isSelected = selectedTier === tier.key;
                                                return (
                                                    <button
                                                        key={tier.key}
                                                        type="button"
                                                        onClick={() => setSelectedTier(tier.key)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                                                            isSelected
                                                                ? tier.activeClass
                                                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/10'
                                                        }`}
                                                    >
                                                        <span>{tier.icon}</span>
                                                        <span>{tier.label}</span>
                                                        {tier.count > 0 && (
                                                            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20' : 'bg-white/5 text-slate-400'}`}>
                                                                {tier.count}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2.5">
                                        <Loader2 size={24} className="animate-spin text-amber-400" />
                                        <p className="text-xs font-bold">{isIndo ? 'Memuat monumen...' : 'Loading monuments...'}</p>
                                    </div>
                                ) : filteredHabits.length === 0 ? (
                                    <div className="py-14 px-4 text-center max-w-sm mx-auto">
                                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3.5 text-3xl">
                                            🎓
                                        </div>
                                        <h4 className="text-sm font-black text-slate-200 mb-1">
                                            {searchQuery || selectedTier !== 'all'
                                                ? (isIndo ? 'Tidak ada kebiasaan yang cocok' : 'No matching habits found')
                                                : (isIndo ? 'Belum Ada Kebiasaan Lulus' : 'No Graduated Habits Yet')}
                                        </h4>
                                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                            {searchQuery || selectedTier !== 'all'
                                                ? (isIndo ? 'Coba ganti filter atau kata kunci pencarian.' : 'Try adjusting your filters or search keywords.')
                                                : (isIndo 
                                                    ? 'Kebiasaan yang sudah otomatis dan mengakar kuat bisa Anda luluskan sekarang ke Hall of Fame ini.'
                                                    : 'Habits that have become second nature can be retired with honor into this Hall of Fame.')}
                                        </p>
                                        {activeHabits.length > 0 && !searchQuery && selectedTier === 'all' && (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('graduate')}
                                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                                            >
                                                <GraduationCap size={14} />
                                                <span>{isIndo ? 'Luluskan Kebiasaan Sekarang' : 'Graduate a Habit Now'}</span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredHabits.map((habit) => {
                                        const logEntries = habit.logs ? Object.values(habit.logs) : [];
                                        const totalDone = logEntries.filter(l => l.status === 'completed').length;
                                        const tier = getHabitTier(totalDone);

                                        return (
                                            <div
                                                key={habit.id}
                                                className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all text-left shadow-xs group"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                                                    
                                                    {/* Habit Identity */}
                                                    <div className="flex items-start gap-3.5 min-w-0">
                                                        <div 
                                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-white/5 shadow-inner"
                                                            style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                                                        >
                                                            {habit.icon || '🌱'}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <h4 className="text-sm font-black text-slate-100 truncate">
                                                                    {habit.name}
                                                                </h4>
                                                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${tier.badgeClass}`}>
                                                                    <span>{tier.icon}</span>
                                                                    <span>{tier.label}</span>
                                                                </span>
                                                            </div>

                                                            {/* Goal link */}
                                                            {habit.goalTitle && (
                                                                <div className="flex items-center gap-1 text-xs text-amber-400/90 font-bold mb-1">
                                                                    <Target size={11} className="shrink-0" />
                                                                    <span className="truncate">
                                                                        {isIndo ? 'Goal:' : 'Goal:'} {habit.goalTitle}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Completions & Period */}
                                                            <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-400">
                                                                <span className="text-emerald-400 flex items-center gap-1 font-black">
                                                                    <CheckCircle2 size={12} />
                                                                    <span>{totalDone} {isIndo ? 'ceklis selesai' : 'completions'}</span>
                                                                </span>
                                                                <span className="text-slate-600">•</span>
                                                                <span className="flex items-center gap-1 text-slate-500">
                                                                    <Calendar size={11} />
                                                                    <span>{isIndo ? 'Periode:' : 'Period:'} {habit.period}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 border-white/5 pt-2.5 sm:pt-0 w-full sm:w-auto justify-end">
                                                        <button
                                                            type="button"
                                                            disabled={processingId === habit.id}
                                                            onClick={() => handleReactivate(habit)}
                                                            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 hover:border-amber-500/40 border border-slate-700/60 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                                                            title={isIndo ? 'Kembalikan habit ke pelacak aktif harian' : 'Restore habit to active tracking'}
                                                        >
                                                            {processingId === habit.id ? (
                                                                <Loader2 size={12} className="animate-spin text-amber-400" />
                                                            ) : (
                                                                <RotateCcw size={12} className="text-amber-400" />
                                                            )}
                                                            <span>{isIndo ? 'Aktifkan Lagi' : 'Reactivate'}</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={processingId === habit.id}
                                                            onClick={() => setHabitToDelete(habit)}
                                                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                                            title={isIndo ? 'Hapus permanen dari Hall of Fame' : 'Delete permanently'}
                                                        >
                                                            <Trash2 size={14} />
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
                                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-left">
                                    <div className="flex items-center gap-2 text-xs font-black text-indigo-300 mb-1">
                                        <GraduationCap size={15} className="shrink-0" />
                                        <span>{isIndo ? 'Pensiunkan Kebiasaan dengan Rekor Kehormatan' : 'Graduate Internalized Habits'}</span>
                                    </div>
                                    <p className="text-[11px] text-indigo-200/80 font-medium leading-relaxed">
                                        {isIndo
                                            ? 'Punya kebiasaan yang sudah otomatis dan mengakar dalam hidup Anda? Luluskan ke Hall of Fame untuk menyimpan rekornya secara abadi tanpa mengotori tabel harian.'
                                            : 'Retire internalized habits with honor into the Hall of Fame without cluttering your active grid.'}
                                    </p>
                                </div>

                                {activeHabits.length === 0 ? (
                                    <div className="py-12 text-center text-slate-500">
                                        <p className="text-xs font-bold">{isIndo ? 'Tidak ada kebiasaan aktif saat ini.' : 'No active habits found.'}</p>
                                    </div>
                                ) : (
                                    activeHabits.map((h) => {
                                        const logEntries = h.logs ? Object.values(h.logs) : [];
                                        const doneCount = logEntries.filter(l => l.status === 'completed').length;

                                        return (
                                            <div
                                                key={h.id}
                                                className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-amber-500/30 flex items-center justify-between gap-3 text-left transition"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div 
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                                                        style={{ backgroundColor: `${h.color}20`, color: h.color }}
                                                    >
                                                        {h.icon || '🌱'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs sm:text-sm font-black text-slate-200 truncate">
                                                            {h.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                                                            <span>{doneCount} {isIndo ? 'ceklis' : 'checks'}</span>
                                                            {h.goalTitle && (
                                                                <>
                                                                    <span className="text-slate-600">•</span>
                                                                    <span className="text-amber-400/80 truncate">{h.goalTitle}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={processingId === h.id}
                                                    onClick={() => handleGraduateActive(h)}
                                                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    {processingId === h.id ? (
                                                        <Loader2 size={12} className="animate-spin text-slate-950" />
                                                    ) : (
                                                        <Trophy size={12} className="text-slate-950" />
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

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-white/5 text-center bg-slate-950/40">
                        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                            <Sparkles size={11} className="text-amber-400" />
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
                        <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl border border-white/10 text-center animate-in zoom-in-95 duration-150">
                            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-2xl border border-rose-500/20">
                                <Trash2 size={20} />
                            </div>
                            <h3 className="text-base font-black text-slate-100 mb-1.5">
                                {isIndo ? 'Hapus dari Hall of Fame?' : 'Delete from Hall of Fame?'}
                            </h3>
                            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                                {isIndo
                                    ? `Apakah Anda yakin ingin menghapus "${habitToDelete.name}" dari Hall of Fame secara permanen? Data rekor ini tidak dapat dikembalikan.`
                                    : `Are you sure you want to permanently delete "${habitToDelete.name}" from the Hall of Fame?`}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setHabitToDelete(null)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                                >
                                    {isIndo ? 'Batal' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePermanentDelete}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-md transition cursor-pointer"
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
