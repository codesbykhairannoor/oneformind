'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function AffiliateComparisonMatrix() {
    const t = useTranslations();
    const locale = useLocale();
    const isId = locale === 'id';

    const comparison = [
        { feature: isId ? 'Bagi Hasil Komisi' : 'Commission Rate', tranvas: '60% Recurring Bulanan', others: '15% - 25% Sekali Bayar' },
        { feature: isId ? 'Masa Berlaku Cookie' : 'Cookie Lifetime', tranvas: '90 Hari Penuh', others: '14 - 30 Hari' },
        { feature: isId ? 'Durasi Komisi Per User' : 'Commission Duration', tranvas: 'Hingga 8 Bulan Langganan', others: 'Hanya 1 Bulan Pertama' },
        { feature: isId ? 'Hook Konversi User' : 'Conversion Hook', tranvas: '⚡ Free Trial 14 Hari ($0)', others: 'Langsung Bayar Penuh' },
        { feature: isId ? 'Ambang Batas Payout' : 'Minimum Payout Threshold', tranvas: '$20 / Rp 200.000', others: '$100+' },
    ];

    return (
        <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                        {t('affiliate_matrix_badge')}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {t('affiliate_matrix_title')}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                                <th className="p-6 text-xs font-black uppercase text-slate-400">Fitur & Parameter</th>
                                <th className="p-6 text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 text-center">Tranvas Partner ⚡</th>
                                <th className="p-6 text-xs font-black uppercase text-slate-400 text-center">Program SaaS Biasa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-bold">
                            {comparison.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                                    <td className="p-6 text-slate-700 dark:text-slate-200 font-bold">{row.feature}</td>
                                    <td className="p-6 text-center font-black text-emerald-600 dark:text-emerald-400 bg-indigo-50/20 dark:bg-indigo-950/20">{row.tranvas}</td>
                                    <td className="p-6 text-center text-slate-400">{row.others}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
