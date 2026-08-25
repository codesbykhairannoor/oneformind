'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureJournalPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('journal_faq_q1'),
            a: t('journal_faq_a1')
        },
        {
            q: t('journal_faq_q2'),
            a: t('journal_faq_a2')
        },
        {
            q: t('journal_faq_q3'),
            a: t('journal_faq_a3')
        }
    ];

    return (
        <GuestLayout>
            <main id="feature-journal" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO (CENTERED LAYOUT + NOTION-STYLE EDITOR MOCKUP) */}
                <header className="pt-32 pb-32 px-6 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-gray-50 relative border-b border-gray-100">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-indigo-200">
                                <span className="text-lg">📔</span> {t('journal_hero_badge')}
                            </div>
                            
                            <h1 className="text-[42px] leading-[1.1] md:text-7xl mb-8 text-gray-900 tracking-tight font-black">
                                {t('journal_hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {t('journal_hero_title_2')}
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                                {t('journal_hero_desc')}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                                <Link href="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                                    {t('journal_hero_cta_1')}
                                </Link>
                                <a href="#how-it-works" className="bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-200 hover:bg-indigo-50 transition">
                                    {t('journal_hero_cta_2')}
                                </a>
                            </div>
                        </div>

                        {/* Floating Mockup Centered (Clean Editor Vibe) */}
                        <div className="max-w-4xl mx-auto relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-2xl"></div>
                            <div className="relative bg-white/80 rounded-[3rem] border border-white shadow-2xl p-8 md:p-16 text-left transform transition hover:scale-[1.01] duration-500">
                                
                                {/* Cover Image area */}
                                <div className="h-24 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 w-full opacity-80 rounded-t-[2.5rem]"></div>
                                
                                <div className="p-8 md:p-12 relative">
                                    {/* Floating Emoji Icon */}
                                    <div className="absolute -top-12 left-8 text-6xl bg-white rounded-2xl p-2 shadow-sm font-black select-none">🧠</div>
                                    
                                    <div className="flex justify-between items-start mt-4 mb-6">
                                        <div>
                                            <h3 className="font-black text-gray-900 text-3xl mb-2">{t('journal_mockup_title')}</h3>
                                            <p className="text-sm font-bold text-indigo-500 flex items-center gap-2">
                                                <span>📅 {t('journal_mockup_date')}</span>
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100 flex items-center gap-2 shadow-sm">
                                            <span className="text-sm font-bold text-gray-500">Mood:</span>
                                            <span className="text-xl">✨</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 text-lg text-gray-600 font-serif leading-relaxed">
                                        <p>{t('journal_mockup_text_1')}</p>
                                        <p className="opacity-60">{t('journal_mockup_text_2')}</p>
                                        
                                        {/* Skeleton lines for writing illusion */}
                                        <div className="pt-4 space-y-3 opacity-30">
                                            <div className="h-3 w-full bg-gray-300 rounded-full"></div>
                                            <div className="h-3 w-5/6 bg-gray-300 rounded-full"></div>
                                            <div className="h-3 w-4/6 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Floating Writing Indicator */}
                                    <div className="absolute right-8 bottom-8 flex items-center gap-2 text-indigo-500 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-full animate-bounce [animation-duration:2000ms]">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                                        {t('journal_mockup_typing')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: EDITORIAL REFLECTION (SERIF & CLEAN) */}
                <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-10">
                            {t('journal_editorial_badge')}
                        </div>
                        <h2 className="text-[42px] leading-[1.1] md:text-7xl font-serif italic text-gray-900 mb-10 tracking-tight font-black">
                            {t('journal_editorial_title')}
                        </h2>
                        <p className="text-gray-500 text-xl font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
                            {t('journal_editorial_desc')}
                        </p>
                        
                        {/* Visual: Premium Paper Mockup */}
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute -inset-8 bg-gradient-to-b from-gray-50 to-transparent rounded-[4rem] -z-10 opacity-50 group-hover:opacity-100 transition duration-700"></div>
                            <div className="bg-white p-12 md:p-24 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[4rem]"></div>
                                <div className="font-serif text-2xl md:text-4xl text-gray-800 leading-[1.6] space-y-10 relative z-10 font-black">
                                    <p className="border-b border-gray-100 pb-6">{t('journal_editorial_card_p1')}</p>
                                    <p className="border-b border-gray-100 pb-6 text-gray-300">{t('journal_editorial_card_p2')}</p>
                                    <div className="w-1.5 h-10 bg-indigo-600 animate-pulse inline-block align-middle ml-1 rounded-full"></div>
                                </div>
                            </div>
                            {/* Decorative element: Fountain pen nib */}
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl transform rotate-12 group-hover:rotate-0 transition duration-500 border-4 border-white font-black select-none">🖋️</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE MOOD NEBULA */}
                <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-purple-200/40 rounded-full blur-3xl -mr-96 -mt-96 animate-pulse"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            
                            <div className="flex-1 order-2 lg:order-1">
                                <div className="relative animate-in zoom-in-95 duration-1000">
                                    {/* Outer Glow */}
                                    <div className="absolute inset-0 blur-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full"></div>

                                    {/* Main Circle */}
                                    <div className="relative w-full aspect-square max-w-lg mx-auto bg-white/70 rounded-full p-12 flex items-center justify-center border border-white/40 shadow-[0_40px_120px_rgba(0,0,0,0.15)] group">
                                        
                                        {/* Rotating Gradient */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-pink-500/20 opacity-70 group-hover:opacity-100 transition duration-700 animate-spin-slow"></div>

                                        {/* Content */}
                                        <div className="relative z-10 text-center">
                                            <span className="text-8xl mb-6 block group-hover:scale-125 transition duration-700 drop-shadow-2xl font-black select-none">✨</span>
                                            <h4 className="text-3xl font-black text-gray-800 mb-2">{t('journal_nebula_harmony')}</h4>
                                            <p className="text-gray-500 uppercase tracking-[0.35em] text-xs font-bold">{t('journal_nebula_sentiment')}</p>
                                        </div>

                                        {/* Orbit Rings */}
                                        <div className="absolute inset-6 border border-white/40 rounded-full"></div>
                                        <div className="absolute inset-16 border border-white/30 rounded-full"></div>

                                        {/* Floating Dots */}
                                        <div className="absolute top-1/4 right-10 w-5 h-5 bg-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.8)] animate-bounce border-4 border-white"></div>
                                        <div className="absolute bottom-1/4 left-10 w-5 h-5 bg-purple-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)] animate-bounce delay-150 border-4 border-white"></div>
                                        <div className="absolute top-1/2 left-6 w-4 h-4 bg-pink-500 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.8)] animate-pulse border-4 border-white"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                                    {t('journal_nebula_badge')}
                                </div>
                                <h2 className="text-4xl md:text-6xl text-white mb-10 leading-tight font-black">
                                    {t('journal_nebula_title')}
                                </h2>
                                <p className="text-white/80 text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl font-medium">
                                    {t('journal_nebula_desc')}
                                </p>
                                <div className="grid gap-8">
                                    <div className="flex items-start gap-8 p-8 rounded-[2.5rem] bg-white hover:shadow-2xl transition duration-500 group border border-gray-100">
                                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition font-black select-none">🔮</div>
                                        <div>
                                            <h4 className="text-xl text-gray-900 mb-2 font-black">{t('journal_nebula_feature_1_title')}</h4>
                                            <p className="text-gray-500 font-medium">{t('journal_nebula_feature_1_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-8 p-8 rounded-[2.5rem] bg-white hover:shadow-2xl transition duration-500 group border border-gray-100">
                                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition font-black select-none">🌈</div>
                                        <div>
                                            <h4 className="text-xl text-gray-900 mb-2 font-black">{t('journal_nebula_feature_2_title')}</h4>
                                            <p className="text-gray-500 font-medium">{t('journal_nebula_feature_2_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 3.5: SENTIMENT ANALYTICS (BENTO MOSAIC) */}
                <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] uppercase tracking-[0.2em] mb-8 shadow-sm border border-purple-200">
                                {t('journal_analytics_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-gray-900 mb-8 leading-tight tracking-tight font-black">
                                {t('journal_analytics_title')}
                            </h2>
                            <p className="text-gray-600 text-xl leading-relaxed font-medium">
                                {t('journal_analytics_desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] text-left">
                            
                            {/* Bento 1: Large Feature */}
                            <div className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-[3rem] p-12 border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition duration-700">
                                <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition duration-700"></div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition font-black select-none">🌈</div>
                                        <h3 className="text-3xl text-gray-900 mb-4 font-black">{t('journal_analytics_bento_1_title')}</h3>
                                        <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md">{t('journal_analytics_bento_1_desc')}</p>
                                    </div>
                                    
                                    {/* Visual Mood Cluster Representation */}
                                    <div className="flex items-end gap-2 h-24">
                                        {[40, 70, 45, 90, 60, 80, 55, 100, 40, 75].map((height, idx) => (
                                            <div key={idx} className="flex-1 bg-purple-200 rounded-full transition-all duration-1000" style={{ height: `${height}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bento 2 */}
                            <div className="bg-purple-600 rounded-[3rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl transition duration-500">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition font-black select-none">🧘</div>
                                    <div>
                                        <h3 className="text-xl mb-2 font-black">{t('journal_analytics_bento_2_title')}</h3>
                                        <p className="text-purple-100 text-xs font-medium leading-relaxed">{t('journal_analytics_bento_2_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bento 3 */}
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition duration-500">
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition duration-1000"></div>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:-rotate-12 transition font-black select-none">🧠</div>
                                    <div>
                                        <h3 className="text-xl text-gray-900 mb-2 font-black">{t('journal_analytics_bento_3_title')}</h3>
                                        <p className="text-gray-500 text-xs font-medium leading-relaxed">{t('journal_analytics_bento_3_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bento 4: Horizontal Banner */}
                            <div className="md:col-span-3 bg-slate-900 rounded-[3rem] p-8 border border-slate-800 flex items-center justify-between group overflow-hidden">
                                <div className="flex items-center gap-8 pl-4">
                                    <div className="flex -space-x-4">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xl shadow-lg font-black select-none">✨</div>
                                        ))}
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('journal_analytics_banner_text')}</p>
                                </div>
                                <div className="pr-4 group-hover:translate-x-2 transition duration-500">
                                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white cursor-pointer">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* NEW SECTION: SCIENTIFIC PILLAR (E-E-A-T) - ZEN MINIMALIST REFLECTION STYLE */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                        
                        {/* Floating Seal of Quality */}
                        <div className="relative mb-20">
                            <div className="absolute inset-0 bg-indigo-50 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            <div className="relative w-24 h-24 mx-auto bg-white border border-indigo-100 rounded-full flex items-center justify-center text-3xl shadow-xl transform hover:rotate-12 transition duration-700 group font-black select-none">
                                ✨
                                <div className="absolute inset-0 border-2 border-dashed border-indigo-200 rounded-full animate-spin-slow group-hover:animate-spin"></div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-10">
                            🧬 {t('journal_science_badge')}
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 mb-12 leading-tight font-black">
                            {t('journal_science_title')}
                        </h2>

                        <div className="relative py-12 px-8 md:px-20 border-y border-gray-100">
                            {/* Quote Marks */}
                            <div className="absolute top-0 left-0 text-8xl text-indigo-50 font-serif leading-none -translate-x-1/2 -translate-y-1/2 font-black select-none">“</div>
                            <div className="absolute bottom-0 right-0 text-8xl text-indigo-50 font-serif leading-none translate-x-1/2 translate-y-1/2 font-black select-none">”</div>
                            
                            <p className="text-gray-600 text-2xl md:text-3xl font-serif italic leading-[1.6] opacity-80 decoration-indigo-100 underline-offset-8 font-black">
                                {t('journal_science_desc')}
                            </p>
                        </div>

                        <div className="mt-16 flex flex-wrap justify-center gap-12">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-indigo-300 mb-2 font-bold">Technique</span>
                                <span className="text-sm font-bold text-gray-400 italic">Affect Labeling</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-indigo-300 mb-2 font-bold">Foundation</span>
                                <span className="text-sm font-bold text-gray-400 italic">Reflective Practice</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-indigo-300 mb-2 font-bold">Outcome</span>
                                <span className="text-sm font-bold text-gray-400 italic">Emotional Regulation</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEURAL PROMO: JOURNAL REFLECTION */}
                <section className="py-32 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
                    <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16 text-left">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] uppercase tracking-widest mb-8 border border-purple-500/20">
                                📖 {t('journal_ai_promo_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-white mb-8 leading-tight tracking-tight font-black">
                                {t('journal_ai_promo_title')}
                            </h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                                {t('journal_ai_promo_desc')}
                            </p>
                            <Link href="/features/neural-os" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-purple-700 transition transform hover:-translate-y-1">
                                {t('journal_ai_promo_btn')} <span>→</span>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative w-full">
                            <div className="bg-slate-800 p-8 rounded-[3rem] border border-white/5 shadow-2xl text-center group">
                                <div className="text-[10px] text-purple-400 uppercase tracking-widest mb-6">Sentiment Mirror v1.0</div>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-300">Resilient (+14%)</span>
                                    <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-300">Focused</span>
                                    <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold text-indigo-300">Growth Mindset</span>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/5 text-slate-400 text-sm italic">
                                    "You tend to solve complex problems better after journaling for 10 minutes."
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
                            {t('journal_quote_text')}
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                            <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('journal_quote_author')}</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 8: CTA BANNER */}
                <section className="py-32 bg-gray-50 px-6 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full opacity-50 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200 rounded-full opacity-40 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-300 rounded-full opacity-30 pointer-events-none"></div>

                    <div className="max-w-3xl mx-auto text-center relative z-10 bg-white/80 p-12 md:p-20 rounded-[3rem] shadow-2xl border border-white">
                        <div className="text-5xl mb-6 font-black select-none">🖋️</div>
                        <h2 className="text-4xl md:text-5xl mb-6 text-gray-900 tracking-tight font-black">{t('journal_cta_title')}</h2>
                        <p className="text-gray-500 text-xl mb-10 font-medium">
                            {t('journal_cta_desc')}
                        </p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 transition transform hover:-translate-y-1">
                            {t('journal_cta_btn')}
                        </Link>
                        <p className="mt-6 text-sm text-gray-400 font-medium">{t('journal_cta_note')}</p>
                    </div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Digital Journal (FAQ)
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
