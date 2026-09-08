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
            <section className="py-40 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] mb-6 tracking-[0.2em] uppercase border border-indigo-200">
                            {t('flow_badge')}
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-8 leading-tight font-[900] tracking-tight">
                            {t('home_flow_title')}
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed opacity-70">{t('home_flow_desc')}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 -z-0"></div>
                        
                        {flowSteps.map((step, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[2rem] border border-slate-200 flex flex-col items-start text-left shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 relative z-10">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold mb-8 text-sm shadow-lg">
                                    0{idx + 1}
                                </div>
                                <div className="text-4xl mb-6">{step.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{t(step.title)}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed opacity-80">{t(step.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4.1: DEEP SYNERGY ARCHITECTURE */}
            <section className="py-40 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] mb-8 uppercase tracking-[0.2em] border border-indigo-100/50">
                                🔗 {t('home_synergy_badge')}
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-8 leading-[1.1] font-[900] tracking-tight">
                                {t('home_synergy_title')}
                            </h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 opacity-80">
                                {t('home_synergy_desc')}
                            </p>

                            <div className="space-y-4">
                                {synergies.map((synergy, idx) => (
                                    <div key={idx} className="flex gap-6 p-8 rounded-[2rem] bg-slate-50/50 hover:bg-white transition-all border border-transparent hover:border-slate-200 group">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                                            {synergy.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">{t(synergy.title)}</h3>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed opacity-70">{t(synergy.desc)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            {/* Synergy Sphere */}
                            <div className="aspect-square relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 rounded-full"></div>
                                <div className="absolute inset-8 border border-slate-200/50 rounded-full scale-100 animate-pulse"></div>
                                <div className="absolute inset-20 border border-slate-200/50 rounded-full scale-100"></div>
                                
                                <div className="relative w-40 h-40 bg-slate-900 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex items-center justify-center z-10 overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800"></div>
                                    <div className="relative z-10 text-5xl group-hover:scale-110 transition duration-700">🌌</div>
                                </div>

                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-2xl">🌱</div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-2xl">💰</div>
                                <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-2xl">📅</div>
                                <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-2xl">📔</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
