'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { 
    Briefcase, Send, Target, Award, CheckCircle2, 
    Calendar, TrendingUp, DollarSign, Clock, AlertCircle
} from 'lucide-react';
import { JobFunnelStats } from '../lib/jobAnalytics';

interface JobStatsProps {
    stats: JobFunnelStats;
    onOpenOfferComparison?: () => void;
}

export default function JobStats({ stats, onOpenOfferComparison }: JobStatsProps) {
    const locale = useLocale();
    const isIndo = locale === 'id';

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8 transition-all">
            
            {/* Card 1: Total Lamaran & Pipeline */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {isIndo ? 'Total Peluang' : 'Total Pipeline'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-base">
                        <Briefcase size={18} />
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-none font-mono">
                        {stats.total}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5 flex-wrap">
                        <span>📤 {stats.applied} {isIndo ? 'Terkirim' : 'Sent'}</span>
                        <span>•</span>
                        <span>💭 {stats.wishlist} {isIndo ? 'Incaran' : 'Wishlist'}</span>
                    </p>
                </div>
            </div>

            {/* Card 2: Interview Screening Pass Rate */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {isIndo ? 'Lolos Screening' : 'Interview Rate'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-base">
                        <Target size={18} />
                    </div>
                </div>

                <div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 leading-none font-mono">
                            {stats.screeningRate}%
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400">
                            ({stats.interview} {isIndo ? 'Tahapan' : 'Rounds'})
                        </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, stats.screeningRate)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card 3: Offer Conversion Rate & Gaji */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {isIndo ? 'Tingkat Tawaran' : 'Offer Rate'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base">
                        <Award size={18} />
                    </div>
                </div>

                <div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none font-mono">
                            {stats.offer + stats.accepted} <span className="text-xs font-normal text-slate-400">({stats.offerRate}%)</span>
                        </h3>
                    </div>

                    {stats.avgOfferSalaryIdr ? (
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 truncate">
                            💰 Rata-rata: Rp {(stats.avgOfferSalaryIdr / 1000000).toFixed(1)} Jt/bln
                        </p>
                    ) : stats.avgOfferSalaryUsd ? (
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 truncate">
                            💰 Avg: ${(stats.avgOfferSalaryUsd / 1000).toFixed(1)}k/yr
                        </p>
                    ) : (
                        <p className="text-[10px] font-bold text-slate-400 mt-2">
                            {isIndo ? 'Menunggu Penawaran Kerja' : 'Awaiting job offers'}
                        </p>
                    )}
                </div>
            </div>

            {/* Card 4: Upcoming Interview / Urgent Reminder */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {isIndo ? 'Jadwal Terdekat' : 'Next Interview'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base">
                        <Calendar size={18} />
                    </div>
                </div>

                <div>
                    {stats.nextInterview ? (
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">
                                {stats.nextInterview.company}
                            </h4>
                            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Clock size={11} />
                                {formatNextInterviewTime(stats.nextInterview.scheduled_at)}
                            </p>
                        </div>
                    ) : stats.overdueFollowUpsCount > 0 ? (
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-black text-rose-500 flex items-center gap-1">
                                <AlertCircle size={13} />
                                {stats.overdueFollowUpsCount} {isIndo ? 'Perlu Follow-Up' : 'Need Follow-Up'}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                                {isIndo ? 'Waktunya kirim kabar ke HR' : 'Send follow-up email'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-base font-black text-slate-800 dark:text-white">
                                {isIndo ? 'Siap Melamar' : 'Calm Waters'}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1">
                                {isIndo ? 'Tidak ada jadwal wawancara terdekat' : 'No upcoming interviews'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
