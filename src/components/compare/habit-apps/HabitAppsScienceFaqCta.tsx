'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function HabitAppsScienceFaqCta() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('habitap_faq_q1'),
            a: t('habitap_faq_a1')
        },
        {
            q: t('habitap_faq_q2'),
            a: t('habitap_faq_a2')
        },
        {
            q: t('habitap_faq_q3'),
            a: t('habitap_faq_a3')
        }
    ];

    return (
        <>
            {/* SCIENTIFIC PILLAR */}
            <section className="py-[80px] bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="10" cy="10" r="2" fill="#4f46e5" />
                        <circle cx="30" cy="40" r="3" fill="#4f46e5" />
                        <circle cx="70" cy="20" r="1.5" fill="#4f46e5" />
                        <circle cx="90" cy="80" r="4" fill="#4f46e5" />
                        <path d="M10 10 Q 30 40 70 20" stroke="#4f46e5" strokeWidth="0.1" fill="none" />
                        <path d="M30 40 Q 50 60 90 80" stroke="#4f46e5" strokeWidth="0.1" fill="none" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="relative w-full aspect-square max-w-[400px] mx-auto">
                                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse-slow"></div>
                                <div className="absolute inset-10 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-8 border-white">
                                    <span className="text-5xl mb-2 font-black">🧬</span>
                                    <p className="font-black text-xs uppercase tracking-widest text-indigo-200">Neural Pathway</p>
                                </div>
                                <div className="absolute top-0 right-10 w-16 h-16 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl animate-bounce">🌱</div>
                                <div className="absolute bottom-10 left-0 w-12 h-12 bg-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xl animate-bounce delay-700">🧠</div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950 text-indigo-100 text-[10px] uppercase tracking-[0.3em] mb-10 rounded-full">
                                🧬 {t('habitap_science_badge')}
                            </div>

                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">
                                {t('habitap_science_title')}
                            </h2>

                            <div className="relative py-10 px-10 bg-gray-50 rounded-[3rem] mb-12 border-l-8 border-indigo-600">
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-700 font-serif italic">
                                    "{t('habitap_science_desc')}"
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 shadow-sm">Basal Ganglia Focus</span>
                                <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 shadow-sm">Dopamine Regulation</span>
                                <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 shadow-sm">Neuroplasticity</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-[80px] bg-white border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">{t('habitap_how_it_works_title')}</h2>
                    <div style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-600">
                        <p>{t('habitap_how_it_works_desc')}</p>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                        FAQ - Habit Apps Alternative
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
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-t from-indigo-100 via-purple-50 to-white rounded-t-full -z-10"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-indigo-200 to-transparent rounded-t-full blur-2xl -z-10"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl md:text-7xl mb-8 text-indigo-950 tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('habitap_cta_title') }} />
                    <p className="text-indigo-900/60 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                        {t('habitap_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl hover:bg-indigo-700 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] font-bold">
                        {t('habitap_cta_btn')}
                    </Link>
                    <p className="mt-8 text-sm text-indigo-400 font-bold uppercase tracking-widest">{t('habitap_cta_sub')}</p>
                </div>
            </section>
        </>
    );
}
