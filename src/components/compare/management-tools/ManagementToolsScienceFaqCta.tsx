'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function ManagementToolsScienceFaqCta() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('pm_faq_q1'),
            a: t('pm_faq_a1')
        },
        {
            q: t('pm_faq_q2'),
            a: t('pm_faq_a2')
        },
        {
            q: t('pm_faq_q3'),
            a: t('pm_faq_a3')
        }
    ];

    return (
        <>
            {/* SCIENTIFIC PILLAR */}
            <section className="py-[80px] bg-slate-50 relative overflow-hidden border-t border-slate-200">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                <div className="absolute inset-y-0 left-1/4 w-px bg-indigo-100/50"></div>
                <div className="absolute inset-y-0 left-2/4 w-px bg-indigo-100/50"></div>
                <div className="absolute inset-y-0 left-3/4 w-px bg-indigo-100/50"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-white border-b-8 border-indigo-600 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-[10px] uppercase tracking-[0.4em] mb-12 rounded-full border border-blue-200">
                                    🧬 {t('pm_science_badge')}
                                </div>

                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">
                                    {t('pm_science_title')}
                                </h2>

                                <div className="relative py-12 px-12 bg-indigo-50/50 rounded-2xl mb-12 border border-indigo-100 group-hover:bg-indigo-50 transition duration-500">
                                     <span className="absolute -top-4 -left-4 text-4xl font-black">📐</span>
                                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-700 font-medium italic">
                                        "{t('pm_science_desc')}"
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                        Cognitive Sovereignty Mastery
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                        Administrative Friction Elimination
                                    </div>
                                </div>
                            </div>

                            <div className="relative order-1 lg:order-2">
                                <div className="bg-slate-900 aspect-square rounded-[3rem] p-10 flex flex-col justify-between text-white shadow-2xl transform lg:rotate-3 group-hover:rotate-0 transition duration-700">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-indigo-400 uppercase tracking-widest">Efficiency_Index</p>
                                            <p className="text-3xl font-black">9.8/10</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="h-2 bg-white/10 rounded-full w-full"></div>
                                        <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                                        <div className="h-2 bg-indigo-500 rounded-full w-1/2"></div>
                                    </div>

                                    <p className="text-[10px] text-slate-500 font-mono">system.status == "optimal"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                        FAQ - Project Management Alternative
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
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
            <section className="py-[80px] px-6 bg-white relative overflow-hidden border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl mb-8 text-indigo-950 tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('pm_cta_title') }} />
                    <p className="text-indigo-900/60 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                        {t('pm_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl hover:bg-indigo-700 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] font-bold">
                        {t('pm_cta_btn')}
                    </Link>
                    <p className="mt-8 text-sm text-indigo-400 font-bold uppercase tracking-widest">{t('pm_cta_sub')}</p>
                </div>
            </section>
        </>
    );
}
