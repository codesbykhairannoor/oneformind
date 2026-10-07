'use client';

import { useTranslations } from 'next-intl';

export default function LandingPreview() {
    const t = useTranslations();

    return (
        <section className="py-28 sm:py-36 bg-white relative overflow-hidden border-t border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Visual: High-Fidelity Life OS Workspace Frame */}
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-200 via-purple-100 to-emerald-100 rounded-3xl blur-3xl opacity-50 -z-10"></div>
                        
                        <div 
                            className="relative bg-slate-900 rounded-3xl p-1 shadow-[0_30px_80px_-15px_rgba(15,23,42,0.35)] border border-slate-800 overflow-hidden text-left" 
                            role="img" 
                            aria-label="Tranvas Dashboard Preview: Antarmuka terpadu habit tracking, manajemen keuangan, dan eksekusi task harian."
                        >
                            {/* Window Topbar */}
                            <div className="w-full h-9 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between px-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                                </div>
                                <span className="text-[11px] font-mono text-slate-400">tranvas.app/workspace/dashboard</span>
                                <span className="text-[10px] text-emerald-400 font-medium">● Live Sync</span>
                            </div>

                            {/* App Content */}
                            <div className="p-5 sm:p-7 grid grid-cols-12 gap-4">
                                
                                {/* Mini Sidebar */}
                                <div className="col-span-4 sm:col-span-3 space-y-1.5 text-xs font-semibold text-slate-400">
                                    <div className="p-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2 shadow-sm">
                                        <span>📋</span>
                                        <span className="hidden sm:inline">Planner</span>
                                    </div>
                                    <div className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                                        <span>🌱</span>
                                        <span className="hidden sm:inline">Habits</span>
                                    </div>
                                    <div className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                                        <span>💰</span>
                                        <span className="hidden sm:inline">Finance</span>
                                    </div>
                                    <div className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                                        <span>🎯</span>
                                        <span className="hidden sm:inline">Goals</span>
                                    </div>
                                    <div className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center gap-2">
                                        <span>✍️</span>
                                        <span className="hidden sm:inline">Journal</span>
                                    </div>
                                </div>

                                {/* Main Active Panel */}
                                <div className="col-span-8 sm:col-span-9 space-y-3.5">
                                    {/* Focus Banner */}
                                    <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex flex-col justify-between">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="text-indigo-300 font-bold uppercase tracking-wider">Deep Work Block</span>
                                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">In Progress</span>
                                        </div>
                                        <div className="text-sm font-bold text-white mt-1">
                                            Arsitektur Sistem & Core Algorithm v2.4
                                        </div>
                                    </div>

                                    {/* 2 Side-by-side Mini Widgets */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Habit widget */}
                                        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="flex items-center justify-between text-xs mb-2">
                                                <span className="text-slate-400 font-medium">Habit Streak</span>
                                                <span className="text-emerald-400 font-bold">🔥 24 Hari</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {Array.from({ length: 7 }).map((_, i) => (
                                                    <div key={i} className="flex-1 h-3 rounded-[3px] bg-emerald-500"></div>
                                                ))}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-2 font-mono">100% Konsistensi Pekan Ini</div>
                                        </div>

                                        {/* Finance widget */}
                                        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-slate-400 font-medium">Saldo Bersih</span>
                                                <span className="text-amber-400 font-bold">On-Track</span>
                                            </div>
                                            <div className="text-base font-black text-white">Rp 24.850.000</div>
                                            <div className="h-1.5 w-full bg-slate-700 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-emerald-400 w-[78%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Right: Copywriting & Device Badges */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-wider border border-indigo-200/80 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                            {t('vsn_badge')}
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 font-black tracking-[-0.035em] leading-[1.12]">
                            {t('vsn_title')}
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed mb-10 max-w-xl">
                            {t('vsn_desc')}
                        </p>
                        
                        {/* Device & Platform Badges */}
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-700 shadow-sm">
                                <span>💻</span>
                                <span>Desktop Web App</span>
                            </div>
                            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-700 shadow-sm">
                                <span>📱</span>
                                <span>Mobile Browser Ready</span>
                            </div>
                            <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-slate-700 shadow-sm">
                                <span>⚡</span>
                                <span>Zero Install • Langsung Pakai</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
