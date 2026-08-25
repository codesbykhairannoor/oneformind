'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function TickTickComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_ticktick_q1'),
            a: t('faq_ticktick_a1'),
        },
        {
            q: 'Apakah OneForMind juga memiliki Pomodoro timer seperti TickTick?',
            a: 'Saat ini OneForMind berfokus pada integrasi antara habit, planner, dan finance. Fitur Pomodoro belum tersedia, namun Anda bisa menggunakan time blocking di planner untuk menciptakan sesi deep work yang terstruktur — yang justru lebih fleksibel dari timer kaku.',
        },
        {
            q: 'Apa perbedaan utama antara OneForMind dan TickTick dalam hal manajemen tugas?',
            a: 'TickTick adalah task manager murni yang sangat baik dalam daftar tugas dan sub-tugas. OneForMind berbeda karena ia menghubungkan tugas harian ke kebiasaan dan tujuan besar. Setiap tugas di OneForMind bisa dikaitkan langsung dengan goal hidup Anda, sehingga Anda selalu tahu MENGAPA Anda melakukan sesuatu.',
        },
    ];

    return (
        <GuestLayout>
            <main id="ticktick-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Text Left, Visual Right) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-white relative border-b border-indigo-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-transparent pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="mb-4">
                                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_ticktick')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-8 uppercase tracking-wider shadow-sm border border-blue-200">
                                {t('ticktick_badge')}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {t('ticktick_hero_title_1')} <br/>
                                <span className="text-blue-600">{t('ticktick_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('ticktick_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-blue-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1">
                                    {t('ticktick_hero_cta')}
                                </Link>
                                <p className="mt-4 text-xs text-slate-400 font-bold self-center sm:self-auto">{t('ticktick_hero_note')}</p>
                            </div>
                        </div>

                        <div className="relative h-[400px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative flex flex-col gap-6">
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 shadow-md flex items-center gap-6 transform -rotate-2 hover:rotate-0 transition-transform">
                                    <div className="text-5xl animate-[spin_4s_linear_infinite]">🐹</div>
                                    <div>
                                        <div className="font-bold text-slate-700">Endless Tasks</div>
                                        <div className="text-xs text-slate-500">Checking boxes, going nowhere.</div>
                                    </div>
                                </div>
                                <div className="text-center font-black text-slate-300">VS</div>
                                <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-2xl flex items-center gap-6 transform rotate-2 hover:rotate-0 transition-transform relative">
                                    <div className="text-5xl drop-shadow-md">⛰️</div>
                                    <div>
                                        <div className="font-bold text-blue-700">Vision Alignment</div>
                                        <div className="text-xs text-blue-500 font-medium">Every task climbs the mountain.</div>
                                    </div>
                                    <div className="absolute -right-4 -top-4 w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl shadow-lg border border-emerald-200">✨</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-slate-50 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">🏃</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('ticktick_prob_title_1')} <span className="text-red-500">{t('ticktick_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('ticktick_prob_desc')}</p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('ticktick_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('ticktick_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span> {t('ticktick_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative text-center group">
                            <div className="text-6xl mb-4 group-hover:animate-spin">🐹</div>
                            <div className="font-bold text-slate-700 text-xl mb-2">The Hamster Wheel</div>
                            <p className="text-slate-500 text-sm">Running fast but going nowhere. 15 tasks completed today, but none of them moved the needle on your life goals.</p>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-blue-600 text-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-blue-800 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-blue-700">
                            <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl font-black">⛰️</div>
                            <div className="space-y-2 relative z-10 text-center">
                                <div className="bg-blue-500 text-white p-4 rounded-xl border border-blue-400 font-black shadow-lg">Goal: Financial Freedom</div>
                                <div className="text-blue-300">⬇</div>
                                <div className="bg-blue-600 text-white p-3 rounded-xl border border-blue-500 font-bold mx-8">Habit: No Eating Out</div>
                                <div className="text-blue-300">⬇</div>
                                <div className="bg-blue-700 text-white p-2 rounded-xl border border-blue-600 mx-16 text-sm">Task: Meal Prep Sunday</div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 leading-tight">
                                {t('ticktick_sol_title_1')} <span className="text-blue-300">{t('ticktick_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-blue-100 mb-8 leading-relaxed">{t('ticktick_sol_desc')}</p>
                            <div className="grid gap-6">
                                <div className="bg-blue-700/50 p-6 rounded-2xl border border-blue-500/50">
                                    <h3 className="font-bold text-lg mb-2">{t('ticktick_sol_1_title')}</h3>
                                    <p className="text-blue-200 text-sm">{t('ticktick_sol_1_desc')}</p>
                                </div>
                                <div className="bg-blue-700/50 p-6 rounded-2xl border border-blue-500/50">
                                    <h3 className="font-bold text-lg mb-2">{t('ticktick_sol_2_title')}</h3>
                                    <p className="text-blue-200 text-sm">{t('ticktick_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: PSYCHOLOGY & DATA */}
                <section className="py-[80px] bg-white overflow-hidden border-t border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 mb-[80px] items-center">
                            <div className="order-2 lg:order-1 relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative z-10">
                                    <div className="text-4xl mb-4">🧭</div>
                                    <h3 className="font-bold text-slate-900 mb-2">Meaning &gt; Activity</h3>
                                    <p className="text-slate-600 italic">&quot;He who has a &apos;why&apos; to live for can bear almost any &apos;how&apos;.&quot; - Nietzsche. When you know why you&apos;re doing a task, you&apos;re 80% more likely to finish it.</p>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">Behavioral Science</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('ticktick_psycho_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('ticktick_psycho_desc')}</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="text-indigo-500 font-bold tracking-widest uppercase mb-4 text-sm">Premium Experience</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('ticktick_data_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('ticktick_data_desc')}</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-3xl shadow-lg border border-slate-200 text-center">
                                <div className="inline-block bg-white p-4 rounded-full shadow-md mb-6 border border-slate-100 text-3xl">🧘</div>
                                <div className="font-bold text-slate-800 text-xl mb-2">A Digital Sanctuary</div>
                                <p className="text-slate-500 text-sm">No cluttered menus. No ads. Just a calm space to do your best work.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('ticktick_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('ticktick_compare_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl border border-slate-200 bg-white opacity-80">
                                <h3 className="font-black text-slate-400 uppercase tracking-widest mb-8 text-center">{t('ticktick_table_head_2')}</h3>
                                <ul className="space-y-6">
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('ticktick_table_row_1_title')}</div>
                                        <div className="text-slate-700">{t('ticktick_table_row_1_col_1')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('ticktick_table_row_2_title')}</div>
                                        <div className="text-slate-700">{t('ticktick_table_row_2_col_1')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">{t('ticktick_table_row_3_title')}</div>
                                        <div className="text-slate-700">{t('ticktick_table_row_3_col_1')}</div>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-8 rounded-3xl border-2 border-blue-500 bg-white shadow-xl shadow-blue-100 relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">OneForMind</div>
                                <ul className="space-y-6 mt-4">
                                    <li>
                                        <div className="text-xs text-blue-500 font-bold uppercase mb-1">{t('ticktick_table_row_1_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('ticktick_table_row_1_col_2')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-blue-500 font-bold uppercase mb-1">{t('ticktick_table_row_2_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('ticktick_table_row_2_col_2')}</div>
                                    </li>
                                    <li>
                                        <div className="text-xs text-blue-500 font-bold uppercase mb-1">{t('ticktick_table_row_3_title')}</div>
                                        <div className="text-slate-900 font-bold">{t('ticktick_table_row_3_col_2')}</div>
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
                            <Link href="/compare/todoist" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl font-black">📝</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs Todoist</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_todoist_desc')}</p>
                            </Link>
                            <Link href="/compare/clickup" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">🏢</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-blue-600 transition-colors">vs ClickUp</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_clickup_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - TickTick Alternative
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
                <section className="py-[80px] bg-blue-600 text-center px-6">
                    <h2 className="text-4xl md:text-6xl text-white font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('ticktick_cta_title') }} />
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-blue-200 mb-10 max-w-2xl mx-auto">{t('ticktick_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-white text-blue-900 font-black px-12 py-5 rounded-2xl shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:scale-105 hover:bg-blue-50 transition-all">{t('ticktick_cta_btn')}</Link>
                </section>
            </main>
        </GuestLayout>
    );
}
