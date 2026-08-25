'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function ClickUpComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_clickup_q1'),
            a: t('faq_clickup_a1')
        },
        {
            q: 'Apakah OneForMind cocok untuk tim besar?',
            a: 'OneForMind didesain khusus untuk individu (solo-preneurs, mahasiswa, profesional mandiri). Kami secara sadar tidak membangun fitur kolaborasi tim agar tidak mengorbankan kecepatan dan kesederhanaan personal.'
        },
        {
            q: 'Saya terbiasa dengan Gantt Chart, apakah ada di OneForMind?',
            a: 'Tidak. Berdasarkan data, tampilan timeline kompleks justru menambah kecemasan individu. Kami menggantinya dengan "Fokus Hari Ini" yang hanya menampilkan apa yang relevan saat ini.'
        }
    ];

    return (
        <GuestLayout>
            <main id="clickup-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Text Center, Floating Elements) */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-slate-950 relative border-b border-purple-900/50">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e511_1px,transparent_1px),linear-gradient(to_bottom,#4f46e511_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* Floating UI Fragments */}
                    <div className="absolute top-24 left-[5%] bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 shadow-xl blur-[2px] opacity-60 animate-[pulse_5s_infinite] -rotate-6">Gantt View</div>
                    <div className="absolute bottom-32 left-[10%] bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 shadow-xl blur-[1px] opacity-70 animate-[pulse_6s_infinite_1s] rotate-12">Custom Field 42</div>
                    <div className="absolute top-40 right-[8%] bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 shadow-xl blur-[2px] opacity-50 animate-[pulse_4s_infinite_2s] rotate-6">Sprint Points</div>
                    <div className="absolute bottom-24 right-[12%] bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-400 shadow-xl blur-[1px] opacity-80 animate-[pulse_7s_infinite_0.5s] -rotate-12">Dependencies</div>

                    <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="mb-4">
                            <span className="text-purple-400 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_clickup')}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs mb-8 uppercase tracking-wider border border-purple-500/30">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                            {t('clickup_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                            {t('clickup_hero_title_1')} <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{t('clickup_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl inline-block border border-slate-800" dangerouslySetInnerHTML={{ __html: t.raw('clickup_hero_desc') }} />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-purple-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-purple-500 transition-all shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] hover:-translate-y-1 transform">
                                {t('clickup_hero_cta')}
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 font-medium">{t('clickup_hero_note')}</p>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM (Feature Bloat) */}
                <section className="py-[80px] px-6 bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">🏗️</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('clickup_prob_title_1')} <span className="text-red-500">{t('clickup_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('clickup_prob_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('clickup_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('clickup_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('clickup_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-100 p-8 rounded-3xl border border-slate-300 shadow-xl relative">
                            <div className="flex gap-2 mb-4">
                                <div className="bg-white p-2 text-xs border border-slate-200 text-slate-400 rounded">Gantt View</div>
                                <div className="bg-white p-2 text-xs border border-slate-200 text-slate-400 rounded">Board View</div>
                                <div className="bg-white p-2 text-xs border border-slate-200 text-slate-400 rounded">Timeline View</div>
                                <div className="bg-white p-2 text-xs border border-slate-200 text-slate-400 rounded">+12 more</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                                <div className="font-bold text-sm">Create Task</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50 p-2 text-xs border border-slate-200 text-slate-400">Assignee</div>
                                    <div className="bg-slate-50 p-2 text-xs border border-slate-200 text-slate-400">Sprint Points</div>
                                    <div className="bg-slate-50 p-2 text-xs border border-slate-200 text-slate-400">Custom Field 1</div>
                                    <div className="bg-slate-50 p-2 text-xs border border-slate-200 text-slate-400">Dependencies</div>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-xs text-slate-500 italic">"I just wanted to remember to drink water..."</div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION (Simplicity) */}
                <section className="py-[80px] px-6 bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-slate-700 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">🧘</div>
                                <div className="font-bold text-2xl mb-2">Zero Configuration</div>
                                <p className="text-slate-400 text-sm">Sign up and start executing in 30 seconds. The layout is fixed because we already designed the optimal workflow.</p>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                                {t('clickup_sol_title_1')} <span className="text-purple-400">{t('clickup_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">
                                {t('clickup_sol_desc')}
                            </p>
                            <div className="grid gap-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('clickup_sol_1_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('clickup_sol_1_desc')}</p>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('clickup_sol_2_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('clickup_sol_2_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: PSYCHOLOGY & DATA */}
                <section className="py-[80px] px-6 bg-white overflow-hidden border-t border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
                            <div className="order-2 lg:order-1 relative">
                                <div className="absolute inset-0 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative z-10">
                                    <div className="text-4xl mb-4">😵</div>
                                    <h3 className="font-bold text-slate-900 mb-2">Analysis Paralysis</h3>
                                    <p className="text-slate-600 italic">"When a tool offers endless customization, users spend more energy customizing the tool than actually doing the work."</p>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="text-purple-500 font-bold tracking-widest uppercase mb-4 text-sm">Behavioral Science</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('clickup_psycho_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('clickup_psycho_desc')}</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="text-indigo-500 font-bold tracking-widest uppercase mb-4 text-sm">Holistic Design</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('clickup_data_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('clickup_data_desc')}</p>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl relative text-white border border-slate-800">
                                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-700">
                                    <div className="text-2xl">😊</div>
                                    <div>
                                        <div className="font-bold text-sm">Mood: Great</div>
                                        <div className="text-xs text-slate-400">Captured in Journal</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                                    <div className="text-2xl">💰</div>
                                    <div>
                                        <div className="font-bold text-sm">Budget: Healthy</div>
                                        <div className="text-xs text-slate-400">Captured in Finance OS</div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center text-xs text-purple-400 font-bold uppercase tracking-widest">Enterprise tools don't track this.</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('clickup_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('clickup_compare_desc')}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-6 text-slate-400 font-black uppercase tracking-widest text-sm">Feature</th>
                                        <th className="p-6 text-slate-400 font-black uppercase tracking-widest text-sm w-1/3">{t('clickup_table_head_2')}</th>
                                        <th className="p-6 text-purple-600 font-black uppercase tracking-widest text-sm w-1/3 bg-purple-50/50">OneForMind</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('clickup_table_row_1_title')}</td>
                                        <td className="p-6">{t('clickup_table_row_1_col_1')}</td>
                                        <td className="p-6 font-bold text-purple-600 bg-purple-50/50">{t('clickup_table_row_1_col_2')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('clickup_table_row_2_title')}</td>
                                        <td className="p-6 text-red-500">{t('clickup_table_row_2_col_1')}</td>
                                        <td className="p-6 font-bold text-purple-600 bg-purple-50/50">{t('clickup_table_row_2_col_2')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-800">{t('clickup_table_row_3_title')}</td>
                                        <td className="p-6 text-red-500">{t('clickup_table_row_3_col_1')}</td>
                                        <td className="p-6 font-bold text-purple-600 bg-purple-50/50">{t('clickup_table_row_3_col_2')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - ClickUp Alternative
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

                {/* SECTION 6: EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] px-6 bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-gray-900 mb-4">{t('explore_more_alt')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-gray-500">{t('explore_more_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Link href="/compare/todoist" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl font-black">📝</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-purple-600 transition-colors">vs Todoist</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_todoist_desc')}</p>
                            </Link>
                            <Link href="/compare/ticktick" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">✔️</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-purple-600 transition-colors">vs TickTick</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_ticktick_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: CTA */}
                <section className="py-[80px] px-6 bg-slate-950 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl text-white font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('clickup_cta_title') }} />
                        <p className="text-purple-200 text-xl mb-10">{t('clickup_cta_desc')}</p>
                        <Link href="/register" className="inline-block bg-purple-600 text-white font-black px-12 py-5 rounded-2xl shadow-[0_15px_30px_rgba(168,85,247,0.3)] hover:scale-105 hover:bg-purple-500 transition-all">{t('clickup_cta_btn')}</Link>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
