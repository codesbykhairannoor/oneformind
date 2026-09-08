'use client';

import { useTranslations } from 'next-intl';

export default function CustomAppsSolutionComparison() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 4: REDESIGN - THE SOLUTION */}
            <section className="py-[80px] px-6 bg-indigo-50/30 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-block p-3 bg-indigo-100 rounded-2xl mb-6">
                            <span className="text-3xl font-black">💎</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                            {t('blank_sol_title_1')} <span className="text-indigo-600 underline decoration-wavy decoration-indigo-200">{t('blank_sol_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('blank_sol_desc')}</p>
                    </div>

                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-gray-200 p-8 md:p-12 relative overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="bg-indigo-50 rounded-3xl p-8 mb-8 border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                        💡 {t('blank_sol_box_title')}
                                    </h4>
                                    <p className="text-indigo-800/70 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('blank_sol_box_desc') }} />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition">💰</div>
                                        <div>
                                            <h5 className="font-bold text-gray-900">{t('blank_hub_finance')}</h5>
                                            <p className="text-sm text-gray-400">Automated tracking</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition">⚡</div>
                                        <div>
                                            <h5 className="font-bold text-gray-900">{t('blank_hub_focus')}</h5>
                                            <p className="text-sm text-gray-400">{t('blank_hub_ready')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">🧠</div>
                                        <div>
                                            <h5 className="font-bold text-gray-900">{t('blank_hub_system')}</h5>
                                            <p className="text-sm text-gray-400">{t('blank_hub_automated')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[400px] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center">
                                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-300 z-20 relative">
                                    <span className="text-4xl text-white font-black">OFM</span>
                                </div>
                                
                                <div className="absolute w-64 h-64 border border-gray-300 rounded-full animate-[spin_10s_linear_infinite]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center">💰</div>
                                </div>
                                <div className="absolute w-80 h-80 border border-gray-200 rounded-full animate-[spin_15s_linear_infinite_reverse]">
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center">🧠</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: REDESIGN - COMPARISON */}
            <section className="py-[80px] px-6 bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900">{t('blank_compare_title')}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-stretch">
                        <div className="bg-gray-50 p-10 rounded-3xl md:rounded-r-none border border-gray-200 md:border-r-0">
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">{t('blank_table_head_2')}</h3>
                            <ul className="space-y-8">
                                <li className="flex items-center justify-between opacity-50 grayscale">
                                    <span className="font-medium text-gray-900">{t('blank_table_row_1_title')}</span>
                                    <span className="text-sm font-bold">{t('blank_table_row_1_col_1')}</span>
                                </li>
                                <li className="flex items-center justify-between opacity-50 grayscale">
                                    <span className="font-medium text-gray-900">{t('blank_table_row_2_title')}</span>
                                    <span className="text-sm font-bold">{t('blank_table_row_2_col_1')}</span>
                                </li>
                                <li className="flex items-center justify-between opacity-50 grayscale">
                                    <span className="font-medium text-gray-900">{t('blank_table_row_3_title')}</span>
                                    <span className="text-sm font-bold">{t('blank_table_row_3_col_1')}</span>
                                </li>
                                <li className="flex items-center justify-between opacity-50 grayscale">
                                    <span className="font-medium text-gray-900">{t('blank_table_row_4_title')}</span>
                                    <span className="text-sm font-bold">{t('blank_table_row_4_col_1')}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-indigo-900 p-10 rounded-3xl md:rounded-l-none border border-indigo-900 text-white relative shadow-2xl transform md:scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-white/10 px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">Recommended</div>
                            <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-8">Tranvas</h3>
                            <ul className="space-y-8">
                                <li className="flex items-center justify-between border-b border-indigo-800 pb-4">
                                    <span className="font-medium text-indigo-100">{t('blank_table_row_1_title')}</span>
                                    <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_1_col_2')}</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-indigo-800 pb-4">
                                    <span className="font-medium text-indigo-100">{t('blank_table_row_2_title')}</span>
                                    <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_2_col_2')}</span>
                                </li>
                                <li className="flex items-center justify-between border-b border-indigo-800 pb-4">
                                    <span className="font-medium text-indigo-100">{t('blank_table_row_3_title')}</span>
                                    <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_3_col_2')}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="font-medium text-indigo-100">{t('blank_table_row_4_title')}</span>
                                    <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_4_col_2')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
