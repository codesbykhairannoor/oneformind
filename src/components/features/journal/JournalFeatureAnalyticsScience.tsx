'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface JournalFeatureAnalyticsScienceProps {
    t: any;
}

export default function JournalFeatureAnalyticsScience({ t }: JournalFeatureAnalyticsScienceProps) {
    return (
        <>
            {/* SECTION 3.5: SENTIMENT ANALYTICS (BENTO MOSAIC) */}
            <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-purple-200">
                            {t('journal_analytics_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                            {t('journal_analytics_title')}
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed font-medium">
                            {t('journal_analytics_desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] text-left">
                        
                        {/* Bento 1: Large Feature */}
                        <div className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-[3rem] p-12 border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition duration-700">
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition duration-700"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition font-black select-none">🌈</div>
                                    <h3 className="text-3xl text-gray-900 mb-4 font-black">{t('journal_analytics_bento_1_title')}</h3>
                                    <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md">{t('journal_analytics_bento_1_desc')}</p>
                                </div>
                                
                                {/* Visual Mood Cluster Representation */}
                                <div className="flex items-end gap-2 h-24">
                                    {[40, 70, 45, 90, 60, 80, 55, 100, 40, 75].map((height, idx) => (
                                        <div key={idx} className="flex-1 bg-purple-200 rounded-full transition-all duration-1000" style={{ height: `${height}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bento 2 */}
                        <div className="bg-purple-600 rounded-[3rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl transition duration-500">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition font-black select-none">🧘</div>
                                <div>
                                    <h3 className="text-xl mb-2 font-black">{t('journal_analytics_bento_2_title')}</h3>
                                    <p className="text-purple-100 text-xs font-medium leading-relaxed">{t('journal_analytics_bento_2_desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bento 3 */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition duration-500">
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition duration-1000"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:-rotate-12 transition font-black select-none">🧠</div>
                                <div>
                                    <h3 className="text-xl text-gray-900 mb-2 font-black">{t('journal_analytics_bento_3_title')}</h3>
                                    <p className="text-gray-500 text-xs font-medium leading-relaxed">{t('journal_analytics_bento_3_desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bento 4: Horizontal Banner */}
                        <div className="md:col-span-3 bg-slate-900 rounded-[3rem] p-8 border border-slate-800 flex items-center justify-between group overflow-hidden">
                            <div className="flex items-center gap-8 pl-4">
                                <div className="flex -space-x-4">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xl shadow-lg font-black select-none">✨</div>
                                    ))}
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('journal_analytics_banner_text')}</p>
                            </div>
                            <div className="pr-4 group-hover:translate-x-2 transition duration-500">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white cursor-pointer">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION: SCIENTIFIC PILLAR - WARM EDITORIAL RESEARCH CARDS */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 font-bold text-[10px] uppercase tracking-[0.25em] mb-6 border border-purple-500/20">
                            📖 Clinical Psychology & Expressive Writing
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight mb-6 font-serif italic">
                            {t('journal_science_title_1')}{' '}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent not-italic font-sans">
                                {t('journal_science_title_highlight')}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto font-sans">
                            Journaling isn't just passive recording—it is active cognitive offloading that physically frees working memory and resets emotional equilibrium.
                        </p>
                    </div>

                    {/* Warm Editorial Research Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: Pennebaker Expressive Writing */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-purple-500/40 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl font-serif">
                                        ✒️
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-mono">
                                        Psychological Science (1997)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors">
                                    {t('journal_science_card1_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('journal_science_card1_desc')}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">Cortisol Index Reduction</span>
                                </div>
                                <span className="text-xs font-black text-purple-400">-50% Physiological Stress</span>
                            </div>
                        </div>

                        {/* Card 2: Ramirez & Beilock Working Memory Offload */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-pink-500/40 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-2xl font-serif">
                                        🧠
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 font-mono">
                                        Science Magazine (2011)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-pink-300 transition-colors">
                                    {t('journal_science_card2_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('journal_science_card2_desc')}
                                </p>
                            </div>
                            
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">RAM Capacity Restored</span>
                                </div>
                                <span className="text-xs font-black text-pink-400">+100% Unclogged</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEURAL PROMO: JOURNAL REFLECTION */}
            <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16 text-left">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] uppercase tracking-widest mb-8 border border-purple-500/20">
                            📖 {t('journal_ai_promo_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                            {t('journal_ai_promo_title')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            {t('journal_ai_promo_desc')}
                        </p>
                        <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-purple-700 transition transform hover:-translate-y-1">
                            {t('journal_ai_promo_btn')} <span>→</span>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl text-center group">
                            <div className="text-[10px] text-purple-400 uppercase tracking-widest mb-6">Sentiment Mirror v1.0</div>
                            <div className="flex flex-wrap justify-center gap-3">
                                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-300">Resilient (+14%)</span>
                                <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-300">Focused</span>
                                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold text-indigo-300">Growth Mindset</span>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/5 text-slate-400 text-sm italic">
                                "You tend to solve complex problems better after journaling for 10 minutes."
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: PHILOSOPHICAL QUOTE */}
            <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                    <h2 className="text-3xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                        {t('journal_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('journal_quote_author')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
