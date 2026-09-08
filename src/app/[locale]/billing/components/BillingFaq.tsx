'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function BillingFaq() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        { q: t('pricing_faq_1_q'), a: t('pricing_faq_1_a') },
        { q: t('pricing_faq_2_q'), a: t('pricing_faq_2_a') },
        { q: t('pricing_faq_3_q'), a: t('pricing_faq_3_a') },
        { q: t('pricing_faq_4_q'), a: t('pricing_faq_4_a') },
    ];

    return (
        <section className="py-20 max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4">
                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white font-black">
                    {t('pricing_faq_title')}
                </h2>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                        <button
                            type="button"
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full px-8 py-6 text-left font-black text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base"
                        >
                            <span>{faq.q}</span>
                            <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                        </button>
                        {openFaq === idx && (
                            <div className="px-8 pb-8 text-slate-500 dark:text-slate-400 font-bold leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
