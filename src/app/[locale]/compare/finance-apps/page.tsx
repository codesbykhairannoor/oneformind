'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FinanceAppsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('finapp_faq_q1'),
            a: t('finapp_faq_a1')
        },
        {
            q: t('finapp_faq_q2'),
            a: t('finapp_faq_a2')
        },
        {
            q: t('finapp_faq_q3'),
            a: t('finapp_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="finance-apps-compare" className="overflow-x-hidden">
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(400%); }
                    }
                ` }} />

                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-indigo-50/50 relative border-b border-slate-100">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-200/30 to-indigo-200/30 rounded-full blur-2xl -z-10 "></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-emerald-200">
                                💰 {t('finapp_badge')}
                            </div>
                            
                            <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-slate-900 tracking-tight font-black">
                                {t('finapp_hero_title_1')}<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">{t('finapp_hero_title_2')}</span>
                            </h1>
                            
                            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('finapp_hero_desc') }} />
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('finapp_hero_cta')} →
                                </Link>
                                <p className="py-4 text-sm text-slate-400 font-bold self-center">{t('finapp_hero_note')}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            <div className="absolute top-10 right-0 w-64 bg-slate-900 border-4 border-slate-800 rounded-xl p-6 transform rotate-12 opacity-80 shadow-2xl z-0 font-mono">
                                <div className="text-center text-rose-500 text-[10px] mb-2 animate-pulse">⚠️ SYNC ERROR: BANK CONNECTION LOST</div>
                                <div className="space-y-2 opacity-50">
                                    <div className="h-2 bg-slate-700 rounded w-full"></div>
                                    <div className="h-2 bg-slate-700 rounded w-[80%]"></div>
                                    <div className="h-2 bg-slate-700 rounded w-[90%]"></div>
                                </div>
                                <div className="mt-4 bg-slate-800 p-2 rounded text-center">
                                    <p className="text-[8px] text-slate-500">RE-ENTER PASSWORD TO VIEW DATA</p>
                                </div>
                            </div>

                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Finance Card">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">💵</div>
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">{t('finapp_mockup_status')}</span>
                                </div>
                                <h3 className="font-black text-2xl text-slate-900 mb-2">{t('finapp_mockup_title')}</h3>
                                <p className="text-slate-400 text-sm mb-6">{t('finapp_mockup_desc')}</p>
                                
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                                         <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
                                         <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-emerald-200">✓</div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{t('finapp_mockup_stat_1')}</p>
                                        <p className="text-xs text-emerald-600 font-bold">{t('finapp_mockup_stat_2')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] px-6 bg-gray-50 border-b border-gray-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('explore_more_alt')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('explore_more_desc')}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/compare/ynab" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-black">📈</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs YNAB</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_ynab_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/wallet" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">💳</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs Wallet App</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_wallet_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/spendee" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">📊</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs Spendee</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_spendee_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* HORIZONTAL FLOWCHART (THE TRAP) */}
                <section className="py-[80px] px-6 bg-slate-50 relative overflow-hidden border-b border-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">{t('finapp_cycle_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('finapp_cycle_desc')}</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-5xl mx-auto relative">
                            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-emerald-200 via-rose-200 to-indigo-200 -z-10 transform -translate-y-1/2"></div>

                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full md:w-1/3 text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 mx-auto bg-emerald-50 border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md mb-4">🔗</div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{t('finapp_cycle_1_title')}</h3>
                                <p className="text-slate-500 text-sm">{t('finapp_cycle_1_desc')}</p>
                            </div>
                            
                            <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 shadow-inner w-full md:w-1/3 text-center relative z-10 transform md:scale-110">
                                <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] px-2 py-1 rounded-full shadow-sm animate-pulse">DANGER</div>
                                <div className="w-16 h-16 mx-auto bg-rose-100 border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md mb-4">🙈</div>
                                <h3 className="font-bold text-lg text-rose-900 mb-2">{t('finapp_cycle_2_title')}</h3>
                                <p className="text-rose-700/80 text-sm">{t('finapp_cycle_2_desc')}</p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full md:w-1/3 text-center relative z-10 hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 mx-auto bg-indigo-50 border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md mb-4">💥</div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{t('finapp_cycle_3_title')}</h3>
                                <p className="text-slate-500 text-sm">{t('finapp_cycle_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TEXT WITH CSS PIE CHART (THE PROBLEM) */}
                <section className="py-[80px] px-6 bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 animate-in slide-in-from-bottom-12 fade-in duration-1000">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-rose-100 font-black">🛡️</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">
                                {t('finapp_prob_title_1')} <span className="text-rose-500 decoration-rose-200 underline decoration-4 underline-offset-4">{t('finapp_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('finapp_prob_desc')}
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-1">✕</span>
                                    <p className="text-slate-700 font-medium">{t('finapp_prob_point_1')}</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-1">✕</span>
                                    <p className="text-slate-700 font-medium">{t('finapp_prob_point_2')}</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-1">✕</span>
                                    <p className="text-slate-700 font-medium">{t('finapp_prob_point_3')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border border-slate-100 animate-in slide-in-from-right-12 fade-in duration-1000 delay-200">
                            <h4 className="absolute top-8 text-xs uppercase tracking-widest text-slate-400 text-center w-full">Your "Automated" Reality</h4>
                            
                            <div className="relative w-48 h-48 rounded-full shadow-inner border-8 border-white mb-8" style={{ background: 'conic-gradient(#f43f5e 0% 30%, #e2e8f0 30% 100%)' }}>
                                <div className="absolute inset-4 bg-slate-50 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-3xl text-rose-500 font-black">30%</span>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-600 mb-8 text-center px-8">Only 30% of automated transactions are categorized correctly without your intervention.</p>
                            
                            <div className="w-3/4 space-y-3">
                                 <div className="bg-white border-l-4 border-rose-500 p-3 rounded-r-xl shadow-sm flex justify-between items-center text-xs">
                                     <span className="font-bold text-slate-700">Bank 1 Sync Error</span>
                                     <span className="text-rose-500">Fix now</span>
                                 </div>
                                 <div className="bg-white border-l-4 border-amber-500 p-3 rounded-r-xl shadow-sm flex justify-between items-center text-xs opacity-75">
                                     <span className="font-bold text-slate-700">Uncategorized: $450</span>
                                     <span className="text-amber-500">Review</span>
                                 </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STACKED CARDS (THE SOLUTION) */}
                <section className="py-[80px] px-6 bg-slate-900 overflow-hidden text-white relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <div className="inline-block p-4 bg-emerald-500/20 text-emerald-400 rounded-full mb-6">
                                💎
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                                {t('finapp_sol_title_1')} <span className="text-emerald-400">{t('finapp_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400">
                                {t('finapp_sol_desc')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
                            <div className="lg:col-span-7 bg-white/5 border border-white/10 p-10 md:p-12 rounded-[3rem] ">
                                <h3 className="text-3xl mb-6 font-black">{t('finapp_sol_box_title')}</h3>
                                <p className="text-slate-300 text-lg leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: t.raw('finapp_sol_box_desc') }} />
                                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Method</span>
                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Result</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black">Mindful Entry</span>
                                        <span className="font-black text-lg">Total Privacy</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                                <div className="bg-emerald-500 p-8 rounded-[2.5rem] transform transition hover:translate-x-2">
                                    <div className="text-3xl mb-4 font-black">🧠</div>
                                    <h4 className="font-black text-emerald-950 text-xl mb-2">Immediate Awareness</h4>
                                    <p className="text-emerald-900/80 text-sm">Feel every dollar that leaves your pocket. Stop the leaks.</p>
                                </div>
                                <div className="bg-indigo-600 p-8 rounded-[2.5rem] transform transition hover:translate-x-2">
                                    <div className="text-3xl mb-4 font-black">🔒</div>
                                    <h4 className="font-black text-white text-xl mb-2">Zero Bank Data Storage</h4>
                                    <p className="text-indigo-200 text-sm">We don't want your bank credentials. Total security by design.</p>
                                </div>
                                <div className="bg-white/10 border border-white/10 p-8 rounded-[2.5rem] transform transition hover:translate-x-2">
                                    <div className="text-3xl mb-4 font-black">⚡</div>
                                    <h4 className="font-black text-white text-xl mb-2">Synchronized with Goals</h4>
                                    <p className="text-slate-400 text-sm">Your finances tied directly to your life milestones.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EXPANDABLE/LIST COMPARISON */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('finapp_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('finapp_compare_desc')}</p>
                        </div>

                        <div className="space-y-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 h-full w-2 bg-emerald-500"></div>
                                    
                                    <h3 className="text-2xl text-slate-900 mb-8 pl-4 font-bold">
                                        {t(`finapp_table_row_${i}_title`)}
                                    </h3>
                                    
                                    <div className="grid md:grid-cols-2 gap-8 pl-4">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-2">The Traditional Way</span>
                                            <p className="text-slate-500 font-medium italic">
                                                "{t(`finapp_table_row_${i}_col_1`)}"
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                                            <span className="text-[10px] uppercase tracking-widest text-emerald-600 block mb-2 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tranvas
                                            </span>
                                            <p className="text-emerald-950 font-bold">
                                                {t(`finapp_table_row_${i}_col_2`)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SCIENTIFIC PILLAR */}
                <section className="py-[80px] px-6 bg-slate-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="bg-white border-2 border-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-mono tracking-[0.3em] mb-10 rounded-full">
                                        🧬 {t('finapp_science_badge')}
                                    </div>

                                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-8">
                                        {t('finapp_science_title')}
                                    </h2>

                                    <div className="relative py-8 px-8 bg-slate-950 rounded-2xl mb-10 border border-slate-800">
                                        <div className="flex gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        </div>
                                        <p className="text-emerald-400 font-mono text-lg leading-relaxed italic">
                                            "// {t('finapp_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Methodology</p>
                                            <p className="text-sm font-bold text-slate-900">Kakeibo</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Economics</p>
                                            <p className="text-sm font-bold text-slate-900">Behavioral</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Focus</p>
                                            <p className="text-sm font-bold text-slate-900">Mindfulness</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 transform rotate-2 group-hover:rotate-0 transition duration-700">
                                        <div className="space-y-6">
                                            <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                                            <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                                            <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                                            <div className="pt-6 border-t border-slate-200">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase mb-1">Wealth_Integrity</p>
                                                        <p className="text-2xl text-slate-900 font-bold">99.9% Reliable</p>
                                                    </div>
                                                    <div className="text-4xl font-black">📊</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl shadow-xl transform group-hover:scale-110 transition font-black">💎</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Finance Apps Alternative
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} size={20} />
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
                <section className="py-[80px] px-6 bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/20 rounded-full blur-2xl -z-0"></div>
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl text-4xl mb-10 border border-white/10 shadow-2xl font-black">⚡</div>
                        <h2 className="text-5xl md:text-7xl mb-8 text-white tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('finapp_cta_title') }} />
                        <p className="text-slate-400 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                            {t('finapp_cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link href="/register" className="w-full sm:w-auto bg-emerald-500 text-slate-950 px-12 py-5 rounded-full text-xl hover:bg-emerald-400 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(16,185,129,0.3)] font-bold">
                                {t('finapp_cta_btn')}
                            </Link>
                            <Link href="/features/finance" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full text-xl hover:bg-white/10 transition font-bold">
                                Explore Finance OS
                            </Link>
                        </div>
                        <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">{t('finapp_cta_sub')}</p>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
