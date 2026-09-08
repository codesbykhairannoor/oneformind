'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function FreelancerScienceFaqCta() {
    const t = useTranslations();

    const faqs = [
        {
            q: t('freelance_faq_q1'),
            a: t('freelance_faq_a1')
        },
        {
            q: t('freelance_faq_q2'),
            a: t('freelance_faq_a2')
        },
        {
            q: t('freelance_faq_q3'),
            a: t('freelance_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 8: SCIENTIFIC PILLAR */}
            <section className="py-32 bg-slate-900 relative overflow-hidden text-left border-y border-slate-950">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] [background-size:100px_100px]"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden group">
                        
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500 text-white text-[10px] uppercase tracking-[0.2em] mb-10 shadow-lg font-bold">
                                    🧬 {t('freelance_science_badge')}
                                </div>

                                <h2 className="text-5xl md:text-6xl text-white mb-10 leading-tight font-black">
                                    {t('freelance_science_title')}
                                </h2>

                                <div className="relative py-10 px-10 bg-indigo-950/50 border-r-8 border-indigo-500 rounded-l-3xl mb-12">
                                    <p className="text-indigo-100 text-xl md:text-2xl font-medium leading-relaxed italic">
                                        "{t('freelance_science_desc')}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition font-bold">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
                                        <span className="text-sm text-slate-300">{t('freelance_science_topic_1')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition font-bold">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                                        <span className="text-sm text-slate-300">{t('freelance_science_topic_2')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition font-bold">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                        <span className="text-sm text-slate-300">{t('freelance_science_topic_3')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 relative hidden lg:block">
                                {/* Pipeline Visualization */}
                                <div className="w-72 h-96 relative">
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-slate-700/50 rounded-full"></div>
                                    
                                    <div className="absolute left-1/2 -translate-x-1/2 top-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg animate-bounce select-none">📦</div>
                                    <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-lg animate-bounce delay-1000 select-none">📁</div>
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-1/4 w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-xl animate-bounce delay-500 select-none font-bold">💰</div>
                                    
                                    <div className="absolute top-10 right-0 w-12 h-px bg-slate-600"></div>
                                    <div className="absolute top-1/3 left-0 w-12 h-px bg-slate-600"></div>
                                    <div className="absolute bottom-1/4 right-0 w-12 h-px bg-slate-600"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 9: FAQ */}
            <section className="py-32 bg-gray-50 border-y border-gray-100">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('freelance_faq_title')}</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 10: INVOICE-STYLE CTA */}
            <section className="py-24 px-6 bg-gray-50 relative overflow-hidden text-center">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="bg-slate-900 rounded-3xl md:rounded-[3rem] p-12 md:p-20 relative shadow-2xl overflow-hidden border border-slate-700 border-t-8 border-t-indigo-500">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
                        
                        <h2 className="text-6xl md:text-6xl mb-8 text-white tracking-tight font-black">{t('freelance_cta_title')}</h2>
                        <p className="text-slate-400 text-xl md:text-2xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('freelance_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-500 transition transform hover:scale-105 shadow-xl shadow-indigo-900/50">
                            {t('freelance_cta_btn')}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
