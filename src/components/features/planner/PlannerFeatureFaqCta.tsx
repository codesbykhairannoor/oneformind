'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface PlannerFeatureFaqCtaProps {
    t: any;
}

export default function PlannerFeatureFaqCta({ t }: PlannerFeatureFaqCtaProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('planner_faq_q1'),
            a: t('planner_faq_a1')
        },
        {
            q: t('planner_faq_q2'),
            a: t('planner_faq_a2')
        },
        {
            q: t('planner_faq_q3'),
            a: t('planner_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 8: CTA BANNER */}
            <section className="pb-32 bg-gray-50 px-6">
                <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-2 transition duration-500">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>
                    
                    <div className="relative z-10 text-white">
                        <h2 className="text-4xl md:text-6xl mb-8 tracking-tight font-black">{t('planner_cta_title')}</h2>
                        <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
                            {t('planner_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-white text-indigo-900 px-12 py-5 rounded-full text-lg hover:bg-indigo-50 hover:scale-110 transition transform shadow-xl font-bold">
                            {t('planner_cta_btn')}
                        </Link>
                        <p className="mt-6 text-sm text-indigo-200/80 font-medium">{t('planner_cta_note')}</p>
                    </div>
                </div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Daily Planner (FAQ)
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
