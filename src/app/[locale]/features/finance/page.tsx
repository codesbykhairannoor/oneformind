'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureFinancePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('finance_faq_q1'),
            a: t('finance_faq_a1')
        },
        {
            q: t('finance_faq_q2'),
            a: t('finance_faq_a2')
        },
        {
            q: t('finance_faq_q3'),
            a: t('finance_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="feature-finance" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT + FLOATING DASHBOARD) */}
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
                                
                                {/* Visual Card Stack */}
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
                            
                            {/* The Flow Visual Grid */}
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
                            
                            {/* Visual Connectors (Desktop Only) */}
                            <div className="absolute left-1/4 top-1/2 w-1/4 h-px bg-gradient-to-r from-emerald-500/50 to-transparent z-0 hidden lg:block"></div>
                            <div className="absolute right-1/4 top-1/2 w-1/4 h-px bg-gradient-to-l from-rose-500/50 to-transparent z-0 hidden lg:block"></div>

                        </div>
                    </div>
                </section>

                {/* SECTION 4: PRIVACY & SECURITY */}
                <section className="py-32 bg-indigo-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-indigo-950 via-transparent to-indigo-950"></div>
                    
                    <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center justify-center px-6 py-2 bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
                            {t('finance_privacy_badge')}
                        </div>
                        <h2 className="text-5xl md:text-5xl text-white mb-6 font-black">{t('finance_privacy_title')}</h2>
                        <p className="text-indigo-200 text-xl max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
                            {t('finance_privacy_desc')}
                        </p>
                        
                        <div className="grid sm:grid-cols-3 gap-8 text-left">
                            <div className="bg-indigo-900/40 p-8 rounded-[2rem] border border-indigo-800/50 hover:bg-indigo-800/40 transition">
                                <div className="text-3xl mb-6 bg-indigo-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-indigo-700/50 font-black">🔒</div>
                                <h4 className="text-white font-bold text-xl mb-3">{t('finance_privacy_point_1_title')}</h4>
                                <p className="text-indigo-300">{t('finance_privacy_point_1_desc')}</p>
                            </div>
                            <div className="bg-indigo-900/40 p-8 rounded-[2rem] border border-indigo-800/50 hover:bg-indigo-800/40 transition">
                                <div className="text-3xl mb-6 bg-indigo-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-indigo-700/50 font-black">🚫</div>
                                <h4 className="text-white font-bold text-xl mb-3">{t('finance_privacy_point_2_title')}</h4>
                                <p className="text-indigo-300">{t('finance_privacy_point_2_desc')}</p>
                            </div>
                            <div className="bg-indigo-900/40 p-8 rounded-[2rem] border border-indigo-800/50 hover:bg-indigo-800/40 transition">
                                <div className="text-3xl mb-6 bg-indigo-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-indigo-700/50 font-black">🤝</div>
                                <h4 className="text-white font-bold text-xl mb-3">{t('finance_privacy_point_3_title')}</h4>
                                <p className="text-indigo-300">{t('finance_privacy_point_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: WEALTH TRAJECTORY */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-emerald-200">
                                {t('finance_trajectory_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                {t('finance_trajectory_title')}
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed font-medium">
                                {t('finance_trajectory_desc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-20 text-left">
                            
                            {/* Trajectory Card 1 */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] group-hover:scale-110 transition duration-700"></div>
                                <div className="relative z-10">
                                    <span className="text-emerald-500 text-4xl mb-6 block font-black">📈</span>
                                    <h4 className="text-gray-400 uppercase tracking-widest text-[11px] mb-2">{t('finance_stat_projection_title')}</h4>
                                    <p className="text-4xl text-gray-900 tabular-nums font-black">{t('finance_stat_projection_val')}</p>
                                    <div className="mt-6 w-full h-1 bg-emerald-100 rounded-full">
                                        <div className="w-2/3 h-full bg-emerald-500 rounded-full animate-in slide-in-from-left duration-1000"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Trajectory Card 2 */}
                            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-800 transform md:-translate-y-4 group relative overflow-hidden">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 text-white">
                                    <span className="text-indigo-400 text-4xl mb-6 block font-black">🎯</span>
                                    <h4 className="text-indigo-300/40 uppercase tracking-widest text-[11px] mb-2">{t('finance_stat_savings_title')}</h4>
                                    <p className="text-4xl text-white tabular-nums font-black">{t('finance_stat_savings_val')}</p>
                                    <div className="mt-8 flex items-center gap-2 bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-300 text-[10px] uppercase tracking-widest animate-pulse">
                                        On Track to Achieve
                                    </div>
                                </div>
                            </div>

                            {/* Trajectory Card 3 */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[4rem] group-hover:scale-110 transition duration-700"></div>
                                <div className="relative z-10">
                                    <span className="text-amber-500 text-4xl mb-6 block font-black">🏖️</span>
                                    <h4 className="text-gray-400 uppercase tracking-widest text-[11px] mb-2">{t('finance_stat_freedom_title')}</h4>
                                    <p className="text-4xl text-gray-900 tabular-nums font-black">{t('finance_stat_freedom_val')}</p>
                                    <p className="mt-4 text-gray-400 text-xs font-medium">{t('finance_fire_date_label')}</p>
                                </div>
                            </div>

                        </div>

                        {/* Growth Visualization Line */}
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 relative overflow-hidden animate-in zoom-in-95 duration-700">
                            <div className="flex justify-between items-end mb-12 text-left">
                                <div>
                                    <h3 className="text-2xl text-gray-900 mb-2 font-black">{t('finance_compound_title')}</h3>
                                    <p className="text-gray-500 text-sm font-medium">{t('finance_compound_desc')}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                                        <span className="text-[10px] uppercase text-gray-400">{t('finance_compound_legend_1')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
                                        <span className="text-[10px] uppercase text-gray-400">{t('finance_compound_legend_2')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative h-48 w-full flex items-end gap-[2%]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className="flex-1 bg-indigo-50 rounded-t-lg relative group transition-all duration-500 hover:bg-indigo-100" style={{ height: `${20 + i * 4}%` }}>
                                        <div className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded-t-lg transition-all duration-1000" style={{ height: `${10 + i * 3.5}%` }}></div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20 pointer-events-none">
                                            Year {2024 + i}: Rp {10 + i * 15}M
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 6: THE SUCCESS QUOTE */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                        <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                            {t('finance_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs">{t('finance_quote_author')}</p>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">{t('finance_quote_legend')}</p>
                        </div>
                    </div>
                </section>

                {/* NEW SECTION: SCIENTIFIC PILLAR (E-E-A-T) - GLASSMORPHIC LAYOUT */}
                <section className="py-32 bg-indigo-50/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/money.png')] opacity-[0.03] grayscale"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="bg-white/60 rounded-[4rem] border border-white p-12 md:p-20 shadow-2xl flex flex-col lg:flex-row items-center gap-16">
                            
                            <div className="flex-1 text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-widest mb-8">
                                    🧬 {t('finance_science_badge')}
                                </div>
                                <h2 className="text-5xl md:text-5xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                    {t('finance_science_title')}
                                </h2>
                                <p className="text-gray-600 text-xl leading-relaxed mb-10 italic font-medium opacity-80">
                                    {t('finance_science_desc')}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest">Mindful Spending</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest">Kakeibo Method</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest">Zero-Based Budgeting</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest">Trust & Accuracy</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Visual Side */}
                            <div className="flex-1 w-full max-w-md bg-indigo-900 rounded-[3rem] p-8 text-white shadow-2xl relative group overflow-hidden text-left">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800 to-indigo-600 opacity-50 group-hover:scale-110 transition duration-700"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl font-bold">🛡️</div>
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-indigo-300">verified system</span>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs font-bold text-indigo-200">Probability of Success</span>
                                                <span className="text-xs text-emerald-400">+98.2%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="w-[98%] h-full bg-emerald-500"></div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                                <span className="text-[10px] text-indigo-300 uppercase block mb-1">Dopamine Score</span>
                                                <span className="text-xl font-bold">Optimal</span>
                                            </div>
                                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                                <span className="text-[10px] text-indigo-300 uppercase block mb-1">Error Rate</span>
                                                <span className="text-xl font-bold">0.02%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg"><span className="text-xs font-semibold">Daniel Kahneman</span></div>
                                        <div className="p-2 bg-indigo-500/20 rounded-lg"><span className="text-xs font-semibold">Kakeibo Philosophy</span></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 8: CTA BANNER */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-indigo-800">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"></div>
                        
                        <div className="relative z-10 text-white">
                            <h2 className="text-5xl md:text-6xl mb-8 tracking-tight font-black">{t('finance_cta_title')}</h2>
                            <p className="text-indigo-200 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium">
                                {t('finance_cta_desc')}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                                <Link href="/register" className="w-full sm:w-auto bg-white text-indigo-900 px-12 py-5 rounded-full text-lg hover:bg-indigo-50 transition transform hover:scale-105 shadow-xl shadow-indigo-900/50 font-bold">
                                    {t('finance_cta_btn')}
                                </Link>
                            </div>
                            <p className="mt-8 text-sm text-indigo-300 font-medium">{t('finance_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Finance OS (FAQ)
                        </h2>
                        <div className="space-y-4 text-left">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} size={20} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </GuestLayout>
    );
}
