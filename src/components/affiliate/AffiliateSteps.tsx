'use client';

import { useTranslations } from 'next-intl';
import { Globe, Layers, DollarSign } from 'lucide-react';

export default function AffiliateSteps() {
    const t = useTranslations();

    const steps = [
        {
            num: '01',
            title: t('affiliate_step_1_title'),
            desc: t('affiliate_step_1_desc'),
            icon: <Globe className="w-6 h-6 text-indigo-500" />,
        },
        {
            num: '02',
            title: t('affiliate_step_2_title'),
            desc: t('affiliate_step_2_desc'),
            icon: <Layers className="w-6 h-6 text-purple-500" />,
        },
        {
            num: '03',
            title: t('affiliate_step_3_title'),
            desc: t('affiliate_step_3_desc'),
            icon: <DollarSign className="w-6 h-6 text-emerald-500" />,
        },
    ];

    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                        {t('affiliate_step_badge')}
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t('affiliate_step_title')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx} 
                            className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative flex flex-col justify-between space-y-6"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                        {step.icon}
                                    </div>
                                    <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                                        {step.num}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
