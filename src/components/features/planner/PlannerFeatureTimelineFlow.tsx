'use client';

import React from 'react';

interface PlannerFeatureTimelineFlowProps {
    t: any;
}

export default function PlannerFeatureTimelineFlow({ t }: PlannerFeatureTimelineFlowProps) {
    return (
        <>
            {/* SECTION 2: THE DAILY TIMELINE */}
            <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                                {t('planner_timeline_badge')}
                            </div>
                            <h2 className="text-5xl text-gray-900 mb-8 leading-tight font-black">
                                {t('planner_timeline_title')}
                            </h2>
                            <p className="text-gray-600 text-xl mb-10 leading-relaxed max-w-xl font-medium">
                                {t('planner_timeline_desc')}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 transition duration-500">
                                    <span className="text-xs text-indigo-600 uppercase mb-2 block tracking-widest">{t('planner_timeline_stat_1_label')}</span>
                                    <span className="text-3xl text-slate-900 font-black">{t('planner_timeline_stat_1_value')}</span>
                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">{t('planner_timeline_stat_footer')}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-purple-100/50 transition duration-500">
                                    <span className="text-xs text-purple-600 uppercase mb-2 block tracking-widest">{t('planner_timeline_stat_2_label')}</span>
                                    <span className="text-3xl text-slate-900 font-black">{t('planner_timeline_stat_2_value')}</span>
                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">{t('planner_timeline_stat_footer')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full text-left animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                            <div className="bg-gray-50 rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-inner relative overflow-hidden group">
                                {/* Schedule Visual */}
                                <div className="space-y-8 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[13px] top-4 bottom-4 w-1 bg-gray-200 rounded-full group-hover:bg-indigo-100 transition duration-700"></div>

                                    {/* Time Block 1 */}
                                    <div className="flex gap-8 items-start relative z-10 transition duration-500 transform hover:-translate-y-1">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 border-4 border-white shadow-[0_0_15px_rgba(79,70,229,0.3)] shrink-0 mt-2 animate-pulse"></div>
                                        <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group-hover:shadow-xl transition duration-500 relative overflow-hidden">
                                            <div className="absolute right-0 top-0 w-1.5 h-full bg-indigo-600"></div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] text-indigo-600 uppercase tracking-[0.2em] font-bold">{t('planner_timeline_time_1')}</span>
                                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase font-bold">{t('planner_timeline_card_1_badge')}</span>
                                            </div>
                                            <h4 className="text-xl text-gray-900 mb-2 font-black">{t('planner_timeline_card_1_title')}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">{t('planner_timeline_card_1_desc')}</p>
                                        </div>
                                    </div>

                                    {/* Time Block 2 */}
                                    <div className="flex gap-8 items-start relative z-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500 transform hover:-translate-y-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 border-4 border-white shadow-sm shrink-0 mt-2"></div>
                                        <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold">{t('planner_timeline_time_2')}</span>
                                            </div>
                                            <h4 className="text-xl text-gray-900 mb-2 font-black">{t('planner_timeline_card_2_title')}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">{t('planner_timeline_card_2_desc')}</p>
                                        </div>
                                    </div>

                                    {/* Time Block 3 */}
                                    <div className="flex gap-8 items-start relative z-10 transition duration-500 transform hover:-translate-y-1">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 border-4 border-white shadow-[0_0_15px_rgba(147,51,234,0.3)] shrink-0 mt-2"></div>
                                        <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
                                            <div className="absolute right-0 top-0 w-1.5 h-full bg-purple-500"></div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] text-purple-600 uppercase tracking-[0.2em] font-bold">{t('planner_timeline_time_3')}</span>
                                                <span className="text-[10px] bg-purple-50 text-purple-700 px-3 py-1 rounded-full uppercase font-bold">{t('planner_timeline_card_3_badge')}</span>
                                            </div>
                                            <h4 className="text-xl text-gray-900 mb-2 font-black">{t('planner_timeline_card_3_title')}</h4>
                                            <p className="text-sm text-gray-500 leading-relaxed">{t('planner_timeline_card_3_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: MORNING TO NIGHT FLOW */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs mb-6 block">{t('planner_flow_badge')}</span>
                        <h2 className="text-4xl md:text-6xl mb-8 font-black">{t('planner_flow_title')}</h2>
                        <p className="text-indigo-100 text-xl opacity-80 leading-relaxed">{t('planner_flow_desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start text-left">
                        
                        {/* Morning */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:bg-white/10 transition duration-500 group relative overflow-hidden">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition"></div>
                            <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:rotate-6 transition font-black select-none">☀️</div>
                            <h3 className="text-3xl mb-6 font-black">{t('planner_flow_col_1_title')}</h3>
                            <p className="text-white/60 mb-10 text-lg leading-relaxed">{t('planner_flow_col_1_desc')}</p>
                            <div className="bg-emerald-500/20 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-emerald-500/30 text-emerald-300 inline-block animate-pulse font-bold">{t('planner_flow_col_1_status')}</div>
                        </div>

                        {/* Afternoon */}
                        <div className="bg-indigo-600/10 border-2 border-indigo-500/30 rounded-[3rem] p-12 hover:bg-indigo-600/20 transition duration-500 group relative md:-mt-8 shadow-2xl">
                            <div className="absolute inset-0 bg-indigo-500/5 -z-10 animate-pulse"></div>
                            <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition font-black select-none">⚡</div>
                            <h3 className="text-3xl mb-6 font-black">{t('planner_flow_col_2_title')}</h3>
                            <p className="text-indigo-100 opacity-80 mb-10 text-lg leading-relaxed">{t('planner_flow_col_2_desc')}</p>
                            <div className="bg-indigo-400/30 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-indigo-400/40 text-indigo-200 inline-block font-bold">{t('planner_flow_col_2_status')}</div>
                        </div>

                        {/* Night */}
                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:bg-white/10 transition duration-500 group relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition"></div>
                            <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:-rotate-6 transition font-black select-none">🌙</div>
                            <h3 className="text-3xl mb-6 font-black">{t('planner_flow_col_3_title')}</h3>
                            <p className="text-white/60 mb-10 text-lg leading-relaxed">{t('planner_flow_col_3_desc')}</p>
                            <div className="bg-purple-500/20 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-purple-500/30 text-purple-300 inline-block font-bold">{t('planner_flow_col_3_status')}</div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
