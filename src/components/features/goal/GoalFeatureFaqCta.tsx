'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface GoalFeatureFaqCtaProps {
    t: any;
}

export default function GoalFeatureFaqCta({ t }: GoalFeatureFaqCtaProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('goal_faq_q1'),
            a: t('goal_faq_a1')
        },
        {
            q: t('goal_faq_q2'),
            a: t('goal_faq_a2')
        },
        {
            q: t('goal_faq_q3'),
            a: t('goal_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 7: BOTTOM CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-5xl mx-auto bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>

                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-5xl mb-6 font-black">{t('goal_cta_title')}</h2>
                        <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
                            {t('goal_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-white text-indigo-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition transform shadow-xl">
                            {t('goal_cta_btn')}
                        </Link>
                        <p className="mt-6 text-sm text-indigo-300">{t('goal_cta_note')}</p>
                    </div>
                </div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Goal Tracker (FAQ)
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
