'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureGoalPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('goal_faq_q1'),
            a: t('goal_faq_a1')
        },
        {
            q: t('goal_faq_q2'),
            a: t('goal_faq_a2')
        },
        {
            q: t('goal_faq_q3'),
            a: t('goal_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="feature-goal" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT + FLOATING GOAL MOCKUP) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                                <span className="text-lg">🎯</span> {t('goal_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                                {t('goal_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('goal_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('goal_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                                    {t('goal_hero_cta_1')}
                                </Link>
                                <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                                    {t('goal_hero_cta_2')}
                                </a>
                            </div>
                        </div>

                        {/* Floating Mockup Centered */}
                        <div className="max-w-4xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                            
                            <div className="bg-white/80 rounded-t-[3rem] border-x border-t border-gray-200 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-8 overflow-hidden h-auto min-h-[400px]">
                                <div className="w-full text-left">
                                    
                                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                        <div className="text-left">
                                            <h3 className="font-black text-gray-900 text-2xl mb-1">{t('goal_mockup_title')} 🏆</h3>
                                        </div>
                                        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl border border-indigo-100 flex items-center gap-3">
                                            <span className="text-2xl">⚡</span>
                                            <div className="text-left">
                                                <span className="text-[10px] font-bold uppercase block leading-none opacity-70 mb-0.5">{t('goal_mockup_momentum_label')}</span>
                                                <span className="font-black text-lg leading-tight">{t('goal_mockup_streak')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {/* Task 1 (Done) */}
                                        <div className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition border border-gray-100 hover:border-indigo-100 cursor-pointer bg-gray-50/50">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">✓</div>
                                            <div className="flex-1 text-left opacity-60 line-through">
                                                <p className="font-bold text-gray-900">{t('goal_mockup_task_1')}</p>
                                                <p className="text-sm text-gray-500">{t('goal_mockup_time_1')}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Task 2 (Done) */}
                                        <div className="flex items-center gap-4 p-4 hover:bg-indigo-50 rounded-2xl transition border border-gray-100 hover:border-indigo-100 cursor-pointer bg-gray-50/50">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">✓</div>
                                            <div className="flex-1 text-left opacity-60 line-through">
                                                <p className="font-bold text-gray-900">{t('goal_mockup_task_2')}</p>
                                                <p className="text-sm text-gray-500">{t('goal_mockup_time_1')}</p>
                                            </div>
                                        </div>

                                        {/* Task 3 (Active/Pending) */}
                                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition border-2 border-indigo-200 hover:border-indigo-400 cursor-pointer shadow-sm transform scale-[1.02]">
                                            <div className="w-8 h-8 rounded-full border-2 border-indigo-300 flex items-center justify-center"></div>
                                            <div className="flex-1 text-left">
                                                <p className="font-bold text-indigo-900">{t('goal_mockup_task_3')}</p>
                                                <p className="text-sm text-indigo-600">{t('goal_mockup_milestone_label')}</p>
                                            </div>
                                            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element (Level Up Badge) */}
                            <div className="absolute -right-8 -bottom-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-bounce [animation-duration:3000ms] text-left">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-black">🎉</div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('goal_mockup_alert_1')}</p>
                                        <p className="font-black text-indigo-900 text-sm">{t('goal_mockup_alert_2')}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                {/* SECTION 2: VERTICAL ASCENT (STRATEGY HIERARCHY) */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            
                            {/* Vertical Path Visual */}
                            <div className="flex-1 w-full animate-in fade-in slide-in-from-left-8 duration-700 text-left">
                                <div className="relative pt-12">
                                    <div className="relative py-20 pl-24">
                                        {/* The Line */}
                                        <div className="absolute left-16 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-500 via-indigo-500 to-indigo-100 rounded-full"></div>
                                        
                                        {/* Moonshot (Top) */}
                                        <div className="relative mb-24 animate-in fade-in slide-in-from-top-8 duration-700">
                                            <div className="absolute -left-16 top-0 w-12 h-12 bg-white rounded-full border-4 border-amber-500 shadow-xl z-10 flex items-center justify-center text-lg">🔥</div>
                                            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative group hover:scale-105 transition duration-500">
                                                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-transparent rounded-[3rem] -z-10 opacity-20 blur-xl group-hover:opacity-40"></div>
                                                <h4 className="text-amber-500 uppercase tracking-widest text-xs mb-4">{t('goal_level_moonshot')}</h4>
                                                <p className="text-2xl italic tracking-tight">{t('goal_moonshot_example')}</p>
                                            </div>
                                        </div>

                                        {/* Milestone (Middle) */}
                                        <div className="relative mb-24 ml-12 animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
                                            <div className="absolute -left-28 top-4 w-16 h-[2px] bg-indigo-500"></div>
                                            <div className="absolute -left-32 top-2 w-8 h-8 bg-white rounded-full border-4 border-indigo-500 shadow-lg z-10 flex items-center justify-center text-xs">⭐</div>
                                            <div className="bg-white border-2 border-indigo-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition duration-500">
                                                <h4 className="text-indigo-600 uppercase tracking-widest text-xs mb-4">{t('goal_milestone_number')}</h4>
                                                <p className="text-xl text-gray-900 tracking-tight">{t('goal_milestone_example')}</p>
                                                <div className="mt-6 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Task (Bottom) */}
                                        <div className="relative ml-24 animate-in fade-in slide-in-from-left-8 duration-700 delay-300">
                                            <div className="absolute -left-40 top-4 w-32 h-[2px] bg-indigo-200"></div>
                                            <div className="absolute -left-44 top-2 w-8 h-8 bg-white rounded-full border-4 border-indigo-200 shadow-lg z-10 flex items-center justify-center text-xs">📝</div>
                                            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl opacity-60">
                                                <p className="font-bold text-gray-600">{t('goal_task_example')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs uppercase tracking-[0.2em] mb-8 shadow-sm border border-amber-100">
                                    {t('goal_ascent_badge')}
                                </div>
                                <h2 className="text-6xl leading-[1.1] md:text-7xl text-gray-900 mb-10 tracking-tight font-black">
                                    {t('goal_ascent_title')}
                                </h2>
                                <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">
                                    {t('goal_ascent_desc')}
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group">
                                        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-[1.25rem] flex items-center justify-center text-2xl group-hover:rotate-12 transition font-black">🏔️</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-tighter">{t('goal_moonshot_label')}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">{t('goal_moonshot_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group">
                                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-[1.25rem] flex items-center justify-center text-2xl group-hover:-rotate-12 transition font-black">🎯</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-tighter">{t('goal_milestones_label')}</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">{t('goal_milestones_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3: MOMENTUM ORBIT (CIRCULAR PROGRESSION) */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-3xl -mr-96 -mt-96"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-24 items-center">
                            
                            <div className="flex-1 order-2 lg:order-1 relative">
                                <div className="w-full aspect-square max-w-lg mx-auto relative group flex items-center justify-center">
                                    {/* Outer Ring */}
                                    <div className="absolute inset-0 border-[16px] border-indigo-100 rounded-full"></div>
                                    
                                    {/* Progress Ring */}
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray="600 200" className="text-indigo-600 transition-all duration-1000"></circle>
                                    </svg>
                                    
                                    {/* Inner Ring */}
                                    <div className="absolute inset-16 border border-indigo-50/50 rounded-full"></div>
                                    
                                    {/* Center Display */}
                                    <div className="relative z-10 text-center bg-white w-2/3 aspect-square rounded-full shadow-[0_40px_80px_rgba(79,70,229,0.15)] flex flex-col items-center justify-center border border-indigo-50 transform group-hover:scale-105 transition duration-700">
                                        <span className="text-sm text-indigo-600 uppercase tracking-[0.3em] mb-4">{t('goal_momentum_velocity')}</span>
                                        <span className="text-7xl md:text-8xl text-gray-900 leading-none font-black">84<span className="text-3xl text-indigo-300 font-black">%</span></span>
                                        <div className="mt-6 flex items-center gap-3 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs uppercase tracking-widest">
                                            <span className="animate-ping w-2 h-2 bg-emerald-500 rounded-full"></span> {t('goal_momentum_peak')}
                                        </div>
                                    </div>

                                    {/* Orbiting Planet */}
                                    <div className="absolute w-12 h-12 bg-amber-500 rounded-2xl shadow-2xl shadow-amber-400 border-4 border-white transform rotate-45 -translate-y-[48%] animate-spin-slow origin-[0_500%]" style={{ transformOrigin: '0 500%' }}></div>
                                </div>
                            </div>

                            <div className="flex-1 order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900 text-white text-xs uppercase tracking-[0.2em] mb-8 shadow-2xl">
                                    {t('goal_performance_badge')}
                                </div>
                                <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight tracking-tight font-black">
                                    {t('goal_momentum_title')}
                                </h2>
                                <p className="text-gray-600 text-xl mb-12 leading-relaxed">
                                    {t('goal_momentum_desc')}
                                </p>
                                <div className="grid gap-8">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 flex gap-8 items-start group">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl shrink-0 flex items-center justify-center text-3xl group-hover:scale-110 transition font-black">⚡</div>
                                        <div className="text-left">
                                            <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('goal_impl_speed_title')}</h4>
                                            <p className="text-gray-500 font-medium leading-relaxed">{t('goal_impl_speed_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 flex gap-8 items-start group">
                                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl shrink-0 flex items-center justify-center text-3xl group-hover:rotate-12 transition font-black">🔥</div>
                                        <div className="text-left">
                                            <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('goal_streak_title')}</h4>
                                            <p className="text-gray-500 font-medium leading-relaxed">{t('goal_streak_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3.5: MILESTONE DECOMPOSITION (ZIG-ZAG PATH) */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                            <path d="M0,100 L1000,300 L0,500 L1000,700 L0,900" fill="none" stroke="currentColor" strokeWidth="40" />
                        </svg>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-blue-200">
                                {t('goal_steps_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                {t('goal_steps_title')}
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed font-medium">
                                {t('goal_steps_desc')}
                            </p>
                        </div>

                        <div className="relative">
                            {/* Vertical Line Connector */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-transparent -translate-x-1/2 hidden md:block"></div>

                            {/* Step 1 */}
                            <div className="flex flex-col md:flex-row items-center gap-12 mb-32 group">
                                <div className="flex-1 text-center md:text-right order-2 md:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('goal_step_1_title')}</h3>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('goal_step_1_desc')}</p>
                                </div>
                                <div className="relative z-10 flex-shrink-0 order-1 md:order-2">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl text-blue-600 border-4 border-blue-50 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-500 font-black">1</div>
                                </div>
                                <div className="flex-1 order-3 hidden md:block"></div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col md:flex-row items-center gap-12 mb-32 group">
                                <div className="flex-1 order-1 hidden md:block"></div>
                                <div className="relative z-10 flex-shrink-0 order-2">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl text-indigo-600 border-4 border-indigo-50 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-500 font-black">2</div>
                                </div>
                                <div className="flex-1 text-center md:text-left order-3 animate-in fade-in slide-in-from-right-8 duration-700">
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('goal_step_2_title')}</h3>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('goal_step_2_desc')}</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col md:flex-row items-center gap-12 group">
                                <div className="flex-1 text-center md:text-right order-2 md:order-1 animate-in fade-in slide-in-from-left-8 duration-700">
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('goal_step_3_title')}</h3>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('goal_step_3_desc')}</p>
                                </div>
                                <div className="relative z-10 flex-shrink-0 order-1 md:order-2">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl text-purple-600 border-4 border-purple-50 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-500 font-black">3</div>
                                </div>
                                <div className="flex-1 order-3 hidden md:block text-4xl pt-4 font-black">🚀</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: SCIENTIFIC PILLAR (E-E-A-T) - ACHIEVEMENT PEAK STYLE */}
                <section className="py-32 bg-rose-50/20 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <svg className="w-full h-full text-rose-100/30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                            <path d="M0,1000 L300,400 L500,700 L800,200 L1000,1000 Z" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="bg-white/80 rounded-[4rem] border border-white p-12 md:p-24 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 text-xs uppercase tracking-[0.2em] mb-10 shadow-sm border border-rose-200">
                                🏆 {t('goal_science_badge')}
                            </div>
                            
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight tracking-tight font-black">
                                {t('goal_science_title')}
                            </h2>
                            
                            <p className="text-gray-600 text-2xl leading-relaxed mb-16 italic font-medium max-w-3xl mx-auto">
                                {t('goal_science_desc')}
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-6">
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-rose-50 group hover:bg-rose-600 transition duration-500">
                                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-white/20 transition font-black">🎯</div>
                                    <div className="text-left">
                                        <span className="text-[10px] text-rose-600 uppercase tracking-widest block group-hover:text-rose-100 transition">Method 01</span>
                                        <span className="font-black text-gray-900 group-hover:text-white transition">OKR Framework</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-indigo-50 group hover:bg-indigo-600 transition duration-500">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-white/20 transition font-black">🧠</div>
                                    <div className="text-left">
                                        <span className="text-[10px] text-indigo-600 uppercase tracking-widest block group-hover:text-indigo-100 transition">Method 02</span>
                                        <span className="font-black text-gray-900 group-hover:text-white transition">SMART Goals</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-purple-50 group hover:bg-purple-600 transition duration-500">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-white/20 transition font-black">🧬</div>
                                    <div className="text-left">
                                        <span className="text-[10px] text-purple-600 uppercase tracking-widest block group-hover:text-purple-100 transition">Method 03</span>
                                        <span className="font-black text-gray-900 group-hover:text-white transition">Identity Shift</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEURAL PROMO: GOAL FORECASTING */}
                <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest mb-8 border border-indigo-500/20">
                                📈 {t('goal_ai_promo_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('goal_ai_promo_title')}
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                                {t('goal_ai_promo_desc')}
                            </p>
                            <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                                {t('goal_ai_promo_btn')} <span>→</span>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative w-full">
                            <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="flex items-end gap-1 h-32 mb-6">
                                    {[30, 45, 40, 60, 55, 80, 75, 95].map((h, idx) => (
                                        <div key={idx} className="flex-1 bg-indigo-500/20 rounded-t-lg group-hover:bg-indigo-500/40 transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                                <div className="p-4 bg-indigo-600/10 rounded-xl border border-indigo-500/20 text-center">
                                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1">Predicted Completion</p>
                                    <p className="text-white font-bold">Oct 14, 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                        <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                            {t('goal_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('goal_quote_author')}</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: BOTTOM CTA */}
                <section className="py-24 px-6 text-center">
                    <div className="max-w-5xl mx-auto bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>

                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-5xl mb-6 font-black">{t('goal_cta_title')}</h2>
                            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
                                {t('goal_cta_desc')}
                            </p>
                            <Link href="/register" className="inline-block bg-white text-indigo-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition transform shadow-xl">
                                {t('goal_cta_btn')}
                            </Link>
                            <p className="mt-6 text-sm text-indigo-300">{t('goal_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Goal Tracker (FAQ)
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
