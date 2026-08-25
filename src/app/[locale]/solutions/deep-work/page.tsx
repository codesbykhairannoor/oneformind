'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionDeepWorkPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('deepwork_faq_q1'),
            a: t('deepwork_faq_a1')
        },
        {
            q: t('deepwork_faq_q2'),
            a: t('deepwork_faq_a2')
        },
        {
            q: t('deepwork_faq_q3'),
            a: t('deepwork_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-deep-work" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LIGHT MODE - INDIGO VIBE) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white relative border-b border-gray-100">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {/* Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-white border border-indigo-100 rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center text-4xl transform -rotate-3 hover:rotate-0 transition duration-300 font-black select-none">
                                ⚡
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-widest border border-indigo-100 shadow-sm">
                            {t('deepwork_hero_badge')}
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-6xl md:text-7xl mb-6 leading-tight tracking-tight text-gray-900 font-black">
                            {t('deepwork_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {t('deepwork_hero_title_2')}
                            </span>
                        </h1>
                        
                        {/* Description */}
                        <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
                            {t('deepwork_hero_desc')}
                        </p>
                        
                        {/* CTA */}
                        <div className="flex justify-center gap-4 mb-24 font-bold">
                            <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-lg hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition transform hover:-translate-y-1">
                                {t('deepwork_hero_cta')}
                            </Link>
                        </div>

                        {/* Visual Bawah (Focus Dashboard) */}
                        <div className="relative w-full max-w-4xl mx-auto rounded-[2.5rem] bg-white p-3 shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-700">
                            <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] blur-2xl opacity-10 -z-10"></div>
                            
                            <div className="bg-slate-950 rounded-[2rem] p-8 md:p-12 border border-slate-800 overflow-hidden relative flex flex-col md:flex-row gap-10 items-center text-left">
                                
                                <div className="flex-1 w-full space-y-6 z-10">
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                                        <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t('deepwork_mockup_title')}</h4>
                                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 text-xs text-gray-400 font-mono">09:00</div>
                                            <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 opacity-60 flex items-center gap-3">
                                                <div className="w-4 h-4 rounded border-2 border-white/20"></div>
                                                <span className="text-gray-400 line-through text-sm">{t('deepwork_mockup_task_1')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 text-xs text-indigo-400 font-mono font-bold">10:00</div>
                                            <div className="flex-1 bg-indigo-950/80 rounded-xl p-4 border border-indigo-500/30 flex items-center justify-between shadow-sm transform scale-[1.02]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded bg-indigo-500 animate-pulse"></div>
                                                    <span className="text-indigo-200 font-bold text-sm">{t('deepwork_mockup_task_2')}</span>
                                                </div>
                                                <span className="font-mono text-indigo-400 text-sm font-bold">25:00</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 text-xs text-gray-400 font-mono">12:00</div>
                                            <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-3 border-dashed">
                                                <div className="w-4 h-4 rounded border-2 border-white/20 border-dashed"></div>
                                                <span className="text-gray-500 text-sm">{t('deepwork_mockup_task_3')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-8 md:pt-0 md:pl-8">
                                    <div className="text-6xl text-white tracking-tighter tabular-nums font-mono drop-shadow-sm font-black">
                                        24<span className="text-indigo-500 animate-pulse">:</span>59
                                    </div>
                                    <p className="text-gray-400 text-xs mt-3 font-bold uppercase tracking-widest">{t('deepwork_mockup_desc')}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-32 bg-white relative">
                    <div className="max-w-6xl mx-auto px-6 text-left">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('deepwork_prob_title')}</h2>
                            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium">{t('deepwork_prob_desc')}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl mb-6 font-black select-none">📱</div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{t('deepwork_prob_1_title')}</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">{t('deepwork_prob_1_desc')}</p>
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl mb-6 font-black select-none">🤹</div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{t('deepwork_prob_2_title')}</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">{t('deepwork_prob_2_desc')}</p>
                            </div>
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl mb-6 font-black select-none">🕰️</div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{t('deepwork_prob_3_title')}</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">{t('deepwork_prob_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SYSTEM (THE ARCHITECTURE OF FOCUS) */}
                <section className="py-32 bg-indigo-50/50 border-y border-indigo-100 text-left">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-2xl text-2xl mb-6 shadow-lg shadow-indigo-200 font-black select-none">🏛️</div>
                            <h2 className="text-5xl md:text-6xl mb-8 text-gray-900 leading-tight font-black">{t('deepwork_sol_title')}</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('deepwork_sol_1_title')}</h4>
                                        <p className="text-gray-600 leading-relaxed font-medium">{t('deepwork_sol_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('deepwork_sol_2_title')}</h4>
                                        <p className="text-gray-600 leading-relaxed font-medium">{t('deepwork_sol_2_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('deepwork_sol_3_title')}</h4>
                                        <p className="text-gray-600 leading-relaxed font-medium">{t('deepwork_sol_3_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Visual Concept (Dark contrast box inside light section) */}
                        <div className="order-1 md:order-2 bg-slate-900 p-12 rounded-[3rem] text-center border border-slate-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
                            
                            <div className="relative z-10">
                                <div className="text-9xl mb-8 transform group-hover:scale-110 transition duration-500 font-black select-none">🔒</div>
                                <h3 className="text-4xl text-white tracking-tight mb-2 font-black">{t('deepwork_science_viz_lock')}</h3>
                                <p className="text-indigo-300 text-lg font-medium">{t('deepwork_science_viz_sub')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: THE FOCUS ARSENAL */}
                <section className="py-32 bg-white text-left">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('deepwork_feat_title')}</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="flex gap-6 items-start p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100">
                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg font-black select-none">🍅</div>
                                <div>
                                    <h4 className="text-xl font-bold text-indigo-950 mb-2">{t('deepwork_feat_1_title')}</h4>
                                    <p className="text-indigo-800/70 font-medium">{t('deepwork_feat_1_desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start p-8 rounded-[2rem] bg-gray-50 border border-gray-200">
                                <div className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg font-black select-none">📥</div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{t('deepwork_feat_2_title')}</h4>
                                    <p className="text-gray-500 font-medium">{t('deepwork_feat_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: FLOW STATE METRICS */}
                <section className="py-32 bg-slate-50 relative overflow-hidden text-left border-y border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500">
                                <div className="flex items-end gap-2 mb-8 border-b border-indigo-500/30 pb-6">
                                    <div className="text-5xl text-white font-black">4.5</div>
                                    <div className="text-indigo-200 font-bold mb-1">{t('deepwork_extra_1_sub')}</div>
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: 28 }).map((_, idx) => (
                                        <div key={idx} className={`h-8 rounded-md ${(idx + 1) % 4 === 0 ? 'bg-indigo-400' : 'bg-indigo-300/30'}`}></div>
                                    ))}
                                </div>
                                <p className="mt-6 text-indigo-100 text-sm font-medium">{t('deepwork_extra_1_label')}</p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <h2 className="text-5xl md:text-6xl text-gray-900 font-black">{t('deepwork_extra_1_title')}</h2>
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                {t('deepwork_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: ENVIRONMENTAL DESIGN */}
                <section className="py-32 bg-white text-left">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 text-9xl select-none">🌿</div>
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-5xl md:text-6xl mb-6 font-black">{t('deepwork_extra_2_title')}</h2>
                                <p className="text-xl text-slate-400 leading-relaxed mb-8 font-medium">
                                    {t('deepwork_extra_2_desc')}
                                </p>
                                <ul className="space-y-4 text-indigo-300 font-bold">
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">✓</span>
                                        {t('deepwork_extra_2_item_1')}
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">✓</span>
                                        {t('deepwork_extra_2_item_2')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-16 items-center text-left">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-[0.2em] mb-8 rounded-full font-bold">
                                    🧬 {t('deepwork_science_badge')}
                                </div>
                                
                                <h2 className="text-5xl md:text-7xl text-gray-900 mb-8 leading-tight font-black">
                                    {t('deepwork_science_title')}
                                </h2>
                                
                                <div className="relative py-10 px-10 bg-indigo-50/80 border-l-8 border-indigo-600 rounded-r-[2rem] mb-12 shadow-sm">
                                    <p className="text-gray-900 text-xl md:text-2xl font-semibold leading-relaxed italic">
                                        "{t('deepwork_science_desc')}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="group px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition">
                                        <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1 font-bold">{t('deepwork_science_concept_1')}</span>
                                        <span className="font-bold text-gray-700">{t('deepwork_science_topic_1')}</span>
                                    </div>
                                    <div className="group px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition">
                                        <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-1 font-bold">{t('deepwork_science_concept_2')}</span>
                                        <span className="font-bold text-gray-700">{t('deepwork_science_topic_2')}</span>
                                    </div>
                                    <div className="group px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition">
                                        <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1 font-bold">{t('deepwork_science_concept_3')}</span>
                                        <span className="font-bold text-gray-700">{t('deepwork_science_topic_3')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 relative hidden lg:block">
                                <div className="w-80 h-80 bg-indigo-600 rounded-full flex items-center justify-center p-1 shadow-2xl shadow-indigo-200 relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-indigo-500 rounded-full group-hover:scale-110 transition duration-1000"></div>
                                    <div className="relative z-10 text-8xl transform group-hover:scale-125 transition duration-700 font-black select-none">🧘</div>
                                    <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-spin-slow"></div>
                                    <div className="absolute inset-4 border border-white/10 rounded-full animate-spin-reverse-slow"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: FAQ ACCORDION */}
                <section className="py-32 bg-slate-50 border-y border-slate-100 text-left">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('deepwork_faq_title')}</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.q}</h3>
                                    <p className="text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 9: CTA */}
                <section className="pt-24 pb-40 bg-slate-50 text-center px-6 relative overflow-hidden border-t border-gray-200">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-indigo-100/50 to-transparent rounded-t-full -z-10"></div>
                    
                    <div className="max-w-3xl mx-auto mt-16 space-y-8">
                        <h2 className="text-6xl md:text-7xl text-gray-900 tracking-tight leading-tight font-black">{t('deepwork_cta_title')}</h2>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">{t('deepwork_cta_desc')}</p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl text-xl hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition transform hover:-translate-y-1 w-full sm:w-auto font-bold">
                                {t('deepwork_cta_btn')}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 30s linear infinite;
                }
                .animate-spin-reverse-slow {
                    animation: spin 35s linear infinite reverse;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </GuestLayout>
    );
}
