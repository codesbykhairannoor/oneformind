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
                        {journal.image_url && (
                            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 shadow-sm">
                                <img src={journal.image_url} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Cognitive AI Reflection Insight Box */}
                        <div className="p-5 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs font-black tracking-wide text-indigo-900 dark:text-indigo-300">
                                    {isIndo ? 'Analisis Kognitif & Refleksi Neural' : 'Cognitive AI Reflection'}
                                </span>
                            </div>

                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">
                                "{journal.ai_sentiment || aiAnalysis.sentimentSummary}"
                            </p>

                            {distortionText && (
                                <div className="flex items-start gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/40 text-[11px] text-amber-700 dark:text-amber-400">
                                    <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                                    <span>
                                        <strong>{isIndo ? 'Pola Pikiran Terdeteksi:' : 'Pattern Detected:'}</strong> {distortionText}
                                    </span>
                                </div>
                            )}

                            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100/80 dark:border-indigo-900/40 space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                    <Lightbulb size={12} /> {isIndo ? 'Pertanyaan untuk Eksplorasi Diri:' : 'Self-Reflection Prompt:'}
                                </span>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {aiAnalysis.reflectiveQuestion}
                                </p>
                            </div>
                        </div>

                        {/* Journal Body Content */}
                        <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap font-serif">
                            {journal.content || (isIndo ? 'Tidak ada isi tulisan.' : 'No content written.')}
                        </div>

                    </div>

                </div>
            </div>
        </ModalPortal>
    );
}
