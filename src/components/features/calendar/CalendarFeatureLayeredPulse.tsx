'use client';

import React from 'react';

interface CalendarFeatureLayeredPulseProps {
    t: any;
}

export default function CalendarFeatureLayeredPulse({ t }: CalendarFeatureLayeredPulseProps) {
    return (
        <>
            {/* SECTION 2: LAYERED TIME (3D STACK) */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <div className="flex-1 text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-100">
                                {t('calendar_layered_badge')}
                            </div>
                            <h2 className="text-6xl leading-[1.1] md:text-7xl text-gray-900 mb-10 tracking-tight font-black">
                                {t('calendar_layered_title')}
                            </h2>
                            <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">
                                {t('calendar_layered_desc')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition font-black">💼</div>
                                    <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('calendar_layered_feature_1_title')}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{t('calendar_layered_feature_1_desc')}</p>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-2 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition"></div>
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition font-black">🌿</div>
                                    <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('calendar_layered_feature_2_title')}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">{t('calendar_layered_feature_2_desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full perspective-3000">
                            <div className="relative h-[550px] flex items-center justify-center group/visual">
                                
                                {/* Social Layer (Bottom) */}
                                <div className="absolute w-full max-w-sm aspect-[4/3] bg-purple-500/10 border border-purple-500/20 rounded-[3rem] transform -rotate-[15deg] translate-y-24 translate-x-24 group-hover/visual:translate-y-32 group-hover/visual:translate-x-32 transition duration-1000">
                                    <div className="p-10 opacity-30">
                                        <div className="w-1/2 h-6 bg-purple-500/30 rounded-full mb-6"></div>
                                        <div className="w-full h-32 bg-purple-500/20 rounded-[2rem]"></div>
                                    </div>
                                </div>

                                {/* Personal Layer (Middle) */}
                                <div className="absolute w-full max-w-sm aspect-[4/3] bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] transform -rotate-[8deg] translate-y-12 translate-x-12 z-10 group-hover/visual:translate-y-16 group-hover/visual:translate-x-16 transition duration-1000 delay-75">
                                    <div className="p-10 opacity-60">
                                        <div className="w-1/3 h-6 bg-emerald-500/30 rounded-full mb-6"></div>
                                        <div className="w-2/3 h-6 bg-emerald-500/10 rounded-full mb-10"></div>
                                        <div className="flex gap-6">
                                            <div className="w-16 h-16 bg-emerald-500/30 rounded-2xl"></div>
                                            <div className="w-16 h-16 bg-emerald-500/30 rounded-2xl"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Layer (Top) */}
                                <div className="absolute w-full max-w-sm aspect-[4/3] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)] border border-gray-100 z-20 p-12 transform hover:scale-105 transition duration-700 shadow-indigo-100/50 text-left">
                                    <div className="flex justify-between items-center mb-12">
                                        <h4 className="font-black text-gray-900 text-2xl tracking-tighter uppercase">{t('calendar_layered_card_title')}</h4>
                                        <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-300 transform -rotate-12">💼</div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="h-20 bg-blue-50/50 border-l-[6px] border-blue-500 p-6 rounded-r-2xl relative overflow-hidden">
                                            <div className="absolute right-4 top-4 w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                            <div className="mb-2">
                                                <span className="text-[11px] text-blue-600 uppercase tracking-widest">{t('calendar_layered_card_event_1_time')}</span>
                                            </div>
                                            <p className="text-lg text-blue-900 leading-none tracking-tight">{t('calendar_layered_card_event_1_title')}</p>
                                        </div>
                                        <div className="h-20 bg-indigo-50/50 border-l-[6px] border-indigo-500 p-6 rounded-r-2xl opacity-40">
                                            <p className="text-[11px] text-indigo-400 uppercase mb-2 tracking-widest">{t('calendar_layered_card_event_2_time')}</p>
                                            <p className="text-lg text-indigo-900 leading-none tracking-tight">{t('calendar_layered_card_event_2_title')}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: DEADLINE PULSE (DARK MODE URGENCY) */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:50px_50px] opacity-[0.05]"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <span className="text-rose-500 uppercase tracking-[0.5em] text-xs mb-6 block">{t('calendar_pulse_badge')}</span>
                        <h2 className="text-5xl md:text-7xl mb-10 tracking-tight font-black">{t('calendar_pulse_title')}</h2>
                        <p className="text-indigo-100 text-xl opacity-80 leading-relaxed font-medium">{t('calendar_pulse_desc')}</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Pulse List */}
                        <div className="space-y-8 text-left">
                            {/* Item 1: CRITICAL */}
                            <div className="bg-white/5 border-2 border-rose-500/40 rounded-[2.5rem] p-10 flex items-center justify-between group hover:bg-rose-500/10 transition duration-500 hover:shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent"></div>
                                <div className="flex items-center gap-8 relative z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-30"></div>
                                        <div className="w-20 h-20 bg-rose-500 text-white rounded-[2rem] flex items-center justify-center text-4xl relative z-10 shadow-2xl shadow-rose-500/40 transform group-hover:rotate-12 transition group-hover:scale-110 font-black">!</div>
                                    </div>
                                    <div>
                                        <h4 className="text-3xl text-white mb-2 font-black">{t('calendar_pulse_item_1_title')}</h4>
                                        <p className="text-rose-400 uppercase tracking-[0.2em] text-[11px] bg-rose-500/10 inline-block px-3 py-1 rounded-full border border-rose-500/20">{t('calendar_pulse_item_1_status')}</p>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block relative z-10">
                                    <p className="text-4xl text-white tabular-nums font-black">{t('calendar_pulse_item_1_timer')}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{t('calendar_pulse_item_1_sub')}</p>
                                </div>
                            </div>

                            {/* Item 2: NORMAL */}
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex items-center justify-between group hover:bg-indigo-600/10 transition duration-500 border-l-4 border-l-indigo-500">
                                <div className="flex items-center gap-8 opacity-60 group-hover:opacity-100 transition">
                                    <div className="w-20 h-20 bg-slate-800 text-slate-400 rounded-[2rem] flex items-center justify-center text-4xl group-hover:bg-indigo-600 group-hover:text-white transition duration-700 font-black">?</div>
                                    <div>
                                        <h4 className="text-3xl text-white mb-2 tracking-tight font-black">{t('calendar_pulse_item_2_title')}</h4>
                                        <p className="text-indigo-400 tracking-[0.2em] text-[11px] uppercase">{t('calendar_pulse_item_2_status')}</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-right">
                                    <span className="text-white/20 text-4xl font-black">⚓</span>
                                </div>
                            </div>
                        </div>

                        {/* Radar sweep */}
                        <div className="relative hidden lg:flex items-center justify-center p-12">
                            <div className="w-full aspect-square max-md border-2 border-indigo-500/20 rounded-full flex items-center justify-center relative shadow-[0_0_100px_rgba(79,70,229,0.1)]">
                                <div className="absolute inset-0 bg-indigo-500/[0.02] rounded-full animate-pulse"></div>
                                <div className="w-3/4 h-3/4 border border-indigo-500/20 rounded-full flex items-center justify-center">
                                    <div className="w-1/2 h-1/2 border-2 border-rose-500/30 rounded-full animate-ping duration-1000"></div>
                                </div>
                                
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-transparent to-transparent rounded-full animate-spin-slow opacity-40"></div>
                                
                                <div className="absolute top-[15%] right-[25%] w-6 h-6 bg-rose-500 rounded-full shadow-[0_0_40px_rgba(244,63,94,1)] animate-pulse border-4 border-slate-950"></div>
                                <div className="absolute bottom-[30%] left-[20%] w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.8)] border-2 border-slate-950"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
