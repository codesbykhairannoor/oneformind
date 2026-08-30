'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function WalletComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_wallet_q1'),
            a: t('faq_wallet_a1'),
        },
        {
            q: 'Apakah Tranvas mendukung bank sync otomatis seperti Wallet?',
            a: 'Saat ini Tranvas menggunakan pendekatan manual yang disengaja. Bank sync otomatis menghilangkan gesekan (friction) yang membuat Anda sadar setiap pengeluaran. Dengan mencatat manual, Anda aktif memproses setiap transaksi, yang secara psikologis terbukti membuat Anda lebih hemat.',
        },
        {
            q: 'Bisakah Tranvas membantu saya memahami hubungan antara pengeluaran dan kebiasaan?',
            a: 'Ya! Ini adalah keunggulan utama Tranvas. Karena data keuangan dan habit tracker berada dalam satu sistem yang sama, Anda bisa melihat korelasi langsung: misalnya pengeluaran delivery food meningkat di hari-hari ketika Anda melewatkan kebiasaan memasak.',
        },
    ];

    return (
        <GuestLayout>
            <main id="wallet-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Text Left, Visual Right) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-white relative border-b border-blue-100">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="mb-4">
                                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_wallet')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm">
                                {t('wallet_badge')}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {t('wallet_hero_title_1')} <br/>
                                <span className="text-blue-600">{t('wallet_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('wallet_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-blue-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1">
                                    {t('wallet_hero_cta')}
                                </Link>
                                <p className="mt-4 text-xs text-slate-400 font-bold self-center sm:self-auto">{t('wallet_hero_note')}</p>
                            </div>
                        </div>

                        <div className="relative h-[500px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="absolute w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 w-80 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 font-black">💸</div>
                                    <h3 className="font-bold text-slate-900 text-xl">Log Expense</h3>
                                    <p className="text-sm text-slate-400">Feel every transaction.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Coffee</span>
                                        <span className="font-bold text-slate-900">$4.50</span>
                                    </div>
                                    <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform cursor-default">
                                        Confirm Purchase
                                    </button>
                                </div>
                                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-xl animate-bounce">
                                    💡
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-slate-50 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">🤖</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('wallet_prob_title_1')} <span className="text-red-500">{t('wallet_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('wallet_prob_desc')}</p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('wallet_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('wallet_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('wallet_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative text-center">
                            <div className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Auto-Sync Report</div>
                            <div className="space-y-3">
                                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 line-through">-$50 Coffee (3 days ago)</div>
                                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 line-through">-$120 Shoes (5 days ago)</div>
                                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 line-through">-$80 Dinner (1 week ago)</div>
                            </div>
                            <div className="mt-6 text-xs text-slate-400 italic">&quot;I didn&apos;t even realize I spent this much.&quot;</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-blue-600 text-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-blue-800 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-blue-700">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-black">✍️</div>
                            <h3 className="font-black text-3xl mb-8 relative z-10">Active Intent</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="text-2xl">⏳</div>
                                    <div>
                                        <div className="font-bold">5 Seconds of Friction</div>
                                        <div className="text-xs text-blue-200">Forces you to think before you buy</div>
                                    </div>
                                </div>
                                <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="text-2xl">🧠</div>
                                    <div>
                                        <div className="font-bold">Neural Awareness</div>
                                        <div className="text-xs text-blue-200">Connects the purchase to your budget</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 leading-tight">
                                {t('wallet_sol_title_1')} <span className="text-blue-300">{t('wallet_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-blue-100 mb-8 leading-relaxed">{t('wallet_sol_desc')}</p>
                            <div className="grid gap-6">
                                <div className="bg-blue-700/50 p-6 rounded-2xl border border-blue-500/50">
                                    <h3 className="font-bold text-lg mb-2">{t('wallet_sol_1_title')}</h3>
                                    <p className="text-blue-200 text-sm">{t('wallet_sol_1_desc')}</p>
                                </div>
                                <div className="bg-blue-700/50 p-6 rounded-2xl border border-blue-500/50">
                                    <h3 className="font-bold text-lg mb-2">{t('wallet_sol_2_title')}</h3>
                                    <p className="text-blue-200 text-sm">{t('wallet_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: PSYCHOLOGY */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-black">💸</div>
                                        <div>
                                            <div className="font-bold text-slate-900">Cashless Effect</div>
                                            <div className="text-sm text-slate-500">Cognitive Bias</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 italic">&quot;The less it feels like spending money, the more you spend. Automation removes the pain of paying, leading to overspending.&quot;</p>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">Behavioral Science</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('wallet_science_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('wallet_science_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('wallet_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('wallet_compare_desc')}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-6 text-slate-400 font-black uppercase tracking-widest text-sm">Feature</th>
                                        <th className="p-6 text-slate-400 font-black uppercase tracking-widest text-sm w-1/3">{t('wallet_table_head_2')}</th>
                                        <th className="p-6 text-blue-600 font-black uppercase tracking-widest text-sm w-1/3 bg-blue-50/50">Tranvas</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('wallet_table_row_1_title')}</td>
                                        <td className="p-6">{t('wallet_table_row_1_col_1')}</td>
                                        <td className="p-6 font-bold text-blue-600 bg-blue-50/50">{t('wallet_table_row_1_col_2')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('wallet_table_row_2_title')}</td>
                                        <td className="p-6 text-red-500">{t('wallet_table_row_2_col_1')}</td>
                                        <td className="p-6 font-bold text-blue-600 bg-blue-50/50">{t('wallet_table_row_2_col_2')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-800">{t('wallet_table_row_3_title')}</td>
                                        <td className="p-6 text-red-500">{t('wallet_table_row_3_col_1')}</td>
                                        <td className="p-6 font-bold text-blue-600 bg-blue-50/50">{t('wallet_table_row_3_col_2')}</td>
                                    </tr>
                                </tbody>
                            </table>
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
                            <Link href="/compare/ynab" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-black">📈</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs YNAB</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_ynab_desc')}</p>
                            </Link>
                            <Link href="/compare/spendee" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">📊</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs Spendee</h3>
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
                            FAQ - Wallet App Alternative
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} size={20} />
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
                <section className="py-[80px] bg-white text-center px-6 border-t border-slate-200">
                    <h2 className="text-4xl md:text-6xl text-slate-900 font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('wallet_cta_title') }} />
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-10 max-w-2xl mx-auto">{t('wallet_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-blue-600 text-white font-black px-12 py-5 rounded-2xl shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-105 hover:bg-blue-700 transition-all">{t('wallet_cta_btn')}</Link>
                </section>
            </main>
        </GuestLayout>
    );
}
