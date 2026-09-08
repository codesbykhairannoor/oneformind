'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function SecondBrainScienceFaqCta() {
    const t = useTranslations();

    const faqs = [
        {
            q: t('brain_faq_q1'),
            a: t('brain_faq_a1')
        },
        {
            q: t('brain_faq_q2'),
            a: t('brain_faq_a2')
        },
        {
            q: t('brain_faq_q3'),
            a: t('brain_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 7: SCIENTIFIC PILLAR */}
            <section className="py-40 bg-slate-900 relative overflow-hidden text-left border-y border-slate-950">
                <div className="absolute inset-0 z-0">
                    <svg className="w-full h-full opacity-10" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                        </defs>
                        <circle cx="200" cy="200" r="150" fill="url(#nodeGradient)" className="animate-pulse" />
                        <circle cx="800" cy="300" r="100" fill="url(#nodeGradient)" className="animate-pulse delay-700" />
                        <circle cx="500" cy="800" r="120" fill="url(#nodeGradient)" className="animate-pulse delay-1000" />
                        <path d="M200 200 L800 300 M800 300 L500 800 M500 800 L200 200" stroke="#4f46e5" strokeWidth="1" strokeDasharray="10 10" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-[0.3em] mb-10 rounded-lg font-bold">
                                🧬 {t('brain_science_badge')}
                            </div>

                            <h2 className="text-5xl md:text-7xl text-white mb-10 leading-[1.1] font-black">
                                {t('brain_science_title')}
                            </h2>

                            <div className="relative py-12 px-10 bg-white/5 border border-white/10 rounded-[3rem] mb-12 shadow-2xl">
                                <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">"</div>
                                <p className="text-indigo-100 text-xl md:text-3xl font-serif italic leading-relaxed font-black">
                                    {t('brain_science_desc')}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <div className="px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 transition cursor-help group font-bold">
                                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1 group-hover:text-white">Active_Link_01</p>
                                    <h4 className="font-bold text-slate-200">{t('brain_science_topic_1')}</h4>
                                </div>
                                <div className="px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-purple-500 transition cursor-help group font-bold">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1 group-hover:text-white">Active_Link_02</p>
                                    <h4 className="font-bold text-slate-200">{t('brain_science_topic_2')}</h4>
                                </div>
                                <div className="px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-500 transition cursor-help group font-bold">
                                    <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1 group-hover:text-white">Active_Link_03</p>
                                    <h4 className="font-bold text-slate-200">{t('brain_science_topic_3')}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="w-full aspect-square bg-indigo-600 rounded-[4rem] p-1 flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-600 to-indigo-400 group-hover:scale-110 transition duration-1000"></div>
                                <div className="relative z-10 text-center">
                                    <div className="text-[120px] mb-4 drop-shadow-2xl animate-pulse select-none">🧠</div>
                                    <div className="bg-black/20 px-6 py-2 rounded-full border border-white/10 inline-block text-xs uppercase tracking-widest font-bold">
                                        {t('brain_science_viz_badge')}
                                    </div>
                                </div>
                                <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                <div className="absolute inset-12 border border-white/5 rounded-full animate-spin-reverse-slow"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: FAQ */}
            <section className="py-32 bg-slate-50 border-y border-slate-100">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-5xl md:text-6xl text-center text-slate-900 mb-16 font-black">{t('brain_faq_title')}</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.q}</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 9: CTA */}
            <section className="py-32 bg-slate-50 relative overflow-hidden text-center border-t border-slate-100">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent -z-10"></div>
                
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="bg-indigo-950 rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
                        
                        <div className="relative z-10">
                            <div className="text-6xl mb-8 font-black select-none">🕊️</div>
                            <h2 className="text-6xl md:text-7xl text-white mb-6 tracking-tight leading-tight font-black">
                                {t('brain_cta_title')}
                            </h2>
                            <p className="text-lg md:text-xl text-indigo-200 mb-12 max-w-2xl mx-auto leading-relaxed">
                                {t('brain_cta_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-bold">
                                <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-indigo-950 px-12 py-5 rounded-full text-xl hover:bg-indigo-50 shadow-[0_10px_25px_rgba(255,255,255,0.2)] transition transform hover:-translate-y-1 w-full sm:w-auto">
                                    {t('brain_cta_btn')}
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
