'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

type TabKey = 'planner' | 'habits' | 'finance' | 'goals' | 'journal' | 'jobs' | 'study' | 'calendar';

interface TabItem {
    id: TabKey;
    label: string;
    icon: string;
    tagline: string;
}

const TABS: TabItem[] = [
    { id: 'planner', label: 'Planner', icon: '📋', tagline: 'Daily Task Execution & Timeblock' },
    { id: 'habits', label: 'Habits', icon: '🌱', tagline: '28-Day Consistency & Streak Heatmap' },
    { id: 'finance', label: 'Finance', icon: '💰', tagline: 'Cashflow Tracking & Smart Budgeting' },
    { id: 'goals', label: 'Goals', icon: '🎯', tagline: 'WOOP Psychological Milestone Cascading' },
    { id: 'journal', label: 'Journal', icon: '✍️', tagline: 'Reflective Clarity & Cognitive Unwind' },
    { id: 'jobs', label: 'Jobs', icon: '💼', tagline: 'Career Pipeline & Application Tracker' },
    { id: 'study', label: 'Study', icon: '📚', tagline: 'Focus Timer & Knowledge Retention' },
    { id: 'calendar', label: 'Calendar', icon: '🗓️', tagline: 'Unified Synchronized Schedule' },
];

export default function LandingHero() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState<TabKey>('planner');
    const [isPaused, setIsPaused] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Auto-cycle through tabs every 5 seconds if not hovered/interacted
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveTab((current) => {
                const currentIndex = TABS.findIndex((tab) => tab.id === current);
                const nextIndex = (currentIndex + 1) % TABS.length;
                return TABS[nextIndex].id;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const handleTabClick = (tabId: TabKey) => {
        setActiveTab(tabId);
        setIsPaused(true);
        // Resume autoplay after 15 seconds of inactivity
        const timer = setTimeout(() => setIsPaused(false), 15000);
        return () => clearTimeout(timer);
    };

    const scrollToCanvas = () => {
        canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <header className="relative pt-28 pb-32 lg:pt-36 lg:pb-48 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Ambient High-End Radial Lighting & Grid Mesh */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[750px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.14),rgba(255,255,255,0))] pointer-events-none -z-10" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-emerald-500/5 blur-3xl pointer-events-none -z-10 rounded-full" />
            
            {/* Subtle Hardware Accelerated Background Grid */}
            <div 
                className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-70" 
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                
                {/* 1. Micro-Badge Announcement Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 text-indigo-700 font-bold text-xs mb-8 tracking-wide shadow-sm hover:bg-indigo-100/70 transition-colors">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <span>{t('hero_premium_badge')}</span>
                </div>
                
                {/* 2. Authority H1 Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl mb-8 tracking-[-0.035em] text-slate-900 font-black leading-[1.08] max-w-5xl mx-auto">
                    {t('hero_premium_title_1')}{' '}
                    <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                        {t('hero_premium_title_2')}
                    </span>
                </h1>
                
                {/* 3. Problem-Solving Subheading */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto font-normal">
                    {t('hero_premium_desc')}
                </p>
                
                {/* 4. High-Converting Dual Action CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-md mx-auto sm:max-w-none">
                    <Link 
                        href="/register" 
                        onClick={() => trackCTAClick('hero_primary', 'Start Free Today', '/register')}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                        <span>{t('hero_premium_cta_primary')}</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    
                    <button 
                        type="button"
                        onClick={() => {
                            trackCTAClick('hero_secondary', 'Explore 8 Modules', '#interactive-stage');
                            scrollToCanvas();
                        }}
                        className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 px-8 py-4 rounded-xl font-bold text-base shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>{t('hero_premium_cta_secondary')}</span>
                        <span className="text-sm text-slate-400">↓</span>
                    </button>
                </div>

                {/* 5. Frictionless Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 sm:gap-x-8 text-xs font-semibold text-slate-500 max-w-2xl mx-auto mb-16 sm:mb-20">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('hero_trust_badge_1')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('hero_trust_badge_2')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('hero_trust_badge_3')}</span>
                    </div>
                </div>

                {/* 6. THE CENTERPIECE: Interactive Life OS App Stage */}
                <div 
                    id="interactive-stage"
                    ref={canvasRef} 
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="relative max-w-5xl mx-auto text-left"
                >
                    {/* Glowing Aura Behind Window */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-emerald-500/15 rounded-3xl blur-2xl -z-10 opacity-70" />

                    {/* Window Frame */}
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-slate-900 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4)] overflow-hidden">
                        
                        {/* macOS Window Title Bar */}
                        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
                                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
                                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
                            </div>

                            {/* Breadcrumb URL Bar */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
                                <span className="text-slate-500">tranvas.app</span>
                                <span className="text-slate-600">/</span>
                                <span className="text-indigo-400 font-semibold">{activeTab}</span>
                            </div>

                            {/* Live System Indicator */}
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>{t('hero_canvas_synced')}</span>
                            </div>
                        </div>

                        {/* Interactive Tab Switcher Bar */}
                        <div className="px-3 pt-3 pb-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabClick(tab.id)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                                            isActive
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <span className="text-sm">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                        {isActive && (
                                            <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dynamic Live Module Display */}
                        <div className="p-5 sm:p-8 min-h-[360px] sm:min-h-[420px] bg-slate-900 text-slate-100 flex flex-col justify-between">
                            
                            {/* TAB: PLANNER */}
                            {activeTab === 'planner' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Daily Execution Engine</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Target & Timeline Hari Ini</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                4 dari 5 Selesai (80%)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2 space-y-2.5">
                                            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                                                    <span className="text-sm font-semibold text-slate-300 line-through">08:30 • Deep Work: Arsitektur Sistem & Core Algorithm</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">DONE</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                                                    <span className="text-sm font-semibold text-slate-300 line-through">11:00 • Sprint Review & Roadmap Alignment</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">DONE</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md border-2 border-indigo-400 flex items-center justify-center"></span>
                                                    <span className="text-sm font-bold text-white">14:15 • Evaluasi Finansial & Habit Analytics</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-bold animate-pulse">FOCUS NOW</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md border border-slate-600"></span>
                                                    <span className="text-sm font-medium text-slate-400">16:30 • Evening Reflection & Mindful Journaling</span>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">SCHEDULED</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeblock Cadence</div>
                                            <div className="space-y-2 text-xs">
                                                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                                                    <div className="font-bold">08:00 - 12:00</div>
                                                    <div className="text-[11px] opacity-80">Morning Deep Work Flow</div>
                                                </div>
                                                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                                                    <div className="font-bold">14:00 - 17:00</div>
                                                    <div className="text-[11px] opacity-80">Execution & Strategy</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: HABITS */}
                            {activeTab === 'habits' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Habit Matrix & Rewiring</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Konsistensi & Streak 28 Hari</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 flex items-center gap-1">
                                                🔥 24 Hari Streak Aktif
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-3">
                                            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        <span>📖</span> Membaca Literatur 30 Menit
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">24 Hari Streak • Selesai Pagi Hari</div>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">100%</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        <span>💧</span> Olahraga Pagi & Hidrasi 2L
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">18 Hari Streak • Selesai Siang Hari</div>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">100%</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        <span>🧘</span> Refleksi Harian (WOOP)
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">12 Hari Streak • Jadwal Malam</div>
                                                </div>
                                                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">READY</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-between">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">28-Day Consistency Matrix</div>
                                            <div className="grid grid-cols-7 gap-1.5">
                                                {Array.from({ length: 28 }).map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`w-full aspect-square rounded-[5px] transition-colors ${
                                                            i > 24 
                                                                ? 'bg-slate-700/60' 
                                                                : i % 4 === 0 
                                                                ? 'bg-emerald-400 shadow-sm shadow-emerald-500/30' 
                                                                : 'bg-emerald-500'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-[11px] text-slate-400 text-right mt-2 font-mono">Tingkat Penyelesaian: 92.8%</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: FINANCE */}
                            {activeTab === 'finance' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Zero-Based Cashflow Manager</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Ringkasan Saldo & Alokasi Cerdas</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                +18.4% Net Worth MoM
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-xs text-slate-400 font-medium">Saldo Bersih Tersimpan</div>
                                            <div className="text-xl font-black text-white mt-1">Rp 28.450.000</div>
                                            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">↑ On-track target tabungan</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-xs text-slate-400 font-medium">Total Pemasukan Bulan Ini</div>
                                            <div className="text-xl font-black text-indigo-400 mt-1">Rp 35.000.000</div>
                                            <div className="text-[10px] text-slate-400 mt-1">Gaji & Revenue Project</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-xs text-slate-400 font-medium">Pengeluaran Terkendali</div>
                                            <div className="text-xl font-black text-amber-400 mt-1">Rp 6.550.000</div>
                                            <div className="text-[10px] text-emerald-400 mt-1">Hemat 24% dari budget batas</div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            <span className="text-slate-300 font-semibold">Alokasi Anggaran: 50% Kebutuhan • 30% Investasi & Tabungan • 20% Self-Reward</span>
                                        </div>
                                        <span className="text-indigo-400 font-bold">100% Seimbang</span>
                                    </div>
                                </div>
                            )}

                            {/* TAB: GOALS (WOOP) */}
                            {activeTab === 'goals' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">WOOP Psychological Goal Cascading</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Target Strategis & Rencana Antisipasi</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                                75% Milestone Tercapai
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-3.5">
                                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">W • Wish (Keinginan Inti)</div>
                                            <div className="text-sm font-bold text-white mt-1">Meluncurkan Ekosistem Tranvas ke 10.000 Pengguna Aktif</div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">O • Outcome (Hasil Terbaik)</div>
                                            <div className="text-sm font-bold text-white mt-1">Membantu ribuan orang menguasai waktu, habit & keuangan mereka</div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">O • Obstacle (Rintangan Nyata)</div>
                                            <div className="text-sm font-bold text-white mt-1">Distraksi notifikasi & godaan menunda eksekusi harian</div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40">
                                            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">P • Plan (If-Then Protocol)</div>
                                            <div className="text-sm font-bold text-white mt-1">JIKA merasa lelah atau beralih fokus, MAKA kunci sesi 45 menit mode deep work</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: JOURNAL */}
                            {activeTab === 'journal' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">Cognitive Unwind & Clarity</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Refleksi Harian & Mental Cadence</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                                                Mood: ⚡ Focused & Calm
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                            <span>Rabu, 07 Oktober • 21:00 WIB</span>
                                            <span>Private & Terenkripsi</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed italic">
                                            &ldquo;Sejak menggabungkan habit, keuangan, dan target harian ke dalam satu ekosistem Tranvas, kepala rasanya jauh lebih ringan. Tidak ada lagi catatan tercecer di 5 aplikasi terpisah. Semua ritme hidup terkoordinasi rapi di satu tempat...&rdquo;
                                        </p>
                                        <div className="flex gap-2 pt-1">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">#mentalclarity</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">#deepwork</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300">#lifeos</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: JOBS */}
                            {activeTab === 'jobs' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-sky-400 font-bold">Career & Opportunity Tracker</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Pipeline Lamaran & Karir Global</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                🎉 1 Offer Received
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                                        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                                            <div className="text-slate-400 font-medium">Wishlist (4)</div>
                                            <div className="mt-2 font-bold text-white">Google, Stripe, Linear</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                                            <div className="text-slate-400 font-medium">Applied (8)</div>
                                            <div className="mt-2 font-bold text-slate-300">Resume Terkirim</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                                            <div className="text-slate-400 font-medium">Interview (3)</div>
                                            <div className="mt-2 font-bold text-amber-300">Technical Round 2</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                                            <div className="text-emerald-400 font-bold">Offer (1)</div>
                                            <div className="mt-2 font-bold text-white">Lead Architect</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: STUDY */}
                            {activeTab === 'study' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-rose-400 font-bold">Cognitive Skill & Deep Learning</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Focus Session & Retensi Materi</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                                                Pomodoro 25:00 Aktif
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 sm:col-span-2 space-y-2">
                                            <div className="text-xs text-slate-400">Topik Studi Aktif</div>
                                            <div className="text-base font-bold text-white">System Architecture & Behavioral Psychology</div>
                                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                                <div className="bg-rose-500 h-full w-[84%]"></div>
                                            </div>
                                            <div className="text-[11px] text-slate-400 text-right">84% Materi Dikuasai</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-center items-center text-center">
                                            <div className="text-2xl font-black text-rose-400">25:00</div>
                                            <div className="text-xs text-slate-400 mt-1">Sesi Fokus #3</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: CALENDAR */}
                            {activeTab === 'calendar' && (
                                <div className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Synchronized Timeline</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">Jadwal Terintegrasi 8 Modul</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                                Auto-Sync Aktif
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                                            <div className="font-bold text-indigo-300">09:00 - 11:30</div>
                                            <div className="text-white font-semibold mt-1">Sprint Architecture & Deep Focus</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Tersambung ke Task Planner</div>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                                            <div className="font-bold text-emerald-300">14:00 - 14:30</div>
                                            <div className="text-white font-semibold mt-1">Financial Budgeting & Cashflow</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Tersambung ke Finance OS</div>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                                            <div className="font-bold text-purple-300">20:30 - 21:00</div>
                                            <div className="text-white font-semibold mt-1">Refleksi Malam & Evaluasi WOOP</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Tersambung ke Journal</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Canvas Bottom Sub-bar */}
                            <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    <span>Tranvas Unified Life OS • {TABS.find((t) => t.id === activeTab)?.tagline}</span>
                                </div>
                                <div className="flex items-center gap-3 font-medium">
                                    <span className="text-slate-500">Klik tab di atas untuk menguji modul</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Telemetry Micro-Badges (Sleek SaaS Accent) */}
                    <div className="absolute -bottom-6 -left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl items-center gap-3 hidden sm:flex z-20">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                            🔥
                        </div>
                        <div className="pr-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Streak Konsistensi</div>
                            <div className="text-xs font-bold text-white">24 Hari Berturut-turut</div>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl items-center gap-3 hidden sm:flex z-20">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-lg">
                            ⚡
                        </div>
                        <div className="pr-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">8 Modul Lengkap</div>
                            <div className="text-xs font-bold text-white">100% Real-Time Sync</div>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}
