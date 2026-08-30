'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FiveAppsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('five_faq_q1'),
            a: t('five_faq_a1')
        },
        {
            q: t('five_faq_q2'),
            a: t('five_faq_a2')
        },
        {
            q: t('five_faq_q3'),
            a: t('five_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="five-apps-compare" className="overflow-x-hidden">
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(var(--tw-rotate, 0deg)); }
                        50% { transform: translateY(-20px) rotate(var(--tw-rotate, 0deg)); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    .animate-float-delayed {
                        animation: float 8s ease-in-out infinite 1s;
                    }
                ` }} />

                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white relative border-b border-slate-100">
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-indigo-100/50 to-purple-100/20 rounded-full blur-2xl -z-10 "></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
                        <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-100">
                                🌌 {t('five_badge')}
                            </div>
                            
                            <h1 className="text-[36px] leading-[1.1] md:text-6xl lg:text-7xl mb-6 text-slate-900 tracking-tight font-black">
                                {t('five_hero_title_1')}<br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{t('five_hero_title_2')}</span>
                            </h1>
                            
                            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('five_hero_desc') }} />
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('five_hero_cta')} →
                                </Link>
                                <p className="py-4 text-sm text-slate-400 font-bold self-center">{t('five_hero_note')}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute top-10 left-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl opacity-40 rotate-12 animate-float">📅</div>
                                <div className="absolute bottom-10 right-20 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl opacity-40 -rotate-12 animate-float-delayed">💰</div>
                                <div className="absolute top-20 right-10 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl opacity-40 rotate-45 animate-float">🌿</div>
                                <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl opacity-40 -rotate-45 animate-float-delayed">📝</div>
                                <div className="absolute top-1/2 left-0 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl opacity-40 rotate-90 animate-float">🎯</div>
                            </div>

                            <div className="relative bg-white/90 p-10 rounded-[3rem] shadow-2xl border border-white w-80 z-20 overflow-hidden transform hover:scale-105 transition duration-500" role="img" aria-label="Tranvas Unified Orb">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
                                
                                <div className="relative z-10 text-center">
                                    <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50 font-black">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4H4v7h7V4zm0 9H4v7h7v-7zm9-9h-7v7h7V4zm0 9h-7v7h7v-7z"/></svg>
                                    </div>
                                    <h3 className="font-black text-2xl text-slate-900 mb-2">{t('five_mockup_title')}</h3>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">{t('five_mockup_desc')}</p>
                                    
                                    <div className="flex items-center justify-center gap-2 bg-indigo-50 py-2 px-4 rounded-full inline-flex">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                                        <span className="text-xs text-indigo-700 uppercase">{t('five_mockup_stat_1')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* MASONRY GRID (THE FRICTION TAX) */}
                <section className="py-[80px] px-6 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-white">{t('five_cycle_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400">{t('five_cycle_desc')}</p>
                        </div>

                        <div className="grid md:grid-cols-12 gap-6 max-w-5xl mx-auto">
                            <div className="md:col-span-8 bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-700/50 hover:bg-slate-800 transition group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left font-black">🏃‍♂️</div>
                                <h3 className="text-2xl font-bold mb-3 text-white">{t('five_cycle_1_title')}</h3>
                                <p className="text-slate-400 leading-relaxed">{t('five_cycle_1_desc')}</p>
                            </div>
                            
                            <div className="md:col-span-4 bg-indigo-600 p-10 rounded-[2.5rem] border border-indigo-500 shadow-2xl shadow-indigo-900/50 relative overflow-hidden group">
                                <div className="absolute -top-4 -right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce z-10">SYNC FAILED</div>
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-4xl mb-6 relative z-10 group-hover:-translate-y-2 transition-transform font-black">🧱</div>
                                <h3 className="text-2xl font-bold mb-3 text-white relative z-10">{t('five_cycle_2_title')}</h3>
                                <p className="text-indigo-100 leading-relaxed relative z-10">{t('five_cycle_2_desc')}</p>
                            </div>

                            <div className="md:col-span-12 bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-700/50 flex flex-col md:flex-row items-center gap-8 hover:border-slate-600 transition group">
                                <div className="text-6xl group-hover:rotate-12 transition-transform font-black">😴</div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">{t('five_cycle_3_title')}</h3>
                                    <p className="text-slate-400 leading-relaxed max-w-3xl">{t('five_cycle_3_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* VERTICAL SPLIT (DIVIDED BY COMPLEXITY) */}
                <section className="py-[80px] px-6 bg-slate-50 overflow-hidden">
                    <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-slate-200 shadow-sm shadow-rose-100 font-black">💔</div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900 max-w-4xl">
                            {t('five_prob_title_1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">{t('five_prob_title_highlight')}</span>.
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-16 max-w-2xl">
                            {t('five_prob_desc')}
                        </p>
                        
                        <div className="w-full bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-rose-400 to-orange-400 left-0"></div>
                            
                            <h4 className="text-xs uppercase tracking-widest text-slate-400 mb-8">The App Stack Graveyard</h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries({'Planner Premium': '$9.99', 'Habit Gold': '$4.99', 'Finance Pro': '$12.99', 'Journal Plus': '$5.99', 'Goal Elite': '$15.99'}).map(([app, price]) => (
                                    <div key={app} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transform hover:-translate-y-2 transition duration-300">
                                        <div className="w-8 h-8 bg-slate-200 rounded-full mb-2"></div>
                                        <span className="text-[10px] font-bold text-slate-600 text-center">{app}</span>
                                        <span className="text-xs font-mono text-rose-500 font-bold">{price}/mo</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center px-4">
                                <div className="text-left mb-4 md:mb-0">
                                    <ul className="text-sm font-bold text-slate-500 space-y-1">
                                        <li>✕ {t('five_prob_point_1')}</li>
                                        <li>✕ {t('five_prob_point_2')}</li>
                                        <li>✕ {t('five_prob_point_3')}</li>
                                    </ul>
                                </div>
                                <div className="text-right bg-rose-50 px-6 py-4 rounded-2xl border border-rose-100">
                                    <span className="block text-[10px] text-rose-400 uppercase tracking-widest mb-1">TOTAL COST</span>
                                    <span className="font-black text-3xl text-rose-600">$49.95<span className="text-lg text-rose-400">/mo</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SIDE-BY-SIDE FLOATING (THE SYNERGY) */}
                <section className="py-[80px] px-6 bg-white overflow-hidden relative">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-slate-100 -z-10 hidden lg:block"></div>

                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24 max-w-3xl mx-auto">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">
                                {t('five_sol_title_1')} <span className="text-indigo-600">{t('five_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">
                                {t('five_sol_desc')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                            <div className="space-y-12">
                                <div>
                                    <h3 className="text-3xl mb-6 text-slate-900 font-black">{t('five_sol_box_title')}</h3>
                                    <p className="text-slate-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('five_sol_box_desc') }} />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0 border border-indigo-100">🌊</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Seamless Transitions</h4>
                                            <p className="text-slate-500 text-sm">Move between life sectors without breaking your focus.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0 border border-indigo-100">🤝</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Cross-Validation</h4>
                                            <p className="text-slate-500 text-sm">Your habits inform your goals. Your goals inform your tasks.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0 border border-indigo-100">🛡️</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">One Secure Home</h4>
                                            <p className="text-slate-500 text-sm">All your data under one roof. No more scattered mental energy.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] rotate-3 transform scale-105 opacity-10"></div>
                                <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl"></div>
                                    
                                    <div className="flex flex-wrap justify-center gap-4 relative z-10 w-full">
                                        {['Habits', 'Goals', 'Money', 'Tasks', 'Notes'].map((feature) => (
                                            <div key={feature} className="px-6 py-3 bg-white/10 rounded-2xl text-sm font-bold text-white border border-white/20 shadow-lg transform hover:scale-110 transition-transform cursor-default">
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-12 bg-white/5 border border-white/10 p-6 rounded-3xl w-full text-center">
                                        <p className="text-xs text-indigo-400 uppercase tracking-widest mb-2">System Status</p>
                                        <p className="text-white font-bold text-xl">100% Synchronized</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CHECKLIST BOARD */}
                <section className="py-[80px] px-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('five_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('five_compare_desc')}</p>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden p-8 md:p-12">
                            <div className="grid grid-cols-12 gap-4 border-b border-slate-100 pb-6 mb-6">
                                <div className="col-span-6 md:col-span-8"></div>
                                <div className="col-span-3 md:col-span-2 text-center text-xs uppercase tracking-widest text-slate-400">{t('five_table_head_2')}</div>
                                <div className="col-span-3 md:col-span-2 text-center text-xs uppercase tracking-widest text-indigo-600">Tranvas</div>
                            </div>

                            <div className="space-y-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="grid grid-cols-12 gap-4 items-center group">
                                        <div className="col-span-6 md:col-span-8">
                                            <h4 className="font-bold text-slate-900 text-sm md:text-base">{t(`five_table_row_${i}_title`)}</h4>
                                            <p className="text-xs text-slate-500 hidden md:block mt-1">{t(`five_table_row_${i}_col_1`)}</p>
                                        </div>
                                        <div className="col-span-3 md:col-span-2 flex justify-center">
                                            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold group-hover:bg-rose-100 group-hover:text-rose-500 transition">✕</span>
                                        </div>
                                        <div className="col-span-3 md:col-span-2 flex justify-center">
                                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition">✓</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SCIENTIFIC PILLAR */}
                <section className="py-[80px] px-6 bg-slate-900 relative overflow-hidden text-white">
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full stroke-indigo-500 fill-none">
                            <path d="M0,50 L20,50 L30,20 L50,80 L70,50 L100,50" strokeWidth="0.1" />
                            <circle cx="30" cy="20" r="1" fill="currentColor" />
                            <circle cx="50" cy="80" r="1" fill="currentColor" />
                        </svg>
                    </div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-[4rem] p-8 md:p-24 relative overflow-hidden group">
                            <div className="grid lg:grid-cols-2 gap-20 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase tracking-[0.4em] mb-12 rounded-full border border-indigo-500/30">
                                        🧬 {t('five_science_badge')}
                                    </div>

                                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-10 tracking-tighter">
                                        {t('five_science_title')}
                                    </h2>

                                    <div className="relative py-12 px-12 bg-white/5 rounded-3xl mb-12 border border-white/10 group-hover:scale-[1.02] transition duration-700">
                                         <div className="absolute -top-6 -right-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-2xl">⚡</div>
                                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-indigo-100 font-light">
                                            "{t('five_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 text-[10px] uppercase tracking-widest text-indigo-400/60">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                            Neural_Synergy_Syncing
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                            Flow_State_Locked
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex justify-center">
                                    <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
                                        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                        <div className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-6xl shadow-[0_0_80px_rgba(79,70,229,0.6)] z-20 relative group-hover:scale-110 transition duration-700 font-black">
                                            ⚛️
                                        </div>
                                        
                                        <div className="absolute inset-0 border border-indigo-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                        <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
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
                            FAQ - Unified Life OS Alternative
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
                <section className="py-[80px] px-6 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                    
                    <div className="max-w-3xl mx-auto text-center relative z-10 bg-white/10 border border-white/20 p-12 md:p-20 rounded-[3rem] shadow-2xl">
                        <h2 className="text-4xl md:text-6xl mb-6 text-white tracking-tight leading-tight font-black" dangerouslySetInnerHTML={{ __html: t.raw('five_cta_title') }} />
                        <p className="text-indigo-100 text-lg md:text-xl mb-10 font-medium leading-relaxed">
                            {t('five_cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-white text-indigo-900 px-10 py-4 rounded-full text-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 shadow-xl font-bold">
                                {t('five_cta_btn')}
                            </Link>
                        </div>
                        <p className="mt-8 text-xs text-indigo-200 font-bold uppercase tracking-[0.2em] opacity-80">{t('five_cta_sub')}</p>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
