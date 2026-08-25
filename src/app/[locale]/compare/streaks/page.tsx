'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function StreaksComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const heatmapColors = Array.from({ length: 28 }, (_, i) => {
        if (i === 14) return 'bg-slate-700';
        return 'bg-indigo-500';
    });

    const heroColors = Array.from({ length: 28 }, (_, i) => {
        if (i === 12 || i === 13 || i === 20) return 'bg-slate-100';
        if (i % 7 === 0) return 'bg-emerald-500';
        if (i % 3 === 0) return 'bg-emerald-300';
        return 'bg-emerald-100';
    });

    const faqs = [
        {
            q: t('faq_streaks_q1'),
            a: t('faq_streaks_a1'),
        },
        {
            q: 'Apa yang terjadi dengan streak saya di OneForMind jika saya melewatkan satu hari?',
            a: 'OneForMind menggunakan "Consistency Rate" bukan streak. Satu hari terlewat tidak menghancurkan segalanya — sistem menghitung persentase konsistensi Anda selama 30 hari. Ini mencegah efek psikologis "What the Hell" yang umum terjadi pada aplikasi berbasis streak.',
        },
        {
            q: 'Apakah OneForMind hanya tersedia di iOS seperti Streaks?',
            a: 'Tidak. OneForMind adalah aplikasi web yang bisa diakses di semua perangkat — iOS, Android, desktop, dan browser manapun. Tidak perlu download, langsung akses dari mana saja.',
        },
    ];

    return (
        <GuestLayout>
            <main id="streaks-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Text Right, Visual Left) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-slate-50 relative border-b border-slate-200">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

                        {/* Visual Left */}
                        <div className="order-2 lg:order-1 relative h-[400px] flex items-center justify-center animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
                            <div className="absolute w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-8 w-80 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="text-center mb-6">
                                    <div className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Consistency Over Perfection</div>
                                </div>
                                <div className="grid grid-cols-7 gap-2 mb-6">
                                    {heroColors.map((color, i) => (
                                        <div key={i} className={`w-full aspect-square rounded-sm ${color}`}></div>
                                    ))}
                                </div>
                                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-sm font-bold text-center">
                                    85% Consistency Rate
                                </div>
                                <div className="absolute -left-6 -top-6 w-16 h-16 bg-white border border-slate-200 text-red-500 rounded-full flex flex-col items-center justify-center shadow-lg opacity-50 grayscale rotate-12">
                                    <span className="text-lg">🔥</span>
                                    <span className="text-[8px] font-black">0</span>
                                </div>
                            </div>
                        </div>

                        {/* Text Right */}
                        <div className="order-1 lg:order-2 text-left animate-in fade-in slide-in-from-right-8 duration-1000">
                            <div className="mb-4">
                                <span className="text-orange-500 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_streaks')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-bold text-xs mb-8 uppercase tracking-wider border border-orange-200">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                {t('streaks_badge')}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {t('streaks_hero_title_1')} <br/>
                                <span className="text-indigo-600 underline decoration-wavy decoration-indigo-200">{t('streaks_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('streaks_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transform">
                                    {t('streaks_hero_cta')}
                                </Link>
                                <p className="mt-4 text-xs text-slate-400 font-medium self-center sm:self-auto">{t('streaks_hero_note')}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-orange-50 p-12 rounded-[3rem] border border-orange-100 relative group">
                            <div className="flex items-center justify-center gap-2 text-4xl mb-8 group-hover:scale-105 transition-transform">
                                <span className="text-orange-500">🔗</span>
                                <span className="text-orange-500">🔗</span>
                                <span className="text-red-500 animate-pulse">💥</span>
                                <span className="text-slate-300">🔗</span>
                            </div>
                            <div className="text-center font-bold text-slate-400">Day 100: You got sick.</div>
                            <div className="text-center font-black text-red-500 text-2xl mt-2">Streak Lost.</div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('streaks_prob_title_1')} <span className="text-orange-500">{t('streaks_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('streaks_prob_desc')}</p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('streaks_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('streaks_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('streaks_prob_point_3')}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 leading-tight">
                                {t('streaks_sol_title_1')} <span className="text-indigo-400">{t('streaks_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">{t('streaks_sol_desc')}</p>
                            <div className="grid gap-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('streaks_sol_1_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('streaks_sol_1_desc')}</p>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('streaks_sol_2_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('streaks_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-slate-700">
                            <div className="grid grid-cols-7 gap-2">
                                {heatmapColors.map((color, i) => (
                                    <div key={i} className={`w-full aspect-square rounded-md ${color}`}></div>
                                ))}
                            </div>
                            <div className="mt-6 text-center text-indigo-400 font-bold text-sm uppercase tracking-widest">27/28 Days (96% Consistency)</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: TABLE (Cards) */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('streaks_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('streaks_compare_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Competitor Card */}
                            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 opacity-80">
                                <h3 className="font-black text-slate-400 uppercase tracking-widest mb-8 text-center">{t('streaks_table_head_2')}</h3>
                                <ul className="space-y-6">
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('streaks_table_row_1_title')}</div>
                                        <div className="text-slate-700">{t('streaks_table_row_1_col_1')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('streaks_table_row_2_title')}</div>
                                        <div className="text-slate-700">{t('streaks_table_row_2_col_1')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('streaks_table_row_3_title')}</div>
                                        <div className="text-slate-700">{t('streaks_table_row_3_col_1')}</div>
                                    </li>
                                </ul>
                            </div>
                            {/* OFM Card */}
                            <div className="p-8 rounded-3xl border-2 border-indigo-500 bg-white shadow-xl shadow-indigo-100 relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">OneForMind</div>
                                <ul className="space-y-6 mt-4">
                                    <li>
                                        <div className="text-xs text-indigo-400 font-bold uppercase mb-1">{t('streaks_table_row_1_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('streaks_table_row_1_col_2')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-indigo-400 font-bold uppercase mb-1">{t('streaks_table_row_2_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('streaks_table_row_2_col_2')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-indigo-400 font-bold uppercase mb-1">{t('streaks_table_row_3_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('streaks_table_row_3_col_2')}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: PSYCHOLOGY & DATA */}
                <section className="py-[80px] bg-white overflow-hidden border-t border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 mb-[80px] items-center">
                            <div className="order-2 lg:order-1 relative">
                                <div className="absolute inset-0 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-black">!</div>
                                        <div>
                                            <div className="font-bold text-slate-900">What The Hell Effect</div>
                                            <div className="text-sm text-slate-500">Cognitive Bias</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 italic">&quot;I&apos;ve already ruined my diet by eating one cookie, so I might as well eat the whole box.&quot;</p>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="text-orange-500 font-bold tracking-widest uppercase mb-4 text-sm">Behavioral Science</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('streaks_psycho_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('streaks_psycho_desc')}</p>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{t('streaks_psycho_point1')}</h3>
                                    <p className="text-slate-500 text-sm">{t('streaks_psycho_point1_desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="text-indigo-500 font-bold tracking-widest uppercase mb-4 text-sm">Actionable Insights</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('streaks_data_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('streaks_data_desc')}</p>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl relative text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="font-bold">AI Friction Audit</div>
                                    <div className="text-xs bg-indigo-500 px-2 py-1 rounded">Completed</div>
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <span>&gt;</span>
                                        <span>Analyzing missed habit: &quot;Read 10 pages&quot;</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-red-400">
                                        <span>&gt;</span>
                                        <span>Correlation found: Budget exceeded yesterday.</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-green-400">
                                        <span>&gt;</span>
                                        <span>Solution: Stress causes habit drop. Adjust schedule.</span>
                                    </div>
                                </div>
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
                            <Link href="/compare/habitica" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-black">⚔️</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">vs Habitica</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_habitica_desc')}</p>
                            </Link>
                            <Link href="/compare/habitify" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">📱</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs Habitify</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_habitify_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Streaks Alternative
                        </h2>
                        <div className="space-y-4">
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
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 7: CTA */}
                <section className="py-[80px] bg-slate-50 text-center px-6 border-t border-slate-200">
                    <h2 className="text-4xl md:text-6xl text-slate-900 font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('streaks_cta_title') }} />
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-10">{t('streaks_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-indigo-600 text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 transition-transform">{t('streaks_cta_btn')}</Link>
                </section>
            </main>
        </GuestLayout>
    );
}
