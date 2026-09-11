'use client';

import React from 'react';
import { Sparkles, Zap, Calendar, GraduationCap, CheckCircle2 } from 'lucide-react';

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

    const firstName = user?.name ? user.name.split(' ')[0] : 'User';

    return (
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                        <Calendar size={12} />
                        {synergy.date_formatted}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Sparkles size={11} />
                        {t('dash_core_access') || 'Ekosistem Sinkron'}
                    </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                    {t(getGreetingKey() as any) || 'Selamat Datang'},{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                        {firstName}
                    </span>
                </h1>

                <p className="mt-2 max-w-xl text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('dash_hero_subtitle') || 'Jadikan hari ini mahakarya. Berikut adalah rangkuman sinergi rutinitas, tugas, akademik, dan keuanganmu hari ini.'}
                </p>
            </div>

            {/* Synergy Score Hub */}
            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90">
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-slate-100 dark:text-slate-800"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                            className="text-indigo-600 transition-all duration-1000 dark:text-indigo-400"
                        />
                    </svg>
                    <span className="text-lg font-black tabular-nums text-slate-900 dark:text-white">{overallScore}%</span>
                </div>

                <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {t('dash_synergy_today') || 'Synergy Pulse'}
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {overallScore >= 80 ? 'Keseimbangan Prima' : overallScore >= 50 ? 'Irama Stabil' : 'Perlu Dorongan'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                        {synergy.habits.completed}/{synergy.habits.total} Habit &bull; {synergy.planner.completed}/{synergy.planner.total} Tugas
                    </p>
                </div>
            </div>
        </header>
    );
}
