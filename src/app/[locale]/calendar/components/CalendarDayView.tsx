'use client';

import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { 
    Clock, Video, Plus, CheckSquare, 
    Leaf, DollarSign, Target, ExternalLink, 
    Zap, Sparkles, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { 
    UnifiedCalendarEvent, 
    detectMeetingPlatform, 
    getEventDurationMinutes 
} from '../lib/calendarAnalytics';

interface CalendarDayViewProps {
    date: string; // YYYY-MM-DD
    events: UnifiedCalendarEvent[];
    plannerTasks: any[];
    habitLogs: any[];
    milestones: any[];
    financeTransactions: any[];
    onDateChange: (newDate: string) => void;
    onOpenEventModal: (date: string, startTime?: string) => void;
    onEditEvent: (event: UnifiedCalendarEvent) => void;
    onScheduleTaskToCalendar: (task: any) => void;
}

const START_HOUR = 6;
const END_HOUR = 22;
const HOUR_HEIGHT = 70;

export default function CalendarDayView({
    date,
    events,
    plannerTasks,
    habitLogs,
    milestones,
    financeTransactions,
    onDateChange,
    onOpenEventModal,
    onEditEvent,
    onScheduleTaskToCalendar
}: CalendarDayViewProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const hours = useMemo(() => {
        const list = [];
        for (let h = START_HOUR; h <= END_HOUR; h++) {
            list.push(`${String(h).padStart(2, '0')}:00`);
        }
        return list;
    }, []);

    const dayEvents = events.filter(e => e.start_date === date);
    const dayTasks = plannerTasks.filter(p => p.date?.startsWith(date));
    const dayHabits = habitLogs.filter(h => h.date?.startsWith(date));
    const dayExpenses = financeTransactions.filter(f => f.date?.startsWith(date) && f.type === 'expense');
    const totalExpense = dayExpenses.reduce((sum, f) => sum + Number(f.amount || 0), 0);

    const displayDate = useMemo(() => {
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
    }, [date, isIndo]);

    const changeDay = (offset: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + offset);
        onDateChange(d.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6">
            
            {/* Day Header Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => changeDay(-1)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition active:scale-95"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div>
                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider block">
                            {isIndo ? 'Tampilan Harian' : 'Day View'}
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-white capitalize">
                            {displayDate}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => changeDay(1)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition active:scale-95"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => onOpenEventModal(date)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 transition active:scale-95"
                >
                    <Plus size={14} strokeWidth={3} />
                    <span>{isIndo ? 'Tambah Agenda Hari Ini' : 'Add Day Event'}</span>
                </button>
            </div>

            {/* Main Content: 2 Columns (Left: 24h Timeline, Right: Life OS Command Center) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: 24-Hour Timeline Grid (8 cols) */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Clock size={14} className="text-indigo-600" />
                            <span>{isIndo ? 'Jadwal Blok Waktu (Time-Block Grid)' : 'Hourly Time-Block Grid'}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                            {dayEvents.length} {isIndo ? 'Agenda terdaftar' : 'Events registered'}
                        </span>
                    </div>

                    <div className="overflow-y-auto max-h-[640px] p-4 relative">
                        <div 
                            className="relative border-l border-slate-200 dark:border-slate-800 ml-16"
                            style={{ height: `${(END_HOUR - START_HOUR + 1) * HOUR_HEIGHT}px` }}
                        >
                            {/* Hour Markers */}
                            {hours.map((h, i) => (
                                <div key={h} className="absolute left-0 right-0 border-b border-slate-100 dark:border-slate-800/60 flex items-center" style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}>
                                    <span className="absolute -left-14 text-xs font-mono font-bold text-slate-400 -translate-y-1/2">
                                        {h}
                                    </span>
                                    <div 
                                        onClick={() => onOpenEventModal(date, h)}
                                        className="w-full h-full hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors"
                                        title={`${isIndo ? 'Klik untuk tambah agenda jam' : 'Click to add event at'} ${h}`}
                                    />
                                </div>
                            ))}

                            {/* Render Event Blocks */}
                            {dayEvents.map((ev) => {
                                const [sh, sm] = (ev.start_time || '09:00').split(':').map(Number);
                                const eventMinutes = sh * 60 + (sm || 0);
                                const topOffset = Math.max(0, ((eventMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT);
                                const duration = ev.is_all_day ? 60 : getEventDurationMinutes(ev.start_time, ev.end_time);
                                const heightPx = Math.max(32, (duration / 60) * HOUR_HEIGHT - 6);
                                const meeting = detectMeetingPlatform(ev.meeting_url || ev.description);

                                return (
                                    <div
                                        key={ev.id}
                                        onClick={() => onEditEvent(ev)}
                                        className="absolute left-3 right-3 rounded-2xl p-3 z-10 shadow-lg border overflow-hidden flex items-start justify-between transition-all hover:scale-[1.01] hover:z-20 cursor-pointer"
                                        style={{
                                            top: `${topOffset}px`,
                                            height: `${heightPx}px`,
                                            backgroundColor: `${ev.color || '#4f46e5'}18`,
                                            borderColor: `${ev.color || '#4f46e5'}60`,
                                            borderLeftWidth: '5px',
                                            borderLeftColor: ev.color || '#4f46e5'
                                        }}
                                    >
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-black text-sm text-slate-800 dark:text-white truncate">
                                                    {ev.title}
                                                </h4>
                                                {meeting.platform && (
                                                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-[10px] font-black flex items-center gap-1">
                                                        <Video size={10} />
                                                        <span>{meeting.name}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                                <span>{ev.start_time} - {ev.end_time || ''}</span>
                                                {ev.location && <span className="opacity-70">📍 {ev.location}</span>}
                                            </p>
                                            {ev.description && (
                                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 bg-white/50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    {ev.description}
                                                </p>
                                            )}
                                        </div>

                                        {meeting.url && (
                                            <a
                                                href={meeting.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition shrink-0"
                                            >
                                                <span>Join Call</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Life OS Command Center for Today (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    
                    {/* Planner Tasks Card with 1-Click Time-Block */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <CheckSquare size={14} className="text-blue-600" />
                                <span>{isIndo ? 'Tugas Planner Hari Ini' : 'Today\'s Planner Tasks'}</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                                {dayTasks.filter(p => p.isCompleted).length}/{dayTasks.length}
                            </span>
                        </div>

                        {dayTasks.length === 0 ? (
                            <p className="text-xs font-medium text-slate-400 py-3 text-center">
                                {isIndo ? 'Tidak ada tugas planner untuk tanggal ini.' : 'No tasks scheduled for this date.'}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {dayTasks.map((t, idx) => (
                                    <div 
                                        key={t.id || idx}
                                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${t.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {t.title}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onScheduleTaskToCalendar(t)}
                                            className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-[10px] font-black transition flex items-center gap-1 shrink-0"
                                            title={isIndo ? 'Jadwalkan ke slot jam kalender' : 'Schedule to calendar'}
                                        >
                                            <Zap size={10} />
                                            <span>{isIndo ? 'Plot Jam' : 'Time-Block'}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Habits Completed */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <Leaf size={14} className="text-emerald-600" />
                                <span>{isIndo ? 'Kebiasaan Tuntas' : 'Habits Checked'}</span>
                            </span>
                            <span className="text-xs font-black text-emerald-600 font-mono">
                                {dayHabits.length} {isIndo ? 'item' : 'done'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {dayHabits.length > 0 
                                ? (isIndo ? `Kamu telah menyelesaikan ${dayHabits.length} kebiasaan harian!` : `You completed ${dayHabits.length} habits today!`)
                                : (isIndo ? 'Belum ada kebiasaan yang dicentang hari ini.' : 'No habits logged yet for this date.')}
                        </p>
                    </div>

                    {/* Finance Expense Total */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <DollarSign size={14} className="text-rose-600" />
                                <span>{isIndo ? 'Pengeluaran Hari Ini' : 'Today\'s Expenses'}</span>
                            </span>
                            <span className="text-xs font-black text-rose-600 font-mono">
                                Rp {totalExpense.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            {dayExpenses.length} {isIndo ? 'transaksi pengeluaran tercatat' : 'expense transactions recorded'}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}
