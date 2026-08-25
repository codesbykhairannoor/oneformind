'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import JournalHeader from './components/JournalHeader';
import JournalCard, { JournalItem } from './components/JournalCard';
import NeuralBridge from '@/components/NeuralBridge';
import { Plus } from 'lucide-react';

export default function JournalIndexPage() {
    const t = useTranslations();

    // Initial Journal state
    const [journals, setJournals] = useState<JournalItem[]>([
        {
            id: 1,
            title: 'Eksplorasi Arsitektur Next.js 16 & AI OS',
            content: 'Hari ini berhasil menyusun modularisasi komponen Journal dan Study Portfolio dengan performa tinggi...',
            date: new Date().toISOString(),
            mood: 'awesome',
            ai_sentiment: 'Sentimen sangat positif dan berorientasi pada pencapaian tinggi (High Productivity & Optimism).'
        },
        {
            id: 2,
            title: 'Refleksi Sesi Deep Work',
            content: 'Fokus menyelesaikan perbaikan rute middleware dan memastikan semua halaman memuat cepat.',
            date: new Date(Date.now() - 86400000).toISOString(),
            mood: 'good',
            ai_sentiment: 'Fokus kerja mendalam dengan kestabilan emosi yang baik.'
        }
    ]);

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('oneformind_journals');
        if (saved) {
            try {
                setJournals(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        } else {
            // First time load: persist the default initial items to localStorage so that write page can load them!
            localStorage.setItem('oneformind_journals', JSON.stringify(journals));
        }
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted) {
            localStorage.setItem('oneformind_journals', JSON.stringify(journals));
        }
    }, [journals, hasMounted]);

    const synergy = {
        tasks_completed: 12,
        tasks_total: 15,
        habits_completed: 6,
        expense_total: 150000
    };

    const handleDelete = (id: number | string) => {
        if (typeof window !== 'undefined' && window.confirm(t('journal_confirm_delete') || 'Hapus Jurnal? Data ini akan hilang selamanya.')) {
            setJournals(prev => prev.filter(j => j.id !== id));
        }
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
        </AuthenticatedLayout>
    );
}
