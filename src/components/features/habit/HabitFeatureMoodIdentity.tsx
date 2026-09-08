'use client';

import React from 'react';

interface HabitFeatureMoodIdentityProps {
    t: any;
}

export default function HabitFeatureMoodIdentity({ t }: HabitFeatureMoodIdentityProps) {
    return (
        <>
            {/* SECTION 4: MOOD CORRELATION */}
            <section className="py-24 bg-white bg-pattern-dots relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                    <div className="relative animate-in zoom-in-95 duration-700 text-left">
                        <div className="absolute -inset-4 bg-indigo-50 rounded-[4rem] -z-10"></div>
                        <div className="grid grid-cols-2 gap-6 relative">
                            <div className="bg-yellow-50 p-8 rounded-[2.5rem] border border-yellow-100 flex flex-col items-center text-center shadow-sm transform hover:-translate-y-2 transition duration-500">
                                <span className="text-5xl mb-6 font-black">😊</span>
                                <span className="text-lg font-bold text-yellow-800">{t('habit_mood_stat_1_title')}</span>
                                <span className="text-xs text-yellow-600/70 mt-2">{t('habit_mood_stat_1_desc')}</span>
                            </div>
                            <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col items-center text-center shadow-sm transform hover:-translate-y-2 transition duration-500 delay-100">
                                <span className="text-5xl mb-6 font-black">💤</span>
                                <span className="text-lg font-bold text-blue-800">{t('habit_mood_stat_2_title')}</span>
                                <span className="text-xs text-blue-600/70 mt-2">{t('habit_mood_stat_2_desc')}</span>
                            </div>
                            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center col-span-2 shadow-sm">
                                <div className="w-full flex justify-between items-center mb-6">
                                    <div className="text-left">
                                        <span className="text-2xl text-indigo-900 leading-tight block font-bold">{t('habit_mood_correlation_title')}</span>
                                        <span className="text-xs text-indigo-600 uppercase tracking-widest mt-1 font-bold">{t('habit_mood_correlation_badge')}</span>
                                    </div>
                                    <span className="text-xl bg-white text-indigo-600 px-4 py-2 rounded-2xl shadow-sm font-black">+24%</span>
                                </div>
                                <div className="w-full h-3 bg-indigo-200 rounded-full overflow-hidden mb-6">
                                    <div className="w-[85%] h-full bg-indigo-600 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-both"></div>
                                </div>
                                <p className="text-sm text-indigo-800/80 font-medium italic">"{t('habit_mood_insight')}"</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-left animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-sm font-black">🧠</div>
                        <h2 className="text-4xl md:text-5xl text-gray-900 mb-8 leading-tight font-black">{t('habit_mood_title')}</h2>
                        <p className="text-gray-600 text-xl mb-10 leading-relaxed font-medium">
                            {t('habit_mood_desc')}
                        </p>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-sm shadow-sm font-black">👤</div>
                                    ))}
                                </div>
                                <p className="text-gray-500 font-bold text-sm">{t('habit_mood_social_proof')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3.5: IDENTITY BRIDGE (STACKED CARDS) */}
            <section className="py-20 lg:py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        
                        {/* Left Side: Copywriting */}
                        <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] uppercase tracking-[0.2em] mb-6 lg:mb-8 shadow-sm border border-orange-200">
                                {t('habit_identity_badge')}
                            </div>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-6 lg:mb-8 leading-tight tracking-tight font-black">
                                {t('habit_identity_title')}
                            </h2>
                            <p className="text-gray-600 text-lg lg:text-xl leading-relaxed font-medium mb-10 lg:mb-12">
                                {t('habit_identity_desc')}
                            </p>
                            
                            {/* Side Cards List */}
                            <div className="grid gap-4 lg:gap-6 text-left">
                                <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 lg:gap-6 items-center group hover:bg-orange-600 transition duration-500 hover:shadow-xl hover:scale-[1.02] lg:hover:scale-105 cursor-pointer">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex-shrink-0 flex items-center justify-center text-xl group-hover:bg-white/20 group-hover:text-white transition font-black">🏠</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 group-hover:text-white transition text-sm lg:text-base">{t('habit_card_1_title')}</h4>
                                        <p className="text-gray-500 text-xs lg:text-sm font-medium group-hover:text-orange-100 transition">{t('habit_card_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 lg:gap-6 items-center group hover:bg-orange-600 transition duration-500 hover:shadow-xl hover:scale-[1.02] lg:hover:scale-105 cursor-pointer">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex-shrink-0 flex items-center justify-center text-xl group-hover:bg-white/20 group-hover:text-white transition font-black">⏱️</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 group-hover:text-white transition text-sm lg:text-base">{t('habit_card_2_title')}</h4>
                                        <p className="text-gray-500 text-xs lg:text-sm font-medium group-hover:text-orange-100 transition">{t('habit_card_2_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Visual Stack */}
                        <div className="flex-1 relative w-full h-[350px] lg:h-[500px] mt-10 lg:mt-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="absolute w-[85%] lg:w-[80%] h-56 lg:h-64 bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border border-gray-100 transform rotate-[-4deg] lg:rotate-[-6deg] translate-y-12 lg:translate-y-20 opacity-40 blur-3xl lg:blur-sm"></div>
                                <div className="absolute w-[90%] lg:w-[85%] h-56 lg:h-64 bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border border-gray-100 transform rotate-[-2deg] lg:rotate-[-3deg] translate-y-6 lg:translate-y-10 opacity-70"></div>
                                <div className="absolute w-full lg:w-[90%] h-56 lg:h-64 bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_20px_50px_rgba(249,115,22,0.12)] lg:shadow-[0_30px_60px_rgba(249,115,22,0.15)] border border-orange-100 flex flex-col items-center justify-center p-8 lg:p-12 text-center group hover:-translate-y-2 lg:hover:-translate-y-4 transition duration-700 z-10">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-orange-500 rounded-2xl lg:rounded-3xl flex items-center justify-center text-3xl lg:text-4xl text-white mb-4 lg:mb-6 shadow-xl shadow-orange-200 group-hover:rotate-12 transition duration-500 font-black">
                                        ⭐
                                    </div>
                                    <h3 className="text-xl lg:text-2xl text-gray-900 mb-2 font-black">{t('habit_card_3_title')}</h3>
                                    <p className="text-gray-500 text-sm lg:text-base font-medium leading-relaxed">{t('habit_card_3_desc')}</p>
                                    
                                    <div className="absolute top-6 right-6 lg:top-8 lg:right-8 text-orange-400 animate-pulse text-lg">✨</div>
                                    <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 text-orange-400 animate-pulse delay-700 text-lg">✨</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
