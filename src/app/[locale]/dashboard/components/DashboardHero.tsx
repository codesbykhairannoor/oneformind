'use client';

import React from 'react';

interface DashboardHeroProps {
    user: any;
    synergy: any;
    t: any;
    overallScore: number;
}

export default function DashboardHero({ user, synergy, t, overallScore }: DashboardHeroProps) {
    const getGreetingKey = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'dash_greet_morning';
        if (hour < 15) return 'dash_greet_afternoon';
        if (hour < 19) return 'dash_greet_evening';
        return 'dash_greet_night';
    };

    return (
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {synergy.date_formatted}
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                    {t(getGreetingKey() as any) || 'Selamat Datang'},{' '}
                    <span className="text-indigo-600 dark:text-indigo-400">{user.name.split(' ')[0]}</span>
                </h1>
                <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    {t('dash_today_subtitle') || 'Berikut ringkasan performa dan irama produktivitas Anda hari ini.'}
                </p>
            </div>

            {/* Synergy Score Circle */}
            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-900/90">
                <div className="relative flex h-14 w-14 items-center justify-center md:h-16 md:w-16">
                    <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                            className="text-slate-100 dark:text-slate-800"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="264"
                            strokeDashoffset={264 - (264 * overallScore) / 100}
                            className="text-indigo-500 transition-all duration-1000 dark:text-indigo-400"
                        />
                    </svg>
                    <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white md:text-lg">{overallScore}%</span>
                </div>
                <div className="min-w-0 pr-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {t('dash_synergy') || 'Synergy Pulse'}
                    </p>
                    <p className="text-xs font-medium leading-snug text-slate-600 dark:text-slate-300">
                        {t('dash_pulse_desc') || 'Keseimbangan seluruh modul kehidupan.'}
                    </p>
                </div>
            </div>
        </header>
    );
}
