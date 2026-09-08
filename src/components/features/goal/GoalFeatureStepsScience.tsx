'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface GoalFeatureStepsScienceProps {
    t: any;
}

export default function GoalFeatureStepsScience({ t }: GoalFeatureStepsScienceProps) {
    return (
        <>
            {/* SECTION 3.5: MILESTONE DECOMPOSITION (ZIG-ZAG PATH) */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                        <path d="M0,100 L1000,300 L0,500 L1000,700 L0,900" fill="none" stroke="currentColor" strokeWidth="40" />
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-blue-200">
                            {t('goal_steps_badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                            {t('goal_steps_title')}
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed font-medium">
                            {t('goal_steps_desc')}
                        </p>
                    </div>

                    <div className="relative">
                        {/* Vertical Line Connector */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-transparent -translate-x-1/2 hidden md:block"></div>

                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-12 mb-32 group">
                            <div className="flex-1 text-center md:text-right order-2 md:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('goal_step_1_title')}</h3>
                                <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('goal_step_1_desc')}</p>
                            </div>
                            <div className="relative z-10 flex-shrink-0 order-1 md:order-2">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl text-blue-600 border-4 border-blue-50 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-500 font-black">1</div>
                            </div>
                            <div className="flex-1 order-3 hidden md:block"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row items-center gap-12 mb-32 group">
                            <div className="flex-1 order-1 hidden md:block"></div>
                            <div className="relative z-10 flex-shrink-0 order-2">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl text-indigo-600 border-4 border-indigo-50 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-500 font-black">2</div>
                            </div>
                            <div className="flex-1 text-center md:text-left order-3 animate-in fade-in slide-in-from-right-8 duration-700">
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('goal_step_2_title')}</h3>
                                <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('goal_step_2_desc')}</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-12 group">
                            <div className="flex-1 text-center md:text-right order-2 md:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('goal_step_3_title')}</h3>
                                <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('goal_step_3_desc')}</p>
                            </div>
                            <div className="relative z-10 flex-shrink-0 order-1 md:order-2">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl text-purple-600 border-4 border-purple-50 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-500 font-black">3</div>
                            </div>
                            <div className="flex-1 order-3 hidden md:block text-4xl pt-4 font-black">🚀</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION: SCIENTIFIC PILLAR - MILESTONE & IMPLEMENTATION INTENTION ARCHITECTURE */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 font-bold text-[10px] uppercase tracking-[0.25em] mb-6 border border-purple-500/20">
                            🎯 Goal Science & Intention Design
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight mb-6">
                            {t('goal_science_title_1')}{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
                                {t('goal_science_title_highlight')}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            Goals without behavioral science remain wishful thinking. Tranvas builds upon empirical studies proving how structural accountability drives execution.
                        </p>
                    </div>

                    {/* Dual Research Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: Gail Matthews Study */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 hover:border-purple-500/40 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                                        📊
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-mono">
                                        Dominican Univ. (Matthews)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors">
                                    {t('goal_science_step1_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('goal_science_step1_desc')}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">Success Rate Delta</span>
                                </div>
                                <span className="text-xs font-black text-purple-400">43% → 76% Achieved</span>
                            </div>
                        </div>

                        {/* Card 2: Gollwitzer If-Then */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 hover:border-indigo-500/40 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                                        ⚡
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-mono">
                                        American Psychologist (1999)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">
                                    {t('goal_science_step2_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('goal_science_step2_desc')}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">Implementation Intentions</span>
                                </div>
                                <span className="text-xs font-black text-indigo-400">Pre-Committed Action</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEURAL PROMO: GOAL FORECASTING */}
            <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest mb-8 border border-indigo-500/20">
                            📈 {t('goal_ai_promo_badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                            {t('goal_ai_promo_title')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            {t('goal_ai_promo_desc')}
                        </p>
                        <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                            {t('goal_ai_promo_btn')} <span>→</span>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="flex items-end gap-1 h-32 mb-6">
                                {[30, 45, 40, 60, 55, 80, 75, 95].map((h, idx) => (
                                    <div key={idx} className="flex-1 bg-indigo-500/20 rounded-t-lg group-hover:bg-indigo-500/40 transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <div className="p-4 bg-indigo-600/10 rounded-xl border border-indigo-500/20 text-center">
                                <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1">Predicted Completion</p>
                                <p className="text-white font-bold">Oct 14, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PHILOSOPHICAL QUOTE */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                    <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                        {t('goal_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('goal_quote_author')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
