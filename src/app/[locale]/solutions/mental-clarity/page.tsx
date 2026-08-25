'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionMentalClarityPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('solve_mental_faq_q1'),
            a: t('solve_mental_faq_a1')
        },
        {
            q: t('solve_mental_faq_q2'),
            a: t('solve_mental_faq_a2')
        },
        {
            q: t('solve_mental_faq_q3'),
            a: t('solve_mental_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-mental-clarity" className="overflow-x-hidden text-left">
                
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative border-b border-gray-100">
                    <div className="mt-20 absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-700 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                                🧘 {t('solve_mental_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl mb-6 leading-[1.05] text-gray-900 tracking-tight font-black">
                                {t('solve_mental_hero_title_1')}
                                <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('solve_mental_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl">
                                {t('solve_mental_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-1 text-center">
                                    {t('solve_mental_hero_cta')}
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative z-10 w-full animate-in fade-in slide-in-from-right-12 duration-1000">
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-400 to-rose-400 rounded-[2.5rem] blur opacity-20 "></div>
                            <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white flex flex-col h-[500px] overflow-hidden transform transition hover:scale-[1.01] duration-500 p-8">
                                <div className="flex-grow flex flex-col justify-center">
                                    <div className="text-center mb-8">
                                        <h4 className="font-serif italic text-2xl text-gray-800 mb-2">"{t('mental_mockup_quote')}"</h4>
                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t('mental_mockup_source')}</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-black select-none">🧘</div>
                                            <div>
                                                <p className="text-xs font-bold text-indigo-950">{t('mental_mockup_task_1_title')}</p>
                                                <p className="text-[10px] text-indigo-600 font-bold">{t('mental_mockup_task_1_sub')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl font-black select-none">📔</div>
                                            <div>
                                                <p className="text-xs font-bold text-purple-950">{t('mental_mockup_task_2_title')}</p>
                                                <p className="text-[10px] text-purple-600 font-bold">{t('mental_mockup_task_2_sub')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xl font-black select-none">✨</div>
                                            <div>
                                                <p className="text-xs font-bold text-emerald-950">{t('mental_mockup_task_3_title')}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold">{t('mental_mockup_task_3_sub')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('solve_mental_prob_title')}</h2>
                        <p className="text-xl text-gray-500 mb-16 leading-relaxed font-medium">
                            {t('solve_mental_prob_desc')}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="text-3xl mb-4 font-black select-none">🌪️</div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900">{t('solve_mental_prob_1_title')}</h3>
                                <p className="text-gray-500 text-sm font-medium">{t('solve_mental_prob_1_desc')}</p>
                            </div>
                            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="text-3xl mb-4 font-black select-none">📱</div>
                                <h3 className="text-lg font-bold mb-2 text-gray-900">{t('solve_mental_prob_2_title')}</h3>
                                <p className="text-gray-500 text-sm font-medium">{t('solve_mental_prob_2_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-16 md:py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                            
                            {/* Left Text */}
                            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                                <h2 className="text-5xl md:text-6xl mb-6 leading-tight font-black">
                                    {t('solve_mental_sol_title')}
                                </h2>
                                <p className="text-indigo-200 text-base md:text-lg leading-relaxed mb-8">
                                    {t('solve_mental_sol_desc')}
                                </p>
                                
                                <ul className="space-y-4 md:space-y-6">
                                    <li className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20 text-sm font-bold mt-1">1</span>
                                        <div>
                                            <h4 className="font-bold text-white text-base">{t('solve_mental_sol_step_1_title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-400 mt-1">{t('solve_mental_sol_step_1_desc')}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20 text-sm font-bold mt-1">2</span>
                                        <div>
                                            <h4 className="font-bold text-white text-base">{t('solve_mental_sol_step_2_title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-400 mt-1">{t('solve_mental_sol_step_2_desc')}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 text-sm font-bold mt-1">3</span>
                                        <div>
                                            <h4 className="font-bold text-white text-base">{t('solve_mental_sol_step_3_title')}</h4>
                                            <p className="text-xs md:text-sm text-slate-400 mt-1">{t('solve_mental_sol_step_3_desc')}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Right Visual Glassmorphism Cards */}
                            <div className="lg:col-span-7 relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center order-1 lg:order-2 scale-90 md:scale-100">
                                <div className="absolute w-64 h-80 md:w-80 md:h-96 bg-white/5 rounded-[2.5rem] md:rounded-[3rem] border border-white/10 transform -rotate-6 translate-x-8 md:translate-x-12 translate-y-6 p-8 flex flex-col justify-end">
                                    <div className="w-full h-2 bg-white/10 rounded-full mb-3"></div>
                                    <div className="w-2/3 h-2 bg-white/10 rounded-full"></div>
                                </div>
                                
                                <div className="absolute w-72 md:w-96 h-auto bg-white/10 rounded-[2.5rem] md:rounded-[3rem] border border-white/20 shadow-2xl p-6 md:p-8 transform rotate-3 hover:rotate-0 transition duration-500 z-10">
                                    <div className="flex justify-between items-start mb-6 md:mb-8">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl select-none">🖋️</div>
                                        <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-white/10">{t('mental_mockup_journal_badge')}</span>
                                    </div>
                                    <p className="font-serif text-lg md:text-xl italic text-white/90 leading-relaxed mb-6">
                                        "{t('mental_mockup_journal_text')}"
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] md:text-xs font-bold">{t('mental_mockup_journal_status')}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 4: THE TOOLKIT */}
                <section className="py-32 bg-indigo-50/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('solve_mental_feat_title')}</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-12 bg-white rounded-[3rem] border border-indigo-100 shadow-sm group hover:-translate-y-2 transition duration-300">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 font-black select-none">📝</div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('solve_mental_feat_1_title')}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg font-medium">{t('solve_mental_feat_1_desc')}</p>
                            </div>
                            <div className="p-12 bg-indigo-950 rounded-[3rem] text-white shadow-xl group hover:-translate-y-2 transition duration-300">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 font-black select-none">📉</div>
                                <h3 className="text-2xl font-bold mb-4 text-indigo-300">{t('solve_mental_feat_2_title')}</h3>
                                <p className="text-indigo-100/70 leading-relaxed text-lg font-medium">{t('solve_mental_feat_2_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: COGNITIVE LOAD */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="bg-indigo-50 rounded-[3rem] p-10 border border-indigo-100 shadow-xl overflow-hidden relative">
                                <div className="flex justify-between items-end h-32 gap-4">
                                    <div className="flex-1 bg-indigo-200 rounded-t-xl h-24"></div>
                                    <div className="flex-1 bg-indigo-400 rounded-t-xl h-32"></div>
                                    <div className="flex-1 bg-indigo-600 rounded-t-xl h-16 relative">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl select-none">⚡</div>
                                    </div>
                                    <div className="flex-1 bg-indigo-300 rounded-t-xl h-28"></div>
                                </div>
                                <div className="mt-6 text-center text-[10px] text-indigo-400 uppercase tracking-widest font-bold">{t('mental_extra_1_label')}</div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-6 font-black">{t('solve_mental_extra_1_title')}</h2>
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                {t('solve_mental_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: JOURNALING LOOPS */}
                <section className="py-32 bg-slate-900 text-white relative text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl mb-8 font-black">{t('solve_mental_extra_2_title')}</h2>
                        <p className="text-xl text-indigo-200 leading-relaxed mb-12 italic">
                            {t('solve_mental_extra_2_desc')}
                        </p>
                        <div className="flex justify-center flex-wrap gap-4 font-bold">
                            <div className="px-6 py-3 bg-white/10 rounded-full border border-white/20">{t('mental_extra_2_item_1')}</div>
                            <div className="px-6 py-3 bg-white/10 rounded-full border border-white/20">{t('mental_extra_2_item_2')}</div>
                            <div className="px-6 py-3 bg-indigo-600 rounded-full border border-indigo-500 font-bold shadow-xl shadow-indigo-500/20">{t('mental_extra_2_item_3')}</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-b border-gray-100">
                    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M400 400C450 300 550 250 650 300" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                            <path d="M400 400C350 300 250 250 150 300" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                            <path d="M400 400C450 500 550 550 650 500" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                            <path d="M400 400C350 500 250 550 150 500" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-widest mb-6 rounded-full font-bold">
                                🧬 {t('solve_mental_science_badge')}
                            </div>
                            <h2 className="text-5xl md:text-7xl text-gray-900 mb-8 max-w-4xl mx-auto leading-tight font-black">
                                {t('solve_mental_science_title')}
                            </h2>
                            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12 items-center">
                            
                            {/* Left Nodes */}
                            <div className="space-y-8">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-right transform hover:-translate-x-2 transition">
                                    <span className="block text-[10px] text-indigo-400 uppercase tracking-widest mb-1 font-bold">Process_01</span>
                                    <h4 className="font-bold text-gray-900">{t('mental_science_process_1_title')}</h4>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-right transform hover:-translate-x-2 transition">
                                    <span className="block text-[10px] text-purple-400 uppercase tracking-widest mb-1 font-bold">Process_02</span>
                                    <h4 className="font-bold text-gray-900">{t('mental_science_process_2_title')}</h4>
                                </div>
                            </div>

                            {/* Center Thought Core */}
                            <div className="relative py-16 px-12 bg-indigo-600 rounded-[4rem] text-white shadow-[0_40px_80px_rgba(79,70,229,0.2)] text-center scale-110 z-20 overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-indigo-500 opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                <p className="relative z-10 text-2xl font-serif italic leading-relaxed">
                                    "{t('solve_mental_science_desc')}"
                                </p>
                                <div className="absolute -inset-2 bg-white/10 rounded-[4.5rem] animate-pulse"></div>
                            </div>

                            {/* Right Nodes */}
                            <div className="space-y-8">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transform hover:translate-x-2 transition">
                                    <span className="block text-[10px] text-emerald-400 uppercase tracking-widest mb-1 font-bold">Process_03</span>
                                    <h4 className="font-bold text-gray-900">{t('mental_science_process_3_title')}</h4>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transform hover:translate-x-2 transition">
                                    <span className="block text-[10px] text-amber-400 uppercase tracking-widest mb-1 font-bold">Process_04</span>
                                    <h4 className="font-bold text-gray-900">{t('mental_science_process_4_title')}</h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 8: FAQ */}
                <section className="py-32 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('solve_mental_faq_title')}</h2>
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
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-purple-100 to-transparent rounded-full blur-3xl opacity-50 -z-10"></div>
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                        <div className="text-6xl mb-8 animate-pulse duration-3000 font-black select-none">🕊️</div>
                        <h2 className="text-6xl md:text-7xl mb-8 text-gray-900 tracking-tight font-black">{t('solve_mental_cta_title')}</h2>
                        <p className="text-gray-500 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                            {t('solve_mental_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-950 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-indigo-800 transition-colors duration-300 shadow-2xl">
                            {t('solve_mental_cta_btn')}
                        </Link>
                    </div>
                </section>

            </main>
        </GuestLayout>
    );
}
