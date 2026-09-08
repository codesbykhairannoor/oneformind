'use client';

import { useTranslations } from 'next-intl';

export default function SecondBrainFeatures() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 4: ASYMMETRICAL GRID */}
            <section className="py-32 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-6xl mb-6 text-slate-900 font-black">{t('brain_feat_title')}</h2>
                        <p className="text-xl text-slate-500 font-medium">{t('brain_feat_sub')}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-12 gap-6">
                        <div className="md:col-span-8 flex flex-col justify-between p-10 md:p-12 rounded-[3rem] bg-indigo-50 border border-indigo-100 shadow-sm hover:shadow-lg transition">
                            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-8 font-black select-none">📥</div>
                            <div>
                                <h4 className="text-2xl text-indigo-950 mb-3 font-bold">{t('brain_feat_1_title')}</h4>
                                <p className="text-indigo-800/80 leading-relaxed text-lg max-w-xl font-medium">{t('brain_feat_1_desc')}</p>
                            </div>
                        </div>
                        
                        <div className="md:col-span-4 flex flex-col justify-between p-10 md:p-12 rounded-[3rem] bg-slate-900 text-white shadow-xl hover:shadow-2xl transition transform md:-translate-y-4">
                            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-8 font-black select-none">📓</div>
                            <div>
                                <h4 className="text-2xl mb-3 font-bold">{t('brain_feat_2_title')}</h4>
                                <p className="text-slate-400 leading-relaxed font-medium">{t('brain_feat_2_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: INFO HIERARCHY */}
            <section className="py-32 bg-slate-50 relative overflow-hidden border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-5xl md:text-6xl text-slate-900 mb-6 font-black">{t('brain_extra_1_title')}</h2>
                        <p className="text-xl text-slate-500 leading-relaxed mb-10 font-medium">
                            {t('brain_extra_1_desc')}
                        </p>
                        <div className="space-y-4 font-bold text-lg">
                            <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <span className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold">1</span>
                                <span className="text-slate-700 font-bold">{t('brain_extra_1_item_1')}</span>
                            </div>
                            <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm ml-8">
                                <span className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg font-bold">2</span>
                                <span className="text-slate-700 font-bold">{t('brain_extra_1_item_2')}</span>
                            </div>
                            <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm ml-16">
                                <span className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">3</span>
                                <span className="text-slate-700 font-bold">{t('brain_extra_1_item_3')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative order-1 md:order-2">
                        <div className="w-full aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] md:rounded-[4rem] p-12 flex items-center justify-center shadow-2xl">
                            <div className="text-center">
                                <div className="text-8xl mb-6 animate-bounce font-black select-none">📁</div>
                                <div className="text-white text-3xl font-black">{t('brain_extra_1_viz_title')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: CREATIVE OUTPUT */}
            <section className="py-32 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50"></div>
                        <h2 className="text-5xl md:text-6xl mb-8 relative z-10 font-black">{t('brain_extra_2_title')}</h2>
                        <p className="text-xl text-indigo-100 leading-relaxed mb-12 max-w-3xl mx-auto relative z-10 font-medium">
                            {t('brain_extra_2_desc')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 relative z-10 font-bold">
                            <span className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">{t('brain_extra_2_item_1')}</span>
                            <span className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">{t('brain_extra_2_item_2')}</span>
                            <span className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">{t('brain_extra_2_item_3')}</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
