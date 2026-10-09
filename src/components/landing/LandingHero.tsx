'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

type TabKey = 'planner' | 'habits' | 'finance' | 'goals' | 'journal' | 'jobs' | 'study' | 'calendar';

export default function LandingHero() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const [activeTab, setActiveTab] = useState<TabKey>('planner');
    const [isPaused, setIsPaused] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    const TABS: { id: TabKey; label: string; icon: string; tagline: string }[] = [
        { 
            id: 'planner', 
            label: isId ? 'Planner' : 'Planner', 
            icon: '📋', 
            tagline: isId ? 'Eksekusi Harian & Blok Waktu Fokus' : 'Daily Task Execution & Timeblock' 
        },
        { 
            id: 'habits', 
            label: isId ? 'Habits' : 'Habits', 
            icon: '🌱', 
            tagline: isId ? 'Konsistensi 28 Hari & Heatmap Streak' : '28-Day Consistency & Streak Heatmap' 
        },
        { 
            id: 'finance', 
            label: isId ? 'Finance' : 'Finance', 
            icon: '💰', 
            tagline: isId ? 'Pelacak Arus Kas & Budgeting Cerdas' : 'Cashflow Tracking & Smart Budgeting' 
        },
        { 
            id: 'goals', 
            label: isId ? 'Goals' : 'Goals', 
            icon: '🎯', 
            tagline: isId ? 'Milestone Bertingkat Psikologi WOOP' : 'WOOP Psychological Milestone Cascading' 
        },
        { 
            id: 'journal', 
            label: isId ? 'Journal' : 'Journal', 
            icon: '✍️', 
            tagline: isId ? 'Refleksi Mental & Ketenangan Pikiran' : 'Reflective Clarity & Cognitive Unwind' 
        },
        { 
            id: 'jobs', 
            label: isId ? 'Jobs' : 'Jobs', 
            icon: '💼', 
            tagline: isId ? 'Pipeline Karir & Pelacak Lamaran' : 'Career Pipeline & Application Tracker' 
        },
        { 
            id: 'study', 
            label: isId ? 'Study' : 'Study', 
            icon: '📚', 
            tagline: isId ? 'Timer Fokus Pomodoro & Retensi Belajar' : 'Focus Timer & Knowledge Retention' 
        },
        { 
            id: 'calendar', 
            label: isId ? 'Calendar' : 'Calendar', 
            icon: '🗓️', 
            tagline: isId ? 'Jadwal Hidup Terpadu & Tersinkron' : 'Unified Synchronized Schedule' 
        },
    ];

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
        <header className="relative pt-32 pb-20 sm:pt-36 sm:pb-32 lg:pt-40 lg:pb-48 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Ambient High-End Radial Lighting & Grid Mesh (contained) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] max-w-[100vw] h-[750px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(99,102,241,0.16),rgba(255,255,255,0))] pointer-events-none -z-10 overflow-hidden" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] max-w-[100vw] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-emerald-500/5 blur-3xl pointer-events-none -z-10 rounded-full animate-pulse-glow overflow-hidden" />
            
            {/* Hardware Accelerated Background Grid */}
            <div 
                className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-70" 
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                
                {/* 1. Micro-Badge Announcement Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 text-indigo-700 font-bold text-xs sm:text-sm mb-6 sm:mb-8 tracking-wide shadow-sm hover:bg-indigo-100/70 hover:scale-[1.02] transition-all cursor-default">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                    </span>
                    <span>{t('hero_premium_badge')}</span>
                </div>
                
                {/* 2. Authority H1 Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 sm:mb-8 tracking-tight text-slate-900 font-black leading-[1.06] max-w-5xl mx-auto">
                    {t('hero_premium_title_1')}{' '}
                    <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                        {t('hero_premium_title_2')}
                    </span>
                </h1>
                
                {/* 3. Problem-Solving Subheading */}
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
                    {t('hero_premium_desc')}
                </p>
                
                {/* 4. High-Converting Dual Action CTAs */}
                <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center mb-8 max-w-md mx-auto sm:max-w-none">
                    <Link 
                        href="/register" 
                        onClick={() => trackCTAClick('hero_primary', 'Start Free Today', '/register')}
                        className="w-full sm:w-auto relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4.5 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
                    >
                        <span>{t('hero_premium_cta_primary')}</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    
                    <button 
                        type="button"
                        onClick={() => {
                            trackCTAClick('hero_secondary', 'Explore 8 Modules', '#interactive-stage');
                            scrollToCanvas();
                        }}
                        className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 px-8 py-4.5 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                        <span>{t('hero_premium_cta_secondary')}</span>
                        <span className="text-base text-slate-400 group-hover:translate-y-0.5 transition-transform">↓</span>
                    </button>
                </div>

                {/* 5. Frictionless Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-8 text-sm sm:text-base font-semibold text-slate-600 max-w-2xl mx-auto mb-12 sm:mb-20">
                    <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('hero_trust_badge_1')}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{t('hero_trust_badge_2')}</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
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
                    <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-emerald-500/15 rounded-3xl blur-2xl -z-10 opacity-70 animate-pulse-glow" />

                    {/* Window Frame */}
                    <div className="rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-slate-900 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4)] overflow-hidden transition-all duration-300">
                        
                        {/* macOS Window Title Bar */}
                        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
                                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
                                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
                            </div>

                            {/* Breadcrumb URL Bar */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400">
                                <span className="text-slate-500">tranvas.app</span>
                                <span className="text-slate-600">/</span>
                                <span className="text-indigo-400 font-semibold">{activeTab}</span>
                            </div>

                            {/* Live System Indicator */}
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>{t('hero_canvas_synced')}</span>
                            </div>
                        </div>

                        {/* Interactive Tab Switcher Bar */}
                        <div className="px-2.5 pt-2.5 pb-2 sm:px-3 sm:pt-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleTabClick(tab.id)}
                                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                                            isActive
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.02]'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                        }`}
                                    >
                                        <span className="text-base">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                        {isActive && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dynamic Live Module Display */}
                        <div className="p-4 sm:p-6 md:p-8 min-h-[340px] sm:min-h-[420px] bg-slate-900 text-slate-100 flex flex-col justify-between">
                            
                            {/* TAB: PLANNER */}
                            {activeTab === 'planner' && (
                                <div key="planner" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Daily Execution Engine</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Target & Timeline Hari Ini' : "Today's Focus & Timeline"}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                {isId ? '4 dari 5 Selesai (80%)' : '4 of 5 Completed (80%)'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2 space-y-2.5">
                                            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-600 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                                                    <span className="text-sm font-semibold text-slate-300 line-through">
                                                        {isId ? '08:30 • Deep Work: Arsitektur Sistem & Core Algorithm' : '08:30 • Deep Work: System Architecture & Core Algorithm'}
                                                    </span>
                                                </div>
                                                <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">DONE</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-3 hover:border-slate-600 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                                                    <span className="text-sm font-semibold text-slate-300 line-through">
                                                        {isId ? '11:00 • Sprint Review & Roadmap Alignment' : '11:00 • Sprint Review & Roadmap Alignment'}
                                                    </span>
                                                </div>
                                                <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">DONE</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between gap-3 shadow-sm hover:border-indigo-400 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md border-2 border-indigo-400 flex items-center justify-center"></span>
                                                    <span className="text-sm font-bold text-white">
                                                        {isId ? '14:15 • Evaluasi Finansial & Habit Analytics' : '14:15 • Financial Review & Habit Analytics'}
                                                    </span>
                                                </div>
                                                <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/30 text-indigo-300 font-bold animate-pulse">FOCUS NOW</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-5 h-5 rounded-md border border-slate-600"></span>
                                                    <span className="text-sm font-medium text-slate-400">
                                                        {isId ? '16:30 • Evening Reflection & Mindful Journaling' : '16:30 • Evening Reflection & Mindful Journaling'}
                                                    </span>
                                                </div>
                                                <span className="text-xs px-2.5 py-1 rounded bg-slate-700 text-slate-300 font-medium">SCHEDULED</span>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeblock Cadence</div>
                                            <div className="space-y-2 text-xs">
                                                <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                                                    <div className="font-bold text-sm">08:00 - 12:00</div>
                                                    <div className="text-xs text-indigo-200/90 mt-0.5">{isId ? 'Sesi Deep Work Pagi' : 'Morning Deep Work Flow'}</div>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                                                    <div className="font-bold text-sm">14:00 - 17:00</div>
                                                    <div className="text-xs text-emerald-200/90 mt-0.5">{isId ? 'Eksekusi & Strategi' : 'Execution & Strategy'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: HABITS */}
                            {activeTab === 'habits' && (
                                <div key="habits" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Habit Matrix & Rewiring</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Konsistensi & Streak 28 Hari' : '28-Day Consistency & Streak Heatmap'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 flex items-center gap-1">
                                                {isId ? '🔥 24 Hari Streak Aktif' : '🔥 24-Day Active Streak'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-3">
                                            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between hover:border-emerald-500/30 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        <span>📖</span> {isId ? 'Membaca Literatur 30 Menit' : 'Read 30 Mins Daily'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        {isId ? '24 Hari Streak • Selesai Pagi Hari' : '24-Day Streak • Completed Morning'}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">100%</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between hover:border-emerald-500/30 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        <span>💧</span> {isId ? 'Olahraga Pagi & Hidrasi 2L' : 'Morning Workout & 2L Hydration'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        {isId ? '18 Hari Streak • Selesai Siang Hari' : '18-Day Streak • Completed Afternoon'}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">100%</span>
                                            </div>

                                            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                                        <span>🧘</span> {isId ? 'Refleksi Harian (WOOP)' : 'Daily Reflection (WOOP)'}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        {isId ? '12 Hari Streak • Jadwal Malam' : '12-Day Streak • Evening Cadence'}
                                                    </div>
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
                                                        className={`w-full aspect-square rounded-[5px] transition-all hover:scale-110 ${
                                                            i > 24 
                                                                ? 'bg-slate-700/60' 
                                                                : i % 4 === 0 
                                                                ? 'bg-emerald-400 shadow-sm shadow-emerald-500/40' 
                                                                : 'bg-emerald-500'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-xs text-slate-300 text-right mt-2 font-mono font-medium">
                                                {isId ? 'Tingkat Penyelesaian: 92.8%' : 'Monthly Completion: 92.8%'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: FINANCE */}
                            {activeTab === 'finance' && (
                                <div key="finance" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Zero-Based Cashflow Manager</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Ringkasan Saldo & Alokasi Cerdas' : 'Net Worth Summary & Smart Allocation'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                +18.4% MoM
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-xs text-slate-400 font-medium">
                                                {isId ? 'Saldo Bersih Tersimpan' : 'Total Net Balance'}
                                            </div>
                                            <div className="text-xl font-black text-white mt-1">
                                                {isId ? 'Rp 28.450.000' : '$24,850.00'}
                                            </div>
                                            <div className="text-xs text-emerald-400 mt-1 font-semibold">
                                                {isId ? '↑ On-track target tabungan' : '↑ On-track savings goal'}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-xs text-slate-400 font-medium">
                                                {isId ? 'Total Pemasukan Bulan Ini' : 'Total Monthly Inflow'}
                                            </div>
                                            <div className="text-xl font-black text-indigo-400 mt-1">
                                                {isId ? 'Rp 35.000.000' : '$35,000.00'}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1 font-medium">
                                                {isId ? 'Gaji & Revenue Project' : 'Salary & Retainer'}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="text-xs text-slate-400 font-medium">
                                                {isId ? 'Pengeluaran Terkendali' : 'Controlled Expenses'}
                                            </div>
                                            <div className="text-xl font-black text-amber-400 mt-1">
                                                {isId ? 'Rp 6.550.000' : '$6,550.00'}
                                            </div>
                                            <div className="text-xs text-emerald-400 mt-1 font-semibold">
                                                {isId ? 'Hemat 24% dari budget batas' : 'Saved 24% under budget ceiling'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            <span className="text-slate-300 font-semibold">
                                                {isId 
                                                    ? 'Alokasi Anggaran: 50% Kebutuhan • 30% Investasi & Tabungan • 20% Self-Reward' 
                                                    : 'Budget Allocation: 50% Needs • 30% Savings & Investments • 20% Wants'}
                                            </span>
                                        </div>
                                        <span className="text-indigo-400 font-bold">{isId ? '100% Seimbang' : '100% Balanced'}</span>
                                    </div>
                                </div>
                            )}

                            {/* TAB: GOALS (WOOP) */}
                            {activeTab === 'goals' && (
                                <div key="goals" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">WOOP Goal Cascading</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Target Strategis & Rencana Antisipasi' : 'Strategic Goals & Obstacle Plan'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                                {isId ? '75% Milestone Tercapai' : '75% Milestones Achieved'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-3.5">
                                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-colors">
                                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                {isId ? 'W • Wish (Keinginan Inti)' : 'W • Wish (Core Aspiration)'}
                                            </div>
                                            <div className="text-sm font-bold text-white mt-1">
                                                {isId ? 'Meluncurkan Ekosistem Tranvas ke 10.000 Pengguna Aktif' : 'Scale Tranvas to 10,000 Active High-Performers'}
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-colors">
                                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                                {isId ? 'O • Outcome (Hasil Terbaik)' : 'O • Outcome (Best Result)'}
                                            </div>
                                            <div className="text-sm font-bold text-white mt-1">
                                                {isId ? 'Membantu ribuan orang menguasai waktu, habit & keuangan mereka' : 'Empower thousands to master their focus, habits & finances'}
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-colors">
                                            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                                                {isId ? 'O • Obstacle (Rintangan Nyata)' : 'O • Obstacle (Real Friction)'}
                                            </div>
                                            <div className="text-sm font-bold text-white mt-1">
                                                {isId ? 'Distraksi notifikasi & godaan menunda eksekusi harian' : 'Notification distractions & tendency to postpone deep work'}
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 hover:border-indigo-400 transition-colors">
                                            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                                                {isId ? 'P • Plan (If-Then Protocol)' : 'P • Plan (If-Then Protocol)'}
                                            </div>
                                            <div className="text-sm font-bold text-white mt-1">
                                                {isId ? 'JIKA merasa lelah atau beralih fokus, MAKA kunci sesi 45 menit mode deep work' : 'IF feeling distracted or fatigue, THEN engage a 45-min Deep Focus session'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: JOURNAL */}
                            {activeTab === 'journal' && (
                                <div key="journal" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-purple-400 font-bold">Cognitive Unwind & Clarity</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Refleksi Harian & Mental Cadence' : 'Daily Reflection & Mental Cadence'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                                                Mood: ⚡ Focused & Calm
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                            <span>{isId ? 'Rabu, 07 Oktober • 21:00 WIB' : 'Wednesday, Oct 7 • 09:00 PM'}</span>
                                            <span>{isId ? 'Private & Terenkripsi' : 'Private & Encrypted'}</span>
                                        </div>
                                        <p className="text-sm text-slate-200 leading-relaxed italic">
                                            {isId 
                                                ? '“Sejak menggabungkan habit, keuangan, dan target harian ke dalam satu ekosistem Tranvas, kepala rasanya jauh lebih ringan. Tidak ada lagi catatan tercecer di 5 aplikasi terpisah. Semua ritme hidup terkoordinasi rapi di satu tempat...”'
                                                : '“Consolidating habits, finances, and daily planning into Tranvas eliminated so much cognitive fatigue. No more notes scattered across 5 disconnected apps. My entire daily cadence is finally in complete harmony...”'}
                                        </p>
                                        <div className="flex gap-2 pt-1 flex-wrap">
                                            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 font-medium">#mentalclarity</span>
                                            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-700 text-slate-300 font-medium">#deepwork</span>
                                            <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-600/30 text-indigo-300 font-medium">#lifeos</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: JOBS */}
                            {activeTab === 'jobs' && (
                                <div key="jobs" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-sky-400 font-bold">Career & Opportunity Tracker</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Pipeline Lamaran & Karir Global' : 'Career Pipeline & Opportunity Tracker'}
                                            </h3>
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
                                            <div className="text-slate-400 font-medium">{isId ? 'Dilamar (8)' : 'Applied (8)'}</div>
                                            <div className="mt-2 font-bold text-slate-300">{isId ? 'Resume Terkirim' : 'Resumes Sent'}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
                                            <div className="text-slate-400 font-medium">Interview (3)</div>
                                            <div className="mt-2 font-bold text-amber-300">{isId ? 'Teknikal Round 2' : 'Round 2 Technical'}</div>
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
                                <div key="study" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-rose-400 font-bold">Cognitive Skill & Deep Learning</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Focus Session & Retensi Materi' : 'Focus Session & Retention Rate'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                                                Pomodoro 25:00
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 sm:col-span-2 space-y-2">
                                            <div className="text-xs text-slate-400">{isId ? 'Topik Studi Aktif' : 'Active Study Subject'}</div>
                                            <div className="text-base font-bold text-white">System Architecture & Behavioral Economics</div>
                                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                                <div className="bg-rose-500 h-full w-[84%] transition-all duration-1000"></div>
                                            </div>
                                            <div className="text-[11px] text-slate-400 text-right">
                                                {isId ? '84% Materi Dikuasai' : '84% Concept Mastery'}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-center items-center text-center">
                                            <div className="text-2xl font-black text-rose-400">25:00</div>
                                            <div className="text-xs text-slate-400 mt-1">{isId ? 'Sesi Fokus #3' : 'Focus Session #3'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: CALENDAR */}
                            {activeTab === 'calendar' && (
                                <div key="calendar" className="space-y-5 animate-slide-up-fade">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                                        <div>
                                            <div className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Synchronized Timeline</div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {isId ? 'Jadwal Terintegrasi 8 Modul' : 'Integrated 8-Module Timeline'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                                {isId ? 'Auto-Sync Aktif' : 'Auto-Sync Active'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                                        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-400 transition-colors">
                                            <div className="font-bold text-indigo-300">09:00 - 11:30</div>
                                            <div className="text-white font-semibold mt-1">Sprint Architecture & Deep Focus</div>
                                            <div className="text-xs text-slate-400 mt-1">{isId ? 'Tersambung ke Task Planner' : 'Synced with Task Planner'}</div>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 transition-colors">
                                            <div className="font-bold text-emerald-300">14:00 - 14:30</div>
                                            <div className="text-white font-semibold mt-1">Financial Budgeting & Cashflow</div>
                                            <div className="text-xs text-slate-400 mt-1">{isId ? 'Tersambung ke Finance OS' : 'Synced with Finance OS'}</div>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 transition-colors">
                                            <div className="font-bold text-purple-300">20:30 - 21:00</div>
                                            <div className="text-white font-semibold mt-1">Refleksi Malam & Evaluasi WOOP</div>
                                            <div className="text-xs text-slate-400 mt-1">{isId ? 'Tersambung ke Journal' : 'Synced with Journal'}</div>
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
                                    <span className="text-slate-500">
                                        {isId ? 'Klik tab di atas untuk menguji modul' : 'Click tabs above to test live modules'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Telemetry Micro-Badges with Smooth Float Animation */}
                    <div className="absolute -bottom-6 -left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl items-center gap-3 hidden sm:flex z-20 animate-float-slow hover:scale-105 transition-transform cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg">
                            🔥
                        </div>
                        <div className="pr-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                {isId ? 'Streak Konsistensi' : 'Consistency Streak'}
                            </div>
                            <div className="text-sm font-bold text-white">
                                {isId ? '24 Hari Berturut-turut' : '24 Consecutive Days'}
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl items-center gap-3 hidden sm:flex z-20 animate-float-slow hover:scale-105 transition-transform cursor-default" style={{ animationDelay: '1.5s' }}>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-lg">
                            ⚡
                        </div>
                        <div className="pr-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                {isId ? '8 Modul Lengkap' : '8 Unified Modules'}
                            </div>
                            <div className="text-sm font-bold text-white">
                                100% Real-Time Sync
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}
