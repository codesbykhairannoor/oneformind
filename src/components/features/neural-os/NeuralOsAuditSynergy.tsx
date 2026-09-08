'use client';

import React from 'react';

interface NeuralOsAuditSynergyProps {
    t: any;
}

export default function NeuralOsAuditSynergy({ t }: NeuralOsAuditSynergyProps) {
    return (
        <>
            {/* SECTION 3: FRICTION AUDIT */}
            <section className="py-32 bg-white scroll-mt-20" id="audit">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        
                        <div className="lg:w-1/2 text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] mb-8 uppercase tracking-widest border border-emerald-100 font-bold">
                                {t('neural_audit_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-slate-900 mb-8 leading-tight font-black">
                                {t('neural_audit_title')}
                            </h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">
                                {t('neural_audit_desc')}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl mb-6 font-black">📉</div>
                                    <h3 className="text-xl text-slate-900 mb-4 tracking-wide font-black">{t('neural_audit_step1_title')}</h3>
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed">{t('neural_audit_step1_desc')}</p>
                                </div>
                                <div>
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl mb-6 font-black">🌍</div>
                                    <h3 className="text-xl text-slate-900 mb-4 tracking-wide font-black">{t('neural_audit_step2_title')}</h3>
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed">{t('neural_audit_step2_desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative text-left">
                            <div className="relative bg-slate-50 border border-slate-200 p-12 rounded-[3.5rem] shadow-inner">
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl transform rotate-3 hover:rotate-0 transition duration-700">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black">⚡</div>
                                        <span className="text-slate-900 tracking-tight font-bold">Audit Report: #482</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[70%]"></div>
                                        </div>
                                        <div className="h-4 w-[85%] bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[45%]"></div>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold italic pt-4">Identifying patterns from last 14 days...</p>
                                    </div>
                                </div>
                                {/* Decorative Elements */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 4: DEEP SYNERGY */}
            <section className="py-32 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] mb-6 tracking-widest border border-indigo-200 font-bold uppercase">
                            {t('neural_synergy_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl text-slate-900 mb-8 leading-tight font-black">
                            {t('neural_synergy_title')}
                        </h2>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed mb-0">
                            {t('neural_synergy_desc')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 relative text-left">
                        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-default">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition font-black select-none">💰</div>
                            <h3 className="text-2xl text-slate-900 mb-4 font-black">{t('neural_synergy_fin_title')}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed">{t('neural_synergy_fin_desc')}</p>
                        </div>
                        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-default">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition font-black select-none">🌱</div>
                            <h3 className="text-2xl text-slate-900 mb-4 font-black">{t('neural_synergy_hab_title')}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed">{t('neural_synergy_hab_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: AI GROWTH COACH */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        
                        <div className="order-2 lg:order-1 relative">
                            {/* Chat Simulation */}
                            <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-8 shadow-inner overflow-hidden max-w-md mx-auto text-left">
                                <div className="space-y-6">
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] text-slate-400 uppercase tracking-widest ml-3 mb-1 font-bold">{t('neural_coach_sender')}</span>
                                        <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tl-none text-sm font-medium shadow-lg shadow-indigo-100 leading-relaxed">
                                            "{t('neural_coach_msg1')}"
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] text-slate-400 uppercase tracking-widest mr-3 mb-1 font-bold">{t('neural_coach_user')}</span>
                                        <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tr-none text-sm font-bold shadow-sm">
                                            "{t('neural_coach_msg2')}"
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start translate-x-2">
                                        <span className="text-[9px] text-slate-400 uppercase tracking-widest ml-3 mb-1 font-bold">{t('neural_coach_sender')}</span>
                                        <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tl-none text-sm font-medium shadow-lg shadow-emerald-100 leading-relaxed animate-pulse">
                                            "{t('neural_coach_msg3')}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-[10px] mb-8 uppercase tracking-widest border border-purple-100 font-bold">
                                {t('neural_coach_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-slate-900 mb-8 leading-tight font-black">
                                {t('neural_coach_title')}
                            </h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">
                                {t('neural_coach_desc')}
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 text-slate-700 font-bold">
                                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">●</span>
                                    {t('neural_coach_feat1')}
                                </li>
                                <li className="flex items-center gap-4 text-slate-700 font-bold">
                                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">●</span>
                                    {t('neural_coach_feat2')}
                                </li>
                                <li className="flex items-center gap-4 text-slate-700 font-bold">
                                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">●</span>
                                    {t('neural_coach_feat3')}
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
