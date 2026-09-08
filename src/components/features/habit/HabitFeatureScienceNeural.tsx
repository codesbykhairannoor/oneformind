'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface HabitFeatureScienceNeuralProps {
    t: any;
}

export default function HabitFeatureScienceNeural({ t }: HabitFeatureScienceNeuralProps) {
    return (
        <>
            {/* SECTION: SCIENTIFIC PILLAR - DUAL GLASSMORPHISM RESEARCH CARDS */}
            <section className="py-32 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.25em] mb-6 border border-emerald-500/20">
                            🧬 Behavioral Neuroscience
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight mb-6">
                            {t('habit_science_title_1')}{' '}
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                                {t('habit_science_title_highlight')}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            Sustainable habit formation isn't about raw willpower. Tranvas is engineered around peer-reviewed automaticity curves and cue architecture.
                        </p>
                    </div>

                    {/* Dual Research Cards Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: 66-Day Plateau (Lally) */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/40 transition duration-500 flex flex-col justify-between group shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
                                        📈
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                        Univ. College London (2009)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-emerald-300 transition-colors">
                                    {t('habit_science_point1_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('habit_science_point1_desc')}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                                    <span className="text-xs font-bold text-slate-300">Asymptotic Plateau</span>
                                </div>
                                <span className="text-xs font-mono font-black text-emerald-400">Day 66 / Infinite</span>
                            </div>
                        </div>

                        {/* Card 2: 43% Automaticity (Wood) */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/40 transition duration-500 flex flex-col justify-between group shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                                        ⚡
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                        USC Psychology (2014)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">
                                    {t('habit_science_point2_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('habit_science_point2_desc')}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                                    <span className="text-xs font-bold text-slate-300">Contextual Trigger Engine</span>
                                </div>
                                <span className="text-xs font-mono font-black text-indigo-400">0s Friction Log</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEURAL PROMO: HABIT AUDIT */}
            <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest mb-8 border border-indigo-500/20">
                            🧠 {t('habit_ai_promo_badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                            {t('habit_ai_promo_title')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            {t('habit_ai_promo_desc')}
                        </p>
                        <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                            {t('habit_ai_promo_btn')} <span>→</span>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition duration-700"></div>
                            <div className="relative space-y-4">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                    <p className="text-xs font-bold text-slate-300">Friction Audit Complete: Morning Workout</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
                                    <p className="text-xs font-bold text-slate-300">Detected: 14% drop in consistency when mood is 'Tired'</p>
                                </div>
                                <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-left">
                                    <p className="text-indigo-400 text-[10px] uppercase mb-2 font-bold">Neural Solution</p>
                                    <p className="text-sm font-bold text-white leading-relaxed">Try Habit Stacking with 'Coffee' to reduce initial friction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: PHILOSOPHICAL QUOTE */}
            <section className="py-32 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                    <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                        {t('habit_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('habit_quote_author')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
