'use client';

import { useTranslations } from 'next-intl';

export default function FreelancerBentoLifecycle() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 5: BENTO ARSENAL */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl text-gray-900 mb-4 font-black">{t('freelance_bento_title')}</h2>
                        <p className="text-gray-500 text-lg font-medium">{t('freelance_bento_desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 lg:row-span-2 bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl hover:-translate-y-1 transition flex flex-col justify-between min-h-[300px]">
                            <div className="text-3xl mb-4 font-black select-none">🗂️</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t('freelance_bento_1_title')}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('freelance_bento_1_desc')}</p>
                            </div>
                        </div>
                        <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 shadow-sm hover:shadow-lg transition">
                            <div className="text-3xl mb-4 font-black select-none">⏱️</div>
                            <h3 className="text-xl font-bold mb-2 text-indigo-950">{t('freelance_bento_2_title')}</h3>
                            <p className="text-indigo-800/70 text-sm font-medium leading-relaxed">{t('freelance_bento_2_desc')}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 shadow-sm hover:shadow-lg transition">
                            <div className="text-3xl mb-4 font-black select-none">🧾</div>
                            <h3 className="text-xl font-bold mb-2 text-emerald-950">{t('freelance_bento_3_title')}</h3>
                            <p className="text-emerald-800/70 text-sm font-medium leading-relaxed">{t('freelance_bento_3_desc')}</p>
                        </div>
                        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 font-black select-none">🤝</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{t('freelance_bento_4_title')}</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{t('freelance_bento_4_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: CLIENT LIFECYCLE */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative order-2 md:order-1">
                        <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 font-bold">
                                    <span className="text-xs text-indigo-400 uppercase tracking-widest">Leads</span>
                                    <span className="text-xl">12</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 scale-105 shadow-xl shadow-indigo-500/10 font-bold">
                                    <span className="text-xs text-indigo-300 uppercase tracking-widest">Ongoing</span>
                                    <span className="text-xl">4</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 font-bold">
                                    <span className="text-xs text-emerald-400 uppercase tracking-widest">Completed</span>
                                    <span className="text-xl">148</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <h2 className="text-5xl md:text-6xl font-black leading-tight">{t('freelance_extra_1_title')}</h2>
                        <p className="text-xl text-slate-400 leading-relaxed italic font-medium">
                            {t('freelance_extra_1_desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 7: SUSTAINABLE INCOME */}
            <section className="py-32 bg-white relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 font-black">{t('freelance_extra_2_title')}</h2>
                    <p className="text-xl text-gray-500 leading-relaxed mb-12 font-medium">
                        {t('freelance_extra_2_desc')}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="text-3xl mb-2 font-black select-none">🏖️</div>
                            <div className="text-xs text-slate-400 uppercase font-bold">{t('freelance_extra_2_item_1')}</div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="text-3xl mb-2 font-black select-none">🛡️</div>
                            <div className="text-xs text-slate-400 uppercase font-bold">{t('freelance_extra_2_item_2')}</div>
                        </div>
                        <div className="p-6 bg-indigo-600 rounded-3xl border border-indigo-500 text-white md:col-span-1 col-span-2">
                            <div className="text-3xl mb-2 font-black select-none">💎</div>
                            <div className="text-xs text-indigo-100 uppercase font-bold">{t('freelance_extra_2_item_3')}</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
