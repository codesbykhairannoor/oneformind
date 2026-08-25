'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export interface JobStatsData {
    total: number;
    wishlist?: number;
    applied?: number;
    interview?: number;
    offer?: number;
    rejected?: number;
    accepted?: number;
}

interface JobStatsProps {
    stats: JobStatsData;
}

export default function JobStats({ stats }: JobStatsProps) {
    const t = useTranslations();

    const statCards = [
        { key: 'total' as const, labelKey: 'job_status_all', fallback: 'Semua', icon: '💼', colorBg: 'bg-slate-50 dark:bg-slate-500/10', colorText: 'text-slate-600 dark:text-slate-400' },
        { key: 'applied' as const, labelKey: 'job_status_applied', fallback: 'Dilamar', icon: '🚀', colorBg: 'bg-blue-50 dark:bg-blue-500/10', colorText: 'text-blue-600 dark:text-blue-400' },
        { key: 'interview' as const, labelKey: 'job_status_interview', fallback: 'Interview', icon: '🎯', colorBg: 'bg-purple-50 dark:bg-purple-500/10', colorText: 'text-purple-600 dark:text-purple-400' },
        { key: 'offer' as const, labelKey: 'job_status_offer', fallback: 'Dapat Offering', icon: '🎉', colorBg: 'bg-emerald-50 dark:bg-emerald-500/10', colorText: 'text-emerald-600 dark:text-emerald-400' },
    ];

    return (
        // 1:1 from JobStats.vue line 12-29
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8 transition-all">
            {statCards.map((stat) => (
                <div 
                    key={stat.key} 
                    className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-3xl shrink-0 transition-colors duration-500 ${stat.colorBg} ${stat.colorText}`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1 transition-colors duration-500">
                            {t(stat.labelKey) || stat.fallback}
                        </p>
                        <h3 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white leading-none transition-colors duration-500">
                            {stats[stat.key] || 0}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
