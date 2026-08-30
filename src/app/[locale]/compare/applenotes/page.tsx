'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function AppleNotesComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_applenotes_q1'),
            a: t('faq_applenotes_a1')
        },
        {
            q: 'Apakah Tranvas bisa menggantikan Apple Notes untuk semua hal?',
            a: 'Apple Notes hebat untuk coretan cepat. Tranvas tidak bertujuan menggantikannya, melainkan menampung hal yang membutuhkan struktur dan pencapaian tujuan.'
        },
        {
            q: 'Apakah data saya aman di Tranvas?',
            a: 'Ya, kami menggunakan standar enkripsi industri. Kami juga mengadopsi pendekatan minimalis: hanya menyimpan data yang benar-benar esensial untuk produktivitas Anda.'
        }
    ];

    return (
        <GuestLayout>
            <main id="applenotes-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Text Center, Visual Bottom) */}
                <header className="pt-32 pb-0 px-6 overflow-hidden bg-amber-50 relative border-b border-amber-100">
                    <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-16">
                        <div className="mb-4">
                            <span className="text-amber-600 font-bold text-sm tracking-widest uppercase opacity-70">
                                {t('seo_eyebrow_applenotes')}
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold text-xs mb-8 uppercase tracking-wider border border-amber-200">
                            {t('applenotes_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            {t('applenotes_hero_title_1')} <br/>
                            <span className="text-amber-600">{t('applenotes_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('applenotes_hero_desc') }} />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transform">
                                {t('applenotes_hero_cta')}
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-400 font-medium">{t('applenotes_hero_note')}</p>
                    </div>

                    {/* Visual Bottom */}
                    <div className="max-w-5xl mx-auto relative z-10 translate-y-12 hover:translate-y-4 transition-transform duration-700 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-300">
                        <div className="bg-white border border-slate-200 rounded-t-[3rem] shadow-2xl p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-500/30 rounded-b-full"></div>
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 w-full text-center">
                                    <div className="text-3xl mb-2">🛒</div>
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{t('applenotes_hero_visual_1')}</div>
                                    <div className="text-slate-900 text-xl font-black">{t('applenotes_hero_visual_2')}</div>
                                </div>
                                <div className="text-amber-500 text-2xl font-black">→</div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 w-full text-center">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{t('applenotes_hero_visual_3')}</div>
                                    <div className="text-indigo-600 text-xl font-black">{t('applenotes_hero_visual_4')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] px-6 bg-white border-t border-slate-100">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('applenotes_prob_title_1')} <span className="text-amber-600">{t('applenotes_prob_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('applenotes_prob_desc')}
                            </p>
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-6">
                                <p className="font-bold text-amber-800 text-sm mb-2">{t('applenotes_prob_visual_1')}</p>
                                <p className="text-amber-700/80 text-sm italic">{t('applenotes_prob_visual_2')}</p>
                                <div className="mt-4 pt-4 border-t border-amber-200/50 flex gap-2">
                                    <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('applenotes_prob_visual_3')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="order-1 md:order-2 relative h-[400px] flex items-center justify-center bg-slate-50 rounded-[3rem] border border-slate-100 p-8">
                            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform rotate-2">
                                <div className="bg-amber-400 h-2 w-full"></div>
                                <div className="p-6">
                                    <div className="text-xs font-bold text-slate-400 mb-4">{t('applenotes_prob_visual_4')}</div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-4">{t('applenotes_prob_visual_5')}</h3>
                                    <ul className="space-y-3 text-slate-600 font-medium">
                                        <li className="flex items-center gap-3"><div className="w-4 h-4 border-2 border-slate-300 rounded-sm"></div> {t('applenotes_prob_visual_6')}</li>
                                        <li className="flex items-center gap-3"><div className="w-4 h-4 border-2 border-slate-300 rounded-sm"></div> {t('applenotes_prob_visual_7')}</li>
                                        <li className="flex items-center gap-3"><div className="w-4 h-4 border-2 border-slate-300 rounded-sm"></div> {t('applenotes_prob_visual_8')}</li>
                                    </ul>
                                    <div className="mt-8 text-center border-2 border-dashed border-red-200 bg-red-50 text-red-500 rounded-xl py-3 font-bold text-sm transform -rotate-6 scale-110 shadow-sm">
                                        {t('applenotes_prob_visual_9')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] px-6 bg-amber-50">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[500px] flex items-center justify-center bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8">
                            <div className="w-full space-y-4">
                                {/* Interactive Habit Mockup */}
                                <div className="bg-slate-900 rounded-2xl p-4 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-white font-bold text-sm">{t('applenotes_sol_visual_1')}</div>
                                        <div className="text-xs font-black text-emerald-400 bg-emerald-400/20 px-2 py-1 rounded-md">{t('applenotes_sol_visual_2')}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(7)].map((_, i) => (
                                            <div key={i} className="h-6 flex-1 rounded-sm bg-emerald-500"></div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Interactive Finance Mockup */}
                                <div className="bg-indigo-50 rounded-2xl p-4 shadow-lg border border-indigo-100 transform rotate-2 hover:rotate-0 transition-transform">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-indigo-900 font-bold text-sm">{t('applenotes_sol_visual_3')}</div>
                                        <div className="text-xs font-black text-indigo-600">$12 / $50</div>
                                    </div>
                                    <div className="w-full bg-indigo-200 rounded-full h-2">
                                        <div className="bg-indigo-600 h-2 rounded-full w-1/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('applenotes_sol_title_1')} <span className="text-indigo-600">{t('applenotes_sol_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('applenotes_sol_desc')}
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl shrink-0">📊</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t('applenotes_sol_point_1_title')}</h4>
                                        <p className="text-sm text-slate-500">{t('applenotes_sol_point_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl shrink-0">🔔</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t('applenotes_sol_point_2_title')}</h4>
                                        <p className="text-sm text-slate-500">{t('applenotes_sol_point_2_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: THE GAP IN NATIVE APPS */}
                <section className="py-[80px] px-6 bg-white border-t border-slate-100">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl mb-6">❌</div>
                                <h3 className="font-bold text-slate-900 mb-2">{t('applenotes_gap_title')}</h3>
                                <p className="text-slate-500 text-sm">{t('applenotes_gap_desc')}</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl mb-6">❌</div>
                                <h3 className="font-bold text-slate-900 mb-2">{t('applenotes_gap_title_2')}</h3>
                                <p className="text-slate-500 text-sm">{t('applenotes_gap_desc_2')}</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl mb-6">❌</div>
                                <h3 className="font-bold text-slate-900 mb-2">{t('applenotes_gap_title_3')}</h3>
                                <p className="text-slate-500 text-sm">{t('applenotes_gap_desc_3')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TRANVAS ADVANTAGE */}
                <section className="py-[80px] px-6 bg-slate-950 text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                            {t('applenotes_adv_title')}
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-10 max-w-2xl mx-auto">
                            {t('applenotes_adv_desc')}
                        </p>
                        <div className="inline-block bg-slate-900 border border-slate-800 p-2 rounded-full">
                            <div className="flex items-center gap-4 px-4 py-2">
                                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="font-bold text-sm text-slate-300">{t('applenotes_adv_badge')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Apple Notes Alternative
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-amber-600' : 'text-slate-400'}`} size={20} />
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
                <section className="py-[80px] px-6 bg-white text-center border-t border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">{t('applenotes_cta_title')}</h2>
                        <Link href="/register" className="inline-block bg-slate-900 text-white px-12 py-5 rounded-full text-xl hover:bg-amber-600 transition transform hover:-translate-y-1 shadow-xl font-bold">
                            {t('applenotes_cta_btn')}
                        </Link>
                    </div>
                </section>

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-8 px-6 bg-slate-900 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium">
                            <span className="text-slate-400 py-2">Compare Notes Apps:</span>
                            <Link href="/compare/evernote" className="text-slate-400 hover:text-emerald-400 py-2 px-4 rounded-lg hover:bg-emerald-900/30 transition">Evernote</Link>
                            <Link href="/compare/applenotes" className="text-amber-400 font-bold py-2 px-4 rounded-lg bg-amber-900/30 border border-amber-500/20">Apple Notes</Link>
                            <Link href="/compare/onenote" className="text-slate-400 hover:text-purple-400 py-2 px-4 rounded-lg hover:bg-purple-900/30 transition">OneNote</Link>
                        </div>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
