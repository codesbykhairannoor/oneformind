'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeaturePlannerPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('planner_faq_q1'),
            a: t('planner_faq_a1')
        },
        {
            q: t('planner_faq_q2'),
            a: t('planner_faq_a2')
        },
        {
            q: t('planner_faq_q3'),
            a: t('planner_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="feature-planner" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED TEXT + KANBAN BOARD MOCKUP) */}
                <header className="pt-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] -z-10"></div>
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-wider border border-indigo-200">
                            <span className="text-lg">📅</span> {t('planner_hero_badge')}
                        </div>
                        <h1 className="text-[42px] leading-[1.1] md:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                            {t('planner_hero_title_1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">{t('planner_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto font-medium">
                            {t('planner_hero_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                                {t('planner_hero_cta_1')}
                            </Link>
                            <a href="#how-it-works" className="bg-white text-gray-700 border border-gray-200 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition">
                                {t('planner_hero_cta_2')}
                            </a>
                        </div>
                    </div>

                    {/* Hero Visual: Kanban Board Mockup (Trello Vibe) */}
                    <div className="max-w-6xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                        
                        <div className="bg-gray-100/80 rounded-t-[2.5rem] border-x border-t border-gray-200 p-6 md:p-10 shadow-2xl flex gap-6 overflow-hidden h-[450px]">
                            
                            {/* Column 1: To Do */}
                            <div className="w-1/3 min-w-[300px] bg-gray-200/50 rounded-2xl p-4 flex flex-col gap-4 text-left">
                                <div className="flex justify-between items-center font-bold text-gray-700 px-2">
                                    <span>{t('planner_mockup_col_1')}</span>
                                    <span className="bg-gray-300 px-2 py-0.5 rounded-md text-xs">1</span>
                                </div>
                                {/* Task 3 (Pending) */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 cursor-pointer transform transition hover:-translate-y-1">
                                    <div className="flex gap-2 mb-3">
                                        <span className="w-10 h-2 rounded-full bg-blue-400"></span>
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm mb-2">{t('planner_mockup_task_3')}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">🕒 {t('planner_mockup_time_3')}</p>
                                </div>
                            </div>

                            {/* Column 2: In Progress */}
                            <div className="w-1/3 min-w-[300px] bg-indigo-100/50 rounded-2xl p-4 flex flex-col gap-4 border border-indigo-100 text-left">
                                <div className="flex justify-between items-center font-bold text-indigo-900 px-2">
                                    <span className="flex items-center gap-2">🔥 {t('planner_mockup_col_2')}</span>
                                    <span className="bg-indigo-200 px-2 py-0.5 rounded-md text-xs text-indigo-800">1</span>
                                </div>
                                {/* Task 2 (Active) */}
                                <div className="bg-white p-4 rounded-xl shadow-md border-2 border-indigo-400 cursor-pointer transform scale-105 z-10 relative">
                                    <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-sm">
                                        {t('planner_mockup_alert_1')}
                                    </div>
                                    <div className="flex gap-2 mb-3">
                                        <span className="w-10 h-2 rounded-full bg-amber-500"></span>
                                        <span className="w-10 h-2 rounded-full bg-indigo-500"></span>
                                    </div>
                                    <p className="font-bold text-indigo-950 text-sm mb-2">{t('planner_mockup_task_2')}</p>
                                    <p className="text-xs text-indigo-600 font-bold flex items-center gap-1">⏳ {t('planner_mockup_time_2')}</p>
                                </div>
                            </div>

                            {/* Column 3: Done */}
                            <div className="w-1/3 min-w-[300px] bg-green-50/80 rounded-2xl p-4 flex flex-col gap-4 opacity-70 text-left">
                                <div className="flex justify-between items-center font-bold text-green-800 px-2">
                                    <span>{t('planner_mockup_col_3')}</span>
                                    <span className="bg-green-200 px-2 py-0.5 rounded-md text-xs">1</span>
                                </div>
                                {/* Task 1 (Done) */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer">
                                    <div className="flex gap-2 mb-3">
                                        <span className="w-10 h-2 rounded-full bg-red-500 opacity-50"></span>
                                    </div>
                                    <p className="font-bold text-gray-500 text-sm mb-2 line-through">{t('planner_mockup_task_1')}</p>
                                    <p className="text-xs text-green-600 font-bold flex items-center gap-1">✓ {t('planner_mockup_title')}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE DAILY TIMELINE */}
                <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="flex-1 text-left animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                                    {t('planner_timeline_badge')}
                                </div>
                                <h2 className="text-5xl text-gray-900 mb-8 leading-tight font-black">
                                    {t('planner_timeline_title')}
                                </h2>
                                <p className="text-gray-600 text-xl mb-10 leading-relaxed max-w-xl font-medium">
                                    {t('planner_timeline_desc')}
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 transition duration-500">
                                        <span className="text-xs text-indigo-600 uppercase mb-2 block tracking-widest">{t('planner_timeline_stat_1_label')}</span>
                                        <span className="text-3xl text-slate-900 font-black">{t('planner_timeline_stat_1_value')}</span>
                                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">{t('planner_timeline_stat_footer')}</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-purple-100/50 transition duration-500">
                                        <span className="text-xs text-purple-600 uppercase mb-2 block tracking-widest">{t('planner_timeline_stat_2_label')}</span>
                                        <span className="text-3xl text-slate-900 font-black">{t('planner_timeline_stat_2_value')}</span>
                                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">{t('planner_timeline_stat_footer')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full text-left animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                                <div className="bg-gray-50 rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-inner relative overflow-hidden group">
                                    {/* Schedule Visual */}
                                    <div className="space-y-8 relative">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[13px] top-4 bottom-4 w-1 bg-gray-200 rounded-full group-hover:bg-indigo-100 transition duration-700"></div>

                                        {/* Time Block 1 */}
                                        <div className="flex gap-8 items-start relative z-10 transition duration-500 transform hover:-translate-y-1">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 border-4 border-white shadow-[0_0_15px_rgba(79,70,229,0.3)] shrink-0 mt-2 animate-pulse"></div>
                                            <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group-hover:shadow-xl transition duration-500 relative overflow-hidden">
                                                <div className="absolute right-0 top-0 w-1.5 h-full bg-indigo-600"></div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[11px] text-indigo-600 uppercase tracking-[0.2em] font-bold">{t('planner_timeline_time_1')}</span>
                                                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase font-bold">{t('planner_timeline_card_1_badge')}</span>
                                                </div>
                                                <h4 className="text-xl text-gray-900 mb-2 font-black">{t('planner_timeline_card_1_title')}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed">{t('planner_timeline_card_1_desc')}</p>
                                            </div>
                                        </div>

                                        {/* Time Block 2 */}
                                        <div className="flex gap-8 items-start relative z-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500 transform hover:-translate-y-1">
                                            <div className="w-8 h-8 rounded-full bg-gray-300 border-4 border-white shadow-sm shrink-0 mt-2"></div>
                                            <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold">{t('planner_timeline_time_2')}</span>
                                                </div>
                                                <h4 className="text-xl text-gray-900 mb-2 font-black">{t('planner_timeline_card_2_title')}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed">{t('planner_timeline_card_2_desc')}</p>
                                            </div>
                                        </div>

                                        {/* Time Block 3 */}
                                        <div className="flex gap-8 items-start relative z-10 transition duration-500 transform hover:-translate-y-1">
                                            <div className="w-8 h-8 rounded-full bg-purple-600 border-4 border-white shadow-[0_0_15px_rgba(147,51,234,0.3)] shrink-0 mt-2"></div>
                                            <div className="flex-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
                                                <div className="absolute right-0 top-0 w-1.5 h-full bg-purple-500"></div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[11px] text-purple-600 uppercase tracking-[0.2em] font-bold">{t('planner_timeline_time_3')}</span>
                                                    <span className="text-[10px] bg-purple-50 text-purple-700 px-3 py-1 rounded-full uppercase font-bold">{t('planner_timeline_card_3_badge')}</span>
                                                </div>
                                                <h4 className="text-xl text-gray-900 mb-2 font-black">{t('planner_timeline_card_3_title')}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed">{t('planner_timeline_card_3_desc')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: MORNING TO NIGHT FLOW */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs mb-6 block">{t('planner_flow_badge')}</span>
                            <h2 className="text-4xl md:text-6xl mb-8 font-black">{t('planner_flow_title')}</h2>
                            <p className="text-indigo-100 text-xl opacity-80 leading-relaxed">{t('planner_flow_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start text-left">
                            
                            {/* Morning */}
                            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:bg-white/10 transition duration-500 group relative overflow-hidden">
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition"></div>
                                <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:rotate-6 transition font-black select-none">☀️</div>
                                <h3 className="text-3xl mb-6 font-black">{t('planner_flow_col_1_title')}</h3>
                                <p className="text-white/60 mb-10 text-lg leading-relaxed">{t('planner_flow_col_1_desc')}</p>
                                <div className="bg-emerald-500/20 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-emerald-500/30 text-emerald-300 inline-block animate-pulse font-bold">{t('planner_flow_col_1_status')}</div>
                            </div>

                            {/* Afternoon */}
                            <div className="bg-indigo-600/10 border-2 border-indigo-500/30 rounded-[3rem] p-12 hover:bg-indigo-600/20 transition duration-500 group relative md:-mt-8 shadow-2xl">
                                <div className="absolute inset-0 bg-indigo-500/5 -z-10 animate-pulse"></div>
                                <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition font-black select-none">⚡</div>
                                <h3 className="text-3xl mb-6 font-black">{t('planner_flow_col_2_title')}</h3>
                                <p className="text-indigo-100 opacity-80 mb-10 text-lg leading-relaxed">{t('planner_flow_col_2_desc')}</p>
                                <div className="bg-indigo-400/30 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-indigo-400/40 text-indigo-200 inline-block font-bold">{t('planner_flow_col_2_status')}</div>
                            </div>

                            {/* Night */}
                            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 hover:bg-white/10 transition duration-500 group relative overflow-hidden">
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition"></div>
                                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-[2rem] flex items-center justify-center text-4xl mb-10 group-hover:-rotate-6 transition font-black select-none">🌙</div>
                                <h3 className="text-3xl mb-6 font-black">{t('planner_flow_col_3_title')}</h3>
                                <p className="text-white/60 mb-10 text-lg leading-relaxed">{t('planner_flow_col_3_desc')}</p>
                                <div className="bg-purple-500/20 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest border border-purple-500/30 text-purple-300 inline-block font-bold">{t('planner_flow_col_3_status')}</div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3.5: EISENHOWER MATRIX (2x2 GRID) */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-200">
                                {t('planner_matrix_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                {t('planner_matrix_title')}
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed font-medium">
                                {t('planner_matrix_desc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative text-left">
                            {/* Axis Labels */}
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 hidden md:block">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-gray-300 font-bold">{t('planner_matrix_axis_y')}</span>
                            </div>
                            <div className="absolute top-[-3rem] left-1/2 -translate-x-1/2 hidden md:block">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-gray-300 font-bold">{t('planner_matrix_axis_x')}</span>
                            </div>

                            {/* Q1: Urgent & Important */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-rose-500 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">🔥</div>
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q1_title')}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q1_desc')}</p>
                                </div>
                            </div>

                            {/* Q2: Not Urgent & Important */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-emerald-500 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">💎</div>
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q2_title')}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q2_desc')}</p>
                                </div>
                            </div>

                            {/* Q3: Urgent & Not Important */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-amber-500 hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">⚡</div>
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q3_title')}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q3_desc')}</p>
                                </div>
                            </div>

                            {/* Q4: Not Urgent & Not Important */}
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-l-8 border-slate-300 hover:shadow-2xl transition duration-500 group relative overflow-hidden opacity-80 hover:opacity-100">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] group-hover:scale-110 transition duration-700"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition font-black select-none">🧹</div>
                                    <h3 className="text-2xl text-gray-900 mb-4 font-black">{t('planner_matrix_q4_title')}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{t('planner_matrix_q4_desc')}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* NEW SECTION: SCIENTIFIC PILLAR (E-E-A-T) - CLEAN EDITORIAL STYLE */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
                    
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-12 gap-12 items-start text-left">
                            
                            {/* Left Header Block */}
                            <div className="lg:col-span-4 lg:sticky lg:top-32">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-widest mb-6 font-bold">
                                    🧬 {t('planner_science_badge')}
                                </div>
                                <h2 className="text-4xl md:text-5xl text-gray-900 mb-8 leading-tight font-black">
                                    {t('planner_science_title')}
                                </h2>
                                <div className="w-20 h-1 bg-indigo-600 rounded-full mb-8"></div>
                            </div>

                            {/* Right Content Grid */}
                            <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 bg-white border border-indigo-100 p-12 rounded-[2.5rem] shadow-xl shadow-indigo-50/50">
                                    <p className="text-gray-600 text-2xl leading-relaxed italic font-serif">
                                        {t('planner_science_desc')}
                                    </p>
                                </div>

                                {/* Source Cards */}
                                <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition duration-500">
                                    <span className="text-[10px] text-indigo-600 uppercase tracking-widest mb-4 block font-bold">Proven Framework</span>
                                    <h4 className="text-xl text-gray-900 mb-2 font-black">Deep Work</h4>
                                    <p className="text-sm text-gray-500 font-medium">Cal Newport's method for distraction-free peak performance and high-quality output.</p>
                                </div>
                                <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition duration-500">
                                    <span className="text-[10px] text-indigo-600 uppercase tracking-widest mb-4 block font-bold">Execution Engine</span>
                                    <h4 className="text-xl text-gray-900 mb-2 font-black">Time Blocking</h4>
                                    <p className="text-sm text-gray-500 font-medium">Converting intentions into dedicated time slots for maximum systemic execution.</p>
                                </div>

                                {/* Verified Footer */}
                                <div className="md:col-span-2 flex items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-xl font-bold select-none">✓</div>
                                    <div className="text-left">
                                        <span className="text-[10px] uppercase tracking-widest text-indigo-300 block font-bold">Status: Verified</span>
                                        <span className="text-sm font-medium opacity-80 italic">Scientific methods integrated with Tranvas Structured Execution loops.</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* NEURAL PROMO: PLANNER OPTIMIZATION */}
                <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-pattern-grid opacity-10"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-widest mb-8 border border-indigo-500/20">
                                ⚡ {t('planner_ai_promo_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('planner_ai_promo_title')}
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                                {t('planner_ai_promo_desc')}
                            </p>
                            <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                                {t('planner_ai_promo_btn')} <span>→</span>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative w-full">
                            <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[60%] animate-pulse"></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] text-slate-500 tracking-widest uppercase font-bold">
                                        <span>COGNITIVE LOAD: HIGH</span>
                                        <span className="text-indigo-400">OPTIMIZING...</span>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xl font-black select-none">🧘</div>
                                        <div className="text-left">
                                            <p className="text-white font-bold text-sm leading-none mb-1">Low-Impact Task Detected</p>
                                            <p className="text-slate-400 text-xs">Moving 'Reply Emails' to 4 PM.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: PHILOSOPHICAL QUOTE */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                        <h2 className="text-3xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                            {t('planner_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('planner_quote_author')}</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: CTA BANNER */}
                <section className="pb-32 bg-gray-50 px-6">
                    <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-2 transition duration-500">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-50"></div>
                        
                        <div className="relative z-10 text-white">
                            <h2 className="text-4xl md:text-6xl mb-8 tracking-tight font-black">{t('planner_cta_title')}</h2>
                            <p className="text-indigo-100 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
                                {t('planner_cta_desc')}
                            </p>
                            <Link href="/register" className="inline-block bg-white text-indigo-900 px-12 py-5 rounded-full text-lg hover:bg-indigo-50 hover:scale-110 transition transform shadow-xl font-bold">
                                {t('planner_cta_btn')}
                            </Link>
                            <p className="mt-6 text-sm text-indigo-200/80 font-medium">{t('planner_cta_note')}</p>
                        </div>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Daily Planner (FAQ)
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
