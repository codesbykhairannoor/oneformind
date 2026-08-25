'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionFreelancerPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('freelance_faq_q1'),
            a: t('freelance_faq_a1')
        },
        {
            q: t('freelance_faq_q2'),
            a: t('freelance_faq_a2')
        },
        {
            q: t('freelance_faq_q3'),
            a: t('freelance_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-freelancer" className="overflow-x-hidden text-left">
                
                {/* SECTION 1: HERO (FLOATING FREELANCE ECOSYSTEM) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50 relative border-b border-gray-100">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-700 fill-mode-both relative z-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                                💻 {t('freelance_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl mb-6 leading-[1.05] text-gray-900 tracking-tight font-black">
                                {t('freelance_hero_title_1')}
                                <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                                    {t('freelance_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl">
                                {t('freelance_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('freelance_hero_cta_1')}
                                </Link>
                            </div>
                            
                            <div className="mt-8 flex items-center gap-4 text-sm font-bold text-gray-400">
                                <div className="flex -space-x-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white text-xs font-bold">SS</span>
                                    <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-white text-xs font-bold">DF</span>
                                    <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white text-xs font-bold">KN</span>
                                </div>
                                <p>{t('freelance_hero_social_proof')}</p>
                            </div>
                        </div>

                        {/* Floating Freelance Ecosystem (Tinggi Terkunci h-[500px]) */}
                        <div className="lg:col-span-5 mt-0 relative z-10 w-full h-[500px] animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-full blur-3xl opacity-20"></div>
                            
                            {/* Center Piece: Freelancer ID Card */}
                            <div className="absolute z-20 w-72 bg-white/90 rounded-3xl shadow-2xl border border-white p-6 transform hover:scale-105 transition duration-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 p-0.5">
                                        <img className="w-full h-full rounded-full border-2 border-white object-cover" src="https://ui-avatars.com/api/?name=U+M&background=fff&color=4f46e5" alt="User" />
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-600 text-[10px] uppercase px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {t('freelance_mockup_available')}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-gray-900 mb-1">{t('freelance_mockup_role')}</h3>
                                    <p className="text-xs font-medium text-gray-500 mb-4">{t('freelance_mockup_rating')}</p>
                                    
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold">Laravel</span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold">Vue.js</span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-md font-bold">Tailwind</span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full w-[92%]"></div>
                                    </div>
                                    <p className="text-[10px] text-right font-bold text-gray-400 mt-1">{t('freelance_mockup_completion')}</p>
                                </div>
                            </div>

                            {/* Floating Item Top Right: Payment Received */}
                            <div className="absolute top-8 right-0 z-30 w-56 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 p-4 transform rotate-3 hover:rotate-0 transition duration-300 animate-bounce">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">💰</div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('freelance_mockup_payment_badge')}</p>
                                        <p className="text-sm text-white font-bold">$ 1,250.00</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 italic">{t('freelance_mockup_payment_from')}</p>
                            </div>

                            {/* Floating Item Bottom Left: Client Message */}
                            <div className="absolute bottom-12 left-0 z-30 w-64 bg-white rounded-2xl shadow-xl border border-sky-100 p-4 transform -rotate-3 hover:rotate-0 transition duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-sm">👋</div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-xs text-gray-900 font-bold">{t('freelance_mockup_msg_name')}</p>
                                            <p className="text-[9px] font-bold text-gray-400">{t('freelance_mockup_msg_time')}</p>
                                        </div>
                                        <p className="text-[11px] font-medium text-gray-600 leading-tight">
                                            "{t('freelance_mockup_msg_text')}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Element: Project Milestone */}
                            <div className="absolute bottom-4 right-10 z-10 bg-white/80 rounded-full px-4 py-2 shadow-sm border border-slate-100 flex items-center gap-2">
                                <span className="text-sky-500">🎯</span>
                                <p className="text-[10px] text-slate-700 uppercase tracking-wide font-bold">{t('freelance_mockup_milestone')}</p>
                            </div>

                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE "FREELANCE ROLLERCOASTER" */}
                <section className="py-24 bg-white bg-pattern-dots relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <h2 className="text-5xl md:text-5xl mb-6 text-gray-900 font-black">{t('freelance_prob_title')}</h2>
                            <p className="text-xl text-gray-500">{t('freelance_prob_desc')}</p>
                        </div>

                        <div className="relative max-w-5xl mx-auto">
                            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gray-100 -z-10 rounded-full border-b-2 border-dashed border-gray-200"></div>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition duration-300 relative group">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white group-hover:bg-indigo-600 group-hover:text-white transition font-bold">1</div>
                                    <div className="text-4xl mb-4 mt-2 text-center font-black select-none">🤯</div>
                                    <h3 className="text-lg font-bold mb-3 text-center text-gray-900">{t('freelance_prob_1_title')}</h3>
                                    <p className="text-gray-500 text-sm text-center font-medium">{t('freelance_prob_1_desc')}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-rose-200 transition duration-300 relative group delay-100">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white group-hover:bg-rose-500 group-hover:text-white transition font-bold">2</div>
                                    <div className="text-4xl mb-4 mt-2 text-center font-black select-none">💸</div>
                                    <h3 className="text-lg font-bold mb-3 text-center text-gray-900">{t('freelance_prob_2_title')}</h3>
                                    <p className="text-gray-500 text-sm text-center font-medium">{t('freelance_prob_2_desc')}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-200 transition duration-300 relative group delay-200">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 absolute -top-6 left-1/2 -translate-x-1/2 border-4 border-white group-hover:bg-amber-500 group-hover:text-white transition font-bold">3</div>
                                    <div className="text-4xl mb-4 mt-2 text-center font-black select-none">🥱</div>
                                    <h3 className="text-lg font-bold mb-3 text-center text-gray-900">{t('freelance_prob_3_title')}</h3>
                                    <p className="text-gray-500 text-sm text-center font-medium">{t('freelance_prob_3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: COMMAND CENTER (DARK MODE HIGHLIGHT) */}
                <section className="py-24 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                    <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-3xl opacity-20"></div>

                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="order-2 lg:order-1 relative h-[450px] bg-slate-900 rounded-[3rem] p-8 flex flex-col justify-center overflow-hidden border border-slate-800 shadow-2xl">
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-slate-300 font-bold">{t('freelance_mockup_active_title')}</h4>
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 font-bold">{t('freelance_mockup_active_status')}</span>
                                </div>
                                
                                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex justify-between items-center transform transition hover:translate-x-2 cursor-pointer">
                                    <div>
                                        <p className="text-white font-bold text-sm">{t('freelance_mockup_project_1_title')}</p>
                                        <p className="text-slate-400 text-xs font-medium">{t('freelance_mockup_project_1_sub')}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs text-indigo-400 font-bold">75%</div>
                                </div>
                                
                                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex justify-between items-center transform transition hover:translate-x-2 cursor-pointer">
                                    <div>
                                        <p className="text-white font-bold text-sm">{t('freelance_mockup_project_2_title')}</p>
                                        <p className="text-slate-400 text-xs font-medium">{t('freelance_mockup_project_2_sub')}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center text-xs text-amber-400 font-bold">30%</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-right-12 duration-700">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-2xl text-2xl mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)] font-black select-none">🛠️</div>
                            <h2 className="text-5xl md:text-6xl mb-6 text-white font-black">{t('freelance_feat_1_title')}</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                {t('freelance_feat_1_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-slate-300">
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm shrink-0 border border-indigo-500/30">✓</span> {t('freelance_feat_1_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm shrink-0 border border-indigo-500/30">✓</span> {t('freelance_feat_1_point_2')}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: INVOICE & MONEY */}
                <section className="py-24 bg-gray-50 border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl mb-6 font-black select-none">💰</div>
                            <h2 className="text-4xl md:text-5xl mb-6 text-gray-900 font-black">The Ultimate Financial Dashboard for Freelancers</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
                                Stop paying $30/month for complex accounting software like QuickBooks, and stop wasting 10 hours building formulas in Excel. Get a real-time financial dashboard designed specifically for solopreneurs.
                            </p>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 font-bold">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">{t('freelance_feat_2_point_1')}</span>
                                    <span className="text-emerald-500">Tracked</span>
                                </div>
                                <div className="w-full h-px bg-gray-100"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">{t('freelance_feat_2_point_2')}</span>
                                    <span className="text-emerald-500">Automated</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative h-[400px] bg-white rounded-[3rem] p-8 flex items-center justify-center overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/50">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                            
                            {/* Receipt Container */}
                            <div className="bg-gray-50 w-64 p-6 rounded-t-xl rounded-b-sm border border-dashed border-gray-300 relative shadow-inner">
                                <div className="text-center mb-4 border-b border-dashed border-gray-300 pb-4">
                                    <h4 className="font-black text-gray-900 text-xl tracking-widest">{t('freelance_mockup_invoice_title')}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1 font-bold">{t('freelance_mockup_invoice_status')}</p>
                                </div>
                                <div className="space-y-2 text-xs font-semibold text-gray-600 mb-4 border-b border-dashed border-gray-300 pb-4">
                                    <div className="flex justify-between"><span>{t('freelance_mockup_invoice_item_1')}</span><span>$500</span></div>
                                    <div className="flex justify-between"><span>{t('freelance_mockup_invoice_item_2')}</span><span>$200</span></div>
                                </div>
                                <div className="flex justify-between text-emerald-600 text-lg font-bold">
                                    <span>{t('freelance_mockup_invoice_total')}</span><span>$700</span>
                                </div>
                                {/* Zig-zag bottom edge illusion */}
                                <div className="absolute -bottom-2 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cGF0aCBkPSJNMCA4IEw0IDAgTDggOCBaIiBmaWxsPSIjRjlGQUZCIiAvPgo8L3N2Zz4=')] bg-repeat-x"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: BENTO ARSENAL */}
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl text-gray-900 mb-4 font-black">{t('freelance_bento_title')}</h2>
                            <p className="text-gray-500 text-lg font-medium">{t('freelance_bento_desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 lg:row-span-2 bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl hover:-translate-y-1 transition flex flex-col justify-between min-h-[300px]">
                                <div className="text-3xl mb-4 font-black select-none">🗂️</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{t('freelance_bento_1_title')}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{t('freelance_bento_1_desc')}</p>
                                </div>
                            </div>
                            <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100 shadow-sm hover:shadow-lg transition">
                                <div className="text-3xl mb-4 font-black select-none">⏱️</div>
                                <h3 className="text-xl font-bold mb-2 text-indigo-950">{t('freelance_bento_2_title')}</h3>
                                <p className="text-indigo-800/70 text-sm font-medium leading-relaxed">{t('freelance_bento_2_desc')}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 shadow-sm hover:shadow-lg transition">
                                <div className="text-3xl mb-4 font-black select-none">🧾</div>
                                <h3 className="text-xl font-bold mb-2 text-emerald-950">{t('freelance_bento_3_title')}</h3>
                                <p className="text-emerald-800/70 text-sm font-medium leading-relaxed">{t('freelance_bento_3_desc')}</p>
                            </div>
                            <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 font-black select-none">🤝</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{t('freelance_bento_4_title')}</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{t('freelance_bento_4_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: CLIENT LIFECYCLE */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 font-bold">
                                        <span className="text-xs text-indigo-400 uppercase tracking-widest">Leads</span>
                                        <span className="text-xl">12</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 scale-105 shadow-xl shadow-indigo-500/10 font-bold">
                                        <span className="text-xs text-indigo-300 uppercase tracking-widest">Ongoing</span>
                                        <span className="text-xl">4</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 font-bold">
                                        <span className="text-xs text-emerald-400 uppercase tracking-widest">Completed</span>
                                        <span className="text-xl">148</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <h2 className="text-5xl md:text-6xl font-black leading-tight">{t('freelance_extra_1_title')}</h2>
                            <p className="text-xl text-slate-400 leading-relaxed italic font-medium">
                                {t('freelance_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SUSTAINABLE INCOME */}
                <section className="py-32 bg-white relative">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 font-black">{t('freelance_extra_2_title')}</h2>
                        <p className="text-xl text-gray-500 leading-relaxed mb-12 font-medium">
                            {t('freelance_extra_2_desc')}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="text-3xl mb-2 font-black select-none">🏖️</div>
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('freelance_extra_2_item_1')}</div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="text-3xl mb-2 font-black select-none">🛡️</div>
                                <div className="text-xs text-slate-400 uppercase font-bold">{t('freelance_extra_2_item_2')}</div>
                            </div>
                            <div className="p-6 bg-indigo-600 rounded-3xl border border-indigo-500 text-white md:col-span-1 col-span-2">
                                <div className="text-3xl mb-2 font-black select-none">💎</div>
                                <div className="text-xs text-indigo-100 uppercase font-bold">{t('freelance_extra_2_item_3')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-slate-900 relative overflow-hidden text-left border-y border-slate-950">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] [background-size:100px_100px]"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden group">
                            
                            <div className="flex flex-col lg:flex-row gap-20 items-center">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500 text-white text-[10px] uppercase tracking-[0.2em] mb-10 shadow-lg font-bold">
                                        🧬 {t('freelance_science_badge')}
                                    </div>

                                    <h2 className="text-5xl md:text-6xl text-white mb-10 leading-tight font-black">
                                        {t('freelance_science_title')}
                                    </h2>

                                    <div className="relative py-10 px-10 bg-indigo-950/50 border-r-8 border-indigo-500 rounded-l-3xl mb-12">
                                        <p className="text-indigo-100 text-xl md:text-2xl font-medium leading-relaxed italic">
                                            "{t('freelance_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition font-bold">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
                                            <span className="text-sm text-slate-300">{t('freelance_science_topic_1')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition font-bold">
                                            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                                            <span className="text-sm text-slate-300">{t('freelance_science_topic_2')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-xl border border-white/5 hover:bg-white/10 transition font-bold">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                            <span className="text-sm text-slate-300">{t('freelance_science_topic_3')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 relative hidden lg:block">
                                    {/* Pipeline Visualization */}
                                    <div className="w-72 h-96 relative">
                                        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-slate-700/50 rounded-full"></div>
                                        
                                        <div className="absolute left-1/2 -translate-x-1/2 top-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg animate-bounce select-none">📦</div>
                                        <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-lg animate-bounce delay-1000 select-none">📁</div>
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-1/4 w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-xl animate-bounce delay-500 select-none font-bold">💰</div>
                                        
                                        <div className="absolute top-10 right-0 w-12 h-px bg-slate-600"></div>
                                        <div className="absolute top-1/3 left-0 w-12 h-px bg-slate-600"></div>
                                        <div className="absolute bottom-1/4 right-0 w-12 h-px bg-slate-600"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 9: FAQ */}
                <section className="py-32 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('freelance_faq_title')}</h2>
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

                {/* SECTION 10: INVOICE-STYLE CTA */}
                <section className="py-24 px-6 bg-gray-50 relative overflow-hidden text-center">
                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="bg-slate-900 rounded-3xl md:rounded-[3rem] p-12 md:p-20 relative shadow-2xl overflow-hidden border border-slate-700 border-t-8 border-t-indigo-500">
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
                            
                            <h2 className="text-6xl md:text-6xl mb-8 text-white tracking-tight font-black">{t('freelance_cta_title')}</h2>
                            <p className="text-slate-400 text-xl md:text-2xl mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                                {t('freelance_cta_desc')}
                            </p>
                            <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-500 transition transform hover:scale-105 shadow-xl shadow-indigo-900/50">
                                {t('freelance_cta_btn')}
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
        </GuestLayout>
    );
}
