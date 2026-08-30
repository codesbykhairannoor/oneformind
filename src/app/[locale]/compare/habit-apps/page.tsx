'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function HabitAppsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('habitap_faq_q1'),
            a: t('habitap_faq_a1')
        },
        {
            q: t('habitap_faq_q2'),
            a: t('habitap_faq_a2')
        },
        {
            q: t('habitap_faq_q3'),
            a: t('habitap_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="habit-apps-compare" className="overflow-x-hidden">
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.8; }
                    }
                    .animate-pulse-slow {
                        animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                ` }} />

                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 relative border-b border-gray-100">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl -z-10 "></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-green-200">
                                🌱 {t('habitap_badge')}
                            </div>
                            
                            <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                                {t('habitap_hero_title_1')}<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('habitap_hero_title_2')}</span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('habitap_hero_desc') }} />
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('habitap_hero_cta')} →
                                </Link>
                                <p className="py-4 text-sm text-gray-400 font-bold self-center">{t('habitap_hero_note')}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            <div className="absolute top-10 right-0 w-64 bg-gray-900 border-4 border-gray-800 rounded-xl p-6 transform rotate-12 opacity-80 shadow-2xl z-0 font-mono">
                                <div className="text-center text-red-500 text-xs mb-2 animate-pulse">💔 STREAK BROKEN</div>
                                <div className="flex justify-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gray-700 rounded-sm"></div>
                                    <div className="w-8 h-8 bg-gray-700 rounded-sm"></div>
                                    <div className="w-8 h-8 bg-transparent border-2 border-dashed border-gray-700 rounded-sm"></div>
                                </div>
                                <div className="bg-red-900/50 p-2 rounded text-center border border-red-900">
                                    <p className="text-red-400 text-[10px] uppercase">Level Down</p>
                                    <p className="text-white font-bold">-50 XP</p>
                                </div>
                            </div>

                            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-80 z-20 transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Growth Card">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{t('habitap_mockup_status')}</span>
                                </div>
                                <h3 className="font-black text-2xl text-gray-900 mb-2">{t('habitap_mockup_title')}</h3>
                                <p className="text-gray-400 text-sm mb-6">{t('habitap_mockup_desc')}</p>
                                
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="relative w-16 h-16 shrink-0">
                                         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                                            <path className="text-indigo-600 drop-shadow-lg" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-900">1%</div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{t('habitap_mockup_stat_1')}</p>
                                        <p className="text-xs text-gray-400">{t('habitap_mockup_stat_2')}</p>
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
                            <Link href="/compare/habitica" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-black">⚔️</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">vs Habitica</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_habitica_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/streaks" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl font-black">🔗</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-orange-600 transition-colors">vs Streaks</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_streaks_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/habitify" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">📱</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs Habitify</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_habitify_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* THE CYCLE -> THE GAMIFICATION TRAP */}
                <section className="py-[80px] bg-white relative overflow-hidden border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">{t('habitap_cycle_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('habitap_cycle_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-yellow-300 transition duration-300 relative group md:rotate-[-4deg] hover:rotate-0 z-10">
                                <div className="text-5xl mb-6 text-center group-hover:scale-125 transition duration-500 font-black">🎮</div>
                                <h3 className="text-xl font-bold mb-3 text-center text-gray-900">{t('habitap_cycle_1_title')}</h3>
                                <p className="text-gray-500 text-sm text-center leading-relaxed">{t('habitap_cycle_1_desc')}</p>
                            </div>
                            
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-xl transition duration-300 relative group z-20 md:scale-110">
                                <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">STREAK LOST!</div>
                                <div className="text-5xl mb-6 text-center group-hover:scale-125 transition duration-500 font-black">😱</div>
                                <h3 className="text-xl font-bold mb-3 text-center text-gray-900">{t('habitap_cycle_2_title')}</h3>
                                <p className="text-gray-500 text-sm text-center leading-relaxed">{t('habitap_cycle_2_desc')}</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-400 transition duration-300 relative group md:rotate-[4deg] hover:rotate-0 z-10">
                                <div className="text-5xl mb-6 text-center group-hover:scale-125 transition duration-500 font-black">🏳️</div>
                                <h3 className="text-xl font-bold mb-3 text-center text-gray-900">{t('habitap_cycle_3_title')}</h3>
                                <p className="text-gray-500 text-sm text-center leading-relaxed">{t('habitap_cycle_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE PROBLEM -> STREAK ANXIETY */}
                <section className="py-[80px] bg-gray-50 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 animate-in slide-in-from-bottom-12 fade-in duration-1000">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">⛓️</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                                {t('habitap_prob_title_1')} <span className="text-red-600 decoration-red-200 underline decoration-4 underline-offset-4">{t('habitap_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500 mb-8">
                                {t('habitap_prob_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-gray-600">
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                    {t('habitap_prob_point_1')}
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                    {t('habitap_prob_point_2')}
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                    {t('habitap_prob_point_3')}
                                </li>
                            </ul>
                        </div>

                        <div className="order-1 lg:order-2 relative h-[500px] flex items-center justify-center animate-in slide-in-from-right-12 fade-in duration-1000 delay-200">
                            <div className="relative w-80 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-gray-800">October</span>
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">1 Day Missed</span>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                                    {[...Array(20)].map((_, idx) => (
                                        <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center ${idx + 1 === 17 ? 'bg-red-500 text-white shadow-lg shadow-red-300 scale-110' : 'bg-green-100 text-green-700'}`}>
                                            {idx + 1}
                                        </div>
                                    ))}
                                    <div className="col-span-7 mt-2 h-0.5 bg-gray-100"></div>
                                    {[...Array(8)].map((_, idx) => (
                                        <div key={idx + 21} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 opacity-50">
                                            {idx + 21}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[110%] bg-white border border-red-100 p-4 rounded-xl shadow-2xl text-center transform rotate-3">
                                    <p className="text-gray-900 font-bold mb-1">💀 Streak Reset to 0</p>
                                    <p className="text-xs text-gray-500">You lost your 45-day progress.</p>
                                    <button className="mt-3 w-full bg-gray-100 text-gray-400 text-xs py-2 rounded font-bold cursor-not-allowed">Repair (Paid)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE SOLUTION -> ATOMIC GROWTH */}
                <section className="py-[80px] bg-indigo-50/50 border-y border-indigo-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <div className="inline-block p-4 bg-white rounded-full shadow-md mb-6 animate-bounce">
                                🌱
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-gray-900">
                                {t('habitap_sol_title_1')} <span className="text-indigo-600">{t('habitap_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">
                                {t('habitap_sol_desc')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-indigo-50 hover:-translate-y-2 transition duration-300">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">🍃</div>
                                <h3 className="font-bold text-xl text-gray-900 mb-3">{t('habitap_sol_1_title')}</h3>
                                <p className="text-gray-500 leading-relaxed">{t('habitap_sol_1_desc')}</p>
                            </div>

                            <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-200 text-white transform md:scale-105 relative z-10">
                                <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl font-black">🔗</div>
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-6">🧠</div>
                                <h3 className="font-bold text-xl mb-3">{t('habitap_sol_2_title')}</h3>
                                <p className="text-indigo-100 leading-relaxed">{t('habitap_sol_2_desc')}</p>
                                <div className="mt-6 pt-6 border-t border-indigo-500/50 flex flex-wrap items-center gap-3">
                                     <span className="text-xs bg-indigo-800 px-2 py-1 rounded">Habits</span>
                                     <span className="text-xs text-indigo-300">+</span>
                                     <span className="text-xs bg-indigo-800 px-2 py-1 rounded">Goals</span>
                                     <span className="text-xs text-indigo-300">=</span>
                                     <span className="text-xs font-bold">System</span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-indigo-50 hover:-translate-y-2 transition duration-300">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">📊</div>
                                <h3 className="font-bold text-xl text-gray-900 mb-3">{t('habitap_sol_3_title')}</h3>
                                <p className="text-gray-500 leading-relaxed">{t('habitap_sol_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMPARISON -> GAME VS LIFE */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-6">{t('habitap_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('habitap_compare_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-900 p-10 rounded-3xl border-4 border-gray-800 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(50,50,50,1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                                <h3 className="text-gray-400 font-mono text-sm mb-8 uppercase tracking-widest text-center">{t('habitap_table_head_2')}</h3>
                                
                                <div className="space-y-6 font-mono text-sm">
                                    <div className="flex items-center justify-between text-red-400 grayscale opacity-70">
                                        <span>👾 {t('habitap_table_row_1_title')}</span>
                                        <span>{t('habitap_table_row_1_col_1')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-red-400 grayscale opacity-70">
                                        <span>📉 {t('habitap_table_row_2_title')}</span>
                                        <span>{t('habitap_table_row_2_col_1')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-red-400 grayscale opacity-70">
                                        <span>🥀 {t('habitap_table_row_3_title')}</span>
                                        <span>{t('habitap_table_row_3_col_1')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-10 rounded-3xl border border-indigo-100 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-4 py-2 rounded-bl-2xl">RECOMMENDED</div>
                                <h3 className="text-indigo-900 font-bold text-sm mb-8 uppercase tracking-widest text-center">Tranvas</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('habitap_table_row_1_title')}</span>
                                        <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm text-right">{t('habitap_table_row_1_col_2')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('habitap_table_row_2_title')}</span>
                                        <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm text-right">{t('habitap_table_row_2_col_2')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm md:text-base">
                                        <span className="font-bold text-gray-900">{t('habitap_table_row_3_title')}</span>
                                        <span className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm text-right">{t('habitap_table_row_3_col_2')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SCIENTIFIC PILLAR */}
                <section className="py-[80px] bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="10" cy="10" r="2" fill="#4f46e5" />
                            <circle cx="30" cy="40" r="3" fill="#4f46e5" />
                            <circle cx="70" cy="20" r="1.5" fill="#4f46e5" />
                            <circle cx="90" cy="80" r="4" fill="#4f46e5" />
                            <path d="M10 10 Q 30 40 70 20" stroke="#4f46e5" strokeWidth="0.1" fill="none" />
                            <path d="M30 40 Q 50 60 90 80" stroke="#4f46e5" strokeWidth="0.1" fill="none" />
                        </svg>
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="relative order-2 lg:order-1">
                                <div className="relative w-full aspect-square max-w-[400px] mx-auto">
                                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse-slow"></div>
                                    <div className="absolute inset-10 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-8 border-white">
                                        <span className="text-5xl mb-2 font-black">🧬</span>
                                        <p className="font-black text-xs uppercase tracking-widest text-indigo-200">Neural Pathway</p>
                                    </div>
                                    <div className="absolute top-0 right-10 w-16 h-16 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl animate-bounce">🌱</div>
                                    <div className="absolute bottom-10 left-0 w-12 h-12 bg-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xl animate-bounce delay-700">🧠</div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950 text-indigo-100 text-[10px] uppercase tracking-[0.3em] mb-10 rounded-full">
                                    🧬 {t('habitap_science_badge')}
                                </div>

                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">
                                    {t('habitap_science_title')}
                                </h2>

                                <div className="relative py-10 px-10 bg-gray-50 rounded-[3rem] mb-12 border-l-8 border-indigo-600">
                                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-700 font-serif italic">
                                        "{t('habitap_science_desc')}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 shadow-sm">Basal Ganglia Focus</span>
                                    <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 shadow-sm">Dopamine Regulation</span>
                                    <span className="px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-500 shadow-sm">Neuroplasticity</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="py-[80px] bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-8">{t('habitap_how_it_works_title')}</h2>
                        <div style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-600">
                            <p>{t('habitap_how_it_works_desc')}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Habit Apps Alternative
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
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-t from-indigo-100 via-purple-50 to-white rounded-t-full -z-10"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-indigo-200 to-transparent rounded-t-full blur-2xl -z-10"></div>
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-5xl md:text-7xl mb-8 text-indigo-950 tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('habitap_cta_title') }} />
                        <p className="text-indigo-900/60 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                            {t('habitap_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl hover:bg-indigo-700 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] font-bold">
                            {t('habitap_cta_btn')}
                        </Link>
                        <p className="mt-8 text-sm text-indigo-400 font-bold uppercase tracking-widest">{t('habitap_cta_sub')}</p>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
