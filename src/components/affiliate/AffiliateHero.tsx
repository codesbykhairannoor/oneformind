'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, BarChart3 } from 'lucide-react';

export default function AffiliateHero() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    return (
        <header className="pt-32 pb-24 px-6 relative overflow-hidden text-center bg-radial-gradient">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[700px] bg-[radial-gradient(circle_at_50%_0%,#4f46e518_0,transparent_60%)] -z-10 pointer-events-none" />
            
            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-black text-xs uppercase tracking-widest shadow-sm border border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    {t('affiliate_hero_badge')}
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
                    {t('affiliate_hero_title_1')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                        {t('affiliate_hero_title_2')}
                    </span>
                </h1>

                <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
                    {t('affiliate_hero_desc')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link 
                        href="/register?ref=partner" 
                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                    >
                        <span>{t('affiliate_cta_join')}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <a 
                        href="#calculator" 
                        className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-black text-base hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        <span>{t('affiliate_cta_calc')}</span>
                    </a>
                </div>

                <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mb-1">60%</div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_comm')}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tight mb-1">90 {isId ? 'Hari' : 'Days'}</div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_cookie')}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="text-3xl sm:text-4xl font-black text-pink-600 dark:text-pink-400 tracking-tight mb-1">8 {isId ? 'Bulan' : 'Months'}</div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_milestone')}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mb-1">$0 / {isId ? 'Gratis' : 'Free'}</div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('affiliate_stat_fee')}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
