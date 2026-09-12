'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import JournalHeader from './components/JournalHeader';
import JournalCard, { JournalItem } from './components/JournalCard';
import JournalFilterBar, { JournalViewMode } from './components/JournalFilterBar';
import JournalCalendarView from './components/JournalCalendarView';
import JournalTimelineView from './components/JournalTimelineView';
import JournalMemoriesView from './components/JournalMemoriesView';
import JournalDetailModal from './components/JournalDetailModal';
import NeuralBridge from '@/components/NeuralBridge';
import GatedPage from '@/components/GatedPage';
import { Plus, Trash2, BookOpen, Sparkles } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import ExportModal from '@/components/export/ExportModal';

export default function JournalIndexPage() {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [journals, setJournals] = useState<JournalItem[]>([]);
    const [synergy, setSynergy] = useState({
        tasks_completed: 0,
        tasks_total: 0,
        habits_completed: 0,
        expense_total: 0
    });
    const [hasMounted, setHasMounted] = useState(false);
    
    // Multi-View & Filter States
    const [viewMode, setViewMode] = useState<JournalViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState('all');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Detail Reading Modal
    const [selectedJournal, setSelectedJournal] = useState<JournalItem | null>(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [journalToDelete, setJournalToDelete] = useState<number | string | null>(null);
    const [isExportOpen, setIsExportOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [journalsRes, dashRes] = await Promise.all([
                    fetch('/api/journals'),
                    fetch('/api/dashboard')
                ]);
                
                if (journalsRes.ok) {
                    const data = await journalsRes.json();
                    const mapped = data.map((j: any) => ({
                        id: j.id,
                        title: j.title || '',
                        content: j.content || '',
                        date: j.date,
                        mood: j.mood || 'awesome',
                        image_url: j.imagePath || j.image_url,
                        imagePath: j.imagePath || j.image_url,
                        ai_sentiment: j.aiSentiment || j.ai_sentiment || 'Sentimen netral.'
                    }));
                    setJournals(mapped);
                }

                if (dashRes.ok) {
                    const dashData = await dashRes.json();
                    setSynergy({
                        tasks_completed: dashData.planner?.completed || 0,
                        tasks_total: dashData.planner?.total || 0,
                        habits_completed: dashData.habits?.completed || 0,
                        expense_total: dashData.finance?.expense || 0
                    });
                }
            } catch (error) {
                console.error('Failed to fetch journal data:', error);
            } finally {
                setHasMounted(true);
            }
        };

        fetchData();
    }, []);

    // Calculate Writing Streak
    const streakDays = useMemo(() => {
        if (!journals || journals.length === 0) return 0;
        const uniqueDates = Array.from(
            new Set(
                journals.map(j => {
                    try {
                        return new Date(j.date).toISOString().split('T')[0];
                    } catch {
                        return '';
                    }
                }).filter(Boolean)
            )
        ).sort().reverse();

        if (uniqueDates.length === 0) return 0;

        const todayStr = new Date().toISOString().split('T')[0];
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let streak = 0;
        let checkDate = new Date();
        if (!uniqueDates.includes(todayStr)) {
            if (uniqueDates.includes(yesterdayStr)) {
                checkDate = new Date(Date.now() - 86400000);
            } else {
                return 0;
            }
        }

        while (true) {
            const dStr = checkDate.toISOString().split('T')[0];
            if (uniqueDates.includes(dStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return Math.max(1, streak);
    }, [journals]);

    // Calculate Total Words
    const totalWords = useMemo(() => {
        return journals.reduce((acc, curr) => {
            const text = (curr.content || '').replace(/<[^>]*>?/gm, ' ');
            const words = text.split(/\s+/).filter(Boolean).length;
            return acc + words;
        }, 0);
    }, [journals]);

    // Extract All Unique Tags
    const availableTags = useMemo(() => {
        const tagSet = new Set<string>();
        journals.forEach(j => {
            if (j.content) {
                const matches = j.content.match(/#([\w\u00C0-\u024F]+)/g);
                if (matches) {
                    matches.forEach(t => tagSet.add(t.replace('#', '')));
                }
            }
        });
        return Array.from(tagSet);
    }, [journals]);

    // Mood Counts for Pills
    const moodCounts = useMemo(() => {
        const counts: Record<string, number> = { awesome: 0, good: 0, okay: 0, sad: 0, angry: 0 };
        journals.forEach(j => {
            if (j.mood && counts[j.mood] !== undefined) {
                counts[j.mood]++;
            }
        });
        return counts;
    }, [journals]);

    // Filtered Journals for Grid & Timeline
    const filteredJournals = useMemo(() => {
        return journals.filter(j => {
            // Search Query matching title or content
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = (j.title || '').toLowerCase().includes(q);
                const matchContent = (j.content || '').toLowerCase().includes(q);
                if (!matchTitle && !matchContent) return false;
            }

            // Mood filter
            if (selectedMood !== 'all') {
                if (j.mood !== selectedMood) return false;
            }

            // Tag filter
            if (selectedTag) {
                const tagRegex = new RegExp(`#${selectedTag}\\b`, 'i');
                if (!tagRegex.test(j.content || '')) return false;
            }

            return true;
        });
    }, [journals, searchQuery, selectedMood, selectedTag]);

    const handleDelete = (id: number | string) => {
        setJournalToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!journalToDelete) return;
        try {
            await fetch(`/api/journals/${journalToDelete}`, { method: 'DELETE' });
            setJournals(prev => prev.filter(j => j.id !== journalToDelete));
            if (selectedJournal && selectedJournal.id === journalToDelete) {
                setSelectedJournal(null);
            }
        } catch (error) {
            console.error('Failed to delete journal:', error);
        }
        setDeleteModalOpen(false);
        setJournalToDelete(null);
    };

    if (!hasMounted) {
        return (
            <AuthenticatedLayout>
                <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-12 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-indigo-600"></div>
                        <span className="text-xs font-bold text-slate-400">
                            {isIndo ? 'Memuat Jurnal & Neural Hub...' : 'Loading Journal & Neural Hub...'}
                        </span>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <GatedPage feature="journal">
                <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-16 transition-colors duration-500">
                    
                    {/* Header with Streaks & Daily OS Synergy */}
                    <JournalHeader 
                        todayDate={new Date().toISOString()}
                        totalJournals={journals.length}
                        totalWords={totalWords}
                        streakDays={streakDays}
                        synergy={synergy}
                        onOpenExportModal={() => setIsExportOpen(true)}
                    />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                        <NeuralBridge module="Journal" />

                        {/* Filter Bar & View Switcher */}
                        <JournalFilterBar 
                            totalCount={journals.length}
                            filteredCount={filteredJournals.length}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            selectedMood={selectedMood}
                            onMoodChange={setSelectedMood}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            availableTags={availableTags}
                            selectedTag={selectedTag}
                            onTagChange={setSelectedTag}
                            moodCounts={moodCounts}
                        />

                        {/* View Mode Contents */}
                        {journals.length === 0 ? (
                            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/70 dark:border-slate-800 shadow-sm transition-all duration-300">
                                <div className="max-w-md mx-auto flex flex-col items-center gap-4 px-4">
                                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-4xl shadow-inner">
                                        ✨
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                                        {isIndo ? 'Mulai Cerita Refleksi Pertamamu' : 'Begin Your First Reflection Story'}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isIndo 
                                            ? 'Gunakan template anti-blank page kami untuk merekam ide, rasa syukur, atau evaluasi hari ini secara terarah.' 
                                            : 'Use our guided reflection templates to declutter thoughts, log gratitude, or review your day with Stoic clarity.'}
                                    </p>
                                    <Link 
                                        href="/journal/write" 
                                        className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-3 px-7 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 transition-all outline-none flex items-center gap-2 text-xs sm:text-sm"
                                    >
                                        <Plus className="h-4 w-4 stroke-[3]" />
                                        <span>{isIndo ? 'Tulis Jurnal Sekarang' : 'Write Journal Now'}</span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* 1. GRID VIEW */}
                                {viewMode === 'grid' && (
                                    filteredJournals.length === 0 ? (
                                        <div className="py-16 text-center bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-slate-200/60 dark:border-slate-800">
                                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                                {isIndo ? 'Tidak ada jurnal yang sesuai dengan filter pencarian.' : 'No journals match your search filters.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                                            {filteredJournals.map((journal) => (
                                                <JournalCard 
                                                    key={journal.id} 
                                                    journal={journal}
                                                    onDelete={handleDelete}
                                                    onSelect={(j) => setSelectedJournal(j)}
                                                />
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* 2. CALENDAR HEATMAP VIEW */}
                                {viewMode === 'calendar' && (
                                    <JournalCalendarView 
                                        journals={journals}
                                        onSelectJournal={(j) => setSelectedJournal(j)}
                                    />
                                )}

                                {/* 3. TIMELINE STREAM VIEW */}
                                {viewMode === 'timeline' && (
                                    <JournalTimelineView 
                                        journals={filteredJournals}
                                        onSelectJournal={(j) => setSelectedJournal(j)}
                                        onDeleteJournal={handleDelete}
                                    />
                                )}

                                {/* 4. MEMORIES / FLASHBACKS VIEW */}
                                {viewMode === 'memories' && (
                                    <JournalMemoriesView 
                                        journals={journals}
                                        onSelectJournal={(j) => setSelectedJournal(j)}
                                    />
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* DETAIL / READER MODAL */}
                {selectedJournal && (
                    <JournalDetailModal 
                        journal={selectedJournal}
                        onClose={() => setSelectedJournal(null)}
                        onDelete={handleDelete}
                    />
                )}

                {/* DELETE CONFIRMATION MODAL */}
                {deleteModalOpen && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="absolute inset-0" onClick={() => setDeleteModalOpen(false)} />
                            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/80 dark:border-slate-800 w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="p-6 md:p-8 w-full relative z-10 text-center">
                                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-rose-100 dark:border-rose-900/30">
                                        🗑️
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
                                        {isIndo ? 'Hapus Jurnal Refleksi?' : 'Delete Journal Entry?'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                        {isIndo 
                                            ? 'Catatan jurnal dan analisa sentimen kognitif ini akan dihapus secara permanen.' 
                                            : 'This journal reflection and its neural cognitive analysis will be permanently deleted.'}
                                    </p>
                                    <div className="flex gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setDeleteModalOpen(false)}
                                            className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                        >
                                            {isIndo ? 'Batal' : 'Cancel'}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={confirmDelete}
                                            className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/25 active:scale-95 transition"
                                        >
                                            {isIndo ? 'Ya, Hapus' : 'Yes, Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* EXPORT DATA MODAL */}
                <ExportModal
                    isOpen={isExportOpen}
                    onClose={() => setIsExportOpen(false)}
                    moduleType="journal"
                    currentData={journals}
                />

            </GatedPage>
        </AuthenticatedLayout>
    );
}

