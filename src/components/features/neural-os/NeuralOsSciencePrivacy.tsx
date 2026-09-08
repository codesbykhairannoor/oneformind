'use client';

import React from 'react';

interface NeuralOsSciencePrivacyProps {
    t: any;
}

export default function NeuralOsSciencePrivacy({ t }: NeuralOsSciencePrivacyProps) {
    return (
        <>
            {/* SECTION 5.5: SCIENTIFIC FOUNDATION (ULTRADIAN RHYTHMS & BASAL GANGLIA CHUNKING) */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden border-y border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-[10px] uppercase tracking-[0.25em] mb-6 border border-indigo-500/20">
                            🧬 {t('neural_science_badge')}
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight mb-6">
                            {t('neural_science_title_1')}{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                                {t('neural_science_title_highlight')}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('neural_science_desc')}
                        </p>
                    </div>

                    {/* Cybernetic Neural Science Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Grid 1: Ultradian Rhythms */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 hover:border-indigo-500/40 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl font-black">
                                        🌊
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-mono">
                                        Kleitman & Rossi BRAC
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-indigo-300 transition-colors">
                                    {t('neural_science_grid1_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('neural_science_grid1_desc')}
                                </p>
                            </div>
                            
                            {/* Ultradian Wave Diagram */}
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping"></div>
                                    <span className="text-xs font-bold text-slate-300">Cognitive Wave Cycle</span>
                                </div>
                                <span className="text-xs font-black text-indigo-400">90m Focus / 20m Rest</span>
                            </div>
                        </div>

                        {/* Grid 2: MIT Basal Ganglia Chunking */}
                        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 hover:border-cyan-500/40 p-8 lg:p-10 rounded-[2.5rem] flex flex-col justify-between group transition duration-500 shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl font-black">
                                        ⚡
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 font-mono">
                                        MIT McGovern Institute
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-300 transition-colors">
                                    {t('neural_science_grid2_title')}
                                </h3>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                                    {t('neural_science_grid2_desc')}
                                </p>
                            </div>
                            
                            {/* Habit Chunking Circuit */}
                            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-300">PFC Energy Conserved</span>
                                </div>
                                <span className="text-xs font-black text-cyan-400">Automatic Execution</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: PRIVACY & SECURITY */}
            <section className="py-32 bg-slate-950 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] tracking-widest mb-10 border border-white/10 font-bold uppercase">
                        🛡️ {t('neural_privacy_badge')}
                    </div>
                    <h2 className="text-4xl md:text-6xl text-white mb-10 tracking-tight font-black">{t('neural_privacy_title')}</h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed mb-14">
                        {t('neural_privacy_desc')}
                    </p>
                    <div className="inline-block px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-indigo-400 tracking-[0.4em] uppercase font-black">
                        {t('neural_privacy_stat')}
                    </div>
                </div>
                
                {/* Decorative Mesh */}
                <div className="absolute inset-0 bg-pattern-grid opacity-10 pointer-events-none"></div>
            </section>
        </>
    );
}
