'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function YnabComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_ynab_q1'),
            a: t('faq_ynab_a1'),
        },
        {
            q: t('faq_ynab_q2'),
            a: t('faq_ynab_a2'),
        },
        {
            q: t('faq_ynab_q3'),
            a: t('faq_ynab_a3'),
        },
    ];

    return (
        <GuestLayout>
            <main id="ynab-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Visual Left, Text Right, Dark Slate Theme) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-slate-900 relative border-b border-slate-800">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl -z-10" style={{ transform: 'translate(-20%, -20%)' }}></div>

                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        {/* Visual Left */}
                        <div className="order-2 lg:order-1 relative h-[400px] lg:h-[500px] flex items-center justify-center">
                            <div className="absolute w-64 h-64 bg-indigo-600 rounded-[2.5rem] transform -rotate-12 shadow-[0_0_50px_rgba(79,70,229,0.3)]"></div>
                            <div className="absolute w-64 h-64 bg-slate-800 rounded-[2.5rem] transform rotate-6 border border-slate-700 shadow-2xl p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-xl border border-indigo-500/30">💰</div>
                                    <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">On Track</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white mb-2">$0.00</div>
                                    <div className="text-sm text-slate-400">Zero-Based Budgeting</div>
                                </div>
                                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-indigo-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Text Right */}
                        <div className="order-1 lg:order-2 text-left">
                            <div className="mb-4">
                                <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_ynab')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs mb-8 uppercase tracking-wider border border-indigo-500/30">
                                💸 {t('ynab_badge')}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                                {t('ynab_hero_title_1')} <br/>
                                <span className="text-indigo-400">{t('ynab_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('ynab_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:-translate-y-1 transform">
                                    {t('ynab_hero_cta')}
                                </Link>
                                <p className="mt-4 text-xs text-slate-500 font-medium">{t('ynab_hero_note')}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-200 relative group">
                            <div className="text-center text-4xl mb-4 font-mono text-slate-400 group-hover:scale-105 transition-transform">
                                [ Spreadsheet Hell ]
                            </div>
                            <div className="space-y-2 font-mono text-xs text-slate-400">
                                <div className="bg-white p-2 border border-slate-200">Row 45: Coffee $4.50 - Assign Category</div>
                                <div className="bg-white p-2 border border-slate-200">Row 46: Gas $30.00 - Assign Category</div>
                                <div className="bg-red-50 p-2 border border-red-200 text-red-500">ERROR: Unassigned Funds</div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('ynab_prob_title_1')} <span className="text-red-500">{t('ynab_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('ynab_prob_desc')}</p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('ynab_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('ynab_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('ynab_prob_point_3')}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 leading-tight">
                                {t('ynab_sol_title_1')} <span className="text-emerald-400">{t('ynab_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">{t('ynab_sol_desc')}</p>
                            <div className="grid gap-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('ynab_sol_1_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('ynab_sol_1_desc')}</p>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('ynab_sol_2_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('ynab_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-slate-700">
                            <div className="w-full h-40 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl mb-6 flex items-center justify-center text-4xl shadow-inner">
                                💰
                            </div>
                            <div className="h-4 bg-slate-700 rounded-full w-full mb-3">
                                <div className="h-full bg-emerald-500 rounded-full w-3/4"></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Budget Safe</span>
                                <span className="text-emerald-400">75%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: PSYCHOLOGY & COST */}
                <section className="py-[80px] bg-white overflow-hidden border-t border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 mb-[80px] items-center">
                            <div className="bg-red-50 p-10 rounded-[3rem] text-center border border-red-100">
                                <div className="text-red-900 font-black text-6xl mb-4">$109/yr</div>
                                <div className="text-red-700 font-bold mb-8">For a glorified spreadsheet.</div>
                                <div className="flex justify-center text-3xl">📉</div>
                            </div>
                            <div>
                                <div className="text-emerald-500 font-bold tracking-widest uppercase mb-4 text-sm">The Absurdity</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('ynab_cost_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('ynab_cost_desc')}</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="text-indigo-500 font-bold tracking-widest uppercase mb-4 text-sm">Behavioral Science</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('ynab_psycho_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('ynab_psycho_desc')}</p>
                            </div>
                            <div className="order-1 lg:order-2 bg-slate-50 p-8 rounded-3xl shadow-xl relative border border-slate-200">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-black">🧠</div>
                                    <div>
                                        <div className="font-bold text-slate-900">Decision Fatigue</div>
                                        <div className="text-sm text-slate-500">Cognitive Load</div>
                                    </div>
                                </div>
                                <p className="text-slate-600 italic">&quot;Micro-managing every single dollar leads to burnout. Visual macro-budgets keep you aware without the exhaustion.&quot;</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('ynab_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('ynab_compare_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl border border-slate-200 bg-white opacity-80">
                                <h3 className="font-black text-slate-400 uppercase tracking-widest mb-8 text-center">{t('ynab_table_head_2')}</h3>
                                <ul className="space-y-6">
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('ynab_table_row_1_title')}</div>
                                        <div className="text-slate-700">{t('ynab_table_row_1_col_1')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('ynab_table_row_2_title')}</div>
                                        <div className="text-slate-700">{t('ynab_table_row_2_col_1')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('ynab_table_row_3_title')}</div>
                                        <div className="text-slate-700">{t('ynab_table_row_3_col_1')}</div>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-8 rounded-3xl border-2 border-emerald-500 bg-white shadow-xl shadow-emerald-100 relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">OneForMind</div>
                                <ul className="space-y-6 mt-4">
                                    <li>
                                        <div className="text-xs text-emerald-500 font-bold uppercase mb-1">{t('ynab_table_row_1_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('ynab_table_row_1_col_2')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-emerald-500 font-bold uppercase mb-1">{t('ynab_table_row_2_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('ynab_table_row_2_col_2')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-emerald-500 font-bold uppercase mb-1">{t('ynab_table_row_3_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('ynab_table_row_3_col_2')}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: EXPLORE MORE */}
                <section className="py-[80px] bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('explore_more_alt')}</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }} className="text-gray-500">{t('explore_more_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Link href="/compare/wallet" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">💳</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs Wallet App</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_wallet_desc')}</p>
                            </Link>
                            <Link href="/compare/spendee" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">📊</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">vs Spendee</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_spendee_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - YNAB Alternative
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
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 7: CTA */}
                <section className="py-[80px] bg-slate-50 text-center px-6 border-t border-slate-200">
                    <h2 className="text-4xl md:text-6xl text-slate-900 font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('ynab_cta_title') }} />
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-10">{t('ynab_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-emerald-600 text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 transition-transform">{t('ynab_cta_btn')}</Link>
                </section>
            </main>
        </GuestLayout>
    );
}
