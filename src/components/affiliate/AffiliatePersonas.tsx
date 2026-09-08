'use client';

import { useTranslations } from 'next-intl';

export default function AffiliatePersonas() {
    const t = useTranslations();

    const personas = [
        {
            icon: '🎬',
            title: t('affiliate_who_1_title'),
            desc: t('affiliate_who_1_desc'),
            badge: 'Content Creators',
        },
        {
            icon: '🧠',
            title: t('affiliate_who_2_title'),
            desc: t('affiliate_who_2_desc'),
            badge: 'Coaches & Mentors',
        },
        {
            icon: '💼',
            title: t('affiliate_who_3_title'),
            desc: t('affiliate_who_3_desc'),
            badge: 'Freelancers & Agencies',
        },
        {
            icon: '🎓',
            title: t('affiliate_who_4_title'),
            desc: t('affiliate_who_4_desc'),
            badge: 'Community Leaders',
        },
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 font-bold text-xs uppercase tracking-wider">
                        {t('affiliate_who_badge')}
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t('affiliate_who_title')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {personas.map((persona, idx) => (
                        <div 
                            key={idx} 
                            className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-3">
                                <span className="text-4xl block mb-2">{persona.icon}</span>
                                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider inline-block">
                                    {persona.badge}
                                </span>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    {persona.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {persona.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
