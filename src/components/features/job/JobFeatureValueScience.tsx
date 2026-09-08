'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

const DEFAULT_RADAR_ITEMS = [
    { role: 'Product Manager', prev: '18M', curr: '32M', gain: '+77%', color: 'from-cyan-500 to-blue-500' },
    { role: 'Senior Software Engineer', prev: '22M', curr: '45M', gain: '+104%', color: 'from-indigo-500 to-purple-500' },
    { role: 'Growth Lead', prev: '15M', curr: '28M', gain: '+86%', color: 'from-emerald-500 to-teal-500' }
];

interface JobFeatureValueScienceProps {
    t: any;
    radarItems?: Array<{
        role: string;
        prev: string;
        curr: string;
        gain: string;
        color: string;
    }>;
}

export default function JobFeatureValueScience({ t, radarItems = DEFAULT_RADAR_ITEMS }: JobFeatureValueScienceProps) {
    return (
        <>
            {/* SECTION 3.5: MARKET VALUE (SPLIT CONTENT) */}
            <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] uppercase tracking-[0.2em] mb-8 border border-cyan-500/20">
                                {t('job_value_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('job_value_title')}
                            </h2>
                            <p className="text-slate-400 text-xl leading-relaxed font-medium mb-12">
                                {t('job_value_desc')}
                            </p>
                            
                            <div className="space-y-12">
                                <div className="flex gap-8 group cursor-default">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl group-hover:bg-cyan-500 transition duration-500 font-black">📈</div>
                                    <div>
                                        <h4 className="text-xl mb-2 uppercase tracking-tight group-hover:text-cyan-400 transition font-black">{t('job_insight_1_title')}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{t('job_insight_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 group cursor-default">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl group-hover:bg-indigo-500 transition duration-500 font-black">🏗️</div>
                                    <div>
                                        <h4 className="text-xl mb-2 uppercase tracking-tight group-hover:text-indigo-400 transition font-black">{t('job_insight_2_title')}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{t('job_insight_2_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-slate-800/50 rounded-[3rem] p-1 border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-1000 text-left">
                            <div className="bg-slate-900 rounded-[2.8rem] p-10 overflow-hidden relative group">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition duration-700"></div>
                                
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 font-bold">{t('job_radar_title')}</h3>
                                    <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-[10px] animate-pulse font-bold">{t('job_radar_live')}</div>
                                </div>

                                <div className="space-y-6">
                                    {radarItems.map((item, idx) => (
                                        <div key={idx} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-slate-500/50 transition duration-500">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-slate-300">{item.role}</span>
                                                <span className="text-cyan-400 text-xs font-bold">{item.gain}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-slate-500 text-xs line-through">Rp {item.prev}</span>
                                                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden relative">
                                                    <div className="absolute inset-y-0 left-0 bg-cyan-500 w-full animate-grow origin-left"></div>
                                                </div>
                                                <span className="text-white font-bold">Rp {item.curr}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes grow {
                        0% { transform: scaleX(0); }
                        100% { transform: scaleX(1); }
                    }
                    .animate-grow {
                        animation: grow 2s ease-out infinite;
                    }
                `}</style>
            </section>

            {/* SCIENTIFIC PILLAR (E-E-A-T) - TERMINAL COMMAND STYLE */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="bg-black/50 border border-white/10 rounded-[2.5rem] p-1 shadow-2xl relative overflow-hidden group">
                        {/* Terminal Header */}
                        <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">Scientific_Core_Module.exe</div>
                            <div className="w-8"></div>
                        </div>

                        <div className="p-8 md:p-16 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-widest mb-10 border border-indigo-500/30">
                                🧬 {t('job_science_badge')}
                            </div>

                            <h2 className="text-4xl md:text-5xl font-mono text-emerald-400 mb-10 leading-tight font-black">
                                <span className="text-white opacity-50 mr-4">&gt;</span>{t('job_science_title')}<span className="animate-pulse">_</span>
                            </h2>

                            <div className="bg-black/40 border-l-4 border-emerald-500 p-8 rounded-r-2xl mb-12">
                                <p className="text-emerald-500/80 text-xl md:text-2xl font-mono leading-relaxed italic">
                                    {t('job_science_desc')}
                                </p>
                            </div>

                            {/* System Parameters */}
                            <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-12">
                                <div>
                                    <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Module_01: Architecture</span>
                                    <h4 className="text-white font-mono text-lg mb-2 font-bold">Systems Thinking</h4>
                                    <p className="text-white/40 text-xs leading-relaxed font-mono">Optimizing the job search as a multi-stage deterministic framework for predictability.</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Module_02: Optimization</span>
                                    <h4 className="text-white font-mono text-lg mb-2 font-bold">Iterative Feedback</h4>
                                    <p className="text-white/40 text-xs leading-relaxed font-mono">Continuous loop refinement based on recruiter interactions and pipeline velocity data.</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono text-white/40 uppercase block mb-4">Module_03: Core_Logic</span>
                                    <h4 className="text-white font-mono text-lg mb-2 font-bold">Pipeline Management</h4>
                                    <p className="text-white/40 text-xs leading-relaxed font-mono">Visualizing career transition as a funnel conversion process to maximize final placement ROI.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEURAL PROMO: JOB MATCHING */}
            <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16 text-left">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-widest mb-8 border border-emerald-500/20">
                            🎯 {t('job_ai_promo_badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                            {t('job_ai_promo_title')}
                        </h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                            {t('job_ai_promo_desc')}
                        </p>
                        <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-emerald-700 transition transform hover:-translate-y-1">
                            {t('job_ai_promo_btn')} <span>→</span>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 relative w-full">
                        <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="flex items-center justify-center mb-8">
                                <div className="w-32 h-32 rounded-full border-8 border-emerald-500/20 flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-8 border-emerald-500 rounded-full border-t-transparent animate-spin-slow"></div>
                                    <span className="text-2xl text-white font-bold">96%</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400">Keyword Match: Structured Execution</div>
                                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400">Skill Alignment: High</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: PHILOSOPHICAL QUOTE */}
            <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                    <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                        {t('job_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('job_quote_author')}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
