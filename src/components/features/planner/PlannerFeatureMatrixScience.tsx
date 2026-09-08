'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface PlannerFeatureMatrixScienceProps {
    t: any;
}

export default function PlannerFeatureMatrixScience({ t }: PlannerFeatureMatrixScienceProps) {
    return (
        <>
            {/* SECTION 3.5: EISENHOWER MATRIX (2x2 GRID) */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-200">
                            {t('planner_matrix_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                            {t('planner_matrix_title')}
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed font-medium">
                            {t('planner_matrix_desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 relative text-left">
                        {/* Axis Labels */}
                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 hidden md:block">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-gray-300 font-bold">{t('planner_matrix_axis_y')}</span>
                        </div>
                        <div className="absolute top-[-3rem] left-1/2 -translate-x-1/2 hidden md:block">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-gray-300 font-bold">{t('planner_matrix_axis_x')}</span>
                        </div>

                        {/* Q1: Urgent & Important */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-rose-500 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">🔥</div>
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q1_title')}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q1_desc')}</p>
                            </div>
                        </div>

                        {/* Q2: Not Urgent & Important */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-emerald-500 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">💎</div>
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q2_title')}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q2_desc')}</p>
                            </div>
                        </div>

                        {/* Q3: Urgent & Not Important */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-amber-500 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">⚡</div>
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q3_title')}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q3_desc')}</p>
                            </div>
                        </div>

                        {/* Q4: Not Urgent & Not Important */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-slate-300 hover:shadow-2xl transition duration-500 group relative overflow-hidden opacity-80 hover:opacity-100">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">🧹</div>
                                <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q4_title')}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q4_desc')}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION: SCIENTIFIC PILLAR - SPLIT SHIELD ATTENTION & ZEIGARNIK ARCHITECTURE */}
            <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>
                <div className="absolute bottom-0 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-[0.25em] mb-6 border border-indigo-500/20">
                            🛡️ Cognitive Bandwidth Protection
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight mb-6">
                            {t('planner_science_title_1')}{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                                {t('planner_science_title_highlight')}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            Every interrupted or unplanned task drains mental RAM. Tranvas implements proven cognitive shielding to keep your execution laser-sharp.
                        </p>
                    </div>

                    {/* Split Shield Layout */}
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Shield 1: Attention Residue */}
                        <div className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition"></div>
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                                        ⚡
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                        Dr. Sophie Leroy (2009)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">
                                    {t('planner_science_box1_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('planner_science_box1_desc')}
                                </p>
                            </div>
                            
                            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">Context Switch Latency</span>
                                </div>
                                <span className="text-xs font-mono font-black text-indigo-400">Isolated 0ms</span>
                            </div>
                        </div>

                        {/* Shield 2: Zeigarnik Loops */}
                        <div className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition"></div>
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                                        🧠
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                        Masicampo & Baumeister (2011)
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors">
                                    {t('planner_science_box2_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('planner_science_box2_desc')}
                                </p>
                            </div>
                            
                            <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">Working Memory Strain</span>
                                </div>
                                <span className="text-xs font-mono font-black text-purple-400">100% Cleared</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEURAL PROMO: PLANNER OPTIMIZATION */}
            <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest mb-8 border border-indigo-500/20">
                            ⚡ {t('planner_ai_promo_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                            {t('planner_ai_promo_title')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            {t('planner_ai_promo_desc')}
                        </p>
                        <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                            {t('planner_ai_promo_btn')} <span>→</span>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="space-y-4">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[60%] animate-pulse"></div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-500 tracking-widest uppercase font-bold">
                                    <span>COGNITIVE LOAD: HIGH</span>
                                    <span className="text-indigo-400">OPTIMIZING...</span>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl font-black select-none">🧘</div>
                                    <div className="text-left">
                                        <p className="text-white font-bold text-sm leading-none mb-1">Low-Impact Task Detected</p>
                                        <p className="text-slate-400 text-xs">Moving 'Reply Emails' to 4 PM.</p>
                                    </div>
                                </div>
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
                        {t('planner_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('planner_quote_author')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
