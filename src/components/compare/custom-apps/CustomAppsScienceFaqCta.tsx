'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function CustomAppsScienceFaqCta() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('blank_faq_q1'),
            a: t('blank_faq_a1')
        },
        {
            q: t('blank_faq_q2'),
            a: t('blank_faq_a2')
        },
        {
            q: t('blank_faq_q3'),
            a: t('blank_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION: SCIENTIFIC PILLAR */}
            <section className="py-[80px] px-6 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 opacity-50"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-slate-200/50"></div>
                <div className="absolute top-2/4 left-0 w-full h-px bg-slate-200/50"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-slate-200/50"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-8 md:p-20 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-8 right-8 flex gap-2">
                            <div className="w-2 h-12 bg-emerald-500 rounded-full opacity-20"></div>
                            <div className="w-2 h-10 bg-indigo-500 rounded-full opacity-20"></div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-[0.4em] mb-12 rounded-full border border-emerald-200">
                                    🧬 {t('blank_science_badge')}
                                </div>

                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">
                                    {t('blank_science_title')}
                                </h2>

                                <div className="relative py-12 px-12 bg-slate-50 rounded-3xl mb-12 border border-slate-100 group-hover:rotate-1 transition duration-500">
                                     <span className="absolute -top-4 -right-4 text-4xl font-black">🧪</span>
                                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-600 font-light">
                                        "{t('blank_science_desc')}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-6">
                                    <span className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Decision_Fatigue_Defense == true</span>
                                    <span className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Willpower_Preservation_Index.max()</span>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white aspect-video rounded-3xl p-8 border border-slate-200 shadow-lg relative flex flex-col justify-center items-center text-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                                    <h3 className="text-5xl text-emerald-600 mb-4 tracking-tighter relative z-10 font-black">∆E = S - F</h3>
                                    <p className="text-slate-400 text-xs font-mono relative z-10">Systemic_Efficiency = Structure - Friction</p>
                                    
                                    <div className="mt-8 flex gap-4 relative z-10">
                                        <div className="w-20 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
                                        <div className="w-16 h-1 bg-slate-200 rounded-full"></div>
                                    </div>
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
                        FAQ - Custom Workspace Apps
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

            {/* SECTION 6: CTA */}
            <section className="py-[80px] px-6 bg-white relative overflow-hidden border-t border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50 opacity-50"></div>
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-6xl md:text-8xl mb-8 text-gray-900 tracking-tighter font-black" dangerouslySetInnerHTML={{ __html: t.raw('blank_cta_title') }} />
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
                        <Link href="/register" className="group relative px-12 py-6 bg-gray-900 text-white rounded-full font-bold text-xl overflow-hidden shadow-2xl hover:shadow-gray-400/50 transition-all">
                            <div className="absolute inset-0 w-full h-full bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <span className="relative z-10">{t('blank_cta_btn')}</span>
                        </Link>
                    </div>
                    <p className="mt-8 text-gray-400 font-medium">{t('blank_cta_sub')}</p>
                </div>
            </section>
        </>
    );
}
