'use client';

import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { 
    History, 
    Sparkles, 
    ArrowRight, 
    Calendar, 
    HeartHandshake, 
    Hourglass, 
    Flame,
    Plus
} from 'lucide-react';
import { JournalItem } from './JournalCard';

interface JournalMemoriesViewProps {
    journals: JournalItem[];
    onSelectJournal: (journal: JournalItem) => void;
}

export default function JournalMemoriesView({ journals = [], onSelectJournal }: JournalMemoriesViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const today = new Date();

    // Group flashbacks
    const flashbacks = useMemo(() => {
        const results: { label: string; periodText: string; journal: JournalItem; daysAgo: number }[] = [];

        journals.forEach(j => {
            if (!j.date) return;
            const entryDate = new Date(j.date);
            const diffTime = today.getTime() - entryDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 6 && diffDays <= 8) {
                results.push({
                    label: isIndo ? '1 Minggu yang Lalu' : '1 Week Ago',
                    periodText: isIndo ? '7 hari yang lalu' : '7 days ago',
                    journal: j,
                    daysAgo: diffDays
                });
            } else if (diffDays >= 28 && diffDays <= 32) {
                results.push({
                    label: isIndo ? '1 Bulan yang Lalu' : '1 Month Ago',
                    periodText: isIndo ? 'Sekitar 30 hari yang lalu' : '~30 days ago',
                    journal: j,
                    daysAgo: diffDays
                });
            } else if (diffDays >= 175 && diffDays <= 185) {
                results.push({
                    label: isIndo ? 'Setengah Tahun Lalu' : '6 Months Ago',
                    periodText: isIndo ? '6 bulan yang lalu' : '6 months ago',
                    journal: j,
                    daysAgo: diffDays
                });
            } else if (diffDays >= 360 && diffDays <= 370) {
                results.push({
                    label: isIndo ? '1 Tahun yang Lalu' : '1 Year Ago',
                    periodText: isIndo ? 'Tepat 1 tahun yang lalu' : '1 year ago today',
                    journal: j,
                    daysAgo: diffDays
                });
            }
        });

        // Also add random old gem if results is empty but journals exist
        if (results.length === 0 && journals.length > 0) {
            const oldest = [...journals].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            const diffDays = Math.floor((today.getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                results.push({
                    label: isIndo ? 'Kilasan Memori Masa Lalu' : 'Memory Flashback',
                    periodText: isIndo ? `${diffDays} hari yang lalu` : `${diffDays} days ago`,
                    journal: oldest,
                    daysAgo: diffDays
                });
            }
        }

        return results;
    }, [journals, isIndo, today]);

    const stripHtml = (html?: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>?/gm, '');
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

    return (
        <div className="space-y-6">
            
            {/* Banner */}
            <div className="p-6 sm:p-8 rounded-[2.5rem] bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/60 dark:border-amber-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 shrink-0">
                        ⏳
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 block mb-1">
                            {isIndo ? 'Nostalgia & Refleksi Pertumbuhan' : 'Flashbacks & Growth Reflection'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isIndo ? 'Kilasan Kenangan (On This Day)' : 'On This Day Flashbacks'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                            {isIndo 
                                ? 'Lihat apa yang kamu pikirkan dan rasakan di masa lalu. Sadari betapa banyaknya rintangan yang sudah berhasil kamu lalui!' 
                                : 'See how much you have grown by revisiting your past thoughts, feelings, and triumphs.'}
                        </p>
                    </div>
                </div>

                <Link
                    href="/journal/write"
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus size={15} strokeWidth={3} />
                    <span>{isIndo ? 'Tulis Cerita Hari Ini' : 'Write Today\'s Memory'}</span>
                </Link>
            </div>

            {/* Flashback Cards Grid */}
            {flashbacks.length === 0 ? (
                <div className="text-center py-16 bg-white/80 dark:bg-slate-900/80 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 p-8 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 text-2xl flex items-center justify-center mx-auto">
                        🌱
                    </div>
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                        {isIndo ? 'Belum Ada Kenangan Lama yang Cukup Matang' : 'Memories Are Growing'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                        {isIndo
                            ? 'Teruslah menulis secara rutin! Setelah 7 hari, 1 bulan, dan 1 tahun, sistem akan otomatis menampilkan kilasan kenangan nostalgia di halaman ini.'
                            : 'Keep journaling consistently! Flashbacks will automatically appear here once your entries reach 7 days, 1 month, and 1 year milestones.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {flashbacks.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => onSelectJournal(item.journal)}
                            className="p-6 sm:p-7 rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-200/70 dark:border-slate-800 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer flex flex-col justify-between gap-4 group relative overflow-hidden"
                        >
                            
                            {/* Top Badge */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-black tracking-wide border border-amber-300 dark:border-amber-800/40">
                                    <Hourglass size={13} />
                                    <span>{item.label}</span>
                                </span>
                                <span className="text-2xl">
                                    {getMoodEmoji(item.journal.mood)}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 transition-colors">
                                    {item.journal.title || (isIndo ? 'Cerita Masa Lalu' : 'Past Memory')}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                    {item.journal.content ? stripHtml(item.journal.content) : '...'}
                                </p>
                            </div>

                            {/* Footer & Reflection Trigger */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-[10px] font-bold text-slate-400">
                                    {item.periodText}
                                </span>
                                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 text-[11px] group-hover:translate-x-1 transition-transform">
                                    <span>{isIndo ? 'Buka Jurnal' : 'Read Entry'}</span>
                                    <ArrowRight size={14} />
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
