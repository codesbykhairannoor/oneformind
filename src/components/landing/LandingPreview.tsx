'use client';

import { useTranslations } from 'next-intl';

export default function LandingPreview() {
    const t = useTranslations();

    return (
        <section className="py-40 bg-white bg-pattern-diagonal relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="relative order-2 lg:order-1">
                        {/* DEEP GRADIENT ORB */}
                        <div className="absolute -inset-20 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-2xl opacity-40"></div>
                        
                        <div className="relative bg-slate-900 rounded-[3rem] p-1 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] border-[12px] border-slate-800 overflow-hidden transform lg:-rotate-2 hover:rotate-0 transition-transform duration-700 aspect-[16/10]" role="img" aria-label="Tranvas Dashboard Preview: A unified interface showing habit tracking heatmap, finance budgeting progress, and a clean task management layout.">
                            <div className="absolute top-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
                               <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                               </div>
                            </div>
                            {/* MOCK CONTENT */}
                            <div className="p-8 mt-8 grid grid-cols-12 gap-4 h-full">
                                <div className="col-span-3 space-y-4">
                                    <div className="h-12 bg-slate-800 rounded-xl animate-pulse"></div>
                                    <div className="h-12 bg-slate-800/40 rounded-xl"></div>
                                    <div className="h-12 bg-slate-800/40 rounded-xl"></div>
                                </div>
                                <div className="col-span-9 space-y-4">
                                    <div className="h-32 bg-indigo-600 rounded-3xl p-6 flex items-end">
                                        <div className="h-8 w-1/3 bg-white/20 rounded-full"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-40 bg-slate-800 rounded-3xl p-6">
                                            <div className="flex gap-2 mb-4">
                                                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                                                <div className="w-4 h-4 bg-emerald-500/20 rounded-full"></div>
                                            </div>
                                            <div className="h-4 w-1/2 bg-slate-700 rounded-full"></div>
                                        </div>
                                        <div className="h-40 bg-slate-800 rounded-3xl p-6">
                                            <div className="text-xl font-black text-indigo-400">Rp 12,5jt</div>
                                            <div className="h-2 w-full bg-slate-700 rounded-full mt-4 overflow-hidden">
                                                <div className="h-full bg-indigo-500 w-3/4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] mb-8 uppercase tracking-widest border border-indigo-100">
                            {t('vsn_badge')}
                        </div>
                        <h2 className="text-5xl md:text-7xl text-slate-900 mb-8 leading-tight font-black">
                            {t('vsn_title')}
                        </h2>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">
                            {t('vsn_desc')}
                        </p>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">🖱️</div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">⌨️</div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">📱</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
