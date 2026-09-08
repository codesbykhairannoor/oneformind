'use client';

import { useTranslations } from 'next-intl';

export default function LandingScienceMatrix() {
    const t = useTranslations();

    return (
        <section className="py-32 bg-slate-950 relative overflow-hidden border-y border-slate-800/80">
            {/* Ambient Grid & Glow */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-[10px] mb-6 uppercase tracking-[0.25em] border border-indigo-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Cognitive Architecture
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl text-white font-[900] tracking-tight leading-[1.15] mb-6">
                        {t('home_science_title_1')} <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{t('home_science_title_highlight')}</span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                        Tranvas is built upon verified cognitive neuroscience and behavioral economics frameworks—engineered to eliminate cognitive friction and sustain peak execution.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Bento Card 1: Habit Automaticity */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    {t('home_science_card1_tag')}
                                </span>
                                <span className="text-2xl">🌱</span>
                            </div>
                            <div className="text-4xl lg:text-5xl font-[900] text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                                {t('home_science_card1_stat')}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                {t('home_science_card1_desc')}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-500 italic">
                                {t('home_science_card1_author')}
                            </span>
                        </div>
                    </div>

                    {/* Bento Card 2: Attention Residue */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    {t('home_science_card2_tag')}
                                </span>
                                <span className="text-2xl">⚡</span>
                            </div>
                            <div className="text-4xl lg:text-5xl font-[900] text-white tracking-tight mb-2 group-hover:text-indigo-300 transition-colors">
                                {t('home_science_card2_stat')}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                {t('home_science_card2_desc')}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-500 italic">
                                {t('home_science_card2_author')}
                            </span>
                        </div>
                    </div>

                    {/* Bento Card 3: Goal Achievement */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                    {t('home_science_card3_tag')}
                                </span>
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div className="text-4xl lg:text-5xl font-[900] text-white tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
                                {t('home_science_card3_stat')}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                {t('home_science_card3_desc')}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-500 italic">
                                {t('home_science_card3_author')}
                            </span>
                        </div>
                    </div>

                    {/* Bento Card 4: Mental Accounting */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                    {t('home_science_card4_tag')}
                                </span>
                                <span className="text-2xl">💰</span>
                            </div>
                            <div className="text-4xl lg:text-5xl font-[900] text-white tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                                {t('home_science_card4_stat')}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                                {t('home_science_card4_desc')}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-500 italic">
                                {t('home_science_card4_author')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
