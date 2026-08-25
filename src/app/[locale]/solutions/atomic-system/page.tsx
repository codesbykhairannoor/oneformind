'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionAtomicSystemPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('atomic_faq_q1'),
            a: t('atomic_faq_a1')
        },
        {
            q: t('atomic_faq_q2'),
            a: t('atomic_faq_a2')
        },
        {
            q: t('atomic_faq_q3'),
            a: t('atomic_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-atomic-system" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT - INDIGO) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white relative border-b border-gray-100">
                    <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03] -z-10"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
                    
                    <div className="max-w-5xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        
                        {/* Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-white/80 border border-indigo-100 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-center text-4xl transform -rotate-3 hover:rotate-0 transition duration-300 font-black select-none">
                                🌱
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs mb-6 uppercase tracking-widest border border-indigo-100 shadow-sm">
                            {t('atomic_hero_badge')}
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-[42px] leading-[1.1] md:text-7xl mb-6 text-gray-900 tracking-tight font-black">
                            {t('atomic_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                {t('atomic_hero_title_2')}
                            </span>
                        </h1>
                        
                        {/* Description */}
                        <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
                            {t('atomic_hero_desc')}
                        </p>
                        
                        {/* CTA */}
                        <div className="flex justify-center gap-4 mb-24">
                            <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-lg hover:bg-indigo-700 shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition transform hover:-translate-y-1 font-bold">
                                {t('atomic_hero_cta')}
                            </Link>
                        </div>

                        {/* Visual Card Compounding */}
                        <div className="relative w-full max-w-4xl mx-auto rounded-[2.5rem] bg-white p-3 shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-700">
                            <div className="absolute inset-0 bg-indigo-500 rounded-[2.5rem] blur-2xl opacity-10 -z-10"></div>
                            <div className="bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-gray-100 overflow-hidden relative text-left flex flex-col md:flex-row gap-8 items-center">
                                
                                <div className="flex-1 space-y-4 z-10">
                                    <h4 className="font-black text-gray-900 text-2xl">{t('atomic_mockup_title')}</h4>
                                    <p className="text-gray-500 font-medium">{t('atomic_mockup_desc')}</p>
                                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                        <span className="text-xs font-bold text-gray-700">{t('atomic_mockup_streak')}</span>
                                    </div>
                                </div>

                                <div className="flex-1 w-full relative h-40 border-b-2 border-l-2 border-gray-200 flex items-end justify-between gap-1 px-2 pt-4">
                                    {/* Compounding Indigo Bar Graph */}
                                    {Array.from({ length: 15 }).map((_, idx) => {
                                        const day = idx + 1;
                                        const barHeight = Math.pow(1.18, day) * 2.5;
                                        const opacityClass = Math.min(day * 5 + 20, 100);
                                        return (
                                            <div 
                                                key={idx} 
                                                className="w-full bg-gradient-to-t from-indigo-600 to-purple-400 rounded-t-sm hover:opacity-100 transition-opacity cursor-pointer group relative" 
                                                style={{ height: `${barHeight}px`, opacity: opacityClass / 100 }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20">
                                                    Day {day}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="absolute -right-4 -top-6 bg-white px-4 py-2 rounded-xl shadow-xl font-bold text-indigo-600 text-sm border border-indigo-50 flex items-center gap-2 transform rotate-3 select-none">
                                        {t('atomic_mockup_returns')}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-32 bg-white relative">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl mb-6 text-gray-900 font-black">{t('atomic_prob_title')}</h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">{t('atomic_prob_desc')}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-12 text-left">
                            <div className="bg-rose-50/50 p-12 rounded-[3rem] border border-rose-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-4xl mb-6 font-black select-none">📉</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('atomic_prob_1_title')}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg font-medium">{t('atomic_prob_1_desc')}</p>
                            </div>
                            <div className="bg-gray-50 p-12 rounded-[3rem] border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm text-4xl mb-6 font-black select-none">🔁</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('atomic_prob_2_title')}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg font-medium">{t('atomic_prob_2_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: HABIT HEATMAPS */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="bg-indigo-50 rounded-[3rem] p-8 md:p-12 border border-indigo-100 shadow-xl">
                                <div className="grid grid-cols-7 gap-2 mb-6">
                                    {Array.from({ length: 35 }).map((_, idx) => {
                                        const i = idx + 1;
                                        const bgClass = i % 3 === 0 ? 'bg-indigo-600' : (i % 5 === 0 ? 'bg-indigo-200' : 'bg-indigo-400');
                                        return (
                                            <div key={idx} className={`aspect-square rounded-md ${bgClass}`} />
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                    <span>{t('atomic_heatmap_less')}</span>
                                    <div className="flex gap-1 select-none">
                                        <div className="w-3 h-3 bg-indigo-100 rounded"></div>
                                        <div className="w-3 h-3 bg-indigo-300 rounded"></div>
                                        <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                                    </div>
                                    <span>{t('atomic_heatmap_peak')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-left space-y-6">
                            <h2 className="text-4xl text-gray-900 font-black">{t('atomic_extra_1_title')}</h2>
                            <p className="text-xl text-gray-500 leading-relaxed font-medium">
                                {t('atomic_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: COMPOUNDING FACTORY */}
                <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="max-w-5xl mx-auto px-6 relative z-10">
                        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[3rem] p-12 md:p-20 border border-white/10 text-center">
                            <h2 className="text-4xl mb-8 font-black">{t('atomic_extra_2_title')}</h2>
                            <p className="text-xl text-indigo-200 leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
                                {t('atomic_extra_2_desc')}
                            </p>
                            <div className="flex justify-center gap-12 items-end h-32">
                                <div className="w-12 bg-indigo-500/30 rounded-t-xl h-4"></div>
                                <div className="w-12 bg-indigo-500/50 rounded-t-xl h-8"></div>
                                <div className="w-12 bg-indigo-500/70 rounded-t-xl h-16"></div>
                                <div className="w-12 bg-indigo-600 rounded-t-xl h-32 relative">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce">🔥</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    {/* Floating Atoms Decoration */}
                    <div className="absolute top-20 left-10 w-4 h-4 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-20 right-10 w-6 h-6 bg-purple-200 rounded-full animate-bounce delay-700"></div>
                    <div className="absolute top-1/2 right-20 w-3 h-3 bg-emerald-200 rounded-full animate-bounce delay-1000"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-slate-950 rounded-[4rem] p-10 md:p-20 shadow-2xl relative overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>

                            <div className="grid lg:grid-cols-2 gap-16 items-center text-left">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-indigo-300 text-[10px] uppercase tracking-[0.3em] mb-10 rounded-full border border-white/10 font-bold">
                                        🧬 {t('atomic_science_badge')}
                                    </div>

                                    <h2 className="text-4xl md:text-6xl text-white mb-10 leading-tight font-black">
                                        {t('atomic_science_title')}
                                    </h2>

                                    <div className="relative py-12 px-10 bg-white/5 rounded-[3rem] mb-12 border border-white/10">
                                        <p className="text-indigo-100 text-xl md:text-2xl font-serif italic leading-relaxed">
                                            "{t('atomic_science_desc')}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition">
                                            <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1 font-bold">{t('atomic_science_reagent_1')}</span>
                                            <h4 className="font-bold text-slate-300">{t('atomic_science_topic_1')}</h4>
                                        </div>
                                        <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/50 transition">
                                            <span className="text-[10px] text-purple-400 uppercase tracking-widest block mb-1 font-bold">{t('atomic_science_reagent_2')}</span>
                                            <h4 className="font-bold text-slate-300">{t('atomic_science_topic_2')}</h4>
                                        </div>
                                        <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition">
                                            <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-1 font-bold">{t('atomic_science_reagent_3')}</span>
                                            <h4 className="font-bold text-slate-300">{t('atomic_science_topic_3')}</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative hidden lg:block">
                                    {/* Atomic Reaction Visualization */}
                                    <div className="relative w-full aspect-square flex items-center justify-center">
                                        {/* Nucleus */}
                                        <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-5xl shadow-[0_0_60px_rgba(79,70,229,0.5)] z-20 animate-pulse font-black select-none">⚛️</div>
                                        
                                        {/* Orbitals */}
                                        <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-spin-slow">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-400 rounded-full shadow-lg"></div>
                                        </div>
                                        <div className="absolute inset-12 border-2 border-white/10 rounded-full animate-spin-reverse-slow">
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-purple-400 rounded-full shadow-lg"></div>
                                        </div>
                                        <div className="absolute inset-24 border-2 border-white/5 rounded-full animate-spin-slow">
                                            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-lg"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: FAQ ACCORDION */}
                <section className="py-28 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 text-center font-black">
                            {t('atomic_faq_title')}
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

                {/* SECTION 7: CTA */}
                <section className="py-40 bg-white text-center px-6 relative overflow-hidden">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-indigo-50 to-white rounded-t-full -z-10"></div>
                    
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-[42px] leading-[1.1] md:text-7xl text-gray-900 mb-8 tracking-tight font-black">{t('atomic_cta_title')}</h2>
                        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium">{t('atomic_cta_desc')}</p>
                        <Link href="/register" className="inline-block bg-indigo-950 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-indigo-800 shadow-2xl transition transform hover:-translate-y-1">
                            {t('atomic_cta_btn')}
                        </Link>
                    </div>
                </section>

            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 20s linear infinite;
                }
                .animate-spin-reverse-slow {
                    animation: spin 25s linear infinite reverse;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </GuestLayout>
    );
}
