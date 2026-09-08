'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

export default function AffiliateBottomCTA() {
    const t = useTranslations();

    return (
        <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto p-10 sm:p-16 rounded-[3.5rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl text-center space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2)_0,transparent_70%)] pointer-events-none" />

                <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                    <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest inline-block backdrop-blur-md">
                        {t('affiliate_cta_final_badge')}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                        {t('affiliate_cta_final_title')}
                    </h2>
                    <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
                        {t('affiliate_cta_final_desc')}
                    </p>
                </div>

                <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register?ref=partner"
                        className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-base shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span>{t('affiliate_cta_final_btn')}</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
