'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionCareerAcceleratorPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('solve_career_faq_q1'),
            a: t('solve_career_faq_a1')
        },
        {
            q: t('solve_career_faq_q2'),
            a: t('solve_career_faq_a2')
        },
        {
            q: t('solve_career_faq_q3'),
            a: t('solve_career_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-career-accelerator" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative border-b border-slate-100">
                    <div className="mt-20 absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-700 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                                💼 {t('solve_career_hero_badge')}
                            </div>
                            
                            <h1 className="text-[36px] leading-[1.1] md:text-6xl xl:text-7xl mb-6 text-slate-900 tracking-tight font-black">
                                {t('solve_career_hero_title_1')}
                                <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('solve_career_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-2xl">
                                {t('solve_career_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-1 text-center">
                                    {t('solve_career_hero_cta')}
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative z-10 w-full animate-in fade-in slide-in-from-right-12 duration-1000">
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-400 to-rose-400 rounded-[2.5rem] blur opacity-20 "></div>
                            <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-white flex flex-col h-[500px] overflow-hidden transform transition hover:scale-[1.01] duration-500 p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-black text-slate-900 text-sm">{t('solve_career_mockup_header')}</h4>
                                        <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full">{t('career_mockup_live')}</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-660 rounded-r-2xl">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-indigo-950 text-xs">Google - Senior UX</p>
                                                <span className="text-[10px] font-bold text-indigo-600">{t('career_status_interviewing')}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-emerald-950 text-xs">Stripe - Product Lead</p>
                                                <span className="text-[10px] font-bold text-emerald-600">{t('career_status_offer')}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-2xl">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-slate-900 text-xs">Airbnb - Designer</p>
                                                <span className="text-[10px] font-bold text-slate-400">{t('career_status_applied')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-5 bg-slate-900 rounded-3xl text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl select-none">🎯</div>
                                            <div>
                                                <p className="text-[10px] font-bold text-indigo-300 uppercase">{t('career_mockup_plan_badge')}</p>
                                                <p className="text-xs font-bold">{t('career_mockup_plan_title')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-24">
                            <h2 className="text-4xl md:text-5xl mb-6 leading-tight font-black">{t('solve_career_prob_title')}</h2>
                            <p className="text-xl text-slate-400 font-medium">{t('solve_career_prob_desc')}</p>
                        </div>

                        <div className="space-y-12 md:space-y-0 text-left">
                            
                            {/* Card 1 */}
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                <div className="w-full md:w-1/2 bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl hover:bg-white/10 transition duration-300">
                                    <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-3xl mb-8 font-black select-none">🕳️</div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{t('solve_career_prob_1_title')}</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">{t('solve_career_prob_1_desc')}</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 md:-mt-16 relative z-10">
                                <div className="w-full md:w-1/2 bg-indigo-600/20 p-10 rounded-[3rem] border border-indigo-500/30 shadow-2xl hover:bg-indigo-600/30 transition duration-300">
                                    <div className="w-16 h-16 bg-indigo-500/30 text-indigo-300 rounded-2xl flex items-center justify-center text-3xl mb-8 font-black select-none">📊</div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{t('solve_career_prob_2_title')}</h3>
                                    <p className="text-indigo-200 text-lg leading-relaxed">{t('solve_career_prob_2_desc')}</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 md:-mt-16 relative z-20">
                                <div className="w-full md:w-1/2 bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-2xl hover:bg-white/10 transition duration-300">
                                    <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-3xl mb-8 font-black select-none">👻</div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{t('solve_career_prob_3_title')}</h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">{t('solve_career_prob_3_desc')}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION (HORIZONTAL TIMELINE TRACKER) */}
                <section className="py-32 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-24 max-w-3xl mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl text-3xl mb-8 shadow-sm border border-indigo-100 font-black select-none">⚙️</div>
                            <h2 className="text-4xl md:text-5xl mb-6 text-slate-900 leading-tight font-black">
                                {t('solve_career_sol_title')}
                            </h2>
                            <p className="text-slate-500 text-xl leading-relaxed font-medium">
                                {t('solve_career_sol_desc')}
                            </p>
                        </div>

                        {/* Horizontal Tracker */}
                        <div className="relative max-w-5xl mx-auto">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-2 bg-slate-100 rounded-full transform -translate-y-1/2 -z-10"></div>
                            <div className="hidden md:block absolute top-1/2 left-0 w-2/3 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform -translate-y-1/2 -z-10"></div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Step 1 */}
                                <div className="bg-white border-2 border-indigo-500 rounded-[2.5rem] p-8 text-center shadow-xl transform md:-translate-y-4 hover:-translate-y-6 transition duration-300 relative">
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center border-4 border-white font-bold">1</div>
                                    <h4 className="text-xl text-slate-900 mb-3 mt-4 font-black">{t('solve_career_sol_step_1_title')}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{t('solve_career_sol_step_1_desc')}</p>
                                </div>
                                
                                {/* Step 2 */}
                                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem] p-8 text-center shadow-md transform hover:-translate-y-2 transition duration-300 relative">
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-indigo-400 text-white rounded-full flex items-center justify-center border-4 border-white font-bold">2</div>
                                    <h4 className="text-xl text-slate-900 mb-3 mt-4 font-black">{t('solve_career_sol_step_2_title')}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">{t('solve_career_sol_step_2_desc')}</p>
                                </div>

                                {/* Step 3 */}
                                <div className="bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-center shadow-sm transform hover:-translate-y-2 transition duration-300 relative">
                                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-slate-300 text-slate-700 rounded-full flex items-center justify-center border-4 border-white font-bold">3</div>
                                    <h4 className="text-xl text-slate-900 mb-3 mt-4 font-black">{t('solve_career_sol_step_3_title')}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{t('solve_career_sol_step_3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: INTERVIEW PREP */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="bg-indigo-950 rounded-[3rem] p-8 md:p-12 shadow-2xl relative order-2 md:order-1 text-left">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50"></div>
                            <div className="space-y-4 relative z-10">
                                {[t('career_extra_1_item_1'), t('career_extra_1_item_2'), t('career_extra_1_item_3')].map((item, idx) => (
                                    <div key={idx} className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center gap-3">
                                        <span className="text-indigo-400">⚡</span>
                                        <span className="text-white font-bold">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 md:order-2 text-left">
                            <h2 className="text-4xl text-slate-900 mb-6 font-black">{t('solve_career_extra_1_title')}</h2>
                            <p className="text-xl text-slate-500 leading-relaxed font-medium">
                                {t('solve_career_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: MARKET VALUE */}
                <section className="py-32 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl text-slate-900 mb-8 font-black">{t('solve_career_extra_2_title')}</h2>
                        <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium">
                            {t('solve_career_extra_2_desc')}
                        </p>
                        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm inline-block">
                            <div className="flex items-center gap-8 justify-center">
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{t('career_negotiation_initial')}</p>
                                    <p className="text-2xl text-slate-900 font-black">$85k</p>
                                </div>
                                <div className="text-2xl text-slate-300 font-bold">→</div>
                                <div className="text-left">
                                    <p className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold">{t('career_negotiation_final')}</p>
                                    <p className="text-2xl text-indigo-600 font-black">$105k</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                    
                    <div className="max-w-6xl mx-auto px-6 relative z-10 text-left">
                        <div className="bg-indigo-950/50 border border-indigo-500/20 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden group">
                            
                            {/* Glowing stream */}
                            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>

                            <div className="flex flex-col lg:flex-row gap-16 items-center">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] uppercase tracking-[0.3em] mb-10 border border-indigo-500/30 rounded-lg font-bold">
                                        🧬 {t('solve_career_science_badge')}
                                    </div>

                                    <h2 className="text-4xl md:text-5xl text-white mb-10 leading-tight font-black">
                                        {t('solve_career_science_title')}
                                    </h2>

                                    <div className="relative py-8 px-10 bg-black/40 border-l-4 border-indigo-500 rounded-r-2xl mb-12">
                                        <p className="text-indigo-100/80 text-xl md:text-2xl font-medium leading-relaxed italic">
                                            "{t('solve_career_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                                            <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1 font-bold">{t('career_science_module_1')}</span>
                                            <span className="font-bold text-white text-sm">{t('career_science_topic_1')}</span>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                                            <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-1 font-bold">{t('career_science_module_2')}</span>
                                            <span className="font-bold text-white text-sm">{t('career_science_topic_2')}</span>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                                            <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1 font-bold">{t('career_science_module_3')}</span>
                                            <span className="font-bold text-white text-sm">{t('career_science_topic_3')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 w-64 h-64 relative hidden lg:block">
                                    <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping opacity-20"></div>
                                    <div className="relative w-full h-full bg-indigo-600/20 border-2 border-indigo-500/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] transform group-hover:rotate-12 transition duration-700">
                                        <div className="absolute inset-4 border border-indigo-400/30 rounded-full animate-spin-slow"></div>
                                        <div className="text-5xl font-black select-none">📈</div>
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-xl shadow-xl flex items-center justify-center text-indigo-600 text-xs border border-indigo-100 animate-bounce cursor-pointer font-bold">{t('career_science_viz_roi')}</div>
                                        <div className="absolute bottom-0 -left-6 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter shadow-lg font-bold">{t('career_science_viz_status')}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 7: FAQ */}
                <section className="py-32 bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-4xl text-center text-slate-900 mb-16 font-black">{t('solve_career_faq_title')}</h2>
                        <div className="space-y-6 text-left">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.q}</h3>
                                    <p className="text-slate-500 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 8: DRAMATIC DARK CTA */}
                <section className="py-32 bg-indigo-950 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/40 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:64px_64px] opacity-10"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10 px-6 space-y-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full text-5xl border border-white/20 shadow-[0_0_50px_rgba(79,70,229,0.5)] font-black select-none">🚀</div>
                        <h2 className="text-[42px] leading-[1.1] md:text-7xl text-white tracking-tight font-black">
                            {t('solve_career_cta_title')}
                        </h2>
                        <p className="text-indigo-200 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                            {t('solve_career_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-white text-indigo-950 px-14 py-5 rounded-full text-xl hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_rgba(255,255,255,0.2)] font-bold">
                            {t('solve_career_cta_btn')}
                        </Link>
                    </div>
                </section>

            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 30s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </GuestLayout>
    );
}
