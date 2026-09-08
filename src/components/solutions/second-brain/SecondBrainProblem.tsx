'use client';

import { useTranslations } from 'next-intl';

export default function SecondBrainProblem() {
    const t = useTranslations();

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl mb-6 text-slate-900 leading-tight font-black">{t('brain_prob_title')}</h2>
                    <p className="text-xl text-slate-500 leading-relaxed mb-10 font-medium">{t('brain_prob_desc')}</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0 mt-1 select-none">🌪️</div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{t('brain_prob_1_title')}</h3>
                                <p className="text-sm text-slate-500 font-medium">{t('brain_prob_1_desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0 mt-1 select-none">🧩</div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{t('brain_prob_2_title')}</h3>
                                <p className="text-sm text-slate-500 font-medium">{t('brain_prob_2_desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0 mt-1 select-none">🔋</div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{t('brain_prob_3_title')}</h3>
                                <p className="text-sm text-slate-500 font-medium">{t('brain_prob_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stacked Papers Visual Chaos */}
                <div className="relative h-[500px] flex items-center justify-center perspective-1000">
                    <div className="absolute w-72 h-48 bg-white rounded-3xl shadow-xl border border-slate-200 transform -rotate-12 translate-x-10 translate-y-10 opacity-70 p-6 flex flex-col justify-between">
                        <div className="w-full h-3 bg-slate-100 rounded"></div>
                        <div className="w-3/4 h-3 bg-slate-100 rounded"></div>
                        <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                    </div>
                    <div className="absolute w-72 h-48 bg-slate-100 rounded-3xl shadow-xl border border-slate-200 transform rotate-12 -translate-x-10 -translate-y-10 opacity-80 p-6">
                        <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                        <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
                        <div className="w-full h-2 bg-slate-200 rounded"></div>
                    </div>
                    <div className="absolute w-80 h-56 bg-white rounded-3xl shadow-2xl border border-slate-100 transform z-10 p-8 flex flex-col justify-center items-center">
                        <div className="text-5xl mb-4 animate-bounce font-black select-none">🤯</div>
                        <div className="font-black text-rose-500 tracking-widest uppercase text-sm">{t('brain_prob_viz_badge')}</div>
                        <div className="text-xs text-slate-400 mt-2 font-bold">{t('brain_prob_viz_sub')}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
