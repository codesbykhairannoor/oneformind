'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function NotesAppsComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_evernote_q1'),
            a: t('faq_evernote_a1')
        },
        {
            q: 'Bisakah Tranvas menggantikan aplikasi catatan saya yang sudah ada?',
            a: 'Tranvas tidak dirancang sebagai tempat penyimpanan dokumen panjang atau wiki. Kami adalah sistem operasi harian (Personal OS). Sangat disarankan Anda tetap menyimpan aplikasi catatan lama (seperti Obsidian atau Notion) sebagai "lemari arsip" (Second Brain), sedangkan Tranvas digunakan sebagai "meja kerja" harian Anda.'
        },
        {
            q: 'Apakah saya bisa membuat folder bertingkat untuk catatan saya?',
            a: 'Tidak. Tranvas menggunakan struktur harian yang datar. Setiap hari Anda mendapat satu halaman kosong, dan Anda didorong untuk membersihkannya di akhir hari (Daily Review). Ini mencegah penumpukan catatan usang yang membebani pikiran Anda.'
        }
    ];

    return (
        <GuestLayout>
            <main id="notes-apps-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-slate-50 relative border-b border-slate-200">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>
                    <div className="max-w-4xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-700 font-bold text-xs mb-8 uppercase tracking-wider border border-slate-300 shadow-sm">
                            {t('notes_apps_badge')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            {t('notes_apps_hero_title_1')} <br/>
                            <span className="text-indigo-600 underline decoration-wavy decoration-indigo-200">{t('notes_apps_hero_title_2')}</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('notes_apps_hero_desc') }} />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register" className="w-full sm:w-auto bg-slate-900 text-white font-bold px-10 py-5 rounded-2xl hover:bg-indigo-600 transition-colors shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1 transform">
                                {t('notes_apps_hero_cta')}
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-slate-400 font-medium">{t('notes_apps_hero_note')}</p>
                    </div>
                </header>

                {/* SECTION 2: EXPLORE ALTERNATIVES */}
                <section className="py-[80px] bg-white border-b border-slate-100">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-4">Compare Head-to-Head</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/compare/evernote" className="group block bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-2xl font-black mb-4">🐘</div>
                                <h3 className="font-black text-xl text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">vs Evernote</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{t('explore_evernote_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/applenotes" className="group block bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-2xl font-black mb-4">📝</div>
                                <h3 className="font-black text-xl text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">vs Apple Notes</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{t('explore_applenotes_desc')}</p>
                            </Link>
                            
                            <Link href="/compare/onenote" className="group block bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl font-black mb-4">📓</div>
                                <h3 className="font-black text-xl text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">vs OneNote</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{t('explore_onenote_desc')}</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE PROBLEM */}
                <section className="py-[80px] bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative h-[400px] flex items-center justify-center bg-slate-50 rounded-[3rem] border border-slate-100 p-8">
                            <div className="absolute w-full h-full flex flex-col gap-4 overflow-hidden opacity-50 p-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-16 translate-x-4"></div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-24 -translate-x-4"></div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-16 translate-x-8"></div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-32 -translate-x-2"></div>
                            </div>
                            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 text-center z-10 rotate-3">
                                <div className="text-4xl mb-4">🗑️</div>
                                <div className="font-black text-slate-800">Untitled Note (14)</div>
                                <div className="text-xs text-slate-400 mt-2">Last edited: 2 years ago</div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6 leading-tight">
                                {t('notes_apps_prob_title_1')} <span className="text-red-500 decoration-red-200 underline decoration-4 underline-offset-4">{t('notes_apps_prob_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                {t('notes_apps_prob_desc')}
                            </p>
                            <ul className="space-y-4 font-bold text-slate-600">
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                    {t('notes_apps_prob_point_1')}
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                    {t('notes_apps_prob_point_2')}
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">✕</span>
                                    {t('notes_apps_prob_point_3')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: THE SOLUTION */}
                <section className="py-[80px] bg-slate-950 text-white">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6 leading-tight">
                                {t('notes_apps_sol_title_1')} <span className="text-indigo-400">{t('notes_apps_sol_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400 mb-8">
                                {t('notes_apps_sol_desc')}
                            </p>
                            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                                <p className="text-white font-bold mb-2">💡 {t('notes_apps_sol_box_title')}</p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {t('notes_apps_sol_box_desc')}
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[400px] flex items-center justify-center">
                            <div className="absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl opacity-50"></div>
                            <div className="grid grid-cols-2 gap-4 relative z-10 w-full max-w-sm">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center transform -translate-y-4">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <div className="font-bold text-sm">Goal Tracked</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center transform translate-y-4">
                                    <div className="text-3xl mb-2">💰</div>
                                    <div className="font-bold text-sm">Budget Met</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center transform -translate-y-4">
                                    <div className="text-3xl mb-2">🌱</div>
                                    <div className="font-bold text-sm">Habit Built</div>
                                </div>
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center transform translate-y-4">
                                    <div className="text-3xl mb-2">📅</div>
                                    <div className="font-bold text-sm">Day Planned</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TABLE */}
                <section className="py-[80px] bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">{t('notes_apps_compare_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('notes_apps_compare_desc')}</p>
                        </div>
                        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/50 border-b border-slate-200">
                                        <th className="p-8 text-xs text-slate-500 uppercase tracking-widest w-1/3">{t('notes_apps_table_head_1')}</th>
                                        <th className="p-8 text-xs text-slate-500 uppercase tracking-widest w-1/3">{t('notes_apps_table_head_2')}</th>
                                        <th className="p-8 text-xs text-indigo-600 font-black uppercase tracking-widest w-1/3 bg-indigo-50/50">{t('notes_apps_table_head_3')}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-8 font-bold text-slate-800">{t('notes_apps_table_row_1_title')}</td>
                                        <td className="p-8 text-slate-500">{t('notes_apps_table_row_1_col_1')}</td>
                                        <td className="p-8 font-bold text-indigo-600 bg-indigo-50/30">{t('notes_apps_table_row_1_col_2')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-8 font-bold text-slate-800">{t('notes_apps_table_row_2_title')}</td>
                                        <td className="p-8 text-slate-500">{t('notes_apps_table_row_2_col_1')}</td>
                                        <td className="p-8 font-bold text-indigo-600 bg-indigo-50/30">{t('notes_apps_table_row_2_col_2')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-8 font-bold text-slate-800">{t('notes_apps_table_row_3_title')}</td>
                                        <td className="p-8 text-slate-500">{t('notes_apps_table_row_3_col_1')}</td>
                                        <td className="p-8 font-bold text-indigo-600 bg-indigo-50/30">{t('notes_apps_table_row_3_col_2')}</td>
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
                            FAQ - Notes Apps Alternative
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
                <section className="py-[80px] bg-white text-center border-t border-slate-100">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">Stop hoarding.<br/>Start executing.</h2>
                        <Link href="/register" className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full text-xl hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-[0_20px_40px_rgba(79,70,229,0.3)] font-bold">
                            Get Started Free
                        </Link>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
