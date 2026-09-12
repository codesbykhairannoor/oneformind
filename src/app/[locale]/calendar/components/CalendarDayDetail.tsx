'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    X, Plus, Trash2, Edit3, Video, Clock, 
    Briefcase, Target, CheckSquare, Leaf, 
    DollarSign, ExternalLink, MapPin 
} from 'lucide-react';
import ModalPortal from '@/components/ModalPortal';
import { UnifiedCalendarEvent, detectMeetingPlatform } from '../lib/calendarAnalytics';

interface CalendarDayDetailProps {
    date: string;
    events: UnifiedCalendarEvent[];
    jobInterviews: any[];
    milestones: any[];
    plannerTasks: any[];
    habitCount: number;
    completedHabits?: any[];
    financeExpense: number;
    onClose: () => void;
    onAddEvent: () => void;
    onEditEvent: (event: UnifiedCalendarEvent) => void;
    onDeleteEvent: (id: string | number) => void;
    onTogglePlannerTask?: (taskId: string | number) => void;
}

export default function CalendarDayDetail({
    date,
    events,
    jobInterviews,
    milestones,
    plannerTasks,
    habitCount,
    completedHabits = [],
    financeExpense,
    onClose,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
    onTogglePlannerTask
}: CalendarDayDetailProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const formattedDate = (() => {
        try {
            return new Date(date).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return date;
        }
    })();

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] z-10 transition-colors">
                    
                    {/* Header */}
                    <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <div>
                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                                {isIndo ? 'Rekap 360° Life OS Harian' : '360° Daily Life OS Recap'}
                            </span>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white capitalize">
                                {formattedDate}
                            </h3>
                        </div>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 overflow-y-auto space-y-6">
                        
                        {/* Section 1: Events & Meetings */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Clock size={13} className="text-indigo-600" />
                                    <span>{isIndo ? 'Jadwal Agenda & Pertemuan' : 'Events & Scheduled Calls'}</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={onAddEvent}
                                    className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-black flex items-center gap-1 transition active:scale-95"
                                >
                                    <Plus size={12} />
                                    <span>{isIndo ? 'Tambah' : 'Add'}</span>
                                </button>
                            </div>

                            {events.length === 0 ? (
                                <p className="text-xs font-medium text-slate-400 py-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    {isIndo ? 'Belum ada agenda terdaftar pada hari ini.' : 'No events scheduled for this day.'}
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {events.map((ev) => {
                                        const meeting = detectMeetingPlatform(ev.meeting_url || ev.description);

                                        return (
                                            <div
                                                key={ev.id}
                                                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
                                                style={{ borderLeftWidth: '4px', borderLeftColor: ev.color || '#4f46e5' }}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-black text-xs text-slate-800 dark:text-white truncate">
                                                            {ev.title}
                                                        </h4>
                                                        {meeting.platform && (
                                                            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-[9px] font-black flex items-center gap-1">
                                                                <Video size={10} />
                                                                <span>{meeting.name}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                                                        <span>{ev.is_all_day ? (isIndo ? 'Sepanjang Hari' : 'All Day') : `${ev.start_time || '09:00'} - ${ev.end_time || ''}`}</span>
                                                        {ev.location && <span>📍 {ev.location}</span>}
                                                    </p>

                                                    {ev.description && (
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                                                            {ev.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {meeting.url && (
                                                        <a
                                                            href={meeting.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black flex items-center gap-1 shadow-sm"
                                                        >
                                                            <span>Join</span>
                                                            <ExternalLink size={10} />
                                                        </a>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => onEditEvent(ev)}
                                                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-indigo-600 dark:text-slate-300 transition"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteEvent(ev.id)}
                                                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-rose-600 dark:text-slate-300 transition"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Section 2: Job Interviews & Goal Milestones */}
                        {(jobInterviews.length > 0 || milestones.length > 0) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {jobInterviews.length > 0 && (
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 space-y-2">
                                        <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300 tracking-wider flex items-center gap-1">
                                            <Briefcase size={12} />
                                            <span>{isIndo ? 'Wawancara Kerja' : 'Job Interviews'}</span>
                                        </span>
                                        {jobInterviews.map((job, idx) => (
                                            <p key={idx} className="text-xs font-bold text-slate-800 dark:text-white">
                                                {job.company} - {job.position || 'Interview'}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {milestones.length > 0 && (
                                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 space-y-2">
                                        <span className="text-[10px] font-black uppercase text-orange-700 dark:text-orange-300 tracking-wider flex items-center gap-1">
                                            <Target size={12} />
                                            <span>{isIndo ? 'Tenggat Target Milestone' : 'Goal Milestones'}</span>
                                        </span>
                                        {milestones.map((ms, idx) => (
                                            <p key={idx} className="text-xs font-bold text-slate-800 dark:text-white">
                                                {ms.title}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section 3: Planner Tasks */}
                        <div className="space-y-2">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <CheckSquare size={13} className="text-blue-600" />
                                <span>{isIndo ? 'Tugas Planner' : 'Planner Tasks'}</span>
                            </span>

                            {plannerTasks.length === 0 ? (
                                <p className="text-xs font-medium text-slate-400 py-2 text-center">
                                    {isIndo ? 'Tidak ada tugas yang dijadwalkan.' : 'No tasks assigned for this day.'}
                                </p>
                            ) : (
                                <div className="space-y-1.5">
                                    {plannerTasks.map((t, idx) => (
                                        <div 
                                            key={t.id || idx}
                                            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={!!t.isCompleted}
                                                onChange={() => onTogglePlannerTask && onTogglePlannerTask(t.id)}
                                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className={`text-xs font-bold ${t.isCompleted ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                                {t.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section 4: Habits & Finance Summary Cards */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                                    <Leaf size={12} />
                                    <span>{isIndo ? 'Kebiasaan Tuntas' : 'Habits Checked'}</span>
                                </span>
                                <p className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono">
                                    {habitCount} {isIndo ? 'Item' : 'Items'}
                                </p>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40">
                                <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider flex items-center gap-1">
                                    <DollarSign size={12} />
                                    <span>{isIndo ? 'Pengeluaran' : 'Expenses'}</span>
                                </span>
                                <p className="text-lg font-black text-rose-700 dark:text-rose-300 mt-1 font-mono">
                                    Rp {financeExpense.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        {/* Section 5: List of Completed Habits */}
                        {completedHabits && completedHabits.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Leaf size={13} className="text-emerald-500" />
                                    <span>{isIndo ? 'Kebiasaan Tuntas Hari Ini' : 'Completed Habits Today'}</span>
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {completedHabits.map((h: any, idx: number) => (
                                        <div 
                                            key={h.id || idx}
                                            className="px-3 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 flex items-center justify-between gap-2"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-base shrink-0">{h.icon || '🌱'}</span>
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                                    {h.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50 shrink-0">
                                                ✓ {isIndo ? 'Selesai' : 'Done'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
