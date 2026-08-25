'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function MondayComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_monday_q1'),
            a: t('faq_monday_a1')
        },
        {
            q: 'Apakah OneForMind cocok untuk manajemen tim atau kolaborasi?',
            a: 'Saat ini, OneForMind difokuskan 100% pada produktivitas individual (Personal OS). Kami percaya bahwa sebelum bisa memimpin orang lain, Anda harus bisa memimpin diri sendiri. Kami tidak memiliki fitur kolaborasi tim yang rumit.'
        },
        {
            q: 'Saya terbiasa dengan Kanban dan Gantt chart, apakah OneForMind memilikinya?',
            a: 'OneForMind sengaja tidak menggunakan tampilan manajemen proyek kompleks seperti Kanban board atau Gantt chart. Kami merampingkan semuanya menjadi satu sistem tugas, kebiasaan, dan keuangan harian yang bisa Anda proses secara linier dan terfokus.'
        }
    ];

    return (
        <GuestLayout>
            <main id="monday-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 bg-slate-50 relative overflow-hidden border-b border-slate-200">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="order-2 lg:order-1 relative h-[400px] lg:h-[500px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
                            <div className="relative w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl">👤</div>
                                    <div>
                                        <div className="font-bold text-slate-900">Personal Growth</div>
                                        <div className="text-sm text-slate-500">Not a corporate sprint</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-500"></div>
                                        <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 gap-3">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500"></div>
                                        <div className="w-2/3 h-4 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 text-left">
                            <div className="mb-4">
                                <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_monday')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-600 font-bold text-xs mb-8 uppercase tracking-wider border border-slate-200 shadow-sm">
                                👔 {t('monday_badge')}
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {t('monday_hero_title_1')} <br/>
                                <span className="text-indigo-600">{t('monday_hero_title_2')}</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg" dangerouslySetInnerHTML={{ __html: t.raw('monday_hero_desc') }} />
                            
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-1 text-center w-full sm:w-auto">
                                    {t('monday_hero_cta')}
                                </Link>
                                <span className="text-sm text-slate-500 font-medium py-4 self-center sm:self-auto">{t('monday_hero_note')}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] bg-slate-800 border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 text-sm font-medium">
                            <span className="text-slate-400 py-2">Compare with:</span>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/compare/monday" className="text-indigo-400 hover:text-indigo-300 py-2 px-4 rounded-lg hover:bg-slate-700 transition">Monday.com</Link>
                                <Link href="/compare/trello" className="text-indigo-400 hover:text-indigo-300 py-2 px-4 rounded-lg hover:bg-slate-700 transition">Trello</Link>
                                <Link href="/compare/asana" className="text-indigo-400 hover:text-indigo-300 py-2 px-4 rounded-lg hover:bg-slate-700 transition">Asana</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('monday_prob_title_1')} <span className="text-indigo-600">{t('monday_prob_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-600 mb-8">{t('monday_prob_desc')}</p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</div>
                                    {t('monday_prob_point_1')}
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</div>
                                    {t('monday_prob_point_2')}
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</div>
                                    {t('monday_prob_point_3')}
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-100 rounded-full blur-2xl"></div>
                            <div className="relative z-10 space-y-4 opacity-50 grayscale">
                                <div className="h-12 bg-white rounded-lg border border-slate-200 w-full"></div>
                                <div className="h-12 bg-white rounded-lg border border-slate-200 w-5/6"></div>
                                <div className="h-12 bg-white rounded-lg border border-slate-200 w-4/6"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <div className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-red-600 border border-red-100 rotate-12">
                                    SYSTEM OVERLOAD
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] bg-indigo-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                {t('monday_sol_title_1')} <span className="text-indigo-600">{t('monday_sol_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-600">{t('monday_sol_desc')}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl mb-6 shadow-indigo-200 shadow-lg">✨</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('monday_sol_1_title')}</h3>
                                <p className="text-slate-600">{t('monday_sol_1_desc')}</p>
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl mb-6 shadow-indigo-200 shadow-lg">⚡</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('monday_sol_2_title')}</h3>
                                <p className="text-slate-600">{t('monday_sol_2_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: FEATURE COMPARISON */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-4">{t('monday_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('monday_compare_desc')}</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b-2 border-slate-100 text-slate-500 font-medium w-1/3">Feature</th>
                                        <th className="p-4 border-b-2 border-slate-100 text-slate-400 font-medium w-1/3">{t('monday_table_head_2')}</th>
                                        <th className="p-4 border-b-2 border-indigo-600 text-indigo-600 font-black text-lg w-1/3 bg-indigo-50/50 rounded-t-xl">OneForMind</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-700">
                                    <tr className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-4 border-b border-slate-100 font-semibold">{t('monday_table_row_1_title')}</td>
                                        <td className="p-4 border-b border-slate-100 text-slate-500">{t('monday_table_row_1_col_1')}</td>
                                        <td className="p-4 border-b border-indigo-100 font-bold text-indigo-700 bg-indigo-50/50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-indigo-500">✓</span> {t('monday_table_row_1_col_2')}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-4 border-b border-slate-100 font-semibold">{t('monday_table_row_2_title')}</td>
                                        <td className="p-4 border-b border-slate-100 text-slate-500">{t('monday_table_row_2_col_1')}</td>
                                        <td className="p-4 border-b border-indigo-100 font-bold text-indigo-700 bg-indigo-50/50">
                                            <div className="flex items-center gap-2">
                                                <span className="text-indigo-500">✓</span> {t('monday_table_row_2_col_2')}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-4 border-b border-slate-100 font-semibold">{t('monday_table_row_3_title')}</td>
                                        <td className="p-4 border-b border-slate-100 text-slate-500">{t('monday_table_row_3_col_1')}</td>
                                        <td className="p-4 border-b border-indigo-100 font-bold text-indigo-700 bg-indigo-50/50 rounded-b-xl">
                                            <div className="flex items-center gap-2">
                                                <span className="text-indigo-500">✓</span> {t('monday_table_row_3_col_2')}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: THE PSYCHOLOGY */}
                <section className="py-[80px] bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700">
                                <h3 className="text-2xl font-bold mb-4 text-indigo-400">{t('monday_psycho_title')}</h3>
                                <p className="text-slate-300 leading-relaxed">{t('monday_psycho_desc')}</p>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">{t('monday_data_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400">{t('monday_data_desc')}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Monday.com Alternative
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

                {/* SECTION 6: CTA */}
                <section className="py-[80px] bg-white text-center">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: t.raw('monday_cta_title') }} />
                        <p className="text-xl text-slate-500 mb-10">{t('monday_cta_desc')}</p>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-600/30 transition transform hover:-translate-y-1">
                            {t('monday_cta_btn')}
                        </Link>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
