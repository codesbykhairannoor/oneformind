'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function LandingFriction() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const frictionApps = [
        { icon: '📅', name: 'fric_app_1', sub: isId ? 'Tasks & Kalender Harian' : 'Daily Tasks & Planner' },
        { icon: '🌱', name: 'fric_app_2', sub: isId ? 'Pelacak Kebiasaan' : 'Habit Tracker' },
        { icon: '💰', name: 'fric_app_3', sub: isId ? 'Spreadsheet Finansial' : 'Spreadsheet Finance' },
        { icon: '📔', name: 'fric_app_4', sub: isId ? 'Jurnal Refleksi Digital' : 'Digital Journal' },
        { icon: '🎯', name: 'fric_app_5', sub: isId ? 'Penetapan Target & Sasaran' : 'Goal Setting & Milestones' },
        { icon: '💼', name: 'fric_app_6', sub: isId ? 'Pelacak Lamaran Kerja' : 'Job Applications Pipeline' }
    ];

    return (
        <section className="py-20 sm:py-28 lg:py-36 bg-slate-950 relative overflow-hidden border-t border-slate-900">
            {/* Ambient Lighting */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#4f46e5_0,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    
                    {/* Left: Problem Agitation */}
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs sm:text-sm mb-6 border border-rose-500/20 tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                            {t('fric_badge')}
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 font-black tracking-tight leading-[1.1]">
                            {t('fric_title')}
                        </h2>

                        <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 font-normal max-w-2xl">
                            {t('fric_desc')}
                        </p>

                        {/* The Fragmented Apps Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                            {frictionApps.map((app, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 group hover:border-slate-600 hover:bg-slate-900/90 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{app.icon}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono group-hover:text-slate-200 transition-colors">App #{idx + 1}</span>
                                    </div>
                                    <div className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-white transition-colors">{t(app.name)}</div>
                                    <div className="text-xs text-slate-400 mt-1">{app.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Chaos Callout Banner */}
                        <div className="mt-4 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-rose-500/40 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-xl shrink-0 animate-bounce-slow">⚠️</span>
                                <div>
                                    <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">{t('fric_chaos')}</div>
                                    <div className="text-xs text-rose-400/90 mt-0.5">{t('fric_fragmented_data')}</div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-rose-300 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 whitespace-nowrap self-start sm:self-auto">
                                {isId ? '45 Menit Terbuang/Hari' : '45 Mins Wasted/Day'}
                            </span>
                        </div>
                    </div>

                    {/* Right: The Tranvas Unified Solution Card */}
                    <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                        <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-2xl opacity-25 animate-pulse-glow" />
                        
                        <div className="relative bg-slate-900 p-6 sm:p-9 rounded-3xl border border-indigo-500/40 shadow-2xl space-y-5 sm:space-y-6 hover:shadow-[0_25px_60px_-15px_rgba(79,70,229,0.35)] transition-all duration-500">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/40">
                                    ⚡
                                </div>
                                <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                                    {isId ? 'SOLUSI TERPADU' : 'THE UNIFIED CURE'}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                                    {t('fric_solution_title')}
                                </h3>
                                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                    {t('fric_solution_desc')}
                                </p>
                            </div>

                            {/* Solution Metrics Bento */}
                            <div className="space-y-3 pt-2">
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors">
                                    <span className="text-xs sm:text-sm text-slate-300 font-semibold">
                                        {isId ? '1 Akun Terpadu' : '1 Unified Account'}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                                        {isId ? 'Menggantikan 6 Apps' : 'Replaces 6 Apps'}
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors">
                                    <span className="text-xs sm:text-sm text-slate-300 font-semibold">
                                        {isId ? 'Sinkronisasi Otomatis' : 'Automated Cloud Sync'}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                                        100% Real-Time
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors">
                                    <span className="text-xs sm:text-sm text-slate-300 font-semibold">
                                        {isId ? 'Hemat Pengeluaran' : 'Monthly Software Savings'}
                                    </span>
                                    <span className="text-xs sm:text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                                        {isId ? '~Rp 450.000 / Bulan' : '~$30 – $50 / Month'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
