'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    Clock, 
    Sparkles, 
    ArrowRight, 
    Trash2, 
    BookOpen, 
    Calendar,
    Tag
} from 'lucide-react';
import { JournalItem } from './JournalCard';

interface JournalTimelineViewProps {
    journals: JournalItem[];
    onSelectJournal: (journal: JournalItem) => void;
    onDeleteJournal?: (id: number | string) => void;
}

export default function JournalTimelineView({ 
    journals = [], 
    onSelectJournal, 
    onDeleteJournal 
}: JournalTimelineViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const stripHtml = (html?: string) => {
        if (!html) return '';
        return html
            .replace(/<\/?(p|div|li|br|h[1-6])[^>]*>/gi, ' ')
            .replace(/<[^>]*>?/gm, '')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&quot;/gi, '"')
            .replace(/&#39;/gi, "'")
            .replace(/#\w+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const getMoodEmoji = (mood?: string) => {
        switch (mood) {
            case 'awesome': return '🤩';
            case 'good': return '😊';
            case 'okay': return '😐';
            case 'sad': return '😢';
            case 'angry': return '😡';
            default: return '📝';
        }
    };

    if (journals.length === 0) {
        return (
            <div className="text-center py-16 bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8">
                <span className="text-4xl block mb-2">📜</span>
                <h4 className="text-base font-black text-slate-800 dark:text-white">
                    {isIndo ? 'Belum ada alur cerita kronologis' : 'No timeline entries yet'}
                </h4>
            </div>
        );
    }

    return (
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500/40 before:to-transparent">
            {journals.map((journal, idx) => {
                const words = stripHtml(journal.content).split(/\s+/).filter(Boolean).length;
                const readingTime = Math.max(1, Math.ceil(words / 180));

                return (
                    <div key={journal.id} className="relative group">
                        
                        {/* Timeline Node Icon */}
                        <div className="absolute -left-6 sm:-left-10 top-5 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 text-xs flex items-center justify-center shadow-md transform group-hover:scale-125 transition-transform z-10">
                            <span>{getMoodEmoji(journal.mood)}</span>
                        </div>

                        {/* Story Card */}
                        <div 
                            onClick={() => onSelectJournal(journal)}
                            className="p-6 sm:p-7 rounded-[2.2rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer space-y-4"
                        >
                            
                            {/* Date & Meta Header */}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Calendar size={13} className="text-indigo-500" />
                                    <span>{formatDate(journal.date)}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-mono">
                                        <Clock size={12} /> {readingTime} {isIndo ? 'mnt baca' : 'min read'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteJournal?.(journal.id);
                                        }}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                                        title={isIndo ? 'Hapus' : 'Delete'}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Title & Preview */}
                            <div className="space-y-2">
                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {journal.title || (isIndo ? 'Cerita Tanpa Judul' : 'Untitled Story')}
                                </h3>

                                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                                    {journal.content ? stripHtml(journal.content) : '...'}
                                </p>
                            </div>

                            {/* AI Neural Reflection Pill */}
                            {journal.ai_sentiment && (
                                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-2.5 text-xs">
                                    <Sparkles size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                    <div className="space-y-0.5 min-w-0">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                                            {isIndo ? 'Insight Kognitif AI' : 'Cognitive Neural Insight'}
                                        </span>
                                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic line-clamp-2">
                                            "{journal.ai_sentiment}"
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                );
            })}
        </div>
    );
}
