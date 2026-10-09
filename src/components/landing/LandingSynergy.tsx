'use client';

import { useTranslations } from 'next-intl';

export default function LandingSynergy() {
    const t = useTranslations();

    const flowSteps = [
        { icon: '🎯', title: 'flow_step_1_title', desc: 'flow_step_1_desc' },
        { icon: '⚙️', title: 'flow_step_2_title', desc: 'flow_step_2_desc' },
        { icon: '🌱', title: 'flow_step_3_title', desc: 'flow_step_3_desc' },
        { icon: '📔', title: 'flow_step_4_title', desc: 'flow_step_4_desc' }
    ];

    const synergies = [
        { icon: '🌱', title: 'home_synergy_step1_title', desc: 'home_synergy_step1_desc' },
        { icon: '💰', title: 'home_synergy_step2_title', desc: 'home_synergy_step2_desc' },
        { icon: '📅', title: 'home_synergy_step3_title', desc: 'home_synergy_step3_desc' }
    ];

    return (
        <>
            {/* SECTION 4: INTERACTION ENGINE (The Synergy) */}
            <section className="py-16 sm:py-28 lg:py-36 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-6 tracking-wider uppercase border border-indigo-200">
                            {t('flow_badge')}
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 sm:mb-8 leading-[1.1] font-black tracking-tight">
                            {t('home_flow_title')}
                        </h2>
                        <p className="text-slate-600 sm:text-slate-500 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('home_flow_desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 -z-0"></div>
                        
                        {flowSteps.map((step, idx) => (
                            <div key={idx} className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2rem] border border-slate-200 flex flex-col items-start text-left shadow-sm hover:shadow-xl transition-all duration-300 transform sm:hover:-translate-y-2 relative z-10">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold mb-6 sm:mb-8 text-xs sm:text-sm shadow-md">
                                    0{idx + 1}
                                </div>
                                <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{step.icon}</div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">{t(step.title)}</h3>
                                <p className="text-slate-600 sm:text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">{t(step.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4.1: DEEP SYNERGY ARCHITECTURE */}
            <section className="py-16 sm:py-28 lg:py-36 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-6 sm:mb-8 uppercase tracking-wider border border-indigo-100">
                                🔗 {t('home_synergy_badge')}
                            </div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 sm:mb-8 leading-[1.1] font-black tracking-tight">
                                {t('home_synergy_title')}
                            </h2>
                            <p className="text-slate-600 sm:text-slate-500 text-base sm:text-lg lg:text-xl font-medium leading-relaxed mb-8 sm:mb-12">
                                {t('home_synergy_desc')}
                            </p>

                            <div className="space-y-3 sm:space-y-4">
                                {synergies.map((synergy, idx) => (
                                    <div key={idx} className="flex gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] bg-slate-50/70 hover:bg-white transition-all border border-slate-100 sm:border-transparent sm:hover:border-slate-200 group items-center sm:items-start">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl sm:text-2xl shrink-0 group-hover:scale-110 transition">
                                            {synergy.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 tracking-tight">{t(synergy.title)}</h3>
                                            <p className="text-slate-600 sm:text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">{t(synergy.desc)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden py-8 max-w-sm sm:max-w-md mx-auto w-full">
                            {/* Synergy Sphere */}
                            <div className="aspect-square relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 rounded-full"></div>
                                <div className="absolute inset-6 sm:inset-8 border border-slate-200/50 rounded-full scale-100 animate-pulse"></div>
                                <div className="absolute inset-14 sm:inset-20 border border-slate-200/50 rounded-full scale-100"></div>
                                
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] flex items-center justify-center z-10 overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800"></div>
                                    <div className="relative z-10 text-4xl sm:text-5xl group-hover:scale-110 transition duration-700">🌌</div>
                                </div>

                                <div className="absolute top-2 sm:top-0 left-1/2 -translate-x-1/2 -translate-y-2 sm:-translate-y-4 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-xl sm:text-2xl animate-float-slow hover:scale-110 transition-transform">🌱</div>
                                <div className="absolute bottom-2 sm:bottom-0 left-1/2 -translate-x-1/2 translate-y-2 sm:translate-y-4 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-xl sm:text-2xl animate-float-slow hover:scale-110 transition-transform" style={{ animationDelay: '1.5s' }}>💰</div>
                                <div className="absolute left-2 sm:left-0 top-1/2 -translate-x-2 sm:-translate-x-4 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-xl sm:text-2xl animate-float-slow hover:scale-110 transition-transform" style={{ animationDelay: '2.5s' }}>📅</div>
                                <div className="absolute right-2 sm:right-0 top-1/2 translate-x-2 sm:translate-x-4 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-xl sm:text-2xl animate-float-slow hover:scale-110 transition-transform" style={{ animationDelay: '3.5s' }}>📔</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
