'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function SpendeeComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_spendee_q1'),
            a: t('faq_spendee_a1'),
        },
        {
            q: 'Apakah Tranvas bisa menggantikan Spendee untuk tracking pengeluaran harian?',
            a: 'Tranvas menyediakan modul Finance yang memungkinkan Anda mencatat pengeluaran harian dan melihat ringkasan bulanan. Namun jika Anda butuh fitur bank sync otomatis atau analitik pengeluaran yang sangat detail, Spendee masih unggul di sisi tersebut. Tranvas unggul saat Anda ingin menghubungkan pengeluaran dengan kebiasaan dan tujuan hidup.',
        },
        {
            q: 'Bisakah Tranvas membantu saya memahami MENGAPA saya overspend?',
            a: 'Ya! Inilah keunggulan utama Tranvas. Karena financial tracker, habit tracker, dan daily planner Anda berada dalam satu sistem, Anda bisa melihat korelasi: misalnya overspending pada hari-hari di mana Anda melewatkan kebiasaan olahraga atau tidur kurang dari 6 jam.',
        },
    ];

    return (
        <GuestLayout>
            <main id="spendee-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Dark Slate, Text Center, Visual Bottom) */}
                <header className="pt-32 pb-0 px-6 overflow-hidden bg-slate-950 relative border-b border-purple-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.15)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                    <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-16">
                        <div className="mb-4">
                            <span className="text-purple-400 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_spendee')}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 text-purple-300 font-bold text-xs mb-8 uppercase tracking-wider border border-purple-500/30">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                            {t('spendee_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                            {t('spendee_hero_title_1')} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('spendee_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('spendee_hero_desc') }} />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-purple-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]">
                                {t('spendee_hero_cta')}
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 font-medium">{t('spendee_hero_note')}</p>
                    </div>

                    {/* Visual Bottom */}
                    <div className="max-w-5xl mx-auto relative z-10 translate-y-12 hover:translate-y-4 transition-transform duration-700 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-300">
                        <div className="bg-slate-900 border border-slate-800 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(168,85,247,0.15)] p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-purple-500/30 rounded-b-full"></div>
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full text-center">
                                    <div className="text-3xl mb-2">💰</div>
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Finance</div>
                                    <div className="text-white text-xl font-black">$2,450</div>
                                </div>
                                <div className="text-purple-500 text-2xl font-black">↔️</div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full text-center">
                                    <div className="text-3xl mb-2">🌱</div>
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Habits</div>
                                    <div className="text-emerald-400 text-xl font-black">85% Completion</div>
                                </div>
                                <div className="text-purple-500 text-2xl font-black">↔️</div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full text-center">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Planner</div>
                                    <div className="text-white text-xl font-black">3 Focus Tasks</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">?</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('spendee_prob_title_1')} <span className="text-red-500">{t('spendee_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('spendee_prob_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('spendee_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('spendee_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('spendee_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-900 p-8 rounded-3xl border-4 border-slate-800 shadow-2xl transform rotate-3">
                            <div className="text-center font-bold text-white mb-4 text-xl">Monthly Food Spending</div>
                            <div className="flex justify-center mb-6">
                                <div className="w-40 h-40 rounded-full border-8 border-red-500 flex items-center justify-center">
                                    <span className="text-3xl text-red-500 font-black">75%</span>
                                </div>
                            </div>
                            <p className="text-slate-400 font-mono text-sm text-center">&quot;Great pie chart. But WHY did I spend so much?&quot;</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-purple-50">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-purple-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">💡</div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400">AI Context</div>
                                    <div className="text-xl font-black text-slate-800">Root Cause Found</div>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <span>❌ Missed: Meal Prep Habit</span>
                                    <span className="text-red-500 font-bold">Tuesday</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>💸 Expense: Delivery Food</span>
                                    <span className="text-red-500 font-bold">Tuesday</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('spendee_sol_title_1')} <span className="text-purple-600">{t('spendee_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('spendee_sol_desc')}
                            </p>
                            <div className="grid gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{t('spendee_sol_1_title')}</h3>
                                    <p className="text-slate-500 text-sm">{t('spendee_sol_1_desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{t('spendee_sol_2_title')}</h3>
                                    <p className="text-slate-500 text-sm">{t('spendee_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: AI & COST */}
                <section className="py-[80px] bg-slate-900 text-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                            <div>
                                <div className="text-purple-400 font-bold tracking-widest uppercase mb-4 text-sm">Neural Engine</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">{t('spendee_ai_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">{t('spendee_ai_desc')}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-10 rounded-[3rem] text-center shadow-2xl relative">
                                <div className="absolute inset-0 bg-white/5 rounded-[3rem]"></div>
                                <div className="text-4xl mb-4 relative z-10">🧠</div>
                                <div className="text-white font-bold text-lg italic relative z-10">&quot;You overspend on days you are stressed. Let&apos;s schedule a walk in your planner.&quot;</div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 bg-slate-800 p-8 rounded-3xl shadow-xl relative border border-slate-700">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-400 line-through"><span>Spendee Sub</span> <span>$20/yr</span></div>
                                    <div className="flex justify-between text-slate-400 line-through"><span>Habit App Sub</span> <span>$40/yr</span></div>
                                    <div className="flex justify-between text-slate-400 line-through border-b border-slate-700 pb-4"><span>Planner App Sub</span> <span>$50/yr</span></div>
                                    <div className="flex justify-between text-white font-bold text-xl"><span>Tranvas</span> <span className="text-purple-400">Better.</span></div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="text-pink-500 font-bold tracking-widest uppercase mb-4 text-sm">Consolidation</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">{t('spendee_cost_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">{t('spendee_cost_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('spendee_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('spendee_compare_desc')}</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-6 text-center font-black text-sm uppercase tracking-widest">
                                <div className="text-left text-slate-400">Features</div>
                                <div className="text-slate-400">{t('spendee_table_head_2')}</div>
                                <div className="text-purple-600">Tranvas</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700">{t('spendee_table_row_1_title')}</div>
                                <div className="text-slate-500">{t('spendee_table_row_1_col_1')}</div>
                                <div className="font-bold text-purple-600 bg-purple-50 py-2 rounded-lg">{t('spendee_table_row_1_col_2')}</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700">{t('spendee_table_row_2_title')}</div>
                                <div className="text-slate-500">{t('spendee_table_row_2_col_1')}</div>
                                <div className="font-bold text-purple-600 bg-purple-50 py-2 rounded-lg">{t('spendee_table_row_2_col_2')}</div>
                            </div>
                            <div className="grid grid-cols-3 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700">{t('spendee_table_row_3_title')}</div>
                                <div className="text-slate-500">{t('spendee_table_row_3_col_1')}</div>
                                <div className="font-bold text-purple-600 bg-purple-50 py-2 rounded-lg">{t('spendee_table_row_3_col_2')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: EXPLORE MORE */}
                <section className="py-[80px] bg-gray-50 border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('explore_more_alt')}</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }} className="text-gray-500">{t('explore_more_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Link href="/compare/ynab" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-black">📈</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-purple-600 transition-colors">vs YNAB</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_ynab_desc')}</p>
                            </Link>
                            <Link href="/compare/wallet" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">💳</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-purple-600 transition-colors">vs Wallet App</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_wallet_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Spendee Alternative
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
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 7: CTA */}
                <section className="py-[80px] bg-purple-600 text-center px-6">
                    <h2 className="text-4xl md:text-6xl text-white font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('spendee_cta_title') }} />
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-purple-200 mb-10">{t('spendee_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-white text-purple-900 font-black px-10 py-4 rounded-xl shadow-2xl hover:scale-105 transition-transform">{t('spendee_cta_btn')}</Link>
                </section>
            </main>
        </GuestLayout>
    );
}
