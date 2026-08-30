'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function ManagementToolsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('pm_faq_q1'),
            a: t('pm_faq_a1')
        },
        {
            q: t('pm_faq_q2'),
            a: t('pm_faq_a2')
        },
        {
            q: t('pm_faq_q3'),
            a: t('pm_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="management-tools-compare" className="overflow-x-hidden">
                {/* SECTION 1: HEADER */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative border-b border-gray-100">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl -z-10 "></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-blue-200">
                                🏢 {t('pm_badge')}
                            </div>
                            
                            <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                                {t('pm_hero_title_1')}<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('pm_hero_title_2')}</span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('pm_hero_desc') }} />
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('pm_hero_cta')} →
                                </Link>
                                <p className="py-4 text-sm text-gray-400 font-bold self-center">{t('pm_hero_note')}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            <div className="absolute top-4 right-4 w-72 bg-white border border-slate-200 rounded-xl p-5 transform rotate-6 opacity-70 shadow-xl z-0">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>
                                    </div>
                                    <span className="text-[10px] text-red-500 font-bold font-mono">OVERDUE</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-2/3 mb-4"></div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-red-50 text-red-600 text-[9px] font-bold rounded border border-red-100">BLOCKER</span>
                                </div>
                            </div>

                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Focus Card">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">🎯</div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{t('pm_mockup_status')}</span>
                                </div>
                                <h3 className="font-black text-2xl text-gray-900 mb-2">{t('pm_mockup_title')}</h3>
                                <p className="text-gray-400 text-sm mb-6">{t('pm_mockup_desc')}</p>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span> 
                                        {t('pm_mockup_item_1')}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                         <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span> 
                                        {t('pm_mockup_item_2')}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                                        <span className="animate-pulse">●</span> {t('pm_mockup_item_3')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-8">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900">Explore Other Project Management Alternatives</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500 mt-2">See how Tranvas replaces bloated corporate tools.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/compare/monday" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📊</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Monday Alternative</h3>
                                    <p className="text-sm text-gray-500">Stop managing the management.</p>
                                </div>
                            </Link>
                            <Link href="/compare/trello" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📋</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Trello Alternative</h3>
                                    <p className="text-sm text-gray-500">Beyond simple kanban boards.</p>
                                </div>
                            </Link>
                            <Link href="/compare/asana" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">🦄</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Asana Alternative</h3>
                                    <p className="text-sm text-gray-500">Focus on work, not assigning it.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* THE CYCLE */}
                <section className="py-[80px] bg-white relative">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('pm_cycle_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('pm_cycle_desc')}</p>
                        </div>

                        <div className="relative">
                            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-slate-200 to-red-100 rounded-full"></div>

                            <div className="space-y-12">
                                <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                                    <div className="order-2 md:order-1 md:w-1/2 md:text-right pl-20 md:pl-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pm_cycle_1_title')}</h3>
                                        <p className="text-gray-500">{t('pm_cycle_1_desc')}</p>
                                    </div>
                                    <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 w-16 h-16 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 group-hover:scale-110 transition group-hover:border-blue-500 font-black">
                                        👔
                                    </div>
                                    <div className="order-3 md:w-1/2 hidden md:block"></div>
                                </div>

                                <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                                     <div className="order-3 md:order-1 md:w-1/2 hidden md:block"></div>
                                    <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 w-16 h-16 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 group-hover:scale-110 transition group-hover:border-slate-500 font-black">
                                        📉
                                    </div>
                                    <div className="order-2 md:order-3 md:w-1/2 pl-20 md:pl-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pm_cycle_2_title')}</h3>
                                        <p className="text-gray-500">{t('pm_cycle_2_desc')}</p>
                                    </div>
                                </div>

                                <div className="relative flex flex-col md:flex-row items-center gap-8 group">
                                    <div className="order-2 md:order-1 md:w-1/2 md:text-right pl-20 md:pl-0">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pm_cycle_3_title')}</h3>
                                        <p className="text-gray-500">{t('pm_cycle_3_desc')}</p>
                                    </div>
                                    <div className="absolute left-0 md:relative md:left-auto order-1 md:order-2 w-16 h-16 bg-white border-4 border-red-100 rounded-full flex items-center justify-center text-3xl shadow-lg z-10 group-hover:scale-110 transition group-hover:border-red-500 font-black">
                                        🏃
                                    </div>
                                    <div className="order-3 md:w-1/2 hidden md:block"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE PROBLEM */}
                <section className="py-[80px] bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-2xl"></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-800 bg-red-900/30 text-red-400 text-xs font-mono mb-8">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 mr-1"></span>
                                CRITICAL ERROR
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-white">
                                {t('pm_prob_title_1')} <span className="text-red-500 bg-red-500/10 px-2 rounded">{t('pm_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">
                                {t('pm_prob_desc')}
                            </p>
                            
                            <div className="font-mono text-sm space-y-3">
                                <div className="flex items-center gap-3 text-red-300">
                                    <span>&gt;</span> {t('pm_prob_point_1')}
                                </div>
                                <div className="flex items-center gap-3 text-red-300">
                                    <span>&gt;</span> {t('pm_prob_point_2')}
                                </div>
                                <div className="flex items-center gap-3 text-red-300">
                                    <span>&gt;</span> {t('pm_prob_point_3')}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="h-2 bg-slate-600 rounded w-32"></div>
                                </div>
                                <div className="space-y-4 opacity-50">
                                    <div className="flex gap-4">
                                        <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                        <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                        <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                        <div className="w-1/4 h-24 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                                </div>
                                
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-slate-900 border border-red-500/50 p-4 rounded-lg shadow-2xl z-20 text-center">
                                    <div className="text-3xl mb-2 font-black">📢</div>
                                    <p className="text-white font-bold text-sm">New Notification</p>
                                    <p className="text-xs text-slate-400 mt-1">Jira: Ticket #999 updated by 5 people...</p>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-48 bg-slate-900 border border-slate-600 p-4 rounded-lg shadow-xl z-10 opacity-80">
                                     <div className="h-2 bg-slate-700 rounded w-full mb-2"></div>
                                     <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE SOLUTION */}
                <section className="py-[80px] bg-indigo-50/50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-12 gap-12 items-center">
                            
                            <div className="lg:col-span-4">
                                <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">🚀</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                                    {t('pm_sol_title_1')} <span className="text-indigo-600 bg-indigo-100 px-1">{t('pm_sol_title_highlight')}</span>.
                                </h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500 mb-8">
                                    {t('pm_sol_desc')}
                                </p>
                                <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
                                    <p className="text-indigo-900 font-bold text-sm mb-2">💡 {t('pm_sol_box_title')}</p>
                                    <p className="text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: t.raw('pm_sol_box_desc') }} />
                                </div>
                            </div>

                            <div className="lg:col-span-8 relative">
                                <div className="absolute inset-0 bg-indigo-300 rounded-full blur-2xl opacity-20"></div>
                                
                                <div className="relative bg-white/60 border border-white/50 p-8 rounded-[2.5rem] shadow-2xl">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                                            <div className="text-3xl mb-4 font-black">👤</div>
                                            <h4 className="font-bold text-gray-900">{t('pm_hub_you')}</h4>
                                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                <span>●</span> Active
                                            </div>
                                        </div>

                                        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg text-white hover:-translate-y-1 transition duration-300">
                                            <div className="text-3xl mb-4 font-black">🏔️</div>
                                            <h4 className="font-bold">{t('pm_hub_vision')}</h4>
                                            <p className="text-indigo-100 text-xs mt-2">{t('pm_hub_yours')}</p>
                                        </div>

                                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:-translate-y-1 transition duration-300">
                                            <div className="text-3xl mb-4 font-black">🌱</div>
                                            <h4 className="font-bold text-gray-900">{t('pm_hub_growth')}</h4>
                                            <p className="text-gray-400 text-xs mt-2">{t('pm_hub_private')}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-white/50 p-4 rounded-2xl border border-white/60 text-center">
                                        <p className="text-indigo-900 text-sm font-bold tracking-wide">✨ Everything Connected. Nothing Complicated.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMPARISON */}
                <section className="py-[80px] bg-white border-t border-gray-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-6">{t('pm_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('pm_compare_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50 opacity-70">
                                <h3 className="font-bold text-gray-400 uppercase tracking-widest mb-6">{t('pm_table_head_2')}</h3>
                                <ul className="space-y-6">
                                    <li className="flex items-center justify-between text-gray-500 text-sm md:text-base">
                                        <span>{t('pm_table_row_1_title')}</span>
                                        <span className="text-xs md:text-sm font-mono bg-gray-200 px-2 py-1 rounded">{t('pm_table_row_1_col_1')}</span>
                                    </li>
                                    <li className="flex items-center justify-between text-gray-500 text-sm md:text-base">
                                        <span>{t('pm_table_row_2_title')}</span>
                                        <span className="text-xs md:text-sm font-mono bg-gray-200 px-2 py-1 rounded">{t('pm_table_row_2_col_1')}</span>
                                    </li>
                                    <li className="flex items-center justify-between text-gray-500 text-sm md:text-base">
                                        <span>{t('pm_table_row_3_title')}</span>
                                        <span className="text-xs md:text-sm font-mono bg-gray-200 px-2 py-1 rounded">{t('pm_table_row_3_col_1')}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-8 rounded-3xl border-2 border-indigo-100 bg-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">WINNER</div>
                                <h3 className="font-black text-indigo-900 uppercase tracking-widest mb-6">Tranvas</h3>
                                <ul className="space-y-6">
                                     <li className="flex items-center justify-between text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('pm_table_row_1_title')}</span>
                                        <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-right">{t('pm_table_row_1_col_2')}</span>
                                    </li>
                                    <li className="flex items-center justify-between text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('pm_table_row_2_title')}</span>
                                        <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-right">{t('pm_table_row_2_col_2')}</span>
                                    </li>
                                    <li className="flex items-center justify-between text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('pm_table_row_3_title')}</span>
                                        <span className="text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-right">{t('pm_table_row_3_col_2')}</span>
                                    </li>
                                     <li className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('pm_table_row_4_title')}</span>
                                        <span className="text-xs md:text-sm text-white bg-indigo-600 px-3 py-1 rounded-lg shadow-lg shadow-indigo-200 text-right">{t('pm_table_row_4_col_2')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SCIENTIFIC PILLAR */}
                <section className="py-[80px] bg-slate-50 relative overflow-hidden border-t border-slate-200">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                    <div className="absolute inset-y-0 left-1/4 w-px bg-indigo-100/50"></div>
                    <div className="absolute inset-y-0 left-2/4 w-px bg-indigo-100/50"></div>
                    <div className="absolute inset-y-0 left-3/4 w-px bg-indigo-100/50"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-white border-b-8 border-indigo-600 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-[10px] uppercase tracking-[0.4em] mb-12 rounded-full border border-blue-200">
                                        🧬 {t('pm_science_badge')}
                                    </div>

                                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">
                                        {t('pm_science_title')}
                                    </h2>

                                    <div className="relative py-12 px-12 bg-indigo-50/50 rounded-2xl mb-12 border border-indigo-100 group-hover:bg-indigo-50 transition duration-500">
                                         <span className="absolute -top-4 -left-4 text-4xl font-black">📐</span>
                                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-700 font-medium italic">
                                            "{t('pm_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                            Cognitive Sovereignty Mastery
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                            Administrative Friction Elimination
                                        </div>
                                    </div>
                                </div>

                                <div className="relative order-1 lg:order-2">
                                    <div className="bg-slate-900 aspect-square rounded-[3rem] p-10 flex flex-col justify-between text-white shadow-2xl transform lg:rotate-3 group-hover:rotate-0 transition duration-700">
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-indigo-400 uppercase tracking-widest">Efficiency_Index</p>
                                                <p className="text-3xl font-black">9.8/10</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="h-2 bg-white/10 rounded-full w-full"></div>
                                            <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                                            <div className="h-2 bg-indigo-500 rounded-full w-1/2"></div>
                                        </div>

                                        <p className="text-[10px] text-slate-500 font-mono">system.status == "optimal"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Project Management Alternative
                        </h2>
                        <div className="space-y-4">
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

                {/* CTA */}
                <section className="py-[80px] px-6 bg-white relative overflow-hidden border-t border-gray-100">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-5xl md:text-7xl mb-8 text-indigo-950 tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('pm_cta_title') }} />
                        <p className="text-indigo-900/60 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                            {t('pm_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl hover:bg-indigo-700 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] font-bold">
                            {t('pm_cta_btn')}
                        </Link>
                        <p className="mt-8 text-sm text-indigo-400 font-bold uppercase tracking-widest">{t('pm_cta_sub')}</p>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
