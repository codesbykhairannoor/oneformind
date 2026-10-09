'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

export default function LandingWaitlist() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const comparisonRows = [
        {
            title: t('comp_r1_title'),
            sep: t('comp_r1_sep'),
            tra: t('comp_r1_tra'),
            highlight: true,
        },
        {
            title: t('comp_r2_title'),
            sep: t('comp_r2_sep'),
            tra: t('comp_r2_tra'),
            highlight: false,
        },
        {
            title: t('comp_r3_title'),
            sep: t('comp_r3_sep'),
            tra: t('comp_r3_tra'),
            highlight: true,
        },
        {
            title: t('comp_r4_title'),
            sep: t('comp_r4_sep'),
            tra: t('comp_r4_tra'),
            highlight: false,
        },
        {
            title: t('comp_r5_title'),
            sep: t('comp_r5_sep'),
            tra: t('comp_r5_tra'),
            highlight: true,
        },
    ];

    return (
        <section className="py-16 sm:py-28 lg:py-36 bg-white overflow-hidden border-t border-slate-200/80" id="comparison">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-4 sm:mb-5 tracking-wider uppercase border border-emerald-200/80 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {t('comp_badge')}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-4 sm:mb-6 font-black tracking-tight leading-tight">
                        {t('comp_title')}
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
                        {t('comp_desc')}
                    </p>
                </div>

                {/* High-Converting Comparison Matrix Card */}
                <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        {/* Header Columns */}
                        <div className="grid grid-cols-12 bg-slate-50/80 p-5 sm:p-6 border-b border-slate-200 text-xs sm:text-sm font-bold items-center">
                            <div className="col-span-4 text-slate-500 uppercase tracking-wider text-xs">
                                {t('comp_col_feature')}
                            </div>
                            <div className="col-span-4 text-slate-500 font-semibold text-sm">
                                {t('comp_col_separated')}
                            </div>
                            <div className="col-span-4 text-indigo-600 font-black text-base flex items-center gap-1.5">
                                <span>⚡</span>
                                <span>{t('comp_col_tranvas')}</span>
                            </div>
                        </div>

                        {/* Matrix Rows */}
                        <div className="divide-y divide-slate-100 text-sm">
                            {comparisonRows.map((row, idx) => (
                                <div 
                                    key={idx}
                                    className={`grid grid-cols-12 p-5 items-center transition-colors ${
                                        row.highlight ? 'bg-indigo-50/20' : 'bg-white hover:bg-slate-50/50'
                                    }`}
                                >
                                    <div className="col-span-4 font-bold text-slate-900 pr-2">
                                        {row.title}
                                    </div>
                                    <div className="col-span-4 text-slate-500 pr-2 text-sm">
                                        {row.sep}
                                    </div>
                                    <div className="col-span-4 text-indigo-700 font-bold flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0 font-black">
                                            ✓
                                        </span>
                                        <span>{row.tra}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Card-Based Comparison View */}
                    <div className="block md:hidden divide-y divide-slate-100">
                        {comparisonRows.map((row, idx) => (
                            <div key={idx} className={`p-4 sm:p-5 space-y-3 ${row.highlight ? 'bg-indigo-50/30' : 'bg-white'}`}>
                                <div className="font-bold text-slate-900 text-base">
                                    {row.title}
                                </div>
                                <div className="space-y-2 text-xs sm:text-sm">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-600 flex items-start gap-2">
                                        <span className="text-red-500 font-bold shrink-0">✕</span>
                                        <div>
                                            <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">{t('comp_col_separated')}</span>
                                            <span className="font-medium text-slate-600">{row.sep}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-emerald-950 flex items-start gap-2">
                                        <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs shrink-0 font-black mt-0.5">✓</span>
                                        <div>
                                            <span className="text-emerald-700 font-bold block text-xs uppercase tracking-wider">{t('comp_col_tranvas')}</span>
                                            <span className="font-bold text-emerald-900">{row.tra}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-5 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 border-t border-slate-800">
                        <div className="text-center sm:text-left">
                            <div className="text-base sm:text-lg font-black tracking-tight text-white">
                                {isId ? 'Siap Hentikan Kekacauan 6 Aplikasi?' : 'Ready to Eliminate the 6-App Chaos?'}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 mt-1">
                                {isId 
                                    ? 'Setup dalam 30 detik • Data tersinkron otomatis • 8 modul lengkap terbuka penuh' 
                                    : '30-second setup • Real-time cloud sync • All 8 modules fully unlocked'}
                            </div>
                        </div>

                        <Link
                            href="/register"
                            onClick={() => trackCTAClick('comparison_matrix_btn', 'Switch to Tranvas Today', '/register')}
                            className="group relative overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shrink-0 cursor-pointer"
                        >
                            <span className="relative z-10">{t('comp_cta_btn')}</span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
}
