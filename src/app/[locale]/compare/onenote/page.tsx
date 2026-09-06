'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown, Check, X } from 'lucide-react';

export default function OneNoteComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_onenote_q1'),
            a: t('faq_onenote_a1')
        },
        {
            q: 'Can I use Tranvas alongside OneNote for different purposes?',
            a: 'Yes! Microsoft OneNote is great as an unstructured scrapbook for meeting audio, stylus drawings, and infinite whiteboard notes. Tranvas acts as your intentional Life Operating System where habits, daily schedules, financial tracking, and goals are strictly organized for execution.'
        },
        {
            q: 'Why does Tranvas avoid free-form infinite canvases?',
            a: 'Infinite freedom introduces continuous cognitive load and decision fatigue. Tranvas uses structured, opinionated layouts so you never waste time formatting pages, creating custom tables, or aligning boxes—you focus directly on building momentum.'
        }
    ];

    return (
        <GuestLayout>
            <main id="onenote-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-purple-50/50 relative border-b border-purple-100">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="mb-4">
                                <span className="text-purple-600 font-bold text-sm tracking-widest uppercase opacity-70">
                                    {t('seo_eyebrow_onenote')}
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-xs mb-8 uppercase tracking-wider border border-purple-200">
                                📓 {t('onenote_badge')}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {t('onenote_hero_title_1')} <br/>
                                <span className="text-purple-600">{t('onenote_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('onenote_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-purple-600 transition-colors shadow-xl hover:shadow-purple-500/30 hover:-translate-y-1 transform">
                                    {t('onenote_hero_cta')}
                                </Link>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 font-medium">{t('onenote_hero_note')}</p>
                        </div>

                        <div className="relative h-[420px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="absolute w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative w-full max-w-md bg-white border-2 border-purple-100 rounded-3xl p-6 shadow-2xl space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="font-bold text-slate-900 text-sm">{t('onenote_hero_visual_1')}</span>
                                    <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">Active System</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">💰 {t('onenote_hero_visual_2')}</span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{t('onenote_hero_visual_3')}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">🌱 {t('onenote_hero_visual_4')}</span>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{t('onenote_hero_visual_5')}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">🎯 {t('onenote_hero_visual_6')}</span>
                                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{t('onenote_hero_visual_7')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] px-6 bg-white">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[380px] flex items-center justify-center bg-slate-50 rounded-[3rem] border border-slate-100 p-8 overflow-hidden">
                            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg border border-slate-200 rotate-2 space-y-3">
                                <div className="text-xs font-black uppercase tracking-wider text-slate-400">OneNote Infinite Page</div>
                                <div className="border border-dashed border-slate-300 p-3 rounded-lg text-xs text-slate-500 font-mono">
                                    {t('onenote_prob_visual_1')}: {t('onenote_prob_visual_3')} | {t('onenote_prob_visual_2')}: $45<br/>
                                    {t('onenote_prob_visual_1')}: {t('onenote_prob_visual_4')} | {t('onenote_prob_visual_2')}: $30
                                </div>
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center">
                                    ⚠️ {t('onenote_prob_visual_5')}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('onenote_prob_title_1')} <span className="text-purple-600">{t('onenote_prob_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('onenote_prob_desc')}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold shrink-0">✕</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t('onenote_prob_point_1_title')}</h4>
                                        <p className="text-sm text-slate-500">{t('onenote_prob_point_1_desc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold shrink-0">✕</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t('onenote_prob_point_2_title')}</h4>
                                        <p className="text-sm text-slate-500">{t('onenote_prob_point_2_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] px-6 bg-purple-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                                {t('onenote_sol_title_1')} <span className="text-purple-400">{t('onenote_sol_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-purple-200">
                                {t('onenote_sol_desc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-900/90 border border-purple-900/50 rounded-3xl p-8 hover:border-purple-500/50 transition-colors">
                                <div className="w-14 h-14 bg-purple-900/50 text-purple-400 rounded-2xl flex items-center justify-center text-2xl mb-6">📊</div>
                                <h3 className="text-xl font-bold mb-3">{t('onenote_sol_point_1')}</h3>
                                <p className="text-purple-200/80 text-sm leading-relaxed">{t('onenote_sol_visual_1')} &mdash; {t('onenote_sol_visual_2')}</p>
                            </div>
                            <div className="bg-slate-900/90 border border-purple-900/50 rounded-3xl p-8 hover:border-purple-500/50 transition-colors transform md:-translate-y-4">
                                <div className="w-14 h-14 bg-purple-900/50 text-purple-400 rounded-2xl flex items-center justify-center text-2xl mb-6">⚡</div>
                                <h3 className="text-xl font-bold mb-3">{t('onenote_sol_point_2')}</h3>
                                <p className="text-purple-200/80 text-sm leading-relaxed">{t('onenote_sol_visual_3')} &mdash; {t('onenote_sol_visual_4')}</p>
                            </div>
                            <div className="bg-slate-900/90 border border-purple-900/50 rounded-3xl p-8 hover:border-purple-500/50 transition-colors">
                                <div className="w-14 h-14 bg-purple-900/50 text-purple-400 rounded-2xl flex items-center justify-center text-2xl mb-6">🎯</div>
                                <h3 className="text-xl font-bold mb-3">{t('onenote_sol_point_3')}</h3>
                                <p className="text-purple-200/80 text-sm leading-relaxed">Pre-wired systems for habits, daily schedules, and multi-currency finances.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: FEATURE COMPARISON */}
                <section className="py-[80px] px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-4">
                                Side-by-Side Comparison
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">
                                How Microsoft OneNote compares with Tranvas Life OS
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-6 text-xs text-slate-500 uppercase tracking-widest w-1/3">Feature Capability</th>
                                        <th className="p-6 text-xs text-slate-500 uppercase tracking-widest w-1/3">{t('onenote_feat_title_1')}</th>
                                        <th className="p-6 text-xs text-purple-600 font-black uppercase tracking-widest w-1/3 bg-purple-50/50">{t('onenote_feat_title_2')}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('onenote_feat_point_1_title')}</td>
                                        <td className="p-6 text-slate-500">{t('onenote_feat_point_1_desc')}</td>
                                        <td className="p-6 font-bold text-purple-600 bg-purple-50/30">{t('onenote_feat_point_3_title')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('onenote_feat_point_2_title')}</td>
                                        <td className="p-6 text-slate-500">{t('onenote_feat_point_2_desc')}</td>
                                        <td className="p-6 font-bold text-purple-600 bg-purple-50/30">{t('onenote_feat_point_4_title')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-800">Setup & Maintenance</td>
                                        <td className="p-6 text-slate-500">Manual templates & blank pages</td>
                                        <td className="p-6 font-bold text-purple-600 bg-purple-50/30">Zero setup, automated routines</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: THE COST OF BLANK PAGES */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                            {t('onenote_cost_title')}
                        </h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-10 max-w-2xl mx-auto">
                            {t('onenote_cost_desc')}
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                                <Check className="text-purple-600 w-5 h-5 shrink-0" />
                                <span className="font-bold text-sm text-slate-700">{t('onenote_cost_point_1')}</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                                <Check className="text-purple-600 w-5 h-5 shrink-0" />
                                <span className="font-bold text-sm text-slate-700">{t('onenote_cost_point_2')}</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                                <Check className="text-purple-600 w-5 h-5 shrink-0" />
                                <span className="font-bold text-sm text-slate-700">{t('onenote_cost_point_3')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ &mdash; OneNote Alternative
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-purple-600' : 'text-slate-400'}`} size={20} />
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

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                            <span className="text-slate-400 py-2">Compare Notes Apps:</span>
                            <Link href="/compare/evernote" className="text-slate-600 hover:text-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-50 transition">Evernote</Link>
                            <Link href="/compare/applenotes" className="text-slate-600 hover:text-amber-600 py-2 px-4 rounded-lg hover:bg-amber-50 transition">Apple Notes</Link>
                            <Link href="/compare/onenote" className="text-purple-600 font-bold py-2 px-4 rounded-lg bg-purple-50">OneNote</Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: CTA */}
                <section className="py-[80px] px-6 bg-white text-center border-t border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">{t('onenote_cta_title')}</h2>
                        <Link href="/register" className="inline-block bg-purple-600 text-white px-12 py-5 rounded-full text-xl hover:bg-purple-700 transition transform hover:-translate-y-1 shadow-[0_20px_40px_rgba(168,85,247,0.3)] font-bold">
                            {t('onenote_cta_btn')}
                        </Link>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
