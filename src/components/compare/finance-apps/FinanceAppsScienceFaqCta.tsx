'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FinanceAppsScienceFaqCta() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('finapp_faq_q1'),
            a: t('finapp_faq_a1')
        },
        {
            q: t('finapp_faq_q2'),
            a: t('finapp_faq_a2')
        },
        {
            q: t('finapp_faq_q3'),
            a: t('finapp_faq_a3')
        }
    ];

    return (
        <>
            {/* SCIENTIFIC PILLAR */}
            <section className="py-[80px] px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="bg-white border-2 border-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-mono tracking-[0.3em] mb-10 rounded-full">
                                    🧬 {t('finapp_science_badge')}
                                </div>

                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-8">
                                    {t('finapp_science_title')}
                                </h2>

                                <div className="relative py-8 px-8 bg-slate-950 rounded-2xl mb-10 border border-slate-800">
                                    <div className="flex gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <p className="text-emerald-400 font-mono text-lg leading-relaxed italic">
                                        "// {t('finapp_science_desc')}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Methodology</p>
                                        <p className="text-sm font-bold text-slate-900">Kakeibo</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Economics</p>
                                        <p className="text-sm font-bold text-slate-900">Behavioral</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Focus</p>
                                        <p className="text-sm font-bold text-slate-900">Mindfulness</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 transform rotate-2 group-hover:rotate-0 transition duration-700">
                                    <div className="space-y-6">
                                        <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                                        <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                                        <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                                        <div className="pt-6 border-t border-slate-200">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Wealth_Integrity</p>
                                                    <p className="text-2xl text-slate-900 font-bold">99.9% Reliable</p>
                                                </div>
                                                <div className="text-4xl font-black">📊</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl shadow-xl transform group-hover:scale-110 transition font-black">💎</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                        FAQ - Finance Apps Alternative
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} size={20} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-[80px] px-6 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/20 rounded-full blur-2xl -z-0"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl text-4xl mb-10 border border-white/10 shadow-2xl font-black">⚡</div>
                    <h2 className="text-5xl md:text-7xl mb-8 text-white tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('finapp_cta_title') }} />
                    <p className="text-slate-400 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                        {t('finapp_cta_desc')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/register" className="w-full sm:w-auto bg-emerald-500 text-slate-950 px-12 py-5 rounded-full text-xl hover:bg-emerald-400 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(16,185,129,0.3)] font-bold">
                            {t('finapp_cta_btn')}
                        </Link>
                        <Link href="/features/finance" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full text-xl hover:bg-white/10 transition font-bold">
                            Explore Finance OS
                        </Link>
                    </div>
                    <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">{t('finapp_cta_sub')}</p>
                </div>
            </section>
        </>
    );
}
