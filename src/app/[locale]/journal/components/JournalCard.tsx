'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Trash2, Clock, BookOpen, Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import { analyzeJournalCognitive } from '../lib/journalAi';

export interface JournalItem {
    id: number | string;
    title?: string;
    content?: string;
    date: string;
    mood?: 'awesome' | 'good' | 'okay' | 'sad' | 'angry' | string;
    image_url?: string;
    imagePath?: string;
    ai_sentiment?: string;
    aiSentiment?: string;
    tags?: string[];
}

interface JournalCardProps {
    journal: JournalItem;
    isExplorer?: boolean;
    onDelete: (id: number | string) => void;
    onOpenPreview?: () => void;
    onSelect?: (journal: JournalItem) => void;
}

export default function JournalCard({ journal, isExplorer = false, onDelete, onOpenPreview, onSelect }: JournalCardProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
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

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(journal.id);
    };

    const getMoodDetails = (mood?: string) => {
        switch (mood) {
            case 'awesome':
                return { emoji: '🤩', label: isIndo ? 'Luar Biasa' : 'Awesome', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
            case 'good':
                return { emoji: '😊', label: isIndo ? 'Senang' : 'Good', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
            case 'okay':
                return { emoji: '😐', label: isIndo ? 'Biasa Saja' : 'Okay', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
            case 'sad':
                return { emoji: '😢', label: isIndo ? 'Sedih' : 'Sad', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' };
            case 'angry':
                return { emoji: '😡', label: isIndo ? 'Marah' : 'Stressed', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
            default:
                return { emoji: '✨', label: isIndo ? 'Refleksi' : 'Reflection', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
        }
    };

    // Calculate reading time & word count
    const cleanText = stripHtml(journal.content);
    const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    // Extract tags from content if not explicitly provided
    const extractedTags = React.useMemo(() => {
        if (journal.tags && journal.tags.length > 0) return journal.tags;
        if (!journal.content) return [];
        const matches = journal.content.match(/#([\w\u00C0-\u024F]+)/g);
        return matches ? matches.map(t => t.replace('#', '')).slice(0, 3) : [];
    }, [journal.content, journal.tags]);

    // Dynamic cognitive preview
    const cognitiveInsight = React.useMemo(() => {
        return analyzeJournalCognitive(journal.content || '', journal.mood || 'awesome', locale);
    }, [journal.content, journal.mood, locale]);

    const moodObj = getMoodDetails(journal.mood);
    const coverImage = journal.image_url || journal.imagePath || (journal as any).coverImage || (journal as any).cover_image;

    const handleCardClick = (e: React.MouseEvent) => {
        if (onSelect) {
            e.preventDefault();
            onSelect(journal);
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className="group relative bg-white dark:bg-slate-900/90 rounded-[2rem] border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-950/30 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
        >
            {/* Top Glow on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

            {/* Quick Action: Delete button */}
            <button 
                type="button"
                onClick={handleDelete}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-400 hover:text-rose-500 rounded-full flex items-center justify-center shadow-md border border-slate-200/50 dark:border-slate-700/50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 scale-95 sm:scale-90 sm:group-hover:scale-100 hover:scale-105 active:scale-95"
                title={isIndo ? 'Hapus Jurnal' : 'Delete Journal'}
            >
                <Trash2 className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Cover Image if attached */}
            {coverImage && (
                <div className="w-full h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden relative transition-colors">
                    <img 
                        src={coverImage} 
                        alt="Journal cover" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>
            )}

            <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Header Meta: Date & Mood Badge */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2.5 py-1 rounded-lg">
                        {formatDate(journal.date)}
                    </span>
                    
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-black ${moodObj.color}`}>
                        <span>{moodObj.emoji}</span>
                        <span className="text-[10px]">{moodObj.label}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2.5 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {journal.title || (isIndo ? 'Catatan Refleksi Harian' : 'Daily Reflection Entry')}
                </h3>
                
                {/* Clean Excerpt */}
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-3 flex-1 leading-relaxed mb-4">
                    {cleanText || (isIndo ? 'Tidak ada isi teks...' : 'No content written...')}
                </p>

                {/* Tags preview if any */}
                {extractedTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {extractedTags.map((tag, idx) => (
                            <span 
                                key={idx}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded-md"
                            >
                                <Tag className="w-2.5 h-2.5" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Word count, read time & Read Story action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {readTimeMinutes} {isIndo ? 'mnt baca' : 'min read'}
                        </span>
                        <span>•</span>
                        <span>{wordCount} {isIndo ? 'kata' : 'words'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-black text-[11px] group-hover:translate-x-0.5 transition-transform">
                        <span>{isIndo ? 'Baca' : 'Read'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </div>
    );
}

