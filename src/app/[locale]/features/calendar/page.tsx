'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureCalendarPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('calendar_faq_q1'),
            a: t('calendar_faq_a1')
        },
        {
            q: t('calendar_faq_q2'),
            a: t('calendar_faq_a2')
        },
        {
            q: t('calendar_faq_q3'),
            a: t('calendar_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="feature-calendar" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT + FLOATING CALENDAR MOCKUP) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                                <span className="text-lg">🗓️</span> {t('calendar_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                                {t('calendar_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('calendar_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('calendar_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                                    {t('calendar_hero_cta_1')}
                                </Link>
                                <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                                    {t('calendar_hero_cta_2')}
                                </a>
                            </div>
                        </div>

                        {/* Floating Mockup Centered */}
                        <div className="max-w-6xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 h-full w-full pointer-events-none"></div>
                            
                            <div className="bg-white/80 rounded-t-[3rem] border-x border-t border-gray-100 p-6 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12 overflow-hidden h-[500px]">
                                
                                {/* Left Side: Mini Calendar */}
                                <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-gray-900">{t('calendar_mockup_month')}</h4>
                                        <div className="flex gap-2 text-gray-400">
                                            <span className="hover:text-indigo-600 cursor-pointer">◀</span>
                                            <span className="hover:text-indigo-600 cursor-pointer">▶</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-700">
                                        <span className="text-gray-300">28</span><span className="text-gray-300">29</span><span className="text-gray-300">30</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">1</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">2</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">3</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer relative">4 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full"></span></span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">5</span>
                                        <span className="p-1 bg-indigo-600 text-white rounded-lg cursor-pointer shadow-md shadow-indigo-200 font-bold">6</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer relative">7 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span></span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">8</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">9</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer relative">10 <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span></span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">11</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">12</span>
                                        <span className="p-1 hover:bg-indigo-100 rounded-lg cursor-pointer">13</span>
                                    </div>
                                </div>

                                {/* Right Side: Daily Agenda */}
                                <div className="w-full md:w-2/3 flex flex-col text-left">
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                        <div>
                                            <h3 className="font-black text-gray-900 text-2xl">{t('calendar_mockup_today')}</h3>
                                            <p className="text-sm text-gray-500">{t('calendar_mockup_date')}</p>
                                        </div>
                                        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 font-bold text-sm">
                                            3 Events
                                        </div>
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <div className="flex gap-4 group cursor-pointer">
                                            <div className="text-right w-16 shrink-0 pt-1">
                                                <p className="text-xs font-bold text-gray-900">09:00</p>
                                                <p className="text-[10px] text-gray-400">10:30</p>
                                            </div>
                                            <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-2xl rounded-bl-lg group-hover:bg-blue-100 transition">
                                                <p className="font-bold text-blue-900 text-sm">{t('calendar_mockup_event_1')}</p>
                                                <p className="text-xs text-blue-700/70 mt-1 flex items-center gap-1">📍 {t('calendar_mockup_location_1')}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group cursor-pointer relative">
                                            <div className="absolute left-16 top-4 w-full h-[1px] bg-rose-500 z-0"></div>
                                            <div className="absolute left-14 top-[14px] w-2 h-2 bg-rose-500 rounded-full z-10 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></div>
                                            
                                            <div className="text-right w-16 shrink-0 pt-1">
                                                <p className="text-xs font-bold text-gray-900">13:00</p>
                                                <p className="text-[10px] text-gray-400">14:00</p>
                                            </div>
                                            <div className="flex-1 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-2xl rounded-bl-lg relative z-10 shadow-sm transform scale-[1.02]">
                                                <p className="font-bold text-rose-900 text-sm">{t('calendar_mockup_event_2')}</p>
                                                <p className="text-xs text-rose-700/70 mt-1 flex items-center gap-1">🎥 {t('calendar_mockup_location_2')}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group cursor-pointer">
                                            <div className="text-right w-16 shrink-0 pt-1">
                                                <p className="text-xs font-bold text-gray-900">19:00</p>
                                                <p className="text-[10px] text-gray-400">20:00</p>
                                            </div>
                                            <div className="flex-1 bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-2xl rounded-bl-lg group-hover:bg-gray-100 transition">
                                                <p className="font-bold text-gray-700 text-sm">{t('calendar_mockup_event_3')}</p>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">🧘‍♂️ {t('calendar_mockup_location_3')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Floating Alert */}
                            <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20 animate-bounce [animation-duration:3000ms] text-left">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl font-black">🔔</div>
                                    <div>
                                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">{t('calendar_mockup_alert_1')}</p>
                                        <p className="font-black text-gray-900 text-sm">{t('calendar_mockup_alert_2')}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                {/* SECTION 2: LAYERED TIME (3D STACK) */}
                <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-24 items-center">
                            <div className="flex-1 text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-xs uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-100">
                                    {t('calendar_layered_badge')}
                                </div>
                                <h2 className="text-6xl leading-[1.1] md:text-7xl text-gray-900 mb-10 tracking-tight font-black">
                                    {t('calendar_layered_title')}
                                </h2>
                                <p className="text-gray-500 text-xl mb-12 leading-relaxed font-medium">
                                    {t('calendar_layered_desc')}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition font-black">💼</div>
                                        <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('calendar_layered_feature_1_title')}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{t('calendar_layered_feature_1_desc')}</p>
                                    </div>
                                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition duration-500 group relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-2 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition"></div>
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition font-black">🌿</div>
                                        <h4 className="text-xl text-gray-900 mb-2 uppercase tracking-tighter">{t('calendar_layered_feature_2_title')}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{t('calendar_layered_feature_2_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full perspective-3000">
                                <div className="relative h-[550px] flex items-center justify-center group/visual">
                                    
                                    {/* Social Layer (Bottom) */}
                                    <div className="absolute w-full max-w-sm aspect-[4/3] bg-purple-500/10 border border-purple-500/20 rounded-[3rem] transform -rotate-[15deg] translate-y-24 translate-x-24 group-hover/visual:translate-y-32 group-hover/visual:translate-x-32 transition duration-1000">
                                        <div className="p-10 opacity-30">
                                            <div className="w-1/2 h-6 bg-purple-500/30 rounded-full mb-6"></div>
                                            <div className="w-full h-32 bg-purple-500/20 rounded-[2rem]"></div>
                                        </div>
                                    </div>

                                    {/* Personal Layer (Middle) */}
                                    <div className="absolute w-full max-w-sm aspect-[4/3] bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] transform -rotate-[8deg] translate-y-12 translate-x-12 z-10 group-hover/visual:translate-y-16 group-hover/visual:translate-x-16 transition duration-1000 delay-75">
                                        <div className="p-10 opacity-60">
                                            <div className="w-1/3 h-6 bg-emerald-500/30 rounded-full mb-6"></div>
                                            <div className="w-2/3 h-6 bg-emerald-500/10 rounded-full mb-10"></div>
                                            <div className="flex gap-6">
                                                <div className="w-16 h-16 bg-emerald-500/30 rounded-2xl"></div>
                                                <div className="w-16 h-16 bg-emerald-500/30 rounded-2xl"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Work Layer (Top) */}
                                    <div className="absolute w-full max-w-sm aspect-[4/3] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.12)] border border-gray-100 z-20 p-12 transform hover:scale-105 transition duration-700 shadow-indigo-100/50 text-left">
                                        <div className="flex justify-between items-center mb-12">
                                            <h4 className="font-black text-gray-900 text-2xl tracking-tighter uppercase">{t('calendar_layered_card_title')}</h4>
                                            <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-300 transform -rotate-12">💼</div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="h-20 bg-blue-50/50 border-l-[6px] border-blue-500 p-6 rounded-r-2xl relative overflow-hidden">
                                                <div className="absolute right-4 top-4 w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                                <div className="mb-2">
                                                    <span className="text-[11px] text-blue-600 uppercase tracking-widest">{t('calendar_layered_card_event_1_time')}</span>
                                                </div>
                                                <p className="text-lg text-blue-900 leading-none tracking-tight">{t('calendar_layered_card_event_1_title')}</p>
                                            </div>
                                            <div className="h-20 bg-indigo-50/50 border-l-[6px] border-indigo-500 p-6 rounded-r-2xl opacity-40">
                                                <p className="text-[11px] text-indigo-400 uppercase mb-2 tracking-widest">{t('calendar_layered_card_event_2_time')}</p>
                                                <p className="text-lg text-indigo-900 leading-none tracking-tight">{t('calendar_layered_card_event_2_title')}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: DEADLINE PULSE (DARK MODE URGENCY) */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:50px_50px] opacity-[0.05]"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-24">
                            <span className="text-rose-500 uppercase tracking-[0.5em] text-xs mb-6 block">{t('calendar_pulse_badge')}</span>
                            <h2 className="text-5xl md:text-7xl mb-10 tracking-tight font-black">{t('calendar_pulse_title')}</h2>
                            <p className="text-indigo-100 text-xl opacity-80 leading-relaxed font-medium">{t('calendar_pulse_desc')}</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            
                            {/* Pulse List */}
                            <div className="space-y-8 text-left">
                                
                                {/* Item 1: CRITICAL */}
                                <div className="bg-white/5 border-2 border-rose-500/40 rounded-[2.5rem] p-10 flex items-center justify-between group hover:bg-rose-500/10 transition duration-500 hover:shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent"></div>
                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-30"></div>
                                            <div className="w-20 h-20 bg-rose-500 text-white rounded-[2rem] flex items-center justify-center text-4xl relative z-10 shadow-2xl shadow-rose-500/40 transform group-hover:rotate-12 transition group-hover:scale-110 font-black">!</div>
                                        </div>
                                        <div>
                                            <h4 className="text-3xl text-white mb-2 font-black">{t('calendar_pulse_item_1_title')}</h4>
                                            <p className="text-rose-400 uppercase tracking-[0.2em] text-[11px] bg-rose-500/10 inline-block px-3 py-1 rounded-full border border-rose-500/20">{t('calendar_pulse_item_1_status')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block relative z-10">
                                        <p className="text-4xl text-white tabular-nums font-black">{t('calendar_pulse_item_1_timer')}</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{t('calendar_pulse_item_1_sub')}</p>
                                    </div>
                                </div>

                                {/* Item 2: NORMAL */}
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex items-center justify-between group hover:bg-indigo-600/10 transition duration-500 border-l-4 border-l-indigo-500">
                                    <div className="flex items-center gap-8 opacity-60 group-hover:opacity-100 transition">
                                        <div className="w-20 h-20 bg-slate-800 text-slate-400 rounded-[2rem] flex items-center justify-center text-4xl group-hover:bg-indigo-600 group-hover:text-white transition duration-700 font-black">?</div>
                                        <div>
                                            <h4 className="text-3xl text-white mb-2 tracking-tight font-black">{t('calendar_pulse_item_2_title')}</h4>
                                            <p className="text-indigo-400 tracking-[0.2em] text-[11px] uppercase">{t('calendar_pulse_item_2_status')}</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <span className="text-white/20 text-4xl font-black">⚓</span>
                                    </div>
                                </div>

                            </div>

                            {/* Radar sweep */}
                            <div className="relative hidden lg:flex items-center justify-center p-12">
                                <div className="w-full aspect-square max-md border-2 border-indigo-500/20 rounded-full flex items-center justify-center relative shadow-[0_0_100px_rgba(79,70,229,0.1)]">
                                    <div className="absolute inset-0 bg-indigo-500/[0.02] rounded-full animate-pulse"></div>
                                    <div className="w-3/4 h-3/4 border border-indigo-500/20 rounded-full flex items-center justify-center">
                                        <div className="w-1/2 h-1/2 border-2 border-rose-500/30 rounded-full animate-ping duration-1000"></div>
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-transparent to-transparent rounded-full animate-spin-slow opacity-40"></div>
                                    
                                    <div className="absolute top-[15%] right-[25%] w-6 h-6 bg-rose-500 rounded-full shadow-[0_0_40px_rgba(244,63,94,1)] animate-pulse border-4 border-slate-950"></div>
                                    <div className="absolute bottom-[30%] left-[20%] w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.8)] border-2 border-slate-950"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3.5: ECOSYSTEM SYNC (NETWORK GRAPH VISUAL) */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="flex-1 text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-indigo-200">
                                    {t('calendar_sync_badge')}
                                </div>
                                <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                    {t('calendar_sync_title')}
                                </h2>
                                <p className="text-gray-600 text-xl mb-12 leading-relaxed font-medium">
                                    {t('calendar_sync_desc')}
                                </p>
                                
                                <div className="space-y-8">
                                    <div className="flex gap-6 group">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">💰</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{t('calendar_node_finance_title')}</h4>
                                            <p className="text-gray-500 text-sm font-medium">{t('calendar_node_finance_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 group">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">💼</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{t('calendar_node_job_title')}</h4>
                                            <p className="text-gray-500 text-sm font-medium">{t('calendar_node_job_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 group">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-xl shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">📔</div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-tighter mb-1">{t('calendar_node_journal_title')}</h4>
                                            <p className="text-gray-500 text-sm font-medium">{t('calendar_node_journal_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full relative h-[500px] flex items-center justify-center">
                                <div className="relative z-20 w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_0_60px_rgba(79,70,229,0.4)] animate-pulse border-4 border-white transform hover:scale-110 transition duration-500 cursor-pointer font-black">
                                    🗓️
                                </div>
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 500 500">
                                        <line x1="250" y1="250" x2="100" y2="150" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                        <line x1="250" y1="250" x2="400" y2="100" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                        <line x1="250" y1="250" x2="400" y2="400" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                        <line x1="250" y1="250" x2="100" y2="400" stroke="#4f46e5" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                                    </svg>
                                    
                                    <div className="absolute top-[15%] left-[20%] w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl border border-emerald-50 transform hover:-translate-y-2 transition duration-500 group cursor-pointer shadow-emerald-100/50 font-black">
                                        <div className="absolute -inset-2 bg-emerald-400/10 rounded-[2rem] -z-10 animate-ping opacity-20"></div>
                                        💰
                                    </div>
                                    
                                    <div className="absolute top-[10%] right-[15%] w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-indigo-50 transform hover:scale-105 transition duration-500 group cursor-pointer shadow-indigo-100/50 font-black">
                                        <div className="absolute -inset-2 bg-indigo-400/10 rounded-[2.5rem] -z-10 animate-pulse"></div>
                                        💼
                                    </div>
                                    
                                    <div className="absolute bottom-[10%] right-[15%] w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl border border-purple-50 transform hover:rotate-12 transition duration-500 group cursor-pointer shadow-purple-100/50 font-black">
                                        <div className="absolute -inset-1 bg-purple-400/10 rounded-[2rem] -z-10"></div>
                                        📔
                                    </div>
                                    
                                    <div className="absolute bottom-[15%] left-[20%] w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center text-3xl border border-amber-50 transform hover:-rotate-12 transition duration-500 group cursor-pointer shadow-amber-100/50 font-black">
                                        🌱
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <style jsx>{`
                        @keyframes dash {
                            to { stroke-dashoffset: -100; }
                        }
                    `}</style>
                </section>

                {/* SECTION 4: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            
                            {/* 3D Orbital Visual */}
                            <div className="flex-1 w-full relative h-[450px] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/20 to-transparent rounded-full blur-3xl shadow-2xl"></div>
                                <div className="relative w-64 h-64 bg-white border border-indigo-100 rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(79,70,229,0.15)] group">
                                    <span className="text-6xl group-hover:scale-125 transition duration-700 font-black">🧬</span>
                                    <div className="absolute -inset-8 border-2 border-dashed border-indigo-200 rounded-full animate-spin-slow"></div>
                                    <div className="absolute -inset-16 border border-dotted border-indigo-100 rounded-full animate-spin-slow-reverse"></div>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xs shadow-xl animate-bounce">01</div>
                                    <div className="absolute bottom-1/4 -right-12 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg animate-pulse">02</div>
                                </div>
                            </div>

                            <div className="flex-1 text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-widest mb-8 border border-indigo-100 rounded-full">
                                    🧩 {t('calendar_science_badge')}
                                </div>
                                
                                <h2 className="text-5xl md:text-6xl text-gray-900 mb-10 leading-tight font-black">
                                    {t('calendar_science_title')}
                                </h2>
                                
                                <div className="bg-indigo-50/50 border-l-8 border-indigo-500 p-10 rounded-r-[2rem] shadow-sm mb-12">
                                    <p className="text-gray-700 text-2xl leading-relaxed italic font-medium">
                                        {t('calendar_science_desc')}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                                        <span className="text-[10px] text-indigo-500 uppercase block mb-1">Architecture</span>
                                        <span className="font-bold text-gray-900">Cognitive Load Theory</span>
                                    </div>
                                    <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                                        <span className="text-[10px] text-purple-500 uppercase block mb-1">Biological Sync</span>
                                        <span className="font-bold text-gray-900">Circadian Rhythm</span>
                                    </div>
                                    <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition cursor-default">
                                        <span className="text-[10px] text-emerald-500 uppercase block mb-1">Execution System</span>
                                        <span className="font-bold text-gray-900">Time Blocking</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* NEURAL PROMO: CALENDAR FLOW */}
                <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 text-left">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest mb-8 border border-blue-500/20">
                                📅 {t('calendar_ai_promo_badge')}
                            </div>
                            <h2 className="text-5xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('calendar_ai_promo_title')}
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                                {t('calendar_ai_promo_desc')}
                            </p>
                            <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-blue-700 transition transform hover:-translate-y-1">
                                {t('calendar_ai_promo_btn')} <span>→</span>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative w-full">
                            <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl relative">
                                <div className="grid grid-cols-7 gap-2">
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="h-32 bg-white/5 rounded-lg overflow-hidden relative">
                                            {(i === 2 || i === 4) && (
                                                <div className="absolute inset-x-1 top-4 bottom-12 bg-blue-600/30 border-x border-blue-500/50 flex flex-col items-center justify-center">
                                                    <span className="text-[8px] text-blue-300 opacity-60">PRIME TIME</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: PHILOSOPHICAL QUOTE */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                        <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                            {t('calendar_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs">{t('calendar_quote_author')}</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: CTA BANNER */}
                <section className="pt-32 pb-40 bg-slate-900 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] opacity-30"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-8 font-black">🗓️</div>
                        <h2 className="text-5xl md:text-6xl mb-8 text-white tracking-tight font-black">{t('calendar_cta_title')}</h2>
                        <p className="text-indigo-200 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                            {t('calendar_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-white text-slate-900 px-12 py-5 rounded-full text-lg hover:bg-indigo-50 hover:scale-105 transition transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            {t('calendar_cta_btn')}
                        </Link>
                        <p className="mt-8 text-sm text-slate-400 font-medium">{t('calendar_cta_note')}</p>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Smart Calendar (FAQ)
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
