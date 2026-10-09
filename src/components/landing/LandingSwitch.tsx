'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function LandingSwitch() {
    const t = useTranslations();

    return (
        <section className="py-16 sm:py-28 lg:py-36 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-4 sm:mb-6 tracking-wider uppercase border border-indigo-200">
                    {t('mig_badge')}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-6 sm:mb-12 leading-tight font-black tracking-tight">
                    {t('mig_title')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <Link href="/compare/notes-apps" className="group bg-white p-5 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 transform sm:hover:-translate-y-1">
                        <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-300">📝</div>
                        <div className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{t('mig_card_1')}</div>
                        <div className="text-indigo-600 font-bold text-xs sm:text-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">{t('mig_view_card_1')}</div>
                    </Link>
                    <Link href="/compare/custom-apps" className="group bg-white p-5 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 transform sm:hover:-translate-y-1">
                        <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-300">📊</div>
                        <div className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{t('mig_card_2')}</div>
                        <div className="text-indigo-600 font-bold text-xs sm:text-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">{t('mig_view_card_2')}</div>
                    </Link>
                    <Link href="/compare/five-apps" className="group bg-slate-900 p-5 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-800 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform sm:hover:-translate-y-1">
                        <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-110 transition duration-300">🌌</div>
                        <div className="text-lg sm:text-xl font-bold text-white mb-2">{t('mig_card_3')}</div>
                        <div className="text-indigo-400 font-bold text-xs sm:text-sm opacity-100 sm:opacity-70 sm:group-hover:opacity-100 transition-opacity duration-300">{t('mig_view_all')}</div>
                    </Link>
                </div>

                <p className="mt-10 sm:mt-16 text-slate-400 font-bold tracking-[0.2em] text-xs uppercase">
                    {t('mig_cta')}
                </p>
            </div>
        </section>
    );
}
