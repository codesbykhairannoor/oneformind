'use client';

import { useTranslations } from 'next-intl';

export default function FreelancerCommandCenter() {
    const t = useTranslations();

    return (
        <>
            {/* SECTION 3: COMMAND CENTER (DARK MODE HIGHLIGHT) */}
            <section className="py-24 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-3xl opacity-20"></div>

                <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="order-2 lg:order-1 relative h-[450px] bg-slate-900 rounded-[3rem] p-8 flex flex-col justify-center overflow-hidden border border-slate-800 shadow-2xl">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-slate-300 font-bold">{t('freelance_mockup_active_title')}</h4>
                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 font-bold">{t('freelance_mockup_active_status')}</span>
                            </div>
                            
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex justify-between items-center transform transition hover:translate-x-2 cursor-pointer">
                                <div>
                                    <p className="text-white font-bold text-sm">{t('freelance_mockup_project_1_title')}</p>
                                    <p className="text-slate-400 text-xs font-medium">{t('freelance_mockup_project_1_sub')}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs text-indigo-400 font-bold">75%</div>
                            </div>
                            
                            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex justify-between items-center transform transition hover:translate-x-2 cursor-pointer">
                                <div>
                                    <p className="text-white font-bold text-sm">{t('freelance_mockup_project_2_title')}</p>
                                    <p className="text-slate-400 text-xs font-medium">{t('freelance_mockup_project_2_sub')}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center text-xs text-amber-400 font-bold">30%</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-right-12 duration-700">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-2xl text-2xl mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)] font-black select-none">🛠️</div>
                        <h2 className="text-5xl md:text-6xl mb-6 text-white font-black">{t('freelance_feat_1_title')}</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            {t('freelance_feat_1_desc')}
                        </p>
                        <ul className="space-y-4 font-bold text-slate-300">
                            <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm shrink-0 border border-indigo-500/30">✓</span> {t('freelance_feat_1_point_1')}</li>
                            <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm shrink-0 border border-indigo-500/30">✓</span> {t('freelance_feat_1_point_2')}</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SECTION 4: INVOICE & MONEY */}
            <section className="py-24 bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl mb-6 font-black select-none">💰</div>
                        <h2 className="text-4xl md:text-5xl mb-6 text-gray-900 font-black">The Ultimate Financial Dashboard for Freelancers</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                            Stop paying $30/month for complex accounting software like QuickBooks, and stop wasting 10 hours building formulas in Excel. Get a real-time financial dashboard designed specifically for solopreneurs.
                        </p>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 font-bold">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">{t('freelance_feat_2_point_1')}</span>
                                <span className="text-emerald-500">Tracked</span>
                            </div>
                            <div className="w-full h-px bg-gray-100"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">{t('freelance_feat_2_point_2')}</span>
                                <span className="text-emerald-500">Automated</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative h-[400px] bg-white rounded-[3rem] p-8 flex items-center justify-center overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/50">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        
                        {/* Receipt Container */}
                        <div className="bg-gray-50 w-64 p-6 rounded-t-xl rounded-b-sm border border-dashed border-gray-300 relative shadow-inner">
                            <div className="text-center mb-4 border-b border-dashed border-gray-300 pb-4">
                                <h4 className="font-black text-gray-900 text-xl tracking-widest">{t('freelance_mockup_invoice_title')}</h4>
                                <p className="text-[10px] text-gray-500 mt-1 font-bold">{t('freelance_mockup_invoice_status')}</p>
                            </div>
                            <div className="space-y-2 text-xs font-semibold text-gray-600 mb-4 border-b border-dashed border-gray-300 pb-4">
                                <div className="flex justify-between"><span>{t('freelance_mockup_invoice_item_1')}</span><span>$500</span></div>
                                <div className="flex justify-between"><span>{t('freelance_mockup_invoice_item_2')}</span><span>$200</span></div>
                            </div>
                            <div className="flex justify-between text-emerald-600 text-lg font-bold">
                                <span>{t('freelance_mockup_invoice_total')}</span><span>$700</span>
                            </div>
                            {/* Zig-zag bottom edge illusion */}
                            <div className="absolute -bottom-2 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cGF0aCBkPSJNMCA4IEw0IDAgTDggOCBaIiBmaWxsPSIjRjlGQUZCIiAvPgo8L3N2Zz4=')] bg-repeat-x"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
