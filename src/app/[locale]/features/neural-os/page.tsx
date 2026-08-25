'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function FeatureNeuralOsPage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: 'Apakah Neural OS mengumpulkan atau menjual data pribadi saya?',
            a: 'Tidak sama sekali. Neural OS beroperasi dengan filosofi Ephemeral Context di mana data hanya diproses secara sementara untuk rekomendasi dan tidak pernah dijual.'
        },
        {
            q: 'Bagaimana cara kerja sintesis antar modul di Neural OS?',
            a: 'AI secara pintar menghubungkan titik-titik antar modul—seperti korelasi antara anggaran keuangan dengan tingkat stres harian di jurnal Anda.'
        },
        {
            q: 'Apakah saya bisa mematikan saran AI jika ingin menggunakan aplikasi secara manual?',
            a: 'Tentu saja. Anda memiliki kendali penuh atas semua fitur AI dan dapat mematikannya kapan saja dari menu pengaturan.'
        }
    ];

    // Simulated waveform height percentages matching legacy blades
    const waveHeights = [
        40, 65, 30, 85, 45, 90, 70, 35, 60, 50, 75, 40, 80, 55, 95, 65, 45, 75, 30, 85
    ];

    return (
        <GuestLayout>
            <main id="feature-neural-os" className="overflow-x-hidden">
                
                {/* SECTION 1: HERO - THE NEURAL CORE */}
                <header className="pt-32 pb-40 px-6 text-center relative overflow-hidden bg-white bg-pattern-dots">
                    {/* Deep Indigo & Purple Gradient Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-purple-50/50 via-white to-white rounded-full blur-3xl -z-10"></div>
                    
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 shadow-sm text-purple-700 text-[10px] mb-10 tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-700 font-bold uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                            </span>
                            {t('neural_hero_badge')}
                        </div>
                        
                        <h1 className="text-[42px] leading-[1.1] md:text-7xl lg:text-8xl mb-10 leading-[0.95] tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000 font-black">
                            {t('neural_hero_title_1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
                                {t('neural_hero_title_2')}
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-500 mb-14 leading-relaxed max-w-3xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                            {t('neural_hero_desc')}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                            <Link href="/register" className="bg-indigo-600 text-white px-12 py-6 rounded-3xl text-xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition transform hover:-translate-y-1 active:scale-95 group font-bold">
                                {t('neural_hero_cta_1')}
                                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                            </Link>
                            <a href="#audit" className="bg-white text-slate-700 border border-slate-200 px-12 py-6 rounded-3xl text-xl hover:bg-slate-50 hover:border-slate-300 transition transform hover:-translate-y-1 active:scale-95 font-bold">
                                {t('neural_hero_cta_2')}
                            </a>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: INTERFACE PREVIEW - AI INSIGHTS */}
                <section className="py-20 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_0,transparent_50%)]"></div>
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-slate-800 border border-slate-700 rounded-[3rem] overflow-hidden shadow-2xl">
                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-700">
                                
                                {/* Visual AI Simulation */}
                                <div className="lg:w-3/5 p-12">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 font-black">🧠</div>
                                        <div className="text-left">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t('neural_mockup_source')}</p>
                                            <p className="text-white text-lg font-bold">Gemini Intelligence Layer</p>
                                        </div>
                                    </div>

                                    {/* Simulated Waveform / Graph */}
                                    <div className="h-64 bg-slate-900/50 rounded-3xl border border-slate-700/50 p-8 flex items-center justify-center relative overflow-hidden mb-8">
                                        <div className="absolute inset-0 flex items-center justify-around px-8">
                                            {waveHeights.map((h, i) => (
                                                <div key={i} className="w-1.5 bg-indigo-500/30 rounded-full animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}></div>
                                            ))}
                                        </div>
                                        <div className="relative z-10 text-white text-center">
                                            <span className="bg-indigo-600 px-4 py-2 rounded-full text-xs uppercase tracking-widest shadow-xl font-bold">{t('neural_mockup_confidence')}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                        <div className="p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30">
                                            <p className="text-indigo-400 font-bold text-xs mb-2">● REC-01</p>
                                            <p className="text-slate-300 font-medium text-sm leading-relaxed">{t('neural_mockup_insight_1')}</p>
                                        </div>
                                        <div className="p-6 bg-purple-700/30 rounded-2xl border border-purple-600/30">
                                            <p className="text-purple-400 font-bold text-xs mb-2">● STRAT-02</p>
                                            <p className="text-slate-300 font-medium text-sm leading-relaxed">{t('neural_mockup_insight_2')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contextual Explanation */}
                                <div className="lg:w-2/5 p-12 flex flex-col justify-center text-left">
                                    <h2 className="text-4xl text-white mb-8 leading-tight font-black">
                                        {t('neural_gemini_powered')}<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Gemini Pro API</span>
                                    </h2>
                                    <ul className="space-y-6">
                                        <li className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">✓</div>
                                            <p className="text-slate-400 font-medium">{t('neural_gemini_feat1')}</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">✓</div>
                                            <p className="text-slate-400 font-medium">{t('neural_gemini_feat2')}</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">✓</div>
                                            <p className="text-slate-400 font-medium">{t('neural_gemini_feat3')}</p>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: FRICTION AUDIT */}
                <section className="py-32 bg-white scroll-mt-20" id="audit">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            
                            <div className="lg:w-1/2 text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] mb-8 uppercase tracking-widest border border-emerald-100 font-bold">
                                    {t('neural_audit_badge')}
                                </div>
                                <h2 className="text-4xl md:text-6xl text-slate-900 mb-8 leading-tight font-black">
                                    {t('neural_audit_title')}
                                </h2>
                                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">
                                    {t('neural_audit_desc')}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl mb-6 font-black">📉</div>
                                        <h3 className="text-xl text-slate-900 mb-4 tracking-wide font-black">{t('neural_audit_step1_title')}</h3>
                                        <p className="text-slate-500 font-bold text-sm leading-relaxed">{t('neural_audit_step1_desc')}</p>
                                    </div>
                                    <div>
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl mb-6 font-black">🌍</div>
                                        <h3 className="text-xl text-slate-900 mb-4 tracking-wide font-black">{t('neural_audit_step2_title')}</h3>
                                        <p className="text-slate-500 font-bold text-sm leading-relaxed">{t('neural_audit_step2_desc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-1/2 relative text-left">
                                <div className="relative bg-slate-50 border border-slate-200 p-12 rounded-[3.5rem] shadow-inner">
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl transform rotate-3 hover:rotate-0 transition duration-700">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-black">⚡</div>
                                            <span className="text-slate-900 tracking-tight font-bold">Audit Report: #482</span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 w-[70%]"></div>
                                            </div>
                                            <div className="h-4 w-[85%] bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-purple-500 w-[45%]"></div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-bold italic pt-4">Identifying patterns from last 14 days...</p>
                                        </div>
                                    </div>
                                    {/* Decorative Elements */}
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl"></div>
                                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 4: DEEP SYNERGY */}
                <section className="py-32 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] mb-6 tracking-widest border border-indigo-200 font-bold uppercase">
                                {t('neural_synergy_badge')}
                            </div>
                            <h2 className="text-4xl md:text-6xl text-slate-900 mb-8 leading-tight font-black">
                                {t('neural_synergy_title')}
                            </h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed mb-0">
                                {t('neural_synergy_desc')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 relative text-left">
                            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-default">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition font-black select-none">💰</div>
                                <h3 className="text-2xl text-slate-900 mb-4 font-black">{t('neural_synergy_fin_title')}</h3>
                                <p className="text-slate-500 font-bold leading-relaxed">{t('neural_synergy_fin_desc')}</p>
                            </div>
                            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-default">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl mb-10 group-hover:scale-110 transition font-black select-none">🌱</div>
                                <h3 className="text-2xl text-slate-900 mb-4 font-black">{t('neural_synergy_hab_title')}</h3>
                                <p className="text-slate-500 font-bold leading-relaxed">{t('neural_synergy_hab_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: AI GROWTH COACH */}
                <section className="py-32 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            
                            <div className="order-2 lg:order-1 relative">
                                {/* Chat Simulation */}
                                <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-8 shadow-inner overflow-hidden max-w-md mx-auto text-left">
                                    <div className="space-y-6">
                                        <div className="flex flex-col items-start">
                                            <span className="text-[9px] text-slate-400 uppercase tracking-widest ml-3 mb-1 font-bold">{t('neural_coach_sender')}</span>
                                            <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tl-none text-sm font-medium shadow-lg shadow-indigo-100 leading-relaxed">
                                                "{t('neural_coach_msg1')}"
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] text-slate-400 uppercase tracking-widest mr-3 mb-1 font-bold">{t('neural_coach_user')}</span>
                                            <div className="bg-white border border-slate-200 text-slate-700 p-4 rounded-2xl rounded-tr-none text-sm font-bold shadow-sm">
                                                "{t('neural_coach_msg2')}"
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start translate-x-2">
                                            <span className="text-[9px] text-slate-400 uppercase tracking-widest ml-3 mb-1 font-bold">{t('neural_coach_sender')}</span>
                                            <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tl-none text-sm font-medium shadow-lg shadow-emerald-100 leading-relaxed animate-pulse">
                                                "{t('neural_coach_msg3')}"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2 text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-[10px] mb-8 uppercase tracking-widest border border-purple-100 font-bold">
                                    {t('neural_coach_badge')}
                                </div>
                                <h2 className="text-4xl md:text-6xl text-slate-900 mb-8 leading-tight font-black">
                                    {t('neural_coach_title')}
                                </h2>
                                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">
                                    {t('neural_coach_desc')}
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 text-slate-700 font-bold">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">●</span>
                                        {t('neural_coach_feat1')}
                                    </li>
                                    <li className="flex items-center gap-4 text-slate-700 font-bold">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">●</span>
                                        {t('neural_coach_feat2')}
                                    </li>
                                    <li className="flex items-center gap-4 text-slate-700 font-bold">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">●</span>
                                        {t('neural_coach_feat3')}
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SECTION 6: PRIVACY & SECURITY */}
                <section className="py-32 bg-slate-950 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] tracking-widest mb-10 border border-white/10 font-bold uppercase">
                            🛡️ {t('neural_privacy_badge')}
                        </div>
                        <h2 className="text-4xl md:text-6xl text-white mb-10 tracking-tight font-black">{t('neural_privacy_title')}</h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-14">
                            {t('neural_privacy_desc')}
                        </p>
                        <div className="inline-block px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-indigo-400 tracking-[0.4em] uppercase font-black">
                            {t('neural_privacy_stat')}
                        </div>
                    </div>
                    
                    {/* Decorative Mesh */}
                    <div className="absolute inset-0 bg-pattern-grid opacity-10 pointer-events-none"></div>
                </section>

                {/* SECTION 7: FINAL CTA */}
                <section className="py-40 px-6 text-center relative overflow-hidden bg-white">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-5xl md:text-[6rem] mb-10 leading-[0.9] tracking-tight text-slate-900 font-black">
                            {t('neural_cta_title')}
                        </h2>
                        <p className="text-slate-500 text-xl md:text-2xl mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
                            {t('neural_cta_desc')}
                        </p>
                        
                        <div className="flex flex-col items-center gap-6">
                            <Link href="/register" className="inline-block bg-indigo-600 text-white px-16 py-8 rounded-[2.5rem] text-2xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition transform hover:-translate-y-2 active:scale-95 group font-bold">
                                {t('neural_cta_btn')}
                            </Link>
                            <div className="flex items-center gap-3 text-sm text-slate-400 tracking-widest font-bold">
                                {t('neural_cta_note')}
                            </div>
                        </div>
                    </div>

                    {/* Huge Gradient Background */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1500px] h-[600px] bg-gradient-to-t from-indigo-50/50 via-white to-white rounded-full blur-3xl -z-10"></div>
                </section>

                {/* Mandatory FAQ Section */}
                <section className="py-28 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                            Pertanyaan Neural OS (FAQ)
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
