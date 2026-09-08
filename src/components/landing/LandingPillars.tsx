'use client';

import { useTranslations } from 'next-intl';

export default function LandingPillars() {
    const t = useTranslations();

    return (
        <section className="py-40 bg-white bg-pattern-grid scroll-mt-20" id="features">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-900 font-bold text-[10px] mb-8 tracking-[0.2em] uppercase border border-slate-200">
                        {t('pill_badge')}
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-8 font-[900] tracking-tight leading-[1.1]">
                        {t('home_pillars_title')}
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto">{t('home_pillars_desc')}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* CARD 1: FINANCE */}
                    <div className="group bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition duration-500 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition font-black">💰</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('pill_1_title')}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{t('pill_1_desc')}</p>
                    </div>

                    {/* CARD 2: HABITS */}
                    <div className="group bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition duration-500 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition font-black">🌱</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('pill_2_title')}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{t('pill_2_desc')}</p>
                    </div>

                    {/* CARD 3: PLANNER */}
                    <div className="group bg-slate-900 p-12 rounded-[2.5rem] border border-slate-800 hover:bg-slate-900 hover:shadow-2xl hover:shadow-slate-300 transition duration-500 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition font-black">📅</div>
                        <h3 className="text-2xl font-bold text-white mb-4">{t('pill_3_title')}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">{t('pill_3_desc')}</p>
                    </div>

                    {/* CARD 4: JOURNAL */}
                    <div className="group bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition duration-500 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition font-black">📔</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('pill_4_title')}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{t('pill_4_desc')}</p>
                    </div>

                    {/* CARD 5: GOALS */}
                    <div className="group bg-indigo-50/50 p-12 rounded-[2.5rem] border border-indigo-100/50 hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition duration-500 transform hover:-translate-y-2 lg:col-span-2 lg:flex lg:items-center lg:gap-12">
                       <div className="lg:shrink-0 lg:mb-0 mb-8">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center text-5xl group-hover:scale-110 transition font-black">🎯</div>
                       </div>
                       <div>
                            <h3 className="text-2xl lg:text-3xl text-indigo-950 mb-4 group-hover:text-white font-bold">{t('pill_5_title')}</h3>
                            <p className="text-indigo-900/60 font-medium leading-relaxed group-hover:text-indigo-50 text-lg">{t('pill_5_desc')}</p>
                       </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
