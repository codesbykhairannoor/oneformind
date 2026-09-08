'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface NeuralOsHeroPreviewProps {
    t: any;
}

const waveHeights = [
    40, 65, 30, 85, 45, 90, 70, 35, 60, 50, 75, 40, 80, 55, 95, 65, 45, 75, 30, 85
];

export default function NeuralOsHeroPreview({ t }: NeuralOsHeroPreviewProps) {
    return (
        <>
            {/* SECTION 1: HERO - THE NEURAL CORE */}
            <header className="pt-32 pb-40 px-6 text-center relative overflow-hidden bg-white bg-pattern-dots">
                {/* Deep Indigo & Purple Gradient Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-purple-50/50 via-white to-white rounded-full blur-3xl -z-10"></div>
                
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 shadow-sm text-purple-700 text-[10px] mb-10 tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-700 font-bold uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                        </span>
                        {t('neural_hero_badge')}
                    </div>
                    
                    <h1 className="text-[42px] leading-[1.1] md:text-7xl lg:text-8xl mb-10 leading-[0.95] tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-black">
                        {t('neural_hero_title_1')}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
                            {t('neural_hero_title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-500 mb-14 leading-relaxed max-w-3xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                        {t('neural_hero_desc')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                        <Link href="/register" className="bg-indigo-600 text-white px-12 py-6 rounded-3xl text-xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 active:scale-95 group font-bold">
                            {t('neural_hero_cta_1')}
                            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                        </Link>
                        <a href="#audit" className="bg-white text-slate-700 border border-slate-200 px-12 py-6 rounded-3xl text-xl hover:bg-slate-50 hover:border-slate-300 transition transform hover:-translate-y-1 active:scale-95 font-bold">
                            {t('neural_hero_cta_2')}
                        </a>
                    </div>
                </div>
            </header>

            {/* SECTION 2: INTERFACE PREVIEW - AI INSIGHTS */}
            <section className="py-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-slate-800 border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
                            
                            {/* Visual AI Simulation */}
                            <div className="lg:w-3/5 p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 font-black">🧠</div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t('neural_mockup_source')}</p>
                                        <p className="text-white text-lg font-bold">Gemini Intelligence Layer</p>
                                    </div>
                                </div>

                                {/* Simulated Waveform / Graph */}
                                <div className="h-64 bg-slate-900/50 rounded-3xl border border-slate-700/50 p-8 flex items-center justify-center relative overflow-hidden mb-8">
                                    <div className="absolute inset-0 flex items-center justify-around px-8">
                                        {waveHeights.map((h, i) => (
                                            <div key={i} className="w-1.5 bg-indigo-500/30 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}></div>
                                        ))}
                                    </div>
                                    <div className="relative z-10 text-white text-center">
                                        <span className="bg-indigo-600 px-4 py-2 rounded-full text-xs uppercase tracking-widest shadow-xl font-bold">{t('neural_mockup_confidence')}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div className="p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30">
                                        <p className="text-indigo-400 font-bold text-xs mb-2">● REC-01</p>
                                        <p className="text-slate-300 font-medium text-sm leading-relaxed">{t('neural_mockup_insight_1')}</p>
                                    </div>
                                    <div className="p-6 bg-purple-700/30 rounded-2xl border border-purple-600/30">
                                        <p className="text-purple-400 font-bold text-xs mb-2">● STRAT-02</p>
                                        <p className="text-slate-300 font-medium text-sm leading-relaxed">{t('neural_mockup_insight_2')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contextual Explanation */}
                            <div className="lg:w-2/5 p-12 flex flex-col justify-center text-left">
                                <h2 className="text-4xl text-white mb-8 leading-tight font-black">
                                    {t('neural_gemini_powered')}<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Gemini Pro API</span>
                                </h2>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">✓</div>
                                        <p className="text-slate-400 font-medium">{t('neural_gemini_feat1')}</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">✓</div>
                                        <p className="text-slate-400 font-medium">{t('neural_gemini_feat2')}</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">✓</div>
                                        <p className="text-slate-400 font-medium">{t('neural_gemini_feat3')}</p>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
