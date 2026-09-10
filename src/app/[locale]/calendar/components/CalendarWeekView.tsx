'use client';

import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Clock, Video, Plus, ExternalLink, 
    AlertCircle, Briefcase, Target, CheckSquare 
} from 'lucide-react';
import { 
    UnifiedCalendarEvent, 
    detectMeetingPlatform, 
    getEventDurationMinutes 
} from '../lib/calendarAnalytics';
import { CalendarLayerFilters } from './CalendarFilterBar';

interface CalendarWeekViewProps {
    currentDate: string; // YYYY-MM-DD
    events: UnifiedCalendarEvent[];
    layers: CalendarLayerFilters;
    onSelectDate: (date: string) => void;
    onOpenDayDetail: (date: string) => void;
    onOpenEventModal: (date: string, startTime?: string) => void;
    onEditEvent: (event: UnifiedCalendarEvent) => void;
}

const START_HOUR = 6; // 06:00
const END_HOUR = 22;  // 22:00
const HOUR_HEIGHT = 64; // Pixels per hour

export default function CalendarWeekView({
    currentDate,
    events,
    layers,
    onSelectDate,
    onOpenDayDetail,
    onOpenEventModal,
    onEditEvent
}: CalendarWeekViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    // Compute the 7 days of the week containing currentDate
    const weekDays = useMemo(() => {
        const curr = new Date(currentDate);
        const dayOfWeek = curr.getDay(); // 0 is Sunday, 1 is Monday
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(curr);
        monday.setDate(curr.getDate() + mondayOffset);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                dayNumber: d.getDate(),
                dayName: d.toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { weekday: 'short' }),
                isToday: dateStr === new Date().toISOString().split('T')[0],
                isSelected: dateStr === currentDate
            });
        }
        return days;
    }, [currentDate, isIndo]);

    // Hours list
    const hours = useMemo(() => {
        const list = [];
        for (let h = START_HOUR; h <= END_HOUR; h++) {
            list.push(`${String(h).padStart(2, '0')}:00`);
        }
        return list;
    }, []);

    // Current Time in Minutes for red indicator
    const nowMinutes = useMemo(() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-colors flex flex-col">
            
            {/* Week Header: 7 Days Column Titles */}
            <div className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 sticky top-0 z-20">
                
                {/* Time Axis Column Top-Left corner */}
                <div className="py-3 px-2 text-center text-[10px] font-black uppercase text-slate-400 border-r border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <Clock size={12} className="mr-1 opacity-60" />
                    <span>GMT+7</span>
                </div>

                {/* 7 Days Columns */}
                {weekDays.map((d) => (
                    <div
                        key={d.date}
                        onClick={() => onSelectDate(d.date)}
                        className={`py-3 px-1 sm:px-2 text-center border-r last:border-r-0 border-slate-100 dark:border-slate-800 cursor-pointer transition-all ${
                            d.isToday 
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/30' 
                                : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                        }`}
                    >
                        <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                            {d.dayName}
                        </span>
                        <div className="flex items-center justify-center mt-0.5">
                            <span className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                                d.isToday
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                                    : d.isSelected
                                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-700 dark:text-slate-200'
                            }`}>
                                {d.dayNumber}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 24-Hour Time Grid Scrollable Body */}
            <div className="overflow-y-auto max-h-[680px] relative">
                <div 
                    className="grid grid-cols-8 divide-x divide-slate-100 dark:divide-slate-800/60 relative"
                    style={{ height: `${(END_HOUR - START_HOUR + 1) * HOUR_HEIGHT}px` }}
                >
                    
                    {/* Column 0: Time Axis Labels */}
                    <div className="relative border-r border-slate-100 dark:border-slate-800 select-none bg-slate-50/20 dark:bg-slate-950/20">
                        {hours.map((h, i) => (
                            <div 
                                key={h}
                                className="absolute right-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 -translate-y-1/2"
                                style={{ top: `${i * HOUR_HEIGHT}px` }}
                            >
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Columns 1-7: Day Time-Block Columns */}
                    {weekDays.map((d) => {
                        const dayEvents = events.filter(e => e.start_date === d.date);

                        return (
                            <div 
                                key={d.date}
                                className="relative group/col hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
                            >
                                {/* Horizontal Hour Grid Lines */}
                                {hours.map((_, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            const clickedHour = String(START_HOUR + i).padStart(2, '0') + ':00';
                                            onOpenEventModal(d.date, clickedHour);
                                        }}
                                        className="absolute w-full border-b border-slate-100/80 dark:border-slate-800/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors"
                                        style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                                        title={`${isIndo ? 'Klik untuk tambah agenda jam' : 'Click to add event at'} ${String(START_HOUR + i).padStart(2, '0')}:00`}
                                    />
                                ))}

                                {/* Red Current Time Marker Line if today */}
                                {d.isToday && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60 && (
                                    <div 
                                        className="absolute left-0 right-0 z-10 flex items-center pointer-events-none"
                                        style={{ top: `${((nowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT}px` }}
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1.5 shadow-md shadow-rose-500/50 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                                        <div className="flex-1 h-[2px] bg-rose-500 shadow-sm" />
                                    </div>
                                )}

                                {/* Render Scheduled Events Blocks */}
                                {layers.events && dayEvents.map((ev) => {
                                    const [sh, sm] = (ev.start_time || '09:00').split(':').map(Number);
                                    const eventMinutes = sh * 60 + (sm || 0);
                                    
                                    // Skip if totally outside bounds
                                    if (eventMinutes < START_HOUR * 60 && !ev.is_all_day) return null;

                                    const topOffset = Math.max(0, ((eventMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT);
                                    const duration = ev.is_all_day ? 60 : getEventDurationMinutes(ev.start_time, ev.end_time);
                                    const heightPx = Math.max(28, (duration / 60) * HOUR_HEIGHT - 4);
                                    const meeting = detectMeetingPlatform(ev.meeting_url || ev.description);

                                    return (
                                        <div
                                            key={ev.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditEvent(ev);
                                            }}
                                            className="absolute left-1 right-1 rounded-xl p-2 z-10 shadow-md border overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.02] hover:z-20 cursor-pointer group"
                                            style={{
                                                top: `${topOffset}px`,
                                                height: `${heightPx}px`,
                                                backgroundColor: `${ev.color || '#4f46e5'}20`,
                                                borderColor: `${ev.color || '#4f46e5'}60`,
                                                borderLeftWidth: '4px',
                                                borderLeftColor: ev.color || '#4f46e5'
                                            }}
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className="text-[11px] font-black truncate leading-tight" style={{ color: ev.color || '#4f46e5' }}>
                                                        {ev.title}
                                                    </p>
                                                    {meeting.platform && (
                                                        <Video size={12} className="shrink-0 text-purple-600 dark:text-purple-400" />
                                                    )}
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {ev.start_time} - {ev.end_time || ''}
                                                </p>
                                            </div>

                                            {/* 1-Click Launch Meeting Button if URL present */}
                                            {meeting.url && (
                                                <a
                                                    href={meeting.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mt-1 px-2 py-0.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-black flex items-center gap-1 w-fit shadow-sm transition-all"
                                                >
                                                    <span>Join {meeting.name}</span>
                                                    <ExternalLink size={9} />
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>
                        );
                    })}

                </div>
            </div>

        </div>
    );
}
