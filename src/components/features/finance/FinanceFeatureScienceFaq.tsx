'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

interface FinanceFeatureScienceFaqProps {
    t: any;
}

export default function FinanceFeatureScienceFaq({ t }: FinanceFeatureScienceFaqProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('finance_faq_q1'),
            a: t('finance_faq_a1')
        },
        {
            q: t('finance_faq_q2'),
            a: t('finance_faq_a2')
        },
        {
            q: t('finance_faq_q3'),
            a: t('finance_faq_a3')
        }
    ];

    return (
        <>
            {/* SECTION 6: THE SUCCESS QUOTE */}
            <section className="py-32 bg-white bg-pattern-grid relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-9xl text-indigo-50 mb-4 font-serif leading-none italic select-none">"</div>
                    <h2 className="text-4xl md:text-5xl text-gray-900 leading-[1.4] mb-12 tracking-tight italic font-serif font-black">
                        {t('finance_quote_text')}
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-2 bg-indigo-600 mb-8 rounded-full shadow-lg shadow-indigo-200"></div>
                        <p className="text-indigo-600 tracking-[0.5em] uppercase text-xs font-bold">{t('finance_quote_author')}</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">{t('finance_quote_legend')}</p>
                    </div>
                </div>
            </section>

            {/* SECTION: SCIENTIFIC PILLAR - BEHAVIORAL ECONOMICS & MENTAL ACCOUNTING */}
            <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
                
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] uppercase tracking-[0.25em] mb-6 border border-amber-500/20">
                            💰 Behavioral Economics Architecture
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[900] tracking-tight leading-tight mb-6">
                            {t('finance_science_title_1')}{' '}
                            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                                {t('finance_science_title_highlight')}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            Tranvas applies Nobel Prize-winning behavioral decision frameworks to construct frictionless budgeting vaults that protect long-term wealth.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                        {/* Left: Nobel Quote & Impact Box */}
                        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 p-8 lg:p-12 rounded-[2.5rem] flex flex-col justify-between group shadow-2xl relative overflow-hidden">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl mb-8">
                                    🏆
                                </div>
                                <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed italic mb-8">
                                    "{t('finance_science_quote_text')}"
                                </p>
                            </div>
                            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-400">
                                    {t('finance_science_quote_author')}
                                </span>
                                <span className="text-xs font-mono text-slate-500">Journal of Behavioral Decision Making</span>
                            </div>
                        </div>

                        {/* Right: 3 Pillars Architecture */}
                        <div className="lg:col-span-5 flex flex-col gap-4">
                            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:border-amber-500/40 transition">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl font-bold">1</div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{t('finance_science_pillar1')}</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Partitioning funds into rigid psychological envelopes.</p>
                                </div>
                            </div>

                            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:border-orange-500/40 transition">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl font-bold">2</div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{t('finance_science_pillar2')}</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Creating micro-friction before non-essential purchases.</p>
                                </div>
                            </div>

                            <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:border-rose-500/40 transition">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl font-bold">3</div>
                                <div>
                                    <h4 className="font-bold text-white text-base">{t('finance_science_pillar3')}</h4>
                                    <p className="text-slate-400 text-xs mt-0.5">Continuous cognitive feedback on net worth velocity.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 8: CTA BANNER */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl border border-indigo-800">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"></div>
                    
                    <div className="relative z-10 text-white">
                        <h2 className="text-5xl md:text-6xl mb-8 tracking-tight font-black">{t('finance_cta_title')}</h2>
                        <p className="text-indigo-200 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium">
                            {t('finance_cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                            <Link href="/register" className="w-full sm:w-auto bg-white text-indigo-900 px-12 py-5 rounded-full text-lg hover:bg-indigo-50 transition transform hover:scale-105 shadow-xl shadow-indigo-900/50 font-bold">
                                {t('finance_cta_btn')}
                            </Link>
                        </div>
                        <p className="mt-8 text-sm text-indigo-300 font-medium">{t('finance_cta_note')}</p>
                    </div>
                </div>
            </section>

            {/* Mandatory FAQ Section */}
            <section className="py-28 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center font-black">
                        Pertanyaan Finance OS (FAQ)
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
        </>
    );
}
