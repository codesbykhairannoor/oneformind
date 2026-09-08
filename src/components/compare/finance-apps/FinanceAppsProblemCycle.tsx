'use client';

import { useTranslations } from 'next-intl';

export default function FinanceAppsProblemCycle() {
    const t = useTranslations();

    return (
        <>
            {/* HORIZONTAL FLOWCHART (THE TRAP) */}
            <section className="py-[80px] px-6 bg-slate-50 relative overflow-hidden border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">{t('finapp_cycle_title')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('finapp_cycle_desc')}</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-5xl mx-auto relative">
                        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-emerald-200 via-rose-200 to-indigo-200 -z-10 transform -translate-y-1/2"></div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full md:w-1/3 text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-emerald-50 border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md mb-4">🔗</div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{t('finapp_cycle_1_title')}</h3>
                            <p className="text-slate-500 text-sm">{t('finapp_cycle_1_desc')}</p>
                        </div>
                        
                        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 shadow-inner w-full md:w-1/3 text-center relative z-10 transform md:scale-110">
                            <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] px-2 py-1 rounded-full shadow-sm animate-pulse">DANGER</div>
                            <div className="w-16 h-16 mx-auto bg-rose-100 border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md mb-4">🙈</div>
                            <h3 className="font-bold text-lg text-rose-900 mb-2">{t('finapp_cycle_2_title')}</h3>
                            <p className="text-rose-700/80 text-sm">{t('finapp_cycle_2_desc')}</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full md:w-1/3 text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-indigo-50 border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md mb-4">💥</div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{t('finapp_cycle_3_title')}</h3>
                            <p className="text-slate-500 text-sm">{t('finapp_cycle_3_desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEXT WITH CSS PIE CHART (THE PROBLEM) */}
            <section className="py-[80px] px-6 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 animate-in slide-in-from-bottom-12 fade-in duration-1000">
                        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-rose-100 font-black">🛡️</div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">
                            {t('finapp_prob_title_1')} <span className="text-rose-500 decoration-rose-200 underline decoration-4 underline-offset-4">{t('finapp_prob_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                            {t('finapp_prob_desc')}
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-1">✕</span>
                                <p className="text-slate-700 font-medium">{t('finapp_prob_point_1')}</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-1">✕</span>
                                <p className="text-slate-700 font-medium">{t('finapp_prob_point_2')}</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-6 h-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-1">✕</span>
                                <p className="text-slate-700 font-medium">{t('finapp_prob_point_3')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 relative h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border border-slate-100 animate-in slide-in-from-right-12 fade-in duration-1000 delay-200">
                        <h4 className="absolute top-8 text-xs uppercase tracking-widest text-slate-400 text-center w-full">Your "Automated" Reality</h4>
                        
                        <div className="relative w-48 h-48 rounded-full shadow-inner border-8 border-white mb-8" style={{ background: 'conic-gradient(#f43f5e 0% 30%, #e2e8f0 30% 100%)' }}>
                            <div className="absolute inset-4 bg-slate-50 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-3xl text-rose-500 font-black">30%</span>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-600 mb-8 text-center px-8">Only 30% of automated transactions are categorized correctly without your intervention.</p>
                        
                        <div className="w-3/4 space-y-3">
                             <div className="bg-white border-l-4 border-rose-500 p-3 rounded-r-xl shadow-sm flex justify-between items-center text-xs">
                                 <span className="font-bold text-slate-700">Bank 1 Sync Error</span>
                                 <span className="text-rose-500">Fix now</span>
                             </div>
                             <div className="bg-white border-l-4 border-amber-500 p-3 rounded-r-xl shadow-sm flex justify-between items-center text-xs opacity-75">
                                 <span className="font-bold text-slate-700">Uncategorized: $450</span>
                                 <span className="text-amber-500">Review</span>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
