'use client';

import { useTranslations } from 'next-intl';

export default function HabitAppsSolutionComparison() {
    const t = useTranslations();

    return (
        <>
            {/* THE SOLUTION -> ATOMIC GROWTH */}
            <section className="py-[80px] bg-indigo-50/50 border-y border-indigo-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <div className="inline-block p-4 bg-white rounded-full shadow-md mb-6 animate-bounce">
                            🌱
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                            {t('habitap_sol_title_1')} <span className="text-indigo-600">{t('habitap_sol_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">
                            {t('habitap_sol_desc')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-indigo-50 hover:-translate-y-2 transition duration-300">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">🍃</div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">{t('habitap_sol_1_title')}</h3>
                            <p className="text-gray-500 leading-relaxed">{t('habitap_sol_1_desc')}</p>
                        </div>

                        <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-200 text-white transform md:scale-105 relative z-10">
                            <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl font-black">🔗</div>
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-6">🧠</div>
                            <h3 className="font-bold text-xl mb-3">{t('habitap_sol_2_title')}</h3>
                            <p className="text-indigo-100 leading-relaxed">{t('habitap_sol_2_desc')}</p>
                            <div className="mt-6 pt-6 border-t border-indigo-500/50 flex flex-wrap items-center gap-3">
                                 <span className="text-xs bg-indigo-800 px-2 py-1 rounded">Habits</span>
                                 <span className="text-xs text-indigo-300">+</span>
                                 <span className="text-xs bg-indigo-800 px-2 py-1 rounded">Goals</span>
                                 <span className="text-xs text-indigo-300">=</span>
                                 <span className="text-xs font-bold">System</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-indigo-50 hover:-translate-y-2 transition duration-300">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">{t('habitap_sol_3_title')}</h3>
                            <p className="text-gray-500 leading-relaxed">{t('habitap_sol_3_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPARISON -> GAME VS LIFE */}
            <section className="py-[80px] bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-6">{t('habitap_compare_title')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('habitap_compare_desc')}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-900 p-10 rounded-3xl border-4 border-gray-800 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(50,50,50,1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                            <h3 className="text-gray-400 font-mono text-sm mb-8 uppercase tracking-widest text-center">{t('habitap_table_head_2')}</h3>
                            
                            <div className="space-y-6 font-mono text-sm">
                                <div className="flex items-center justify-between text-red-400 grayscale opacity-70">
                                    <span>👾 {t('habitap_table_row_1_title')}</span>
                                    <span>{t('habitap_table_row_1_col_1')}</span>
                                </div>
                                <div className="flex items-center justify-between text-red-400 grayscale opacity-70">
                                    <span>📉 {t('habitap_table_row_2_title')}</span>
                                    <span>{t('habitap_table_row_2_col_1')}</span>
                                </div>
                                <div className="flex items-center justify-between text-red-400 grayscale opacity-70">
                                    <span>🥀 {t('habitap_table_row_3_title')}</span>
                                    <span>{t('habitap_table_row_3_col_1')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-10 rounded-3xl border border-indigo-100 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-4 py-2 rounded-bl-2xl">RECOMMENDED</div>
                            <h3 className="text-indigo-900 font-bold text-sm mb-8 uppercase tracking-widest text-center">Tranvas</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('habitap_table_row_1_title')}</span>
                                    <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm text-right">{t('habitap_table_row_1_col_2')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('habitap_table_row_2_title')}</span>
                                    <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm text-right">{t('habitap_table_row_2_col_2')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm md:text-base">
                                    <span className="font-bold text-gray-900">{t('habitap_table_row_3_title')}</span>
                                    <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm text-right">{t('habitap_table_row_3_col_2')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
