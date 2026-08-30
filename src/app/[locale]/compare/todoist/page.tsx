'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function TodoistComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_todoist_q1'),
            a: t('faq_todoist_a1'),
        },
        {
            q: 'Apakah Tranvas bisa menggantikan Todoist sebagai task manager utama?',
            a: 'Tergantung kebutuhan Anda. Jika Anda butuh task manager murni dengan fitur collaboration tim yang advanced, Todoist lebih cocok. Tapi jika Anda seorang individu yang ingin mengelola hidup secara holistik (tugas + kebiasaan + keuangan), Tranvas adalah pilihan yang jauh lebih komprehensif.',
        },
        {
            q: 'Kenapa Tranvas lebih baik dari Todoist untuk produktivitas personal?',
            a: 'Todoist hanya mencatat apa yang harus Anda lakukan. Tranvas menghubungkan apa yang Anda lakukan dengan tujuan besar Anda. Dengan time blocking terintegrasi, Anda tidak hanya punya daftar tugas — Anda punya jadwal yang realistis yang mempertimbangkan kebiasaan dan kapasitas Anda.',
        },
    ];

    return (
        <GuestLayout>
            <main id="todoist-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO (Dark Slate, Text Center, Visual Bottom) */}
                <header className="pt-32 pb-0 px-6 overflow-hidden bg-slate-900 relative border-b border-slate-800">
                    <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 mb-16">
                        <div className="mb-4">
                            <span className="text-red-400 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_todoist')}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-300 font-bold text-xs mb-8 uppercase tracking-wider border border-red-500/30">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                            {t('todoist_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
                            {t('todoist_hero_title_1')} <br/>
                            <span className="text-red-500">{t('todoist_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('todoist_hero_desc') }} />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-red-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-red-500 transition-all shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:shadow-[0_0_60px_rgba(239,68,68,0.5)] hover:-translate-y-1 transform">
                                {t('todoist_hero_cta')}
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 font-medium">{t('todoist_hero_note')}</p>
                    </div>

                    {/* Visual Bottom: Focus Timeline */}
                    <div className="max-w-4xl mx-auto relative z-10 translate-y-12 hover:translate-y-4 transition-transform duration-700 animate-in slide-in-from-bottom-24 fade-in duration-1000 delay-300">
                        <div className="bg-slate-800 border border-slate-700 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] p-8 md:p-12 overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-500/30 rounded-b-full"></div>
                            <div className="flex items-center gap-4 mb-8 justify-center">
                                <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-xl border border-red-500/30">🎯</div>
                                <div className="font-bold text-2xl text-white">Focus Timeline</div>
                            </div>
                            <div className="space-y-4 max-w-2xl mx-auto relative before:absolute before:inset-y-0 before:left-[4.5rem] before:w-0.5 before:bg-slate-700">
                                <div className="flex gap-6 items-center relative z-10">
                                    <div className="text-slate-400 font-mono w-16 text-right">09:00</div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-slate-800 absolute left-[4.15rem]"></div>
                                    <div className="bg-red-500 text-white p-4 rounded-2xl flex-1 font-bold shadow-lg shadow-red-500/20">Deep Work Block</div>
                                </div>
                                <div className="flex gap-6 items-center relative z-10 opacity-50">
                                    <div className="text-slate-500 font-mono w-16 text-right">11:00</div>
                                    <div className="w-3 h-3 bg-slate-600 rounded-full border-2 border-slate-800 absolute left-[4.15rem]"></div>
                                    <div className="bg-slate-700 text-slate-300 p-4 rounded-2xl flex-1">Emails &amp; Slack</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-white overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-red-200 font-black">📝</div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('todoist_prob_title_1')} <span className="text-red-500">{t('todoist_prob_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('todoist_prob_desc')}</p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('todoist_prob_point_1')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('todoist_prob_point_2')}</li>
                                <li className="flex items-center gap-4"><span className="text-red-500">✕</span> {t('todoist_prob_point_3')}</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl">
                            <div className="flex justify-between text-red-500 font-bold mb-4">
                                <span>Overdue (342)</span>
                            </div>
                            <div className="space-y-3 opacity-50 blur-2xl">
                                <div className="flex items-center gap-3"><input type="checkbox" disabled readOnly /> <span>Read book</span></div>
                                <div className="flex items-center gap-3"><input type="checkbox" disabled readOnly /> <span>Call mom</span></div>
                                <div className="flex items-center gap-3"><input type="checkbox" disabled readOnly /> <span>Build app</span></div>
                                <div className="flex items-center gap-3"><input type="checkbox" disabled readOnly /> <span>Buy groceries</span></div>
                                <div className="flex items-center gap-3"><input type="checkbox" disabled readOnly /> <span>Fix car</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                        <div className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl border border-slate-700">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">📅</div>
                                <div className="font-bold text-xl">Today&apos;s Timeline</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="text-slate-500 font-mono w-16 text-right">09:00</div>
                                    <div className="bg-indigo-500 text-white p-3 rounded-lg flex-1 font-bold">Deep Work Block</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-slate-500 font-mono w-16 text-right">11:00</div>
                                    <div className="bg-slate-700 text-slate-300 p-3 rounded-lg flex-1">Emails &amp; Slack</div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="text-slate-500 font-mono w-16 text-right">13:00</div>
                                    <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 p-3 rounded-lg flex-1 font-bold">Gym (Habit)</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 leading-tight">
                                {t('todoist_sol_title_1')} <span className="text-red-400">{t('todoist_sol_title_highlight')}</span>.
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">{t('todoist_sol_desc')}</p>
                            <div className="grid gap-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('todoist_sol_1_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('todoist_sol_1_desc')}</p>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                    <h3 className="font-bold text-lg text-white mb-2">{t('todoist_sol_2_title')}</h3>
                                    <p className="text-slate-400 text-sm">{t('todoist_sol_2_desc')}</p>
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
                                <div className="bg-red-50 p-8 rounded-3xl border border-red-100 shadow-sm relative z-10">
                                    <div className="text-3xl mb-4">🤯</div>
                                    <h3 className="font-bold text-red-900 mb-2">Zeigarnik Effect in Action</h3>
                                    <p className="text-red-700 text-sm leading-relaxed">Having 50 open tasks in a list means your brain keeps 50 background tabs open. Time-blocking closes the tabs because your brain knows exactly WHEN the task will be handled.</p>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <div className="text-red-500 font-bold tracking-widest uppercase mb-4 text-sm">Behavioral Science</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('todoist_psycho_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('todoist_psycho_desc')}</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="text-indigo-500 font-bold tracking-widest uppercase mb-4 text-sm">System Design</div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('todoist_data_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">{t('todoist_data_desc')}</p>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl relative text-white border border-slate-800">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800 p-4 rounded-xl text-center border border-slate-700">
                                        <div className="text-3xl mb-2">📝</div>
                                        <div className="font-bold text-sm">One-off Tasks</div>
                                        <div className="text-xs text-slate-400 mt-1">Planner</div>
                                    </div>
                                    <div className="bg-indigo-600 p-4 rounded-xl text-center shadow-lg shadow-indigo-500/20">
                                        <div className="text-3xl mb-2">🔄</div>
                                        <div className="font-bold text-sm">Daily Habits</div>
                                        <div className="text-xs text-indigo-200 mt-1">Habit Engine</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('todoist_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('todoist_compare_desc')}</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-6 text-center font-black text-sm uppercase tracking-widest">
                                <div className="text-left text-slate-400">Features</div>
                                <div className="text-slate-400">{t('todoist_table_head_2')}</div>
                                <div className="text-red-600">Tranvas</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700">{t('todoist_table_row_1_title')}</div>
                                <div className="text-slate-500">{t('todoist_table_row_1_col_1')}</div>
                                <div className="font-bold text-red-600 bg-red-50 py-2 rounded-lg">{t('todoist_table_row_1_col_2')}</div>
                            </div>
                            <div className="grid grid-cols-3 border-b border-slate-100 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700">{t('todoist_table_row_2_title')}</div>
                                <div className="text-slate-500">{t('todoist_table_row_2_col_1')}</div>
                                <div className="font-bold text-red-600 bg-red-50 py-2 rounded-lg">{t('todoist_table_row_2_col_2')}</div>
                            </div>
                            <div className="grid grid-cols-3 p-6 text-center items-center">
                                <div className="text-left font-bold text-slate-700">{t('todoist_table_row_3_title')}</div>
                                <div className="text-slate-500">{t('todoist_table_row_3_col_1')}</div>
                                <div className="font-bold text-red-600 bg-red-50 py-2 rounded-lg">{t('todoist_table_row_3_col_2')}</div>
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
                            <Link href="/compare/ticktick" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-black">✔️</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-red-600 transition-colors">vs TickTick</h3>
                                </div>
                                <p className="text-gray-500 text-sm">{t('explore_ticktick_desc')}</p>
                            </Link>
                            <Link href="/compare/clickup" className="group block bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-black">🏢</div>
                                    <h3 className="font-black text-xl text-gray-900 group-hover:text-red-600 transition-colors">vs ClickUp</h3>
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
                            FAQ - Todoist Alternative
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-red-600' : 'text-slate-400'}`} size={20} />
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
                <section className="py-[80px] bg-slate-900 text-center px-6">
                    <h2 className="text-4xl md:text-6xl text-white font-black mb-6" dangerouslySetInnerHTML={{ __html: t.raw('todoist_cta_title') }} />
                    <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-10">{t('todoist_cta_desc')}</p>
                    <Link href="/register" className="inline-block bg-red-600 text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-red-900/50 hover:scale-105 hover:bg-red-500 transition-transform">{t('todoist_cta_btn')}</Link>
                </section>
            </main>
        </GuestLayout>
    );
}
