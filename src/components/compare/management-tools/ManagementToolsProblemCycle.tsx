'use client';

import { useTranslations } from 'next-intl';

export default function ManagementToolsProblemCycle() {
    const t = useTranslations();

    return (
        <>
            {/* THE CYCLE */}
            <section className="py-[80px] bg-white relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('pm_cycle_title')}</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('pm_cycle_desc')}</p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-slate-200 to-red-100 rounded-full"></div>

                        <div className="space-y-12">
                            <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                                <div className="order-2 md:order-1 md:w-1/2 md:text-right pl-20 md:pl-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pm_cycle_1_title')}</h3>
                                    <p className="text-gray-500">{t('pm_cycle_1_desc')}</p>
                                </div>
                                <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 w-16 h-16 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 group-hover:scale-110 transition group-hover:border-blue-500 font-black">
                                    👔
                                </div>
                                <div className="order-3 md:w-1/2 hidden md:block"></div>
                            </div>

                            <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                                 <div className="order-3 md:order-1 md:w-1/2 hidden md:block"></div>
                                <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 group-hover:scale-110 transition group-hover:border-slate-500 font-black">
                                    📉
                                </div>
                                <div className="order-2 md:order-3 md:w-1/2 pl-20 md:pl-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pm_cycle_2_title')}</h3>
                                    <p className="text-gray-500">{t('pm_cycle_2_desc')}</p>
                                </div>
                            </div>

                            <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                                <div className="order-2 md:order-1 md:w-1/2 md:text-right pl-20 md:pl-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pm_cycle_3_title')}</h3>
                                    <p className="text-gray-500">{t('pm_cycle_3_desc')}</p>
                                </div>
                                <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 w-16 h-16 bg-white border-4 border-red-100 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 group-hover:scale-110 transition group-hover:border-red-500 font-black">
                                    🏃
                                </div>
                                <div className="order-3 md:w-1/2 hidden md:block"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE PROBLEM */}
            <section className="py-[80px] bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-2xl"></div>

                <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-800 bg-red-900/30 text-red-400 text-xs font-mono mb-8">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-1"></span>
                            CRITICAL ERROR
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-white">
                            {t('pm_prob_title_1')} <span className="text-red-500 bg-red-500/10 px-2 rounded">{t('pm_prob_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">
                            {t('pm_prob_desc')}
                        </p>
                        
                        <div className="font-mono text-sm space-y-3">
                            <div className="flex items-center gap-3 text-red-300">
                                <span>&gt;</span> {t('pm_prob_point_1')}
                            </div>
                            <div className="flex items-center gap-3 text-red-300">
                                <span>&gt;</span> {t('pm_prob_point_2')}
                            </div>
                            <div className="flex items-center gap-3 text-red-300">
                                <span>&gt;</span> {t('pm_prob_point_3')}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl">
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="h-2 bg-slate-600 rounded w-32"></div>
                            </div>
                            <div className="space-y-4 opacity-50">
                                <div className="flex gap-4">
                                    <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                    <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                    <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                    <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                </div>
                                <div className="h-4 bg-slate-700 rounded w-full"></div>
                                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                            </div>
                            
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-slate-900 border border-red-500/50 p-4 rounded-lg shadow-2xl z-20 text-center">
                                <div className="text-3xl mb-2 font-black">📢</div>
                                <p className="text-white font-bold text-sm">New Notification</p>
                                <p className="text-xs text-slate-400 mt-1">Jira: Ticket #999 updated by 5 people...</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-48 bg-slate-900 border border-slate-600 p-4 rounded-lg shadow-xl z-10 opacity-80">
                                 <div className="h-2 bg-slate-700 rounded w-full mb-2"></div>
                                 <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
