'use client';

import { useTranslations } from 'next-intl';

export default function ManagementToolsSolutionComparison() {
    const t = useTranslations();

    return (
        <>
            {/* THE SOLUTION */}
            <section className="py-[80px] bg-indigo-50/50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-4">
                            <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">🚀</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                                {t('pm_sol_title_1')} <span className="text-indigo-600 bg-indigo-100 px-1">{t('pm_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500 mb-8">
                                {t('pm_sol_desc')}
                            </p>
                            <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
                                <p className="text-indigo-900 font-bold text-sm mb-2">💡 {t('pm_sol_box_title')}</p>
                                <p className="text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('pm_sol_box_desc') }} />
                            </div>
                        </div>

                        <div className="lg:col-span-8 relative">
                            <div className="absolute inset-0 bg-indigo-300 rounded-full blur-2xl opacity-20"></div>
                            
                            <div className="relative bg-white/60 border border-white/50 p-8 rounded-[2.5rem] shadow-2xl">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                                        <div className="text-3xl mb-4 font-black">👤</div>
                                        <h4 className="font-bold text-gray-900">{t('pm_hub_you')}</h4>
                                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                            <span>●</span> Active
                                        </div>
                                    </div>

                                    <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg text-white hover:-translate-y-1 transition duration-300">
                                        <div className="text-3xl mb-4 font-black">🏔️</div>
                                        <h4 className="font-bold">{t('pm_hub_vision')}</h4>
                                        <p className="text-indigo-100 text-xs mt-2">{t('pm_hub_yours')}</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                                        <div className="text-3xl mb-4 font-black">🌱</div>
                                        <h4 className="font-bold text-gray-900">{t('pm_hub_growth')}</h4>
                                        <p className="text-gray-400 text-xs mt-2">{t('pm_hub_private')}</p>
                                    </div>
                                </div>

                                <div className="mt-6 bg-white/50 p-4 rounded-2xl border border-white/60 text-center">
                                    <p className="text-indigo-900 text-sm font-bold tracking-wide">✨ Everything Connected. Nothing Complicated.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON */}
            <section className="py-[80px] bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-6">{t('pm_compare_title')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('pm_compare_desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50 opacity-70">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest mb-6">{t('pm_table_head_2')}</h3>
                            <ul className="space-y-6">
                                <li className="flex items-center justify-between text-gray-500 text-sm md:text-base">
                                    <span>{t('pm_table_row_1_title')}</span>
                                    <span className="text-xs md:text-sm font-mono bg-gray-200 px-2 py-1 rounded">{t('pm_table_row_1_col_1')}</span>
                                </li>
                                <li className="flex items-center justify-between text-gray-500 text-sm md:text-base">
                                    <span>{t('pm_table_row_2_title')}</span>
                                    <span className="text-xs md:text-sm font-mono bg-gray-200 px-2 py-1 rounded">{t('pm_table_row_2_col_1')}</span>
                                </li>
                                <li className="flex items-center justify-between text-gray-500 text-sm md:text-base">
                                    <span>{t('pm_table_row_3_title')}</span>
                                    <span className="text-xs md:text-sm font-mono bg-gray-200 px-2 py-1 rounded">{t('pm_table_row_3_col_1')}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8 rounded-3xl border-2 border-indigo-100 bg-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">WINNER</div>
                            <h3 className="font-black text-indigo-900 uppercase tracking-widest mb-6">Tranvas</h3>
                            <ul className="space-y-6">
                                 <li className="flex items-center justify-between text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('pm_table_row_1_title')}</span>
                                    <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-right">{t('pm_table_row_1_col_2')}</span>
                                </li>
                                <li className="flex items-center justify-between text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('pm_table_row_2_title')}</span>
                                    <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-right">{t('pm_table_row_2_col_2')}</span>
                                </li>
                                <li className="flex items-center justify-between text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('pm_table_row_3_title')}</span>
                                    <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-right">{t('pm_table_row_3_col_2')}</span>
                                </li>
                                 <li className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('pm_table_row_4_title')}</span>
                                    <span className="text-xs md:text-sm text-white bg-indigo-600 px-3 py-1 rounded-lg shadow-lg shadow-indigo-200 text-right">{t('pm_table_row_4_col_2')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
