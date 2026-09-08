'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

export default function SettingsFaq() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        { q: t('settings_faq_q1'), a: t('settings_faq_a1') },
        { q: t('settings_faq_q2'), a: t('settings_faq_a2') },
        { q: t('settings_faq_q3'), a: t('settings_faq_a3') }
    ];

    return (
        <section style={{ marginTop: '80px', paddingTop: '80px' }} className="border-t border-slate-200 dark:border-slate-850">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white">
                        {t('settings_faq_title')}
                    </h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full px-6 py-5 text-left font-bold text-slate-800 dark:text-white flex justify-between items-center text-sm md:text-base hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                            >
                                <span>{faq.q}</span>
                                <ChevronRight className={`transform transition-transform ${openFaq === idx ? 'rotate-90 text-indigo-600' : 'text-slate-400'}`} size={18} />
                            </button>
                            {openFaq === idx && (
                                <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-850/50 pt-4 text-xs md:text-sm">
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
