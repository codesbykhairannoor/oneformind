'use client';

import { useTranslations } from 'next-intl';

export default function BillingComparisonTable() {
    const t = useTranslations();

    const features = [
        [t('pricing_f_active_habits'), t('pricing_v_unlimited'), t('pricing_v_unlimited'), t('pricing_v_unlimited')],
        [t('pricing_f_planner_engine'), t('pricing_v_batch'), t('pricing_v_batch'), t('pricing_v_ai_powered')],
        [t('pricing_f_vault_savings'), t('pricing_v_unlimited'), t('pricing_v_unlimited'), t('pricing_v_unlimited')],
        [t('pricing_f_ai_assistant'), '—', '—', t('pricing_v_247_access')],
        [t('pricing_f_life_insights'), t('pricing_v_basic'), t('pricing_v_advanced'), t('pricing_v_predictive')],
        [t('pricing_f_custom_modules'), '—', t('pricing_v_partial'), t('pricing_v_full')],
    ];

    return (
        <section style={{ marginBottom: '80px' }} className="py-20 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-5xl mx-auto px-6 space-y-12">
                <div className="text-center space-y-2 mb-16">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 dark:text-white font-black">
                        {t('pricing_comparison_title')}
                    </h2>
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-muted)' }} className="font-bold uppercase tracking-[0.4em]">
                        {t('pricing_comparison_subtitle')}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="p-8 text-[10px] font-black tracking-wide text-slate-400">{t('pricing_feature_col_name')}</th>
                                <th className="p-8 text-[10px] font-black tracking-wide text-slate-900 dark:text-white text-center">Explorer</th>
                                <th className="p-8 text-[10px] font-black tracking-wide text-indigo-500 text-center">{t('pricing_architect_title')}</th>
                                <th className="p-8 text-[10px] font-black tracking-wide text-amber-500 text-center">{t('pricing_quantum_title')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-xs font-bold">
                            {features.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors">
                                    <td className="p-8 text-xs font-black text-slate-700 dark:text-slate-200">{row[0]}</td>
                                    <td className="p-8 text-xs font-bold text-slate-400 text-center">{row[1]}</td>
                                    <td className="p-8 text-xs font-black text-indigo-600 dark:text-indigo-400 text-center">{row[2]}</td>
                                    <td className="p-8 text-xs font-black text-amber-600 dark:text-amber-500 text-center">{row[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
