'use client';

import React from 'react';
import { Link } from '@/i18n/routing';

interface FinanceFeatureHeroProps {
    t: any;
}

export default function FinanceFeatureHero({ t }: FinanceFeatureHeroProps) {
    return (
        <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                        <span className="text-lg">💰</span> {t('finance_hero_badge')}
                    </div>
                    
                    <h1 className="text-6xl leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                        {t('finance_hero_title_1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {t('finance_hero_title_2')}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                        {t('finance_hero_desc')}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                            {t('finance_hero_cta_1')}
                        </Link>
                        <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                            {t('finance_hero_cta_2')}
                        </a>
                    </div>
                </div>

                {/* Floating Mockup Centered */}
                <div className="relative w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20"></div>
                    <div className="relative bg-white/90 rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-10 transform transition hover:scale-[1.02] duration-500">
                        
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6 text-left">
                            <div>
                                <h3 className="font-black text-gray-900 text-2xl mb-1">{t('finance_mockup_title')} 💳</h3>
                                <p className="text-sm text-gray-500">{t('finance_mockup_alert_1')}</p>
                            </div>
                            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl border border-indigo-100">
                                <span className="text-xs font-bold uppercase block mb-1 opacity-70">{t('finance_mockup_balance_label')}</span>
                                <span className="font-black text-xl">{t('finance_mockup_balance')} 📈</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4 text-left">
                            {/* Task 1 (Income) */}
                            <div className="flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl transition border border-transparent hover:border-emerald-100 cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-sm">↓</div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{t('finance_mockup_task_1')}</p>
                                    <p className="text-sm text-gray-500">{t('finance_mockup_time_1')}</p>
                                </div>
                                <div className="font-black text-emerald-600">+ Rp 5.000.000</div>
                            </div>
                            
                            {/* Task 2 (Expense) */}
                            <div className="flex items-center gap-4 p-4 hover:bg-rose-50 rounded-2xl transition border border-transparent hover:border-rose-100 cursor-pointer">
                                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-sm">↑</div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{t('finance_mockup_task_2')}</p>
                                    <p className="text-sm text-gray-500">{t('finance_mockup_time_2')}</p>
                                </div>
                                <div className="font-black text-rose-600">- Rp 45.000</div>
                            </div>

                            {/* Alert Pop-up */}
                            <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                                <span className="text-xl mt-0.5">⚠️</span>
                                <div>
                                    <p className="font-bold text-amber-900 text-sm">{t('finance_mockup_alert_2')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
