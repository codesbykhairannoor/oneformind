'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface JobFeatureFaqCtaProps {
    t: any;
}

export default function JobFeatureFaqCta({ t }: JobFeatureFaqCtaProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('job_faq_q1'),
            a: t('job_faq_a1')
        },
        {
            q: t('job_faq_q2'),
            a: t('job_faq_a2')
        },
        {
            q: t('job_faq_q3'),
            a: t('job_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 8: BOTTOM CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-6xl mb-6 font-black">{t('job_cta_title')}</h2>
                        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
                            {t('job_cta_desc')}
                        </p>
                        <Link href="/register" className="bg-white text-indigo-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-indigo-50 transition transform hover:scale-105 shadow-xl inline-block">
                            {t('job_cta_btn')}
                        </Link>
                        <p className="text-indigo-100 mt-8 text-sm font-medium opacity-80">{t('job_cta_note')}</p>
                    </div>
                </div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Job Tracker (FAQ)
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
