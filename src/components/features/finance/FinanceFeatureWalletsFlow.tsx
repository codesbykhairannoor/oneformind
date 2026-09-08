'use client';

import React from 'react';

interface FinanceFeatureWalletsFlowProps {
    t: any;
}

export default function FinanceFeatureWalletsFlow({ t }: FinanceFeatureWalletsFlowProps) {
    return (
        <>
            {/* SECTION 2: GLASSMORPHISM WALLETS */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
                                {t('finance_wallet_badge')}
                            </div>
                            <h2 className="text-5xl md:text-5xl text-gray-900 mb-6 leading-tight font-black">
                                {t('finance_wallet_title')}
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {t('finance_wallet_desc')}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 transform hover:scale-[1.02] transition cursor-default">
                                    <span className="text-2xl">🏦</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{t('finance_wallet_1_title')}</p>
                                        <p className="text-xs text-gray-500">{t('finance_wallet_1_desc')}</p>
                                    </div>
                                    <span className="font-black text-gray-900">{t('finance_mockup_balance_value')}</span>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 transform hover:scale-[1.02] transition cursor-default">
                                    <span className="text-2xl">💳</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{t('finance_wallet_2_title')}</p>
                                        <p className="text-xs text-gray-500">{t('finance_wallet_2_desc')}</p>
                                    </div>
                                    <span className="font-black text-rose-600">- Rp 4.250.000</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
                            <div className="absolute -inset-10 bg-indigo-500/10 blur-3xl rounded-full -z-10"></div>
                            
                            <div className="relative h-[450px] w-full flex items-center justify-center lg:block text-left">
                                {/* Card 1 */}
                                <div className="absolute top-10 right-0 w-full max-w-[340px] h-56 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] transform rotate-6 hover:rotate-3 transition duration-500 hidden md:block">
                                    <div className="flex justify-between items-start mb-12">
                                        <span className="text-xl tracking-widest uppercase italic font-bold">{t('finance_brand')}</span>
                                        <span className="text-3xl font-black">🏦</span>
                                    </div>
                                    <div className="mb-2 text-[10px] opacity-60 tracking-widest uppercase">{t('finance_wallet_card_label')}</div>
                                    <div className="text-3xl font-black">{t('finance_mockup_income')}</div>
                                </div>

                                {/* Card 2 (Glass) */}
                                <div className="relative md:absolute bottom-10 left-0 w-full max-w-[380px] h-60 bg-white/40 rounded-[2.5rem] p-10 border border-white shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500 z-10 flex flex-col justify-between">
                                    <div className="flex justify-between items-start text-gray-900">
                                        <div>
                                            <span className="text-[10px] tracking-widest uppercase opacity-40 block mb-1">{t('finance_wallet_glass_badge')}</span>
                                            <h3 className="font-black text-lg leading-tight uppercase tracking-tight">{t('finance_wallet_glass_title')}</h3>
                                        </div>
                                        <div className="w-12 h-8 bg-gray-900/10 rounded-lg flex items-center justify-center gap-0.5">
                                            <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                                            <div className="w-4 h-4 bg-orange-400 rounded-full -ml-2"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between text-gray-900">
                                        <div>
                                            <div className="text-[11px] uppercase tracking-widest opacity-30 mb-1">{t('finance_wallet_glass_spending_label')}</div>
                                            <div className="text-3xl tracking-tighter font-black">{t('finance_mockup_expense')}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[11px] uppercase tracking-widest opacity-30 mb-1">{t('finance_wallet_glass_safe_label')}</div>
                                            <div className="text-lg text-emerald-600 font-bold">{t('finance_mockup_saving')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: SPENDING FLOW */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:48px_48px] opacity-10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">{t('finance_flow_badge')}</span>
                        <h2 className="text-5xl md:text-6xl mb-8 font-black">{t('finance_flow_title')}</h2>
                        <p className="text-indigo-200 text-xl opacity-80 max-w-3xl mx-auto mb-24">{t('finance_flow_desc')}</p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 md:gap-20 items-center">
                            {/* Income Source */}
                            <div className="flex flex-col gap-6 animate-in slide-in-from-left-12 duration-1000 fill-mode-both text-left">
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] group hover:bg-emerald-500/10 transition duration-500">
                                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest mb-3 block opacity-60">{t('finance_flow_income_label_1')}</span>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-2xl">{t('finance_flow_income_title_1')}</span>
                                        <div className="text-right">
                                            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg block mb-1">+85%</span>
                                            <span className="text-[10px] opacity-40 uppercase font-bold">{t('finance_flow_contribution_label')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-[2rem] group hover:bg-indigo-500/10 transition duration-500">
                                    <span className="text-[10px] text-indigo-400 uppercase tracking-widest mb-3 block opacity-60">{t('finance_flow_income_label_2')}</span>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-2xl">{t('finance_flow_income_title_2')}</span>
                                        <div className="text-right">
                                            <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-lg block mb-1">+15%</span>
                                            <span className="text-[10px] opacity-40 uppercase font-bold">{t('finance_flow_contribution_label')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Hub */}
                            <div className="relative flex items-center justify-center py-12 md:py-0">
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <div className="w-64 h-64 bg-indigo-600/10 rounded-full animate-ping [animation-duration:4000ms]"></div>
                                    <div className="absolute w-48 h-48 border border-white/5 rounded-full animate-spin [animation-duration:10000ms]"></div>
                                </div>
                                <div className="w-40 h-40 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-[0_0_80px_rgba(79,70,229,0.6)] z-10 transform rotate-12 animate-pulse font-black">
                                    💰
                                </div>
                            </div>

                            {/* Expenses Destination */}
                            <div className="flex flex-col gap-6 animate-in slide-in-from-right-12 duration-1000 fill-mode-both text-left">
                                <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2rem] group hover:bg-rose-500/10 transition duration-500">
                                    <span className="text-[10px] text-rose-400 uppercase tracking-widest mb-3 block opacity-60">{t('finance_flow_expense_label_1')}</span>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-2xl">{t('finance_flow_expense_title_1')}</span>
                                        <div className="text-right">
                                            <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2 py-1 rounded-lg block mb-1">{t('finance_flow_percentage_1')}</span>
                                            <span className="text-[10px] opacity-40 uppercase font-bold">{t('finance_flow_allocation_label')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-amber-500/5 border border-amber-500/20 p-8 rounded-[2rem] group hover:bg-amber-500/10 transition duration-500">
                                    <span className="text-[10px] text-amber-400 uppercase tracking-widest mb-3 block opacity-60">{t('finance_flow_expense_label_2')}</span>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-2xl">{t('finance_flow_expense_title_2')}</span>
                                        <div className="text-right">
                                            <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded-lg block mb-1">{t('finance_flow_percentage_2')}</span>
                                            <span className="text-[10px] opacity-40 uppercase font-bold">{t('finance_flow_allocation_label')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="absolute left-1/4 top-1/2 w-1/4 h-px bg-gradient-to-r from-emerald-500/50 to-transparent z-0 hidden lg:block"></div>
                        <div className="absolute right-1/4 top-1/2 w-1/4 h-px bg-gradient-to-l from-rose-500/50 to-transparent z-0 hidden lg:block"></div>
                    </div>
                </div>
            </section>
        </>
    );
}
