'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function CustomAppsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('blank_faq_q1'),
            a: t('blank_faq_a1')
        },
        {
            q: t('blank_faq_q2'),
            a: t('blank_faq_a2')
        },
        {
            q: t('blank_faq_q3'),
            a: t('blank_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="custom-apps-compare" className="overflow-x-hidden">
                {/* SECTION 1: HEADER */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative border-b border-gray-100">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl -z-10 "></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        
                        <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-orange-200">
                                ⚠️ {t('blank_badge')}
                            </div>
                            
                            <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                                {t('blank_hero_title_1')}<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('blank_hero_title_2')}</span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('blank_hero_desc') }} />
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('blank_hero_cta')} →
                                </Link>
                                <p className="py-4 text-sm text-gray-400 font-bold self-center">{t('blank_hero_note')}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            
                            <div className="absolute top-10 right-10 w-72 h-64 bg-gray-50 border border-gray-200 rounded-xl p-4 transform rotate-6 opacity-60 shadow-lg z-0 flex flex-col gap-2">
                                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="flex gap-2">
                                    <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                    <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                    <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                    <div className="w-full h-8 border border-gray-200 bg-white rounded"></div>
                                </div>
                                <div className="absolute bottom-4 right-4 text-gray-300 font-mono text-xs">#REF! ERROR</div>
                            </div>

                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Zero-Configuration Dashboard: Displaying an automated monthly overview with budget usage and performance insights.">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">📊</div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{t('blank_mockup_status')}</span>
                                </div>
                                <h3 className="font-black text-2xl text-gray-900 mb-2">{t('blank_mockup_title')}</h3>
                                <p className="text-gray-400 text-sm mb-6">{t('blank_mockup_subtitle')}</p>
                                
                                <div className="space-y-4">
                                     <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-gray-600">
                                        <span>{t('blank_mockup_stat_1')}</span>
                                        <span className="text-indigo-600">75%</span>
                                    </div>
                                     <div className="flex items-center gap-3 text-sm font-bold text-indigo-600 bg-indigo-50 p-3 rounded-xl">
                                        <span className="animate-pulse">●</span> {t('blank_mockup_insight')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-12 bg-gray-50 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900">Explore Other Custom App Alternatives</h2>
                            <p className="text-gray-500 mt-2">See how Tranvas replaces other popular workspace tools.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/compare/spreadsheet" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📊</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Spreadsheet Alternative</h3>
                                    <p className="text-sm text-gray-500">Stop building trackers from scratch.</p>
                                </div>
                            </Link>
                            <Link href="/compare/notion" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 text-gray-800 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">📝</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Notion Alternative</h3>
                                    <p className="text-sm text-gray-500">Escape the infinite setup loop.</p>
                                </div>
                            </Link>
                            <Link href="/compare/obsidian" className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">🧠</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Obsidian Alternative</h3>
                                    <p className="text-sm text-gray-500">Actionable structure over linked chaos.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: REDESIGN - THE CYCLE */}
                <section className="py-[80px] bg-white px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-16 md:flex md:items-end md:justify-between">
                            <div className="max-w-2xl">
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('blank_cycle_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('blank_cycle_desc')}</p>
                            </div>
                            <div className="hidden md:block text-5xl text-gray-200 rotate-90 font-black">⤵</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]">
                            <div className="md:col-span-7 bg-gradient-to-br from-purple-50 to-white p-10 rounded-[2.5rem] border border-purple-100 relative overflow-hidden group hover:border-purple-300 transition-all duration-300">
                                <div className="absolute top-0 right-0 bg-purple-100 w-32 h-32 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white text-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 font-black">✨</div>
                                    <h3 className="text-2xl mb-3 text-gray-900 font-bold">{t('blank_cycle_1_title')}</h3>
                                    <p className="text-gray-500 leading-relaxed">{t('blank_cycle_1_desc')}</p>
                                </div>
                            </div>

                            <div className="md:col-span-5 row-span-2 bg-gray-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px]"></div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-14 h-14 bg-gray-800 text-white rounded-2xl flex items-center justify-center text-3xl border border-gray-700 mb-6 font-black">🤯</div>
                                        <h3 className="text-2xl mb-3 font-bold">{t('blank_cycle_2_title')}</h3>
                                        <p className="text-gray-400 leading-relaxed">{t('blank_cycle_2_desc')}</p>
                                    </div>
                                    <div className="mt-8 p-4 bg-gray-800/50 rounded-2xl border border-gray-700 ">
                                        <div className="flex gap-2 mb-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                            <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-7 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-lg shadow-gray-100 relative group hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                    <div className="w-14 h-14 shrink-0 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-3xl font-black">🏚️</div>
                                    <div>
                                        <h3 className="text-2xl mb-2 text-gray-900 font-bold">{t('blank_cycle_3_title')}</h3>
                                        <p className="text-gray-500 leading-relaxed">{t('blank_cycle_3_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: REDESIGN - THE PROBLEM */}
                <section className="py-[80px] px-6 bg-gray-950 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            
                            <div className="order-2 lg:order-2 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-900 rounded-[2rem] transform rotate-3 scale-95 opacity-50"></div>
                                <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-[2rem] shadow-2xl">
                                    <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded w-24"></div>
                                    </div>
                                    <div className="space-y-4">
                                        {[100, 80, 60, 40].map((opacity, i) => (
                                            <div key={i} className={`flex items-center gap-4 opacity-${opacity}`}>
                                                <div className="w-6 h-6 border-2 border-gray-700 rounded bg-transparent"></div>
                                                <div className="flex-1 h-3 bg-gray-800 rounded"></div>
                                                <div className="w-16 h-3 bg-red-900/50 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="absolute -top-6 -right-6 bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-900/50 transform rotate-12">
                                        {t('blank_chaos_badge')}
                                    </div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-1">
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-8 text-white">
                                    {t('blank_prob_title_1')} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{t('blank_prob_title_highlight')}</span>.
                                </h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-400 mb-10 border-l-4 border-gray-800 pl-6">
                                    {t('blank_prob_desc')}
                                </p>
                                <div className="grid gap-6">
                                    <div className="flex items-start gap-4">
                                        <span className="text-red-500 text-xl mt-1">✕</span>
                                        <p className="text-gray-300 font-medium">{t('blank_prob_point_1')}</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="text-red-500 text-xl mt-1">✕</span>
                                        <p className="text-gray-300 font-medium">{t('blank_prob_point_2')}</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <span className="text-red-500 text-xl mt-1">✕</span>
                                        <p className="text-gray-300 font-medium">{t('blank_prob_point_3')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: REDESIGN - THE SOLUTION */}
                <section className="py-[80px] px-6 bg-indigo-50/30 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <div className="inline-block p-3 bg-indigo-100 rounded-2xl mb-6">
                                <span className="text-3xl font-black">💎</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                                {t('blank_sol_title_1')} <span className="text-indigo-600 underline decoration-wavy decoration-indigo-200">{t('blank_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('blank_sol_desc')}</p>
                        </div>

                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 border border-gray-200 p-8 md:p-12 relative overflow-hidden">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="bg-indigo-50 rounded-3xl p-8 mb-8 border border-indigo-100">
                                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                            💡 {t('blank_sol_box_title')}
                                        </h4>
                                        <p className="text-indigo-800/70 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('blank_sol_box_desc') }} />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition">💰</div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{t('blank_hub_finance')}</h5>
                                                <p className="text-sm text-gray-400">Automated tracking</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition">⚡</div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{t('blank_hub_focus')}</h5>
                                                <p className="text-sm text-gray-400">{t('blank_hub_ready')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">🧠</div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{t('blank_hub_system')}</h5>
                                                <p className="text-sm text-gray-400">{t('blank_hub_automated')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[400px] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-300 z-20 relative">
                                        <span className="text-4xl text-white font-black">OFM</span>
                                    </div>
                                    
                                    <div className="absolute w-64 h-64 border border-gray-300 rounded-full animate-[spin_10s_linear_infinite]">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center">💰</div>
                                    </div>
                                    <div className="absolute w-80 h-80 border border-gray-200 rounded-full animate-[spin_15s_linear_infinite_reverse]">
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center">🧠</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: REDESIGN - COMPARISON */}
                <section className="py-[80px] px-6 bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900">{t('blank_compare_title')}</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-0 items-stretch">
                            <div className="bg-gray-50 p-10 rounded-3xl md:rounded-r-none border border-gray-200 md:border-r-0">
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">{t('blank_table_head_2')}</h3>
                                <ul className="space-y-8">
                                    <li className="flex items-center justify-between opacity-50 grayscale">
                                        <span className="font-medium text-gray-900">{t('blank_table_row_1_title')}</span>
                                        <span className="text-sm font-bold">{t('blank_table_row_1_col_1')}</span>
                                    </li>
                                    <li className="flex items-center justify-between opacity-50 grayscale">
                                        <span className="font-medium text-gray-900">{t('blank_table_row_2_title')}</span>
                                        <span className="text-sm font-bold">{t('blank_table_row_2_col_1')}</span>
                                    </li>
                                    <li className="flex items-center justify-between opacity-50 grayscale">
                                        <span className="font-medium text-gray-900">{t('blank_table_row_3_title')}</span>
                                        <span className="text-sm font-bold">{t('blank_table_row_3_col_1')}</span>
                                    </li>
                                    <li className="flex items-center justify-between opacity-50 grayscale">
                                        <span className="font-medium text-gray-900">{t('blank_table_row_4_title')}</span>
                                        <span className="text-sm font-bold">{t('blank_table_row_4_col_1')}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-indigo-900 p-10 rounded-3xl md:rounded-l-none border border-indigo-900 text-white relative shadow-2xl transform md:scale-105 z-10">
                                <div className="absolute top-0 right-0 bg-white/10 px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">Recommended</div>
                                <h3 className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-8">Tranvas</h3>
                                <ul className="space-y-8">
                                    <li className="flex items-center justify-between border-b border-indigo-800 pb-4">
                                        <span className="font-medium text-indigo-100">{t('blank_table_row_1_title')}</span>
                                        <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_1_col_2')}</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-indigo-800 pb-4">
                                        <span className="font-medium text-indigo-100">{t('blank_table_row_2_title')}</span>
                                        <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_2_col_2')}</span>
                                    </li>
                                    <li className="flex items-center justify-between border-b border-indigo-800 pb-4">
                                        <span className="font-medium text-indigo-100">{t('blank_table_row_3_title')}</span>
                                        <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_3_col_2')}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span className="font-medium text-indigo-100">{t('blank_table_row_4_title')}</span>
                                        <span className="font-black text-white bg-indigo-700 px-3 py-1 rounded-lg">{t('blank_table_row_4_col_2')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION: SCIENTIFIC PILLAR */}
                <section className="py-[80px] px-6 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50 opacity-50"></div>
                    <div className="absolute top-1/4 left-0 w-full h-px bg-slate-200/50"></div>
                    <div className="absolute top-2/4 left-0 w-full h-px bg-slate-200/50"></div>
                    <div className="absolute top-3/4 left-0 w-full h-px bg-slate-200/50"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-8 md:p-20 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-8 right-8 flex gap-2">
                                <div className="w-2 h-12 bg-emerald-500 rounded-full opacity-20"></div>
                                <div className="w-2 h-10 bg-indigo-500 rounded-full opacity-20"></div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-20 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-[0.4em] mb-12 rounded-full border border-emerald-200">
                                        🧬 {t('blank_science_badge')}
                                    </div>

                                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">
                                        {t('blank_science_title')}
                                    </h2>

                                    <div className="relative py-12 px-12 bg-slate-50 rounded-3xl mb-12 border border-slate-100 group-hover:rotate-1 transition duration-500">
                                         <span className="absolute -top-4 -right-4 text-4xl font-black">🧪</span>
                                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-600 font-light">
                                            "{t('blank_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-6">
                                        <span className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Decision_Fatigue_Defense == true</span>
                                        <span className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-400">Willpower_Preservation_Index.max()</span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-white aspect-video rounded-3xl p-8 border border-slate-200 shadow-lg relative flex flex-col justify-center items-center text-center overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                                        <h3 className="text-5xl text-emerald-600 mb-4 tracking-tighter relative z-10 font-black">∆E = S - F</h3>
                                        <p className="text-slate-400 text-xs font-mono relative z-10">Systemic_Efficiency = Structure - Friction</p>
                                        
                                        <div className="mt-8 flex gap-4 relative z-10">
                                            <div className="w-20 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
                                            <div className="w-16 h-1 bg-slate-200 rounded-full"></div>
                                        </div>
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
                            FAQ - Custom Workspace Apps
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

                {/* SECTION 6: CTA */}
                <section className="py-[80px] px-6 bg-white relative overflow-hidden border-t border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-purple-50 opacity-50"></div>
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <h2 className="text-6xl md:text-8xl mb-8 text-gray-900 tracking-tighter font-black" dangerouslySetInnerHTML={{ __html: t.raw('blank_cta_title') }} />
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
                            <Link href="/register" className="group relative px-12 py-6 bg-gray-900 text-white rounded-full font-bold text-xl overflow-hidden shadow-2xl hover:shadow-gray-400/50 transition-all">
                                <div className="absolute inset-0 w-full h-full bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative z-10">{t('blank_cta_btn')}</span>
                            </Link>
                        </div>
                        <p className="mt-8 text-gray-400 font-medium">{t('blank_cta_sub')}</p>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
