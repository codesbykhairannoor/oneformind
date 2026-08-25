'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SolutionPersonalGrowthPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('growth_faq_q1'),
            a: t('growth_faq_a1')
        },
        {
            q: t('growth_faq_q2'),
            a: t('growth_faq_a2')
        },
        {
            q: t('growth_faq_q3'),
            a: t('growth_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="solution-personal-growth" className="overflow-x-hidden text-left">
                
                {/* SECTION 1: HERO (7:5 LAYOUT - VISION BOARD VIBE) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50 relative border-b border-gray-100">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl -z-10 "></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                        
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both relative z-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950 text-indigo-100 font-bold text-xs mb-8 uppercase tracking-wider shadow-lg">
                                🌱 {t('growth_hero_badge')}
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl mb-8 leading-[1.2] text-gray-900 tracking-tight font-black">
                                {t('growth_hero_title_1')}
                                <span className="block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                                    {t('growth_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl">
                                {t('growth_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 text-center">
                                    {t('growth_hero_cta_1')}
                                </Link>
                            </div>
                            
                            <div className="mt-8 flex items-center gap-4 text-sm font-bold text-gray-400">
                                <div className="flex -space-x-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white text-xs font-bold">SS</span>
                                    <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-white text-xs font-bold">DF</span>
                                    <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white text-xs font-bold">KN</span>
                                </div>
                                <p>{t('growth_hero_social_proof')}</p>
                            </div>
                        </div>

                        {/* Right: 5 Columns - Glow Up Dashboard */}
                        <div className="lg:col-span-5 relative w-full h-[500px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-200 fill-mode-both">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                            {/* Central Widget: Circular Goal Tracker */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/90 rounded-full shadow-2xl border border-white flex flex-col items-center justify-center z-20 hover:scale-105 transition duration-500">
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" stroke="#eef2ff" strokeWidth="8" fill="none" />
                                    <circle cx="50" cy="50" r="46" stroke="#4f46e5" strokeWidth="8" fill="none" strokeDasharray="289" strokeDashoffset="72" className="animate-[dash_2s_ease-out_forwards]" />
                                </svg>
                                <span className="text-4xl mb-1 font-black select-none">📖</span>
                                <h3 className="font-black text-2xl text-gray-900">75%</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('growth_mockup_goal_label')}</p>
                            </div>

                            {/* Floating Habit Orb 1 */}
                            <div className="absolute top-10 right-0 bg-white p-4 rounded-3xl shadow-xl border border-indigo-50 flex items-center gap-4 z-30 animate-bounce">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shadow-inner font-bold">✓</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{t('growth_mockup_habit_title')}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">{t('growth_mockup_habit_desc')}</p>
                                </div>
                            </div>

                            {/* Floating Journal Orb 2 */}
                            <div className="absolute bottom-10 left-0 bg-slate-900 text-white p-4 rounded-3xl shadow-xl border border-slate-700 flex flex-col gap-2 z-30 transform -rotate-6 hover:rotate-0 transition duration-300">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg select-none font-black">🧠</span>
                                    <p className="font-bold text-sm">{t('growth_mockup_reflection_title')}</p>
                                </div>
                                <p className="text-xs text-slate-400 font-serif italic max-w-[150px]">"{t('growth_mockup_reflection_desc')}"</p>
                            </div>

                        </div>
                    </div>
                </header>

                {/* SECTION 3: STACKED CARD DECK */}
                <section id="how-it-works" className="py-32 bg-white overflow-hidden border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        
                        <div className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center group perspective-1000">
                            {/* Card 3 (Bottom) */}
                            <div className="absolute w-72 h-80 bg-purple-100 rounded-3xl transform translate-y-12 scale-90 opacity-60 group-hover:translate-x-12 group-hover:rotate-6 transition duration-500 border border-purple-200"></div>
                            {/* Card 2 (Middle) */}
                            <div className="absolute w-72 h-80 bg-indigo-100 rounded-3xl transform translate-y-6 scale-95 opacity-80 group-hover:-translate-x-12 group-hover:-rotate-6 transition duration-500 border border-indigo-200"></div>
                            {/* Card 1 (Top) */}
                            <div className="absolute w-72 h-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center transform group-hover:-translate-y-4 transition duration-500 z-10">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner font-black select-none">🏆</div>
                                <h4 className="font-black text-xl text-gray-900 mb-2">{t('growth_mockup_streak_title')}</h4>
                                <p className="text-sm text-gray-500 mb-6">{t('growth_mockup_streak_desc')}</p>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full w-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl text-2xl mb-6 shadow-sm border border-indigo-100 font-black select-none">🔥</div>
                            <h2 className="text-5xl md:text-6xl mb-6 text-gray-900 font-black">{t('growth_feat_1_title')}</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                {t('growth_feat_1_desc')}
                            </p>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4 font-bold">
                                <p className="font-bold text-gray-700 flex items-center gap-3">
                                    <span className="text-xl select-none">📈</span> {t('growth_feat_1_point_1')}
                                </p>
                                <div className="w-full h-px bg-gray-200"></div>
                                <p className="font-bold text-gray-700 flex items-center gap-3">
                                    <span className="text-xl select-none">🎖️</span> {t('growth_feat_1_point_2')}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* SECTION 4: IMMERSIVE GLASSMORPHISM */}
                <section className="py-32 relative bg-indigo-950 flex items-center justify-center overflow-hidden min-h-[800px]">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 "></div>
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 delay-1000"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

                    <div className="relative z-10 max-w-5xl w-full px-6 text-center">
                        <h2 className="text-5xl md:text-7xl mb-8 text-white tracking-tight font-black">{t('growth_feat_2_title')}</h2>
                        <p className="text-indigo-200 text-xl leading-relaxed mb-16 max-w-2xl mx-auto">
                            {t('growth_feat_2_desc')}
                        </p>

                        {/* Massive Glassmorphism Diary Card */}
                        <div className="bg-white/10 border border-white/20 rounded-[3rem] p-8 md:p-16 text-left shadow-2xl relative overflow-hidden group transform hover:scale-[1.01] transition duration-500">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-400 to-purple-400"></div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-5xl font-black select-none">🖋️</div>
                                <div className="bg-white/20 px-4 py-2 rounded-full text-indigo-100 font-bold text-xs tracking-widest uppercase ">Zen Entry</div>
                            </div>
                            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6 font-black">"{t('growth_feat_2_quote_title')}"</h3>
                            <p className="font-serif text-indigo-100/80 text-lg md:text-xl leading-relaxed italic mb-8">
                                {t('growth_feat_2_quote_body')}
                            </p>
                            <div className="flex gap-4 font-bold text-xs">
                                <span className="bg-black/30 text-white px-4 py-2 rounded-full ">Deep Work</span>
                                <span className="bg-black/30 text-white px-4 py-2 rounded-full ">Clarity</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: HABIT CASCADE */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="bg-indigo-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl select-none">🌱</div>
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="w-1/3 h-full bg-indigo-400"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-60">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl select-none">🌿</div>
                                        <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center gap-4 opacity-30">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl select-none">🌳</div>
                                        <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-5xl md:text-6xl mb-6 font-black">{t('growth_extra_1_title')}</h2>
                            <p className="text-xl text-indigo-200 leading-relaxed italic">
                                {t('growth_extra_1_desc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: GROWTH TRAJECTORY */}
                <section className="py-32 bg-white relative">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-5xl md:text-6xl text-gray-900 mb-8 font-black">{t('growth_extra_2_title')}</h2>
                        <p className="text-xl text-gray-500 leading-relaxed mb-12 font-medium">
                            {t('growth_extra_2_desc')}
                        </p>
                        <div className="inline-flex items-center gap-4 p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                            <div className="text-5xl text-indigo-600 font-black">37.8x</div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase text-indigo-400 font-bold">{t('growth_extra_2_stat_label')}</p>
                                <p className="text-xs text-gray-500 font-medium">{t('growth_extra_2_stat_sub')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: SCIENTIFIC PILLAR */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden border-t border-gray-100">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            
                            <div className="relative hidden lg:block">
                                <div className="relative w-[500px] h-[500px] group">
                                    <div className="absolute inset-0 border-4 border-dashed border-indigo-100 rounded-full animate-spin-slow"></div>
                                    <div className="absolute inset-10 bg-white rounded-full shadow-2xl border border-indigo-50 flex items-center justify-center relative z-10">
                                        <div className="grid grid-cols-2 grid-rows-2 w-full h-full p-4 gap-4 transform group-hover:rotate-45 transition duration-1000">
                                            <div className="bg-indigo-50 rounded-tl-[100px] flex items-center justify-center text-4xl font-black select-none">🌱</div>
                                            <div className="bg-purple-50 rounded-tr-[100px] flex items-center justify-center text-4xl font-black select-none">🧘</div>
                                            <div className="bg-emerald-50 rounded-bl-[100px] flex items-center justify-center text-4xl font-black select-none">💪</div>
                                            <div className="bg-amber-50 rounded-br-[100px] flex items-center justify-center text-4xl font-black select-none">📚</div>
                                        </div>
                                        <div className="absolute w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl shadow-xl z-20 border-4 border-white font-black select-none">✨</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-widest mb-10 rounded-full font-bold">
                                    🧬 {t('growth_science_badge')}
                                </div>

                                <h2 className="text-5xl md:text-7xl text-gray-900 mb-10 leading-tight font-black">
                                    {t('growth_science_title')}
                                </h2>

                                <div className="relative py-12 px-10 bg-indigo-50/50 rounded-[3rem] mb-12 border-l-8 border-indigo-600">
                                    <p className="text-gray-800 text-xl md:text-2xl font-serif italic leading-relaxed">
                                        "{t('growth_science_desc')}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-bold text-center">
                                    <div>
                                        <span className="block text-2xl mb-2 select-none font-black">🛡️</span>
                                        <h4 className="font-black text-[10px] uppercase text-indigo-400 tracking-widest">{t('growth_science_point_1')}</h4>
                                    </div>
                                    <div>
                                        <span className="block text-2xl mb-2 select-none font-black">👤</span>
                                        <h4 className="font-black text-[10px] uppercase text-purple-400 tracking-widest">{t('growth_science_point_2')}</h4>
                                    </div>
                                    <div>
                                        <span className="block text-2xl mb-2 select-none font-black">📈</span>
                                        <h4 className="font-black text-[10px] uppercase text-emerald-400 tracking-widest">{t('growth_science_point_3')}</h4>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 8: FAQ */}
                <section className="py-32 bg-gray-50 border-y border-gray-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-5xl md:text-6xl text-center text-gray-900 mb-16 font-black">{t('growth_faq_title')}</h2>
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

                {/* SECTION 9: SUNRISE CTA */}
                <section className="pt-32 pb-40 px-6 bg-white relative overflow-hidden text-center">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-t from-indigo-100 via-purple-50 to-white rounded-t-full -z-10"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-indigo-200 to-transparent rounded-t-full blur-2xl -z-10"></div>
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10 px-6 space-y-8">
                        <h2 className="text-6xl md:text-7xl mb-8 text-indigo-950 tracking-tight leading-tight font-black">{t('growth_cta_title')}</h2>
                        <p className="text-indigo-900/60 text-xl md:text-2xl mb-12 font-medium max-w-2xl mx-auto">
                            {t('growth_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-indigo-700 transition transform hover:-translate-y-2 shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)]">
                            {t('growth_cta_btn')}
                        </Link>
                    </div>
                </section>

            </main>
            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 45s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </GuestLayout>
    );
}
