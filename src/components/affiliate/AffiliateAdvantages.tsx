'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function AffiliateAdvantages() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const advantages = [
        {
            icon: '💎',
            title: t('affiliate_adv_1_title'),
            desc: t('affiliate_adv_1_desc'),
            highlight: '60% Recurring',
        },
        {
            icon: '⏳',
            title: t('affiliate_adv_2_title'),
            desc: t('affiliate_adv_2_desc'),
            highlight: isId ? 'Hingga 8 Bulan' : 'Up to 8 Months',
        },
        {
            icon: '🍪',
            title: t('affiliate_adv_3_title'),
            desc: t('affiliate_adv_3_desc'),
            highlight: isId ? '90 Hari Tracking' : '90-Day Tracking',
        },
        {
            icon: '⚡',
            title: t('affiliate_adv_4_title'),
            desc: t('affiliate_adv_4_desc'),
            highlight: isId ? 'Free Trial 14 Hari' : '14-Day Free Trial',
        },
        {
            icon: '💸',
            title: t('affiliate_adv_5_title'),
            desc: t('affiliate_adv_5_desc'),
            highlight: isId ? 'Payout Otomatis' : 'Automated Payouts',
        },
    ];

    return (
        <section className="py-24 px-6 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        {t('affiliate_adv_badge')}
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t('affiliate_adv_title')}
                    </h2>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {t('affiliate_adv_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {advantages.map((adv, idx) => (
                        <div 
                            key={idx} 
                            className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block shadow-inner">
                                        {adv.icon}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                                        {adv.highlight}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {adv.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {adv.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
