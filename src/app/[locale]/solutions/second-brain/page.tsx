'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionSecondBrainPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('brain_faq_q1'),
            a: t('brain_faq_a1')
        },
        {
            q: t('brain_faq_q2'),
            a: t('brain_faq_a2')
        },
        {
            q: t('brain_faq_q3'),
            a: t('brain_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-second-brain" className="overflow-x-hidden text-left">
                
                {/* SECTION 1: HERO (CENTERED GLASSMORPHISM - PURE INDIGO VIBE) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white relative border-b border-slate-100">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] -z-10"></div>
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl opacity-60 animate-pulse -z-10"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000 -z-10"></div>
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-white/80 border border-indigo-100 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center text-4xl transform -rotate-3 hover:rotate-0 transition duration-300 font-black select-none">
                                🧠
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-widest border border-indigo-100 shadow-sm">
                            {t('brain_hero_badge')}
                        </div>
                        
                        <h1 className="text-6xl md:text-7xl mb-6 leading-tight text-slate-900 tracking-tight font-black">
                            {t('brain_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {t('brain_hero_title_2')}
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
                            {t('brain_hero_desc')}
                        </p>
                        
                        <div className="flex justify-center gap-4 mb-24">
                            <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-lg hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition transform hover:-translate-y-1 font-bold">
                                {t('brain_hero_cta')}
                            </Link>
                        </div>

                        {/* Visual Bawah (Glassmorphism Nodes Network) */}
                        <div className="relative w-full max-w-4xl mx-auto h-[400px] md:h-80 flex justify-center items-center rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl border border-slate-800 perspective-1000">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                            {/* Node 1: Capture */}
                            <div className="absolute left-4 md:left-12 top-8 md:top-16 bg-white/10 p-5 rounded-3xl border border-white/10 z-10 transform -rotate-6 animate-float shadow-2xl text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-sm select-none">📥</div>
                                    <span className="font-bold text-indigo-100 text-sm">{t('brain_mockup_1')}</span>
                                </div>
                                <div className="w-24 h-1.5 bg-white/20 rounded-full"></div>
                            </div>

                            {/* Node 2: Organize */}
                            <div className="absolute bg-indigo-600/20 p-8 rounded-[2.5rem] border border-indigo-400/30 shadow-[0_0_50px_rgba(79,70,229,0.3)] z-20 scale-110">
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl mb-3 drop-shadow-lg font-black select-none">🔮</span>
                                    <h4 className="font-black text-white tracking-widest uppercase text-sm">{t('brain_mockup_2')}</h4>
                                </div>
                            </div>

                            {/* Node 3: Execute */}
                            <div className="absolute right-4 md:right-12 bottom-8 md:bottom-16 bg-white/10 p-5 rounded-3xl border border-white/10 z-10 transform rotate-6 animate-float-reverse shadow-2xl text-left">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-sm select-none">📓</div>
                                    <span className="font-bold text-indigo-100 text-sm">{t('brain_mockup_3')}</span>
                                </div>
                                <p className="text-[10px] text-slate-300 font-serif italic max-w-[120px]">"{t('brain_mockup_3_quote')}"</p>
                            </div>
                            
                            <div className="absolute top-1/2 left-1/4 w-32 md:w-48 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-indigo-400 transform -rotate-12 -z-10 opacity-50"></div>
                            <div className="absolute top-1/2 right-1/4 w-32 md:w-48 h-0.5 bg-gradient-to-l from-transparent via-indigo-400 to-indigo-400 transform rotate-12 -z-10 opacity-50"></div>
                        </div>

                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-6xl mb-6 text-slate-900 leading-tight font-black">{t('brain_prob_title')}</h2>
                            <p className="text-xl text-slate-500 leading-relaxed mb-10 font-medium">{t('brain_prob_desc')}</p>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0 mt-1 select-none">🌪️</div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{t('brain_prob_1_title')}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{t('brain_prob_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0 mt-1 select-none">🧩</div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{t('brain_prob_2_title')}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{t('brain_prob_2_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg shrink-0 mt-1 select-none">🔋</div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{t('brain_prob_3_title')}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{t('brain_prob_3_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stacked Papers Visual Chaos */}
                        <div className="relative h-[500px] flex items-center justify-center perspective-1000">
                            <div className="absolute w-72 h-48 bg-white rounded-3xl shadow-xl border border-slate-200 transform -rotate-12 translate-x-10 translate-y-10 opacity-70 p-6 flex flex-col justify-between">
                                <div className="w-full h-3 bg-slate-100 rounded"></div>
                                <div className="w-3/4 h-3 bg-slate-100 rounded"></div>
                                <div className="w-1/2 h-3 bg-slate-100 rounded"></div>
                            </div>
                            <div className="absolute w-72 h-48 bg-slate-100 rounded-3xl shadow-xl border border-slate-200 transform rotate-12 -translate-x-10 -translate-y-10 opacity-80 p-6">
                                <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                                <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
                                <div className="w-full h-2 bg-slate-200 rounded"></div>
                            </div>
                            <div className="absolute w-80 h-56 bg-white rounded-3xl shadow-2xl border border-slate-100 transform z-10 p-8 flex flex-col justify-center items-center">
                                <div className="text-5xl mb-4 animate-bounce font-black select-none">🤯</div>
                                <div className="font-black text-rose-500 tracking-widest uppercase text-sm">{t('brain_prob_viz_badge')}</div>
                                <div className="text-xs text-slate-400 mt-2 font-bold">{t('brain_prob_viz_sub')}</div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 3: VERTICAL PROCESS (THE C.O.D.E FRAMEWORK) */}
                <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
                    
                    <div className="max-w-4xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl md:text-7xl mb-6 font-black">{t('brain_sol_title')}</h2>
                            <p className="text-indigo-300 text-xl font-medium">{t('brain_sol_desc')}</p>
                        </div>

                        {/* Vertical Process Pathway */}
                        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-12 md:before:ml-[50%] md:before:-translate-x-px md:before:w-0.5 before:bg-indigo-800 before:-z-10">
                            
                            {/* Step 1 */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-900 bg-indigo-600 text-3xl shadow-xl shrink-0 z-10 transform group-hover:scale-110 transition duration-300 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 font-black select-none">🎣</div>
                                <div className="w-[calc(100%-7rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl group-hover:border-indigo-500/50 transition duration-300">
                                    <h3 className="text-2xl font-bold text-indigo-400 mb-3">{t('brain_step_1_title')}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_step_1_desc')}</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex items-center justify-between md:justify-normal md:even:flex-row group">
                                <div className="flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-900 bg-blue-600 text-3xl shadow-xl shrink-0 z-10 transform group-hover:scale-110 transition duration-300 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 font-black select-none">🗄️</div>
                                <div className="w-[calc(100%-7rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl group-hover:border-blue-500/50 transition duration-300 md:ml-auto">
                                    <h3 className="text-2xl font-bold text-blue-400 mb-3">{t('brain_step_2_title')}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_step_2_desc')}</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-24 h-24 rounded-full border-8 border-slate-900 bg-emerald-500 text-3xl shadow-xl shrink-0 z-10 transform group-hover:scale-110 transition duration-300 md:order-1 md:absolute md:left-1/2 md:-translate-x-1/2 font-black select-none">✨</div>
                                <div className="w-[calc(100%-7rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl group-hover:border-emerald-500/50 transition duration-300">
                                    <h3 className="text-2xl font-bold text-emerald-400 mb-3">{t('brain_step_3_title')}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_step_3_desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bento Hub */}
                        <div className="relative w-full max-w-4xl mx-auto mt-32 rounded-[3rem] bg-slate-950 p-3 shadow-2xl border border-slate-800">
                            <div className="absolute inset-0 bg-indigo-500 rounded-[3rem] blur-3xl opacity-20 -z-10"></div>
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative text-left">
                                <div className="flex items-center gap-4 mb-10 relative z-10">
                                    <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl font-black select-none">🧠</div>
                                    <h3 className="text-3xl text-white font-black">{t('brain_hub_title')}</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-indigo-400/20 rounded-xl flex items-center justify-center text-2xl select-none">⚡</div>
                                            <h4 className="font-bold text-indigo-200 text-lg">{t('brain_hub_inbox_title')}</h4>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_hub_inbox_desc')}</p>
                                    </div>
                                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-lg">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center text-2xl select-none">🏡</div>
                                            <h4 className="font-bold text-blue-200 text-lg">{t('brain_hub_os_title')}</h4>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('brain_hub_os_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 4: ASYMMETRICAL GRID */}
                <section className="py-32 bg-white border-b border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <h2 className="text-5xl md:text-6xl mb-6 text-slate-900 font-black">{t('brain_feat_title')}</h2>
                            <p className="text-xl text-slate-500 font-medium">{t('brain_feat_sub')}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-12 gap-6">
                            <div className="md:col-span-8 flex flex-col justify-between p-10 md:p-12 rounded-[3rem] bg-indigo-50 border border-indigo-100 shadow-sm hover:shadow-lg transition">
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-8 font-black select-none">📥</div>
                                <div>
                                    <h4 className="text-2xl text-indigo-950 mb-3 font-bold">{t('brain_feat_1_title')}</h4>
                                    <p className="text-indigo-800/80 leading-relaxed text-lg max-w-xl font-medium">{t('brain_feat_1_desc')}</p>
                                </div>
                            </div>
                            
                            <div className="md:col-span-4 flex flex-col justify-between p-10 md:p-12 rounded-[3rem] bg-slate-900 text-white shadow-xl hover:shadow-2xl transition transform md:-translate-y-4">
                                <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-8 font-black select-none">📓</div>
                                <div>
                                    <h4 className="text-2xl mb-3 font-bold">{t('brain_feat_2_title')}</h4>
                                    <p className="text-slate-400 leading-relaxed font-medium">{t('brain_feat_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: INFO HIERARCHY */}
                <section className="py-32 bg-slate-50 relative overflow-hidden border-b border-slate-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-5xl md:text-6xl text-slate-900 mb-6 font-black">{t('brain_extra_1_title')}</h2>
                            <p className="text-xl text-slate-500 leading-relaxed mb-10 font-medium">
                                {t('brain_extra_1_desc')}
                            </p>
                            <div className="space-y-4 font-bold text-lg">
                                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <span className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold">1</span>
                                    <span className="text-slate-700 font-bold">{t('brain_extra_1_item_1')}</span>
                                </div>
                                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm ml-8">
                                    <span className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg font-bold">2</span>
                                    <span className="text-slate-700 font-bold">{t('brain_extra_1_item_2')}</span>
                                </div>
                                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm ml-16">
                                    <span className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">3</span>
                                    <span className="text-slate-700 font-bold">{t('brain_extra_1_item_3')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative order-1 md:order-2">
                            <div className="w-full aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] md:rounded-[4rem] p-12 flex items-center justify-center shadow-2xl">
                                <div className="text-center">
                                    <div className="text-8xl mb-6 animate-bounce font-black select-none">📁</div>
                                    <div className="text-white text-3xl font-black">{t('brain_extra_1_viz_title')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: CREATIVE OUTPUT */}
                <section className="py-32 bg-white">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50"></div>
                            <h2 className="text-5xl md:text-6xl mb-8 relative z-10 font-black">{t('brain_extra_2_title')}</h2>
                            <p className="text-xl text-indigo-100 leading-relaxed mb-12 max-w-3xl mx-auto relative z-10 font-medium">
                                {t('brain_extra_2_desc')}
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 relative z-10 font-bold">
                                <span className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">{t('brain_extra_2_item_1')}</span>
                                <span className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">{t('brain_extra_2_item_2')}</span>
                                <span className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-bold">{t('brain_extra_2_item_3')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SCIENTIFIC PILLAR */}
                <section className="py-40 bg-slate-900 relative overflow-hidden text-left border-y border-slate-950">
                    <div className="absolute inset-0 z-0">
                        <svg className="w-full h-full opacity-10" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                            </defs>
                            <circle cx="200" cy="200" r="150" fill="url(#nodeGradient)" className="animate-pulse" />
                            <circle cx="800" cy="300" r="100" fill="url(#nodeGradient)" className="animate-pulse delay-700" />
                            <circle cx="500" cy="800" r="120" fill="url(#nodeGradient)" className="animate-pulse delay-1000" />
                            <path d="M200 200 L800 300 M800 300 L500 800 M500 800 L200 200" stroke="#4f46e5" strokeWidth="1" strokeDasharray="10 10" />
                        </svg>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-[0.3em] mb-10 rounded-lg font-bold">
                                    🧬 {t('brain_science_badge')}
                                </div>

                                <h2 className="text-5xl md:text-7xl text-white mb-10 leading-[1.1] font-black">
                                    {t('brain_science_title')}
                                </h2>

                                <div className="relative py-12 px-10 bg-white/5 border border-white/10 rounded-[3rem] mb-12 shadow-2xl">
                                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">"</div>
                                    <p className="text-indigo-100 text-xl md:text-3xl font-serif italic leading-relaxed font-black">
                                        {t('brain_science_desc')}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-6">
                                    <div className="px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 transition cursor-help group font-bold">
                                        <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1 group-hover:text-white">Active_Link_01</p>
                                        <h4 className="font-bold text-slate-200">{t('brain_science_topic_1')}</h4>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-purple-500 transition cursor-help group font-bold">
                                        <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1 group-hover:text-white">Active_Link_02</p>
                                        <h4 className="font-bold text-slate-200">{t('brain_science_topic_2')}</h4>
                                    </div>
                                    <div className="px-6 py-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-emerald-500 transition cursor-help group font-bold">
                                        <p className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1 group-hover:text-white">Active_Link_03</p>
                                        <h4 className="font-bold text-slate-200">{t('brain_science_topic_3')}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="relative hidden lg:block">
                                <div className="w-full aspect-square bg-indigo-600 rounded-[4rem] p-1 flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-600 to-indigo-400 group-hover:scale-110 transition duration-1000"></div>
                                    <div className="relative z-10 text-center">
                                        <div className="text-[120px] mb-4 drop-shadow-2xl animate-pulse select-none">🧠</div>
                                        <div className="bg-black/20 px-6 py-2 rounded-full border border-white/10 inline-block text-xs uppercase tracking-widest font-bold">
                                            {t('brain_science_viz_badge')}
                                        </div>
                                    </div>
                                    <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                                    <div className="absolute inset-12 border border-white/5 rounded-full animate-spin-reverse-slow"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: FAQ */}
                <section className="py-32 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-slate-900 mb-16 font-black">{t('brain_faq_title')}</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.q}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 9: CTA */}
                <section className="py-32 bg-slate-50 relative overflow-hidden text-center border-t border-slate-100">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent -z-10"></div>
                    
                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <div className="bg-indigo-950 rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                            <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-30"></div>
                            
                            <div className="relative z-10">
                                <div className="text-6xl mb-8 font-black select-none">🕊️</div>
                                <h2 className="text-6xl md:text-7xl text-white mb-6 tracking-tight leading-tight font-black">
                                    {t('brain_cta_title')}
                                </h2>
                                <p className="text-lg md:text-xl text-indigo-200 mb-12 max-w-2xl mx-auto leading-relaxed">
                                    {t('brain_cta_desc')}
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-bold">
                                    <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-white text-indigo-950 px-12 py-5 rounded-full text-xl hover:bg-indigo-50 shadow-[0_10px_25px_rgba(255,255,255,0.2)] transition transform hover:-translate-y-1 w-full sm:w-auto">
                                        {t('brain_cta_btn')}
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 40s linear infinite;
                }
                .animate-spin-reverse-slow {
                    animation: spin 45s linear infinite reverse;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(-6deg); }
                    50% { transform: translateY(-10px) rotate(-6deg); }
                }
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0px) rotate(6deg); }
                    50% { transform: translateY(-10px) rotate(6deg); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-float-reverse {
                    animation: float-reverse 5s ease-in-out infinite;
                }
            `}</style>
        </GuestLayout>
    );
}
