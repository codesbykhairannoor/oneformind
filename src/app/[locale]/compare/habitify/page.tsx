'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function HabitifyComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_habitify_q1'),
            a: t('faq_habitify_a1')
        },
        {
            q: 'Apakah bisa digunakan untuk kebiasaan harian, mingguan, atau bulanan?',
            a: 'Ya! Sistem kami dirancang untuk fleksibel dengan berbagai jadwal repetisi. Anda dapat mengatur kebiasaan harian, pada hari-hari tertentu dalam seminggu, atau frekuensi bulanan, semuanya akan terintegrasi ke dalam planner utama Anda.'
        },
        {
            q: 'Bagaimana Tranvas membantu jika saya sering lupa?',
            a: 'Karena kebiasaan, to-do list, dan agenda kalender Anda disatukan dalam satu layar planner yang sama, Anda tidak perlu lagi bolak-balik aplikasi. Pengingat Anda menjadi satu alur waktu yang koheren.'
        }
    ];

    return (
        <GuestLayout>
            <main id="habitify-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-white relative border-b border-indigo-100">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-transparent pointer-events-none"></div>
                    
                    {/* Floating Icons */}
                    <div className="absolute top-20 left-[10%] w-16 h-16 bg-white border border-slate-100 shadow-lg rounded-2xl flex items-center justify-center text-3xl animate-[bounce_4s_infinite] opacity-80 z-0 rotate-12">📅</div>
                    <div className="absolute bottom-20 left-[15%] w-12 h-12 bg-white border border-slate-100 shadow-lg rounded-full flex items-center justify-center text-2xl animate-[bounce_5s_infinite_0.5s] opacity-60 z-0 -rotate-12">🌱</div>
                    <div className="absolute top-32 right-[10%] w-20 h-20 bg-white border border-slate-100 shadow-xl rounded-[1.5rem] flex items-center justify-center text-4xl animate-[bounce_6s_infinite_1s] opacity-90 z-0 -rotate-6">🧠</div>
                    <div className="absolute bottom-32 right-[15%] w-14 h-14 bg-white border border-slate-100 shadow-md rounded-xl flex items-center justify-center text-2xl animate-[bounce_4.5s_infinite_0.2s] opacity-70 z-0 rotate-6">💰</div>

                    <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="mb-4">
                            <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_habitify')}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm">
                            {t('habitify_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            {t('habitify_hero_title_1')} <br/>
                            <span className="text-indigo-600">{t('habitify_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm rounded-xl p-4 inline-block" dangerouslySetInnerHTML={{ __html: t.raw('habitify_hero_desc') }} />
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-indigo-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:-translate-y-1 text-center">
                                {t('habitify_hero_cta')}
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-400 font-bold">{t('habitify_hero_note')}</p>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-slate-50 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">🏝️</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('habitify_prob_title_1')} <span className="text-red-500">{t('habitify_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('habitify_prob_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('habitify_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('habitify_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('habitify_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative text-center">
                            <div className="inline-block p-4 bg-slate-50 rounded-2xl border border-slate-100 text-3xl mb-4">📱</div>
                            <div className="font-bold text-slate-700 mb-2">Habit App</div>
                            <div className="text-sm text-slate-400 mb-8">(Doesn't know about your schedule)</div>
                            
                            <div className="h-px bg-red-200 w-full mb-8 relative">
                                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-red-500 uppercase">Wall of Friction</div>
                            </div>

                            <div className="inline-block p-4 bg-slate-50 rounded-2xl border border-slate-100 text-3xl mb-4">📅</div>
                            <div className="font-bold text-slate-700 mb-2">Calendar App</div>
                            <div className="text-sm text-slate-400">(Doesn't know about your habits)</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-indigo-600 p-12 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-black">🧬</div>
                            <h3 className="font-black text-3xl mb-8 relative z-10">The Unified Brain</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="text-2xl">⚡</div>
                                    <div>
                                        <div className="font-bold">Habits</div>
                                        <div className="text-xs text-indigo-200">Feeds the Planner</div>
                                    </div>
                                </div>
                                <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="text-2xl">📅</div>
                                    <div>
                                        <div className="font-bold">Planner</div>
                                        <div className="text-xs text-indigo-200">Schedules the Habits</div>
                                    </div>
                                </div>
                                <div className="bg-white/10 border border-white/20 p-4 rounded-xl flex items-center gap-4">
                                    <div className="text-2xl">💰</div>
                                    <div>
                                        <div className="font-bold">Finance OS</div>
                                        <div className="text-xs text-indigo-200">Tracks the outcome</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('habitify_sol_title_1')} <span className="text-indigo-600">{t('habitify_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('habitify_sol_desc')}
                            </p>
                            <div className="grid gap-6">
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-bold text-lg text-indigo-900 mb-2">{t('habitify_sol_1_title')}</h3>
                                    <p className="text-indigo-700 text-sm">{t('habitify_sol_1_desc')}</p>
                                </div>
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-bold text-lg text-indigo-900 mb-2">{t('habitify_sol_2_title')}</h3>
                                    <p className="text-indigo-700 text-sm">{t('habitify_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: TABLE */}
                <section className="py-[80px] bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('habitify_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('habitify_compare_desc')}</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-6 text-slate-400 font-black uppercase tracking-widest text-sm">Feature</th>
                                        <th className="p-6 text-slate-400 font-black uppercase tracking-widest text-sm w-1/3">{t('habitify_table_head_2')}</th>
                                        <th className="p-6 text-indigo-600 font-black uppercase tracking-widest text-sm w-1/3 bg-indigo-50/50">Tranvas</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800 text-sm md:text-base">{t('habitify_table_row_1_title')}</td>
                                        <td className="p-6 text-sm md:text-base">{t('habitify_table_row_1_col_1')}</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/50 text-sm md:text-base">{t('habitify_table_row_1_col_2')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800 text-sm md:text-base">{t('habitify_table_row_2_title')}</td>
                                        <td className="p-6 text-red-500 text-sm md:text-base">{t('habitify_table_row_2_col_1')}</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/50 text-sm md:text-base">{t('habitify_table_row_2_col_2')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-800 text-sm md:text-base">{t('habitify_table_row_3_title')}</td>
                                        <td className="p-6 text-sm md:text-base">{t('habitify_table_row_3_col_1')}</td>
                                        <td className="p-6 font-bold text-indigo-600 bg-indigo-50/50 text-sm md:text-base">{t('habitify_table_row_3_col_2')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* COST & AI */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                            <div className="bg-indigo-50 p-10 rounded-[3rem] text-center border border-indigo-100">
                                <div className="text-indigo-900 font-black text-6xl mb-4">$40/yr</div>
                                <div className="text-indigo-700 font-bold mb-8">Just for a checklist.</div>
                                <div className="flex justify-center text-3xl">💸</div>
                            </div>
                            <div>
                                <div className="text-red-500 font-bold tracking-widest uppercase mb-4 text-sm">The App Tax</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('habitify_cost_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('habitify_cost_desc')}</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1">
                                <div className="text-indigo-600 font-bold tracking-widest uppercase mb-4 text-sm">Beyond Charts</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('habitify_ai_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('habitify_ai_desc')}</p>
                            </div>
                            <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] shadow-2xl relative text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-white/20">✨</div>
                                <div className="text-xl font-medium leading-relaxed italic mb-6">"I noticed your 'Junk Food' spending spikes by 40% on days when you miss your 'Morning Run' habit. Let's adjust your routine."</div>
                                <div className="text-indigo-200 text-sm font-bold">- Neural OS Coach</div>
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
                            <Link href="/compare/habitica" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-black">⚔️</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">vs Habitica</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_habitica_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/streaks" className="group block bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl font-black">🔗</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-orange-600 transition-colors">vs Streaks</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_streaks_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Habitify Alternative
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
                <section className="py-[80px] bg-white text-center px-6">
                    <h2 className="text-4xl md:text-6xl text-slate-900 font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('habitify_cta_title') }} />
                    <p className="text-slate-500 text-xl mb-10 max-w-2xl mx-auto">{t('habitify_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-indigo-600 text-white font-black px-12 py-5 rounded-2xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:scale-105 hover:bg-indigo-700 transition-all">
                        {t('habitify_cta_btn')}
                    </Link>
                </section>
            </main>
        </GuestLayout>
    );
}
