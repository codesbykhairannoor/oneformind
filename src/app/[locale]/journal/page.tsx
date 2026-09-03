'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import JournalHeader from './components/JournalHeader';
import JournalCard, { JournalItem } from './components/JournalCard';
import NeuralBridge from '@/components/NeuralBridge';
import GatedPage from '@/components/GatedPage';
import { Plus, Trash2, X } from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';

export default function JournalIndexPage() {
    const t = useTranslations();

    const [journals, setJournals] = useState<JournalItem[]>([]);
    const [synergy, setSynergy] = useState({
        tasks_completed: 0,
        tasks_total: 0,
        habits_completed: 0,
        expense_total: 0
    });
    const [hasMounted, setHasMounted] = useState(false);
    
    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [journalToDelete, setJournalToDelete] = useState<number | string | null>(null);

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
                        ai_sentiment: j.aiSentiment || 'Sentimen netral.'
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
                console.error('Failed to fetch data:', error);
            } finally {
                setHasMounted(true);
            }
        };

        fetchData();
    }, []);

    const handleDelete = (id: number | string) => {
        setJournalToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!journalToDelete) return;
        try {
            await fetch(`/api/journals/${journalToDelete}`, { method: 'DELETE' });
            setJournals(prev => prev.filter(j => j.id !== journalToDelete));
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
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <GatedPage feature="journal">
                {/* 1:1 from Journal/Index.vue line 87-126 */}
                <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-12 transition-colors duration-500">
                
                <JournalHeader 
                    todayDate={new Date().toISOString()} 
                    synergy={synergy} 
                />

                <div className="w-full px-4 py-8 sm:px-6 lg:px-8 md:py-12 space-y-8">
                    <NeuralBridge module="Journal" />
                    
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white transition-colors duration-500">
                            {t('journal_history') || 'Story History'}
                        </h3>
                    </div>

                    {journals.length === 0 ? (
                        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm dark:shadow-none mt-4 transition-all duration-500">
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-5xl animate-bounce">📓</span>
                                <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 transition-colors duration-500">
                                    {t('journal_empty_title') || 'Belum ada cerita.'}
                                </h4>
                                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 px-8 transition-colors duration-500">
                                    {t('journal_empty_subtitle') || 'Mulai tulis jurnal pertamamu hari ini!'}
                                </p>
                                <Link 
                                    href="/journal/write" 
                                    className="mt-2 bg-indigo-600 text-white font-black py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all outline-none flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>{t('journal_add') || 'Tambah jurnal'}</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid items-start grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {journals.map((journal) => (
                                <JournalCard 
                                    key={journal.id} 
                                    journal={journal}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                </div>
                </div>

                {/* DELETE CONFIRMATION MODAL */}
                {deleteModalOpen && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="absolute inset-0" onClick={() => setDeleteModalOpen(false)}></div>
                            <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-rose-500/10 to-transparent"></div>
                                    <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-rose-100 dark:border-rose-500/20 shadow-xl shadow-rose-500/20 flex items-center justify-center text-rose-500 mb-6 shrink-0 relative z-10 animate-in zoom-in-95 duration-500 delay-100">
                                        <Trash2 size={32} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="font-black text-slate-800 dark:text-white text-2xl tracking-tight mb-3 relative z-10">
                                        {t('journal_confirm_delete_title') || 'Hapus Jurnal?'}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 relative z-10 leading-relaxed px-2">
                                        {t('journal_confirm_delete') || 'Jurnal ini akan dihapus secara permanen dan tidak dapat dikembalikan lagi.'}
                                    </p>
                                </div>
                                <div className="p-5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex gap-4 backdrop-blur-sm">
                                    <button 
                                        onClick={() => setDeleteModalOpen(false)}
                                        className="flex-1 py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all active:scale-95 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        className="flex-[1.5] py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-500/30 dark:shadow-rose-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} strokeWidth={3} />
                                        Hapus Permanen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )}

            </GatedPage>
        </AuthenticatedLayout>
    );
}
