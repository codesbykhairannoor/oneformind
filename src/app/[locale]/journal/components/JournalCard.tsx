'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export interface JournalItem {
    id: number | string;
    title?: string;
    content?: string;
    date: string;
    mood?: 'awesome' | 'good' | 'okay' | 'sad' | 'angry' | string;
    image_url?: string;
    ai_sentiment?: string;
}

interface JournalCardProps {
    journal: JournalItem;
    isExplorer?: boolean;
    onDelete: (id: number | string) => void;
    onOpenPreview?: () => void;
}

export default function JournalCard({ journal, isExplorer = false, onDelete, onOpenPreview }: JournalCardProps) {
    const t = useTranslations();

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const stripHtml = (html?: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(journal.id);
    };

    const getMoodEmoji = (mood?: string) => {
        switch (mood) {
            case 'awesome': return '🤩';
            case 'good': return '😊';
            case 'okay': return '😐';
            case 'sad': return '😢';
            case 'angry': return '😡';
            default: return null;
        }
    };

    return (
        // 1:1 from JournalCard.vue line 30-89
        <Link 
            href={`/journal/write/${journal.id}`}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col group relative"
        >
            <button 
                type="button"
                onClick={handleDelete}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 dark:bg-slate-800/90 text-rose-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-none transition-all md:opacity-0 md:group-hover:opacity-100 md:scale-90 md:group-hover:scale-100 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white active:scale-95 sm:opacity-80"
                title="Hapus Jurnal"
            >
                <Trash2 className="w-5 h-5 stroke-[2.5]" />
            </button>

            {journal.image_url && (
                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden relative transition-colors duration-500">
                    <img src={journal.image_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                </div>
            )}

            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-lg transition-colors duration-500">
                        {formatDate(journal.date)}
                    </span>
                    {journal.mood && (
                        <span className="text-2xl" title="Mood">
                            {getMoodEmoji(journal.mood)}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3 line-clamp-2 transition-colors duration-500">
                    {journal.title || t('journal_untitled') || 'Cerita Hari Ini'}
                </h3>
                
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-4 flex-1 leading-relaxed transition-colors duration-500">
                    {journal.content ? stripHtml(journal.content) : (t('journal_no_content') || 'Tidak ada teks...')}
                </p>

                {/* AI Sentiment Badge */}
                {(journal.ai_sentiment || isExplorer) && (
                    <div 
                        onClick={(e) => {
                            if (isExplorer) {
                                e.preventDefault();
                                onOpenPreview?.();
                            }
                        }}
                        className={`mt-6 p-4 rounded-2xl transition-all duration-500 overflow-hidden relative group/sentiment ${
                            isExplorer 
                                ? 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer' 
                                : 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20'
                        }`}
                    >
                        {isExplorer && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover/sentiment:opacity-100 transition-opacity"></div>
                        )}
                        
                        <div className="relative z-10 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest">Neural sentiment analysis</span>
                                {isExplorer && (
                                    <div className="ml-auto px-1.5 py-0.5 rounded bg-indigo-500 text-white text-[7px] font-black tracking-widest">Elite</div>
                                )}
                            </div>

                            {isExplorer ? (
                                <div className="space-y-1.5 blur-[1px] opacity-20 group-hover/sentiment:opacity-40 transition-all">
                                    <div className="h-1.5 w-full bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                                    <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                </div>
                            ) : (
                                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-tight italic line-clamp-2">
                                    "{journal.ai_sentiment}"
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
