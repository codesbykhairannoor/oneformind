'use client';

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { useLocale } from 'next-intl';
import { 
    Briefcase, Send, Target, Award, CheckCircle2, 
    Calendar, TrendingUp, DollarSign, Clock, AlertCircle,
    ChevronDown, ChevronUp, Sparkles, BarChart2, Leaf
} from 'lucide-react';
import { JobFunnelStats } from '../lib/jobAnalytics';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface JobStatsProps {
    stats: JobFunnelStats;
    onOpenOfferComparison?: () => void;
}

export default function JobStats({ stats, onOpenOfferComparison }: JobStatsProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

    const [isExpanded, setIsExpanded] = useState(false);

    // Cross-Module Life OS: Job Search Habit Consistency
    const { data: rawHabits } = useSWR('/api/habits', fetcher);
    const jobHabitStats = useMemo(() => {
        if (!rawHabits || !Array.isArray(rawHabits)) return null;
        const jobHabits = rawHabits.filter((h: any) => {
            const name = (h.name || '').toLowerCase();
            return name.includes('lamar') || name.includes('apply') || name.includes('job') || 
                   name.includes('karir') || name.includes('career') || name.includes('kerja');
        });
        if (jobHabits.length === 0) return null;

        let totalTarget = 0;
        let totalCompleted = 0;
        jobHabits.forEach((h: any) => {
            const target = h.monthlyTarget || 30;
            const completed = (h.logs || []).filter((l: any) => l.status === 'completed').length;
            totalTarget += target;
            totalCompleted += completed;
        });

        const percent = totalTarget > 0 ? Math.min(100, Math.round((totalCompleted / totalTarget) * 100)) : 0;
        return {
            percent,
            completed: totalCompleted,
            target: totalTarget
        };
    }, [rawHabits]);

    const formatNextInterviewTime = (dateStr?: string) => {
        if (!dateStr) return null;
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString(isIndo ? 'id-ID' : 'en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-3 transition-all duration-300">
            
            {/* 1. ULTRA-COMPACT METRIC RIBBON */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                    {/* Pipeline Stat */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
                            <Briefcase size={14} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {isIndo ? 'Total Pipeline' : 'Total Pipeline'}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black font-mono text-slate-800 dark:text-white">{stats.total}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">({stats.applied} {isIndo ? 'Terkirim' : 'Sent'} • {stats.wishlist} {isIndo ? 'Incaran' : 'Wishlist'})</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

                    {/* Interview Rate */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Target size={14} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {isIndo ? 'Screening Rate' : 'Interview Rate'}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black font-mono text-purple-600 dark:text-purple-400">{stats.screeningRate}%</span>
                                <span className="text-[10px] text-slate-400 font-semibold">({stats.interview} {isIndo ? 'Rounds' : 'Rounds'})</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

                    {/* Offer Rate */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Award size={14} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {isIndo ? 'Tawaran Kerja' : 'Job Offers'}
                            </span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">{stats.offer + stats.accepted}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">({stats.offerRate}%)</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden xl:block w-px h-6 bg-slate-200 dark:bg-slate-800" />

                    {/* Next Interview */}
                    <div className="hidden xl:flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Calendar size={14} />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {isIndo ? 'Interview Terdekat' : 'Next Interview'}
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[160px] block">
                                {stats.nextInterview ? stats.nextInterview.company : (isIndo ? 'Belum Ada Jadwal' : 'Calm Waters')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {jobHabitStats && (
                        <div 
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black"
                            title={isIndo ? 'Konsistensi kebiasaan melamar kerja bulan ini' : 'Job application habit consistency'}
                        >
                            <Leaf size={11} className="text-emerald-500" />
                            <span>Habit Melamar: {jobHabitStats.percent}% ({jobHabitStats.completed}/{jobHabitStats.target}d)</span>
                        </div>
                    )}

                    {/* Expand / Collapse Full Funnel Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                    >
                        <BarChart2 size={13} />
                        <span className="text-[11px]">{isExpanded ? (isIndo ? 'Tutup Detail' : 'Collapse') : (isIndo ? 'Detail Metrik' : 'Expand Stats')}</span>
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                </div>
            </div>

            {/* 2. EXPANDED FUNNEL CARDS (OPTIONAL VIEW) */}
            {isExpanded && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 transition-all animate-in fade-in duration-300">
                    
                    {/* Card 1: Total Lamaran & Pipeline */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {isIndo ? 'Total Peluang' : 'Total Pipeline'}
                            </span>
                            <Briefcase size={16} className="text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-none font-mono">
                                {stats.total}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-500 mt-1.5">
                                📤 {stats.applied} {isIndo ? 'Terkirim' : 'Sent'} • 💭 {stats.wishlist} {isIndo ? 'Incaran' : 'Wishlist'}
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Interview Screening Pass Rate */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {isIndo ? 'Lolos Screening' : 'Interview Rate'}
                            </span>
                            <Target size={16} className="text-purple-500" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1.5">
                                <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 leading-none font-mono">
                                    {stats.screeningRate}%
                                </h3>
                                <span className="text-[10px] text-slate-400">({stats.interview} rounds)</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                                <div 
                                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.min(100, stats.screeningRate)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Offer Conversion Rate */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {isIndo ? 'Tingkat Tawaran' : 'Offer Rate'}
                            </span>
                            <Award size={16} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1.5">
                                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none font-mono">
                                    {stats.offer + stats.accepted}
                                </h3>
                                <span className="text-[10px] text-slate-400">({stats.offerRate}%)</span>
                            </div>
                            {stats.avgOfferSalaryIdr ? (
                                <p className="text-[10px] font-bold text-emerald-600 mt-1 truncate">
                                    💰 Avg: Rp {(stats.avgOfferSalaryIdr / 1000000).toFixed(1)} Jt/bln
                                </p>
                            ) : (
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {isIndo ? 'Menunggu Penawaran' : 'Awaiting offers'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Card 4: Upcoming Interview */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {isIndo ? 'Jadwal Terdekat' : 'Next Interview'}
                            </span>
                            <Calendar size={16} className="text-amber-500" />
                        </div>
                        <div>
                            {stats.nextInterview ? (
                                <div>
                                    <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
                                        {stats.nextInterview.company}
                                    </h4>
                                    <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                                        <Clock size={10} />
                                        {formatNextInterviewTime(stats.nextInterview.scheduled_at)}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white">
                                        {isIndo ? 'Siap Melamar' : 'Calm Waters'}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        {isIndo ? 'Tidak ada jadwal terdekat' : 'No upcoming interviews'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
}
