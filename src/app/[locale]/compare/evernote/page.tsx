'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GuestLayout from '@/components/GuestLayout';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';

export default function EvernoteComparePage() {
    const t = useTranslations();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        {
            q: t('faq_evernote_q1'),
            a: t('faq_evernote_a1')
        },
        {
            q: 'Bisakah saya mengimport catatan lama dari Evernote?',
            a: 'Saat ini OneForMind dirancang sebagai tempat untuk catatan aktif ("Active Progress"), bukan gudang penyimpanan ("Dead Storage"). Kami merekomendasikan memulai dengan lembaran baru dan hanya memindahkan data yang benar-benar Anda butuhkan secara manual.'
        },
        {
            q: 'Apakah ada limit penyimpanan seperti Evernote?',
            a: 'Tidak ada limit ketat seperti batasan device atau limit harian, karena OneForMind berbasis teks murni (Markdown) yang sangat ringan. Anda bisa membuat notes sebanyak yang Anda mau.'
        }
    ];

    return (
        <GuestLayout>
            <main id="evernote-compare" className="overflow-x-hidden">
                {/* SECTION 1: HERO */}
                <header className="pt-32 pb-24 px-6 overflow-hidden bg-slate-50 relative border-b border-emerald-100">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="mb-4">
                                <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase opacity-70">{t('seo_eyebrow_evernote')}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mb-8 uppercase tracking-wider border border-emerald-200">
                                {t('evernote_badge')}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                {t('evernote_hero_title_1')} <br/>
                                <span className="text-emerald-600">{t('evernote_hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw('evernote_hero_desc') }} />
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link href="/register" className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 transform">
                                    {t('evernote_hero_cta')}
                                </Link>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 font-medium">{t('evernote_hero_note')}</p>
                        </div>

                        <div className="relative h-[400px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                            <div className="absolute w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative flex gap-6 items-center">
                                <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-md flex flex-col items-center gap-4 transform -rotate-6 grayscale opacity-60">
                                    <div className="text-5xl">🗄️</div>
                                    <div className="font-bold text-slate-500 text-sm">Dead Storage</div>
                                </div>
                                <div className="text-2xl font-black text-slate-300">VS</div>
                                <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 transform rotate-3">
                                    <div className="text-6xl drop-shadow-md">🚀</div>
                                    <div className="font-bold text-emerald-700">Active Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: THE PROBLEM */}
                <section className="py-[80px] px-6 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="relative h-[400px] flex items-center justify-center bg-slate-50 rounded-[3rem] border border-slate-100 p-8 overflow-hidden">
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 blur-[1px]">
                                    <div className="w-64 h-12 bg-white border border-slate-200 rounded-lg mb-2 shadow-sm transform -rotate-6 translate-x-4"></div>
                                    <div className="w-72 h-16 bg-white border border-slate-200 rounded-lg mb-2 shadow-sm transform rotate-3 -translate-x-2"></div>
                                    <div className="w-56 h-10 bg-white border border-slate-200 rounded-lg mb-2 shadow-sm transform -rotate-12 translate-x-8"></div>
                                    <div className="w-80 h-20 bg-white border border-slate-200 rounded-lg shadow-sm transform rotate-6 -translate-x-4"></div>
                                </div>
                                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 text-center z-10 w-full max-w-sm">
                                    <div className="text-4xl mb-4">📚</div>
                                    <div className="font-black text-slate-800 text-xl mb-2">{t('evernote_prob_visual_1')}</div>
                                    <div className="text-sm text-slate-500 font-medium mb-4">{t('evernote_prob_visual_2')}</div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                        <div className="bg-red-500 h-2 rounded-full w-0"></div>
                                    </div>
                                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest">{t('evernote_prob_visual_3')}</div>
                                </div>
                            </div>
                            
                            <div>
                                <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-6">
                                    {t('evernote_prob_title_1')} <span className="text-emerald-600">{t('evernote_prob_title_highlight')}</span>
                                </h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500 mb-8">
                                    {t('evernote_prob_desc')}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold shrink-0">✕</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t('evernote_prob_point_1_title')}</h4>
                                            <p className="text-sm text-slate-500">{t('evernote_prob_point_1_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold shrink-0">✕</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t('evernote_prob_point_2_title')}</h4>
                                            <p className="text-sm text-slate-500">{t('evernote_prob_point_2_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION */}
                <section className="py-[80px] px-6 bg-emerald-950 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="mb-6">
                                {t('evernote_sol_title_1')} <span className="text-emerald-400">{t('evernote_sol_title_highlight')}</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-400">
                                {t('evernote_sol_desc')}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-900 border border-emerald-900/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group">
                                <div className="w-14 h-14 bg-emerald-900/50 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🌱</div>
                                <h3 className="text-xl font-bold mb-3">{t('evernote_sol_point_1_title')}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{t('evernote_sol_point_1_desc')}</p>
                            </div>
                            <div className="bg-slate-900 border border-emerald-900/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group transform md:-translate-y-8">
                                <div className="w-14 h-14 bg-emerald-900/50 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">💰</div>
                                <h3 className="text-xl font-bold mb-3">{t('evernote_sol_point_2_title')}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{t('evernote_sol_point_2_desc')}</p>
                            </div>
                            <div className="bg-slate-900 border border-emerald-900/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors group">
                                <div className="w-14 h-14 bg-emerald-900/50 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">🎯</div>
                                <h3 className="text-xl font-bold mb-3">{t('evernote_sol_point_3_title')}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{t('evernote_sol_point_3_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: FEATURE COMPARISON TABLE */}
                <section className="py-[80px] px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-4">{t('evernote_table_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">{t('evernote_table_desc')}</p>
                        </div>
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-6 text-xs text-slate-500 uppercase tracking-widest w-1/3">{t('evernote_table_h1')}</th>
                                        <th className="p-6 text-xs text-slate-500 uppercase tracking-widest w-1/3">{t('evernote_table_h2')}</th>
                                        <th className="p-6 text-xs text-emerald-600 font-black uppercase tracking-widest w-1/3 bg-emerald-50/50">{t('evernote_table_h3')}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('evernote_table_r1_1')}</td>
                                        <td className="p-6 text-slate-500">{t('evernote_table_r1_2')}</td>
                                        <td className="p-6 font-bold text-emerald-600 bg-emerald-50/30">{t('evernote_table_r1_3')}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100">
                                        <td className="p-6 font-bold text-slate-800">{t('evernote_table_r2_1')}</td>
                                        <td className="p-6 text-slate-500">{t('evernote_table_r2_2')}</td>
                                        <td className="p-6 font-bold text-emerald-600 bg-emerald-50/30">{t('evernote_table_r2_3')}</td>
                                    </tr>
                                    <tr>
                                        <td className="p-6 font-bold text-slate-800">{t('evernote_table_r3_1')}</td>
                                        <td className="p-6 text-slate-500">{t('evernote_table_r3_2')}</td>
                                        <td className="p-6 font-bold text-emerald-600 bg-emerald-50/30">{t('evernote_table_r3_3')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: PSYCHOLOGY OF ACTION */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 mb-4">{t('evernote_psy_title')}</h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8 }} className="text-slate-500">
                                {t('evernote_psy_desc')}
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
                            <div className="absolute top-0 right-0 p-4 text-emerald-500 font-black text-4xl opacity-20">"</div>
                            <p className="font-medium text-slate-700 italic relative z-10 text-lg" dangerouslySetInnerHTML={{ __html: t.raw('evernote_psy_quote') }} />
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-[80px] px-6 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }} className="text-slate-900 text-center">
                            FAQ - Evernote Alternative
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full px-8 py-6 text-left font-black text-slate-900 flex justify-between items-center text-sm md:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} size={20} />
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

                {/* EXPLORE MORE ALTERNATIVES */}
                <section className="py-[80px] px-6 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                            <span className="text-slate-400 py-2">Compare Notes Apps:</span>
                            <Link href="/compare/evernote" className="text-emerald-600 font-bold py-2 px-4 rounded-lg bg-emerald-50">Evernote</Link>
                            <Link href="/compare/applenotes" className="text-slate-600 hover:text-amber-600 py-2 px-4 rounded-lg hover:bg-amber-50 transition">Apple Notes</Link>
                            <Link href="/compare/onenote" className="text-slate-600 hover:text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-50 transition">OneNote</Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 6: CTA */}
                <section className="py-[80px] px-6 bg-white text-center border-t border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">{t('evernote_cta_title')}</h2>
                        <Link href="/register" className="inline-block bg-emerald-600 text-white px-12 py-5 rounded-full text-xl hover:bg-emerald-700 transition transform hover:-translate-y-1 shadow-[0_20px_40px_rgba(16,185,129,0.3)] font-bold">
                            {t('evernote_cta_btn')}
                        </Link>
                    </div>
                </section>
            </main>
        </GuestLayout>
    );
}
