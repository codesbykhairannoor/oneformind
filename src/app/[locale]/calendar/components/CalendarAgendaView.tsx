'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Search, Calendar as CalendarIcon, Clock, 
    Video, ExternalLink, Edit3, Trash2, 
    Plus, Briefcase, Target, MapPin 
} from 'lucide-react';
import { UnifiedCalendarEvent, detectMeetingPlatform } from '../lib/calendarAnalytics';

interface CalendarAgendaViewProps {
    events: UnifiedCalendarEvent[];
    onOpenEventModal: (date?: string) => void;
    onEditEvent: (event: UnifiedCalendarEvent) => void;
    onDeleteEvent: (id: string | number) => void;
}

export default function CalendarAgendaView({
    events,
    onOpenEventModal,
    onEditEvent,
    onDeleteEvent
}: CalendarAgendaViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [searchQuery, setSearchQuery] = useState('');

    const todayStr = new Date().toISOString().split('T')[0];

    // Filter and sort events
    const filteredEvents = useMemo(() => {
        return events
            .filter(ev => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                    ev.title.toLowerCase().includes(q) ||
                    (ev.description && ev.description.toLowerCase().includes(q)) ||
                    (ev.location && ev.location.toLowerCase().includes(q))
                );
            })
            .sort((a, b) => {
                const dateCompare = a.start_date.localeCompare(b.start_date);
                if (dateCompare !== 0) return dateCompare;
                return (a.start_time || '00:00').localeCompare(b.start_time || '00:00');
            });
    }, [events, searchQuery]);

    // Group events by date
    const groupedEvents = useMemo(() => {
        const map = new Map<string, UnifiedCalendarEvent[]>();
        filteredEvents.forEach(ev => {
            if (!map.has(ev.start_date)) {
                map.set(ev.start_date, []);
            }
            map.get(ev.start_date)!.push(ev);
        });
        return Array.from(map.entries()).map(([dateStr, items]) => ({
            date: dateStr,
            items
        }));
    }, [filteredEvents]);

    const formatDateHeader = (dateStr: string) => {
        if (dateStr === todayStr) {
            return isIndo ? 'Hari Ini' : 'Today';
        }
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateStr === tomorrow.toISOString().split('T')[0]) {
            return isIndo ? 'Besok' : 'Tomorrow';
        }

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

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            
            {/* Search Bar & Add Button */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isIndo ? 'Cari agenda, meeting, lokasi...' : 'Search agenda, meetings, locations...'}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => onOpenEventModal()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition active:scale-95"
                >
                    <Plus size={14} strokeWidth={3} />
                    <span>{isIndo ? 'Buat Agenda Baru' : 'Create New Event'}</span>
                </button>
            </div>

            {/* Agenda List Groups */}
            {groupedEvents.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mx-auto">
                        🍃
                    </div>
                    <h4 className="text-base font-black text-slate-800 dark:text-white">
                        {isIndo ? 'Tidak Ada Agenda yang Sesuai' : 'No Matching Events Found'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {isIndo 
                            ? 'Jadwal agenda Anda masih kosong atau tidak sesuai dengan kata kunci pencarian.' 
                            : 'Your agenda stream is empty or no events match your current search query.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedEvents.map(({ date, items }) => (
                        <div key={date} className="space-y-3">
                            
                            {/* Date Group Header */}
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                                    date === todayStr
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                }`}>
                                    <CalendarIcon size={12} />
                                    <span>{formatDateHeader(date)}</span>
                                </div>
                                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800" />
                                <span className="text-[10px] font-bold text-slate-400">
                                    {items.length} {isIndo ? 'agenda' : 'events'}
                                </span>
                            </div>

                            {/* Event Cards */}
                            <div className="space-y-2.5">
                                {items.map((ev) => {
                                    const meeting = detectMeetingPlatform(ev.meeting_url || ev.description);

                                    return (
                                        <div
                                            key={ev.id}
                                            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                            style={{ borderLeftWidth: '5px', borderLeftColor: ev.color || '#4f46e5' }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="font-black text-sm text-slate-800 dark:text-white truncate">
                                                        {ev.title}
                                                    </h4>
                                                    {ev.category && (
                                                        <span 
                                                            className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
                                                            style={{
                                                                backgroundColor: `${ev.color || '#4f46e5'}15`,
                                                                color: ev.color || '#4f46e5'
                                                            }}
                                                        >
                                                            {ev.category}
                                                        </span>
                                                    )}
                                                    {meeting.platform && (
                                                        <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-[10px] font-black flex items-center gap-1">
                                                            <Video size={10} />
                                                            <span>{meeting.name}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 mt-1.5">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        <span>{ev.is_all_day ? (isIndo ? 'Sepanjang Hari' : 'All Day') : `${ev.start_time || '09:00'} - ${ev.end_time || ''}`}</span>
                                                    </span>
                                                    {ev.location && (
                                                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                            <MapPin size={12} />
                                                            <span>{ev.location}</span>
                                                        </span>
                                                    )}
                                                </div>

                                                {ev.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                                                        {ev.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                {meeting.url && (
                                                    <a
                                                        href={meeting.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition"
                                                    >
                                                        <span>Join</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => onEditEvent(ev)}
                                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition active:scale-95"
                                                    title={isIndo ? 'Edit agenda' : 'Edit event'}
                                                >
                                                    <Edit3 size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteEvent(ev.id)}
                                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition active:scale-95"
                                                    title={isIndo ? 'Hapus agenda' : 'Delete event'}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
