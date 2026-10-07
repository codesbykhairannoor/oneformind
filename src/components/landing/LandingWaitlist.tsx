'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackCTAClick } from '@/lib/analytics';

export default function LandingWaitlist() {
    const t = useTranslations();

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
        <section className="py-28 sm:py-36 bg-white overflow-hidden border-t border-slate-200/80" id="comparison">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-6 tracking-wider uppercase border border-emerald-200/80 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {t('comp_badge')}
                    </div>
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 font-black tracking-[-0.035em] leading-[1.12]">
                        {t('comp_title')}
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
                        {t('comp_desc')}
                    </p>
                </div>

                {/* High-Converting Comparison Matrix Card */}
                <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
                    
                    {/* Header Columns */}
                    <div className="grid grid-cols-12 bg-slate-50/80 p-5 sm:p-6 border-b border-slate-200 text-xs sm:text-sm font-bold items-center">
                        <div className="col-span-5 sm:col-span-4 text-slate-500 uppercase tracking-wider text-[11px] sm:text-xs">
                            {t('comp_col_feature')}
                        </div>
                        <div className="col-span-3 sm:col-span-4 text-center sm:text-left text-slate-500 font-semibold text-xs sm:text-sm">
                            {t('comp_col_separated')}
                        </div>
                        <div className="col-span-4 text-center sm:text-left text-indigo-600 font-black text-xs sm:text-base flex items-center justify-end sm:justify-start gap-1.5">
                            <span className="hidden sm:inline">⚡</span>
                            <span>{t('comp_col_tranvas')}</span>
                        </div>
                    </div>

                    {/* Matrix Rows */}
                    <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {comparisonRows.map((row, idx) => (
                            <div 
                                key={idx}
                                className={`grid grid-cols-12 p-4 sm:p-5 items-center transition-colors ${
                                    row.highlight ? 'bg-indigo-50/20' : 'bg-white hover:bg-slate-50/50'
                                }`}
                            >
                                <div className="col-span-5 sm:col-span-4 font-bold text-slate-900 pr-2">
                                    {row.title}
                                </div>
                                <div className="col-span-3 sm:col-span-4 text-slate-500 text-center sm:text-left pr-2 text-[11px] sm:text-sm">
                                    {row.sep}
                                </div>
                                <div className="col-span-4 text-indigo-700 font-bold text-right sm:text-left flex items-center justify-end sm:justify-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] shrink-0 font-black">
                                        ✓
                                    </span>
                                    <span className="text-[11px] sm:text-sm">{row.tra}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800">
                        <div>
                            <div className="text-lg font-black tracking-tight text-white">
                                Siap Hentikan Kekacauan 6 Aplikasi?
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                Setup dalam 30 detik • Data tersinkron otomatis • 8 modul lengkap terbuka penuh
                            </div>
                        </div>

                        <Link
                            href="/register"
                            onClick={() => trackCTAClick('comparison_matrix_btn', 'Switch to Tranvas Today', '/register')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center shrink-0 cursor-pointer"
                        >
                            {t('comp_cta_btn')}
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
}
