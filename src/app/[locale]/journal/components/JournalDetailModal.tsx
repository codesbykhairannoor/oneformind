'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    X, 
    Edit3, 
    Trash2, 
    Calendar, 
    Clock, 
    Sparkles, 
    Copy, 
    Check, 
    Tag,
    BookOpen,
    ShieldAlert,
    Lightbulb
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { JournalItem } from './JournalCard';
import { analyzeJournalEntry } from '../lib/journalAi';

interface JournalDetailModalProps {
    journal: JournalItem | null;
    isOpen?: boolean;
    onClose: () => void;
    onDelete: (id: number | string) => void;
}

export default function JournalDetailModal({
    journal,
    isOpen = true,
    onClose,
    onDelete
}: JournalDetailModalProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';
    const [copied, setCopied] = useState(false);

    if (!isOpen || !journal) return null;

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

    const getMoodEmoji = (mood?: string) => {
        switch (mood) {
            case 'awesome': return { emoji: '🤩', label: isIndo ? 'Luar Biasa' : 'Awesome', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200' };
            case 'good': return { emoji: '😊', label: isIndo ? 'Senang & Tenang' : 'Good', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-200' };
            case 'okay': return { emoji: '😐', label: isIndo ? 'Biasa Saja' : 'Neutral', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200' };
            case 'sad': return { emoji: '😢', label: isIndo ? 'Sedih & Melow' : 'Reflective Low', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-200' };
            case 'angry': return { emoji: '😡', label: isIndo ? 'Stres / Marah' : 'Stressed', color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200' };
            default: return { emoji: '📝', label: 'Journal', color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-200' };
        }
    };

    const moodInfo = getMoodEmoji(journal.mood);

    // Compute dynamic cognitive analysis
    const aiAnalysis = analyzeJournalEntry(journal.content || '', journal.mood || 'good', locale);

    const handleCopy = () => {
        const fullText = `${journal.title || 'Untitled'}\n${journal.date}\n\n${journal.content || ''}`;
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const distortionText = typeof aiAnalysis.detectedDistortion === 'string' 
        ? aiAnalysis.detectedDistortion 
        : aiAnalysis.detectedDistortion?.name;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-200/70 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[92vh]">
                    
                    {/* Header Controls */}
                    <div className="p-4 sm:p-7 pb-3 sm:pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Calendar size={14} className="text-indigo-500" />
                            <span>{formatDate(journal.date)}</span>
                            <span>•</span>
                            <span className="font-mono">{aiAnalysis.wordCount} {isIndo ? 'kata' : 'words'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition text-xs flex items-center gap-1 font-bold"
                                title={isIndo ? 'Salin Catatan' : 'Copy Text'}
                            >
                                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                <span className="hidden sm:inline">{copied ? (isIndo ? 'Disalin!' : 'Copied!') : (isIndo ? 'Salin' : 'Copy')}</span>
                            </button>

                            <Link
                                href={`/journal/write/${journal.id}`}
                                className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition text-xs flex items-center gap-1 font-bold"
                                title={isIndo ? 'Edit Jurnal' : 'Edit Entry'}
                            >
                                <Edit3 size={14} />
                                <span className="hidden sm:inline">{isIndo ? 'Edit' : 'Edit'}</span>
                            </Link>

                            <button
                                onClick={() => {
                                    onDelete(journal.id);
                                    onClose();
                                }}
                                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition text-xs"
                                title={isIndo ? 'Hapus' : 'Delete'}
                            >
                                <Trash2 size={14} />
                            </button>

                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
                        
                        {/* Title & Mood Badge */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${moodInfo.color}`}>
                                    <span className="text-base">{moodInfo.emoji}</span>
                                    <span>{moodInfo.label}</span>
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                                {journal.title || (isIndo ? 'Cerita Hari Ini' : 'Untitled Story')}
                            </h2>
                        </div>

                        {/* Attached Cover Photo */}
                        {(() => {
                            const coverImage = journal.image_url || journal.imagePath || (journal as any).coverImage || (journal as any).cover_image;
                            if (!coverImage) return null;
                            return (
                                <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 shadow-sm bg-slate-100 dark:bg-slate-800">
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            );
                        })()}



                        {/* Journal Body Content with Clean HTML / Plain Text Handling */}
                        {(() => {
                            const rawContent = journal.content || '';
                            const hasHtml = /<[a-z0-9]+/i.test(rawContent);

                            if (!rawContent) {
                                return (
                                    <p className="text-sm italic text-slate-400">
                                        {isIndo ? 'Tidak ada isi tulisan.' : 'No content written.'}
                                    </p>
                                );
                            }

                            if (hasHtml) {
                                // Normalize HTML tags & strip empty paragraphs
                                const cleanHtml = rawContent
                                    .replace(/<\/?P>/g, (m) => m.toLowerCase())
                                    .replace(/<p>\s*<\/p>/gi, '')
                                    .replace(/<p><p>/gi, '<p>')
                                    .replace(/<\/p><\/p>/gi, '</p>');

                                return (
                                    <div 
                                        className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans [&_p]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_li]:mb-1 [&_strong]:font-bold [&_h1]:text-xl [&_h1]:font-black [&_h2]:text-lg [&_h2]:font-bold"
                                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                                    />
                                );
                            }

                            return (
                                <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap font-sans">
                                    {rawContent}
                                </div>
                            );
                        })()}

                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
