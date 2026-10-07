'use client';

import { useTranslations } from 'next-intl';

export default function LandingFriction() {
    const t = useTranslations();

    const frictionApps = [
        { icon: '📅', name: 'fric_app_1', sub: 'Tasks & Planner' },
        { icon: '🌱', name: 'fric_app_2', sub: 'Habit Tracker' },
        { icon: '💰', name: 'fric_app_3', sub: 'Spreadsheet Finance' },
        { icon: '📔', name: 'fric_app_4', sub: 'Digital Journal' },
        { icon: '🎯', name: 'fric_app_5', sub: 'Goal Setting' },
        { icon: '💼', name: 'fric_app_6', sub: 'Job Applications' }
    ];

    return (
        <section className="py-28 sm:py-36 bg-slate-950 relative overflow-hidden border-t border-slate-900">
            {/* Ambient Lighting */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#4f46e5_0,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left: Problem Agitation */}
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs mb-6 border border-rose-500/20 tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                            {t('fric_badge')}
                        </div>

                        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-white mb-6 font-black tracking-[-0.03em] leading-[1.12]">
                            {t('fric_title')}
                        </h2>

                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 font-normal max-w-2xl">
                            {t('fric_desc')}
                        </p>

                        {/* The Fragmented Apps Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                            {frictionApps.map((app, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 group hover:border-slate-700 hover:bg-slate-900 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{app.icon}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono">App #{idx + 1}</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-200">{t(app.name)}</div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">{app.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Chaos Callout Banner */}
                        <div className="mt-4 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">{t('fric_chaos')}</div>
                                    <div className="text-xs text-rose-400/80 mt-0.5">{t('fric_fragmented_data')}</div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-rose-400 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 whitespace-nowrap">
                                45 Menit Terbuang/Hari
                            </span>
                        </div>
                    </div>

                    {/* Right: The Tranvas Unified Solution Card */}
                    <div className="lg:col-span-5 relative">
                        <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-2xl opacity-20 transition duration-700" />
                        
                        <div className="relative bg-slate-900 p-7 sm:p-9 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/30">
                                    ⚡
                                </div>
                                <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                                    THE UNIFIED CURE
                                </span>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                    {t('fric_solution_title')}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {t('fric_solution_desc')}
                                </p>
                            </div>

                            {/* Solution Metrics Bento */}
                            <div className="space-y-3 pt-2">
                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-300 font-medium">1 Akun Terpadu</span>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        Menggantikan 6 Apps
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-300 font-medium">Sinkronisasi Otomatis</span>
                                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                        100% Real-Time
                                    </span>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-300 font-medium">Hemat Pengeluaran</span>
                                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                        ~Rp 450.000 / Bulan
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
