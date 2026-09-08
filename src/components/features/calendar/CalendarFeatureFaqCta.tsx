'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface CalendarFeatureFaqCtaProps {
    t: any;
}

export default function CalendarFeatureFaqCta({ t }: CalendarFeatureFaqCtaProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('calendar_faq_q1'),
            a: t('calendar_faq_a1')
        },
        {
            q: t('calendar_faq_q2'),
            a: t('calendar_faq_a2')
        },
        {
            q: t('calendar_faq_q3'),
            a: t('calendar_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 8: CTA BANNER */}
            <section className="pt-32 pb-40 bg-slate-900 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] opacity-30"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-8 font-black">🗓️</div>
                    <h2 className="text-5xl md:text-6xl mb-8 text-white tracking-tight font-black">{t('calendar_cta_title')}</h2>
                    <p className="text-indigo-200 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        {t('calendar_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-full text-lg hover:bg-indigo-50 hover:scale-105 transition transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                        {t('calendar_cta_btn')}
                    </Link>
                    <p className="mt-8 text-sm text-slate-400 font-medium">{t('calendar_cta_note')}</p>
                </div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Smart Calendar (FAQ)
                    </h2>
                    <div className="space-y-4 text-left">
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
        </>
    );
}
