'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar as CalIcon, 
    Sparkles, 
    Smile, 
    Plus,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { JournalItem } from './JournalCard';

interface JournalCalendarViewProps {
    journals: JournalItem[];
    onSelectJournal: (journal: JournalItem) => void;
}

export default function JournalCalendarView({ journals = [], onSelectJournal }: JournalCalendarViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNamesId = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthLabel = isIndo ? monthNamesId[month] : monthNamesEn[month];

    const daysOfWeek = isIndo 
        ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] 
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Map journals by YYYY-MM-DD
    const journalsByDate = useMemo(() => {
        const map: Record<string, JournalItem[]> = {};
        journals.forEach(j => {
            const datePart = j.date ? j.date.split('T')[0] : '';
            if (datePart) {
                if (!map[datePart]) map[datePart] = [];
                map[datePart].push(j);
            }
        });
        return map;
    }, [journals]);

    // Calendar grid calculations
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, isCurrentMonth: false, dateStr: '' });
    }
    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        days.push({ day: i, isCurrentMonth: true, dateStr });
    }
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, isCurrentMonth: false, dateStr: '' });
    }

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const getMoodColor = (mood?: string) => {
        switch (mood) {
            case 'awesome': return 'bg-amber-400/20 text-amber-500 border-amber-400/30';
            case 'good': return 'bg-emerald-400/20 text-emerald-500 border-emerald-400/30';
            case 'okay': return 'bg-blue-400/20 text-blue-500 border-blue-400/30';
            case 'sad': return 'bg-indigo-400/20 text-indigo-500 border-indigo-400/30';
            case 'angry': return 'bg-rose-400/20 text-rose-500 border-rose-400/30';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
        }
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

    // Filtered entries for selected date (or default to recent)
    const activeEntries = selectedDateStr ? (journalsByDate[selectedDateStr] || []) : [];

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            
            {/* Calendar Controls Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shadow-sm">
                            <CalIcon size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                {monthLabel} {year}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                                {isIndo ? 'Visualisasi jejak emosi dan konsistensi menulis' : 'Emotional trajectory & daily writing streak'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToday}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                        >
                            {isIndo ? 'Hari Ini' : 'Today'}
                        </button>
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] font-black uppercase tracking-wider text-slate-400 pb-2">
                    {daysOfWeek.map((d, i) => (
                        <div key={i} className="py-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                    {days.map((item, idx) => {
                        if (!item.isCurrentMonth) {
                            return (
                                <div 
                                    key={idx} 
                                    className="min-h-[60px] sm:min-h-[85px] p-2 rounded-2xl bg-slate-50/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 opacity-30 text-slate-400 text-xs font-bold pointer-events-none"
                                >
                                    <span>{item.day}</span>
                                </div>
                            );
                        }

                        const dayJournals = journalsByDate[item.dateStr] || [];
                        const hasEntry = dayJournals.length > 0;
                        const isSelected = selectedDateStr === item.dateStr;
                        const isToday = item.dateStr === todayStr;
                        const primaryMood = hasEntry ? dayJournals[0].mood : undefined;

                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedDateStr(isSelected ? null : item.dateStr)}
                                className={`min-h-[65px] sm:min-h-[90px] p-2 sm:p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all group relative overflow-hidden ${
                                    isSelected
                                        ? 'ring-2 ring-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-md'
                                        : isToday
                                        ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-sm'
                                        : hasEntry
                                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-sm'
                                        : 'border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 text-slate-600'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className={`text-xs font-black ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-black underline decoration-2' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {item.day}
                                    </span>
                                    {isToday && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                                    )}
                                </div>

                                {hasEntry ? (
                                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                                        {dayJournals.map(j => (
                                            <span 
                                                key={j.id} 
                                                className="text-base sm:text-lg transition-transform group-hover:scale-125"
                                                title={j.title || 'Story'}
                                            >
                                                {getMoodEmoji(j.mood)}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-4" />
                                )}

                                {hasEntry && (
                                    <span className="text-[9px] font-mono font-bold text-slate-400 truncate block">
                                        {dayJournals.length} {isIndo ? 'cerita' : 'entry'}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

            </div>

            {/* Selected Date Entries Preview Box */}
            {selectedDateStr && (
                <div className="p-6 rounded-[2.5rem] bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📅</span>
                            <h4 className="text-base font-black text-slate-900 dark:text-white">
                                {isIndo ? 'Cerita pada' : 'Entries on'} {selectedDateStr}
                            </h4>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                                {activeEntries.length} {isIndo ? 'Cerita' : 'Stories'}
                            </span>
                        </div>

                        <Link
                            href="/journal/write"
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center gap-1 hover:bg-indigo-700 transition"
                        >
                            <Plus size={13} />
                            <span>{isIndo ? 'Tulis di Tanggal Ini' : 'Write for Date'}</span>
                        </Link>
                    </div>

                    {activeEntries.length === 0 ? (
                        <p className="text-xs font-medium text-slate-400 italic">
                            {isIndo ? 'Tidak ada jurnal yang ditulis pada tanggal ini.' : 'No journal entries written on this date.'}
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activeEntries.map(j => (
                                <div
                                    key={j.id}
                                    onClick={() => onSelectJournal(j)}
                                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition shadow-sm flex items-start justify-between gap-3 group"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getMoodEmoji(j.mood)}</span>
                                            <h5 className="font-black text-sm text-slate-800 dark:text-white truncate">
                                                {j.title || (isIndo ? 'Cerita Tanpa Judul' : 'Untitled Entry')}
                                            </h5>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            {j.content 
                                                ? j.content
                                                    .replace(/<\/?(p|div|li|br|h[1-6])[^>]*>/gi, ' ')
                                                    .replace(/<[^>]*>?/gm, '')
                                                    .replace(/&nbsp;/gi, ' ')
                                                    .replace(/\s+/g, ' ')
                                                    .trim()
                                                : '...'}
                                        </p>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition shrink-0 mt-1" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
