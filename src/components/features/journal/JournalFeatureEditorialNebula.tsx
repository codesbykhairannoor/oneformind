'use client';

import React from 'react';

interface JournalFeatureEditorialNebulaProps {
    t: any;
}

export default function JournalFeatureEditorialNebula({ t }: JournalFeatureEditorialNebulaProps) {
    return (
        <>
            {/* SECTION 2: EDITORIAL REFLECTION (SERIF & CLEAN) */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-10">
                        {t('journal_editorial_badge')}
                    </div>
                    <h2 className="text-[42px] leading-[1.1] md:text-7xl font-serif italic text-gray-900 mb-10 tracking-tight font-black">
                        {t('journal_editorial_title')}
                    </h2>
                    <p className="text-gray-500 text-xl font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
                        {t('journal_editorial_desc')}
                    </p>
                    
                    {/* Visual: Premium Paper Mockup */}
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-8 bg-gradient-to-b from-gray-50 to-transparent rounded-[4rem] -z-10 opacity-50 group-hover:opacity-100 transition duration-700"></div>
                        <div className="bg-white p-12 md:p-24 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[4rem]"></div>
                            <div className="font-serif text-2xl md:text-4xl text-gray-800 leading-[1.6] space-y-10 relative z-10 font-black">
                                <p className="border-b border-gray-100 pb-6">{t('journal_editorial_card_p1')}</p>
                                <p className="border-b border-gray-100 pb-6 text-gray-300">{t('journal_editorial_card_p2')}</p>
                                <div className="w-1.5 h-10 bg-indigo-600 animate-pulse inline-block align-middle ml-1 rounded-full"></div>
                            </div>
                        </div>
                        {/* Decorative element: Fountain pen nib */}
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl transform rotate-12 group-hover:rotate-0 transition duration-500 border-4 border-white font-black select-none">🖋️</div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: THE MOOD NEBULA */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-purple-200/40 rounded-full blur-3xl -mr-96 -mt-96 animate-pulse"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="relative animate-in zoom-in-95 duration-1000">
                                {/* Outer Glow */}
                                <div className="absolute inset-0 blur-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full"></div>

                                {/* Main Circle */}
                                <div className="relative w-full aspect-square max-w-lg mx-auto bg-white/70 rounded-full p-12 flex items-center justify-center border border-white/40 shadow-[0_40px_120px_rgba(0,0,0,0.15)] group">
                                    
                                    {/* Rotating Gradient */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-pink-500/20 opacity-70 group-hover:opacity-100 transition duration-700 animate-spin-slow"></div>

                                    {/* Content */}
                                    <div className="relative z-10 text-center">
                                        <span className="text-8xl mb-6 block group-hover:scale-125 transition duration-700 drop-shadow-2xl font-black select-none">✨</span>
                                        <h4 className="text-3xl font-black text-gray-800 mb-2">{t('journal_nebula_harmony')}</h4>
                                        <p className="text-gray-500 uppercase tracking-[0.35em] text-xs font-bold">{t('journal_nebula_sentiment')}</p>
                                    </div>

                                    {/* Orbit Rings */}
                                    <div className="absolute inset-6 border border-white/40 rounded-full"></div>
                                    <div className="absolute inset-16 border border-white/30 rounded-full"></div>

                                    {/* Floating Dots */}
                                    <div className="absolute top-1/4 right-10 w-5 h-5 bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.8)] animate-bounce border-4 border-white"></div>
                                    <div className="absolute bottom-1/4 left-10 w-5 h-5 bg-purple-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)] animate-bounce delay-150 border-4 border-white"></div>
                                    <div className="absolute top-1/2 left-6 w-4 h-4 bg-pink-500 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.8)] animate-pulse border-4 border-white"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                                {t('journal_nebula_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-white mb-10 leading-tight font-black">
                                {t('journal_nebula_title')}
                            </h2>
                            <p className="text-white/80 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl font-medium">
                                {t('journal_nebula_desc')}
                            </p>
                            <div className="grid gap-8">
                                <div className="flex items-start gap-8 p-8 rounded-[2.5rem] bg-white hover:shadow-2xl transition duration-500 group border border-gray-100">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition font-black select-none">🔮</div>
                                    <div>
                                        <h4 className="text-xl text-gray-900 mb-2 font-black">{t('journal_nebula_feature_1_title')}</h4>
                                        <p className="text-gray-500 font-medium">{t('journal_nebula_feature_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-8 p-8 rounded-[2.5rem] bg-white hover:shadow-2xl transition duration-500 group border border-gray-100">
                                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition font-black select-none">🌈</div>
                                    <div>
                                        <h4 className="text-xl text-gray-900 mb-2 font-black">{t('journal_nebula_feature_2_title')}</h4>
                                        <p className="text-gray-500 font-medium">{t('journal_nebula_feature_2_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
