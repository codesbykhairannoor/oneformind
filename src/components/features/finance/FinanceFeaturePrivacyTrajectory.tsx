'use client';

import React from 'react';

interface FinanceFeaturePrivacyTrajectoryProps {
    t: any;
}

export default function FinanceFeaturePrivacyTrajectory({ t }: FinanceFeaturePrivacyTrajectoryProps) {
    return (
        <>
            {/* SECTION 4: PRIVACY & SECURITY */}
            <section className="py-32 bg-indigo-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-indigo-950 via-transparent to-indigo-950"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center px-6 py-2 bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
                        {t('finance_privacy_badge')}
                    </div>
                    <h2 className="text-5xl md:text-5xl text-white mb-6 font-black">{t('finance_privacy_title')}</h2>
                    <p className="text-indigo-200 text-xl max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
                        {t('finance_privacy_desc')}
                    </p>
                    
                    <div className="grid sm:grid-cols-3 gap-8 text-left">
                        <div className="bg-indigo-900/40 p-8 rounded-[2rem] border border-indigo-800/50 hover:bg-indigo-800/40 transition">
                            <div className="text-3xl mb-6 bg-indigo-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-indigo-700/50 font-black">🔒</div>
                            <h4 className="text-white font-bold text-xl mb-3">{t('finance_privacy_point_1_title')}</h4>
                            <p className="text-indigo-300">{t('finance_privacy_point_1_desc')}</p>
                        </div>
                        <div className="bg-indigo-900/40 p-8 rounded-[2rem] border border-indigo-800/50 hover:bg-indigo-800/40 transition">
                            <div className="text-3xl mb-6 bg-indigo-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-indigo-700/50 font-black">🚫</div>
                            <h4 className="text-white font-bold text-xl mb-3">{t('finance_privacy_point_2_title')}</h4>
                            <p className="text-indigo-300">{t('finance_privacy_point_2_desc')}</p>
                        </div>
                        <div className="bg-indigo-900/40 p-8 rounded-[2rem] border border-indigo-800/50 hover:bg-indigo-800/40 transition">
                            <div className="text-3xl mb-6 bg-indigo-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-indigo-700/50 font-black">🤝</div>
                            <h4 className="text-white font-bold text-xl mb-3">{t('finance_privacy_point_3_title')}</h4>
                            <p className="text-indigo-300">{t('finance_privacy_point_3_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: WEALTH TRAJECTORY */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-emerald-200">
                            {t('finance_trajectory_badge')}
                        </div>
                        <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                            {t('finance_trajectory_title')}
                        </h2>
                        <p className="text-gray-600 text-xl leading-relaxed font-medium">
                            {t('finance_trajectory_desc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20 text-left">
                        {/* Trajectory Card 1 */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] group-hover:scale-110 transition duration-700"></div>
                            <div className="relative z-10">
                                <span className="text-emerald-500 text-4xl mb-6 block font-black">📈</span>
                                <h4 className="text-gray-400 uppercase tracking-widest text-[11px] mb-2">{t('finance_stat_projection_title')}</h4>
                                <p className="text-4xl text-gray-900 tabular-nums font-black">{t('finance_stat_projection_val')}</p>
                                <div className="mt-6 w-full h-1 bg-emerald-100 rounded-full">
                                    <div className="w-2/3 h-full bg-emerald-500 rounded-full animate-in slide-in-from-left duration-1000"></div>
                                </div>
                            </div>
                        </div>

                        {/* Trajectory Card 2 */}
                        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-800 transform md:-translate-y-4 group relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10 text-white">
                                <span className="text-indigo-400 text-4xl mb-6 block font-black">🎯</span>
                                <h4 className="text-indigo-300/40 uppercase tracking-widest text-[11px] mb-2">{t('finance_stat_savings_title')}</h4>
                                <p className="text-4xl text-white tabular-nums font-black">{t('finance_stat_savings_val')}</p>
                                <div className="mt-8 flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-300 text-[10px] uppercase tracking-widest animate-pulse">
                                    On Track to Achieve
                                </div>
                            </div>
                        </div>

                        {/* Trajectory Card 3 */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[4rem] group-hover:scale-110 transition duration-700"></div>
                            <div className="relative z-10">
                                <span className="text-amber-500 text-4xl mb-6 block font-black">🏖️</span>
                                <h4 className="text-gray-400 uppercase tracking-widest text-[11px] mb-2">{t('finance_stat_freedom_title')}</h4>
                                <p className="text-4xl text-gray-900 tabular-nums font-black">{t('finance_stat_freedom_val')}</p>
                                <p className="mt-4 text-gray-400 text-xs font-medium">{t('finance_fire_date_label')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Growth Visualization Line */}
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden animate-in zoom-in-95 duration-700">
                        <div className="flex justify-between items-end mb-12 text-left">
                            <div>
                                <h3 className="text-2xl text-gray-900 mb-2 font-black">{t('finance_compound_title')}</h3>
                                <p className="text-gray-500 text-sm font-medium">{t('finance_compound_desc')}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                                    <span className="text-[10px] uppercase text-gray-400">{t('finance_compound_legend_1')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
                                    <span className="text-[10px] uppercase text-gray-400">{t('finance_compound_legend_2')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative h-48 w-full flex items-end gap-[2%]">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="flex-1 bg-indigo-50 rounded-t-lg relative group transition-all duration-500 hover:bg-indigo-100" style={{ height: `${20 + i * 4}%` }}>
                                    <div className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded-t-lg transition-all duration-1000" style={{ height: `${10 + i * 3.5}%` }}></div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
                                        Year {2024 + i}: Rp {10 + i * 15}M
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
