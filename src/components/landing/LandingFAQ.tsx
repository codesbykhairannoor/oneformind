'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LandingFAQ() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        { q: t('faq_q1'), a: t('faq_a1') },
        { q: t('faq_q2'), a: t('faq_a2') },
        { q: t('faq_q3'), a: t('faq_a3') },
        { q: t('faq_q4'), a: t('faq_a4') },
        { q: t('faq_q5'), a: t('faq_a5') },
    ];

    return (
        <section className="py-40 bg-slate-50 border-y border-slate-100">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl text-slate-900 mb-16 text-center tracking-tight font-[900]">
                    {t('faq_title')}
                </h2>
                
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className={`bg-white rounded-[2rem] border overflow-hidden transition-all duration-300 shadow-sm ${openFaq === idx ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200'}`}>
                            <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="flex justify-between items-center w-full p-8 text-left group">
                                <span className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition tracking-tight">{faq.q}</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition">
                                    <span className={`text-xs text-slate-400 group-hover:text-indigo-600 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>▼</span>
                                </div>
                            </button>
                            {openFaq === idx && (
                                <div className="px-8 pb-8 text-slate-500 font-medium text-lg leading-relaxed opacity-80 border-t border-slate-100 pt-4">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
