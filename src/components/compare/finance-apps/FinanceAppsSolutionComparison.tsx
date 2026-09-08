'use client';

import { useTranslations } from 'next-intl';

export default function FinanceAppsSolutionComparison() {
    const t = useTranslations();

    return (
        <>
            {/* STACKED CARDS (THE SOLUTION) */}
            <section className="py-[80px] px-6 bg-slate-900 overflow-hidden text-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 -z-10"></div>
                
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <div className="inline-block p-4 bg-emerald-500/20 text-emerald-400 rounded-full mb-6">
                            💎
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                            {t('finapp_sol_title_1')} <span className="text-emerald-400">{t('finapp_sol_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400">
                            {t('finapp_sol_desc')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
                        <div className="lg:col-span-7 bg-white/5 border border-white/10 p-10 md:p-12 rounded-[3rem] ">
                            <h3 className="text-3xl mb-6 font-black">{t('finapp_sol_box_title')}</h3>
                            <p className="text-slate-300 text-lg leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: t.raw('finapp_sol_box_desc') }} />
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Method</span>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Result</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-black">Mindful Entry</span>
                                    <span className="font-black text-lg">Total Privacy</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            <div className="bg-emerald-500 p-8 rounded-[2.5rem] transform transition hover:translate-x-2">
                                <div className="text-3xl mb-4 font-black">🧠</div>
                                <h4 className="font-black text-emerald-950 text-xl mb-2">Immediate Awareness</h4>
                                <p className="text-emerald-900/80 text-sm">Feel every dollar that leaves your pocket. Stop the leaks.</p>
                            </div>
                            <div className="bg-indigo-600 p-8 rounded-[2.5rem] transform transition hover:translate-x-2">
                                <div className="text-3xl mb-4 font-black">🔒</div>
                                <h4 className="font-black text-white text-xl mb-2">Zero Bank Data Storage</h4>
                                <p className="text-indigo-200 text-sm">We don't want your bank credentials. Total security by design.</p>
                            </div>
                            <div className="bg-white/10 border border-white/10 p-8 rounded-[2.5rem] transform transition hover:translate-x-2">
                                <div className="text-3xl mb-4 font-black">⚡</div>
                                <h4 className="font-black text-white text-xl mb-2">Synchronized with Goals</h4>
                                <p className="text-slate-400 text-sm">Your finances tied directly to your life milestones.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXPANDABLE/LIST COMPARISON */}
            <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('finapp_compare_title')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('finapp_compare_desc')}</p>
                    </div>

                    <div className="space-y-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute left-0 top-0 h-full w-2 bg-emerald-500"></div>
                                
                                <h3 className="text-2xl text-slate-900 mb-8 pl-4 font-bold">
                                    {t(`finapp_table_row_${i}_title`)}
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-8 pl-4">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-2">The Traditional Way</span>
                                        <p className="text-slate-500 font-medium italic">
                                            "{t(`finapp_table_row_${i}_col_1`)}"
                                        </p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                                        <span className="text-[10px] uppercase tracking-widest text-emerald-600 block mb-2 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tranvas
                                        </span>
                                        <p className="text-emerald-950 font-bold">
                                            {t(`finapp_table_row_${i}_col_2`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
