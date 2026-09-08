'use client';

import React from 'react';

interface JobFeatureFunnelMatrixProps {
    t: any;
}

export default function JobFeatureFunnelMatrix({ t }: JobFeatureFunnelMatrixProps) {
    return (
        <>
            {/* SECTION 2: OPPORTUNITY FUNNEL (PIPELINE VISUAL) */}
            <section id="how-it-works" className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-100">
                                {t('job_funnel_badge')}
                            </div>
                            <h2 className="text-6xl leading-[1.1] md:text-7xl text-gray-900 mb-10 tracking-tight font-black">
                                {t('job_funnel_title')}
                            </h2>
                            <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">
                                {t('job_funnel_desc')}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-2xl transition duration-500 cursor-default">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl group-hover:rotate-6 transition font-black">📩</div>
                                        <span className="font-black text-gray-900 uppercase tracking-tighter">{t('job_funnel_label_1')}</span>
                                    </div>
                                    <span className="text-2xl text-indigo-600 font-black">{t('job_funnel_stat_1')}</span>
                                </div>
                                <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-2xl transition duration-500 cursor-default">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:rotate-6 transition font-black">🤝</div>
                                        <span className="font-black text-gray-900 uppercase tracking-tighter">{t('job_funnel_label_2')}</span>
                                    </div>
                                    <span className="text-2xl text-purple-600 font-black">{t('job_funnel_stat_2')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <div className="relative py-12 flex flex-col items-center">
                                <div className="w-full space-y-4 relative z-10 text-left">
                                    {/* Applied Stage */}
                                    <div className="w-full bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl transform hover:scale-[1.02] transition duration-500 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                                        <div className="flex justify-between items-center text-white">
                                            <div>
                                                <h4 className="text-xs uppercase tracking-widest opacity-70 mb-2">{t('job_funnel_stage_1_label')}</h4>
                                                <p className="text-2xl tracking-tight font-black">{t('job_funnel_stage_1_title')}</p>
                                            </div>
                                            <span className="text-5xl opacity-30 italic font-black">{t('job_funnel_stage_1_stat')}</span>
                                        </div>
                                    </div>

                                    {/* Interview Stage */}
                                    <div className="w-[90%] mx-auto bg-purple-600 p-8 rounded-[2.5rem] shadow-xl transform hover:scale-[1.02] transition duration-500 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                                        <div className="flex justify-between items-center text-white">
                                            <div>
                                                <h4 className="text-xs uppercase tracking-widest opacity-70 mb-2">{t('job_funnel_stage_2_label')}</h4>
                                                <p className="text-2xl tracking-tight font-black">{t('job_funnel_stage_2_title')}</p>
                                            </div>
                                            <span className="text-5xl opacity-30 italic font-black">{t('job_funnel_stage_2_stat')}</span>
                                        </div>
                                    </div>

                                    {/* Final Stage */}
                                    <div className="w-[75%] mx-auto bg-emerald-600 p-8 rounded-[2.5rem] shadow-lg transform hover:scale-[1.02] transition duration-500 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                                        <div className="flex justify-between items-center text-white">
                                            <div>
                                                <h4 className="text-xs uppercase tracking-widest opacity-70 mb-2">{t('job_funnel_stage_3_label')}</h4>
                                                <p className="text-2xl tracking-tight font-black">{t('job_funnel_stage_3_title')}</p>
                                            </div>
                                            <span className="text-5xl opacity-30 italic font-black">{t('job_funnel_stage_3_stat')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: DECISION MATRIX (COMPARISON GRID) */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-24 items-center">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-6 relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">{t('job_matrix_axis_y_top')}</div>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">{t('job_matrix_axis_y_bottom')}</div>
                                <div className="absolute top-1/2 -left-12 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 transform -rotate-90 font-bold">{t('job_matrix_axis_x_left')}</div>
                                <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-xs uppercase tracking-[0.3em] text-gray-400 transform rotate-90 font-bold">{t('job_matrix_axis_x_right')}</div>
                                
                                <div className="aspect-square bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition">
                                    <span className="text-4xl mb-4 group-hover:scale-125 transition font-black">🏢</span>
                                    <p className="text-xs uppercase text-gray-400 font-bold">{t('job_matrix_cell_1')}</p>
                                </div>
                                
                                <div className="aspect-square bg-indigo-600 rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center text-center transform scale-105 relative">
                                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter font-bold">{t('job_matrix_cell_highlight')}</div>
                                    <span className="text-4xl mb-4 text-white font-black">🚀</span>
                                    <p className="text-xs uppercase text-indigo-100 font-bold">{t('job_matrix_cell_2')}</p>
                                </div>
                                
                                <div className="aspect-square bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition">
                                    <span className="text-4xl mb-4 group-hover:scale-125 transition font-black">🏡</span>
                                    <p className="text-xs uppercase text-gray-400 font-bold">{t('job_matrix_cell_3')}</p>
                                </div>
                                
                                <div className="aspect-square bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-200 transition">
                                    <span className="text-4xl mb-4 group-hover:scale-125 transition font-black">🧪</span>
                                    <p className="text-xs uppercase text-gray-400 font-bold">{t('job_matrix_cell_4')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs uppercase tracking-[0.2em] mb-8 shadow-2xl">
                                {t('job_matrix_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight tracking-tight font-black">
                                {t('job_matrix_title')}
                            </h2>
                            <p className="text-gray-600 text-xl mb-12 leading-relaxed font-medium">
                                {t('job_matrix_desc')}
                            </p>
                            <div className="grid gap-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition font-black">⚖️</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-2">{t('job_matrix_feature_title')}</h4>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{t('job_matrix_feature_desc')}</p>
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
