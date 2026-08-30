'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function HabiticaComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_habitica_q1'),
            a: t('faq_habitica_a1')
        },
        {
            q: t('faq_habitica_q2'),
            a: t('faq_habitica_a2')
        },
        {
            q: 'Apakah ada sistem level atau experience point di sini?',
            a: 'Tidak. Kami percaya bahwa motivasi sejati harus datang dari dalam (intrinsik), bukan dari sekadar mengumpulkan poin atau XP virtual. Di Tranvas, level Anda adalah pencapaian nyata di dunia nyata.'
        }
    ];

    return (
        <GuestLayout>
            <main id="habitica-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-slate-950 relative border-b border-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(79,70,229,0.15)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-950"></div>
                    
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="mb-4">
                                <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_habitica')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/50 text-indigo-300 font-bold text-xs mb-8 uppercase tracking-wider border border-indigo-500/30">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                                {t('habitica_badge')}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                                {t('habitica_hero_title_1')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">{t('habitica_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('habitica_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] text-center">
                                    {t('habitica_hero_cta')}
                                </Link>
                                <p className="mt-4 text-xs text-slate-500 font-medium self-center sm:self-auto">{t('habitica_hero_note')}</p>
                            </div>
                        </div>

                        <div className="relative h-[400px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="absolute w-64 h-64 bg-red-500/20 rounded-full blur-3xl opacity-50"></div>
                            
                            <div className="relative flex items-center justify-center gap-8">
                                <div className="bg-slate-900 border-4 border-slate-800 rounded-2xl p-6 shadow-2xl transform -rotate-6 grayscale opacity-60">
                                    <div className="text-center font-mono text-red-500 mb-2">HP: 0</div>
                                    <div className="text-6xl text-center">🗡️</div>
                                    <div className="text-center font-mono text-slate-500 mt-2 text-xs">Game Over</div>
                                </div>

                                <div className="text-slate-700 text-4xl font-black">vs</div>

                                <div className="bg-indigo-900/40 border border-indigo-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.2)] transform rotate-3">
                                    <div className="text-center font-bold text-indigo-300 mb-2 uppercase tracking-widest text-xs">Identity</div>
                                    <div className="text-6xl text-center drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">🌱</div>
                                    <div className="text-center font-bold text-emerald-400 mt-4 text-sm">+1% Better Daily</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">🤢</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">
                                {t('habitica_prob_title_1')} <span className="text-red-600">{t('habitica_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('habitica_prob_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('habitica_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('habitica_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('habitica_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-900 p-8 rounded-3xl border-4 border-slate-800 shadow-2xl transform rotate-3">
                            <div className="text-center font-mono text-red-500 mb-4 animate-pulse">WARNING: LOW HP</div>
                            <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-6"><div className="h-full bg-red-500 w-[10%]"></div></div>
                            <p className="text-slate-400 font-mono text-sm text-center">"You forgot to drink water. You take 15 damage."</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-indigo-50">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-indigo-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl">🧘‍♂️</div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400">Identity Target</div>
                                    <div className="text-xl font-black text-slate-800">Healthy Human</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-3 bg-indigo-50 rounded-full w-full"></div>
                                <div className="h-3 bg-indigo-50 rounded-full w-4/5"></div>
                                <div className="h-3 bg-indigo-50 rounded-full w-5/6"></div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 text-slate-900">
                                {t('habitica_sol_title_1')} <span className="text-indigo-600">{t('habitica_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('habitica_sol_desc')}
                            </p>
                            <div className="grid gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{t('habitica_sol_1_title')}</h3>
                                    <p className="text-slate-500 text-sm">{t('habitica_sol_1_desc')}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{t('habitica_sol_2_title')}</h3>
                                    <p className="text-slate-500 text-sm">{t('habitica_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: TABLE */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('habitica_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('habitica_compare_desc')}</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-6 text-center font-black text-sm md:text-base uppercase tracking-widest">
                                <div className="text-left text-slate-400">Features</div>
                                <div className="text-slate-400">{t('habitica_table_head_2')}</div>
                                <div className="text-indigo-600">Tranvas</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700 text-sm md:text-base">{t('habitica_table_row_1_title')}</div>
                                <div className="text-slate-500 text-sm md:text-base">{t('habitica_table_row_1_col_1')}</div>
                                <div className="font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg text-sm md:text-base">{t('habitica_table_row_1_col_2')}</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700 text-sm md:text-base">{t('habitica_table_row_2_title')}</div>
                                <div className="text-red-500 text-sm md:text-base">{t('habitica_table_row_2_col_1')}</div>
                                <div className="font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg text-sm md:text-base">{t('habitica_table_row_2_col_2')}</div>
                            </div>
                            <div className="grid grid-cols-3 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700 text-sm md:text-base">{t('habitica_table_row_3_title')}</div>
                                <div className="text-slate-500 text-sm md:text-base">{t('habitica_table_row_3_col_1')}</div>
                                <div className="font-bold text-indigo-600 bg-indigo-50 py-2 rounded-lg text-sm md:text-base">{t('habitica_table_row_3_col_2')}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SCIENCE & TESTIMONIAL */}
                <section className="py-[80px] bg-slate-900 text-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="text-indigo-400 font-bold tracking-widest uppercase mb-4 text-sm">Research-Backed</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">{t('habitica_science_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">{t('habitica_science_desc')}</p>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="text-2xl mt-1">🧠</div>
                                        <div>
                                            <div className="font-bold text-xl">{t('habitica_science_point1')}</div>
                                            <div className="text-slate-400">{t('habitica_science_point1_desc')}</div>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="text-2xl mt-1">📉</div>
                                        <div>
                                            <div className="font-bold text-xl">{t('habitica_science_point2')}</div>
                                            <div className="text-slate-400">{t('habitica_science_point2_desc')}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-3xl opacity-20"></div>
                                <div className="bg-slate-800 p-10 rounded-3xl relative border border-slate-700">
                                    <div className="text-4xl text-indigo-400 mb-6">"</div>
                                    <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-slate-300 mb-8">{t('habitica_testimonial')}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-slate-300">Ex</div>
                                        <div>
                                            <div className="font-bold">Former Habitica User</div>
                                            <div className="text-sm text-slate-500">Switched to Tranvas</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] bg-gray-50 border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('explore_more_alt')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('explore_more_desc')}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Link href="/compare/streaks" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl font-black">🔗</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-orange-600 transition-colors">vs Streaks</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_streaks_desc')}</p>
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
                            FAQ - Habitica Alternative
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
                                        <div className="px-8 pb-8 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-[80px] bg-indigo-600 text-center px-6">
                    <h2 className="text-4xl md:text-6xl text-white font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('habitica_cta_title') }} />
                    <p className="text-indigo-200 text-xl mb-10">{t('habitica_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-white text-indigo-900 font-black px-10 py-4 rounded-xl shadow-2xl hover:scale-105 transition-transform">
                        {t('habitica_cta_btn')}
                    </Link>
                </section>
            </main>
        </GuestLayout>
    );
}
