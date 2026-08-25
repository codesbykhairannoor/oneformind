'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionFinanceMasteryPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('solve_finance_faq_q1'),
            a: t('solve_finance_faq_a1')
        },
        {
            q: t('solve_finance_faq_q2'),
            a: t('solve_finance_faq_a2')
        },
        {
            q: t('solve_finance_faq_q3'),
            a: t('solve_finance_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-finance-mastery" className="overflow-x-hidden text-left">
                
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative border-b border-gray-100">
                    <div className="mt-20 absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-700 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                                💰 {t('solve_finance_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl mb-6 leading-[1.05] text-gray-900 tracking-tight font-black">
                                {t('solve_finance_hero_title_1')}
                                <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('solve_finance_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl">
                                {t('solve_finance_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-1 text-center">
                                    {t('solve_finance_hero_cta')}
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative z-10 w-full animate-in fade-in slide-in-from-right-12 duration-1000">
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-400 to-rose-400 rounded-[2.5rem] blur opacity-20 "></div>
                            <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white flex flex-col h-[500px] overflow-hidden transform transition hover:scale-[1.01] duration-500 p-8">
                                <div className="space-y-6">
                                    <div className="p-6 bg-indigo-950 rounded-3xl text-white shadow-xl">
                                        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">{t('finance_mockup_assets')}</p>
                                        <h3 className="text-3xl font-black">Rp 42.500.000</h3>
                                        <div className="mt-4 flex gap-2">
                                            <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold">{t('finance_mockup_growth')}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <p className="text-emerald-600 text-[10px] font-bold uppercase mb-1">{t('finance_mockup_income')}</p>
                                            <p className="font-black text-emerald-950">Rp 12,5M</p>
                                        </div>
                                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                            <p className="text-rose-600 text-[10px] font-bold uppercase mb-1">{t('finance_mockup_expenses')}</p>
                                            <p className="font-black text-rose-950">Rp 4,2M</p>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-[10px] uppercase text-gray-500">{t('finance_mockup_goal')}</h4>
                                            <span className="text-indigo-600 text-[10px] font-bold">75%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="bg-indigo-600 h-full w-[75%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-32 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('solve_finance_prob_title')}</h2>
                            <p className="text-xl text-gray-500">{t('solve_finance_prob_desc')}</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 bg-rose-50/50 p-10 rounded-[3rem] border border-rose-100">
                                <div className="text-5xl mb-6 font-black select-none">📉</div>
                                <h3 className="text-2xl font-bold text-rose-900 mb-4">{t('solve_finance_prob_1_title')}</h3>
                                <ul className="space-y-4 text-rose-800/70">
                                    <li className="flex items-center gap-3"><span className="text-rose-500 font-bold">✕</span> {t('solve_finance_prob_1_point_1')}</li>
                                    <li className="flex items-center gap-3"><span className="text-rose-500 font-bold">✕</span> {t('solve_finance_prob_1_point_2')}</li>
                                    <li className="flex items-center gap-3"><span className="text-rose-500 font-bold">✕</span> {t('solve_finance_prob_1_point_3')}</li>
                                </ul>
                            </div>
                            <div className="flex-1 bg-gray-50 p-10 rounded-[3rem] border border-gray-200">
                                <div className="text-5xl mb-6 font-black select-none">📊</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('solve_finance_prob_2_title')}</h3>
                                <ul className="space-y-4 text-gray-500">
                                    <li className="flex items-center gap-3"><span className="text-gray-400 font-bold">✕</span> {t('solve_finance_prob_2_point_1')}</li>
                                    <li className="flex items-center gap-3"><span className="text-gray-400 font-bold">✕</span> {t('solve_finance_prob_2_point_2')}</li>
                                    <li className="flex items-center gap-3"><span className="text-gray-400 font-bold">✕</span> {t('solve_finance_prob_2_point_3')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            
                            {/* Left: Engine Visual */}
                            <div className="relative w-full aspect-square max-h-[500px] flex items-center justify-center">
                                <div className="absolute inset-0 border border-slate-700 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                                    <div className="w-4 h-4 bg-indigo-500 rounded-full absolute -top-2"></div>
                                </div>
                                <div className="absolute inset-8 border border-slate-600 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full absolute -bottom-1.5"></div>
                                </div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                                    <div className="bg-indigo-500/20 p-6 rounded-full border border-indigo-500/30 mb-4 ">
                                        <span className="text-5xl font-black select-none">🏦</span>
                                    </div>
                                    <h4 className="text-2xl tracking-widest uppercase text-indigo-400 font-bold">{t('finance_science_viz_title')}</h4>
                                    <p className="text-slate-400 text-sm mt-2">{t('finance_science_viz_sub')}</p>
                                </div>
                            </div>

                            {/* Right: Features */}
                            <div>
                                <h2 className="text-5xl md:text-6xl mb-8 leading-tight font-black">
                                    {t('solve_finance_sol_title')}
                                </h2>
                                <div className="space-y-8">
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                        <h4 className="text-xl font-bold text-indigo-400 mb-2">{t('solve_finance_sol_feat_1_title')}</h4>
                                        <p className="text-slate-400">{t('solve_finance_sol_feat_1_desc')}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                        <h4 className="text-xl font-bold text-purple-400 mb-2">{t('solve_finance_sol_feat_2_title')}</h4>
                                        <p className="text-slate-400">{t('solve_finance_sol_feat_2_desc')}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                        <h4 className="text-xl font-bold text-blue-400 mb-2">{t('solve_finance_sol_feat_3_title')}</h4>
                                        <p className="text-slate-400">{t('solve_finance_sol_feat_3_desc')}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 4: THE SYNERGY */}
                <section className="py-32 bg-indigo-50/50 border-t border-indigo-100">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-6xl text-indigo-950 mb-6 font-black">{t('solve_finance_syn_title')}</h2>
                        <p className="text-xl text-indigo-800/70 max-w-2xl mx-auto mb-16">{t('solve_finance_syn_desc')}</p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-indigo-100 w-full md:w-1/3">
                                <div className="text-4xl mb-4 font-black select-none">☕</div>
                                <p className="font-bold text-gray-900">{t('finance_synergy_habit_title')}</p>
                                <p className="text-sm text-gray-500">"{t('finance_synergy_habit_desc')}"</p>
                            </div>
                            <div className="text-indigo-500 text-4xl font-black select-none">→</div>
                            <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl w-full md:w-1/3 transform scale-105">
                                <div className="text-4xl mb-4 font-black select-none">💰</div>
                                <p className="font-bold text-indigo-100">{t('finance_synergy_alloc_title')}</p>
                                <p className="text-2xl mt-1 font-bold">{t('finance_synergy_alloc_amount')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: PORTFOLIO REBALANCING */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative">
                            <div className="flex justify-center gap-4">
                                <div className="w-12 h-32 bg-indigo-500 rounded-t-full"></div>
                                <div className="w-12 h-48 bg-purple-500 rounded-t-full"></div>
                                <div className="w-12 h-24 bg-sky-500 rounded-t-full"></div>
                                <div className="w-12 h-40 bg-emerald-500 rounded-t-full"></div>
                            </div>
                            <div className="mt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t('finance_extra_1_label')}</div>
                        </div>
                        <div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-6 font-black">{t('solve_finance_extra_1_title')}</h2>
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                {t('solve_finance_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: FREEDOM RUNWAY */}
                <section className="py-32 bg-slate-950 text-white relative text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl mb-8 font-black">{t('solve_finance_extra_2_title')}</h2>
                        <p className="text-xl text-slate-400 leading-relaxed mb-12 italic">
                            {t('solve_finance_extra_2_desc')}
                        </p>
                        <div className="inline-block p-8 bg-white/5 rounded-3xl border border-white/10 ">
                            <div className="text-6xl text-indigo-400 mb-2 font-black">18</div>
                            <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t('finance_extra_2_label')}</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-slate-50 relative overflow-hidden border-y border-gray-100">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.03)_1px,transparent_1px)] [background-size:60px_60px] opacity-40"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-white border-y-4 border-slate-900 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden group">
                            
                            <div className="grid lg:grid-cols-2 gap-20 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white text-[10px] uppercase tracking-[0.3em] mb-10 font-bold">
                                        🧬 {t('solve_finance_science_badge')}
                                    </div>

                                    <h2 className="text-5xl md:text-7xl text-slate-900 mb-10 leading-[1.1] font-black">
                                        {t('solve_finance_science_title')}
                                    </h2>

                                    <div className="relative py-10 px-10 bg-slate-50 border border-slate-200 rounded-3xl mb-12">
                                        <p className="text-slate-700 text-xl md:text-2xl font-serif italic leading-relaxed">
                                            "{t('solve_finance_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition uppercase tracking-tighter text-xs text-slate-500 font-bold">
                                            <span>Core Principle 01</span>
                                            <span className="text-slate-900">{t('finance_science_principle_1_title')}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition uppercase tracking-tighter text-xs text-slate-500 font-bold">
                                            <span>Core Principle 02</span>
                                            <span className="text-slate-900">{t('finance_science_principle_2_title')}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition uppercase tracking-tighter text-xs text-slate-500 font-bold">
                                            <span>Core Principle 03</span>
                                            <span className="text-slate-900">{t('finance_science_principle_3_title')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative hidden lg:block">
                                    <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-3xl p-12 overflow-hidden border border-slate-200">
                                        {/* Isometric Pillars */}
                                        <div className="absolute bottom-0 left-12 w-16 h-[60%] bg-slate-900 transform -skew-x-12 opacity-90 transition-all duration-700 group-hover:h-[65%]"></div>
                                        <div className="absolute bottom-0 left-32 w-16 h-[40%] bg-indigo-600 transform -skew-x-12 opacity-90 transition-all duration-700 group-hover:h-[45%]"></div>
                                        <div className="absolute bottom-0 left-52 w-16 h-[80%] bg-slate-900 transform -skew-x-12 opacity-90 transition-all duration-700 group-hover:h-[85%]"></div>
                                        
                                        <div className="absolute top-12 right-12 text-6xl opacity-20 font-black select-none">📐</div>
                                        <div className="absolute bottom-12 right-12 text-right">
                                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{t('finance_science_viz_status_badge')}</p>
                                            <p className="text-2xl text-slate-900 font-bold">{t('finance_science_viz_status_title')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 8: FAQ */}
                <section className="py-32 bg-gray-50 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('solve_finance_faq_title')}</h2>
                        <div className="space-y-6">
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

                {/* SECTION 9: CTA */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden text-center">
                    <div className="max-w-4xl mx-auto relative z-10 px-6">
                        <div className="text-6xl mb-8 animate-bounce font-black select-none">📈</div>
                        <h2 className="text-6xl md:text-7xl text-gray-900 mb-8 tracking-tight font-black">{t('solve_finance_cta_title')}</h2>
                        <p className="text-gray-500 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                            {t('solve_finance_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-indigo-700 transition duration-300 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
                            {t('solve_finance_cta_btn')}
                        </Link>
                    </div>
                </section>

            </main>
        </GuestLayout>
    );
}
