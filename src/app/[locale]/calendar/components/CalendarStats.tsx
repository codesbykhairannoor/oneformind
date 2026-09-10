'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Clock, Video, Zap, AlertTriangle, 
    Download, Sparkles, Calendar as CalendarIcon, CheckCircle2 
} from 'lucide-react';
import { TimeAllocationStats } from '../lib/calendarAnalytics';

interface CalendarStatsProps {
    stats: TimeAllocationStats;
    onExportIcs: () => void;
    onOpenQuickAdd?: () => void;
}

export default function CalendarStats({
    stats,
    onExportIcs,
    onOpenQuickAdd
}: CalendarStatsProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    return (
        <div className="space-y-4">
            
            {/* Conflict Warning Banner if overlaps exist */}
            {stats.conflictCount > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-800 dark:text-amber-300">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                            <p className="text-xs font-black">
                                {isIndo 
                                    ? `Terdeteksi ${stats.conflictCount} Jadwal Bentrok!` 
                                    : `Detected ${stats.conflictCount} Overlapping Schedule Conflicts!`}
                            </p>
                            <p className="text-[11px] font-medium opacity-80">
                                {isIndo 
                                    ? 'Ada agenda yang dijadwalkan pada jam yang bersamaan. Periksa tab Week atau Day untuk merapikannya.' 
                                    : 'Some events are booked at the exact same hour. Check Week or Day view to adjust.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Total Scheduled Hours */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            {isIndo ? 'Total Terjadwal' : 'Total Scheduled'}
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Clock size={14} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white font-mono">
                            {stats.totalScheduledHours}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                            {isIndo ? 'Jam' : 'Hours'}
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                        {stats.totalEventsCount} {isIndo ? 'Agenda terdaftar' : 'Events registered'}
                    </p>
                </div>

                {/* 2. Deep Work vs Focus Time */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            {isIndo ? 'Fokus & Deep Work' : 'Focus & Deep Work'}
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                            <Zap size={14} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 font-mono">
                            {stats.deepWorkRatio}%
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                            {isIndo ? 'Porsi Waktu' : 'Share'}
                        </span>
                    </div>
                    {/* Mini Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                            className="bg-sky-500 h-full rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, stats.deepWorkRatio)}%` }} 
                        />
                    </div>
                </div>

                {/* 3. Meeting & Communication Load */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            {isIndo ? 'Beban Rapat' : 'Meeting Load'}
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Video size={14} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                            {stats.meetingRatio}%
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                            {isIndo ? 'Porsi Waktu' : 'Share'}
                        </span>
                    </div>
                    {/* Mini Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-700" 
                            style={{ width: `${Math.min(100, stats.meetingRatio)}%` }} 
                        />
                    </div>
                </div>

                {/* 4. Quick Actions / .ICS Export */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                            {isIndo ? 'Sinkronisasi Universal' : 'Universal Sync'}
                        </span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            Google, Apple & Outlook
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onExportIcs}
                        className="mt-2 w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                        title={isIndo ? 'Unduh berkas .ICS untuk kalender HP' : 'Download .ICS file'}
                    >
                        <Download size={13} />
                        <span>{isIndo ? 'Ekspor Berkas .ICS' : 'Export .ICS Calendar'}</span>
                    </button>
                </div>

            </div>

        </div>
    );
}
