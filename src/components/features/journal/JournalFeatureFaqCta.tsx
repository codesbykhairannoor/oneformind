'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface JournalFeatureFaqCtaProps {
    t: any;
}

export default function JournalFeatureFaqCta({ t }: JournalFeatureFaqCtaProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('journal_faq_q1'),
            a: t('journal_faq_a1')
        },
        {
            q: t('journal_faq_q2'),
            a: t('journal_faq_a2')
        },
        {
            q: t('journal_faq_q3'),
            a: t('journal_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 8: CTA BANNER */}
            <section className="py-32 bg-gray-50 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full opacity-50 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200 rounded-full opacity-40 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-300 rounded-full opacity-30 pointer-events-none"></div>

                <div className="max-w-3xl mx-auto text-center relative z-10 bg-white/80 p-12 md:p-20 rounded-[3rem] shadow-2xl border border-white">
                    <div className="text-5xl mb-6 font-black select-none">🖋️</div>
                    <h2 className="text-4xl md:text-5xl mb-6 text-gray-900 tracking-tight font-black">{t('journal_cta_title')}</h2>
                    <p className="text-gray-500 text-xl mb-10 font-medium">
                        {t('journal_cta_desc')}
                    </p>
                    <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                        {t('journal_cta_btn')}
                    </Link>
                    <p className="mt-6 text-sm text-gray-400 font-medium">{t('journal_cta_note')}</p>
                </div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Digital Journal (FAQ)
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
