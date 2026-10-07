'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function LandingSwitch() {
    const t = useTranslations();

    return (
        <section className="py-40 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] mb-8 tracking-[0.2em] uppercase border border-indigo-200">
                    {t('mig_badge')}
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-16 leading-tight font-[900] tracking-tight">
                    {t('mig_title')}
                </h2>

                <div className="grid sm:grid-cols-3 gap-6">
                    <Link href="/compare/notes-apps" className="group bg-white p-12 rounded-[2.5rem] border border-slate-200 hover:border-indigo-600 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-300">📝</div>
                        <div className="text-xl font-bold text-slate-900 mb-2">{t('mig_card_1')}</div>
                        <div className="text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{t('mig_view_card_1')}</div>
                    </Link>
                    <Link href="/compare/custom-apps" className="group bg-white p-12 rounded-[2.5rem] border border-slate-200 hover:border-indigo-600 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                        <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-300">📊</div>
                        <div className="text-xl font-bold text-slate-900 mb-2">{t('mig_card_2')}</div>
                        <div className="text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{t('mig_view_card_2')}</div>
                    </Link>
                    <Link href="/compare/five-apps" className="group bg-slate-900 p-12 rounded-[2.5rem] border border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="text-4xl mb-6 group-hover:scale-110 transition duration-300">🌌</div>
                        <div className="text-xl font-bold text-white mb-2">{t('mig_card_3')}</div>
                        <div className="text-indigo-400 font-bold text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300">{t('mig_view_all')}</div>
                    </Link>
                </div>

                <p className="mt-16 text-slate-400 font-bold tracking-[0.3em] text-[10px] uppercase">
                    {t('mig_cta')}
                </p>
            </div>
        </section>
    );
}
